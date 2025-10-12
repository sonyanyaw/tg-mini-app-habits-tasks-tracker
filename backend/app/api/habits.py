from fastapi import APIRouter, Depends, HTTPException, Header 
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.habit import Habit, HabitCompletion
from app.schemas.habit import HabitCreate, HabitUpdate, Habit as HabitSchema, HabitCompletionCreate, HabitCompletion as HabitCompletionSchema
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=list[HabitSchema])
async def get_habits(telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    result = await db.execute(select(Habit).filter(Habit.owner_id == user.id))
    habits = result.scalars().all()
    return habits

@router.post("/", response_model=HabitSchema)
async def create_habit(habit: HabitCreate, telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    db_habit = Habit(**habit.model_dump(), owner_id=user.id) 
    db.add(db_habit)
    await db.commit()
    await db.refresh(db_habit)
    return db_habit

@router.put("/{habit_id}", response_model=HabitSchema)
async def update_habit(habit_id: int, habit_update: HabitUpdate, telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    result = await db.execute(select(Habit).filter(Habit.id == habit_id, Habit.owner_id == user.id))
    db_habit = result.scalars().first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found or not owned by user")
    
    for key, value in habit_update.model_dump(exclude_unset=True).items():
        setattr(db_habit, key, value)

    await db.commit()
    await db.refresh(db_habit)
    return db_habit

@router.delete("/{habit_id}")
async def delete_habit(habit_id: int, telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    result = await db.execute(select(Habit).filter(Habit.id == habit_id, Habit.owner_id == user.id))
    db_habit = result.scalars().first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found or not owned by user")
    
    await db.delete(db_habit) 
    await db.commit()
    return {"message": "Habit deleted successfully"}

@router.post("/{habit_id}/completion/", response_model=HabitCompletionSchema)
async def update_habit_completion(
    habit_id: int, 
    completion_data: HabitCompletionCreate, 
    telegram_id: str = Header(..., alias="X-Telegram-ID"), 
    db: AsyncSession = Depends(get_db)
):
    user = await get_current_user(telegram_id, db)
    
    # Найдём привычку, принадлежащую пользователю
    result = await db.execute(select(Habit).filter(Habit.id == habit_id, Habit.owner_id == user.id))
    db_habit = result.scalars().first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found or not owned by user")

    # Извлекаем дату и статус выполнения из тела запроса
    completion_date = completion_data.completion_date
    completed_status = completion_data.completed

    # Преобразуем строку даты в объект date
    # from datetime import date
    # try:
    #     completion_date = date.fromisoformat(completion_date_str)
    # except ValueError:
    #     raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    # Найдём существующую запись выполнения для этой даты
    result = await db.execute(
        select(HabitCompletion)
        .filter(HabitCompletion.habit_id == habit_id, HabitCompletion.completion_date == completion_date)
    )
    existing_completion = result.scalars().first()

    if existing_completion:
        # Обновляем существующую запись
        existing_completion.completed = completed_status
        await db.commit()
        await db.refresh(existing_completion)
        return existing_completion
    else:
        # Создаём новую запись
        new_completion = HabitCompletion(
            habit_id=habit_id,
            completed=completed_status,
            completion_date=completion_date
        )
        db.add(new_completion)
        await db.commit()
        await db.refresh(new_completion)
        return new_completion
