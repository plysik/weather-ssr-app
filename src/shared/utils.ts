export function parseOpenWeatherToWeatherData(
	data: OpenWeatherResponse,
): WeatherData {
	return {
		name: data.name,
		temp: data.main.temp,
		feels_like: data.main.feels_like,
		humidity: data.main.humidity,
		pressure: data.main.pressure,
		wind_speed: data.wind.speed,
		description: data.weather[0]?.description ?? "",
		icon: data.weather[0]?.icon ?? "",
	};
}
