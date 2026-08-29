from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.api import api_router
from backend.core.database import engine
from backend.supabase_storage import close_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.connect():
        pass
    yield
    await engine.dispose()
    await close_client()


app = FastAPI(title="HASH Backend API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
async def health_check():
    return {"message": "API is running..."}
