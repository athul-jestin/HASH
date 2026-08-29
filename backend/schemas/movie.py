from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from backend.schemas.base import CamelModel


class MovieCastInput(BaseModel):
    name: str
    image: str


class MovieCastResponse(CamelModel):
    id: str
    name: str
    image: str


class MovieReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str


class MovieReviewResponse(CamelModel):
    id: str
    user_id: str
    user_name: str
    user_image: Optional[str] = None
    rating: int
    comment: str
    created_at: datetime


class MovieBase(CamelModel):
    name: str
    desc: str
    title_image: str
    image: str
    category_id: UUID
    language: str
    year: int
    time: int
    video: Optional[str] = None
    casts: List[MovieCastInput] = []


class MovieCreate(MovieBase):
    pass


class MovieUpdate(CamelModel):
    name: Optional[str] = None
    desc: Optional[str] = None
    title_image: Optional[str] = None
    image: Optional[str] = None
    category_id: Optional[UUID] = None
    language: Optional[str] = None
    year: Optional[int] = None
    time: Optional[int] = None
    video: Optional[str] = None
    casts: Optional[List[MovieCastInput]] = None


class MovieResponse(CamelModel):
    id: str
    user_id: Optional[str] = None
    name: str
    desc: str
    title_image: str
    image: str
    category: str
    language: str
    year: int
    time: int
    video: Optional[str] = None
    rate: float
    number_of_reviews: int
    reviews: List[MovieReviewResponse] = []
    casts: List[MovieCastResponse] = []
    created_at: datetime
    updated_at: datetime
