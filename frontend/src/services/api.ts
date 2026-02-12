import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import store from "../store";

export interface User {
  id: number;
  telegram_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramInitData {
  init_data_raw: string;
}

export type RecurrenceType = "daily" | "weekly" | "monthly" | "custom";

export interface Task {
  id: number;
  title: string;
  description?: string;
  owner_id: number;
  due_date: string;

  recurrence_type?: RecurrenceType;
  recurrence_days?: string;
  recurrence_end_date?: string;

  created_at: string;
  is_completed_today?: boolean;
  completions: TaskCompletion[];
}

export interface TaskCreate {
  title: string;
  description?: string;
  due_date: string;
  recurrence_type?: RecurrenceType;
  recurrence_days?: string;
  recurrence_end_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  due_date?: string;
}

export interface TaskCompletion {
  id: number;
  task_id: number;
  completed_date: string;
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

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const telegramId = state.auth.user?.telegram_id;

    if (telegramId) {
      const headers = AxiosHeaders.from(config.headers || {});
      headers.set("X-Telegram-ID", telegramId);
      config.headers = headers;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const authenticateTelegram = (data: TelegramInitData) =>
  api.post<User>("/auth/telegram", data);

export const fetchTasks = () => api.get<Task[]>("/tasks/");

export const fetchTasksByDate = (date: string) =>
  api.get<Task[]>(`/tasks/by-date?target_date=${date}`);

export const addTask = (task: TaskCreate) => api.post<Task>("/tasks/", task);

export const updateTask = (taskId: number, taskUpdate: TaskUpdate) =>
  api.put<Task>(`/tasks/${taskId}`, taskUpdate);

export const updateTaskCompletion = (taskId: number, completed: boolean) =>
  api.put<Task>(`/tasks/${taskId}`, { completed });

export const completeTaskForDate = (taskId: number, completed_date: string) =>
  api.post<TaskCompletion>(`/tasks/${taskId}/completion/`, { completed_date });

export const deleteTaskCompletion = (taskId: number, completed_date: string) =>
  api.delete(`/tasks/${taskId}/completion/?completed_date=${completed_date}`);

export const deleteTask = (taskId: number) => api.delete(`/tasks/${taskId}`);

// Функции для привычек
export const fetchHabits = (startDate: string, endDate: string) =>
  api.get<Habit[]>(`/habits/?start_date=${startDate}&end_date=${endDate}`);

export const addHabit = (habit: HabitCreate) =>
  api.post<Habit>("/habits/", habit);

export const updateHabitCompletion = (
  habitId: number,
  completion_date: string,
  completed: boolean,
) =>
  api.post<HabitCompletion>(`/habits/${habitId}/completion/`, {
    habit_id: habitId,
    completion_date,
    completed,
  });

export const deleteHabit = (habitId: number) =>
  api.delete(`/habits/${habitId}`);

export default api;
