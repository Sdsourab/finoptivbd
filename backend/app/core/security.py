import logging
from functools import lru_cache

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import Client
import jwt
from jwt import PyJWKClient

from app.core.config import settings
from app.db.supabase_client import get_supabase

logger = logging.getLogger(__name__)
bearer_scheme = HTTPBearer(auto_error=False)


@lru_cache
def _get_jwks_client() -> PyJWKClient:
    """Cached JWKS client for modern asymmetric Supabase JWT signing keys."""
    jwks_url = f"{settings.supabase_url}/auth/v1/jwks"
    return PyJWKClient(
        jwks_url,
        cache_keys=True,
        headers={"apikey": settings.supabase_api_key},
    )


def _decode_token(token: str) -> dict:
    """Verify modern ES256/RS256 tokens, then legacy HS256 tokens."""
    try:
        signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
        return jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated",
        )
    except Exception:
        # Older Supabase projects may still use the shared HS256 secret.
        pass

    if settings.supabase_jwt_secret:
        try:
            return jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
            )
        except jwt.PyJWTError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            ) from exc

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token verification failed. Check the Supabase JWT signing-key configuration.",
    )


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    supabase: Client = Depends(get_supabase),
) -> str:
    """Verify the user JWT and confirm that the user is in public.admins."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    payload = _decode_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject",
        )

    try:
        result = (
            supabase.table("admins")
            .select("id")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        logger.exception("Supabase admin membership lookup failed")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin verification could not reach Supabase. Check the admins table migration and backend key.",
        ) from exc

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is not registered as a Finoptiv admin.",
        )

    return user_id
