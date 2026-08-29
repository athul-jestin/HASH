from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from backend.core.config import settings
from backend.schemas.upload import UploadResponse
from backend.supabase_storage import create_signed_url, get_public_url, upload_object

router = APIRouter(tags=["upload"])


@router.post("/upload/image", response_model=UploadResponse)
async def upload_image(file: UploadFile = File(...)):
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an image")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is required")

    path = f"{uuid4().hex}{Path(file.filename).suffix}"
    await upload_object(settings.SUPABASE_BUCKET_IMAGES, path, contents, file.content_type)
    return UploadResponse(path=path, url=get_public_url(settings.SUPABASE_BUCKET_IMAGES, path))


@router.post("/upload/video", response_model=UploadResponse)
async def upload_video(file: UploadFile = File(...)):
    if file.content_type != "video/mp4":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an MP4 video")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is required")

    path = f"{uuid4().hex}{Path(file.filename).suffix}"
    await upload_object(settings.SUPABASE_BUCKET_VIDEOS, path, contents, file.content_type)
    url = await create_signed_url(settings.SUPABASE_BUCKET_VIDEOS, path)
    return UploadResponse(path=path, url=url)
