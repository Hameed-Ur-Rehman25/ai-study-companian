"""
Video generation service for creating videos from PDF pages and audio
"""
import os
import logging
from typing import List, Dict, Optional
from moviepy.editor import (
    ImageClip, AudioFileClip, CompositeVideoClip,
    concatenate_videoclips, TextClip
)
from PIL import Image
import fitz  # PyMuPDF
from app.services.storage_service import StorageService

# Fix for Pillow 10+ compatibility (Image.ANTIALIAS was removed)
# MoviePy still uses the old constant, so we monkey-patch it
if not hasattr(Image, 'ANTIALIAS'):
    Image.ANTIALIAS = Image.Resampling.LANCZOS

logger = logging.getLogger(__name__)


class VideoService:
    """Service for generating videos from PDF pages and audio"""
    
    def __init__(self, storage_service: StorageService):
        self.storage_service = storage_service
    
    def pdf_page_to_image(self, pdf_path: str, page_num: int, output_path: str, dpi: int = 150) -> str:
        """
        Convert a PDF page to an image
        Returns the image file path
        """
        try:
            doc = fitz.open(pdf_path)
            page = doc[page_num - 1]  # PyMuPDF uses 0-based indexing
            
            # Render page to image
            mat = fitz.Matrix(dpi / 72, dpi / 72)  # Scale factor
            pix = page.get_pixmap(matrix=mat)
            
            # Save as PNG
            pix.save(output_path)
            doc.close()
            
            return output_path
        
        except Exception as e:
            logger.error(f"Error converting PDF page {page_num} to image: {e}")
            raise
    
    def create_slide_video(
        self,
        image_path: str,
        audio_path: Optional[str],
        duration: float,
        include_animations: bool = True
    ) -> ImageClip:
        """
        Create a video clip from a slide image and audio
        """
        try:
            # Load image
            img_clip = ImageClip(image_path, duration=duration)
            
            # Resize to standard video dimensions (16:9)
            img_clip = img_clip.resize(height=1080)
            img_clip = img_clip.set_position('center')
            
            # Add fade in/out if animations enabled
            if include_animations:
                img_clip = img_clip.fadein(0.5).fadeout(0.5)
            
            # Add audio if available
            if audio_path and os.path.exists(audio_path):
                try:
                    audio_clip = AudioFileClip(audio_path)
                    # Adjust duration to match audio
                    if audio_clip.duration > duration:
                        duration = audio_clip.duration
                        img_clip = img_clip.set_duration(duration)
                    img_clip = img_clip.set_audio(audio_clip)
                except Exception as e:
                    logger.warning(f"Could not add audio to slide: {e}")
            
            return img_clip
        
        except Exception as e:
            logger.error(f"Error creating slide video: {e}")
            raise
    
    def add_text_overlay(
        self,
        video_clip: ImageClip,
        text: str,
        position: str = "bottom"
    ) -> CompositeVideoClip:
        """Add text overlay to video clip"""
        try:
            if not text or not text.strip():
                return video_clip
            
            # Create text clip
            txt_clip = TextClip(
                text,
                fontsize=40,
                color='white',
                font='Arial-Bold',
                method='caption',
                size=(video_clip.w * 0.8, None),
                align='center'
            ).set_duration(video_clip.duration)
            
            # Position text
            if position == "bottom":
                txt_clip = txt_clip.set_position(('center', video_clip.h * 0.85))
            elif position == "top":
                txt_clip = txt_clip.set_position(('center', video_clip.h * 0.1))
            else:
                txt_clip = txt_clip.set_position('center')
            
            # Composite with original clip
            return CompositeVideoClip([video_clip, txt_clip])
        
        except Exception as e:
            logger.warning(f"Could not add text overlay: {e}")
            return video_clip
    
    def create_transition(self, clip1: ImageClip, clip2: ImageClip, transition_type: str = "fade") -> List[ImageClip]:
        """Create transition between two clips"""
        if transition_type == "fade":
            # Crossfade transition
            clip1 = clip1.fadeout(0.5)
            clip2 = clip2.fadein(0.5)
        elif transition_type == "slide":
            # Slide transition (simple implementation)
            clip1 = clip1.fadeout(0.3)
            clip2 = clip2.fadein(0.3)
        
        return [clip1, clip2]
    
    def generate_video(
        self,
        pdf_path: str,
        pages_data: List[Dict],
        audio_files: List[Dict],
        job_id: str,
        include_animations: bool = True,
        include_transitions: bool = True,
        video_quality: str = "high"
    ) -> str:
        """
        Generate complete video from PDF pages and audio files
        Returns the video file path
        """
        try:
            job_dir = self.storage_service.get_job_dir(job_id, "temp")
            job_dir.mkdir(parents=True, exist_ok=True)
            
            video_clips = []
            
            # Process each page
            for page_data in pages_data:
                page_num = page_data.get('page_num', 1)
                
                # Find corresponding audio
                audio_info = next(
                    (a for a in audio_files if a.get('page_num') == page_num),
                    None
                )
                
                audio_path = audio_info.get('audio_path') if audio_info else None
                duration = audio_info.get('duration', 5.0) if audio_info else 5.0
                
                # Convert PDF page to image
                image_path = os.path.join(job_dir, f"page_{page_num}.png")
                self.pdf_page_to_image(pdf_path, page_num, image_path)
                
                # Create slide video
                slide_clip = self.create_slide_video(
                    image_path=image_path,
                    audio_path=audio_path,
                    duration=max(duration, 3.0),  # Minimum 3 seconds
                    include_animations=include_animations
                )
                
                # Add text overlay if title exists
                if page_data.get('title'):
                    slide_clip = self.add_text_overlay(
                        slide_clip,
                        page_data['title'],
                        position="top"
                    )
                
                video_clips.append(slide_clip)
            
            # Concatenate all clips
            if include_transitions and len(video_clips) > 1:
                # Apply transitions
                final_clips = []
                for i in range(len(video_clips) - 1):
                    transitioned = self.create_transition(
                        video_clips[i],
                        video_clips[i + 1],
                        transition_type="fade"
                    )
                    if i == 0:
                        final_clips.append(transitioned[0])
                    final_clips.append(transitioned[1])
                final_video = concatenate_videoclips(final_clips, method="compose")
            else:
                final_video = concatenate_videoclips(video_clips, method="compose")
            
            # Set video quality
            if video_quality == "high":
                bitrate = "5000k"
            elif video_quality == "medium":
                bitrate = "2500k"
            else:
                bitrate = "1000k"
            
            # Export video
            output_path = os.path.join(job_dir, f"video_{job_id}.mp4")
            final_video.write_videofile(
                output_path,
                fps=24,
                codec='libx264',
                bitrate=bitrate,
                audio_codec='aac',
                preset='medium',
                logger=None  # Suppress moviepy logs
            )
            
            # Clean up clips
            final_video.close()
            for clip in video_clips:
                clip.close()
            
            # Move to output directory
            final_output_path = self.storage_service.get_job_dir(job_id, "output") / f"video_{job_id}.mp4"
            final_output_path.parent.mkdir(parents=True, exist_ok=True)
            
            import shutil
            shutil.move(output_path, str(final_output_path))
            
            return str(final_output_path)
        
        except Exception as e:
            logger.error(f"Error generating video: {e}")
            raise

