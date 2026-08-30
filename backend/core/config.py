from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    JWT_SECRET: str
    OPENAI_API_KEY: str

    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_BUCKET_IMAGES: str = "images"
    SUPABASE_BUCKET_VIDEOS: str = "videos"
    SUPABASE_SIGNED_URL_EXPIRY_SECONDS: int = 3600

    # Optional — if all three are set, the container's prestart script seeds
    # this user as an admin on startup (skipped if it already exists).
    ADMIN_FULL_NAME: str | None = None
    ADMIN_EMAIL: str | None = None
    ADMIN_PASSWORD: str | None = None

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
