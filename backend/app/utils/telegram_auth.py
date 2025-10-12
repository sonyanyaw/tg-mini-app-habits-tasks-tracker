import hashlib
import hmac

from app.config import settings

import hmac
import hashlib
from urllib.parse import urlencode, urlparse, parse_qs
import logging

logger = logging.getLogger(__name__)

def verify_telegram_data(init_data: str, token: str = settings.TELEGRAM_BOT_TOKEN) -> bool:
    """
    Проверяет подпись данных, полученных от Telegram WebApp.
    :param init_data: Строка initDataRaw из Telegram WebApp.
    :param token: Токен вашего Telegram-бота.
    """
    logger.info(f"Verifying Telegram data: {init_data}") # <-- Логируем входящую строку
    
    try:
        # --- 1. Разбор строки на параметры ---
        parsed_data = parse_qs(init_data) # <-- ВАЖНО: parse_qs, а не split
        logger.debug(f"Parsed data (parse_qs): {parsed_data}")

        # --- 2. Извлечение данных и хэша ---
        # parse_qs возвращает значения как списки, поэтому берем [0]
        data_dict = {k: v[0] for k, v in parsed_data.items()}
        
        # Проверим, есть ли 'hash' в data_dict ДО его извлечения
        if 'hash' not in data_dict:
             logger.error(f"Missing 'hash' key in parsed data. Available keys: {list(data_dict.keys())}")
             return False # <-- Возвращаем False, а не вызываем pop у несуществующего ключа

        received_hash = data_dict.pop('hash') # <-- Теперь безопасно
        logger.debug(f"Received hash: {received_hash}")
        logger.debug(f"Data dict after popping hash: {data_dict}")

        # --- 3. Подготовка данных для подписи ---
        # Сортировка ключей
        sorted_keys = sorted(data_dict.keys())
        # Создание строки в формате key=value, разделённые \n
        data_check_string = '\n'.join([f"{k}={data_dict[k]}" for k in sorted_keys])
        logger.debug(f"Data check string: {data_check_string}")

        # --- 4. Генерация секрета ---
        secret_key = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
        logger.debug(f"Generated secret key")

        # --- 5. Вычисление хэша ---
        calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
        logger.debug(f"Calculated hash: {calculated_hash}")

        # --- 6. Сравнение ---
        is_valid = hmac.compare_digest(calculated_hash, received_hash)
        logger.info(f"Hash comparison result: {is_valid}")
        return is_valid

    except Exception as e:
        logger.exception(f"Error during Telegram data verification: {e}")
        return False