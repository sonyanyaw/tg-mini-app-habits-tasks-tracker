import React from "react";
import CalendarDay from "./CalendarDay";
import { formatMonthYearRange } from "../../utils/date";
import { useMiniCalendar } from "../../hooks/useMiniCalendar";
import { useSwipe } from "../../hooks/useSwipe";
import { ArrowIcon } from "../ui/ArrowIcon";

import "./minicalendar.css";

interface MiniCalendarProps {
  onDateSelect?: (date: Date) => void;
  onWeekChange?: (weekStart: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ onDateSelect, onWeekChange }) => {
  const {
    weekDays,
    isDayActive,
    isAnimating,
    isCurrentWeekValue,
    animationDirection,
    goToNextWeek,
    goToPrevWeek,
    goToCurrentWeek,
    handleDayClick,
  } = useMiniCalendar({ onDateSelect, onWeekChange });

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
    onSwipeLeft: goToNextWeek,
    onSwipeRight: goToPrevWeek,
    threshold: 50,
  });

  return (
    <div className="mini-calendar">
      <div className="calendar-header">
        <h3 className="month-year-display">{formatMonthYearRange(weekDays)}</h3>
        {!isCurrentWeekValue && (
          <button
            className="current-week-button"
            onClick={goToCurrentWeek}
            disabled={isAnimating}
          >
            Back to today
          </button>
        )}
      </div>

      <div className="calendar-navigation">
        <button
          className="nav-button prev-week"
          onClick={goToPrevWeek}
          disabled={isAnimating}
          aria-label="Previous week"
        >
          <ArrowIcon direction="left" />
        </button>

        <div
          className={`days-container ${animationDirection ? `animate-${animationDirection}` : ""}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="days-row">
            {weekDays.map((day) => (
              // <div key={index} className={`day-${day.weekday}`}>
              <CalendarDay
                key={day.date.toISOString()}
                className={`day-${day.weekday}`}
                weekday={day.weekday}
                monthday={day.monthday}
                isActive={isDayActive(day)}
                onDayClick={() => handleDayClick(day.date)}
              />
              // </div>
            ))}
          </div>
        </div>

        <button
          className="nav-button next-week"
          onClick={goToNextWeek}
          disabled={isAnimating}
          aria-label="Next week"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  );
};

export default MiniCalendar;
