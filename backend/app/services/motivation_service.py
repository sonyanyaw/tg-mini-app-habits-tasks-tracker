import os
from datetime import date, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db
from app.services.ai.gemini import generate_motivation_via_worker
import httpx

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

async def send_telegram_message(chat_id: str, text: str):
    if not TELEGRAM_BOT_TOKEN:
        raise ValueError("TELEGRAM_BOT_TOKEN не задан")
    async with httpx.AsyncClient(timeout=10.0) as client:
        await client.post(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
            json={"chat_id": chat_id, "text": text.strip(), "parse_mode": "Markdown"}
        )
        print('?', text)

async def send_daily_motivations():
    print("🔄 Запуск ежедневной мотивации...")
    yesterday = date.today() - timedelta(days=1)
    
    async for session in get_db():
        try:
            # Ищем активные ЕЖЕДНЕВНЫЕ привычки, по которым нет записи за вчера
            query = text("""
                SELECT 
                    u.telegram_id,
                    u.username,
                    h.title
                FROM habits h
                JOIN users u ON h.owner_id = u.id
                LEFT JOIN habit_completions hc 
                    ON h.id = hc.habit_id 
                    AND hc.completion_date = :yesterday
                WHERE 
                    h.is_active = true
                    AND h.frequency = 'daily'
                    AND u.telegram_id IS NOT NULL
                    AND hc.id IS NULL
            """)
            result = await session.execute(query, {"yesterday": yesterday})
            rows = result.fetchall()

            print(f"📧 Найдено {len(rows)} пользователей для мотивации")

            for telegram_id, name, habit_title in rows:
                prompt = f"""
                    Ты — дружелюбный и поддерживающий коуч по привычкам.
                    Пользователь {name or 'друг'} не отметил выполнение привычки «{habit_title}» вчера.
                    Напиши короткое (1–2 предложения), тёплое и ненавязчивое мотивирующее напоминание на русском языке.
                    Не используй шаблонные фразы вроде «Я верю в тебя!». Не начинай с «Привет!».
                """
                try:
                    message = await generate_motivation_via_worker(prompt)
                    # Очистим markdown-спецсимволы, если есть
                    cleaned = message.replace("*", "").replace("_", "")
                    await send_telegram_message(telegram_id, cleaned)
                    print(f"Отправлено {telegram_id}: {habit_title}")
                except Exception as e:
                    print(f"!! Ошибка генерации/отправки для {telegram_id}: {e}")

            await session.commit()
        except Exception as e:
            print(f"!! Критическая ошибка в send_daily_motivations: {e}")
            await session.rollback()