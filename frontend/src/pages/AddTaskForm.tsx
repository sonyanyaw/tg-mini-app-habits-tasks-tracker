import React, { useState } from 'react';
import { addTask, type TaskCreate, type Task } from '../services/api'; 
import './add.css';

interface AddTaskFormProps {
  onTaskAdded: (task: Task) => void;
  onBack: () => void;
  onCancel?: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded, onBack, onCancel }) => {
  // const [taskAdded, setTaskAdded] = useState({});
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split('T')[0]); 

  const handleAddTask = async (e: React.FormEvent) => {
    console.log("handleAddTask called");
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    // Создаём объект данных для отправки
    const newTaskData: TaskCreate = {
      title: newTaskTitle,
      description: newTaskDescription,
      due_date: newTaskDueDate,
    };
    console.log('add task', newTaskData)
    try {
      // Вызываем API функцию addTask
      const response = await addTask(newTaskData);
      // Передаём полученный полный объект Task в onTaskAdded
      onTaskAdded(response.data);
      // setTaskAdded(response.data)
      // Закрываем форму после успешного добавления
      if (onCancel) {
          onCancel();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="add-task-page">
      <div className="add-task-header">
        <div className="header-buttons">
            <button className="back-button" onClick={onBack}>
            ← Back
            </button>
            <div className='cancel-adding-task'>
            {onCancel && (
                <button className="cancel-button" onClick={handleCancel}>
                ✕
                </button>
            )}
            </div>
        </div>
        <h2 className="page-title">Add New Task</h2>
      </div>

      <form className="add-task-form" onSubmit={handleAddTask}>
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">Title *</label>
          <input
            id="task-title"
            type="text"
            className="add-task-input"
            placeholder="Enter task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description" className="form-label">Description</label>
          <textarea
            id="task-description"
            className="add-task-textarea"
            placeholder="Enter task description (optional)..."
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            rows={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-due-date" className="form-label">Due Date</label>
          <input
            id="task-due-date"
            type="date"
            className="add-task-input"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="cancel-form-button" onClick={handleCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="add-task-button">
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;