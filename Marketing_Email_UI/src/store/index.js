import { configureStore } from '@reduxjs/toolkit';
import campaignReducer from './campaignSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    auth: authReducer,
  },
});
