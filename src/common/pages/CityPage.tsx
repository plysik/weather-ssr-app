import { Card, CardContent, CardHeader } from "@components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@components/ui/table";
import { Droplet, Gauge, Thermometer, Wind } from "lucide-react";
// biome-ignore lint/style/useImportType: <explanation>
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWeatherData } from "../../api/fetchWeather";
import type { OpenWeatherResponse, WeatherData } from "../../typings/weather";

const CityPage: React.FC = () => {
	const { city } = useParams<{ city: string }>();
	const decodedCity = city ? decodeURIComponent(city) : "";

	const [current, setCurrent] = useState<WeatherData | null>(null);
	const [comparison, setComparison] = useState<WeatherData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		(async () => {
			// 1) sprawdź SSR-injected data
			const init: {
				current: OpenWeatherResponse;
				comparison: Partial<OpenWeatherResponse>[];
			} = (window as any).__INITIAL_DATA__;
			console.log("SSR initial data:", init);
			if (init && init.current && init.comparison) {
				setCurrent(init.current);
				setComparison(init.comparison);
				setLoading(false);
				delete (window as any).__INITIAL_DATA__;
				return;
			}
			setLoading(true);
			setError("");
			try {
				const { current: curr, comparison: comp } =
					await fetchWeatherData(decodedCity);
				setCurrent(curr);
				setComparison(comp as WeatherData[]);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		})();
	}, [decodedCity]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				Loading weather data…
			</div>
		);
	}

	if (error) {
		return <div className="text-center text-red-600">Error: {error}</div>;
	}

	if (!current) {
		return null;
	}

	const iconUrl = `https://openweathermap.org/img/wn/${current.icon}@2x.png`;

	return (
		<div className="space-y-8 p-4">
			{/* Current Weather */}
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<h2 className="text-2xl font-semibold mt-2">
						Weather in {current.name}
					</h2>
					<div className="flex items-center space-x-3 mt-2">
						<img
							src={iconUrl}
							alt={current.description}
							className="w-12 h-12"
						/>
						<p className="text-sm text-gray-500">{current.description}</p>
					</div>
				</CardHeader>
				<CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
					<div className="flex items-center space-x-3">
						<Thermometer size={28} />
						<div>
							<p className="text-lg font-medium">
								{current.temp?.toFixed(1)} °C
							</p>
							<p className="text-sm text-gray-500">Temperature</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Thermometer size={28} className="rotate-180" />
						<div>
							<p className="text-lg font-medium">
								{current.feels_like.toFixed(1)} °C
							</p>
							<p className="text-sm text-gray-500">Feels Like</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Droplet size={28} />
						<div>
							<p className="text-lg font-medium">{current.humidity}%</p>
							<p className="text-sm text-gray-500">Humidity</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Gauge size={28} />
						<div>
							<p className="text-lg font-medium">{current.pressure} hPa</p>
							<p className="text-sm text-gray-500">Pressure</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Wind size={28} />
						<div>
							<p className="text-lg font-medium">
								{current.wind_speed.toFixed(1)} m/s
							</p>
							<p className="text-sm text-gray-500">Wind Speed</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Comparison Table */}
			<Card className="max-w-5xl mx-auto">
				<CardHeader>
					<h3 className="text-xl font-medium">
						Comparison with Popular Cities
					</h3>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell>City</TableCell>
								<TableCell>Temp (°C)</TableCell>
								<TableCell>Humidity (%)</TableCell>
								<TableCell>Wind (m/s)</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{comparison.map((c) => {
								const dTemp = c.temp - current.temp;
								const dHum = c.humidity - current.humidity;
								const dWind = c.wind_speed - current.wind_speed;
								return (
									<TableRow key={c.name}>
										<TableCell>{c.name}</TableCell>
										<TableCell>
											{c.temp.toFixed(1)} (
											{dTemp > 0 ? `+${dTemp.toFixed(1)}` : dTemp.toFixed(1)})
										</TableCell>
										<TableCell>
											{c.humidity} ({dHum > 0 ? `+${dHum}` : dHum})
										</TableCell>
										<TableCell>
											{c.wind_speed.toFixed(1)} (
											{dWind > 0 ? `+${dWind.toFixed(1)}` : dWind.toFixed(1)})
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};

export default CityPage;
