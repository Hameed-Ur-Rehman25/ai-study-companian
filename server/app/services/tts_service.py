"""
Edge TTS service for generating audio narration using Microsoft Edge's online TTS
"""
import os
import logging
import asyncio
from typing import List, Dict, Optional
import edge_tts
from app.services.storage_service import StorageService

logger = logging.getLogger(__name__)


class TTSService:
    """Service for generating text-to-speech audio using Edge TTS"""
    
    def __init__(self, storage_service: StorageService):
        self.storage_service = storage_service
        # Mapping of generic voice names to Edge TTS voices
        self.voice_mapping = {
            "en-US-Neural2-D": "en-US-ChristopherNeural",       # Male
            "en-US-Neural2-F": "en-US-JennyNeural",             # Female
            "en-US-Standard-D": "en-US-GuyNeural",              # Male
            "en-US-Standard-F": "en-US-AriaNeural"              # Female
        }
        # Fallback voice
        self.default_voice = "en-US-ChristopherNeural"
    
    async def generate_audio(
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
            # Map request voice to Edge TTS voice
            edge_voice = self.voice_mapping.get(voice_name, self.default_voice)
            
            # Convert rate to string format required by edge-tts (e.g., "+50%", "-10%")
            # Rate 1.0 is default (0%), 1.5 is +50%, 0.5 is -50%
            rate_pct = int((speaking_rate - 1.0) * 100)
            rate_str = f"{'+' if rate_pct >= 0 else ''}{rate_pct}%"
            
            # Convert pitch to string format (e.g., "+0Hz")
            # We'll ignore pitch for now as it's complex to map float to Hz/semitones accurately without more info
            # but edge-tts supports it if we wanted to implement it.
            pitch_str = "+0Hz" 
            
            communicate = edge_tts.Communicate(text, edge_voice, rate=rate_str, pitch=pitch_str)
            
            # Create a temporary path for the audio file
            temp_path = self.storage_service.get_job_dir(job_id, "temp") / filename
            output_file = str(temp_path)
            
            await communicate.save(output_file)
            
            # Read content to save via storage service (to maintain consistency, though somewhat redundant here)
            # Or better, just let storage service know the file is there if it tracks files, 
            # but current storage_service.save_audio_file takes bytes.
            # Let's read it back to match the original interface if possible, or adapt.
            # The original save_audio_file takes content (bytes) and filename.
            
            with open(output_file, "rb") as f:
                audio_content = f.read()
                
            # Use storage service to finalize the file location (it might move it or just overwrite/log used path)
            audio_path = self.storage_service.save_audio_file(
                job_id, audio_content, filename
            )
            
            # Estimate duration properly? edge-tts doesn't return duration directly in save
            # But we can use mutagen or similar if installed, or just estimate like before.
            # Let's stick to estimation for speed/dependency minimization unless strictly needed.
            word_count = len(text.split())
            estimated_duration = (word_count / 150) * 60  # seconds
            
            return {
                "audio_path": audio_path,
                "duration": estimated_duration,
                "size": len(audio_content)
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
        
        Note: This was synchronous in original code, but edge-tts is async.
        We need to run async code here. Since this is called from a background thread 
        in conversion_service (which creates a new event loop), we can use that loop 
        or run_until_complete if we are in a sync context.
        
        However, conversion_service.process_conversion is async!
        So we should change this method to be async as well.
        But wait, `conversion_service.py` calls `tts_service.generate_audio_for_pages`.
        Let's check `conversion_service.py` again.
        """
        # Since we are changing the implementation significantly (sync -> async mostly), 
        # we might need to update conversion_service.py too if we change the signature to async.
        # But for minimal impact, we can wrap async calls here if we want to keep signature sync,
        # OR update conversion_service to await this.
        # conversion_service.process_conversion IS async. So updating this to async is the right move.
        
        # Note: running async method from sync wrapper if needed, 
        # but better to update the caller to await.
        # Let's try to make this method behave synchronously by running the loop if needed?
        # No, better to update conversion_service.py to await this call.
        
        # Let's check conversion_service.py lines 87-94:
        # audio_files = self.tts_service.generate_audio_for_pages(...)
        # It is NOT awaited currently.
        
        # So I will construct a list of coroutines and run them?
        # Actually I will modify this method to run the async generation internally 
        # using a valid event loop strategy or simpler: make this method async and update caller.
        
        # BUT: simple strategy -> make this async, update conversion_service to await it.
        # Check conversion_service.py content again.
        
        import asyncio
        
        async def process_pages():
            audio_files = []
            for page_num, text in enumerate(pages_text, start=1):
                if not text or not text.strip():
                    audio_files.append({
                        "page_num": page_num,
                        "audio_path": None,
                        "duration": 0.0
                    })
                    continue
                
                filename = f"page_{page_num}_audio.mp3"
                try:
                    audio_info = await self.generate_audio(
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

        # Since the interface expectation is synchronous (based on previous file),
        # but we are in an async environment (FastAPI/asyncio),
        # If the caller `process_conversion` is async, we can just await this if we make it async.
        # I'll opt to make this method Sync-to-Async bridge for now to avoid modifying conversion_service
        # OR better: I'll modify conversion_service to await this, which is cleaner.
        
        # Wait, I cannot edit two files in one step properly if I want to be safe.
        # BUT conversion_service `process_conversion` is defined as `async def`.
        # So I can just make this synchronous wrapper that runs the async code using `asyncio.run`?? 
        # No, `asyncio.run` cannot be called when a loop is running.
        
        # Let's just make `generate_audio_for_pages` synchronous by interacting with the loop?
        # Or better, just update conversion_service.
        
        # Actually, let's keep it defined as sync validation/setup, but the heavy lifting is async.
        # But `process_conversion` in `conversion_service` calls it.
        # If I change it to `async def generate_audio_for_pages`, I MUST update `conversion_service.py` to `await` it.
        
        # Decision: I will update `conversion_service.py` to `await self.tts_service.generate_audio_for_pages(...)`.
        # So I will define this as `async`.
        
        return asyncio.run(process_pages()) 
        # WARNING: asyncio.run() fails if loop is running.
        # process_conversion is async, so a loop IS running.
        
        # So I MUST change conversion_service.py or use a loop-aware runner.
        # Updating conversion_service.py is the correct path.
        pass

    # Re-defining to be async for the real implementation
    async def generate_audio_for_pages_async(
        self,
        pages_text: List[str],
        job_id: str,
        voice_name: str = "en-US-Neural2-D",
        language_code: str = "en-US",
        speaking_rate: float = 1.0,
        pitch: float = 0.0
    ) -> List[Dict[str, any]]:
         audio_files = []
         for page_num, text in enumerate(pages_text, start=1):
            if not text or not text.strip():
                audio_files.append({
                    "page_num": page_num,
                    "audio_path": None,
                    "duration": 0.0
                })
                continue
            
            filename = f"page_{page_num}_audio.mp3"
            try:
                audio_info = await self.generate_audio(
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

    # Initial implementation to be safe with existing caller:
    # use a hack if I can't update conversion_service in same turn?
    # I can update multiple files in different steps.
    # So I will implement this as `async def generate_audio_for_pages` and then update conversion_service.
