import React, { useState } from 'react';
import CalendarDay from './calendarday';
import './minicalendar.css';

interface DayInfo {
  weekday: number;
  monthday: number;
  date: Date;
}

interface MiniCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ onDateSelect }) => {
  const date = new Date();
  const [activeDay, setActiveDay] = useState<Date>(date);

  // Генерируем данные для 7 дней (текущая неделя)
  const generateWeekDays = (): DayInfo[] => {
    const days: DayInfo[] = [];
    const today = new Date();
    
    // Находим понедельник текущей недели
    const monday = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    monday.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      
      days.push({
        weekday: currentDay.getDay(),
        monthday: currentDay.getDate(),
        date: new Date(currentDay)
      });
    }
    
    return days;
  };

  const weekDays = generateWeekDays();

  const handleDayClick = (monthday: number) => {
    const clickedDay = weekDays.find(day => day.monthday === monthday);
    if (clickedDay) {
      setActiveDay(clickedDay.date);
      if (onDateSelect) {
        onDateSelect(clickedDay.date);
      }
    }
  };

  const isDayActive = (day: DayInfo): boolean => {
    return day.date.getDate() === activeDay.getDate() && 
           day.date.getMonth() === activeDay.getMonth() && 
           day.date.getFullYear() === activeDay.getFullYear();
  };

  return (
    <div className="mini-calendar">
      <div className="days-row">
        {weekDays.map((day, index) => (
          <div key={index} className={`day-${day.weekday}`}>
            <CalendarDay 
              weekday={day.weekday} 
              monthday={day.monthday}
              isActive={isDayActive(day)}
              onDayClick={handleDayClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;