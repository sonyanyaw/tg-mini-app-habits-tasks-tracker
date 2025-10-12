import { useState, useEffect } from 'react';
import { useAppSelector } from '../store';
import { fetchTasks, fetchHabits, type Task, type Habit, updateTaskCompletion, deleteTask, deleteHabit } from '../services/api';
import './dashboard.css';
import MiniCalendar from '../components/Calendar/MiniCalendar';
import HabitSkeleton from '../components/Habits/HabitBlock';
import AddItemPage from './AddItemPage';

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);

  console.log('user', user)

  // Локальное состояние для задач и привычек
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]); // Теперь тип Habit из api.ts
  const [showAddItemPage, setShowAddItemPage] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const todayDate = new Date();

  // Формат дат для API
  const getStartEndDate = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1); // Первый дня месяца
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Последний день месяца
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  // Загрузка задач и привычек при монтировании и при изменении пользователя
  useEffect(() => {
    console.log("Dashboard useEffect called");
    if (!user) return;

    const { start, end } = getStartEndDate();

    const loadTasks = async () => {
      console.log("loadTasks called");
      try {
        const response = await fetchTasks();
        console.log('load tasks', response.data)
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const loadHabits = async () => {
      console.log("loadHabits called");
      try {
        const response = await fetchHabits(start, end);
        setHabits(response.data);
      } catch (error) {
        console.error('Error fetching habits:', error);
      }
    };

    loadTasks();
    loadHabits();
  }, [user]);

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]; // Формат YYYY-MM-DD
    return tasks.filter(task => task.due_date === dateString);
  };

  // Генерируем данные для текущей недели (для привычек)
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

  const handleTaskAdded = async (newTaskData: Task) => {
    console.log('handleTaskAdded')
    if (!user) return;
    try {
      // const response = await addTask({ title: newTaskData.title, description: newTaskData.description });
      setTasks(prevTasks => [...prevTasks, newTaskData]);
      setShowAddItemPage(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleHabitAdded = async (newHabitData: Habit) => {
    console.log('handleHabitAdded')
    if (!user) return;
    try {
      setHabits(prevHabits => [...prevHabits, newHabitData]);
      setShowAddItemPage(false);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: number) => {
    if (!user) return;

    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;

    const newCompletedStatus = !taskToUpdate.completed;

    try {
      const response = await updateTaskCompletion(taskId, newCompletedStatus);

      setTasks(tasks.map(task =>
        // task.id === taskId ? { ...task, completed: !task.completed } : task
        task.id === taskId ? response.data : task
      ));
    } catch (error) {
    console.error('Error updating task completion:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return;

    try {
      // Отправляем запрос на бэкенд
      await deleteTask(taskId);
      
      // Обновляем локальное состояние, удаляя задачу
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      // Здесь можно добавить отображение ошибки пользователю
    }
  };

  // const handleHabitToggle = async (habitId: number, date: Date) => {
  //   if (!user) return;

  //   const dateString = date.toISOString().split('T')[0]; // Формат YYYY-MM-DD
  //   const habit = habits.find(h => h.id === habitId);
  //   if (!habit) return;

  //   // Найдём существующую запись выполнения для этой даты
  //   const existingCompletion = habit.completions.find(c => c.completed_date === dateString);
  //   const newCompletedStatus = !existingCompletion || !existingCompletion.completed;

  //   try {
  //     // Обновляем на бэкенде
  //     const response = await updateHabitCompletion(habitId, dateString, newCompletedStatus);

  //     // Обновляем локальное состояние
  //     setHabits(prevHabits =>
  //       prevHabits.map(habit => {
  //         if (habit.id === habitId) {
  //           const existingIndex = habit.completions.findIndex(c => c.completed_date === dateString);
  //           let newCompletions;

  //           if (existingIndex > -1) {
  //             newCompletions = [...habit.completions];
  //             newCompletions[existingIndex] = response.data;
  //           } else {
  //             newCompletions = [...habit.completions, response.data];
  //           }

  //           return { ...habit, completions: newCompletions };
  //         }
  //         return habit;
  //       })
  //     );
  //   } catch (error) {
  //     console.error('Error updating habit completion:', error);
  //   }
  // };

  const handleDeleteHabit = async (habitId: number) => {
    if (!user) return;

    try {
      // Отправляем запрос на бэкенд
      await deleteHabit(habitId);
      
      // Обновляем локальное состояние, удаляя привычку
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
      // Здесь можно добавить отображение ошибки пользователю
    }
  };

  const handleCancelAddItem = () => {
    setShowAddItemPage(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const tasksForSelectedDate = getTasksForDate(selectedDate);
  const completedTasks = tasksForSelectedDate.filter(task => task.completed);
  const pendingTasks = tasksForSelectedDate.filter(task => !task.completed);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      // year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Если показываем страницу добавления
  if (showAddItemPage) {
    return (
      <AddItemPage
        onTaskAdded={handleTaskAdded}
        onHabitAdded={handleHabitAdded}
        onCancel={handleCancelAddItem}
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
            habits={habits} // Передаём привычки с выполнениями
            // onHabitToggle={handleHabitToggle} // Пока отключим в Dashboard, так как HabitSkeleton сам обрабатывает
            onDeleteHabit={handleDeleteHabit}
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
                  <div className='task-delete'>
                    <button 
                      className="delete-button" 
                      onClick={(e) => {
                        e.stopPropagation(); // Предотвращаем всплытие события, если нужно
                        handleDeleteTask(task.id);
                      }}
                    >
                      X
                    </button>
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
                    <div className='task-delete'>
                      <button 
                        className="delete-button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                      >
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Общее пустое состояние */}
        {tasks.length === 0 && habits.length === 0 && (
          <div className="empty-dashboard">
            <p>No tasks or habits yet. Add your first item!</p>
          </div>
        )}
      </div>

      {/* Фиксированное нижнее меню */}
      <div className='bottom-menu'>
        <h3 className="page-title">Dashboard</h3>
        <button 
          className="add-button"
          onClick={() => setShowAddItemPage(true)}
        >
          + Add
        </button>
      </div>
    </div>
  );
};

export default Dashboard;