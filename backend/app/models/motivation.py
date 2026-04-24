from pydantic import BaseModel

class MotivationRequest(BaseModel):
    user_name: str
    habit_name: str
    missed_days: int
    total_days: int
