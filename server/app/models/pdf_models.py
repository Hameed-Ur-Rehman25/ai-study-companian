from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class PDFUploadRequest(BaseModel):
    """Request model for PDF upload"""
    filename: str
    file_size: int = Field(..., gt=0, description="File size in bytes")


class PDFPageContent(BaseModel):
    """Content extracted from a single PDF page"""
    page_num: int
    text: str
    images: List[str] = Field(default_factory=list, description="List of image file paths")
    duration: Optional[float] = None
    title: Optional[str] = None
    bullet_points: List[str] = Field(default_factory=list)


class PDFExtractionResponse(BaseModel):
    """Response model for PDF extraction"""
    job_id: str
    total_pages: int
    pages: List[PDFPageContent]
    status: str = "extracted"


class ConversionStatus(str, Enum):
    """Conversion job status"""
    PENDING = "pending"
    UPLOADING = "uploading"
    EXTRACTING = "extracting"
    GENERATING_AUDIO = "generating_audio"
    CREATING_VIDEO = "creating_video"
    COMPLETED = "completed"
    FAILED = "failed"


class ConversionRequest(BaseModel):
    """Request model for PDF to video conversion"""
    job_id: str
    voice_id: Optional[str] = "en"  # Language code for gTTS: en, en-us, en-uk, etc.
    video_quality: Optional[str] = "high"  # low, medium, high
    include_animations: Optional[bool] = True
    include_transitions: Optional[bool] = True

