import asyncio

from sqlalchemy import select

from backend.core.config import settings
from backend.core.database import AsyncSessionLocal
from backend.core.security import hash_password
from backend.models.user import User


async def seed_admin() -> None:
    if not (settings.ADMIN_FULL_NAME and settings.ADMIN_EMAIL and settings.ADMIN_PASSWORD):
        print("ADMIN_FULL_NAME/ADMIN_EMAIL/ADMIN_PASSWORD not set, skipping admin seed.")
        return

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == settings.ADMIN_EMAIL))
        if result.scalar_one_or_none():
            print(f"Admin user {settings.ADMIN_EMAIL} already exists, skipping.")
            return

        db.add(
            User(
                full_name=settings.ADMIN_FULL_NAME,
                email=settings.ADMIN_EMAIL,
                password=hash_password(settings.ADMIN_PASSWORD),
                is_admin=True,
            )
        )
        await db.commit()
        print(f"Created admin user {settings.ADMIN_EMAIL}.")


if __name__ == "__main__":
    asyncio.run(seed_admin())
