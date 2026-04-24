import React from 'react';
import { useAppSelector } from '../store';
import { SettingsSkeleton } from '../components/ui/Skeletons';
import BottomNav from '../components/Layout/BottomNav';
import './settings.css';

const SettingsPage: React.FC = () => {
  const { user } = useAppSelector(s => s.auth);

  const displayName = user?.first_name
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
    : user?.username ?? 'User';

  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="settings-page">
      <div className="settings-content">
        <h1 className="settings-title">Settings</h1>

        {!user ? <SettingsSkeleton /> : (
          <div className="settings-profile">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-info">
              <span className="profile-name">{displayName}</span>
              {user.username && (
                <span className="profile-username">@{user.username}</span>
              )}
            </div>
          </div>
        )}

        <div className="settings-section">
          <h2 className="settings-section-label">Features</h2>
          <div className="settings-group">
            <div className="settings-row">
              <span className="settings-row-label">Task tracking</span>
              <span className="settings-row-badge">Active</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Habit streaks</span>
              <span className="settings-row-badge">Active</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Statistics</span>
              <span className="settings-row-badge">Active</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-label">About</h2>
          <div className="settings-group">
            <div className="settings-row">
              <span className="settings-row-label">Version</span>
              <span className="settings-row-value">1.0.0</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Platform</span>
              <span className="settings-row-value">Telegram Mini App</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Stack</span>
              <span className="settings-row-value">React + FastAPI</span>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SettingsPage;
