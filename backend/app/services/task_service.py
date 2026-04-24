from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload
from datetime import date
from typing import Optional, List
from app.models.task import Task, TaskCompletion
from app.schemas.task import TaskCreate, TaskUpdate
import logging

from app.utils.filter_tasks import task_occurs_on

logger = logging.getLogger(__name__)

class TaskService:
    """Service layer for task-related operations"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, task: TaskCreate, user_id: int) -> Task:
        """Create a new task"""
        db_task = Task(**task.model_dump(), owner_id=user_id)
        self.db.add(db_task)
        await self.db.commit()
        await self.db.refresh(db_task)
        return db_task
    
    async def get(self, task_id: int, user_id: int) -> Optional[Task]:
        """Get a task by ID with ownership verification"""
        result = await self.db.execute(
            select(Task).where(
                Task.id == task_id,
                Task.owner_id == user_id
            )
        )
        return result.scalars().first()
    
    async def get_all(self, user_id: int) -> List[Task]:
        """Get all tasks for a user"""
        result = await self.db.execute(
            select(Task).where(Task.owner_id == user_id)
        )
        return result.scalars().all()
    
    async def update(self, task_id: int, user_id: int, task_update: TaskUpdate) -> Optional[Task]:
        """Update a task"""
        db_task = await self.get(task_id, user_id)
        if not db_task:
            return None
        
        update_data = task_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
        
        await self.db.commit()
        await self.db.refresh(db_task)
        return db_task
    
    async def delete(self, task_id: int, user_id: int) -> bool:
        """Delete a task"""
        db_task = await self.get(task_id, user_id)
        if not db_task:
            return False
        
        await self.db.delete(db_task)
        await self.db.commit()
        return True
    
    async def get_with_completions(self, task_id: int, user_id: int) -> Optional[Task]:
        """Get a task with its completion history"""
        result = await self.db.execute(
            select(Task)
            .where(Task.id == task_id, Task.owner_id == user_id)
            .options(joinedload(Task.completions))  # ← Важно: импортировать joinedload
        )
        return result.scalars().first()
    
    async def get_by_date(self, user_id: int, target_date: date):
        result = await self.db.execute(
            select(Task)
            .options(selectinload(Task.completions))
            .where(Task.owner_id == user_id)
        )

        tasks = []
        for task in result.scalars():
            if not task_occurs_on(task, target_date):
                continue

            completed_today = any(
                c.completed_date == target_date
                for c in task.completions
            )

            tasks.append({
                **task.__dict__,
                "is_completed_today": completed_today
            })

        return tasks

    async def complete_for_date(
        self,
        task_id: int,
        user_id: int,
        target_date: date
    ) -> TaskCompletion:
        task = await self.get(task_id, user_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found or not owned by user")

        if not task_occurs_on(task, target_date):
            raise HTTPException(status_code=400, detail="Task does not occur on this date")
    
        result = await self.db.execute(
            select(TaskCompletion)
            .where(TaskCompletion.task_id == task_id, TaskCompletion.completed_date == target_date)
        )
        exists = result.scalars().first()

        if exists:
            return exists

        completion = TaskCompletion(
            task_id=task_id,
            completed_date=target_date
        )
        if completion.task.owner_id != user_id:
            raise HTTPException(status_code=403, detail="Forbidden")

        
        self.db.add(completion)
        await self.db.commit()
        await self.db.refresh(completion)

        return completion
    
    async def delete_completion_for_date(
        self,
        task_id: int,
        user_id: int,
        target_date: date
    ) -> bool:

        result = await self.db.execute(
            select(TaskCompletion)
            .join(Task)
            .where(
                TaskCompletion.task_id == task_id,
                TaskCompletion.completed_date == target_date,
                Task.owner_id == user_id
            )
        )

        completion = result.scalars().first()

        if not completion:
            return False

        await self.db.delete(completion)
        await self.db.commit()
        return True


    
    async def get_missed_tasks(self, user_id: int) -> List[Task]:
        today = date.today()
        result = await self.db.execute(
            select(Task)
            .options(selectinload(Task.completions))
            .where(Task.owner_id == user_id, Task.due_date < today)
        )
        tasks = result.scalars().all()

        missed = []
        for task in tasks:
            if not any(c.completed_date == today for c in task.completions):
                missed.append(task)
        return missed

    