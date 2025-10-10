import React, { useState } from 'react';
import { addHabit, type HabitCreate } from '../services/api';
import './add.css';


interface AddHabitFormProps {
  onHabitAdded: (habitData: HabitCreate) => void;
  onBack: () => void;
  onCancel?: () => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onHabitAdded, onBack, onCancel }) => {
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('daily');
  const [newHabitDuration, setNewHabitDuration] = useState(21); // по умолчанию 21 день

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    onHabitAdded({
      title: newHabitTitle,
      description: newHabitDescription,
      frequency: newHabitFrequency,
      duration: newHabitDuration,
    });
  };
//     try {
//       const response = await addHabit({
//         title: newHabitTitle,
//         description: newHabitDescription,
//         frequency: newHabitFrequency,
//         duration: newHabitDuration,
//       });
//       onHabitAdded(response.data);
//     } catch (error) {
//       console.error('Error adding habit:', error);
//     }
//   };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="add-task-page"> {/* Используем общий класс для стилизации */}
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
        <h2 className="page-title">Add New Habit</h2>
      </div>

      <form className="add-task-form" onSubmit={handleAddHabit}>
        <div className="form-group">
          <label htmlFor="habit-title" className="form-label">Title *</label>
          <input
            id="habit-title"
            type="text"
            className="add-task-input"
            placeholder="Enter habit title..."
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="habit-description" className="form-label">Description</label>
          <textarea
            id="habit-description"
            className="add-task-textarea"
            placeholder="Enter habit description (optional)..."
            value={newHabitDescription}
            onChange={(e) => setNewHabitDescription(e.target.value)}
            rows={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="habit-frequency" className="form-label">Frequency</label>
          <select
            id="habit-frequency"
            className="add-task-input"
            value={newHabitFrequency}
            onChange={(e) => setNewHabitFrequency(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="habit-duration" className="form-label">Duration (days)</label>
          <input
            id="habit-duration"
            type="number"
            className="add-task-input"
            placeholder="Duration in days"
            value={newHabitDuration}
            onChange={(e) => setNewHabitDuration(Number(e.target.value))}
            min="1"
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
            Add Habit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHabitForm;