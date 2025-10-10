from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, Task as TaskSchema
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=list[TaskSchema])
async def get_tasks(telegram_id: str, db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    result = await db.execute(select(Task).filter(Task.owner_id == user.id))
    tasks = result.scalars().all()
    return tasks

@router.post("/", response_model=TaskSchema)
async def create_task(task: TaskCreate, telegram_id: str, db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    db_task = Task(**task.model_dump(), ownder_id=user.id)
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=TaskSchema)
async def update_task(task_id: int, task_update: TaskUpdate, telegram_id: str, db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    result = await db.execute(select(Task).filter(Task.id == task_id, Task.owner_id == user.id))
    db_task = result.scalars().first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found or not owned by user")
    
    for key, value in task_update.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)

    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
async def delete_task(task_id: int, telegram_id: str, db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    result = await db.execute(select(Task).filter(Task.id == task_id, Task.owner_id == user.id))
    db_task = result.scalars().first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found or not owned by user")
    
    await db.commit()
    await db.refresh(db_task)
    return {"message": "Task deleted successfully"}