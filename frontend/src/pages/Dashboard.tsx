import { useState } from "react";
import { useAppSelector } from "../store";
import { getMonday } from "../utils/date";
import { useTasks } from "../hooks/useTasks";
import { useHabits, calcStreak } from "../hooks/useHabits";
import MiniCalendar from "../components/Calendar/MiniCalendar";
import AddItemPage from "./AddItemPage";
import HabitsSection from "../components/Habits/HabitsSection";
import TasksSection from "../components/Tasks/TasksSection";
import BottomNav from "../components/Layout/BottomNav";
import { PlusIcon, FireIcon } from "../components/ui/Icons";

import "./dashboard.css";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(firstName?: string, lastName?: string, username?: string): string {
  if (firstName || lastName) {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  }
  return (username?.[0] ?? "?").toUpperCase();
}

const Dashboard = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [showAdd, setShowAdd] = useState(false);

  const {
    pending,
    completed,
    loading: tasksLoading,
    toggleCompletion,
    remove: deleteTask,
    addLocal: addTask,
  } = useTasks(selectedDate, !!user);

  const {
    habits,
    loading: habitsLoading,
    toggle: onToggle,
    remove: deleteHabit,
    addLocal: addHabit,
  } = useHabits(!!user, weekStart);

  const bestStreak = habits.length
    ? Math.max(...habits.map((h) => calcStreak(h.completions ?? [])))
    : 0;

  const displayName = user?.first_name ?? user?.username ?? "there";
  const initials = getInitials(user?.first_name, user?.last_name, user?.username);

  if (showAdd) {
    return (
      <AddItemPage
        onTaskAdded={addTask}
        onHabitAdded={addHabit}
        onCancel={() => setShowAdd(false)}
      />
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">

        {/* Header */}
        <div className="dash-header">
          <div className="dash-header-left">
            <div className="dash-avatar">{initials}</div>
            <div className="dash-greeting">
              <span className="dash-greeting-sub">{getGreeting()},</span>
              <span className="dash-greeting-name">{displayName} ✨</span>
            </div>
          </div>
          {bestStreak > 0 && (
            <div className="dash-streak-badge">
              <FireIcon size={14} color="#ff9800" />
              <span>{bestStreak} day streak</span>
            </div>
          )}
        </div>

        <MiniCalendar
          onDateSelect={setSelectedDate}
          onWeekChange={setWeekStart}
        />

        <HabitsSection
          habits={habits}
          weekStart={weekStart}
          loading={habitsLoading}
          onToggle={onToggle}
          onDelete={deleteHabit}
        />

        <TasksSection
          title={selectedDate}
          pending={pending}
          completed={completed}
          loading={tasksLoading}
          onToggle={toggleCompletion}
          onDelete={deleteTask}
        />
      </div>

      <button className="fab-add" onClick={() => setShowAdd(true)} aria-label="Add task or habit">
        <PlusIcon size={24} />
      </button>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
