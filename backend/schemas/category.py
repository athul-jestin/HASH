from pydantic import BaseModel

from backend.schemas.base import CamelModel


class CategoryCreate(BaseModel):
    title: str


class CategoryResponse(CamelModel):
    id: str
    title: str
