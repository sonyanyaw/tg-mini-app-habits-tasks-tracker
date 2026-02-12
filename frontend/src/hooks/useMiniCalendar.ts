import { useMemo, useState } from "react";
import {
  getMonday,
  generateWeekDays,
  addDays,
  isSameWeek,
  isCurrentWeek,
  isSameDate,
} from "../utils/date";

interface DayInfo {
  weekday: number;
  monthday: number;
  date: Date;
}

interface UseMiniCalendarProps {
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export const useMiniCalendar = ({
  initialDate = new Date(),
  onDateSelect,
}: UseMiniCalendarProps) => {
  const [activeDay, setActiveDay] = useState<Date>(initialDate);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMonday(initialDate),
  );
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right" | null
  >(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const weekDays = generateWeekDays(currentWeekStart);

  const isCurrentWeekValue = useMemo(
    () => isCurrentWeek(currentWeekStart),
    [currentWeekStart],
  );

  const goToNextWeek = () => {
    if (isAnimating) return;
    animate("left", () => setCurrentWeekStart(addDays(currentWeekStart, 7)));
  };

  const goToPrevWeek = () => {
    if (isAnimating) return;
    animate("right", () => setCurrentWeekStart(addDays(currentWeekStart, -7)));
  };

  const goToCurrentWeek = () => {
    const todayMonday = getMonday(new Date());
    const today = new Date();

    setActiveDay(today);
    if (onDateSelect) {
      onDateSelect(today);
    }

    if (isSameWeek(todayMonday, currentWeekStart)) return;

    const direction = todayMonday > currentWeekStart ? "left" : "right";

    animate(direction, () => setCurrentWeekStart(todayMonday));
  };

  const animate = (direction: "left" | "right", callback: () => void) => {
    setAnimationDirection(direction);
    setIsAnimating(true);

    setTimeout(() => {
      callback();
      setAnimationDirection(null);
      setIsAnimating(false);
    }, 200);
  };

  const handleDayClick = (date: Date) => {
    if (isAnimating) return;

    // const clickedDay = weekDays.find((day) => day.monthday === monthday);
    if (date) {
      setActiveDay(date);
      if (onDateSelect) {
        onDateSelect?.(date);
      }
    }
  };

  const isDayActive = (day: DayInfo) => isSameDate(day.date, activeDay);

  return {
    weekDays,
    isDayActive,
    isAnimating,
    isCurrentWeekValue,
    animationDirection,
    goToNextWeek,
    goToPrevWeek,
    goToCurrentWeek,
    handleDayClick,
  };
};
