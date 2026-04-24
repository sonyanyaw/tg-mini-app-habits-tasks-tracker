import React from "react";
import { formatLocalDate } from "../../utils/date";
import { TrashIcon, FireIcon } from "../ui/Icons";

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

const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function calculateStreak(completions: HabitCompletion[]): number {
  const completed = new Set(
    completions.filter(c => c.completed).map(c => c.completion_date)
  );
  const today = new Date();
  const todayStr = formatLocalDate(today);
  const start = completed.has(todayStr) ? today : new Date(today.getTime() - 86400000);
  let streak = 0;
  const d = new Date(start);
  while (completed.has(formatLocalDate(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
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
      {habits.map((habit) => {
        const streak = calculateStreak(habit.completions ?? []);

        return (
          <div key={habit.id} className="habit-block">
            <div className="habit-header">
              <span className="habit-title">{habit.title}</span>
              <div className="habit-header-right">
                {streak > 0 && (
                  <div className="habit-streak">
                    <FireIcon size={13} />
                    <span className="habit-streak-count">{streak}</span>
                  </div>
                )}
                {onDeleteHabit && (
                  <button
                    className="delete-button"
                    onClick={() => onDeleteHabit(habit.id)}
                    aria-label="Delete habit"
                  >
                    <TrashIcon size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="habit-day-labels">
              {WEEK_LABELS.map((l, i) => (
                <span key={i} className="habit-day-label">{l}</span>
              ))}
            </div>

            <div className="habit-checks-row">
              {weekDays.map((day) => {
                const completed = isCompleted(habit, day.date);
                return (
                  <div
                    key={`${habit.id}-${day.date}`}
                    className={`habit-check ${completed ? "habit-check--completed" : ""}`}
                    onClick={() => onToggle(habit.id, day.date)}
                    aria-label={`${completed ? "Completed" : "Mark complete"}`}
                  >
                    {completed ? "✓" : ""}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {habits.length === 0 && (
        <div className="no-habits">
          <p className="no-habits-icon">🌱</p>
          <p className="no-habits-text">No habits yet.</p>
          <p className="no-habits-sub">Tap + to start building your routine.</p>
        </div>
      )}
    </div>
  );
};

export default HabitSkeleton;
