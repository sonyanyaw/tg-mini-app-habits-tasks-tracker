import React from "react";
import HabitSkeleton from "./HabitBlock";
import { HabitsSkeleton } from "../ui/Skeletons";
import { type Habit } from "../../services/api";
import { generateWeekDays } from "../../utils/date";

interface HabitsSectionProps {
  habits: Habit[];
  weekStart: Date;
  loading?: boolean;
  onToggle: (habitId: number, date: Date) => void;
  onDelete: (habitId: number) => void;
}

const HabitsSection: React.FC<HabitsSectionProps> = ({
  habits,
  weekStart,
  loading,
  onToggle,
  onDelete,
}) => {
  const weekDays = generateWeekDays(weekStart);

  return (
    <div className="habits-section">
      <div className="habits-header">
        <h3>Daily Habits</h3>
      </div>
      {loading ? (
        <HabitsSkeleton />
      ) : (
        <HabitSkeleton
          weekDays={weekDays}
          habits={habits}
          onToggle={onToggle}
          onDeleteHabit={onDelete}
        />
      )}
    </div>
  );
};

export default HabitsSection;
