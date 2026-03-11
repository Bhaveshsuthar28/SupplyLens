"""
app/core/security.py — JWT helpers + Clerk JWKS verification + FastAPI dependency
"""

import time
import secrets
import hashlib
from datetime import datetime, timedelta, timezone

import httpx
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import get_settings

settings = get_settings()

# ── HTTP Bearer scheme ────────────────────────────────────────────────────────
bearer_scheme = HTTPBearer()

# ── JWKS in-memory cache (TTL = 5 min) ───────────────────────────────────────
_jwks_cache: dict = {"keys": [], "fetched_at": 0.0}
_JWKS_TTL = 300  # seconds


def _get_clerk_jwks() -> dict:
    now = time.time()
    if now - _jwks_cache["fetched_at"] < _JWKS_TTL and _jwks_cache["keys"]:
        return _jwks_cache
    try:
        resp = httpx.get(settings.clerk_jwks_url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        _jwks_cache.update({"keys": data["keys"], "fetched_at": now})
        return data
    except Exception as exc:
        if _jwks_cache["keys"]:   # stale cache is better than nothing
            return _jwks_cache
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Cannot reach Clerk JWKS: {exc}",
        )


# ── Clerk token verification ──────────────────────────────────────────────────

def verify_clerk_token(token: str) -> dict:
    """Verify a Clerk-issued JWT and return its payload."""
    jwks = _get_clerk_jwks()
    try:
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Clerk token: {exc}",
        )


# ── Our own Access / Refresh tokens ──────────────────────────────────────────

def create_access_token(user_id: str, email: str) -> str:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        "sub": user_id,
        "email": email,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
        "type": "access",
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token() -> tuple[str, str]:
    """Return (raw_token, sha256_hash). Store only the hash in DB."""
    raw = secrets.token_urlsafe(64)
    hashed = hashlib.sha256(raw.encode()).hexdigest()
    return raw, hashed


def hash_token(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        if payload.get("type") != "access":
            raise JWTError("wrong token type")
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired access token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ── FastAPI current-user dependency ──────────────────────────────────────────

class CurrentUser:
    def __init__(self, user_id: str, email: str):
        self.user_id = user_id
        self.email = email


def verify_access_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> CurrentUser:
    """Dependency — validates Bearer access token on every protected request."""
    payload = decode_access_token(credentials.credentials)
    return CurrentUser(user_id=payload["sub"], email=payload.get("email", ""))
