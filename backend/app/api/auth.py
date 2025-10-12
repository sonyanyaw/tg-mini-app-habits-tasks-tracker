import json
import logging
from urllib.parse import parse_qs
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.utils.telegram_auth import verify_telegram_data
from app.models.user import User
from app.schemas.user import User as UserSchema


router = APIRouter()

logger = logging.getLogger(__name__)

@router.post('/telegram', response_model=UserSchema)
async def authentificate_telegram(data: dict, db: AsyncSession = Depends(get_db)):
    try:
        logger.info(f"Received auth data: {data}")

        auth_data_str = data.get("init_data_raw") 
        
        if not auth_data_str:
            logger.error("Missing 'init_data_raw' in request body")
            raise HTTPException(status_code=400, detail="Missing init_data_raw")

        logger.info(f"Parsed auth_data_str: {auth_data_str}") # <-- Логируем строку

        # auth_data_str = "\n".join([f"{k}={v}" for k, v in data.items()])

        if not verify_telegram_data(auth_data_str):
            raise HTTPException(status_code=400, detail="Invalid Telegram auth data")
        
        
        parsed_params = parse_qs(auth_data_str) # <-- Парсим как form-urlencoded
        logger.debug(f"Parsed params: {parsed_params}")
        
        # Извлекаем user JSON (он приходит как строка)
        user_data_json_str = parsed_params.get('user', [None])[0]
        if not user_data_json_str:
             logger.error("Missing 'user' data in initDataRaw")
             raise HTTPException(status_code=400, detail="Missing user data in initDataRaw")
        
        # --- 3. Распарсить JSON строки пользователя ---
        try:
            user_data = json.loads(user_data_json_str) # <-- Преобразуем JSON-строку в словарь
            logger.debug(f"Parsed user data: {user_data}")
        except json.JSONDecodeError as e:
             logger.error(f"Failed to decode user JSON: {e}")
             raise HTTPException(status_code=400, detail="Invalid user data format")

        # --- 4. Извлекаем ID пользователя ---
        telegram_id_str = user_data.get('id')
        if not telegram_id_str:
             logger.error("Missing 'id' in user data")
             raise HTTPException(status_code=400, detail="Missing user ID in data")
        
        # Преобразуем ID в строку (если он не строка) для согласованности
        telegram_id = str(telegram_id_str) 
        logger.info(f"Extracted Telegram ID: {telegram_id}")

        # telegram_id = data["id"]

        result = await db.execute(select(User).filter(User.telegram_id == telegram_id))
        user = result.scalars().first()

        if not user:
            logger.info(f"Creating new user with Telegram ID: {telegram_id}")
            username = user_data.get('username')
            # first_name = user_data.get('first_name')
            # last_name = user_data.get('last_name')
            user = User(
                telegram_id = telegram_id,
                username = username,
                # first_name=first_name,
                # last_name=last_name
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        return user

    except HTTPException: # <-- Пропускаем HTTPException, чтобы он преобразовался в правильный ответ
        raise
    except Exception as e: # <-- Ловим все остальные ошибки
        logger.exception(f"Unexpected error during Telegram auth: {e}") # <-- Записываем в логи с трассировкой
        # Отправляем общую 500 ошибку клиенту
        raise HTTPException(status_code=500, detail="Internal server error during authentication") from e