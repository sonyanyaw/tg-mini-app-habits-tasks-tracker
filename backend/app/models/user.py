# from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base, Mapped, mapped_column, relationship

# from app.models.habit import Habit
# from app.models.task import Task

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    telegram_id: Mapped[str] = mapped_column(unique=True, index=True)
    username: Mapped[str] = mapped_column(nullable=True)

    # id = Column(Integer, primary_key=True, index=True)
    # telegram_id = Column(String, unique=True, index=True)
    # username = Column(String, nullable=True)
    # first_name = Column(String, nullable=True)
    # last_name = Column(String, nullable=True)

    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
    habits: Mapped[list["Habit"]] = relationship("Habit", back_populates="owner", cascade="all, delete-orphan")