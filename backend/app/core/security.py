from functools import lru_cache

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import Client
import jwt
from jwt import PyJWKClient

from app.core.config import settings
from app.db.supabase_client import get_supabase

bearer_scheme = HTTPBearer(auto_error=False)


@lru_cache
def _get_jwks_client() -> PyJWKClient:
    """Supabase's public keys for its newer asymmetric (ES256/RS256) signing
    keys system. Cached (lru_cache + PyJWKClient's own internal caching) so
    this doesn't fetch the JWKS on every single request.

    Supabase's API gateway rejects ANY request — including this one — that
    doesn't carry an `apikey` header, JWKS included. The service-role key
    (already available server-side) works fine for this.
    """
    jwks_url = f"{settings.supabase_url}/auth/v1/jwks"
    return PyJWKClient(
        jwks_url,
        cache_keys=True,
        headers={"apikey": settings.supabase_service_role_key},
    )


def _decode_token(token: str) -> dict:
    """Verifies a Supabase-issued access token.

    Supabase now supports two different ways of signing tokens depending on
    project settings/age:
      1. Newer projects: asymmetric JWT Signing Keys (ES256/RS256) — verified
         against the project's public JWKS endpoint, no shared secret needed.
      2. Older / legacy projects: a single shared secret (HS256) —
         SUPABASE_JWT_SECRET.

    There's no reliable way to know in advance which one a given project
    uses, so this tries the modern JWKS approach first and falls back to the
    legacy shared secret. Whichever one actually matches the token succeeds;
    the other attempt just fails silently and isn't the real error.
    """
    try:
        signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
        return jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated",
        )
    except Exception:
        pass

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


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    supabase: Client = Depends(get_supabase),
) -> str:
    """FastAPI dependency: verifies the Supabase-issued JWT and confirms the
    user is a row in `admins`. Returns the admin's user id on success.

    This is one of two independent checks — Postgres RLS (see the migration)
    enforces the same rule at the database layer, so a bug here alone can't
    grant a write.
    """
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    payload = _decode_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing subject")

    result = supabase.table("admins").select("id").eq("id", user_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not an admin")

    return user_id
