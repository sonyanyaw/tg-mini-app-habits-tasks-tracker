import { useState } from "react";
import { useAppSelector } from "../store";
import { useTasks } from "../hooks/useTasks";
import { useHabits } from "../hooks/useHabits";
import MiniCalendar from "../components/Calendar/MiniCalendar";
import AddItemPage from "./AddItemPage";
import HabitsSection from "../components/Habits/HabitsSection";
import TasksSection from "../components/Tasks/TasksSection";

import "./dashboard.css";

const Dashboard = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAdd, setShowAdd] = useState(false);

  const {
    pending,
    completed,
    toggleCompletion,
    remove: deleteTask,
    addLocal: addTask,
  } = useTasks(selectedDate, !!user);

  const {
    habits,
    toggle: onToggle,
    remove: deleteHabit,
    addLocal: addHabit,
  } = useHabits(!!user);

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
        <MiniCalendar onDateSelect={setSelectedDate} />

        <HabitsSection
          habits={habits}
          onToggle={onToggle}
          onDelete={deleteHabit}
        />

        <TasksSection
          title={selectedDate}
          pending={pending}
          completed={completed}
          onToggle={toggleCompletion}
          onDelete={deleteTask}
        />
      </div>

      <div className="bottom-menu">
        <h3 className="page-title">Dashboard</h3>
        <button className="add-button" onClick={() => setShowAdd(true)}>
          + Add
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
