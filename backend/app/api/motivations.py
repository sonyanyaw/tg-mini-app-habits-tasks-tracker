import os
from fastapi import APIRouter, Depends, HTTPException, Header 
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import date

from app.database import get_db
from app.api.deps import get_current_user
from app.services.ai.gemini import Gemini
from app.models.ai import ChatResponse
# from app.services.habit_service import count_consecutive_missed_days, get_habits_missed_days
from app.services.habit_service import HabitService
from app.services.telegram import send_telegram_message

worker_url = os.getenv("GEMINI_WORKER_URL")

ai_platform = Gemini(worker_url=worker_url)

router = APIRouter()

@router.post("/")
async def generate_motivation(telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    service = HabitService(db)
    missed_habits = await service.get_habits_missed_days(user.id)
    
    habit = missed_habits[0]
    print(habit)
    days_missed = await service.count_consecutive_missed_days(habit)  

    total_tracked_days = (date.today() - habit.created_date).days + 1

    print(user.username, worker_url)
    prompt = f"""
        Ты — дружелюбный, поддерживающий коуч по продуктивности.
        Пользователь {user.username} пропустил привычку {days_missed} уже дня подряд.
        Всего он отслеживал эту привычку {total_tracked_days} дня.
        Напиши короткое (2–3 предложения), тёплое и мотивирующее сообщение на русском языке.
        Не используй шаблонные фразы вроде «Всё получится!». Будь конкретным и искренним.
    """
    
    try:
        response_text = ai_platform.chat(prompt)
    except Exception as e:
        response_text = "Ты всё равно молодец!"

    await send_telegram_message(chat_id=user.telegram_id, text=response_text)
    print(response_text)
    return ChatResponse(response=response_text)

# async def generate_motivation(req: MotivationRequest):
#     # Формируем промпт на русском
#     prompt = f"""
# Ты — дружелюбный, поддерживающий коуч по продуктивности.
# Пользователь {req.user_name} пропустил привычку «{req.habit_name}» уже {req.missed_days} дня(ей) подряд.
# Всего он отслеживал эту привычку {req.total_days} дней.
# Напиши короткое (2–3 предложения), тёплое и мотивирующее сообщение на русском языке.
# Не используй шаблонные фразы вроде «Всё получится!». Будь конкретным и искренним.
# """

#     worker_url = os.getenv("GEMINI_WORKER_URL")  

#     async with httpx.AsyncClient(timeout=10.0) as client:
#         resp = await client.post(worker_url, json={"prompt": prompt})
#         if resp.status_code != 200:
#             raise HTTPException(status_code=500, detail="Ошибка в Worker")

#         gemini_data = resp.json()
#         try:
#             message = gemini_data["candidates"][0]["content"]["parts"][0]["text"]
#         except (KeyError, IndexError):
#             raise HTTPException(status_code=500, detail="Не удалось извлечь текст от Gemini")

#     return {"motivation": message.strip()}