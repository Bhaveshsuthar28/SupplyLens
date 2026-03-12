"""
app/routers/auth.py

POST /auth/exchange  — verify Clerk JWT → issue access + refresh tokens
POST /auth/refresh   — use refresh token cookie → new access token
POST /auth/logout    — revoke refresh token
GET  /auth/me        — return current user info (requires access token)
"""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import (
    CurrentUser,
    create_access_token,
    create_refresh_token,
    hash_token,
    verify_access_token,
    verify_clerk_token,
)
from app.database import get_db
from app.models.refresh_token import RefreshToken
from app.schemas.auth import ExchangeResponse, RefreshResponse, UserInfo

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["Auth"])

# Refresh token cookie name
_COOKIE = "supplylens_refresh"


def _set_refresh_cookie(response: Response, raw_token: str) -> None:
    response.set_cookie(
        key=_COOKIE,
        value=raw_token,
        httponly=True,
        samesite="lax",
        secure=settings.app_env != "development",  # True in production (requires HTTPS)
        max_age=settings.refresh_token_expire_days * 86400,
        path="/auth",
    )


# ── POST /auth/exchange ───────────────────────────────────────────────────────

bearer = HTTPBearer()


@router.post("/exchange", response_model=ExchangeResponse)
def exchange(
    response: Response,
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    """
    Accepts a Clerk session token in the Authorization header.
    Returns an access token (body) and sets a refresh token cookie.
    """
    clerk_payload = verify_clerk_token(credentials.credentials)

    user_id: str = clerk_payload.get("sub", "")
    email: str = (
        clerk_payload.get("email")
        or clerk_payload.get("email_address")
        or clerk_payload.get("primary_email_address_id", "")
        or ""
    )

    if not user_id:
        raise HTTPException(status_code=400, detail="Clerk token missing sub claim")

    # Generate our tokens
    access_token = create_access_token(user_id, email)
    raw_refresh, hashed_refresh = create_refresh_token()

    # Store hashed refresh token in DB
    expires = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    db_token = RefreshToken(
        token_hash=hashed_refresh,
        user_id=user_id,
        email=email,
        expires_at=expires,
    )
    db.add(db_token)
    db.commit()

    _set_refresh_cookie(response, raw_refresh)

    return ExchangeResponse(
        access_token=access_token,
        expires_in=settings.access_token_expire_minutes * 60,
        user_id=user_id,
        email=email,
    )


# ── POST /auth/refresh ────────────────────────────────────────────────────────

@router.post("/refresh", response_model=RefreshResponse)
def refresh(
    response: Response,
    supplylens_refresh: str = Cookie(default=None),
    db: Session = Depends(get_db),
):
    """Uses the httpOnly refresh cookie to issue a new access token."""
    if not supplylens_refresh:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )

    token_hash = hash_token(supplylens_refresh)
    db_token: RefreshToken | None = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked == False,  # noqa: E712
        )
        .first()
    )

    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token invalid or revoked",
        )

    if db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        db_token.revoked = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired",
        )

    # Rotate the refresh token
    raw_new, hashed_new = create_refresh_token()
    db_token.revoked = True
    new_token = RefreshToken(
        token_hash=hashed_new,
        user_id=db_token.user_id,
        email=db_token.email,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(new_token)
    db.commit()

    access_token = create_access_token(db_token.user_id, db_token.email)
    _set_refresh_cookie(response, raw_new)

    return RefreshResponse(
        access_token=access_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


# ── POST /auth/logout ─────────────────────────────────────────────────────────

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    supplylens_refresh: str = Cookie(default=None),
    db: Session = Depends(get_db),
):
    """Revokes the refresh token and clears the cookie."""
    if supplylens_refresh:
        token_hash = hash_token(supplylens_refresh)
        db_token = db.query(RefreshToken).filter(
            RefreshToken.token_hash == token_hash
        ).first()
        if db_token:
            db_token.revoked = True
            db.commit()

    response.delete_cookie(key=_COOKIE, path="/auth")


# ── GET /auth/me ──────────────────────────────────────────────────────────────

@router.get("/me", response_model=UserInfo)
def me(current_user: CurrentUser = Depends(verify_access_token)):
    return UserInfo(user_id=current_user.user_id, email=current_user.email)
