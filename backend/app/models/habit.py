from datetime import date
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.user import Base

class Habit(Base):
    __tablename__ = "habits"


    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    frequency: Mapped[str] = mapped_column(String(50))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)  # Активна ли привычка
    duration: Mapped[int] = mapped_column(Integer)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    created_date: Mapped[date] = mapped_column(Date, default=date.today)

    owner: Mapped["User"] = relationship(back_populates="habits")

    completions: Mapped[list["HabitCompletion"]] = relationship(
        "HabitCompletion", 
        back_populates="habit", 
        cascade="all, delete-orphan",
        lazy="selectin"
    )


class HabitCompletion(Base):
    __tablename__ = "habit_completions"

    id: Mapped[int] = mapped_column(primary_key=True)
    habit_id: Mapped[int] = mapped_column(ForeignKey("habits.id"))
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    completion_date: Mapped[date] = mapped_column(Date, default=date.today)

    # Связи
    habit: Mapped["Habit"] = relationship(back_populates="completions")

