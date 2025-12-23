"""
ElevenLabs TTS service for generating audio from text
"""
import os
import logging
from typing import Tuple, List, Dict
from elevenlabs import generate, save, Voice, VoiceSettings
from pydub import AudioSegment
from app.services.storage_service import StorageService

logger = logging.getLogger(__name__)


class ElevenLabsTTSService:
    """Service for generating speech using ElevenLabs API"""
    
    def __init__(self, storage_service: StorageService):
        self.storage_service = storage_service
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY environment variable is required")
    
    def generate_audio(
        self,
        text: str,
        job_id: str,
        page_num: int,
        voice_id: str = "21m00Tcm4TlvDq8ikWAM"  # Rachel (default)
    ) -> Tuple[str, float]:
        """
        Generate audio from text using ElevenLabs API
        
        Args:
            text: Text to convert to speech
            job_id: Job identifier
            page_num: Page number
            voice_id: ElevenLabs voice ID
            
        Returns:
            Tuple of (audio_file_path, duration_seconds)
        """
        try:
            # Generate audio using ElevenLabs
            audio = generate(
                text=text,
                voice=Voice(
                    voice_id=voice_id,
                    settings=VoiceSettings(
                        stability=0.5,
                        similarity_boost=0.75,
                        style=0.0,
                        use_speaker_boost=True
                    )
                ),
                model="eleven_multilingual_v2",
                api_key=self.api_key
            )
            
            # Save audio to temp file
            temp_dir = self.storage_service.get_job_dir(job_id, "temp")
            temp_dir.mkdir(parents=True, exist_ok=True)
            
            audio_path = temp_dir / f"page_{page_num}_audio.mp3"
            save(audio, str(audio_path))
            
            # Get duration using pydub
            audio_segment = AudioSegment.from_mp3(str(audio_path))
            duration = len(audio_segment) / 1000.0  # Convert ms to seconds
            
            logger.info(f"Generated audio for page {page_num}: {duration:.2f}s")
            
            return str(audio_path), duration
        
        except Exception as e:
            logger.error(f"Error generating audio for page {page_num}: {e}")
            raise
    
    async def generate_audio_for_pages_async(
        self,
        pages_text: List[str],
        job_id: str,
        voice_id: str = "21m00Tcm4TlvDq8ikWAM"
    ) -> List[Dict]:
        """
        Generate audio for multiple pages
        
        Args:
            pages_text: List of text content for each page
            job_id: Job identifier
            voice_id: ElevenLabs voice ID
            
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
                
                audio_files.append({
                    'page_num': page_num,
                    'audio_path': audio_path,
                    'duration': duration
                })
            
            except Exception as e:
                logger.error(f"Failed to generate audio for page {page_num}: {e}")
                # Continue with other pages even if one fails
        
        return audio_files


# Available ElevenLabs voices
AVAILABLE_VOICES = {
    "21m00Tcm4TlvDq8ikWAM": "Rachel (Female, American)",
    "29vD33N1CtxCmqQRPOHJ": "Drew (Male, American)",  
    "EXAVITQu4vr4xnSDxMaL": "Bella (Female, American)",
    "ErXwobaYiN019PkySvjV": "Antoni (Male, American)",
    "MF3mGyEYCl7XYWbV9V6O": "Elli (Female, American)",
    "TxGEqnHWrfWFTfGW9XjX": "Josh (Male, American)",
    "VR6AewLTigWG4xSOukaG": "Arnold (Male, American)",
    "pNInz6obpgDQGcFmaJgB": "Adam (Male, American)",
}
