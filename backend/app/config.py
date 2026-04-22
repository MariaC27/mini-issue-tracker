# ABOUTME: Application configuration loaded from environment variables.
# ABOUTME: Uses pydantic-settings for typed, validated config.

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/mini_issue_tracker"
    clerk_jwks_url: str = "https://api.clerk.com/v1/jwks"


settings = Settings()
