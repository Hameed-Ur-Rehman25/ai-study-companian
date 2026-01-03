
"""
Chat History Service for managing persistent chat sessions using Supabase
"""
import logging
import uuid
from typing import List, Optional, Dict
from datetime import datetime
from app.models.chat_models import ChatSession, ChatMessage, ChatSessionWithMessages
from app.core.supabase import supabase, SUPABASE_URL, SUPABASE_KEY
from supabase import create_client, ClientOptions

logger = logging.getLogger(__name__)


class ChatHistoryService:
    """Service for managing chat history persistence via Supabase"""
    
    def __init__(self, user_id: Optional[str] = None):
        """
        Initialize chat history service
        
        Args:
            user_id: The ID of the authenticated user. Required for most operations.
        """
    def __init__(self, user_id: Optional[str] = None, access_token: Optional[str] = None):
        """
        Initialize chat history service
        
        Args:
            user_id: The ID of the authenticated user. Required for most operations.
            access_token: The access token of the authenticated user. Required for RLS.
        """
        self.user_id = user_id
        
        if access_token:
            # Create a new client with the user's token
            self.client = create_client(
                SUPABASE_URL, 
                SUPABASE_KEY, 
                options=ClientOptions(
                    headers={"Authorization": f"Bearer {access_token}"}
                )
            )
        else:
            # Fallback to global client (server-side operations or logic matching)
            self.client = supabase
    
    def create_session(self, job_id: str, pdf_filename: str) -> ChatSession:
        """
        Create a new chat session
        """
        if not self.user_id:
             raise ValueError("User ID is required to create a session")

        try:
            print(f"DEBUG: Creating session for user {self.user_id} and job {job_id}")
            response = self.client.table("chat_sessions").insert({
                "user_id": self.user_id,
                "job_id": job_id,
                "pdf_filename": pdf_filename
            }).execute()
            
            if not response.data:
                 raise Exception("Failed to create session in Supabase")

            data = response.data[0]
            
            return ChatSession(
                session_id=data['id'],
                job_id=data['job_id'],
                pdf_filename=data['pdf_filename'],
                created_at=data['created_at'],
                updated_at=data['updated_at']
            )

        except Exception as e:
            logger.error(f"Error creating session: {e}")
            # Fallback for now if DB fails -> Return a dummy session to not crash, 
            # OR re-raise. Implementing re-raise for better error handling.
            raise e
    
    def get_session(self, session_id: str) -> Optional[ChatSessionWithMessages]:
        """
        Get a session with all messages
        """
        if not self.user_id:
             logger.warning("Attempting to get session without user_id")

        try:
            # 1. Get Session
            session_query = self.client.table("chat_sessions").select("*").eq("id", session_id)
            
            # Apply RLS via user_id check implicitly by policy, but good to be explicit if needed
            # In standard Supabase RLS, auth.uid() handles it. Here we use the service role 
            # or the user's token. Since we are using the python client initialized with ANON key,
            # RLS policies might require us to Set-Cookie or pass JWT. 
            # HOWEVER: The python client usually runs as admin or processes requests.
            # CRITICAL: The prompt implies we are just "connecting". 
            # If using ANON KEY from server side, we don't have the user context attached to the client instance automatically.
            # We strictly rely on the `user_id` filtering in our queries if RLS allows it, OR we need the user's JWT.
            #
            # BUT: We are setting `user_id` in the constructor. We should filter by it manually as a safeguard.
            if self.user_id:
                session_query = session_query.eq("user_id", self.user_id)
                
            session_res = session_query.execute()
            
            if not session_res.data:
                return None
            
            session_data = session_res.data[0]
            
            # 2. Get Messages
            messages_res = self.client.table("chat_messages")\
                .select("*")\
                .eq("session_id", session_id)\
                .order("timestamp", desc=False)\
                .execute()
                
            messages = []
            for msg in messages_res.data:
                messages.append(ChatMessage(
                    role=msg['role'],
                    content=msg['content'],
                    timestamp=msg['timestamp']
                ))
                
            return ChatSessionWithMessages(
                session=ChatSession(
                    session_id=session_data['id'],
                    job_id=session_data['job_id'],
                    pdf_filename=session_data['pdf_filename'],
                    created_at=session_data['created_at'],
                    updated_at=session_data['updated_at']
                ),
                messages=messages
            )
            
        except Exception as e:
            logger.error(f"Error loading session {session_id}: {e}")
            return None
    
    def get_sessions_by_job(self, job_id: str) -> List[ChatSession]:
        """
        Get all sessions for a job
        """
        if not self.user_id:
            return []

        try:
            response = self.client.table("chat_sessions")\
                .select("*")\
                .eq("job_id", job_id)\
                .eq("user_id", self.user_id)\
                .order("updated_at", desc=True)\
                .execute()
                
            sessions = []
            for data in response.data:
                sessions.append(ChatSession(
                    session_id=data['id'],
                    job_id=data['job_id'],
                    pdf_filename=data['pdf_filename'],
                    created_at=data['created_at'],
                    updated_at=data['updated_at']
                ))
            return sessions
            
        except Exception as e:
            logger.error(f"Error getting sessions: {e}")
            return []

    def get_all_sessions(self) -> List[ChatSession]:
        """
        Get all sessions for the current user (across all jobs)
        """
        if not self.user_id:
            return []

        try:
            response = self.client.table("chat_sessions")\
                .select("*")\
                .eq("user_id", self.user_id)\
                .order("updated_at", desc=True)\
                .execute()
                
            sessions = []
            for data in response.data:
                sessions.append(ChatSession(
                    session_id=data['id'],
                    job_id=data['job_id'],
                    pdf_filename=data['pdf_filename'],
                    created_at=data['created_at'],
                    updated_at=data['updated_at']
                ))
            return sessions
            
        except Exception as e:
            logger.error(f"Error getting all sessions: {e}")
            return []
    
    def add_messages(
        self, 
        session_id: str, 
        user_message: str, 
        model_response: str
    ) -> bool:
        """
        Add messages to a session
        """
        try:
            print(f"DEBUG: Adding messages to session {session_id}")
            # Insert User Message
            self.client.table("chat_messages").insert({
                "session_id": session_id,
                "role": "user",
                "content": user_message
            }).execute()
            
            # Insert Model Message
            self.client.table("chat_messages").insert({
                "session_id": session_id,
                "role": "model",
                "content": model_response
            }).execute()
            
            # Update Session Timestamp
            self.client.table("chat_sessions").update({
                "updated_at": datetime.now().isoformat()
            }).eq("id", session_id).execute()
            
            return True
            
        except Exception as e:
            logger.error(f"Error adding messages: {e}")
            return False
    
    def delete_session(self, session_id: str) -> bool:
        """
        Delete a session and its messages (Manual Cascade)
        """
        if not self.user_id:
            return False

        try:
            # 1. Verify ownership and existence
            # We select first to ensure the user owns the session before attempting to delete messages
            check = self.client.table("chat_sessions")\
                .select("id")\
                .eq("id", session_id)\
                .eq("user_id", self.user_id)\
                .execute()
                
            if not check.data:
                logger.warning(f"User {self.user_id} attempted to delete non-existent/unauthorized session {session_id}")
                return False

            # 2. Delete messages (Explicitly cleanup to ensure no orphans if Cascade is missing)
            # Note: RLS on chat_messages should allow this if policies are correct. 
            # If not, and ON DELETE CASCADE exists, the next step handles it.
            try:
                self.client.table("chat_messages").delete().eq("session_id", session_id).execute()
            except Exception as msg_err:
                logger.warning(f"Could not explicitly delete messages for session {session_id}: {msg_err}")
                # Continue to try deleting session anyway (relying on DB cascade as backup)

            # 3. Delete session
            res = self.client.table("chat_sessions").delete().eq("id", session_id).eq("user_id", self.user_id).execute()
            return len(res.data) > 0
            
        except Exception as e:
            logger.error(f"Error deleting session {session_id}: {e}")
            return False
