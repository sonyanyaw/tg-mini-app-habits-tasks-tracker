import React, { useState } from 'react';
import AddTaskForm from './AddTaskForm';
import AddHabitForm from './AddHabitForm';
import { type Task, type Habit } from '../services/api'; 
import './add.css';

interface AddItemPageProps {
  onTaskAdded?: (task: Task) => void;
  onHabitAdded?: (habit: Habit) => void;
  onCancel?: () => void;
}

const AddItemPage: React.FC<AddItemPageProps> = ({ onTaskAdded, onHabitAdded, onCancel }) => {
  const [itemType, setItemType] = useState<'task' | 'habit' | null>(null);

  const handleSelectTask = () => {
    setItemType('task');
  };

  const handleSelectHabit = () => {
    setItemType('habit');
  };

  const handleBackToSelect = () => {
    setItemType(null);
  };

  // Обновляем handleTaskAdded
  const handleTaskAdded = async (taskData: Task) => { // Принимаем TaskCreate, а не Omit<Task, ...>
    // console.log("handleTaskAdded called", taskData);
    try {
      // const response = await addTask(taskData);
      if (onTaskAdded) {
        onTaskAdded(taskData);
      }
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleHabitAdded = async (habitData: Habit) => {
    // console.log("handleHabitAdded called", habitData);
    try {
      if (onHabitAdded) {
        onHabitAdded(habitData);
      }
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (itemType === 'task') {
    return <AddTaskForm onTaskAdded={handleTaskAdded} onBack={handleBackToSelect} onCancel={handleCancel} />;
  }

  if (itemType === 'habit') {
    return <AddHabitForm onHabitAdded={handleHabitAdded} onBack={handleBackToSelect} onCancel={handleCancel} />;
  }

  return (
    <div className="add-item-page">
      <div className="add-item-header">
        <div className='cancel-adding-item'>
          {onCancel && (
            <button className="cancel-button" onClick={handleCancel}>
              ✕
            </button>
          )}
        </div>
        <h2 className="page-title">Add New</h2>
      </div>

      <div className="item-type-selector">
        <button className="item-type-button" onClick={handleSelectTask}>
          <div className="item-type-icon">📋</div>
          <div className="item-type-label">Task</div>
        </button>
        <button className="item-type-button" onClick={handleSelectHabit}>
          <div className="item-type-icon">✅</div>
          <div className="item-type-label">Habit</div>
        </button>
      </div>
    </div>
  );
};

export default AddItemPage;