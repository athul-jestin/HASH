from fastapi import APIRouter
from backend.api.endpoints import categories, chatbot, movies, upload, users


api_router = APIRouter(prefix="/api")

api_router.include_router(categories.router, tags=["categories"])
api_router.include_router(chatbot.router, tags=["chatbot"])
api_router.include_router(movies.router, tags=["movies"])
api_router.include_router(upload.router, tags=["upload"])
api_router.include_router(users.router, tags=["users"])

