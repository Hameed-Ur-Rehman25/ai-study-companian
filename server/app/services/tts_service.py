"""
Google Cloud Text-to-Speech service for generating audio narration
"""
import os
import logging
from typing import List, Dict, Optional
from google.cloud import texttospeech
from app.services.storage_service import StorageService

logger = logging.getLogger(__name__)


class TTSService:
    """Service for generating text-to-speech audio using Google Cloud"""
    
    def __init__(self, storage_service: StorageService):
        self.storage_service = storage_service
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Google Cloud TTS client"""
        try:
            credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if credentials_path and os.path.exists(credentials_path):
                os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
            
            self.client = texttospeech.TextToSpeechClient()
            logger.info("Google Cloud TTS client initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Google Cloud TTS client: {e}")
            raise
    
    def generate_audio(
        self,
        text: str,
        job_id: str,
        filename: str,
        voice_name: str = "en-US-Neural2-D",
        language_code: str = "en-US",
        speaking_rate: float = 1.0,
        pitch: float = 0.0
    ) -> Dict[str, any]:
        """
        Generate audio from text
        Returns dict with audio_path and duration
        """
        try:
            # Prepare the synthesis input
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            # Build the voice request
            voice = texttospeech.VoiceSelectionParams(
                language_code=language_code,
                name=voice_name,
                ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
            )
            
            # Select the type of audio file
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=speaking_rate,
                pitch=pitch
            )
            
            # Perform the text-to-speech request
            response = self.client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )
            
            # Save audio file
            audio_path = self.storage_service.save_audio_file(
                job_id, response.audio_content, filename
            )
            
            # Estimate duration (rough calculation: ~150 words per minute)
            word_count = len(text.split())
            estimated_duration = (word_count / 150) * 60  # seconds
            
            return {
                "audio_path": audio_path,
                "duration": estimated_duration,
                "size": len(response.audio_content)
            }
        
        except Exception as e:
            logger.error(f"Error generating audio: {e}")
            raise
    
    def generate_audio_for_pages(
        self,
        pages_text: List[str],
        job_id: str,
        voice_name: str = "en-US-Neural2-D",
        language_code: str = "en-US",
        speaking_rate: float = 1.0,
        pitch: float = 0.0
    ) -> List[Dict[str, any]]:
        """
        Generate audio files for multiple pages
        Returns list of audio file info
        """
        audio_files = []
        
        for page_num, text in enumerate(pages_text, start=1):
            if not text or not text.strip():
                # Skip empty pages
                audio_files.append({
                    "page_num": page_num,
                    "audio_path": None,
                    "duration": 0.0
                })
                continue
            
            filename = f"page_{page_num}_audio.mp3"
            try:
                audio_info = self.generate_audio(
                    text=text,
                    job_id=job_id,
                    filename=filename,
                    voice_name=voice_name,
                    language_code=language_code,
                    speaking_rate=speaking_rate,
                    pitch=pitch
                )
                
                audio_files.append({
                    "page_num": page_num,
                    "audio_path": audio_info["audio_path"],
                    "duration": audio_info["duration"]
                })
            
            except Exception as e:
                logger.error(f"Error generating audio for page {page_num}: {e}")
                audio_files.append({
                    "page_num": page_num,
                    "audio_path": None,
                    "duration": 0.0,
                    "error": str(e)
                })
        
        return audio_files

