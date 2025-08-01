import dotenv from "dotenv";

dotenv.config();
const OPEN_WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = process.env.API_KEY;
/**
 * Builds the full OpenWeatherMap request URL for a given city,
 * including metric units and Polish language.
 */
export function buildWeatherUrl(city: string): string {
	const params = new URLSearchParams({
		q: city,
		appid: API_KEY,
		units: "metric",
		lang: "pl",
	});
	return `${OPEN_WEATHER_BASE_URL}?${params.toString()}`;
}

export function buildForecastUrl(lat: number, lon: number): string {
	const params = new URLSearchParams({
		appid: API_KEY,
		lat: lat.toString(),
		lon: lon.toString(),
		units: "metric",
		lang: "pl",
		cnt: "5",
	});
	return `https://api.openweathermap.org/data/2.5/forecast?${params.toString()}`;
}
