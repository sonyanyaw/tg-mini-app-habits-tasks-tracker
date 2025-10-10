from datetime import date
from pydantic import BaseModel
from typing import Optional

class HabitBase(BaseModel):
    title: str
    description: Optional[str] = None
    frequency: str = None
    is_active: bool = True
    duration: int

class HabitCreate(HabitBase):
    pass

class HabitUpdate(HabitBase):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class Habit(HabitBase):
    id: int
    owner_id: int
    created_date: date
    completions: List[HabitCompletionBase] = []

    class Config:
        from_attributes = True


class HabitCompletionBase(BaseModel):
    id: int
    habit_id: int
    completion_date: date
    completed: bool = False

class HabitCompletionCreate(HabitCompletionBase):
    pass

class HabitCompletionUpdate(BaseModel):
    completed: Optional[bool] = None

class HabitCompletion(HabitCompletionBase):
    id: int

    class Config:
        from_attributes = True