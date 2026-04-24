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
  onWeekChange?: (weekStart: Date) => void;
}

export const useMiniCalendar = ({
  initialDate = new Date(),
  onDateSelect,
  onWeekChange,
}: UseMiniCalendarProps) => {
  const [activeDay, setActiveDay] = useState<Date | null>(initialDate);
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
    const newWeekStart = addDays(currentWeekStart, 7);
    animate("left", () => {
      setCurrentWeekStart(newWeekStart);
      setActiveDay(null);
      onWeekChange?.(newWeekStart);
    });
  };

  const goToPrevWeek = () => {
    if (isAnimating) return;
    const newWeekStart = addDays(currentWeekStart, -7);
    animate("right", () => {
      setCurrentWeekStart(newWeekStart);
      setActiveDay(null);
      onWeekChange?.(newWeekStart);
    });
  };

  const goToCurrentWeek = () => {
    const todayMonday = getMonday(new Date());
    const today = new Date();

    setActiveDay(today);
    onDateSelect?.(today);

    if (isSameWeek(todayMonday, currentWeekStart)) return;

    const direction = todayMonday > currentWeekStart ? "left" : "right";
    animate(direction, () => {
      setCurrentWeekStart(todayMonday);
      onWeekChange?.(todayMonday);
    });
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
    setActiveDay(date);
    onDateSelect?.(date);
  };

  const isDayActive = (day: DayInfo) =>
    activeDay !== null && isSameDate(day.date, activeDay);

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
