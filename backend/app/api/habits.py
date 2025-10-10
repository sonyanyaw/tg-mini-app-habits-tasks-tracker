from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.habit import Habit
from app.schemas.habit import HabitCreate, HabitUpdate, Habit as HabitSchema
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=list[HabitSchema])
async def get_habits(telegram_id: str, db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    result = await db.execute(select(Habit).filter(Habit.owner_id == user.id))
    habits = result.scalars().all()
    return habits

@router.post("/", response_model=HabitSchema)
async def create_habit(habit: HabitCreate, telegram_id: str, db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    db_habit = Habit(**habit.model_dump(), owner_id=user.id)
    db.add(db_habit)
    await db.commit()
    await db.refresh(db_habit)
    return db_habit

@router.put("/{habit_id}", response_model=HabitSchema)
async def update_habit(habit_id: int, habit_update: HabitUpdate, telegram_id: str, db: AsyncSession = Depends(get_db)):
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
async def delete_habit(habit_id: int, telegram_id: str, db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    result = await db.execute(select(Habit).filter(Habit.id == habit_id, Habit.owner_id == user.id))
    db_habit = result.scalars().first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found or not owner by user")
    
    await db.commit()
    await db.refresh(db_habit)
    return {"message": "Habit deleted successfully"}