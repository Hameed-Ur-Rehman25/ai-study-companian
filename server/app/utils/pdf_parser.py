"""
PDF parsing utilities for extracting text and images
"""
import pdfplumber
import fitz  # PyMuPDF
from typing import List, Dict, Optional
import os
from PIL import Image
import io


class PDFParser:
    """Parser for extracting content from PDF files"""
    
    def __init__(self, pdf_path: str, output_dir: str):
        self.pdf_path = pdf_path
        self.output_dir = output_dir
        self.images_dir = os.path.join(output_dir, "images")
        os.makedirs(self.images_dir, exist_ok=True)
    
    def extract_text(self) -> List[Dict[str, any]]:
        """
        Extract text from each page of the PDF
        Returns list of page content dictionaries
        """
        pages_content = []
        
        with pdfplumber.open(self.pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, start=1):
                text = page.extract_text() or ""
                
                # Clean and format text
                text = self._clean_text(text)
                
                # Extract structure (simple heuristic)
                lines = text.split('\n')
                title = lines[0] if lines else None
                bullet_points = [line.strip('- •*').strip() 
                               for line in lines[1:] 
                               if line.strip().startswith(('-', '•', '*'))]
                
                pages_content.append({
                    'page_num': page_num,
                    'text': text,
                    'title': title,
                    'bullet_points': bullet_points[:5]  # Limit to 5 bullet points
                })
        
        return pages_content
    
    def extract_images(self) -> List[str]:
        """
        Extract images from PDF and save them
        Returns list of image file paths
        """
        image_paths = []
        doc = fitz.open(self.pdf_path)
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            image_list = page.get_images()
            
            for img_index, img in enumerate(image_list):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Save image
                image_filename = f"page_{page_num + 1}_img_{img_index + 1}.{image_ext}"
                image_path = os.path.join(self.images_dir, image_filename)
                
                with open(image_path, "wb") as img_file:
                    img_file.write(image_bytes)
                
                image_paths.append(image_path)
        
        doc.close()
        return image_paths
    
    def extract_all_content(self) -> List[Dict[str, any]]:
        """
        Extract both text and images from PDF
        Returns complete page content
        """
        pages_content = self.extract_text()
        all_images = self.extract_images()
        
        # Group images by page (simple heuristic)
        images_by_page = {}
        for img_path in all_images:
            # Extract page number from filename
            filename = os.path.basename(img_path)
            if 'page_' in filename:
                try:
                    page_num = int(filename.split('_')[1])
                    if page_num not in images_by_page:
                        images_by_page[page_num] = []
                    images_by_page[page_num].append(img_path)
                except (ValueError, IndexError):
                    pass
        
        # Add images to corresponding pages
        for page_content in pages_content:
            page_num = page_content['page_num']
            page_content['images'] = images_by_page.get(page_num, [])
        
        return pages_content
    
    def _clean_text(self, text: str) -> str:
        """Clean and format extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        text = '\n'.join(lines)
        
        # Remove special characters that might cause issues
        text = text.replace('\x00', '')
        
        return text
    
    def get_page_count(self) -> int:
        """Get total number of pages in PDF"""
        with pdfplumber.open(self.pdf_path) as pdf:
            return len(pdf.pages)

