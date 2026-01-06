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
        subscription_plan = "Free"
        
        if self.user_id:
            try:
                # Get subscription plan from profiles
                profile_result = self.client.table("profiles").select("subscription_tier").eq("id", self.user_id).execute()
                if profile_result.data and len(profile_result.data) > 0:
                     subscription_plan = profile_result.data[0].get("subscription_tier", "Free")

                # Get summaries count
                result = self.client.table("pdf_summaries").select("*", count="exact").execute()
                summary_count = result.count if result.count is not None else len(result.data)
            except Exception as e:
                print(f"Error fetching summaries/profile: {e}")
                
        # 2. Get Chat Session Count from Supabase
        chat_count = 0
        if self.user_id:
             try:
                result = self.client.table("chat_sessions").select("*", count="exact").execute()
                chat_count = result.count if result.count is not None else len(result.data)
             except Exception as e:
                print(f"Error fetching chat count: {e}")
                
        # 3. Get Video Count from Local DB (Filtered by User)
        video_count = 0
        try:
            video_count = self.local_db.get_total_videos(self.user_id)
        except Exception as e:
            print(f"Error fetching video count: {e}")

        return UserStats(
            summary_count=summary_count,
            video_count=video_count, 
            chat_count=chat_count,
            subscription_plan=subscription_plan
        )
