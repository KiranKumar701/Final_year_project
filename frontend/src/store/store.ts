import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import meetingSlice from './slices/meetingSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    meeting: meetingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;