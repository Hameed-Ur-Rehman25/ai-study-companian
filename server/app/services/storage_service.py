"""
File storage service for managing uploaded files and generated content
"""
import os
import shutil
import uuid
from pathlib import Path
from typing import Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class StorageService:
    """Service for managing file storage"""
    
    def __init__(self, base_dir: str = "./storage"):
        self.base_dir = Path(base_dir)
        self.upload_dir = self.base_dir / "uploads"
        self.output_dir = self.base_dir / "outputs"
        self.temp_dir = self.base_dir / "temp"
        
        # Create directories
        for directory in [self.upload_dir, self.output_dir, self.temp_dir]:
            directory.mkdir(parents=True, exist_ok=True)
    
    def save_uploaded_file(self, file_content: bytes, filename: str) -> str:
        """
        Save uploaded PDF file
        Returns the file path
        """
        job_id = str(uuid.uuid4())
        job_dir = self.upload_dir / job_id
        job_dir.mkdir(exist_ok=True)
        
        file_path = job_dir / filename
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        return str(file_path)
    
    def get_job_dir(self, job_id: str, dir_type: str = "temp") -> Path:
        """Get directory for a specific job"""
        if dir_type == "upload":
            return self.upload_dir / job_id
        elif dir_type == "output":
            return self.output_dir / job_id
        else:
            return self.temp_dir / job_id
    
    def save_audio_file(self, job_id: str, audio_content: bytes, filename: str) -> str:
        """Save generated audio file"""
        job_dir = self.get_job_dir(job_id, "temp")
        job_dir.mkdir(parents=True, exist_ok=True)
        
        audio_path = job_dir / filename
        with open(audio_path, "wb") as f:
            f.write(audio_content)
        
        return str(audio_path)
    
    def save_video_file(self, job_id: str, video_content: bytes, filename: str) -> str:
        """Save generated video file"""
        job_dir = self.get_job_dir(job_id, "output")
        job_dir.mkdir(parents=True, exist_ok=True)
        
        video_path = job_dir / filename
        with open(video_path, "wb") as f:
            f.write(video_content)
        
        return str(video_path)
    
    def get_file_path(self, job_id: str, filename: str, dir_type: str = "output") -> Optional[str]:
        """Get path to a file"""
        job_dir = self.get_job_dir(job_id, dir_type)
        file_path = job_dir / filename
        
        if file_path.exists():
            return str(file_path)
        return None
    
    def cleanup_job(self, job_id: str, keep_output: bool = False):
        """Clean up temporary files for a job"""
        temp_dir = self.get_job_dir(job_id, "temp")
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
        
        if not keep_output:
            upload_dir = self.get_job_dir(job_id, "upload")
            if upload_dir.exists():
                shutil.rmtree(upload_dir)
    
    def cleanup_old_files(self, days: int = 7):
        """Clean up files older than specified days"""
        cutoff_date = datetime.now() - timedelta(days=days)
        
        for directory in [self.upload_dir, self.temp_dir]:
            for item in directory.iterdir():
                if item.is_dir():
                    # Check modification time
                    mtime = datetime.fromtimestamp(item.stat().st_mtime)
                    if mtime < cutoff_date:
                        try:
                            shutil.rmtree(item)
                            logger.info(f"Cleaned up old directory: {item}")
                        except Exception as e:
                            logger.error(f"Error cleaning up {item}: {e}")

