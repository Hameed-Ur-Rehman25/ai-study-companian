"""
Summary History Service for managing persistent summaries using Supabase
"""
import logging
from typing import List, Optional
from app.models.summary_models import PDFSummary
from app.core.supabase import supabase, SUPABASE_URL, SUPABASE_KEY
from supabase import create_client, ClientOptions

logger = logging.getLogger(__name__)


class SummaryHistoryService:
    """Service for managing summary persistence via Supabase"""
    
    def __init__(self, user_id: Optional[str] = None, access_token: Optional[str] = None):
        """
        Initialize summary history service
        
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
    
    def create_summary(self, job_id: str, length: str, summary_text: str, pdf_filename: Optional[str] = None) -> Optional[PDFSummary]:
        """
        Save a new summary
        """
        if not self.user_id:
             raise ValueError("User ID is required to create a summary")

        try:
            print(f"DEBUG: Creating summary for user {self.user_id} and job {job_id}")
            data = {
                "user_id": self.user_id,
                "job_id": job_id,
                "length": length,
                "summary_text": summary_text
            }
            if pdf_filename:
                data["pdf_filename"] = pdf_filename
                
            response = self.client.table("pdf_summaries").insert(data).execute()
            
            if not response.data:
                 raise Exception("Failed to save summary in Supabase")

            data = response.data[0]
            
            return PDFSummary(
                id=data['id'],
                job_id=data['job_id'],
                pdf_filename=data.get('pdf_filename'),
                length=data['length'],
                summary_text=data['summary_text'],
                created_at=data['created_at']
            )

        except Exception as e:
            logger.error(f"Error creating summary: {e}")
            raise e
    
    def get_latest_summary(self, job_id: str) -> Optional[PDFSummary]:
        """
        Get the latest summary for a job
        """
        if not self.user_id:
            return None

        try:
            response = self.client.table("pdf_summaries")\
                .select("*")\
                .eq("job_id", job_id)\
                .eq("user_id", self.user_id)\
                .order("created_at", desc=True)\
                .limit(1)\
                .execute()
                
            if not response.data:
                return None
            
            data = response.data[0]
            return PDFSummary(
                id=data['id'],
                job_id=data['job_id'],
                pdf_filename=data.get('pdf_filename'),
                length=data['length'],
                summary_text=data['summary_text'],
                created_at=data['created_at']
            )
            
        except Exception as e:
            logger.error(f"Error getting summary: {e}")
            return None

    def get_all_summaries(self) -> List[PDFSummary]:
        """
        Get all summaries for the current user
        """
        if not self.user_id:
            return []

        try:
            response = self.client.table("pdf_summaries")\
                .select("*")\
                .eq("user_id", self.user_id)\
                .order("created_at", desc=True)\
                .execute()
                
            summaries = []
            for data in response.data:
                summaries.append(PDFSummary(
                    id=data['id'],
                    job_id=data['job_id'],
                    pdf_filename=data.get('pdf_filename'),
                    length=data['length'],
                    summary_text=data['summary_text'],
                    created_at=data['created_at']
                ))
            return summaries
            
        except Exception as e:
            logger.error(f"Error getting all summaries: {e}")
            return []
