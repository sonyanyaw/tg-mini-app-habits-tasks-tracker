from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Create the async engine with connection pooling
DATABASE_URL = settings.DATABASE_URL

engine = create_async_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Create a session factory that will generate AsyncSession instances
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

def get_bot_db_session() -> AsyncSession:
    """
    Создаёт новое соединение и сессию для одного запроса.
    Используется ТОЛЬКО в боте.
    """
    engine = create_async_engine(
        DATABASE_URL,
        poolclass=None,    
        echo=False,
    )
    return AsyncSession(bind=engine, expire_on_commit=False, autoflush=False)

# Dependency for FastAPI routes to get a database session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session