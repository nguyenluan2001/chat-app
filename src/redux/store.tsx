import { configureStore } from '@reduxjs/toolkit';
import ChatReducer from './slices/chat';

export const store = configureStore({
  reducer: {
    chat: ChatReducer,
  },
});
