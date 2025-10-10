import React, { useState } from 'react';
import { addTask, type TaskCreate } from '../services/api';
import './add.css';


interface AddTaskFormProps {
  onTaskAdded: (taskData: TaskCreate) => void; // Принимаем данные для создания
  onBack: () => void;
  onCancel?: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded, onBack, onCancel }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onTaskAdded({ title: newTaskTitle, description: newTaskDescription });
};
    // try {
    //   const response = await addTask({ title: newTaskTitle, description: newTaskDescription });
    //   onTaskAdded(response.data);
    // } catch (error) {
    //   console.error('Error adding task:', error);
    // }
//   };

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

        <div className="form-actions">
          {/* <button type="button" className="back-form-button" onClick={onBack}>
            Back
          </button> */}
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