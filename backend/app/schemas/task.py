from datetime import date, datetime
from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class RecurrenceType(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    CUSTOM = "custom"

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None

    due_date: date

class TaskCreate(TaskBase):
    """Schema for creating a task"""
    recurrence_type: Optional[RecurrenceType] = None
    recurrence_days: Optional[str] = None
    recurrence_end_date: Optional[date] = None

class TaskUpdate(BaseModel):
    """Schema for updating a task (all fields are optional)"""
    title: Optional[str] = None
    description: Optional[str] = None

    due_date: Optional[date] = None
    recurrence_type: Optional[RecurrenceType] = None
    recurrence_days: Optional[str] = None
    recurrence_end_date: Optional[date] = None

class TaskCompletionBase(BaseModel):
    task_id: int
    completed_date: date

class TaskCompletionCreate(BaseModel):
    completed_date: date

class TaskCompletion(TaskCompletionBase):
    id: int

    class Config:
        from_attributes = True

class Task(TaskBase):
    """Full task schema for responses"""
    id: int
    owner_id: int
    
    # Recurrence fields
    recurrence_type: Optional[RecurrenceType] = None
    recurrence_days: Optional[str] = None
    recurrence_end_date: Optional[date] = None
    
    created_at: datetime

    completions: Optional[List[TaskCompletion]] = None

    class Config:
        from_attributes = True
