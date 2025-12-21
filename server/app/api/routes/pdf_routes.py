"""
PDF upload and processing routes
"""
import os
import uuid
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.models.pdf_models import PDFUploadRequest, PDFExtractionResponse, ConversionRequest
from app.services.pdf_service import PDFService
from app.services.storage_service import StorageService
from app.api.dependencies import get_pdf_service, get_storage_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/pdf", tags=["PDF"])


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    storage_service: StorageService = Depends(get_storage_service),
    pdf_service: PDFService = Depends(get_pdf_service)
):
    """
    Upload a PDF file
    """
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Read file content
        content = await file.read()
        
        # Check file size
        max_size = int(os.getenv("MAX_FILE_SIZE", 52428800))  # 50MB default
        if len(content) > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum of {max_size / 1024 / 1024}MB"
            )
        
        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Save file
        pdf_path = storage_service.save_uploaded_file(content, file.filename, job_id)
        
        # Validate PDF
        is_valid, error_msg = pdf_service.validate_pdf(pdf_path, max_size)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        return JSONResponse({
            "job_id": job_id,
            "filename": file.filename,
            "file_size": len(content),
            "status": "uploaded"
        })
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")


@router.post("/extract")
async def extract_pdf_content(
    job_id: str,
    storage_service: StorageService = Depends(get_storage_service),
    pdf_service: PDFService = Depends(get_pdf_service)
):
    """
    Extract content from uploaded PDF
    """
    try:
        # Find PDF file in upload directory
        upload_dir = storage_service.get_job_dir(job_id, "upload")
        pdf_files = list(upload_dir.glob("*.pdf"))
        
        if not pdf_files:
            raise HTTPException(status_code=404, detail="PDF file not found")
        
        pdf_path = str(pdf_files[0])
        
        # Extract content
        extraction_result = pdf_service.extract_content(pdf_path, job_id)
        
        return extraction_result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting PDF content: {e}")
        raise HTTPException(status_code=500, detail=f"Error extracting content: {str(e)}")


@router.post("/convert-to-video")
async def convert_to_video(
    request: ConversionRequest,
    storage_service: StorageService = Depends(get_storage_service),
    pdf_service: PDFService = Depends(get_pdf_service)
):
    """
    Start PDF to video conversion process
    This endpoint initiates the conversion and returns immediately
    Use status endpoint to check progress
    """
    try:
        from app.services.tts_service import TTSService
        from app.services.video_service import VideoService
        from app.services.conversion_service import ConversionService
        
        tts_service = TTSService(storage_service)
        video_service = VideoService(storage_service)
        conversion_service = ConversionService(
            storage_service, pdf_service, tts_service, video_service
        )
        
        # Start conversion in background
        conversion_service.start_conversion(request)
        
        return JSONResponse({
            "job_id": request.job_id,
            "status": "queued",
            "message": "Conversion started"
        })
    
    except Exception as e:
        logger.error(f"Error starting conversion: {e}")
        raise HTTPException(status_code=500, detail=f"Error starting conversion: {str(e)}")

