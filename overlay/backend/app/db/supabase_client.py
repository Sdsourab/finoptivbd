import logging
from functools import lru_cache

from fastapi import HTTPException, status
from supabase import Client, create_client

from app.core.config import settings

logger = logging.getLogger(__name__)


@lru_cache

def get_supabase() -> Client:
    """Create the privileged server-side client once per warm function.

    Missing configuration is reported as a clear 503 instead of an opaque
    runtime 500. The secret/service-role key must never be exposed to the
    browser. Admin authorization is checked separately before protected APIs.
    """
    missing = []
    if not settings.supabase_url:
        missing.append("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)")
    if not settings.supabase_api_key:
        missing.append("SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY)")

    if missing:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase configuration is incomplete: " + "; ".join(missing),
        )

    try:
        return create_client(settings.supabase_url, settings.supabase_api_key)
    except Exception as exc:  # do not expose credentials or raw provider details
        logger.exception("Supabase client initialization failed")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase client initialization failed. Verify the project URL and server-side API key.",
        ) from exc
