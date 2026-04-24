[Читать на русском](./README.ru.md)

# Habit & Task Tracker — Telegram Mini App

A Telegram Mini App for tracking daily habits and tasks. Built as a portfolio project with a clean dark UI, swipe gestures, streak tracking, and a full calendar view.

## Features

- **Telegram Authentication** — secure sign-in using Telegram user data
- **Tasks** — create, complete, and delete tasks; per-date completion history; recurring tasks (daily / weekly / monthly / custom); overdue indicators
- **Habits** — create habits, track streaks with a fire badge, view weekly completion dots
- **Calendar** — full month grid with task and habit dot indicators; tap any day to view and manage tasks
- **Statistics** — active habit count, best streak, monthly completion rate, per-habit progress bars
- **Settings** — Telegram profile card (avatar, name, username), app info
- **Bottom navigation** — Home / Calendar / Stats / Settings tabs
- **Toast notifications** — instant feedback for all user actions
- **Skeleton loaders** — shimmer placeholders while data loads
- **Dark theme** — full dark UI designed for Telegram

## Tech Stack

### Frontend (React + TypeScript + Vite)

- **React 19** with hooks and custom hooks (`useHabits`, `useTasks`, `useMiniCalendar`, `useSwipe`)
- **TypeScript** for strong typing
- **Vite** for fast builds
- **Redux Toolkit** for auth state management
- **Axios** for HTTP requests
- **React Router v6** for client-side navigation
- **@telegram-apps/sdk** for Telegram Web App API integration

### Backend (FastAPI + PostgreSQL)

- **FastAPI** — async Python 3.12+ web framework
- **SQLAlchemy 2.0** with async support and service layer pattern
- **Alembic** for database migrations
- **PostgreSQL** (via Supabase) as the main database
- **asyncpg** — async PostgreSQL driver
- **Pydantic v2** for data validation
- **APScheduler** for scheduled jobs
- **Aiogram 3.x** for the Telegram bot companion

## Project Structure

```text
habit-task-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI entry point + scheduler
│   │   ├── database.py         # DB connection
│   │   ├── config.py           # Environment settings
│   │   ├── models/             # SQLAlchemy models (User, Task, TaskCompletion, Habit)
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── api/                # Route handlers (auth, tasks, habits)
│   │   ├── services/           # Business logic (TaskService, HabitService)
│   │   └── utils/              # Helpers (telegram_auth, filter_tasks)
│   ├── alembic/                # DB migrations
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calendar/       # MiniCalendar + swipe gestures
│   │   │   ├── Habits/         # HabitBlock, HabitsSection
│   │   │   ├── Tasks/          # TasksSection
│   │   │   ├── Layout/         # BottomNav
│   │   │   └── ui/             # Icons, Toast, Skeletons
│   │   ├── pages/              # Dashboard, CalendarPage, StatsPage, SettingsPage, Auth, AddItemPage
│   │   ├── hooks/              # useHabits, useTasks, useMiniCalendar, useSwipe
│   │   ├── services/           # api.ts (Axios)
│   │   ├── store/              # Redux slices
│   │   └── utils/              # date.ts, toast.ts
│   ├── vite.config.ts
│   └── .env
└── README.md
```

## Getting Started (Local)

### 1. Clone the repository

```bash
git clone https://github.com/sonyanyaw/tg-mini-app-habits-tasks-tracker.git
cd habit-task-tracker
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Linux/macOS
# or
venv\Scripts\activate      # Windows

pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
TELEGRAM_BOT_TOKEN=your_bot_token
```

Apply migrations and start the server:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

Backend runs at http://localhost:8000.

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

```bash
npm run dev
```

Frontend runs at http://localhost:5173.

## Deployment

### Backend (e.g. Amvera)

1. Push the backend code.
2. Set environment variables: `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `PYTHONPATH=/app`.
3. Deploy.

### Frontend (e.g. Vercel)

1. Connect Vercel to your GitHub repository.
2. Set root directory to `frontend`.
3. Set Output Directory to `build` in Project Settings → Build & Development.
4. Add environment variable: `VITE_API_BASE_URL=<your_backend_url>`.
5. Vercel will build and deploy automatically.

## Telegram Bot Setup

1. Create a bot via [@BotFather](https://t.me/BotFather).
2. Use `/newapp` to create a Mini App.
3. Optionally add a Web App button via `/setmenubutton`.
