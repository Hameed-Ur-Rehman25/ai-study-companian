from typing import Optional
from supabase import create_client, Client, ClientOptions
import os
from app.models.user_models import UserStats
from app.services.database_service import Database

class UserService:
    def __init__(self, user_id: Optional[str] = None, access_token: Optional[str] = None):
        self.user_id = user_id
        
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        
        if access_token:
            self.client = create_client(
                supabase_url, 
                supabase_key, 
                options=ClientOptions(headers={"Authorization": f"Bearer {access_token}"})
            )
        else:
            self.client = create_client(supabase_url, supabase_key)
            
        self.local_db = Database()

    def get_user_stats(self) -> UserStats:
        # 1. Get Summary Count from Supabase
        summary_count = 0
        if self.user_id:
            try:
                # Assuming RLS filters by user_id automatically if we pass the token
                # Or we explicitly query by user_id if we trust the user_id passed in constructor
                result = self.client.table("pdf_summaries").select("*", count="exact").execute()
                summary_count = result.count if result.count is not None else len(result.data)
            except Exception as e:
                print(f"Error fetching summaries count: {e}")
                
        # 2. Get Chat Session Count from Supabase
        chat_count = 0
        if self.user_id:
             try:
                result = self.client.table("chat_sessions").select("*", count="exact").execute()
                chat_count = result.count if result.count is not None else len(result.data)
             except Exception as e:
                print(f"Error fetching chat count: {e}")
                
        # 3. Get Video Count from Local DB (Global count for now as discussed)
        video_count = 0
        try:
            video_count = self.local_db.get_total_videos()
        except Exception as e:
            print(f"Error fetching video count: {e}")

        return UserStats(
            summary_count=summary_count,
            video_count=video_count, 
            chat_count=chat_count,
            subscription_plan="Free" # Placeholder
        )
