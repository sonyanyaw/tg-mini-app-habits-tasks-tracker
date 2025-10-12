import axios, { AxiosHeaders, type InternalAxiosRequestConfig  } from 'axios';
import store from '../store';

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
  init_data_raw: string;
}

// Добавим типы для задач, если планируете их использовать
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  owner_id: number;
  due_date: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  due_date: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  due_date?: string; 
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
  completion_date: string; 
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Перехватчик запросов: добавляем telegram_id в заголовок
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Получаем текущее состояние из store
    const state = store.getState();
    // Проверяем, что user существует и у него есть telegram_id
    const telegramId = state.auth.user?.telegram_id;

    if (telegramId) {
      // Добавляем заголовок
      const headers = AxiosHeaders.from(config.headers || {});
      headers.set('X-Telegram-ID', telegramId);
      config.headers = headers; // Присваиваем обратно
      // if (config.headers && typeof config.headers.set === 'function') {
      //   // Если да, используем метод set
      //   config.headers.set('X-Telegram-ID', telegramId);
      // }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authenticateTelegram = (data: TelegramInitData) => api.post<User>('/auth/telegram', data);

export const fetchTasks = () => api.get<Task[]>('/tasks/');

export const addTask = (task: TaskCreate) => api.post<Task>('/tasks/', task);

export const updateTask = (taskId: number, taskUpdate: TaskUpdate) => api.put<Task>(`/tasks/${taskId}`, taskUpdate);

export const updateTaskCompletion = (taskId: number, completed: boolean) => 
  api.put<Task>(`/tasks/${taskId}`, { completed });

export const deleteTask = (taskId: number) => api.delete(`/tasks/${taskId}`);

// Функции для привычек
export const fetchHabits = (startDate: string, endDate: string) => 
  api.get<Habit[]>(`/habits/?start_date=${startDate}&end_date=${endDate}`);

export const addHabit = (habit: HabitCreate) => api.post<Habit>('/habits/', habit);

export const updateHabitCompletion = (habitId: number, completion_date: string, completed: boolean) => 
  api.post<HabitCompletion>(`/habits/${habitId}/completion/`, { habit_id: habitId, completion_date, completed });

export const deleteHabit = (habitId: number) => api.delete(`/habits/${habitId}`);

export default api;