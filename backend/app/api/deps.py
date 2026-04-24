from fastapi import Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.user import User
from app.services.task_service import TaskService


async def get_current_user(
    telegram_id: str = Header(..., alias="X-Telegram-ID"),
    db: AsyncSession = Depends(get_db)
) -> User:
    result = await db.execute(select(User).filter(User.telegram_id == telegram_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def get_task_service(
    db: AsyncSession = Depends(get_db)
) -> TaskService:
    """Get an instance of TaskService with the database session"""
    return TaskService(db)