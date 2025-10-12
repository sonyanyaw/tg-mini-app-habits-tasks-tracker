# backend/telegram_bot.py

import asyncio
import logging
from aiogram import Bot, Dispatcher, Router, F
from aiogram.filters import CommandStart
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# --- Настройка логирования ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Конфигурация ---
# ВАЖНО: Замените 'YOUR_BOT_TOKEN_HERE' на токен, полученный от @BotFather
BOT_TOKEN = "8308372223:AAG01TsA8xIZ2V8w9J3KLaEa14I_ARAI8G8"

# ВАЖНО: Замените на URL вашего фронтенда
# Это может быть ваш ngrok/localtunnel URL или финальный домен
WEBAPP_URL = "https://early-pets-retire.loca.lt" # <-- ЗАМЕНИТЕ НА СВОЙ URL

# --- Инициализация бота и диспетчера ---
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# Создаем роутер для обработчиков команд и сообщений
router = Router()

# --- Обработчик команды /start ---
@router.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    """
    Отправляет приветственное сообщение с кнопкой для запуска Telegram Mini App.
    """
    logger.info(f"User {message.from_user.id} started the bot.")

    # --- Создаем кнопку Web App ---
    web_app_button = InlineKeyboardButton(
        text=" habits & tasks", # Текст на кнопке
        web_app=WebAppInfo(url=WEBAPP_URL) # URL вашего фронтенда
    )
    
    # --- Создаем клавиатуру с одной кнопкой ---
    keyboard = InlineKeyboardMarkup(inline_keyboard=[[web_app_button]])

    # --- Отправляем сообщение с клавиатурой ---
    await message.answer(
        "Привет! 👋\nНажми кнопку ниже, чтобы открыть приложение для отслеживания привычек и задач:",
        reply_markup=keyboard
    )

# --- Регистрируем роутер в диспетчере ---
dp.include_router(router)

# --- Функция для запуска бота ---
async def main() -> None:
    """Главная функция для запуска бота."""
    logger.info("Starting Telegram bot...")
    # Бесконечный цикл polling (опроса) обновлений от Telegram
    await dp.start_polling(bot)

# --- Точка входа ---
if __name__ == "__main__":
    # Запускаем главную функцию
    asyncio.run(main())
