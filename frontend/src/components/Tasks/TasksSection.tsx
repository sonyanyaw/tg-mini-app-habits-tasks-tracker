import React from 'react';
import { type Task } from '../../services/api';
import { formatDate, formatDisplayDate } from '../../utils/date';

import './TasksSection.css';

interface TasksSectionProps {
  title: Date;
  pending: Task[];
  completed: Task[];
  onToggle: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  title,
  pending,
  completed,
  onToggle,
  onDelete,
}) => {
  const renderTask = (task: Task) => (
    <li key={task.id} className={`task-item ${task.is_completed_today ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.is_completed_today ?? false}
        onChange={() => onToggle(task.id)}
      />
      <div className="task-content">
        <span className={`task-text ${task.is_completed_today ? 'task-completed' : ''}`}>
          {task.title}
        </span>
        {task.description && <p className="task-description">{task.description}</p>}
      </div>
      <button
        className="delete-button"
        onClick={e => {
          e.stopPropagation();
          onDelete(task.id);
        }}
      >
        X
      </button>
    </li>
  );

  return (
    <>
    <div className="tasks-section">
      <div className="tasks-header">
        <h3>Tasks for {formatDisplayDate(title)}</h3>
        <span className="tasks-count">{pending.length} tasks</span>
      </div>

      <div className='tasks-list'>
        <ul className="task-list">{pending.map(renderTask)}</ul>
      </div>
    </div>


      {completed.length > 0 && (
        <div className="completed-section">
          <div className='completed-header'>
            <h4>Completed ({completed.length})</h4>
          </div>
          <div className='completed-list'>
            <ul className="task-list">{completed.map(renderTask)}</ul>
          </div>
        </div>
      )}

      {pending.length === 0 && completed.length === 0 && (
        <div className="empty-state">
          <p>No tasks for {formatDate(title)}</p>
        </div>
      )}
    {/* </div> */}
    </>
  );
};

export default TasksSection;
