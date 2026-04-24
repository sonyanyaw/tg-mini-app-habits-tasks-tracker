from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.api import auth, tasks, habits, motivations
from app.services.scheduler import send_daily_motivation_to_all
from app.config import settings

app = FastAPI(title="Habit & Task Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(habits.router, prefix="/habits", tags=["habits"])
app.include_router(motivations.router, prefix="/motivate", tags=["motivations"])

scheduler = AsyncIOScheduler()
scheduler.add_job(
    send_daily_motivation_to_all,
    CronTrigger(hour=7, minute=30), 
    id="daily_motivation",
    replace_existing=True
)

scheduler.start()

@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()

@app.get('/')
def read_root():
    return {"message": "Welcome to the Telegram Mini App API"}