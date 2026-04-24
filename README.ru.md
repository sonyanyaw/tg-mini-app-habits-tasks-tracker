[Read in English](./README.md)

# Habit & Task Tracker — Telegram Mini App

Мини-приложение Telegram для отслеживания ежедневных привычек и задач. Создано как портфолио-проект с тёмным интерфейсом, жестами свайпа, отслеживанием серий и полноценным календарём.

## Возможности

- **Аутентификация через Telegram** — безопасный вход с использованием данных пользователя Telegram
- **Задачи** — создание, выполнение и удаление задач; история выполнений по датам; повторяющиеся задачи (ежедневно / еженедельно / ежемесячно / произвольно); индикаторы просроченных задач
- **Привычки** — создание привычек, отслеживание серий (streak) с иконкой огня, точки выполнения по дням недели
- **Календарь** — полноценная сетка месяца с точками задач и привычек; выбор дня для просмотра и управления задачами
- **Статистика** — количество активных привычек, лучшая серия, процент выполнения за месяц, прогресс-бар по каждой привычке
- **Настройки** — карточка профиля Telegram (аватар, имя, username), информация о приложении
- **Нижняя навигация** — вкладки: Главная / Календарь / Статистика / Настройки
- **Toast-уведомления** — мгновенная обратная связь на все действия пользователя
- **Скелетон-загрузчики** — мерцающие плейсхолдеры во время загрузки данных
- **Тёмная тема** — полностью тёмный интерфейс, оптимизированный для Telegram

## Технологии

### Фронтенд (React + TypeScript + Vite)

- **React 19** с хуками и кастомными хуками (`useHabits`, `useTasks`, `useMiniCalendar`, `useSwipe`)
- **TypeScript** для строгой типизации
- **Vite** для быстрой сборки
- **Redux Toolkit** для управления состоянием аутентификации
- **Axios** для HTTP-запросов
- **React Router v6** для клиентской навигации
- **@telegram-apps/sdk** для интеграции с Telegram Web App API

### Бэкенд (FastAPI + PostgreSQL)

- **FastAPI** — асинхронный веб-фреймворк на Python 3.12+
- **SQLAlchemy 2.0** с поддержкой async и паттерном сервисного слоя
- **Alembic** для миграций базы данных
- **PostgreSQL** (через Supabase) как основная СУБД
- **asyncpg** — асинхронный драйвер для PostgreSQL
- **Pydantic v2** для валидации данных
- **APScheduler** для планирования задач
- **Aiogram 3.x** для бота-компаньона в Telegram

## Структура проекта

```text
habit-task-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py             # Точка входа FastAPI + планировщик
│   │   ├── database.py         # Подключение к БД
│   │   ├── config.py           # Настройки окружения
│   │   ├── models/             # Модели SQLAlchemy (User, Task, TaskCompletion, Habit)
│   │   ├── schemas/            # Pydantic-схемы
│   │   ├── api/                # Роутеры (auth, tasks, habits)
│   │   ├── services/           # Бизнес-логика (TaskService, HabitService)
│   │   └── utils/              # Утилиты (telegram_auth, filter_tasks)
│   ├── alembic/                # Миграции БД
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calendar/       # MiniCalendar + жесты свайпа
│   │   │   ├── Habits/         # HabitBlock, HabitsSection
│   │   │   ├── Tasks/          # TasksSection
│   │   │   ├── Layout/         # BottomNav
│   │   │   └── ui/             # Icons, Toast, Skeletons
│   │   ├── pages/              # Dashboard, CalendarPage, StatsPage, SettingsPage, Auth, AddItemPage
│   │   ├── hooks/              # useHabits, useTasks, useMiniCalendar, useSwipe
│   │   ├── services/           # api.ts (Axios)
│   │   ├── store/              # Redux-слайсы
│   │   └── utils/              # date.ts, toast.ts
│   ├── vite.config.ts
│   └── .env
└── README.md
```

## Начало работы (локально)

### 1. Клонирование репозитория

```bash
git clone https://github.com/sonyanyaw/tg-mini-app-habits-tasks-tracker.git
cd habit-task-tracker
```

### 2. Настройка бэкенда

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Linux/macOS
# или
venv\Scripts\activate      # Windows

pip install -r requirements.txt
```

Создайте файл `.env`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
TELEGRAM_BOT_TOKEN=ваш_токен_бота
```

Примените миграции и запустите сервер:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

Сервер будет доступен по адресу http://localhost:8000.

### 3. Настройка фронтенда

```bash
cd frontend
npm install
```

Создайте файл `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

```bash
npm run dev
```

Фронтенд будет доступен по адресу http://localhost:5173.

## Деплой

### Бэкенд (например, Amvera)

1. Загрузите код бэкенда.
2. Укажите переменные окружения: `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `PYTHONPATH=/app`.
3. Задеплойте приложение.

### Фронтенд (например, Vercel)

1. Подключите Vercel к вашему GitHub-репозиторию.
2. Укажите Root Directory как `frontend`.
3. В Project Settings → Build & Development → Output Directory укажите `build`.
4. Добавьте переменную окружения: `VITE_API_BASE_URL=<ваш_url_бэкенда>`.
5. Vercel автоматически соберёт и задеплоит приложение.

## Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather).
2. Используйте команду `/newapp`, чтобы создать мини-приложение.
3. Опционально: добавьте кнопку Web App в меню бота через `/setmenubutton`.
