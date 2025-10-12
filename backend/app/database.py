from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Создаем асинхронный движок
DATABASE_URL = settings.DATABASE_URL
print(DATABASE_URL)
engine = create_async_engine(
    DATABASE_URL,
    pool_size=5,        # Максимум 5 соединений в пуле
    max_overflow=10,    # Максимум 10 дополнительных соединений
    pool_pre_ping=True, # Проверяет соединение перед использованием
    pool_recycle=300,   # Пересоздаёт соединение каждые 5 минут
)

# Создаем асинхронную сессию
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Зависимость для получения сессии в роутах
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session