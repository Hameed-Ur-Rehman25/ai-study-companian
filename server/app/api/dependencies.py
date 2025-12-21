"""
Dependencies for FastAPI routes
"""
from app.services.storage_service import StorageService
from app.services.pdf_service import PDFService
from app.services.tts_service import TTSService
from app.services.video_service import VideoService
import os


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

