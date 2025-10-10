import axios from 'axios';

// Определяем тип User
export interface User {
  id: number;
  telegram_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

// Определяем тип TelegramInitData (плоская структура, как отправляется на бэкенд)
export interface TelegramInitData {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string; // или number, в зависимости от того, как обрабатываете
  hash: string;
}

// Добавим типы для задач, если планируете их использовать
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  owner_id: number;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface Habit {
  id: number;
  title: string;
  description?: string;
  frequency: string; 
  is_active: boolean;
  duration: number;
  owner_id: number;
  created_date: string; 
  completions: HabitCompletion[];
}

export interface HabitCreate {
  title: string;
  description?: string;
  frequency: string;
  duration: number;
}

export interface HabitCompletion {
  id: number;
  habit_id: number;
  completed: boolean;
  completed_date: string; 
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Теперь типизируем authenticateTelegram с TelegramInitData
export const authenticateTelegram = (data: TelegramInitData) => api.post<User>('/auth/telegram', data);

export const fetchTasks = () => api.get<Task[]>('/tasks');
export const addTask = (task: TaskCreate) => api.post<Task>('/tasks', task);


// Функции для привычек
export const fetchHabits = (startDate: string, endDate: string) => 
  api.get<Habit[]>(`/habits/?start_date=${startDate}&end_date=${endDate}`);

export const addHabit = (habit: HabitCreate) => api.post<Habit>('/habits/', habit);

export const updateHabitCompletion = (habitId: number, date: string, completed: boolean) => 
  api.post<HabitCompletion>(`/habits/${habitId}/completion`, { date, completed });


export default api;