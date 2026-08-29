from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.dependencies import get_current_admin
from backend.models.category import Category
from backend.schemas.category import CategoryCreate, CategoryResponse

router = APIRouter(tags=["categories"])


@router.get("/categories", response_model=list[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).order_by(Category.created_at.desc()))
    return result.scalars().all()


@router.post(
    "/categories",
    response_model=CategoryResponse,
    dependencies=[Depends(get_current_admin)],
    status_code=status.HTTP_201_CREATED,
)
async def create_category(payload: CategoryCreate, db: AsyncSession = Depends(get_db)):
    category = Category(title=payload.title)
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


@router.put(
    "/categories/{category_id}",
    response_model=CategoryResponse,
    dependencies=[Depends(get_current_admin)],
)
async def update_category(category_id: UUID, payload: CategoryCreate, db: AsyncSession = Depends(get_db)):
    category = await db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    category.title = payload.title
    await db.commit()
    await db.refresh(category)
    return category


@router.delete("/categories/{category_id}", dependencies=[Depends(get_current_admin)])
async def delete_category(category_id: UUID, db: AsyncSession = Depends(get_db)):
    category = await db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    await db.delete(category)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category is in use")

    return {"message": "Category removed"}
