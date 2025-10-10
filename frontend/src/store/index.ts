import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';

export const store = () => configureStore({
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

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'; 
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;