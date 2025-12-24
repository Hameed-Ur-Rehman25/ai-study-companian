"""
gTTS (Google Text-to-Speech) service - FREE, no API key required
"""
import logging
from typing import Tuple, List, Dict
from gtts import gTTS
from app.services.storage_service import StorageService

logger = logging.getLogger(__name__)


class GTTSService:
    """Service for generating speech using Google Text-to-Speech (FREE)"""
    
    def __init__(self, storage_service: StorageService):
        self.storage_service = storage_service
    
    def generate_audio(
        self,
        text: str,
        job_id: str,
        page_num: int,
        voice_id: str = "en"  # Language code: en, en-us, en-uk, etc.
    ) -> Tuple[str, float]:
        """
        Generate audio from text using gTTS (FREE, no API key needed)
        
        Args:
            text: Text to convert to speech
            job_id: Job identifier
            page_num: Page number
            voice_id: Language/accent code (e.g., 'en', 'en-us', 'en-uk', 'en-au')
            
        Returns:
            Tuple of (audio_file_path, duration_seconds)
        """
        try:
            if not text or not text.strip():
                logger.warning(f"Empty text for page {page_num}, skipping")
                return None, 0
            
            # Generate audio using gTTS
            tts = gTTS(text=text, lang=voice_id.split('-')[0], slow=False)
            
            # Save audio to temp file
            temp_dir = self.storage_service.get_job_dir(job_id, "temp")
            temp_dir.mkdir(parents=True, exist_ok=True)
            
            audio_path = temp_dir / f"page_{page_num}_audio.mp3"
            tts.save(str(audio_path))
            
            # Get duration using mutagen
            from mutagen.mp3 import MP3
            audio = MP3(str(audio_path))
            duration = audio.info.length
            
            logger.info(f"Generated audio for page {page_num}: {duration:.2f}s")
            
            return str(audio_path), duration
        
        except Exception as e:
            logger.error(f"Error generating audio for page {page_num}: {e}")
            raise
    
    async def generate_audio_for_pages_async(
        self,
        pages_text: List[str],
        job_id: str,
        voice_id: str = "en"
    ) -> List[Dict]:
        """
        Generate audio for multiple pages
        
        Args:
            pages_text: List of text content for each page
            job_id: Job identifier
            voice_id: Language code (e.g., 'en', 'es', 'fr')
            
        Returns:
            List of dicts with audio_path, duration, page_num
        """
        audio_files = []
        
        for page_num, text in enumerate(pages_text, start=1):
            if not text or not text.strip():
                logger.warning(f"Skipping empty text for page {page_num}")
                continue
            
            try:
                audio_path, duration = self.generate_audio(
                    text=text,
                    job_id=job_id,
                    page_num=page_num,
                    voice_id=voice_id
                )
                
                if audio_path and duration > 0:
                    audio_files.append({
                        'page_num': page_num,
                        'audio_path': audio_path,
                        'duration': duration
                    })
            
            except Exception as e:
                logger.error(f"Failed to generate audio for page {page_num}: {e}")
                # Continue with other pages even if one fails
        
        return audio_files


# Available voices (language codes)
# gTTS supports many languages - just use the language code
AVAILABLE_VOICES = {
    "en": "English (US)",
    "en-us": "English (US)",
    "en-uk": "English (UK)",
    "en-au": "English (Australia)",
    "en-in": "English (India)",
}
