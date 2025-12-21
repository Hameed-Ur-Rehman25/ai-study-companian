"""
Chat models for session and message management
"""
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class ChatMessage(BaseModel):
    """Individual chat message"""
    role: str  # 'user' or 'model'
    content: str
    timestamp: str


class ChatSession(BaseModel):
    """Chat session metadata"""
    session_id: str
    job_id: str
    pdf_filename: str
    created_at: str
    updated_at: str


class ChatSessionWithMessages(BaseModel):
    """Complete chat session with all messages"""
    session: ChatSession
    messages: List[ChatMessage]


class CreateSessionRequest(BaseModel):
    """Request to create a new chat session"""
    job_id: str
    pdf_filename: str
