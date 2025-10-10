import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateTelegram, type TelegramInitData } from '../services/api';
import { setCredentials } from '../store/slices/authSlice';
import { useAppDispatch } from '../store';
import { retrieveLaunchParams, type InitData } from '@telegram-apps/sdk';

export const useTelegramAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const { initData } = retrieveLaunchParams();
      
      // Проверяем, что initData существует
      if (!initData) {
        console.error('No Telegram init data found');
        return;
      }

      // Явно указываем тип initData, чтобы TypeScript знал его структуру
      // retrieveLaunchParams возвращает тип, который включает InitData
      const typedInitData = initData as InitData;

      // Проверяем, что у typedInitData есть user
      const userData = typedInitData.user;
      if (!userData) {
        console.error('No user data found in Telegram init data');
        return;
      }

      // Проверим, что у userData есть необходимые свойства
      if (typeof userData.id === 'undefined') {
        console.error('User ID is missing in Telegram init data');
        return;
      }

      // Преобразуем структуру typedInitData в плоский объект, как ожидалось ранее
      const authData: TelegramInitData = {
        id: userData.id.toString(), // Telegram ID пользователя
        first_name: userData.first_name || '', // firstName может отсутствовать или быть undefined
        last_name: userData.last_name,         // lastName может быть undefined
        username: userData.username,          // username может быть undefined
        photo_url: userData.photo_url,         // photoUrl может быть undefined
        auth_date: typedInitData.auth_date.toString(), // или .valueOf() для числа
        hash: typedInitData.hash || '', // hash может быть undefined, но бэкенд ожидает строку
      };

      if (!authData.id || !authData.hash) {
        console.error('Missing required Telegram auth data (id or hash)');
        return;
      }

      try {
        const response = await authenticateTelegram(authData);
        dispatch(setCredentials(response.data));
        navigate('/tasks');
      } catch (error) {
        console.error('Authentication failed', error);
      }
    };

    initAuth();
  }, [dispatch, navigate]);
};