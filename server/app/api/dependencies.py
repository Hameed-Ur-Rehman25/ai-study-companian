
"""
Dependencies for FastAPI routes
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.storage_service import StorageService
from app.services.pdf_service import PDFService
from app.services.tts_service import TTSService
from app.services.video_service import VideoService
from app.core.supabase import supabase
import os

security = HTTPBearer()

def get_storage_service() -> StorageService:
    """Get storage service instance"""
    base_dir = os.getenv("STORAGE_BASE_DIR", "./storage")
    return StorageService(base_dir=base_dir)


def get_pdf_service() -> PDFService:
    """Get PDF service instance"""
    storage = get_storage_service()
    return PDFService(storage)


def get_tts_service() -> TTSService:
    """Get TTS service instance"""
    storage = get_storage_service()
    return TTSService(storage)


def get_video_service() -> VideoService:
    """Get video service instance"""
    storage = get_storage_service()
    return VideoService(storage)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validate the Supabase JWT and return the user object
    """
    token = credentials.credentials
    try:
        user = supabase.auth.get_user(token)
        if not user or not user.user:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
