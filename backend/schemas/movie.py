from typing import List, Optional

from pydantic import BaseModel, Field


class MovieCast(BaseModel):
    name: str
    image: str


class MovieReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str


class MovieBase(BaseModel):
    name: str
    desc: str
    titleImage: str
    image: str
    category: str
    language: str
    year: int
    time: int
    video: Optional[str] = None
    casts: List[MovieCast] = []


class MovieCreate(MovieBase):
    pass


class MovieUpdate(BaseModel):
    name: Optional[str]
    desc: Optional[str]
    titleImage: Optional[str]
    image: Optional[str]
    category: Optional[str]
    language: Optional[str]
    year: Optional[int]
    time: Optional[int]
    video: Optional[str]
    casts: Optional[List[MovieCast]]
    rate: Optional[float]
    numberOfReviews: Optional[int]


class MovieResponse(MovieBase):
    id: str
    userId: str
    rate: float
    numberOfReviews: int
    reviews: List[dict] = []

    class Config:
        orm_mode = True
