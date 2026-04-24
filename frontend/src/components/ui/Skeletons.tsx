import React from 'react';
import './skeletons.css';

export const StatsSkeleton: React.FC = () => (
  <>
    <div className="stats-summary">
      {[1, 2, 3].map(i => (
        <div key={i} className="summary-card">
          <div className="sk sk-summary-value" />
          <div className="sk sk-summary-label" />
        </div>
      ))}
    </div>
    <h2 className="stats-section-title">Habit Details</h2>
    <div className="stat-habits-list">
      {[1, 2].map(i => (
        <div key={i} className="stat-habit-card">
          <div className="stat-habit-header">
            <div className="sk sk-stat-title" />
            <div className="sk sk-streak-badge" />
          </div>
          <div className="stat-week-dots" style={{ marginTop: 12 }}>
            {[...Array(7)].map((_, j) => (
              <div key={j} className="sk sk-week-dot" />
            ))}
          </div>
          <div className="sk sk-progress" />
          <div className="sk sk-rate-label" />
        </div>
      ))}
    </div>
  </>
);

export const CalendarTasksSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {[1, 2].map(i => (
      <div key={i} className="cal-task-item" style={{ gap: '10px' }}>
        <div className="sk sk-checkbox" />
        <div className="sk sk-task-title" style={{ flex: 1, width: `${50 + i * 15}%` }} />
      </div>
    ))}
  </div>
);

export const CalendarGridSkeleton: React.FC = () => (
  <div className="cal-grid">
    {[...Array(35)].map((_, i) => (
      <div key={i} className="sk sk-cal-day" />
    ))}
  </div>
);

export const SettingsSkeleton: React.FC = () => (
  <div className="settings-profile">
    <div className="sk sk-avatar" />
    <div className="profile-info">
      <div className="sk sk-profile-name" />
      <div className="sk sk-profile-username" />
    </div>
  </div>
);

export const HabitsSkeleton: React.FC = () => (
  <div className="habits-container">
    {[1, 2].map(i => (
      <div key={i} className="habit-block">
        <div className="habit-header">
          <div className="sk sk-title" />
          <div className="sk sk-badge" />
        </div>
        <div className="habit-day-labels">
          {[...Array(7)].map((_, j) => (
            <span key={j} className="habit-day-label">·</span>
          ))}
        </div>
        <div className="habit-checks-row">
          {[...Array(7)].map((_, j) => (
            <div key={j} className="sk sk-check" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const TasksSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {[1, 2, 3].map(i => (
      <div key={i} className="task-item" style={{ gap: '10px' }}>
        <div className="sk sk-checkbox" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div className="sk sk-task-title" style={{ width: `${55 + i * 12}%` }} />
        </div>
      </div>
    ))}
  </div>
);
