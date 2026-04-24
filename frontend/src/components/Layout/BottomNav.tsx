import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarIcon, BarChartIcon, SettingsIcon } from '../ui/Icons';
import './bottom-nav.css';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: '/tasks', icon: HomeIcon, label: 'Home' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendar' },
    { path: '/stats', icon: BarChartIcon, label: 'Stats' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            className={`nav-item ${active ? 'nav-item--active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={21} color={active ? '#7e57c2' : '#666'} />
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
