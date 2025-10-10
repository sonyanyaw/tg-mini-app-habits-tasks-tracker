import { useEffect, useState } from 'react';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import { useAppSelector } from '../store';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const Auth = () => {
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // useTelegramAuth теперь вызывает аутентификацию
  useTelegramAuth();

  // Если пользователь успешно аутентифицирован, перенаправляем
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
  }, [isAuthenticated, navigate]);

  // Пока не аутентифицирован и нет ошибки
  if (isAuthenticated) {
    // Это условие сработает, если пользователь уже аутентифицирован, но случайно попал на /auth
    // Но useEffect выше должен был его перенаправить, так что этот случай редкий
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

  return (
    <div className='auth-page'>
      <h2>Авторизация через Telegram...</h2>
      <p>Пожалуйста, подождите...</p>
    </div>
  );
};

export default Auth;