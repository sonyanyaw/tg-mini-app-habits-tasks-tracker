from datetime import date
from sqlalchemy import select
import os

from app.database import AsyncSessionLocal 
from app.models.user import User
from app.services.habit_service import HabitService
from app.services.telegram import send_telegram_message
from app.services.ai.gemini import Gemini

ai_platform = Gemini(worker_url=os.getenv("GEMINI_WORKER_URL"))

async def send_daily_motivation_to_all():
    """Отправляет мотивационное сообщение всем пользователям с пропущенными привычками."""
    async with AsyncSessionLocal() as db: 
        result = await db.execute(select(User))
        users = result.scalars().all()
        service = HabitService(db)
        print(f"🔄 Отправка мотиваций {date.today()} для {len(users)} пользователей...")
        for user in users:
            try:
                missed_habits = await service.get_habits_missed_days(user.id)
                if not missed_habits:
                    continue

                habit = missed_habits[0]
                days_missed = await service.count_consecutive_missed_days(habit)
                total_tracked_days = (date.today() - habit.created_date).days + 1

                username = user.username or "друг"
                title = habit.title
                lang = 'english' if user.language=='en' else 'русском'

                def pluralize(n, forms):
                    return forms[2] if n % 100 in (11,12,13,14) else forms[0] if n % 10 == 1 else forms[1] if 2 <= n % 10 <= 4 else forms[2]

                days_word = pluralize(days_missed, ["день", "дня", "дней"])
                total_word = pluralize(total_tracked_days, ["день", "дня", "дней"])

                prompt = f"""
                    Ты — дружелюбный, поддерживающий коуч по продуктивности.
                    Пользователь {username} пропустил привычку «{title}» уже {days_missed} {days_word} подряд.
                    Всего он отслеживал эту привычку {total_tracked_days} {total_word}.
                    Напиши короткое (2–3 предложения), тёплое и мотивирующее сообщение на {lang} языке.
                    Не используй шаблонные фразы. Будь конкретным и искренним.
                """

                try:
                    text = ai_platform.chat(prompt)
                except Exception:
                    text = f"Привет, {username}! Не сдавайся — каждый новый день с привычкой делает тебя сильнее. Ты уже прошёл {total_tracked_days} {total_word}!"

                await send_telegram_message(chat_id=user.telegram_id, text=text)

            except Exception as e:
                print(f"Ошибка при отправке пользователю {user.telegram_id}: {e}")