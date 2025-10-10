from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from sqlalchemy.future import select


async def get_current_user(telegram_id: str, db: AsyncSession = Depends(get_db)) -> User:
    result = await db.execute(select(User).filter(User.telegram_id == telegram_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user