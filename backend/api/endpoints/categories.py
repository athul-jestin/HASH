from fastapi import APIRouter, Depends, HTTPException, status

from backend.dependencies import get_current_admin
from backend.db import get_database
from backend.schemas.category import CategoryCreate
from backend.utils import prepare_object_id, to_json

router = APIRouter(tags=["categories"])


@router.get("/categories")
async def get_categories():
    db = get_database()
    cursor = db.categories.find({}).sort("createdAt", -1)
    return [to_json(category) for category in await cursor.to_list(length=100)]


@router.post("/categories", dependencies=[Depends(get_current_admin)], status_code=status.HTTP_201_CREATED)
async def create_category(payload: CategoryCreate):
    db = get_database()
    result = await db.categories.insert_one(payload.dict())
    category = await db.categories.find_one({"_id": result.inserted_id})
    return to_json(category)


@router.put("/categories/{category_id}", dependencies=[Depends(get_current_admin)])
async def update_category(category_id: str, payload: CategoryCreate):
    db = get_database()
    await db.categories.update_one({"_id": prepare_object_id(category_id)}, {"$set": payload.dict()})
    category = await db.categories.find_one({"_id": prepare_object_id(category_id)})
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return to_json(category)


@router.delete("/categories/{category_id}", dependencies=[Depends(get_current_admin)])
async def delete_category(category_id: str):
    db = get_database()
    result = await db.categories.delete_one({"_id": prepare_object_id(category_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return {"message": "Category removed"}
