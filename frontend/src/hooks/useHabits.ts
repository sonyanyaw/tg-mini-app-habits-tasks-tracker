import { useEffect, useState } from "react";
import {
  fetchHabits,
  deleteHabit,
  type Habit,
  updateHabitCompletion,
  type HabitCompletion,
} from "../services/api";
import { formatLocalDate } from "../utils/date";

export const useHabits = (enabled: boolean) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const today = new Date();
    const start = formatLocalDate(
      new Date(today.getFullYear(), today.getMonth(), 1),
    );
    const end = formatLocalDate(
      new Date(today.getFullYear(), today.getMonth() + 1, 0),
    );

    fetchHabits(start, end).then((res) => setHabits(res.data));
  }, [enabled]);

  const remove = async (habitId: number) => {
    await deleteHabit(habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
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

    const response = await updateHabitCompletion(
      habitId,
      dateString,
      newStatus,
    );

    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completions: updateCompletions(h.completions, response.data),
            }
          : h,
      ),
    );
  };

  return {
    habits,
    toggle,
    remove,
    addLocal: (habit: Habit) => setHabits((prev) => [...prev, habit]),
  };
};
