import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # Use dummy values if not set to avoid import errors, 
    # but actual calls will fail if not configured
    SUPABASE_URL = "https://placeholder.supabase.co"
    SUPABASE_KEY = "placeholder"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)