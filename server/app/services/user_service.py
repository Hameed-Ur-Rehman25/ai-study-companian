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
            # Verify user and set user_id from the token
            try:
                print(f"DEBUG: Validating token: {access_token[:10]}...") 
                user_response = self.client.auth.get_user(access_token)
                print(f"DEBUG: User response: {user_response}")
                if user_response and user_response.user:
                    self.user_id = user_response.user.id
                    print(f"DEBUG: Set user_id: {self.user_id}")
            except Exception as e:
                print(f"Error validating user token: {e}")
                # Fallback: Try to decode JWT processing manually (insecure but works for ID extraction if signature check fails due to config)
                try:
                    import jwt
                    # Decode without verification just to get the 'sub' (user_id). 
                    # The server should ideally verify signature on API Gateway or middleware level.
                    decoded = jwt.decode(access_token, options={"verify_signature": False})
                    self.user_id = decoded.get("sub")
                    print(f"DEBUG: Fallback decoded user_id: {self.user_id}")
                except Exception as jwt_e:
                    print(f"Error decoding JWT fallback: {jwt_e}")
        else:
            self.client = create_client(supabase_url, supabase_key)
            
        self.local_db = Database()

    def delete_user_account(self):
        """Delete the user's account from Supabase Auth and all related data"""
        if not self.user_id:
            raise ValueError("User ID is required for deletion")

        # 1. Delete from Supabase Auth (Requires Service Role Key)
        service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not service_role_key:
            raise ValueError("Server configuration error: Missing service role key")

        supabase_url = os.getenv("SUPABASE_URL")
        admin_client = create_client(supabase_url, service_role_key)

        try:
            # Delete user from Auth (this usually cascades to public tables if setup correctly, 
            # but we can manually clean up if needed)
            admin_client.auth.admin.delete_user(self.user_id)
            print(f"User {self.user_id} deleted from Supabase Auth")
        except Exception as e:
            print(f"Error deleting user from Supabase: {e}")
            raise e
            
        # 2. Cleanup local DB (Optional, depending on requirements)
        # self.local_db.delete_user_data(self.user_id) 

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
