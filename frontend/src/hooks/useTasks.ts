import { useEffect, useState } from "react";
import {
  fetchTasksByDate,
  completeTaskForDate,
  deleteTaskCompletion,
  deleteTask,
  type Task,
} from "../services/api";
import { formatLocalDate } from "../utils/date";

export const useTasks = (selectedDate: Date, enabled: boolean) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const dateString = formatLocalDate(selectedDate);

  useEffect(() => {
    if (!enabled) return;

    const load = async () => {
      const res = await fetchTasksByDate(dateString);

      setTasks(
        res.data.map((task) => ({
          ...task,
          is_completed_today:
            task.completions?.some((c) => c.completed_date === dateString) ??
            false,
        })),
      );
    };

    load();
  }, [dateString, enabled]);

  const toggleCompletion = async (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const wasCompleted = task.is_completed_today;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, is_completed_today: !wasCompleted } : t,
      ),
    );

    try {
      if (!wasCompleted) {
        const res = await completeTaskForDate(taskId, dateString);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, completions: [...(t.completions ?? []), res.data] }
              : t,
          ),
        );
      } else {
        await deleteTaskCompletion(taskId, dateString);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  completions: t.completions.filter(
                    (c) => c.completed_date !== dateString,
                  ),
                }
              : t,
          ),
        );
      }
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, is_completed_today: wasCompleted } : t,
        ),
      );
    }
  };

  const remove = async (taskId: number) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return {
    tasks,
    completed: tasks.filter((t) => t.is_completed_today),
    pending: tasks.filter((t) => !t.is_completed_today),
    toggleCompletion,
    remove,
    addLocal: (task: Task) => setTasks((prev) => [...prev, task]),
  };
};
