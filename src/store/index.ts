import { configureStore } from "@reduxjs/toolkit";
import weatherReducer, { type WeatherState } from "./weatherSlice";

export function makeStore(preloadedState?: { weather: WeatherState }) {
	return configureStore({
		reducer: { weather: weatherReducer },
		preloadedState,
	});
}

// Typy:
export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
