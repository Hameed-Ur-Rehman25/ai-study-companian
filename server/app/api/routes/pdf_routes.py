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
from app.services.database_service import Database
from app.api.dependencies import get_pdf_service, get_storage_service

logger = logging.getLogger(__name__)

# Initialize database
db = Database()

router = APIRouter(prefix="/api/pdf", tags=["PDF"])


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    authorization: str = Header(None),
    storage_service: StorageService = Depends(get_storage_service),
    pdf_service: PDFService = Depends(get_pdf_service)
):
    """
    Upload a PDF file with Usage Limit Check
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
            
        # ---------------------------------------------------------
        # USAGE LIMIT CHECK
        # ---------------------------------------------------------
        user_id = None
        if authorization and authorization.lower().startswith("bearer "):
            token = authorization.split(" ")[1]
            try:
                from app.services.user_service import UserService
                user_service = UserService(access_token=token)
                
                # Get User ID from Supabase
                user_response = user_service.client.auth.get_user()
                if user_response and user_response.user:
                    user_id = user_response.user.id
                    user_service.user_id = user_id
                    
                    # Check Limit
                    stats = user_service.get_user_stats()
                    limit = 10 if stats.subscription_plan == "Pro" else 1
                    
                    if stats.video_count >= limit:
                        raise HTTPException(
                            status_code=402, # Payment Required
                            detail=f"Usage limit reached. You have created {stats.video_count}/{limit} videos. Upgrade to Pro for more."
                        )
            except HTTPException:
                raise
            except Exception as e:
                logger.warning(f"Error checking user limits: {e}")
                # We default to allowing upload if check fails, or enforce strict?
                # For MVP, let's log and proceed (or fail safe). 
                # Better to fail safe for limits? No, let's allow if auth fails to avoid blocking valid users on glitch.
                pass
        
        # ---------------------------------------------------------

        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Save file
        pdf_path = storage_service.save_uploaded_file(content, file.filename, job_id)
        
        # Validate PDF
        is_valid, error_msg = pdf_service.validate_pdf(pdf_path, max_size)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Get page count for database
        import fitz
        doc = fitz.open(pdf_path)
        total_pages = len(doc)
        doc.close()
        
        # Create database record
        video_id = db.create_video(
            job_id=job_id,
            pdf_filename=file.filename,
            total_pages=total_pages,
            user_id=user_id # Pass extracted user_id
        )
        logger.info(f"Created video record {video_id} for job {job_id} (User: {user_id})")
        
        return JSONResponse({
            "job_id": job_id,
            "filename": file.filename,
            "file_size": len(content),
            "total_pages": total_pages,
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
    Extract content from uploaded PDF and save to database
    """
    try:
        # Find PDF file in upload directory
        upload_dir = storage_service.get_job_dir(job_id, "upload")
        pdf_files = list(upload_dir.glob("*.pdf"))
        
        if not pdf_files:
            raise HTTPException(status_code=404, detail="PDF file not found")
        
        pdf_path = str(pdf_files[0])
        
        # Get video record from database
        video = db.get_video_by_job_id(job_id)
        if not video:
            raise HTTPException(status_code=404, detail="Video record not found")
        
        # Update status
        db.update_video_status(job_id, "extracting")
        
        # Extract content
        logger.info("Running robust extraction logic v2")
        extraction_result = pdf_service.extract_content(pdf_path, job_id)
        
        # Save pages to database
        try:
            # Handle both Pydantic model and dict
            if isinstance(extraction_result, dict):
                pages = extraction_result.get('pages', [])
            else:
                pages = getattr(extraction_result, 'pages', [])
            
            for page_data in pages:
                # Handle both Pydantic model and dict for page_data
                if isinstance(page_data, dict):
                    p_num = page_data.get('page_num')
                    p_text = page_data.get('text')
                    p_title = page_data.get('title')
                    p_images = page_data.get('images', [])
                else:
                    p_num = getattr(page_data, 'page_num', None)
                    p_text = getattr(page_data, 'text', None)
                    p_title = getattr(page_data, 'title', None)
                    p_images = getattr(page_data, 'images', [])

                page_id = db.create_page(
                    video_id=video['id'],
                    page_num=p_num,
                    text=p_text,
                    title=p_title,
                    pdf_image_path=None
                )
                
                # Save extracted images
                for idx, img_path in enumerate(p_images):
                    db.add_page_image(page_id, img_path, idx)
                    
        except Exception as e:
            logger.error(f"Database saving failed: {e}")
            # Don't raise here, we want to return the extraction result even if DB save fails
            # But wait, if DB save fails, video generation won't work.
            # So we SHOULD raise or log critical error.
            # Re-raising for now to be safe.
            raise e
        
        # Update status
        db.update_video_status(job_id, "extracted")
        
        logger.info(f"Saved {len(pages)} pages to database for job {job_id}")
        
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
        from app.services.gtts_service import GTTSService
        from app.services.video_service import VideoService
        from app.services.conversion_service import ConversionService
        
        tts_service = GTTSService(storage_service)
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

