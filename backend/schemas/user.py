from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    fullName: Optional[str]
    email: Optional[EmailStr]
    image: Optional[str]
    isAdmin: Optional[bool] = False


class UserCreate(UserBase):
    fullName: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    fullName: Optional[str]
    email: Optional[EmailStr]
    image: Optional[str]


class UserResponse(UserBase):
    id: str
    token: Optional[str] = None

    class Config:
        orm_mode = True
