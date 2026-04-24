import asyncio
from app.celery_app import celery_app
from app.services.motivation_service import send_daily_motivation_to_all

@celery_app.task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 60},
)
def send_daily_motivation(self):
    asyncio.run(send_daily_motivation_to_all())
