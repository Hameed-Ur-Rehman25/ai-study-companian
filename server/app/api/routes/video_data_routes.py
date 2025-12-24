"""
API endpoint for generating scripts, fetching images, and preparing video data
"""
import os
from fastapi import APIRouter, HTTPException
from app.services.database_service import Database
from app.services.groq_script_service import GroqScriptService
from app.services.unsplash_service import UnsplashService
from app.services.gtts_service import GTTSService
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/video", tags=["Video"])

from app.services.storage_service import StorageService

# Initialize services
db = Database()
groq_service = GroqScriptService()
unsplash_service = UnsplashService()
storage_service = StorageService()
tts_service = GTTSService(storage_service)


@router.post("/generate-scripts/{job_id}")
async def generate_scripts_and_assets(job_id: str):
    """
    Generate AI teacher scripts, fetch Unsplash images, and create audio
    This combines multiple steps into one endpoint
    """
    try:
        # 1. Get pages from database
        pages = db.get_pages_by_job_id(job_id)
        if not pages:
            raise HTTPException(status_code=404, detail="No pages found for this job")
        
        video = db.get_video_by_job_id(job_id)
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        
        db.update_video_status(job_id, "generating_scripts")
        
        # 2. Generate Groq teacher scripts for each page
        logger.info(f"Generating teacher scripts for {len(pages)} pages")
        for page in pages:
            # Generate script
            teacher_script = groq_service.generate_teacher_script(
                page_title=page.get('title', ''),
                page_text=page['original_text'],
                page_num=page['page_num']
            )
            
            # Force Sync: Ensure script starts with title for audio/caption consistency
            page_title = page.get('title', '').strip()
            if page_title and not teacher_script.strip().lower().startswith(page_title.lower()):
                 teacher_script = f"{page_title}. {teacher_script}"
            
            # Update database
            db.update_page_script(page['id'], teacher_script)
            logger.info(f"Generated script for page {page['page_num']}")
        
        # 3. Fetch images (Hybrid Strategy: Unsplash -> Extracted PDF Images)
        db.update_video_status(job_id, "fetching_images")
        logger.info("Fetching images with hybrid strategy")
        
        unsplash_dir = storage_service.get_job_dir(job_id, "unsplash")
        unsplash_dir.mkdir(parents=True, exist_ok=True)
        
        for page in pages:
            image_found = False
            
            # Strategy A: Try Unsplash
            if page.get('title'):
                try:
                    image_path = unsplash_service.fetch_image_for_topic(
                        topic=page['title'],
                        save_dir=unsplash_dir,
                        filename=f"page_{page['page_num']}.jpg"
                    )
                    
                    if image_path:
                        db.update_page_unsplash(
                            page['id'],
                            image_url="",
                            image_path=image_path
                        )
                        logger.info(f"Using Unsplash image for page {page['page_num']}")
                        image_found = True
                except Exception as e:
                    logger.warning(f"Unsplash fetch failed for page {page['page_num']}: {e}")
            
            # Strategy B: Fallback to Extracted PDF Images
            if not image_found:
                logger.info(f"Checking extracted PDF images for fallback on page {page['page_num']}")
                # Get images extracted from this specific page
                # We need to query the database for page_images
                # This requires a slightly more complex query than available in local 'page' dict
                # So we query db directly
                
                # Note: We don't have a direct 'get_images_for_page' method exposed in DB service easily broadly
                # But we can assume if PDF extraction worked, valid images are in page_images table
                # Let's add a quick helper or modify the flow.
                
                # Actually, simpler: We can just use the 'pages' object if we re-fetch it fully?
                # The 'pages' variable above is from 'get_pages_by_job_id', which does NOT join page_images.
                # Let's do a direct DB check for images for this page_id
                pass 
                # See below for implementation in next block integration
                
                # Implementation:
                conn = db.get_connection()
                cursor = conn.cursor()
                cursor.execute("SELECT image_path FROM page_images WHERE page_id = ? ORDER BY position LIMIT 1", (page['id'],))
                row = cursor.fetchone()
                conn.close()
                
                if row and row[0]:
                    # Found an extracted image!
                    extracted_image_path = row[0]
                    # We treat this as the "unsplash" background for consistency in the video generator
                    db.update_page_unsplash(
                        page['id'],
                        image_url="extracted_from_pdf",
                        image_path=extracted_image_path
                    )
                    logger.info(f"Fallback: Using extracted PDF image for page {page['page_num']}")
                    image_found = True
                else:
                    logger.info(f"No background image found for page {page['page_num']} (Unsplash failed + no PDF images)")
        
        # 4. Generate audio from teacher scripts
        db.update_video_status(job_id, "generating_audio")
        logger.info("Generating audio")
        
        audio_dir = storage_service.get_job_dir(job_id, "audio")
        audio_dir.mkdir(parents=True, exist_ok=True)
        
        # Refresh pages to get updated scripts
        pages = db.get_pages_by_job_id(job_id)
        
        for page in pages:
            if page.get('teacher_script'):
                # Generate audio
                audio_path, duration = tts_service.generate_audio(
                    text=page['teacher_script'],
                    job_id=job_id,
                    page_num=page['page_num'],
                    voice_id='en'
                )
                
                # Update database
                db.update_page_audio(page['id'], audio_path, duration)
                logger.info(f"Generated audio for page {page['page_num']}, duration: {duration}s")
        
        # 5. Update final status
        db.update_video_status(job_id, "ready_for_rendering")
        
        return {
            "job_id": job_id,
            "status": "ready_for_rendering",
            "pages_processed": len(pages),
            "message": "Scripts, images, and audio generated successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in generate_scripts_and_assets: {e}")
        db.update_video_status(job_id, "error")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/data/{job_id}")
async def get_video_data(job_id: str):
    """
    Get complete video data for rendering
    Returns all pages with scripts, images, and audio
    """
    try:
        video = db.get_video_by_job_id(job_id)
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        
        pages = db.get_full_page_data(job_id)
        
        # Convert absolute paths to static URLs
        base_url = f"http://{os.getenv('API_HOST', 'localhost')}:{os.getenv('API_PORT', 8000)}/static"
        
        # Helper to convert path
        def path_to_url(path_str):
            if not path_str:
                return None
            try:
                # Find relative path from storage dir
                # Storage dir is at server/storage
                abs_path = Path(path_str).resolve()
                storage_path = Path("storage").resolve()
                
                if str(abs_path).startswith(str(storage_path)):
                    rel_path = abs_path.relative_to(storage_path)
                    return f"{base_url}/{rel_path}"
                return path_str
            except Exception:
                return path_str

        # Transform pages data
        processed_pages = []
        for page in pages:
            # Create a copy to avoid modifying the original row dict if it's reused (though here it's fresh)
            p = dict(page)
            p['pdf_image_path'] = path_to_url(p.get('pdf_image_path'))
            p['unsplash_image_path'] = path_to_url(p.get('unsplash_image_path'))
            p['audio_path'] = path_to_url(p.get('audio_path'))
            p['images'] = [path_to_url(img) for img in p.get('images', [])]
            processed_pages.append(p)
        
        return {
            "job_id": job_id,
            "video": video,
            "pages": processed_pages,
            "total_pages": len(pages),
            "status": video['status']
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting video data: {e}")
        raise HTTPException(status_code=500, detail=str(e))
