import { useState } from 'react';
import AddTaskPage from './Add';
import './dashboard.css';
import MiniCalendar from '../components/Calendar/MiniCalendar';
import HabitSkeleton from '../components/Habits/HabitBlock';
import AddItemPage from './AddItemPage';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  owner_id: number;
}

interface Habit {
  id: number;
  title: string;
  completedDays: number[];
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTaskPage, setShowAddTaskPage] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const todayDate = new Date();
  
  // Пример данных привычек
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      title: "Morning Exercise",
      completedDays: [new Date().getDate()]
    },
    {
      id: 2,
      title: "Read 30 min",
      completedDays: []
    },
    {
      id: 3,
      title: "Meditate",
      completedDays: [new Date().getDate() - 1, new Date().getDate()]
    }
  ]);

  // Генерация данных для текущей недели (для привычек)
  const generateWeekDays = () => {
    const days = [];
    const today = new Date();
    
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

  const getDisplayDate = (selectedDate: Date, todayDate: Date): string => {
    const isToday = formatDate(selectedDate) === formatDate(todayDate);
    const isTomorrow = todayDate.getMonth() === selectedDate.getMonth() && 
                      todayDate.getFullYear() === selectedDate.getFullYear() &&
                      selectedDate.getDate() - todayDate.getDate() === 1;
    const isYesterday = todayDate.getMonth() === selectedDate.getMonth() && 
                      todayDate.getFullYear() === selectedDate.getFullYear() &&
                      todayDate.getDate() - selectedDate.getDate() === 1;
    
    if (isToday) return 'today';
    if (isTomorrow) return 'tomorrow';
    if (isYesterday) return 'yesterday';
    return formatDate(selectedDate);
  };

  const weekDays = generateWeekDays();

  const handleTaskAdded = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
    setShowAddTaskPage(false);
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleHabitToggle = (habitId: number, monthday: number) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDays.includes(monthday);
        return {
          ...habit,
          completedDays: isCompleted 
            ? habit.completedDays.filter(day => day !== monthday)
            : [...habit.completedDays, monthday]
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
  };

  const handleCancelAddTask = () => {
    setShowAddTaskPage(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      // year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (showAddTaskPage) {
    return (
      <AddItemPage
        onTaskAdded={handleTaskAdded}
        onCancel={handleCancelAddTask}
      />
    );
  }

  // Основной вид
  return (
    <div className="dashboard-container">
      {/* Основной контент с прокруткой */}
      <div className="dashboard-content">
        {/* Календарь */}
        <div className="calendar-section">
          <MiniCalendar onDateSelect={handleDateSelect} />
        </div>

        {/* Привычки */}
        <div className='habits-section'>
          <div className='habits-header'>
            <h3>Daily Habits</h3>
          </div>
          <HabitSkeleton 
            weekDays={weekDays}
            habits={habits}
            onHabitToggle={handleHabitToggle}
          />
        </div>

        {/* Активные задачи */}
        <div className='tasks-section'>
          <div className='tasks-header'>
            <h3>Tasks for {getDisplayDate(selectedDate, todayDate)}</h3>
            <span className='tasks-count'>{pendingTasks.length} tasks</span>
          </div>
          <div className='tasks-list'>
            <ul className="task-list">
              {pendingTasks.map(task => (
                <li key={task.id} className="task-item">
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  <div className="task-content">
                    <span className={`task-text ${task.completed ? 'task-completed' : ''}`}>
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {pendingTasks.length === 0 && (
              <div className="empty-state">
                <p>No pending tasks for {formatDate(selectedDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Выполненные задачи */}
        {completedTasks.length > 0 && (
          <div className='completed-section'>
            <div className='completed-header'>
              <h3>Completed ({completedTasks.length})</h3>
            </div>
            <div className='completed-list'>
              <ul className="task-list">
                {completedTasks.map(task => (
                  <li key={task.id} className="task-item completed">
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                    />
                    <div className="task-content">
                      <span className="task-text task-completed">
                        {task.title}
                      </span>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Общее пустое состояние */}
        {tasks.length === 0 && (
          <div className="empty-dashboard">
            <p>No tasks yet. Add your first task!</p>
          </div>
        )}
      </div>

      {/* Фиксированное нижнее меню */}
      <div className='bottom-menu'>
        <h3 className="page-title">Dashboard</h3>
        <button 
          className="add-button"
          onClick={() => setShowAddTaskPage(true)}
        >
          + Add Task
        </button>
      </div>
    </div>
  );
};

export default Dashboard;