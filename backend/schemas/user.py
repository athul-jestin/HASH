from typing import Optional

from pydantic import BaseModel, EmailStr

from backend.schemas.base import CamelModel


class UserBase(CamelModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    image: Optional[str] = None
    is_admin: bool = False


class UserCreate(CamelModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(CamelModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    image: Optional[str] = None


class UserResponse(UserBase):
    id: str
    token: Optional[str] = None


class PasswordChange(CamelModel):
    old_password: str
    new_password: str
