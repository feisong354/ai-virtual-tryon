import { configureStore } from '@reduxjs/toolkit';
import tryonReducer from './slices/tryonSlice';

export const store = configureStore({
  reducer: {
    tryon: tryonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
