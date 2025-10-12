import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';

// --- Создаём хранилище ОДИН РАЗ ---
export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setCredentials'],
        ignoredPaths: ['auth.user'],
      },
    }),
});
// ---

export type AppStore = typeof store; // Тип хранилища
export type RootState = ReturnType<AppStore['getState']>; // Тип состояния
export type AppDispatch = AppStore['dispatch']; // Тип диспатча

// Типизированные хуки
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// --- Экспортируем глобальный экземпляр ---
export default store;