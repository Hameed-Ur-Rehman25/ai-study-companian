"""
Video generation and download routes
"""
import os
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
from app.models.video_models import ConversionStatusResponse, VideoResponse, VideoPreviewResponse
from app.services.storage_service import StorageService
from app.api.dependencies import get_storage_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/video", tags=["Video"])

# In-memory job status storage (in production, use Redis or database)
job_statuses = {}


@router.get("/status/{job_id}")
async def get_conversion_status(
    job_id: str,
    storage_service: StorageService = Depends(get_storage_service)
):
    """
    Get conversion job status
    """
    try:
        # Check if job exists in status storage
        if job_id not in job_statuses:
            # Check if video file exists (completed)
            video_path = storage_service.get_file_path(job_id, f"video_{job_id}.mp4", "output")
            if video_path and os.path.exists(video_path):
                return ConversionStatusResponse(
                    job_id=job_id,
                    status="completed",
                    progress=100.0,
                    current_step="completed",
                    created_at=datetime.fromtimestamp(os.path.getmtime(video_path)),
                    updated_at=datetime.now()
                )
            else:
                raise HTTPException(status_code=404, detail="Job not found")
        
        status_data = job_statuses[job_id]
        # Convert ISO strings to datetime objects
        status_data['created_at'] = datetime.fromisoformat(status_data['created_at'])
        status_data['updated_at'] = datetime.fromisoformat(status_data['updated_at'])
        return ConversionStatusResponse(**status_data)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting status: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting status: {str(e)}")


@router.get("/download/{job_id}")
async def download_video(
    job_id: str,
    storage_service: StorageService = Depends(get_storage_service)
):
    """
    Download generated video file
    """
    try:
        video_path = storage_service.get_file_path(job_id, f"video_{job_id}.mp4", "output")
        
        if not video_path or not os.path.exists(video_path):
            raise HTTPException(status_code=404, detail="Video not found")
        
        file_size = os.path.getsize(video_path)
        
        return FileResponse(
            video_path,
            media_type="video/mp4",
            filename=f"video_{job_id}.mp4",
            headers={"Content-Length": str(file_size)}
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading video: {e}")
        raise HTTPException(status_code=500, detail=f"Error downloading video: {str(e)}")


@router.get("/preview/{job_id}")
async def get_video_preview(
    job_id: str,
    storage_service: StorageService = Depends(get_storage_service)
):
    """
    Get video preview URL and metadata
    """
    try:
        video_path = storage_service.get_file_path(job_id, f"video_{job_id}.mp4", "output")
        
        if not video_path or not os.path.exists(video_path):
            raise HTTPException(status_code=404, detail="Video not found")
        
        file_size = os.path.getsize(video_path)
        
        # In production, generate a signed URL or use CDN
        preview_url = f"/api/video/download/{job_id}"
        
        return VideoPreviewResponse(
            job_id=job_id,
            preview_url=preview_url,
            duration=0.0,  # Would need to extract from video
            status="completed"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting preview: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting preview: {str(e)}")

