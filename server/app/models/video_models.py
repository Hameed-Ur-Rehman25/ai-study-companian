from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ConversionStatusResponse(BaseModel):
    """Response model for conversion status"""
    job_id: str
    status: str
    progress: float = Field(..., ge=0.0, le=100.0, description="Progress percentage")
    current_step: str
    estimated_time_remaining: Optional[int] = None  # seconds
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class VideoResponse(BaseModel):
    """Response model for video download"""
    job_id: str
    video_url: str
    video_size: int
    duration: float
    format: str = "mp4"
    created_at: datetime


class VideoPreviewResponse(BaseModel):
    """Response model for video preview"""
    job_id: str
    preview_url: str
    thumbnail_url: Optional[str] = None
    duration: float
    status: str

