import { useEffect, useState } from 'react';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import { useAppSelector } from '../store';
import { useNavigate } from 'react-router-dom';
import './auth.css';

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

  if (isAuthenticated) {
    return null; 
  }

  if (error) {
    return (
      <div className='auth-page'>
        <h2>Ошибка аутентификации</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Отображаем состояние загрузки только если не аутентифицирован и нет ошибки
  return (
    <div className='auth-page'>
      <h2>Авторизация через Telegram...</h2>
      <p>Пожалуйста, подождите...</p>
    </div>
  );
};

export default Auth;