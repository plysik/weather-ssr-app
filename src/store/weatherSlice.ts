// src/common/store/weatherSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WeatherState, WeatherData } from '../typings/weather';

/**
 * Initial state of the weather module.
 */
const initialState: WeatherState = {
  current: null,
};

/**
 * Slice for weather state management.
 * Includes actions to set and clear current weather data.
 */
const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    /**
     * Stores fetched weather data.
     * @param state - current slice state
     * @param action - PayloadAction containing WeatherData
     */
    fetchSuccess(state, action: PayloadAction<WeatherData>) {
      state.current = action.payload;
    },
    /**
     * Clears the current weather data.
     * @param state - current slice state
     */
    clear(state) {
      state.current = null;
    },
  },
});

// Export actions for dispatching
export const { fetchSuccess, clear } = weatherSlice.actions;

// Export reducer to be added to the store
export default weatherSlice.reducer;

/**
 * Types for the weather state and data
 */
export type { WeatherState, WeatherData };
