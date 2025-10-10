from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Создаем асинхронный движок
DATABASE_URL = settings.DATABASE_URL
engine = create_async_engine(DATABASE_URL)

# Создаем асинхронную сессию
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Зависимость для получения сессии в роутах
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session