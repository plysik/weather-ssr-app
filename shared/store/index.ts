import { configureStore, combineReducers } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';

/* ---------- rootReducer ---------- */
const rootReducer = combineReducers({
  weather: weatherReducer,
});

/* ---------- typy stanu ---------- */
export type RootState = ReturnType<typeof rootReducer>;
export type PreloadedState = Partial<RootState>;

/* ---------- fabryka storeʼa ---------- */
export const createStore = (preloadedState?: PreloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

/* ---------- typ dispatch ---------- */
export type AppDispatch = ReturnType<
  ReturnType<typeof createStore>['dispatch']
>;
