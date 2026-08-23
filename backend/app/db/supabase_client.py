from functools import lru_cache

from supabase import Client, create_client

from app.core.config import settings


@lru_cache
def get_supabase() -> Client:
    """FastAPI dependency (via Depends), not a bare function call — this is
    what lets tests override it with a fake client via
    app.dependency_overrides, with no real Supabase project needed.
    """
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
