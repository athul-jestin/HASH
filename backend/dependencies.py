from fastapi import Depends, Header, HTTPException, status

from backend.core.security import decode_access_token
from backend.db import get_database
from backend.utils import prepare_object_id, to_json


def get_authorization_token(authorization: str | None = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized, no token provided",
        )
    return authorization.split(" ", 1)[1]


async def get_current_user(token: str = Depends(get_authorization_token)) -> dict:
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("Token missing subject")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )

    db = get_database()
    user = await db.users.find_one({"_id": prepare_object_id(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    user = to_json(user)
    user.pop("password", None)
    return user


async def get_current_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if not current_user.get("isAdmin"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized as an admin",
        )
    return current_user
