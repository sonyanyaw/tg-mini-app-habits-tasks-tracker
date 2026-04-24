from sqlalchemy import Date, DateTime, Integer, String, Boolean, ForeignKey, Enum, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import date, datetime
from enum import Enum as PyEnum

from app.models.user import Base

class RecurrenceType(PyEnum):
    daily = "daily"      
    weekly = "weekly"
    monthly = "monthly"
    custom = "custom"

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    due_date: Mapped[date] = mapped_column(Date, default=date.today)
    
    recurrence_type: Mapped[RecurrenceType] = mapped_column(
        Enum(RecurrenceType, name='recurrencetype', create_type=False), 
        nullable=True
    )
    recurrence_days: Mapped[str | None] = mapped_column(String, nullable=True)  
    recurrence_end_date: Mapped[date | None] = mapped_column(Date, nullable=True)  

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    owner: Mapped["User"] = relationship("User", back_populates="tasks")
    completions: Mapped[list["TaskCompletion"]] = relationship(
        "TaskCompletion", 
        back_populates="task",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
    

class TaskCompletion(Base):
    """История выполнения задач"""
    __tablename__ = "task_completions"
    __table_args__ = (
        UniqueConstraint("task_id", "completed_date"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    task_id: Mapped[int] = mapped_column(Integer, ForeignKey("tasks.id"))
    completed_date: Mapped[date] = mapped_column(Date, index=True)

    task: Mapped["Task"] = relationship("Task", back_populates="completions")