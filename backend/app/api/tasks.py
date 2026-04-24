from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date
from fastapi import Query

from app.database import get_db
from app.schemas.task import TaskCompletionCreate, TaskCreate, TaskUpdate, Task as TaskSchema, TaskCompletion as TaskCompletionSchema
from app.api.deps import get_current_user
from app.services.task_service import TaskService

router = APIRouter()

@router.get("/", response_model=list[TaskSchema])
async def get_tasks(telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)): 
    user = await get_current_user(telegram_id, db)
    service = TaskService(db)
    tasks = await service.get_all(user_id=user.id)
    return tasks

@router.post("/", response_model=TaskSchema)
async def create_task(task: TaskCreate, telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    service = TaskService(db)
    db_task = await service.create(task, user.id)
    return db_task

@router.patch("/{task_id}", response_model=TaskSchema)
async def update_task(task_id: int, task_update: TaskUpdate, telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)): 
    user = await get_current_user(telegram_id, db)
    service = TaskService(db)
    db_task = await service.update(task_id, user.id, task_update)

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found or not owned by user")

    return db_task

@router.delete("/{task_id}")
async def delete_task(task_id: int, telegram_id: str = Header(..., alias="X-Telegram-ID"), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(telegram_id, db)
    service = TaskService(db)
    result = await service.delete(task_id, user.id)

    if not result:
        raise HTTPException(status_code=404, detail="Task not found or not owned by user")
    
    return {"message": "Task deleted successfully"}


@router.get("/by-date", response_model=list[TaskSchema])
async def get_tasks_by_date(
    target_date: date = Query(...),
    telegram_id: str = Header(..., alias="X-Telegram-ID"),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(telegram_id, db)
    service = TaskService(db)
    tasks = await service.get_by_date(user.id, target_date)
    return tasks


@router.post("/{task_id}/completion/", response_model=TaskCompletionSchema)
async def complete_task(
    task_id: int,
    # target_date: date = Body(..., embed=True),
    completion_data: TaskCompletionCreate,
    telegram_id: str = Header(..., alias="X-Telegram-ID"),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(telegram_id, db)
    service = TaskService(db)

    completion = await service.complete_for_date(
        task_id=task_id,
        user_id=user.id,
        target_date=completion_data.completed_date
    )

    return completion

@router.delete("/{task_id}/completion/")
async def delete_completion(
    task_id: int,
    completed_date: date = Query(...),
    telegram_id: str = Header(..., alias="X-Telegram-ID"),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(telegram_id, db)
    service = TaskService(db)
    result = await service.delete_completion_for_date(
        task_id=task_id,
        user_id=user.id,
        target_date=completed_date
    )
    if not result:
        raise HTTPException(status_code=404, detail="Completion not found")

    return {"ok": True}
