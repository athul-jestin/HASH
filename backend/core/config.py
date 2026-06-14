from typing import Optional

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGODB_URI: Optional[str] = None
    MONGO_URI: Optional[str] = None
    MONGO_USER: Optional[str] = None
    MONGO_PASSWORD: Optional[str] = None
    MONGO_HOST: Optional[str] = None
    MONGO_DB: Optional[str] = None
    MONGO_OPTIONS: Optional[str] = None

    JWT_SECRET: str
    OPENAI_API_KEY: str

    FIREBASE_TYPE: Optional[str] = None
    FIREBASE_PROJECT_ID: str
    FIREBASE_PRIVATE_KEY_ID: str
    FIREBASE_PRIVATE_KEY: str
    FIREBASE_CLIENT_EMAIL: str
    FIREBASE_CLIENT_ID: str
    FIREBASE_CLIENT_X509_CERT_URL: str
    FIREBASE_STORAGE_BUCKET: str

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def mongo_connection_string(self) -> str:
        uri = self.MONGODB_URI or self.MONGO_URI
        if uri:
            return uri

        if self.MONGO_USER and self.MONGO_PASSWORD and self.MONGO_HOST and self.MONGO_DB:
            password = self.MONGO_PASSWORD.replace("\\n", "\n")
            uri = f"mongodb+srv://{self.MONGO_USER}:{password}@{self.MONGO_HOST}/{self.MONGO_DB}"
            if self.MONGO_OPTIONS:
                uri = f"{uri}?{self.MONGO_OPTIONS}"
            return uri

        raise ValueError(
            "MongoDB connection is not configured. Set MONGODB_URI, MONGO_URI or MONGO_USER/MONGO_PASSWORD/MONGO_HOST/MONGO_DB."
        )


settings = Settings()
