from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.user import Base

class Task(Base):
    __tablename__ = "tasks"


    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    # id = Column(Integer, primary_key=True, index=True)
    # title = Column(String, index=True)
    # description = Column(String, nullable=True)
    # completed = Column(Boolean, default=False)
    # owner_id = Column(Integer, ForeignKey("user_id"))

    owner: Mapped["User"] = relationship("User", back_populates="tasks")
    # owner = relationship("User", back_populates="tasks")


# User.tasks = relationship("Task", back_populates="owner")