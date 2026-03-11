from pydantic import BaseModel


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int          # seconds


class ExchangeResponse(TokenResponse):
    """Returned by /auth/exchange — access token in body, refresh token in cookie."""
    user_id: str
    email: str


class RefreshResponse(TokenResponse):
    """Returned by /auth/refresh."""
    pass


class UserInfo(BaseModel):
    user_id: str
    email: str
