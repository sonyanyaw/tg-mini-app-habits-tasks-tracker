import { useState } from "react";
import { useAppSelector } from "../store";
import { getMonday } from "../utils/date";
import { useTasks } from "../hooks/useTasks";
import { useHabits } from "../hooks/useHabits";
import MiniCalendar from "../components/Calendar/MiniCalendar";
import AddItemPage from "./AddItemPage";
import HabitsSection from "../components/Habits/HabitsSection";
import TasksSection from "../components/Tasks/TasksSection";
import BottomNav from "../components/Layout/BottomNav";
import { PlusIcon } from "../components/ui/Icons";

import "./dashboard.css";

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
