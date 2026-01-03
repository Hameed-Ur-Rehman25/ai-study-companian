"""
AI routes for Chat and Summary features
"""
import logging
from typing import List, Dict, Optional
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.services.pdf_service import PDFService
from app.services.storage_service import StorageService
from app.services.groq_service import GroqService
from app.services.chunking_service import ChunkingService
from app.services.chat_history_service import ChatHistoryService
from app.models.chat_models import ChatSession, ChatSessionWithMessages, CreateSessionRequest
from app.api.dependencies import get_pdf_service, get_storage_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["AI"])

class ChatRequest(BaseModel):
    job_id: str
    messages: List[Dict[str, str]]
    session_id: Optional[str] = None

class SummaryRequest(BaseModel):
    job_id: str
    length: str = "standard"  # brief, standard, detailed

def get_ai_service():
    """Get AI service (using Groq)"""
    return GroqService()

def get_chunking_service():
    return ChunkingService()

from app.api.dependencies import get_current_user, security

def get_chat_history_service(
    user: dict = Depends(get_current_user), 
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    return ChatHistoryService(user_id=user.id, access_token=credentials.credentials)

@router.post("/chat")
async def chat_with_pdf(
    request: ChatRequest,
    storage_service: StorageService = Depends(get_storage_service),
    pdf_service: PDFService = Depends(get_pdf_service),
    ai_service: GroqService = Depends(get_ai_service),
    chunking_service: ChunkingService = Depends(get_chunking_service),
    chat_history_service: ChatHistoryService = Depends(get_chat_history_service)
):
    """
    Chat with a PDF document with chunking support
    """
    try:
        # Get PDF content
        upload_dir = storage_service.get_job_dir(request.job_id, "upload")
        pdf_files = list(upload_dir.glob("*.pdf"))
        
        if not pdf_files:
            raise HTTPException(status_code=404, detail="PDF file not found")
            
        pdf_path = str(pdf_files[0])
        pdf_filename = pdf_files[0].name
        extraction_result = pdf_service.extract_content(pdf_path, request.job_id)
        
        # Combine text from all pages
        full_text = "\n".join([page.text for page in extraction_result.pages if page.text])
        
        if not full_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Get or create session
        session_id = request.session_id
        if not session_id:
            # Create new session
            session = chat_history_service.create_session(request.job_id, pdf_filename)
            session_id = session.session_id
        
        # Get user's current question
        current_question = request.messages[-1]['content'] if request.messages else ""
        print(f"DEBUG: Current question: {current_question}")
        
        # Create chunks and get relevant ones
        chunks = chunking_service.create_chunks(full_text)
        relevant_chunks = chunking_service.get_relevant_chunks(chunks, current_question)
        context = chunking_service.build_context(relevant_chunks)
        
        logger.info(f"Using {len(relevant_chunks)} chunks for context")
        
        # Get response from AI service
        print("DEBUG: Calling AI service...")
        response = await ai_service.chat_with_pdf(context, request.messages)
        print("DEBUG: AI service response received")
        
        # Save messages to history
        chat_history_service.add_messages(session_id, current_question, response)
        
        return {
            "response": response,
            "session_id": session_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Error in chat endpoint: {e}")
        import traceback
        traceback.print_exc()
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summary")
async def summarize_pdf(
    request: SummaryRequest,
    storage_service: StorageService = Depends(get_storage_service),
    pdf_service: PDFService = Depends(get_pdf_service),
    ai_service: GroqService = Depends(get_ai_service)
):
    """
    Summarize a PDF document with specified length
    """
    try:
        # Validate length parameter
        valid_lengths = ['brief', 'standard', 'detailed']
        if request.length not in valid_lengths:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid length. Must be one of: {', '.join(valid_lengths)}"
            )
        
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
            
        # Get summary from AI service with specified length
        summary = await ai_service.summarize_pdf(full_text, length=request.length)
        
        return {"summary": summary}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in summary endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions")
async def get_all_sessions(
    chat_history_service: ChatHistoryService = Depends(get_chat_history_service)
):
    """
    Get all chat sessions for the current user across all jobs
    """
    try:
        sessions = chat_history_service.get_all_sessions()
        return {"sessions": sessions}
    except Exception as e:
        logger.error(f"Error getting all sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{job_id}")
async def get_sessions(
    job_id: str,
    chat_history_service: ChatHistoryService = Depends(get_chat_history_service)
):
    """
    Get all chat sessions for a job
    """
    try:
        sessions = chat_history_service.get_sessions_by_job(job_id)
        return {"sessions": sessions}
    except Exception as e:
        logger.error(f"Error getting sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session/{session_id}")
async def get_session(
    session_id: str,
    chat_history_service: ChatHistoryService = Depends(get_chat_history_service)
):
    """
    Get a specific session with all messages
    """
    try:
        session_data = chat_history_service.get_session(session_id)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")
        return session_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sessions/new")
async def create_new_session(
    request: CreateSessionRequest,
    chat_history_service: ChatHistoryService = Depends(get_chat_history_service)
):
    """
    Create a new chat session
    """
    try:
        session = chat_history_service.create_session(request.job_id, request.pdf_filename)
        return {"session": session}
    except Exception as e:
        logger.error(f"Error creating session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/session/{session_id}")
async def delete_session(
    session_id: str,
    chat_history_service: ChatHistoryService = Depends(get_chat_history_service)
):
    """
    Delete a chat session
    """
    try:
        success = chat_history_service.delete_session(session_id)
        if not success:
            raise HTTPException(status_code=404, detail="Session not found")
        return {"message": "Session deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting session: {e}")
        raise HTTPException(status_code=500, detail=str(e))
