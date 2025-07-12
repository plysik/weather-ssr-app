import {
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";
import { parseOpenWeatherToWeatherData } from "@/shared/utils";
import type { OpenWeatherResponse, WeatherData } from "@/typings/weather";

export const fetchWeather = createAsyncThunk(
	"weather/fetchWeather",
	async (city: string) => {
		// 1) current
		const currResp = await fetch(`/api/weather/${encodeURIComponent(city)}`);
		if (!currResp.ok) throw new Error(currResp.statusText);
		const current: OpenWeatherResponse = await currResp.json();
		// 2) comparison
		const compResp = await fetch("/api/weather/comparison");
		if (!compResp.ok) throw new Error(compResp.statusText);
		const comparison: OpenWeatherResponse[] = await compResp.json();

		return { current, comparison };
	},
);

export const fetchForecast = createAsyncThunk(
	"weather/fetchForecast",
	async (city: string) => {
		const resp = await fetch(
			`/api/weather/forecast/${encodeURIComponent(city)}`,
		);
		if (!resp.ok) throw new Error(resp.statusText);
		return (await resp.json()) as {
			dt: number;
			temp: { day: number; min: number; max: number };
			weather: { description: string; icon: string }[];
		}[];
	},
);

interface WeatherState {
	current: WeatherData | null;
	comparison: WeatherData[];
	status: "idle" | "loading" | "failed";
	error: string | null;
	forecast: {
		dt: number;
		temp: { day: number; min: number; max: number };
		weather: { description: string; icon: string }[];
	}[];
}

const initialState: WeatherState = {
	current: null,
	comparison: [],
	status: "idle",
	error: null,
	forecast: [],
};

const slice = createSlice({
	name: "weather",
	initialState,
	reducers: {
		clearWeather(state) {
			state.current = null;
			state.comparison = [];
			state.status = "idle";
			state.error = null;
			state.forecast = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWeather.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(
				fetchWeather.fulfilled,
				(
					state,
					action: PayloadAction<{
						current: OpenWeatherResponse;
						comparison: OpenWeatherResponse[];
					}>,
				) => {
					state.status = "idle";
					state.error = null;
					// mapujemy OpenWeatherResponse → WeatherData
					state.current = parseOpenWeatherToWeatherData(action.payload.current);
					// mapujemy tablicę OpenWeatherResponse → WeatherData
					state.comparison = action.payload.comparison.map((d) =>
						parseOpenWeatherToWeatherData(d),
					);
				},
			)
			.addCase(fetchForecast.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(fetchForecast.fulfilled, (state, action) => {
				state.status = "idle";
				state.error = null;
				state.forecast = action.payload;
			})
			.addCase(fetchForecast.rejected, (state, action) => {
				state.error = action.error.message || "Unknown error";
			});
	},
});

export const { clearWeather } = slice.actions;
export default slice.reducer;
