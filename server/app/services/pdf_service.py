"""
PDF processing service for extracting content from PDF files
"""
import os
import logging
from typing import List, Dict, Optional, Tuple
from app.utils.pdf_parser import PDFParser
from app.models.pdf_models import PDFPageContent, PDFExtractionResponse
from app.services.storage_service import StorageService

logger = logging.getLogger(__name__)


class PDFService:
    """Service for processing PDF files"""
    
    def __init__(self, storage_service: StorageService):
        self.storage_service = storage_service
    
    def extract_content(self, pdf_path: str, job_id: str) -> PDFExtractionResponse:
        """
        Extract all content from PDF file
        Returns structured extraction response
        """
        try:
            # Get output directory for this job
            output_dir = str(self.storage_service.get_job_dir(job_id, "temp"))
            
            # Parse PDF
            parser = PDFParser(pdf_path, output_dir)
            pages_data = parser.extract_all_content()
            total_pages = parser.get_page_count()
            
            # Convert to Pydantic models
            pages_content = []
            for page_data in pages_data:
                pages_content.append(PDFPageContent(
                    page_num=page_data['page_num'],
                    text=page_data['text'],
                    images=page_data.get('images', []),
                    title=page_data.get('title'),
                    bullet_points=page_data.get('bullet_points', [])
                ))
            
            return PDFExtractionResponse(
                job_id=job_id,
                total_pages=total_pages,
                pages=pages_content,
                status="extracted"
            )
        
        except Exception as e:
            logger.error(f"Error extracting PDF content: {e}")
            raise
    
    def validate_pdf(self, file_path: str, max_size: int = 52428800) -> Tuple[bool, Optional[str]]:
        """
        Validate PDF file
        Returns (is_valid, error_message)
        """
        try:
            # Check file exists
            if not os.path.exists(file_path):
                return False, "File not found"
            
            # Check file size
            file_size = os.path.getsize(file_path)
            if file_size > max_size:
                return False, f"File size exceeds maximum of {max_size / 1024 / 1024}MB"
            
            if file_size == 0:
                return False, "File is empty"
            
            # Try to open PDF to check if it's valid
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                if len(pdf.pages) == 0:
                    return False, "PDF has no pages"
            
            return True, None
        
        except Exception as e:
            return False, f"Invalid PDF file: {str(e)}"

