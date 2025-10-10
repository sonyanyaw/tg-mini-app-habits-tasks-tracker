import React, { useState } from 'react';
import AddTaskForm from './AddTaskForm';
import AddHabitForm from './AddHabitForm';
import { addTask, addHabit, type Task, type Habit } from '../services/api'; 
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

  const handleTaskAdded = async (taskData: Omit<Task, 'id' | 'completed' | 'owner_id'>) => {
    try {
      const response = await addTask({ title: taskData.title, description: taskData.description });
      if (onTaskAdded) {
        onTaskAdded(response.data);
      }
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleHabitAdded = async (habitData: Omit<Habit, 'id' | 'is_active' | 'owner_id' | 'created_date' | 'completions'>) => {
    try {
      const response = await addHabit({
        title: habitData.title,
        description: habitData.description,
        frequency: habitData.frequency,
        duration: habitData.duration,
      });
      if (onHabitAdded) {
        onHabitAdded(response.data);
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
          <div className="item-type-icon">📋</div> {/* Добавим иконки */}
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