import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../store';
import { useTasks } from '../hooks/useTasks';
import { useHabits } from '../hooks/useHabits';
import { fetchTasks, type Task } from '../services/api';
import { formatLocalDate, isSameDate } from '../utils/date';
import { TrashIcon, ArrowLeftIcon, ArrowRightIcon } from '../components/ui/Icons';
import { CalendarGridSkeleton, CalendarTasksSkeleton } from '../components/ui/Skeletons';
import BottomNav from '../components/Layout/BottomNav';
import './calendar-page.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function generateMonthCalendar(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  // Monday-based: find Monday on or before the 1st
  const start = new Date(firstOfMonth);
  const dow = start.getDay();
  start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));

  // Find Sunday on or after the last day
  const end = new Date(lastOfMonth);
  const edow = end.getDay();
  if (edow !== 0) end.setDate(end.getDate() + (7 - edow));

  const days: Date[] = [];
  const d = new Date(start);
  while (d <= end) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const CalendarPage: React.FC = () => {
  const { user } = useAppSelector(s => s.auth);
  const today = new Date();

  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  // All tasks for dot indicators (fetch once, stays in sync enough for a demo)
  useEffect(() => {
    if (!user) return;
    fetchTasks().then(r => setAllTasks(r.data));
  }, [user?.id]);

  // Habits for the viewed month (for dot indicators)
  const { habits, loading: habitsLoading } = useHabits(!!user, viewMonth);

  // Interactive task list for the selected day
  const { pending, completed, loading: tasksLoading, toggleCompletion, remove } = useTasks(selectedDay, !!user);

  const calendarDays = generateMonthCalendar(year, month);

  const dayHasTasks = (date: Date) => {
    const ds = formatLocalDate(date);
    return allTasks.some(t => t.due_date?.substring(0, 10) === ds);
  };

  const dayHasHabitCompletion = (date: Date) => {
    const ds = formatLocalDate(date);
    return habits.some(h => h.completions?.some(c => c.completion_date === ds && c.completed));
  };

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  const renderTask = (task: Task) => (
    <li key={task.id} className={`cal-task-item ${task.is_completed_today ? 'cal-task-item--done' : ''}`}>
      <input
        type="checkbox"
        className="cal-task-checkbox"
        checked={task.is_completed_today ?? false}
        onChange={() => toggleCompletion(task.id)}
      />
      <div className="cal-task-content">
        <span className={`cal-task-text ${task.is_completed_today ? 'cal-task-text--done' : ''}`}>
          {task.title}
        </span>
        {task.description && <p className="cal-task-desc">{task.description}</p>}
      </div>
      <button
        className="cal-task-delete"
        onClick={() => remove(task.id)}
        aria-label="Delete task"
      >
        <TrashIcon size={14} />
      </button>
    </li>
  );

  // const selectedDateStr = formatLocalDate(selectedDay);
  const hasTasks = pending.length > 0 || completed.length > 0;

  return (
    <div className="calendar-page">
      <div className="calendar-page-content">

        {/* Month header */}
        <div className="cal-month-header">
          <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
            <ArrowLeftIcon size={18} />
          </button>
          <h1 className="cal-month-title">{MONTH_NAMES[month]} {year}</h1>
          <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">
            <ArrowRightIcon size={18} />
          </button>
        </div>

        {/* Day labels */}
        <div className="cal-weekday-labels">
          {DAY_LABELS.map(l => <span key={l} className="cal-weekday-label">{l}</span>)}
        </div>

        {/* Month grid */}
        {habitsLoading ? <CalendarGridSkeleton /> : (
          <div className="cal-grid">
            {calendarDays.map((day, i) => {
              const isCurrentMonth = day.getMonth() === month;
              const isToday = isSameDate(day, today);
              const isSelected = isSameDate(day, selectedDay);

              return (
                <button
                  key={i}
                  className={[
                    'cal-day',
                    isCurrentMonth ? '' : 'cal-day--other-month',
                    isToday ? 'cal-day--today' : '',
                    isSelected ? 'cal-day--selected' : '',
                  ].join(' ')}
                  onClick={() => setSelectedDay(new Date(day))}
                >
                  <span className="cal-day-num">{day.getDate()}</span>
                  <div className="cal-dots">
                    {dayHasTasks(day) && <span className="cal-dot cal-dot--task" />}
                    {dayHasHabitCompletion(day) && <span className="cal-dot cal-dot--habit" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected day tasks */}
        <div className="cal-day-section">
          <div className="cal-day-header">
            <h2 className="cal-day-title">
              {isToday(selectedDay) ? 'Today' : formatDayLabel(selectedDay)}
            </h2>
            {pending.length > 0 && (
              <span className="cal-day-count">{pending.length}</span>
            )}
          </div>

          {tasksLoading ? <CalendarTasksSkeleton /> : !hasTasks ? (
            <div className="cal-empty">
              <p className="cal-empty-icon">✓</p>
              <p className="cal-empty-text">No tasks scheduled</p>
            </div>
          ) : (
            <ul className="cal-task-list">
              {pending.map(t => renderTask(t))}
              {completed.length > 0 && (
                <>
                  <li className="cal-completed-label">Completed ({completed.length})</li>
                  {completed.map(t => renderTask(t))}
                </>
              )}
            </ul>
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  );
};

function isToday(date: Date): boolean {
  return isSameDate(date, new Date());
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default CalendarPage;
