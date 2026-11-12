
import logging
from functools import lru_cache

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient
from supabase import Client

from app.core.config import settings
from app.db.supabase_client import get_supabase


logger = logging.getLogger(__name__)

bearer_scheme = HTTPBearer(auto_error=False)


@lru_cache(maxsize=1)
def _get_jwks_client() -> PyJWKClient:
    """
    Create a cached JWKS client for modern Supabase
    asymmetric signing keys such as ES256 and RS256.
    """

    supabase_url = settings.supabase_url.rstrip("/")

    jwks_url = (
        f"{supabase_url}/auth/v1/.well-known/jwks.json"
    )

    return PyJWKClient(
        jwks_url,
        cache_keys=True,
    )


def _decode_token(token: str) -> dict:
    """
    Verify Supabase access tokens.

    1. First verify modern asymmetric tokens (ES256 / RS256)
       using Supabase's public JWKS endpoint.

    2. If modern verification fails and a legacy JWT secret
       is configured, try legacy HS256 verification.
    """

    # Modern Supabase signing keys: ES256 / RS256
    try:
        signing_key = _get_jwks_client().get_signing_key_from_jwt(
            token
        )

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated",
        )

        return payload

    except Exception as exc:
        # Do not log the JWT itself or any secret.
        logger.warning(
            "Modern Supabase JWT verification failed: %s",
            type(exc).__name__,
        )

    # Legacy Supabase signing key: HS256
    legacy_secret = settings.supabase_jwt_secret

    if legacy_secret:
        try:
            payload = jwt.decode(
                token,
                legacy_secret,
                algorithms=["HS256"],
                audience="authenticated",
            )

            return payload

        except jwt.PyJWTError as exc:
            logger.warning(
                "Legacy Supabase JWT verification failed: %s",
                type(exc).__name__,
            )

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            ) from exc

    # Neither modern nor legacy verification succeeded.
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=(
            "Token verification failed. "
            "Check the Supabase JWT signing-key configuration."
        ),
    )


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
    supabase: Client = Depends(get_supabase),
) -> str:
    """
    Verify the user's Supabase JWT and confirm
    that the user is registered in public.admins.
    """

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    # Verify JWT signature and claims.
    payload = _decode_token(credentials.credentials)

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject",
        )

    # Verify admin membership in Supabase.
    try:
        result = (
            supabase.table("admins")
            .select("id")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )

    except Exception as exc:
        logger.exception(
            "Supabase admin membership lookup failed"
        )

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Admin verification could not reach Supabase. "
                "Check the admins table migration and backend key."
            ),
        ) from exc

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "This account is not registered as a Finoptiv admin."
            ),
        )

    return user_id
