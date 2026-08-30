import asyncio

from sqlalchemy import text

from backend.core.config import settings
from backend.core.database import engine
from backend.models import Base
from backend.supabase_storage import close_client, delete_objects, list_all_objects


async def reset_data() -> None:
    table_names = ", ".join(f'"{table.name}"' for table in Base.metadata.sorted_tables)

    async with engine.begin() as conn:
        print(f"Truncating tables: {table_names}")
        await conn.execute(text(f"TRUNCATE TABLE {table_names} CASCADE"))

    for bucket in (settings.SUPABASE_BUCKET_IMAGES, settings.SUPABASE_BUCKET_VIDEOS):
        print(f"Emptying bucket: {bucket}")
        paths = await list_all_objects(bucket)
        await delete_objects(bucket, paths)
        print(f"  removed {len(paths)} object(s)")

    await close_client()
    print("Done.")


def confirm() -> bool:
    answer = input(
        "This permanently deletes ALL rows in the database and ALL files in the "
        "Supabase storage buckets. This cannot be undone. Type 'yes' to continue: "
    )
    return answer.strip().lower() == "yes"


if __name__ == "__main__":
    if confirm():
        asyncio.run(reset_data())
    else:
        print("Aborted.")
