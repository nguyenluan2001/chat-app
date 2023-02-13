import { configureStore } from '@reduxjs/toolkit';
import ChatReducer from './slices/chat';

export const store = configureStore({
  reducer: {
    chat: ChatReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
