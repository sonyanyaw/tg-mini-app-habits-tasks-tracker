from sqlalchemy import String
from sqlalchemy.orm import declarative_base, Mapped, mapped_column, relationship


Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    telegram_id: Mapped[str] = mapped_column(unique=True, index=True)
    username: Mapped[str] = mapped_column(nullable=True)
    first_name: Mapped[str] = mapped_column(nullable=True)
    last_name: Mapped[str] = mapped_column(nullable=True)

    language: Mapped[str] = mapped_column(String(10), default="en")


    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
    habits: Mapped[list["Habit"]] = relationship("Habit", back_populates="owner", cascade="all, delete-orphan")