import React from 'react';
import { type Task } from '../../services/api';
import { formatDisplayDate, formatLocalDate } from '../../utils/date';
import { TrashIcon } from '../ui/Icons';
import { TasksSkeleton } from '../ui/Skeletons';

import './TasksSection.css';

interface TasksSectionProps {
  title: Date;
  pending: Task[];
  completed: Task[];
  loading?: boolean;
  onToggle: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

function isOverdue(task: Task): boolean {
  if (task.is_completed_today || !task.due_date || task.recurrence_type) return false;
  const today = formatLocalDate(new Date());
  return task.due_date.substring(0, 10) < today;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  title,
  pending,
  completed,
  loading,
  onToggle,
  onDelete,
}) => {
  const renderTask = (task: Task) => (
    <li key={task.id} className={`task-item ${task.is_completed_today ? 'task-item--done' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.is_completed_today ?? false}
        onChange={() => onToggle(task.id)}
      />
      <div className="task-content">
        <div className="task-title-row">
          <span className={`task-text ${task.is_completed_today ? 'task-text--done' : ''}`}>
            {task.title}
          </span>
          {isOverdue(task) && (
            <span className="task-overdue-badge">Overdue</span>
          )}
        </div>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>
      <button
        className="delete-button"
        onClick={e => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        aria-label="Delete task"
      >
        <TrashIcon size={15} />
      </button>
    </li>
  );

  const dateLabel = formatDisplayDate(title);

  return (
    <>
      <div className="tasks-section">
        <div className="tasks-header">
          <h3>Tasks <span className="tasks-date-label">— {dateLabel}</span></h3>
          {pending.length > 0 && (
            <span className="tasks-count">{pending.length}</span>
          )}
        </div>

        {loading ? (
          <TasksSkeleton />
        ) : pending.length === 0 && completed.length === 0 ? (
          <div className="tasks-empty">
            <p className="tasks-empty-icon">✓</p>
            <p className="tasks-empty-text">All clear for {dateLabel}!</p>
            <p className="tasks-empty-sub">Tap + to add a task.</p>
          </div>
        ) : (
          <ul className="task-list">{pending.map(renderTask)}</ul>
        )}
      </div>

      {!loading && completed.length > 0 && (
        <div className="completed-section">
          <div className="completed-header">
            <h4>Completed ({completed.length})</h4>
          </div>
          <ul className="task-list">{completed.map(renderTask)}</ul>
        </div>
      )}
    </>
  );
};

export default TasksSection;
