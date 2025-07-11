import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { WeatherData, WeatherState } from 'shared/types';



const initialState: WeatherState = { current: null };

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCurrent(state, action: PayloadAction<WeatherData>) {
      console.log('[REDUCER] setCurrent:', action.payload);
      return { ...state, current: action.payload };
    },
    clearCurrent(state) {
      return { ...state, current: null};
    },
  },
});

export const { setCurrent, clearCurrent } = weatherSlice.actions;
export const selectCurrentWeather = (state: RootState) =>
  state.weather.current;

export default weatherSlice.reducer;
