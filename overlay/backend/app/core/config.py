import os


class Settings:
    """Application configuration.

    Supports Supabase's current publishable/secret API keys and the legacy
    anon/service_role keys during migration. The secret key is server-only.
    """

    def __init__(self) -> None:
        # Both frontend and backend use the same project URL in production.
        self.supabase_url = (
            os.environ.get("SUPABASE_URL")
            or os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
        ).strip()

        # Preferred current key; retain the old variable for existing projects.
        self.supabase_secret_key = os.environ.get("SUPABASE_SECRET_KEY", "").strip()
        self.supabase_service_role_key = os.environ.get(
            "SUPABASE_SERVICE_ROLE_KEY", ""
        ).strip()
        self.supabase_api_key = (
            self.supabase_secret_key or self.supabase_service_role_key
        )

        # Only needed for projects still using legacy HS256 JWT signing.
        self.supabase_jwt_secret = os.environ.get("SUPABASE_JWT_SECRET", "").strip()

        origins = os.environ.get("ALLOWED_ORIGINS", "")
        self.allowed_origins = [o.strip() for o in origins.split(",") if o.strip()]


settings = Settings()
