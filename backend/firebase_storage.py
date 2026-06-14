import firebase_admin
from firebase_admin import credentials, storage
from typing import Any

from backend.core.config import settings


def _build_firebase_credentials() -> credentials.Certificate:
    private_key = settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n")
    return credentials.Certificate(
        {
            "type": settings.FIREBASE_TYPE or "service_account",
            "project_id": settings.FIREBASE_PROJECT_ID,
            "private_key_id": settings.FIREBASE_PRIVATE_KEY_ID,
            "private_key": private_key,
            "client_email": settings.FIREBASE_CLIENT_EMAIL,
            "client_id": settings.FIREBASE_CLIENT_ID,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": settings.FIREBASE_CLIENT_X509_CERT_URL,
            "universe_domain": "googleapis.com",
        }
    )


def initialize_firebase() -> Any:
    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_admin.initialize_app(
            _build_firebase_credentials(),
            {"storageBucket": settings.FIREBASE_STORAGE_BUCKET},
        )
    return storage.bucket()
