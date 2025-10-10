// frontend/src/pages/HabitSkeleton.tsx (обновлённый)

import React, { useState, useEffect } from 'react';
import { fetchHabits, updateHabitCompletion } from '../../services/api';
import { useAppSelector } from '../../store';
import './habitblock.css'; // Убедитесь, что стили подходят

interface HabitCompletion {
  id: number;
  habit_id: number;
  completed: boolean;
  completed_date: string; // ISO string
}

interface Habit {
  id: number;
  title: string;
  description?: string;
  frequency: string;
  is_active: boolean;
  duration: number;
  owner_id: number;
  created_date: string;
  completions: HabitCompletion[]; // Теперь это массив выполнений
}

interface HabitSkeletonProps {
  weekDays: Array<{
    weekday: number;
    monthday: number;
    date: Date;
  }>;
}

const HabitSkeleton: React.FC<HabitSkeletonProps> = ({ weekDays }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [habits, setHabits] = useState<Habit[]>([]);

  // Форматируем даты для API
  const getStartEndDate = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1); // Первый день месяца
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Последний день месяца
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  // Загрузка привычек при монтировании и при изменении месяца (если нужно)
  useEffect(() => {
    if (!user) return;

    const { start, end } = getStartEndDate();
    fetchHabits(start, end)
      .then(response => setHabits(response.data))
      .catch(error => console.error('Error fetching habits:', error));
  }, [user]);

  const handleHabitToggle = async (habitId: number, date: Date) => {
    if (!user) return;

    const dateString = date.toISOString().split('T')[0]; // Формат YYYY-MM-DD
    // Найдём текущий статус выполнения для этой даты
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const existingCompletion = habit.completions.find(c => c.completed_date === dateString);
    const newCompletedStatus = !existingCompletion || !existingCompletion.completed;

    try {
      // Обновляем на бэкенде
      const response = await updateHabitCompletion(habitId, dateString, newCompletedStatus);

      // Обновляем локальное состояние
      setHabits(prevHabits =>
        prevHabits.map(habit => {
          if (habit.id === habitId) {
            // Проверяем, существовало ли выполнение ранее
            const existingIndex = habit.completions.findIndex(c => c.completed_date === dateString);
            let newCompletions;

            if (existingIndex > -1) {
              // Обновляем существующую запись
              newCompletions = [...habit.completions];
              newCompletions[existingIndex] = response.data;
            } else {
              // Добавляем новую запись
              newCompletions = [...habit.completions, response.data];
            }

            return { ...habit, completions: newCompletions };
          }
          return habit;
        })
      );
    } catch (error) {
      console.error('Error updating habit completion:', error);
    }
  };

  // Функция для проверки, выполнена ли привычка в определенный день
  const isHabitCompleted = (habitId: number, date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return false;
    const completion = habit.completions.find(c => c.completed_date === dateString);
    return completion ? completion.completed : false;
  };

  return (
    <div className="habits-container">
      {habits.map(habit => (
        <div key={habit.id} className="habit-block">
          <div className="habit-header">
            <span className="habit-title">{habit.title}</span>
          </div>
          <div className="habit-checks-row">
            {weekDays.map((day, index) => (
              <div
                key={`${habit.id}-${index}`} // Уникальный ключ для каждого дня и привычки
                className={`habit-check habit-check-${index + 1} ${
                  isHabitCompleted(habit.id, day.date) ? 'habit-check--completed' : ''
                }`}
                onClick={() => handleHabitToggle(habit.id, day.date)}
              >
                {isHabitCompleted(habit.id, day.date) ? '✓' : 'X'}
              </div>
            ))}
          </div>
        </div>
      ))}

      {habits.length === 0 && (
        <div className="no-habits">
          <p>No habits yet. Add your first habit!</p>
        </div>
      )}
    </div>
  );
};

export default HabitSkeleton;