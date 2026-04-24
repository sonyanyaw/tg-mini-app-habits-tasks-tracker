from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date, timedelta, datetime
from typing import Optional, List
from app.models.task import Task, TaskCompletion, RecurrenceType
import json
import logging

logger = logging.getLogger(__name__)

class RecurringTaskHandler:
    """Обработчик повторяющихся задач (асинхронная версия)"""
    
    @staticmethod
    async def mark_task_completed(
        db: AsyncSession, 
        task_id: int, 
        notes: Optional[str] = None
    ) -> Task:
        """Отметить задачу как выполненную и обработать повторение"""
        # Получить задачу
        result = await db.execute(
            select(Task).filter(Task.id == task_id)
        )
        task = result.scalars().first()
        
        if not task:
            raise ValueError(f"Task {task_id} not found")
        
        # Создать запись в истории
        completion = TaskCompletion(
            task_id=task_id,
            notes=notes,
            streak_count=task.current_streak + 1
        )
        db.add(completion)
        
        # Обновить статистику
        task.completed = True
        task.last_completed_at = datetime.utcnow()
        task.current_streak += 1
        task.longest_streak = max(task.longest_streak, task.current_streak)
        
        await db.commit()
        await db.refresh(task)
        
        # Если задача повторяющаяся, создать следующую
        if task.recurrence_type:
            next_task = await RecurringTaskHandler._create_next_instance(db, task)
            return next_task
        
        return task
    

    
    @staticmethod
    def _find_next_weekday(current_date: date, weekdays: List[int]) -> date:
        """Найти следующий рабочий день из списка (0=понедельник, 6=воскресенье)"""
        next_date = current_date + timedelta(days=1)
        while next_date.weekday() not in weekdays:
            next_date += timedelta(days=1)
        return next_date
    
    @staticmethod
    def _next_month_date(current_date: date, day_of_month: int) -> date:
        """Следующая дата в следующем месяце"""
        next_month = current_date.month + 1
        next_year = current_date.year
        
        if next_month > 12:
            next_month = 1
            next_year += 1
        
        # Обработать случай, когда день не существует в месяце
        try:
            return date(next_year, next_month, day_of_month)
        except ValueError:
            # Если день не существует (например, 31 февраля), взять последний день месяца
            import calendar
            last_day = calendar.monthrange(next_year, next_month)[1]
            return date(next_year, next_month, last_day)
    
    @staticmethod
    def _add_months(source_date: date, months: int) -> date:
        """Добавить месяцы к дате"""
        month = source_date.month - 1 + months
        year = source_date.year + month // 12
        month = month % 12 + 1
        day = min(source_date.day, 
                 [31, 29 if year % 4 == 0 and not year % 100 == 0 or year % 400 == 0 else 28, 
                  31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1])
        return date(year, month, day)
    
    @staticmethod
    async def get_upcoming_recurring_tasks(
        db: AsyncSession, 
        user_id: int, 
        days_ahead: int = 7
    ) -> List[Task]:
        """Получить предстоящие повторяющиеся задачи на ближайшие N дней"""
        from app.utils.filter_tasks import task_occurs_on
        
        result = await db.execute(
            select(Task).filter(Task.owner_id == user_id)
        )
        all_tasks = result.scalars().all()
        
        today = date.today()
        future_date = today + timedelta(days=days_ahead)
        
        upcoming = []
        for task in all_tasks:
            if task.recurrence_type and not task.completed:
                # Проверить, есть ли выполнения в ближайшие дни
                for day_offset in range(days_ahead + 1):
                    check_date = today + timedelta(days=day_offset)
                    if task_occurs_on(task, check_date):
                        upcoming.append(task)
                        break
        
        return upcoming
    
    @staticmethod
    async def check_missed_tasks(db: AsyncSession, user_id: int) -> List[Task]:
        """Найти пропущенные задачи (просроченные и не выполненные)"""
        today = date.today()
        
        result = await db.execute(
            select(Task).filter(
                Task.owner_id == user_id,
                Task.due_date < today,
                Task.completed == False
            )
        )
        return result.scalars().all()