"""
Background conversion service for processing PDF to video conversions
"""
import asyncio
import logging
from datetime import datetime
from typing import Dict
from app.services.pdf_service import PDFService
from app.services.tts_service import TTSService
from app.services.video_service import VideoService
from app.services.storage_service import StorageService
from app.models.pdf_models import ConversionRequest

logger = logging.getLogger(__name__)

# In-memory job status storage (in production, use Redis or database)
job_statuses: Dict[str, Dict] = {}


class ConversionService:
    """Service for managing PDF to video conversions"""
    
    def __init__(
        self,
        storage_service: StorageService,
        pdf_service: PDFService,
        tts_service: TTSService,
        video_service: VideoService
    ):
        self.storage_service = storage_service
        self.pdf_service = pdf_service
        self.tts_service = tts_service
        self.video_service = video_service
    
    def update_status(
        self,
        job_id: str,
        status: str,
        progress: float,
        current_step: str,
        error_message: str = None
    ):
        """Update job status"""
        if job_id not in job_statuses:
            job_statuses[job_id] = {
                'job_id': job_id,
                'status': status,
                'progress': progress,
                'current_step': current_step,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
            }
        else:
            job_statuses[job_id].update({
                'status': status,
                'progress': progress,
                'current_step': current_step,
                'updated_at': datetime.now().isoformat(),
            })
        
        if error_message:
            job_statuses[job_id]['error_message'] = error_message
    
    async def process_conversion(self, request: ConversionRequest):
        """
        Process PDF to video conversion asynchronously
        """
        job_id = request.job_id
        
        try:
            # Step 1: Extract PDF content
            self.update_status(job_id, 'extracting', 10.0, 'Extracting content from PDF...')
            
            upload_dir = self.storage_service.get_job_dir(job_id, "upload")
            pdf_files = list(upload_dir.glob("*.pdf"))
            
            if not pdf_files:
                raise Exception("PDF file not found")
            
            pdf_path = str(pdf_files[0])
            extraction_result = self.pdf_service.extract_content(pdf_path, job_id)
            
            # Step 2: Generate audio
            self.update_status(job_id, 'generating_audio', 30.0, 'Generating AI narration...')
            
            pages_text = [page.text for page in extraction_result.pages]
            audio_files = self.tts_service.generate_audio_for_pages(
                pages_text=pages_text,
                job_id=job_id,
                voice_name=request.voice_name,
                language_code=request.language_code,
                speaking_rate=request.speaking_rate,
                pitch=request.pitch
            )
            
            # Step 3: Create video
            self.update_status(job_id, 'creating_video', 70.0, 'Creating video with animations...')
            
            pages_data = [
                {
                    'page_num': page.page_num,
                    'title': page.title,
                    'text': page.text,
                }
                for page in extraction_result.pages
            ]
            
            video_path = self.video_service.generate_video(
                pdf_path=pdf_path,
                pages_data=pages_data,
                audio_files=audio_files,
                job_id=job_id,
                include_animations=request.include_animations,
                include_transitions=request.include_transitions,
                video_quality=request.video_quality
            )
            
            # Step 4: Complete
            self.update_status(job_id, 'completed', 100.0, 'Conversion completed!')
            
            logger.info(f"Conversion completed for job {job_id}")
        
        except Exception as e:
            logger.error(f"Error processing conversion for job {job_id}: {e}")
            self.update_status(
                job_id,
                'failed',
                0.0,
                'Conversion failed',
                error_message=str(e)
            )
            raise
    
    def start_conversion(self, request: ConversionRequest):
        """Start conversion in background"""
        # In production, use Celery or similar task queue
        # For now, run in background thread
        import threading
        
        def run_conversion():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                loop.run_until_complete(self.process_conversion(request))
            finally:
                loop.close()
        
        thread = threading.Thread(target=run_conversion, daemon=True)
        thread.start()
        
        return request.job_id

