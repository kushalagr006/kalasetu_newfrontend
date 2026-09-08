from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "KalaSetu Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./kalasetu.db"
    SQLITE_FALLBACK_URL: str = "sqlite+aiosqlite:///./kalasetu.db"

    # Security
    SECRET_KEY: str = "kalasetu_sih_2026_super_secret_jwt_key_for_marginalized_artisans"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days

    # Firebase
    FIREBASE_PROJECT_ID: str = "kalasetu-sih-mock"

    # External APIs
    BHASHINI_API_KEY: str = "mock_bhashini_api_key_sih"
    BHASHINI_PIPELINE_ID: str = "mock_bhashini_pipeline_id"
    RAZORPAY_KEY_ID: str = "rzp_test_mock_kalasetu"
    RAZORPAY_KEY_SECRET: str = "mock_razorpay_secret"
    ONDC_GATEWAY_URL: str = "https://mock-ondc-gateway.kalasetu.in"
    GOOGLE_TRANSLATE_API_KEY: str = "mock_google_translate_key"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
