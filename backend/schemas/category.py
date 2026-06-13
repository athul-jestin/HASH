from pydantic import BaseModel


class CategoryCreate(BaseModel):
    title: str


class CategoryResponse(BaseModel):
    id: str
    title: str

    class Config:
        orm_mode = True
