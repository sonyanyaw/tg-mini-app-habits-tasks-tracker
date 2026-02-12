import React from "react";
import HabitSkeleton from "./HabitBlock";
import { type Habit } from "../../services/api";
import { generateWeekDays } from "../../utils/date";

interface HabitsSectionProps {
  habits: Habit[];
  onToggle: (habitId: number, date: Date) => void;
  onDelete: (habitId: number) => void;
}

const HabitsSection: React.FC<HabitsSectionProps> = ({
  habits,
  onToggle,
  onDelete,
}) => {
  const weekDays = generateWeekDays();

  return (
    <div className="habits-section">
      <div className="habits-header">
        <h3>Daily Habits</h3>
      </div>
      <HabitSkeleton
        weekDays={weekDays}
        habits={habits}
        onToggle={onToggle}
        onDeleteHabit={onDelete}
      />
    </div>
  );
};

export default HabitsSection;
