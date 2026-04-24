import json
from datetime import date
from app.models.task import Task, RecurrenceType


def task_occurs_on(task: Task, target_date: date) -> bool:
    if target_date < task.due_date:
        return False

    if task.recurrence_end_date and target_date > task.recurrence_end_date:
        return False

    if not task.recurrence_type:
        return task.due_date == target_date

    if task.recurrence_type == RecurrenceType.daily:
        return True

    if not task.recurrence_days:
        return False

    days = json.loads(task.recurrence_days)

    if task.recurrence_type == RecurrenceType.weekly:
        return target_date.weekday() in days

    if task.recurrence_type in (RecurrenceType.monthly, RecurrenceType.custom):
        return target_date.day in days

    return False
