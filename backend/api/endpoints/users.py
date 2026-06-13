from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import EmailStr

from backend.core.security import create_access_token, hash_password, verify_password
from backend.db import get_database
from backend.dependencies import get_current_admin, get_current_user
from backend.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
)
from backend.utils import prepare_object_id, to_json

router = APIRouter(tags=["users"])


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserCreate):
    db = get_database()
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    user_data = payload.dict(exclude={"password"})
    user_data.update(
        {
            "password": hash_password(payload.password),
            "isAdmin": False,
            "likedMovies": [],
        }
    )
    result = await db.users.insert_one(user_data)
    user = await db.users.find_one({"_id": result.inserted_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user data")

    user = to_json(user)
    user["token"] = create_access_token(user["id"])
    user.pop("password", None)
    return user


@router.post("/users/login", response_model=UserResponse)
async def login_user(credentials: UserLogin):
    db = get_database()
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user.get("password", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    user = to_json(user)
    user["token"] = create_access_token(user["id"])
    user.pop("password", None)
    return user


@router.put("/users", response_model=UserResponse)
async def update_profile(payload: UserUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = prepare_object_id(current_user["id"])
    update_data = payload.dict(exclude_none=True)
    await db.users.update_one({"_id": user_id}, {"$set": update_data})
    user = await db.users.find_one({"_id": user_id})
    user = to_json(user)
    user["token"] = create_access_token(user["id"])
    user.pop("password", None)
    return user


@router.delete("/users")
async def delete_profile(current_user: dict = Depends(get_current_user)):
    if current_user.get("isAdmin"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete admin user")
    db = get_database()
    await db.users.delete_one({"_id": prepare_object_id(current_user["id"])})
    return {"message": "User removed"}


@router.put("/users/password")
async def change_password(data: dict, current_user: dict = Depends(get_current_user)):
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")
    if not old_password or not new_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Old and new passwords are required")

    db = get_database()
    user = await db.users.find_one({"_id": prepare_object_id(current_user["id"])})
    if not user or not verify_password(old_password, user.get("password", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid old password")

    await db.users.update_one(
        {"_id": prepare_object_id(current_user["id"])},
        {"$set": {"password": hash_password(new_password)}},
    )
    return {"message": "Password changed"}


@router.get("/users/favorites")
async def get_favorites(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user = await db.users.find_one({"_id": prepare_object_id(current_user["id"])})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    liked_ids = user.get("likedMovies", [])
    movies = []
    if liked_ids:
        cursor = db.movies.find({"_id": {"$in": liked_ids}})
        movies = [to_json(movie) for movie in await cursor.to_list(length=100)]
    return movies


@router.post("/users/favorites")
async def add_favorite(data: dict, current_user: dict = Depends(get_current_user)):
    movie_id = data.get("movieId")
    if not movie_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="movieId is required")

    db = get_database()
    user_id = prepare_object_id(current_user["id"])
    movie_oid = prepare_object_id(movie_id)

    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    liked_movies = user.get("likedMovies", [])
    if movie_oid in liked_movies:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Movie already liked")

    liked_movies.append(movie_oid)
    await db.users.update_one({"_id": user_id}, {"$set": {"likedMovies": liked_movies}})
    user = await db.users.find_one({"_id": user_id})
    return to_json(user.get("likedMovies", []))


@router.delete("/users/favorites")
async def clear_favorites(current_user: dict = Depends(get_current_user)):
    user_id = prepare_object_id(current_user["id"])
    db = get_database()
    await db.users.update_one({"_id": user_id}, {"$set": {"likedMovies": []}})
    return {"message": "All favorite movies removed"}


@router.get("/users")
async def get_users(current_admin: dict = Depends(get_current_admin)):
    db = get_database()
    cursor = db.users.find({})
    users = [to_json(user) for user in await cursor.to_list(length=1000)]
    for item in users:
        item.pop("password", None)
    return users


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_admin: dict = Depends(get_current_admin)):
    db = get_database()
    user = await db.users.find_one({"_id": prepare_object_id(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.get("isAdmin"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete admin")

    await db.users.delete_one({"_id": prepare_object_id(user_id)})
    return {"message": "User removed"}
