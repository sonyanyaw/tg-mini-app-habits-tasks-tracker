import React from "react";
import { formatLocalDate } from "../../utils/date";

import "./habitblock.css";

interface HabitCompletion {
  id: number;
  habit_id: number;
  completed: boolean;
  completion_date: string;
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
  completions: HabitCompletion[];
}

interface HabitSkeletonProps {
  weekDays: {
    weekday: number;
    monthday: number;
    date: Date;
  }[];
  habits: Habit[];
  onToggle: (habitId: number, date: Date) => void;
  onDeleteHabit?: (habitId: number) => void;
}

const HabitSkeleton: React.FC<HabitSkeletonProps> = ({
  weekDays,
  habits,
  onToggle,
  onDeleteHabit,
}) => {
  const isCompleted = (habit: Habit, date: Date) => {
    const dateString = formatLocalDate(date);
    return habit.completions?.some(
      (c) => c.completion_date === dateString && c.completed,
    );
  };

  return (
    <div className="habits-container">
      {habits.map((habit) => (
        <div key={habit.id} className="habit-block">
          <div className="habit-header">
            <span className="habit-title">{habit.title}</span>

            {onDeleteHabit && (
              <button
                className="delete-button"
                onClick={() => onDeleteHabit(habit.id)}
              >
                X
              </button>
            )}
          </div>

          <div className="habit-checks-row">
            {weekDays.map((day) => {
              const completed = isCompleted(habit, day.date);

              return (
                <div
                  key={`${habit.id}-${day.date}`}
                  className={`habit-check ${
                    completed ? "habit-check--completed" : ""
                  }`}
                  onClick={() => onToggle(habit.id, day.date)}
                >
                  {completed ? "✓" : "X"}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {habits.length === 0 && (
        <div className="no-habits">
          <p>No habits yet.</p>
        </div>
      )}
    </div>
  );
};

export default HabitSkeleton;
