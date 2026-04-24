from fastapi import APIRouter, Depends, Header 
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.habit_service import HabitService
from app.schemas.habit import HabitCreate, HabitUpdate, Habit as HabitSchema, HabitCompletionCreate, HabitCompletion as HabitCompletionSchema
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=list[HabitSchema])
async def get_habits(telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    service = HabitService(db)
    db_habits = await service.get_active_habits(user.id)
    return db_habits


@router.post("/", response_model=HabitSchema)
async def create_habit(habit: HabitCreate, telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    service = HabitService(db)
    db_habit = await service.create_habit(habit, user.id)
    return db_habit

@router.patch("/{habit_id}", response_model=HabitSchema)
async def update_habit(habit_id: int, habit_update: HabitUpdate, telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    service = HabitService(db)
    db_habit = await service.update_habit(habit_id, habit_update, user.id)
    return db_habit

@router.delete("/{habit_id}")
async def delete_habit(habit_id: int, telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    service = HabitService(db)
    await service.delete_habit(habit_id, user.id)
    return {"message": "Habit deleted successfully"}

@router.post("/{habit_id}/completion/", response_model=HabitCompletionSchema)
async def update_habit_completion(
    habit_id: int, 
    completion_data: HabitCompletionCreate, 
    telegram_id: str = Header(..., alias="X-Telegram-ID"), 
    db: AsyncSession = Depends(get_db)
):
    user = await get_current_user(telegram_id, db)
    service = HabitService(db)
    new_completion = await service.update_completion(habit_id, user.id, completion_data)
    
    return new_completion
