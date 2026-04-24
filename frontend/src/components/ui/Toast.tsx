import React, { useEffect, useState } from 'react';
import { registerToastHandler, type ToastType } from '../../utils/toast';
import './toast.css';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  exiting: boolean;
}

const DURATION = 3000;
const EXIT_DURATION = 300;

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    registerToastHandler((message, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type, exiting: false }]);

      setTimeout(() => {
        setToasts(prev =>
          prev.map(t => t.id === id ? { ...t, exiting: true } : t)
        );
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, EXIT_DURATION);
      }, DURATION);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type} ${t.exiting ? 'toast--exit' : ''}`}>
          <span className="toast-icon">
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
