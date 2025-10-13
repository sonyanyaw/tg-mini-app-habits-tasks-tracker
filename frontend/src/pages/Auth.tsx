import { useEffect, useState } from 'react';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import { useAppSelector } from '../store';
import { useNavigate } from 'react-router-dom';
import './auth.css';
import { isTMA } from '@telegram-apps/sdk';

const Auth = () => {
  const [error] = useState<string | null>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useTelegramAuth();

  // Если пользователь успешно аутентифицирован, перенаправляем
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    } 
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Проверяем, запущено ли приложение в Telegram Mini App
      const isRunningInTMA = await isTMA(); // Используем isTMA из @telegram-apps/bridge

      if (!isRunningInTMA && !isAuthenticated) {
        console.log("Not in Telegram and not authenticated. Redirecting to bot...");
        // Перенаправляем на бота в Telegram
        window.location.href = "https://t.me/habit_n_task_tracker_bot?start=start"; // <-- Замените на вашу ссылку
      }
    };

    checkAndRedirect();
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return null; 
  }

  if (error) {
    return (
      <div className='auth-page'>
        <h2>Ошибка аутентификации</h2>
        <p>{error}</p>
        <a 
          href="https://t.me/your_bot_username?start=your_start_param" // <-- Замените на вашу ссылку
          target="_blank" 
          rel="noopener noreferrer"
          className="open-in-telegram-button"
        >
          Open in Telegram
        </a>
      </div>
    );
  }

  // Отображаем состояние загрузки только если не аутентифицирован и нет ошибки
  return (
    <div className='auth-page'>
      <h2>Авторизация через Telegram...</h2>
      <p>Пожалуйста, подождите...</p>
      <a 
        href="https://t.me/habit_n_task_tracker_bot?start=start" // <-- Замените на вашу ссылку
        target="_blank" 
        rel="noopener noreferrer"
        className="open-in-telegram-button"
      >
        Open in Telegram
      </a>
    </div>
  );
};

export default Auth;