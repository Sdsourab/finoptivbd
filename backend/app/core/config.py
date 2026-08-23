import os


class Settings:
    """Reads Supabase/JWT/CORS config from the environment.

    Deliberately uses .get() with safe defaults rather than os.environ[...],
    so importing this module never crashes when real secrets aren't set —
    e.g. in CI, where tests run against a fake Supabase client instead of a
    live project (see tests/test_articles.py).
    """

    def __init__(self) -> None:
        self.supabase_url = os.environ.get("SUPABASE_URL", "")
        self.supabase_service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        self.supabase_jwt_secret = os.environ.get("SUPABASE_JWT_SECRET", "")
        origins = os.environ.get("ALLOWED_ORIGINS", "")
        self.allowed_origins = [o.strip() for o in origins.split(",") if o.strip()]


settings = Settings()
