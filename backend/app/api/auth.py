from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.utils.telegram_auth import verify_telegram_data
from app.models.user import User
from app.schemas.user import User as UserSchema


router = APIRouter()

@router.post('/telegram', response_model=UserSchema)
async def authentificate_telegram(data: dict, db: AsyncSession = Depends(get_db)):
    auth_data_str = "\n".join([f"{k}={v}" for k, v in data.items()])

    if not verify_telegram_data(auth_data_str):
        raise HTTPException(status_code=400, detail="Invalid Telegram auth data")
    
    telegram_id = data["id"]

    result = await db.execute(select(User).filter(User.telegram+id == telegram_id))
    user = result.scalars().first()

    if not user:
        user = User(
            telegram_id = telegram_id,
            username = data.get("username")
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return user