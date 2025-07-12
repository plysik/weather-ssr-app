// src/common/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';

/**
 * Configure and create the Redux store using Redux Toolkit.
 * Default middleware includes thunk and DevTools support out of the box.
 */
const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

/**
 * Infer the `RootState` and `AppDispatch` types from the store itself.
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
