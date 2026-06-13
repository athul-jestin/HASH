from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from backend.firebase_storage import initialize_firebase
from backend.schemas.upload import UploadResponse

router = APIRouter(tags=["upload"])


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    bucket = initialize_firebase()
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is required")

    filename = f"{uuid4().hex}{Path(file.filename).suffix}"
    blob = bucket.blob(filename)
    blob.upload_from_string(contents, content_type=file.content_type)
    url = f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{filename}?alt=media"
    return {"url": url}
