# ABOUTME: FastAPI dependency providers for database sessions and authenticated users.
# ABOUTME: Verifies Clerk JWTs via JWKS and extracts user identity.

from typing import Annotated, Generator

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import settings
from app.database import SessionLocal

bearer_scheme = HTTPBearer()

_jwks_cache: dict | None = None


def _get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache is None:
        response = httpx.get(settings.clerk_jwks_url)
        response.raise_for_status()
        _jwks_cache = response.json()
    return _jwks_cache


class ClerkUser(BaseModel):
    user_id: str
    email: str | None = None


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> ClerkUser:
    token = credentials.credentials
    try:
        jwks = _get_jwks()
        payload = jwt.decode(token, jwks, algorithms=["RS256"])
        user_id: str = payload.get("sub")
        email: str | None = payload.get("email")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return ClerkUser(user_id=user_id, email=email)
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        ) from exc


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[ClerkUser, Depends(get_current_user)]
