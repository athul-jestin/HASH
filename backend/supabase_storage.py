import httpx

from backend.core.config import settings

_client: httpx.AsyncClient | None = None


def _get_client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        _client = httpx.AsyncClient(
            base_url=f"{settings.SUPABASE_URL}/storage/v1",
            headers={
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
            },
            timeout=30.0,
        )
    return _client


async def close_client() -> None:
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None


async def upload_object(bucket: str, path: str, content: bytes, content_type: str) -> None:
    client = _get_client()
    response = await client.post(
        f"/object/{bucket}/{path}",
        content=content,
        headers={"Content-Type": content_type},
    )
    response.raise_for_status()


def get_public_url(bucket: str, path: str) -> str:
    return f"{settings.SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}"


async def create_signed_url(bucket: str, path: str, expires_in: int | None = None) -> str:
    client = _get_client()
    response = await client.post(
        f"/object/sign/{bucket}/{path}",
        json={"expiresIn": expires_in or settings.SUPABASE_SIGNED_URL_EXPIRY_SECONDS},
    )
    response.raise_for_status()
    signed_path = response.json()["signedURL"]
    return f"{settings.SUPABASE_URL}/storage/v1{signed_path}"


async def delete_object(bucket: str, path: str) -> None:
    client = _get_client()
    response = await client.request("DELETE", f"/object/{bucket}", json={"prefixes": [path]})
    response.raise_for_status()
