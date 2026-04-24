from fastapi import Depends, HTTPException
from datetime import date, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, exists, and_
from app.models.habit import Habit, HabitCompletion
from app.schemas.habit import HabitCreate, HabitUpdate, Habit as HabitSchema, HabitCompletionCreate, HabitCompletion as HabitCompletionSchema


class HabitService:
    """Service class for managing habits and their completions"""
    
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_habit(self, habit_id: int, user_id: int) -> Habit:
        result = await self.db.execute(
            select(Habit).filter(Habit.id == habit_id, Habit.owner_id == user_id)
        )
        habit = result.scalars().first()
        if not habit:
            raise HTTPException(status_code=404, detail="Habit not found or not owned by user")
        return habit
    
    async def create_habit(self, data: HabitCreate, user_id: int) -> Habit:
        habit = Habit(**data.model_dump(), owner_id=user_id)
        self.db.add(habit)
        await self.db.commit()
        await self.db.refresh(habit)
        return habit

    async def update_habit(self, habit_id: int, data: HabitUpdate, user_id: int) -> Habit:
        habit = await self.get_habit(habit_id, user_id)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(habit, key, value)
        await self.db.commit()
        await self.db.refresh(habit)
        return habit

    async def delete_habit(self, habit_id: int, user_id: int):
        habit = await self.get_habit(habit_id, user_id)
        await self.db.delete(habit)
        await self.db.commit()

    async def update_completion(
        self, habit_id: int, user_id: int, completion_data: HabitCompletionCreate
    ) -> HabitCompletion:
        habit = await self.get_habit(habit_id, user_id)
        result = await self.db.execute(
            select(HabitCompletion)
            .filter(HabitCompletion.habit_id == habit_id,
                    HabitCompletion.completion_date == completion_data.completion_date)
        )
        existing = result.scalars().first()
        if existing:
            existing.completed = completion_data.completed
            await self.db.commit()
            await self.db.refresh(existing)
            return existing
        new_completion = HabitCompletion(
            habit_id=habit_id,
            completed=completion_data.completed,
            completion_date=completion_data.completion_date
        )
        self.db.add(new_completion)
        await self.db.commit()
        await self.db.refresh(new_completion)
        return new_completion
    
   