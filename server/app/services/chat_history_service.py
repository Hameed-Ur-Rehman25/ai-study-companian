"""
Chat History Service for managing persistent chat sessions
"""
import json
import logging
import uuid
from pathlib import Path
from typing import List, Optional, Dict
from datetime import datetime
from app.models.chat_models import ChatSession, ChatMessage, ChatSessionWithMessages

logger = logging.getLogger(__name__)


class ChatHistoryService:
    """Service for managing chat history persistence"""
    
    def __init__(self, storage_dir: str = "storage/sessions"):
        """
        Initialize chat history service
        
        Args:
            storage_dir: Directory to store session files
        """
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self.index_file = self.storage_dir / "index.json"
        self._ensure_index()
    
    def _ensure_index(self):
        """Ensure index file exists"""
        if not self.index_file.exists():
            self.index_file.write_text(json.dumps({}))
    
    def _load_index(self) -> Dict[str, List[str]]:
        """
        Load session index
        
        Returns:
            Dictionary mapping job_id to list of session_ids
        """
        try:
            return json.loads(self.index_file.read_text())
        except Exception as e:
            logger.error(f"Error loading index: {e}")
            return {}
    
    def _save_index(self, index: Dict[str, List[str]]):
        """Save session index"""
        try:
            self.index_file.write_text(json.dumps(index, indent=2))
        except Exception as e:
            logger.error(f"Error saving index: {e}")
    
    def create_session(self, job_id: str, pdf_filename: str) -> ChatSession:
        """
        Create a new chat session
        
        Args:
            job_id: PDF job ID
            pdf_filename: Name of the PDF file
            
        Returns:
            New ChatSession
        """
        session_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        session = ChatSession(
            session_id=session_id,
            job_id=job_id,
            pdf_filename=pdf_filename,
            created_at=now,
            updated_at=now
        )
        
        # Save session
        session_data = ChatSessionWithMessages(
            session=session,
            messages=[]
        )
        self._save_session(session_data)
        
        # Update index
        index = self._load_index()
        if job_id not in index:
            index[job_id] = []
        index[job_id].append(session_id)
        self._save_index(index)
        
        logger.info(f"Created new session {session_id} for job {job_id}")
        return session
    
    def _save_session(self, session_data: ChatSessionWithMessages):
        """Save session to file"""
        session_file = self.storage_dir / f"{session_data.session.session_id}.json"
        try:
            session_file.write_text(session_data.model_dump_json(indent=2))
        except Exception as e:
            logger.error(f"Error saving session: {e}")
    
    def get_session(self, session_id: str) -> Optional[ChatSessionWithMessages]:
        """
        Get a session with all messages
        
        Args:
            session_id: Session ID
            
        Returns:
            ChatSessionWithMessages or None
        """
        session_file = self.storage_dir / f"{session_id}.json"
        
        if not session_file.exists():
            return None
        
        try:
            data = json.loads(session_file.read_text())
            return ChatSessionWithMessages(**data)
        except Exception as e:
            logger.error(f"Error loading session {session_id}: {e}")
            return None
    
    def get_sessions_by_job(self, job_id: str) -> List[ChatSession]:
        """
        Get all sessions for a job
        
        Args:
            job_id: PDF job ID
            
        Returns:
            List of ChatSession objects
        """
        index = self._load_index()
        session_ids = index.get(job_id, [])
        
        sessions = []
        for session_id in session_ids:
            session_data = self.get_session(session_id)
            if session_data:
                sessions.append(session_data.session)
        
        # Sort by updated_at (most recent first)
        sessions.sort(key=lambda x: x.updated_at, reverse=True)
        return sessions
    
    def add_messages(
        self, 
        session_id: str, 
        user_message: str, 
        model_response: str
    ) -> bool:
        """
        Add messages to a session
        
        Args:
            session_id: Session ID
            user_message: User's message content
            model_response: Model's response content
            
        Returns:
            True if successful
        """
        session_data = self.get_session(session_id)
        
        if not session_data:
            logger.error(f"Session {session_id} not found")
            return False
        
        now = datetime.now().isoformat()
        
        # Add user message
        session_data.messages.append(ChatMessage(
            role="user",
            content=user_message,
            timestamp=now
        ))
        
        # Add model response
        session_data.messages.append(ChatMessage(
            role="model",
            content=model_response,
            timestamp=now
        ))
        
        # Update session timestamp
        session_data.session.updated_at = now
        
        # Save
        self._save_session(session_data)
        logger.info(f"Added messages to session {session_id}")
        return True
    
    def delete_session(self, session_id: str) -> bool:
        """
        Delete a session
        
        Args:
            session_id: Session ID
            
        Returns:
            True if successful
        """
        session_file = self.storage_dir / f"{session_id}.json"
        
        if not session_file.exists():
            return False
        
        try:
            # Get session to find job_id
            session_data = self.get_session(session_id)
            if session_data:
                # Remove from index
                index = self._load_index()
                job_id = session_data.session.job_id
                if job_id in index and session_id in index[job_id]:
                    index[job_id].remove(session_id)
                    if not index[job_id]:  # Remove job if no sessions left
                        del index[job_id]
                    self._save_index(index)
            
            # Delete file
            session_file.unlink()
            logger.info(f"Deleted session {session_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting session {session_id}: {e}")
            return False
