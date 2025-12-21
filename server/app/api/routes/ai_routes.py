"""
AI routes for Chat and Summary features
"""
import logging
from typing import List, Dict
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.pdf_service import PDFService
from app.services.storage_service import StorageService
from app.services.gemini_service import GeminiService
from app.api.dependencies import get_pdf_service, get_storage_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["AI"])

class ChatRequest(BaseModel):
    job_id: str
    messages: List[Dict[str, str]]

class SummaryRequest(BaseModel):
    job_id: str

def get_gemini_service():
    return GeminiService()

@router.post("/chat")
async def chat_with_pdf(
    request: ChatRequest,
    storage_service: StorageService = Depends(get_storage_service),
    pdf_service: PDFService = Depends(get_pdf_service),
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    """
    Chat with a PDF document
    """
    try:
        # Get PDF content
        upload_dir = storage_service.get_job_dir(request.job_id, "upload")
        pdf_files = list(upload_dir.glob("*.pdf"))
        
        if not pdf_files:
            raise HTTPException(status_code=404, detail="PDF file not found")
            
        pdf_path = str(pdf_files[0])
        extraction_result = pdf_service.extract_content(pdf_path, request.job_id)
        
        # Combine text from all pages
        full_text = "\n".join([page.text for page in extraction_result.pages if page.text])
        
        if not full_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
            
        # Get response from Gemini
        response = await gemini_service.chat_with_pdf(full_text, request.messages)
        
        return {"response": response}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summary")
async def summarize_pdf(
    request: SummaryRequest,
    storage_service: StorageService = Depends(get_storage_service),
    pdf_service: PDFService = Depends(get_pdf_service),
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    """
    Summarize a PDF document
    """
    try:
        # Get PDF content
        upload_dir = storage_service.get_job_dir(request.job_id, "upload")
        pdf_files = list(upload_dir.glob("*.pdf"))
        
        if not pdf_files:
            raise HTTPException(status_code=404, detail="PDF file not found")
            
        pdf_path = str(pdf_files[0])
        extraction_result = pdf_service.extract_content(pdf_path, request.job_id)
        
        # Combine text from all pages
        full_text = "\n".join([page.text for page in extraction_result.pages if page.text])
        
        if not full_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
            
        # Get summary from Gemini
        summary = await gemini_service.summarize_pdf(full_text)
        
        return {"summary": summary}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in summary endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
