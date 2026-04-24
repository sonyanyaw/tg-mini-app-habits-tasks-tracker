import { useEffect, useState } from "react";
import {
  fetchTasksByDate,
  completeTaskForDate,
  deleteTaskCompletion,
  deleteTask,
  type Task,
} from "../services/api";
import { formatLocalDate } from "../utils/date";
import { toast } from "../utils/toast";

export const useTasks = (selectedDate: Date, enabled: boolean) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const dateString = formatLocalDate(selectedDate);

  useEffect(() => {
    if (!enabled) return;

    setLoading(true);
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
      setLoading(false);
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
      toast.error("Failed to update task");
    }
  };

  const remove = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return {
    tasks,
    loading,
    completed: tasks.filter((t) => t.is_completed_today),
    pending: tasks.filter((t) => !t.is_completed_today),
    toggleCompletion,
    remove,
    addLocal: (task: Task) => setTasks((prev) => [...prev, task]),
  };
};
