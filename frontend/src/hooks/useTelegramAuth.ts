import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateTelegram } from '../services/api';
import { setCredentials } from '../store/slices/authSlice';
import { useAppDispatch } from '../store';
import { isTMA } from '@telegram-apps/bridge';

export const useTelegramAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      console.log("useTelegramAuth: Starting auth check...");
      // --- Проверяем, запущено ли приложение в Telegram Mini App ---
      if (!isTMA()) {
        console.warn('App is running outside Telegram. Skipping Telegram auth.');
        console.log('tma')     
        return;
      } else {
        console.log('App is running inside Telegram.')
      }

      const hash = window.location.hash.slice(1);
      console.log(hash); 
      const urlParams = new URLSearchParams(hash);
      const initDataRawFromUrl = urlParams.get('tgWebAppData');
      console.log("useTelegramAuth: Extracted initDataRaw from URL:", initDataRawFromUrl);

      if (!initDataRawFromUrl) {
        console.error('useTelegramAuth: Failed to extract initDataRaw from URL hash.');
        return;
      }

      // const params = new URLSearchParams(hash);
      // console.log(params.get('tgWebAppVersion')); // "6.2"

      // Если в Telegram, пытаемся получить launch params
      // const { initDataRaw, initData } = retrieveLaunchParams();
      
      // console.log(initDataRaw, initData)

      // Проверяем, что initData существует
      // if (!initData) {
      //   console.error('No Telegram init data found');
      //   return;
      // }

      // Явно указываем тип initData, чтобы TypeScript знал его структуру
      // retrieveLaunchParams возвращает тип, который включает InitData
      // const typedInitData = initData as InitData;

      // // Проверяем, что у typedInitData есть user
      // const userData = typedInitData.user;
      // if (!userData) {
      //   console.error('No user data found in Telegram init data');
      //   return;
      // }

      // // Проверим, что у userData есть необходимые свойства
      // if (typeof userData.id === 'undefined') {
      //   console.error('User ID is missing in Telegram init data');
      //   return;
      // }

      // // Преобразуем структуру typedInitData в плоский объект, как ожидалось ранее
      // // Обратите внимание на имена полей: firstName -> first_name и т.д.
      // const authData: TelegramInitData = {
      //   id: userData.id.toString(), // Telegram ID пользователя
      //   first_name: userData.first_name || '', // Используем firstName (как в SDK), но ожидаем first_name (как в API)
      //   last_name: userData.last_name,         // lastName -> last_name
      //   username: userData.username,          // username -> username
      //   photo_url: userData.photo_url,         // photoUrl -> photo_url
      //   auth_date: typedInitData.auth_date.toString(), // authDate -> auth_date
      //   hash: typedInitData.hash || '', // hash -> hash
      // };

      // if (!authData.id || !authData.hash) {
      //   console.error('Missing required Telegram auth data (id or hash)');
      //   return;
      // }

      try {
        console.log("useTelegramAuth: Sending initDataRaw to backend for authentication...");
        const authPayload = {
          init_data_raw: initDataRawFromUrl // Имя поля должно совпадать с ожидаемым в бэкенде
        };
        console.log("useTelegramAuth: Sending auth payload to backend:", authPayload);
        const response = await authenticateTelegram(authPayload);
        console.log("useTelegramAuth: Authentication successful, response:", response.data);


        // const response = await authenticateTelegram(authData);
        dispatch(setCredentials(response.data));
        navigate('/tasks');
      } catch (error) {
        console.error('Authentication failed', error);
      }
    };

    initAuth();
  }, [dispatch, navigate]);
};