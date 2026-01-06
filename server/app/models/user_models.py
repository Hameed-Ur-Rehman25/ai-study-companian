from pydantic import BaseModel
from typing import Optional

class UserStats(BaseModel):
    summary_count: int
    video_count: int
    chat_count: int
    subscription_plan: str = "Free" # Default for now
    
class UserProfile(BaseModel):
    id: str
    email: str
    stats: UserStats
