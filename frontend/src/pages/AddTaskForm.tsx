import React, { useState } from 'react';
import { addTask, type TaskCreate, type Task } from '../services/api';
import { toast } from '../utils/toast';
import { formatLocalDate } from '../utils/date';
import './add.css';

interface AddTaskFormProps {
  onTaskAdded: (task: Task) => void;
  onBack: () => void;
  onCancel?: () => void;
}

const CATEGORY_PRESETS = ['Work', 'Personal', 'Health', 'Study'];

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded, onBack, onCancel }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(formatLocalDate(new Date()));
  const [category, setCategory] = useState('');

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTaskData: TaskCreate = {
      title: newTaskTitle,
      description: newTaskDescription,
      due_date: newTaskDueDate,
      category: category.trim() || undefined,
    };

    try {
      const response = await addTask(newTaskData);
      onTaskAdded(response.data);
      toast.success("Task added!");
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Failed to add task");
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="add-task-page">
      <div className="add-task-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2 className="page-title">Add New Task</h2>
          {onCancel
          ? <button className="cancel-button" onClick={handleCancel}>✕</button>
          : <div className="header-spacer" />}
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
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="category-presets">
            {CATEGORY_PRESETS.map(preset => (
              <button
                key={preset}
                type="button"
                className={`category-chip ${category === preset ? 'category-chip--active' : ''}`}
                onClick={() => setCategory(category === preset ? '' : preset)}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            id="task-category"
            type="text"
            className="add-task-input"
            placeholder="Or type a custom category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={50}
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
