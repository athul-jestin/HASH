from backend.schemas.base import CamelModel


class UploadResponse(CamelModel):
    path: str
    url: str
