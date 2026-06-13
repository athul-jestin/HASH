from pydantic import BaseModel


class UploadResponse(BaseModel):
    url: str

    class Config:
        orm_mode = True
