import os
from aiogram import Bot

bot_client = Bot(token=os.getenv("TELEGRAM_BOT_TOKEN"))