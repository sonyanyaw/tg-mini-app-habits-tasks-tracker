from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, tasks, habits


app = FastAPI(title="Habit & Task Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "https://habit-task-tracker-sonyanyaw.vercel.app"
    ],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(habits.router, prefix="/habits", tags=["habits"])

@app.get('/')
def read_root():
    return {"message": "Welcome to the Telegram Mini App API"}