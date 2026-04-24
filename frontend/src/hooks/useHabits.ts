import { useEffect, useState } from "react";
import {
  fetchHabits,
  deleteHabit,
  type Habit,
  updateHabitCompletion,
  type HabitCompletion,
} from "../services/api";
import { formatLocalDate } from "../utils/date";
import { toast } from "../utils/toast";

function calcStreak(completions: HabitCompletion[]): number {
  const done = new Set(completions.filter(c => c.completed).map(c => c.completion_date));
  const today = new Date();
  const todayStr = formatLocalDate(today);
  const start = done.has(todayStr) ? today : new Date(today.getTime() - 86400000);
  let streak = 0;
  const d = new Date(start);
  while (done.has(formatLocalDate(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export const useHabits = (enabled: boolean, weekStart: Date = new Date()) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const monthKey = `${weekStart.getFullYear()}-${weekStart.getMonth()}`;

  useEffect(() => {
    if (!enabled) return;

    setLoading(true);
    const start = formatLocalDate(
      new Date(weekStart.getFullYear(), weekStart.getMonth(), 1),
    );
    const end = formatLocalDate(
      new Date(weekStart.getFullYear(), weekStart.getMonth() + 1, 0),
    );

    fetchHabits(start, end).then((res) => {
      setHabits(res.data);
      setLoading(false);
    });
  }, [enabled, monthKey]);

  const remove = async (habitId: number) => {
    try {
      await deleteHabit(habitId);
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      toast.success("Habit deleted");
    } catch {
      toast.error("Failed to delete habit");
    }
  };

  const updateCompletions = (
    completions: HabitCompletion[],
    updated: HabitCompletion,
  ) => {
    const index = completions.findIndex(
      (c) => c.completion_date === updated.completion_date,
    );

    if (index > -1) {
      const copy = [...completions];
      copy[index] = updated;
      return copy;
    }

    return [...completions, updated];
  };

  const toggle = async (habitId: number, date: Date) => {
    const dateString = formatLocalDate(date);

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const existing = habit.completions?.find(
      (c) => c.completion_date === dateString,
    );

    const newStatus = !existing?.completed;

    try {
      const response = await updateHabitCompletion(habitId, dateString, newStatus);

      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId
            ? { ...h, completions: updateCompletions(h.completions, response.data) }
            : h,
        ),
      );

      if (newStatus) {
        const updatedCompletions = updateCompletions(
          habit.completions ?? [],
          response.data,
        );
        const streak = calcStreak(updatedCompletions);
        toast.success(streak > 1 ? `🔥 ${streak} day streak!` : "Habit completed!");
      }
    } catch {
      toast.error("Failed to update habit");
    }
  };

  return {
    habits,
    loading,
    toggle,
    remove,
    addLocal: (habit: Habit) => setHabits((prev) => [...prev, habit]),
  };
};
