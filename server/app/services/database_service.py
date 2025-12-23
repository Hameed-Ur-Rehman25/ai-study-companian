"""
Database models and schema for PDF to Video conversion
Uses SQLite for local storage
"""
import sqlite3
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime
import json
import os


class Database:
    """SQLite database for video generation data"""
    
    def __init__(self, db_path: str = "data/videos.db"):
        self.db_path = db_path
        # Ensure data directory exists
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        self.init_database()
    
    def get_connection(self):
        """Get database connection"""
        return sqlite3.connect(self.db_path)
    
    def init_database(self):
        """Initialize database schema"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Videos table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id TEXT UNIQUE NOT NULL,
                pdf_filename TEXT NOT NULL,
                total_pages INTEGER NOT NULL,
                status TEXT DEFAULT 'processing',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Pages table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                video_id INTEGER NOT NULL,
                page_num INTEGER NOT NULL,
                title TEXT,
                original_text TEXT NOT NULL,
                teacher_script TEXT,
                pdf_image_path TEXT,
                unsplash_image_url TEXT,
                unsplash_image_path TEXT,
                audio_path TEXT,
                duration REAL,
                FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
            )
        """)
        
        # Images extracted from PDF pages
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS page_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_id INTEGER NOT NULL,
                image_path TEXT NOT NULL,
                position INTEGER DEFAULT 0,
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
            )
        """)
        
        conn.commit()
        conn.close()
    
    # Video operations
    def create_video(self, job_id: str, pdf_filename: str, total_pages: int) -> int:
        """Create a new video entry"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO videos (job_id, pdf_filename, total_pages, status)
            VALUES (?, ?, ?, 'extracting')
        """, (job_id, pdf_filename, total_pages))
        
        video_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return video_id
    
    def get_video_by_job_id(self, job_id: str) -> Optional[Dict]:
        """Get video by job_id"""
        conn = self.get_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM videos WHERE job_id = ?", (job_id,))
        row = cursor.fetchone()
        conn.close()
        
        return dict(row) if row else None
    
    def update_video_status(self, job_id: str, status: str):
        """Update video status"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE videos 
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE job_id = ?
        """, (status, job_id))
        
        conn.commit()
        conn.close()
    
    # Page operations
    def create_page(
        self,
        video_id: int,
        page_num: int,
        text: str,
        title: Optional[str] = None,
        pdf_image_path: Optional[str] = None
    ) -> int:
        """Create a new page entry"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO pages (video_id, page_num, title, original_text, pdf_image_path)
            VALUES (?, ?, ?, ?, ?)
        """, (video_id, page_num, title, text, pdf_image_path))
        
        page_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return page_id
    
    def update_page_script(self, page_id: int, teacher_script: str):
        """Update page with teacher script"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE pages SET teacher_script = ? WHERE id = ?
        """, (teacher_script, page_id))
        
        conn.commit()
        conn.close()
    
    def update_page_unsplash(self, page_id: int, image_url: str, image_path: str):
        """Update page with Unsplash image"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE pages 
            SET unsplash_image_url = ?, unsplash_image_path = ?
            WHERE id = ?
        """, (image_url, image_path, page_id))
        
        conn.commit()
        conn.close()
    
    def update_page_audio(self, page_id: int, audio_path: str, duration: float):
        """Update page with audio file"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE pages 
            SET audio_path = ?, duration = ?
            WHERE id = ?
        """, (audio_path, duration, page_id))
        
        conn.commit()
        conn.close()
    
    def get_pages_by_job_id(self, job_id: str) -> List[Dict]:
        """Get all pages for a job"""
        conn = self.get_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT p.* FROM pages p
            JOIN videos v ON p.video_id = v.id
            WHERE v.job_id = ?
            ORDER BY p.page_num
        """, (job_id,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_full_page_data(self, job_id: str) -> List[Dict]:
        """Get complete page data for video rendering"""
        pages = self.get_pages_by_job_id(job_id)
        
        for page in pages:
            # Get associated images
            conn = self.get_connection()
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT image_path FROM page_images
                WHERE page_id = ?
                ORDER BY position
            """, (page['id'],))
            
            images = [row['image_path'] for row in cursor.fetchall()]
            page['images'] = images
            conn.close()
        
        return pages
    
    # Page image operations
    def add_page_image(self, page_id: int, image_path: str, position: int = 0):
        """Add an image extracted from PDF page"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO page_images (page_id, image_path, position)
            VALUES (?, ?, ?)
        """, (page_id, image_path, position))
        
        conn.commit()
        conn.close()
