"""
Summary models for persistence
"""
from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class PDFSummary(BaseModel):
    """PDF Summary model"""
    id: str
    job_id: str
    pdf_filename: Optional[str] = None
    length: str
    summary_text: str
    created_at: str
