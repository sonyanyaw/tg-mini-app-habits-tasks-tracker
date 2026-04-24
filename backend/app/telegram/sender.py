from app.telegram.bot_client import bot_client

async def send_motivation_to_user(telegram_id: str, message: str) -> bool:
    """
    Отправляет мотивационное сообщение пользователю по telegram_id.
    Возвращает True при успехе, False при ошибке.
    """
    try:
        await bot_client.send_message(chat_id=telegram_id, text=message)
        return True
    except Exception as e:
        print(f"Не удалось отправить сообщение пользователю {telegram_id}: {e}")
        return False