from fastapi import APIRouter
from backend.api.endpoints import categories, chatbot, movies, upload, users


api_router = APIRouter(prefix="")

api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(chatbot.router, prefix="/chatbot", tags=["chatbot"])
api_router.include_router(movies.router, prefix="/movies", tags=["movies"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(users.router, prefix="/users", tags=["users"])

