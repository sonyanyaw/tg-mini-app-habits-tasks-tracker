import asyncio
import logging
import os
from aiogram import Bot, Dispatcher, Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo, CallbackQuery
from sqlalchemy import select

from app.database import get_bot_db_session
from app.models import User, Task, Habit  


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
DATABASE_URL = os.getenv("DATABASE_URL")

WEBAPP_URL = os.getenv("WEBAPP_URL")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


router = Router()

def get_text(key: str, lang: str = "en") -> str:
    texts = {
        "start_hello": {
            "ru": "Привет! 👋",
            "en": "Hi! 👋"
        },
        "open_mini_app": {
            "ru": "Нажми кнопку ниже, чтобы открыть Mini App прямо сейчас:",
            "en": "Tap the button below to open the Mini App now:"
        },
        "settings_button": {
            "ru": "⚙️ Настройки",
            "en": "⚙️ Settings"
        },
        "choose_language": {
            "ru": "Выберите язык:",
            "en": "Choose language:"
        },
        "back_button": {
            "ru": "↩️ Назад",
            "en": "↩️ Back"
        },
        "mini_app_label": {
            "ru": "Mini App:",
            "en": "Mini App:"
        }
    }
    return texts.get(key, {}).get(lang, texts[key]["en"])

# --- /start ---
@router.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    # Get user's language preference from the database, default to English if not set
    lang = "en" 
    try:
        async with get_bot_db_session() as session:
            result = await session.execute(
                select(User).where(User.telegram_id == str(message.from_user.id))
            )
            user = result.scalar_one_or_none()
            if user and user.language:
                lang = user.language
    except Exception as e:
        logger.exception("Error fetching user language")

    # Get the localized text for the settings button
    settings_text = get_text("settings_button", lang)
    settings_button = KeyboardButton(text=settings_text)
    keyboard = ReplyKeyboardMarkup(
        keyboard=[[settings_button]],
        resize_keyboard=True
    )

    web_app_button = InlineKeyboardButton(
        text=" habits & tasks",
        web_app=WebAppInfo(url=WEBAPP_URL)
    )
    inline_kb = InlineKeyboardMarkup(inline_keyboard=[[web_app_button]])

    await message.answer(get_text("start_hello", lang), reply_markup=keyboard)
    await message.answer(get_text("open_mini_app", lang), reply_markup=inline_kb)


@router.message(F.text.in_({
    get_text("settings_button", "ru"),
    get_text("settings_button", "en")
}))
async def settings_menu(message: Message):
    # Get user's language preference from the database, default to English if not set
    lang = "en"
    try:
        async with get_bot_db_session() as session:
            result = await session.execute(
                select(User).where(User.telegram_id == str(message.from_user.id))
            )
            user = result.scalar_one_or_none()
            if user and user.language:
                lang = user.language
    except Exception as e:
        logger.exception("Error in settings menu")

    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🇷🇺 Русский"), KeyboardButton(text="🇬🇧 English")],
            [KeyboardButton(text=get_text("back_button", lang))]
        ],
        resize_keyboard=True
    )
    await message.answer(get_text("choose_language", lang), reply_markup=keyboard)


@router.message(F.text.in_({"🇷🇺 Русский", "🇬🇧 English"}))
async def handle_language_text(message: Message):
    lang = "ru" if "Русский" in message.text else "en"
    try:
        async with get_bot_db_session() as session:
            result = await session.execute(
                select(User).where(User.telegram_id == str(message.from_user.id))
            )
            user = result.scalar_one_or_none()
            if user:
                user.language = lang
                await session.commit()
                response = "Язык сохранён! 🇷🇺" if lang == "ru" else "Language saved! 🇬🇧"
            else:
                response = "Сначала откройте приложение, чтобы создать профиль."
    except Exception as e:
        logger.exception("DB error occurred")  
        response = "❌ Ошибка сохранения."

    await message.answer(response)



@router.message(F.text.in_({
    get_text("back_button", "ru"),
    get_text("back_button", "en")
}))
async def go_back(message: Message):
    lang = "en"
    try:
        async with get_bot_db_session() as session:
            result = await session.execute(
                select(User).where(User.telegram_id == str(message.from_user.id))
            )
            user = result.scalar_one_or_none()
            if user and user.language:
                lang = user.language
    except Exception as e:
        logger.exception("Error in go_back")

    settings_text = get_text("settings_button", lang)
    settings_button = KeyboardButton(text=settings_text)
    keyboard = ReplyKeyboardMarkup(
        keyboard=[[settings_button]],
        resize_keyboard=True
    )
    web_app_button = InlineKeyboardButton(
        text=" habits & tasks",
        web_app=WebAppInfo(url=WEBAPP_URL)
    )
    inline_kb = InlineKeyboardMarkup(inline_keyboard=[[web_app_button]])

    await message.answer(get_text("mini_app_label", lang), reply_markup=inline_kb)


@router.callback_query(F.data == "back_to_start")
async def back_to_start(callback: CallbackQuery):
    web_app_button = InlineKeyboardButton(
        text=" habits & tasks",
        web_app=WebAppInfo(url=WEBAPP_URL)
    )
    inline_kb = InlineKeyboardMarkup(inline_keyboard=[[web_app_button]])
    await callback.message.edit_text(
        "Или запусти Mini App прямо сейчас:",
        reply_markup=inline_kb
    )
    await callback.answer()

dp.include_router(router)


async def main() -> None:
    """Главная функция для запуска бота."""
    logger.info("Starting Telegram bot...")

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())

