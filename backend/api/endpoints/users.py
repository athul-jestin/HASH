from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.config import settings
from backend.core.database import get_db
from backend.core.security import create_access_token, hash_password, verify_password
from backend.dependencies import get_current_admin, get_current_user
from backend.models.favorite import Favorite
from backend.models.movie import Movie
from backend.models.user import User
from backend.schemas.movie import MovieResponse
from backend.schemas.user import (
    PasswordChange,
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
)
from backend.supabase_storage import get_public_url

router = APIRouter(tags=["users"])


def _build_user_response(user: User, *, with_token: bool = False) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        full_name=user.full_name,
        email=user.email,
        image=get_public_url(settings.SUPABASE_BUCKET_IMAGES, user.image) if user.image else None,
        is_admin=user.is_admin,
        token=create_access_token(str(user.id)) if with_token else None,
    )


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password=hash_password(payload.password),
        is_admin=False,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return _build_user_response(user, with_token=True)


@router.post("/users/login", response_model=UserResponse)
async def login_user(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return _build_user_response(user, with_token=True)


@router.put("/users", response_model=UserResponse)
async def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)
    return _build_user_response(current_user, with_token=True)


@router.delete("/users")
async def delete_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete admin user")

    await db.delete(current_user)
    await db.commit()
    return {"message": "User removed"}


@router.put("/users/password")
async def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(data.old_password, current_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid old password")

    current_user.password = hash_password(data.new_password)
    await db.commit()
    return {"message": "Password changed"}


@router.get("/users/favorites", response_model=list[MovieResponse])
async def get_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from backend.api.endpoints.movies import _movie_query, build_movie_response

    result = await db.execute(
        _movie_query().join(Favorite, Favorite.movie_id == Movie.id).where(Favorite.user_id == current_user.id)
    )
    movies = result.scalars().all()
    return [await build_movie_response(movie, include_video=False) for movie in movies]


@router.post("/users/favorites")
async def add_favorite(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    movie_id = data.get("movieId")
    if not movie_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="movieId is required")

    movie_uuid = UUID(movie_id)
    existing = await db.get(Favorite, {"user_id": current_user.id, "movie_id": movie_uuid})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Movie already liked")

    db.add(Favorite(user_id=current_user.id, movie_id=movie_uuid))
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Movie already liked")

    return {"message": "Added to favorites"}


@router.delete("/users/favorites")
async def clear_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Favorite).where(Favorite.user_id == current_user.id))
    for favorite in result.scalars().all():
        await db.delete(favorite)
    await db.commit()
    return {"message": "All favorite movies removed"}


@router.get("/users", response_model=list[UserResponse])
async def get_users(
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User))
    return [_build_user_response(user) for user in result.scalars().all()]


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.is_admin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete admin")

    await db.delete(user)
    await db.commit()
    return {"message": "User removed"}
