// src/common/api/fetchWeather.ts

import type { OpenWeatherResponse, WeatherData } from "../typings/weather";

/**
 * Fetches the current weather data for the specified city.
 * @param city - The name of the city
 * @returns Promise resolving to WeatherData
 */
export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
	const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || `Failed to fetch weather for ${city}`);
	}
	const data: OpenWeatherResponse = await response.json();
	return {
		name: data.name,
		temp: data.main.temp,
		feels_like: data.main.feels_like,
		humidity: data.main.humidity,
		pressure: data.main.pressure,
		wind_speed: data.wind.speed,
		wind_deg: data.wind.deg,
		description: data.weather[0]?.description ?? "",
		icon: data.weather[0]?.icon ?? "",
	};
}

/**
 * Fetches weather data for popular cities for comparison purposes.
 * Returns an array of Partial<WeatherData> with selected properties.
 * @returns Promise resolving to an array of partial WeatherData objects
 */
export async function fetchComparisonWeather(): Promise<
	Partial<WeatherData>[]
> {
	const response = await fetch("/api/weather/comparison");
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to fetch comparison data");
	}
	const data: OpenWeatherResponse[] = await response.json();
	return data.map((item) => ({
		name: item.name,
		temp: item.main.temp,
		humidity: item.main.humidity,
		wind_speed: item.wind.speed,
		wind_deg: item.wind.deg,
		// Additional fields available if needed
		feels_like: item.main.feels_like,
		pressure: item.main.pressure,
		description: item.weather[0]?.description ?? "",
		icon: item.weather[0]?.icon ?? "",
	}));
}

/**
 * Combines fetching of current and comparison weather data into a single call.
 * @param city - The name of the city
 * @returns Promise resolving to an object containing current and comparison data
 */
export async function fetchWeatherData(
	city: string,
): Promise<{ current: WeatherData; comparison: Partial<WeatherData>[] }> {
	const [current, comparison] = await Promise.all([
		fetchCurrentWeather(city),
		fetchComparisonWeather(),
	]);
	return { current, comparison };
}
