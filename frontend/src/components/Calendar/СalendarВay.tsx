import React, { useState, useMemo } from 'react';
import './calendarday.css';

interface CalendarDayProps {
  weekday: number;
  monthday: number;
  isActive?: boolean; // Добавляем проп для активного дня
  onDayClick?: (monthday: number) => void; // Опциональный обработчик клика
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  weekday, 
  monthday, 
  isActive = false,
  onDayClick 
}) => {
  const [activity] = useState(false);
  
  const weekDay = useMemo(() => {
    switch(weekday) {
      case 0: return "Sun";
      case 1: return "Mon";
      case 2: return "Tue";
      case 3: return "Wed";
      case 4: return "Thu";
      case 5: return "Fri";
      case 6: return "Sat";
      default: return "";
    }
  }, [weekday]);

  const handleClick = () => {
    if (onDayClick) {
      onDayClick(monthday);
    }
  };

  return (
    <div 
      className={`calendar-day ${isActive ? 'calendar-day--active' : ''}`}
      onClick={handleClick}
    >
      <div className="day-header">
        <span className="weekday-title">{weekDay}</span>
      </div>
      <div className="day-body">
        <span className="monthday-title">{monthday}</span>
      </div>
      <div className="day-hastasks">
        {activity && <div className="hastasks-mark"></div>}
      </div>
    </div>
  );
};

export default CalendarDay;