from datetime import date
from pydantic import BaseModel
from typing import List, Optional

class HabitBase(BaseModel):
    title: str
    description: Optional[str] = None
    frequency: str = None
    is_active: bool = True
    duration: int

class HabitCreate(HabitBase):
    title: str
    description: Optional[str] = None
    frequency: str = None
    duration: int

class HabitUpdate(HabitBase):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class HabitCompletionBase(BaseModel):
    habit_id: int
    completion_date: date
    completed: bool = False

class Habit(HabitBase):
    id: int
    owner_id: int
    created_date: date = date.today
    completions: List[HabitCompletionBase] = []

    class Config:
        from_attributes = True

class HabitCompletionCreate(HabitCompletionBase):
    pass

class HabitCompletionUpdate(BaseModel):
    completed: Optional[bool] = None

class HabitCompletion(HabitCompletionBase):
    id: int

    class Config:
        from_attributes = True