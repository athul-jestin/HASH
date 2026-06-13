from motor.motor_asyncio import AsyncIOMotorClient

from backend.core.config import settings


client: AsyncIOMotorClient | None = None
db = None


def get_database():
    if db is None:
        raise RuntimeError("Database not initialized")
    return db


async def connect_to_mongo() -> None:
    global client, db
    client = AsyncIOMotorClient(settings.mongo_connection_string)
    if getattr(settings, "MONGO_DB", None):
        db = client[settings.MONGO_DB]
    else:
        db = client.get_default_database()


async def close_mongo() -> None:
    if client is not None:
        client.close()
