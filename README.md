[Читать на русском](./README.ru.md)

# Habit & Task Tracker (Telegram Mini App)

A lightweight Telegram mini‑application for tracking daily habits and tasks. Built with FastAPI (Python) on the server‑side and React + Vite (TypeScript) on the frontend.

## Features

*   **Telegram Authentication:** Secure sign‑in using Telegram user data.
*   **Tasks:** Create, complete and delete tasks.
*   **Habits:** Create habits and track your progress by days of the week.
*   **Calendar:** Select a date to view tasks for that day.

## Technologies

### **Frontend (React + TypeScript + Vite)**

*   **React 18** with hooks.
*   **TypeScript** for strong typing.
*   **Vite** for fast builds.
*   **Redux Toolkit** for state management.
*   **Axios** for HTTP requests.
*   **@telegram-apps/sdk** for integration with Telegram Web App API.

### **Backend (FastAPI + PostgreSQL)**

*   **FastAPI** — a modern, high‑performance web framework for Python 3.12+.
*   **SQLAlchemy 2.0** with async support.
*   **Alembic** for database migrations.
*   **PostgreSQL** (via Supabase) as the main DB.
*   **asyncpg** as the async driver for PostgreSQL.
*   **Pydantic** for data validation.
*   **Aiogram 3.x** (optional) if a Telegram‑bot for notifications is used.

## 📁 Project Structure (Monorepo)
  ```text
    habit-task-tracker/
    ├── backend/                # Backend (Python/FastAPI)
    │   ├── app/                # Основной модуль приложения
    │   │   ├── init.py
    │   │   ├── main.py         # Entry point for FastAPI
    │   │   ├── database.py     # DB connection
    │   │   ├── models/         # SQLAlchemy models
    │   │   ├── schemas/        # Pydantic schemas
    │   │   ├── api/            # API routers
    │   │   │   ├── init.py
    │   │   │   ├── auth.py
    │   │   │   ├── tasks.py
    │   │   │   └── habits.py
    │   │   └── utils/          # Utility functions
    │   │       ├── init.py
    │   │       └── telegram_auth.py # Проверка подписи Telegram initData
    │   ├── alembic/            # Alembic migrations
    │   ├── .env                # Environment variables
    │   ├── requirements.txt    # Python dependencies
    │   └── ...
    ├── frontend/               # Frontend (React/Vite)
    │   ├── public/             # Static files
    │   ├── src/                # Source code
    │   │   ├── components/     # Reusable components
    │   │   ├── pages/          # Application pages
    │   │   ├── hooks/          # Custom hooks
    │   │   ├── store/          # Redux store and slices
    │   │   ├── services/       # API services (axios)
    │   │   └── ...
    │   ├── .env                # Frontend env variables
    │   ├── vite.config.ts      # Vite configuration
    │   └── ...
    ├── .gitignore              # Игнорируемые файлы
    └── README.md               
```

## Getting Started (Local)

### **1. Clone the repository**

```bash
git clone https://github.com/sonyanyaw/tg-mini-app-habits-tasks-tracker.git
cd habit-task-tracker
```
### **2. Setup Backend**

1. Перейдите в папку backend:
```bash
cd backend
```
2. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
# или
venv\Scripts\activate     # Windows
```
3. Install dependencies:
```bash
pip install -r requirements.txt
```
4. Create a .env file with environment variables:
```env
DATABASE_URL=postgresql+asyncpg://postgres:ваш_пароль@ваш_хост:5432/ваша_бд
TELEGRAM_BOT_TOKEN=ваш_токен_бота
```
5. Apply database migrations:
```bash
alembic upgrade head
```
6. Run the server:
```bash
uvicorn app.main:app --reload
```
The backend will be available at http://localhost:8000.

### **3. Setup Frontend**

1. In a new terminal window:
```bash
npm install
```
2. Create a .env file:
```env
VITE_API_BASE_URL=http://localhost:8000
```
3. Start the dev server:
```bash
npm run dev
```
The frontend will be available at http://localhost:5173.

## Deployment 
### Backend (e.g., on Amvera) 

1. Push the backend code.

2. Set the environment variables in Amvera:
    - DATABASE_URL
    - TELEGRAM_BOT_TOKEN
    - PYTHONPATH=/app

3. Deploy the application.
     
### Frontend (e.g., on Vercel)

1. Connect Vercel to your GitHub repository.

2. Set the root directory to frontend.

3. In Project Settings → Build & Development → Output Directory = build.

4. Add environment variables:
    - VITE_API_BASE_URL=<your_backend_amvera_url>
         
5. Vercel will automatically build and deploy the application.
     

## Telegram Bot Setup 

1. Create a bot via @BotFather.
2. Use /newapp to create a mini app.
3. (Optional) Add the Web App button in the bot menu via /setmenubutton.
     
