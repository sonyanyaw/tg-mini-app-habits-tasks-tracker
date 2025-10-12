from datetime import date
from pydantic import BaseModel
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    due_date: date = date.today

class TaskCreate(TaskBase):
    title: str
    description: Optional[str] = None
    due_date: date = date.today
    # pass

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[date] = None

class Task(TaskBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True