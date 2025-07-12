import { Card, CardContent, CardHeader } from "@components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@components/ui/table";
import { format } from "date-fns";
import pl from "date-fns/locale/pl";
import { Droplet, Gauge, Thermometer, Wind } from "lucide-react";
// biome-ignore lint/style/useImportType: <explanation>
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchForecast, fetchWeather } from "@/store/weatherSlice";

const CityPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const { current, comparison, forecast, status, error } = useAppSelector(
		(s) => {
			return s.weather;
		},
	);
	const { city: paramCity } = useParams<{ city: string }>();
	const city = paramCity ? decodeURIComponent(paramCity) : "";

	useEffect(() => {
		if (city) {
			dispatch(fetchWeather(city));
			dispatch(fetchForecast(city));
		}
	}, [city, dispatch]);

	if (status === "loading") {
		return (
			<div className="flex justify-center items-center h-64">
				Wczytywanie danych...
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
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<h2 className="text-2xl font-semibold mt-2">
						Pogoda w {current.name}
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
								{current.temp.toFixed(1)} °C
							</p>
							<p className="text-sm text-gray-500">Temperatura</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Thermometer size={28} className="rotate-180" />
						<div>
							<p className="text-lg font-medium">
								{current.feels_like.toFixed(1)} °C
							</p>
							<p className="text-sm text-gray-500">Odczuwalna</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Droplet size={28} />
						<div>
							<p className="text-lg font-medium">{current.humidity}%</p>
							<p className="text-sm text-gray-500">Wilgotność</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Gauge size={28} />
						<div>
							<p className="text-lg font-medium">{current.pressure} hPa</p>
							<p className="text-sm text-gray-500">Ciśnienie</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Wind size={28} />
						<div>
							<p className="text-lg font-medium">
								{current.wind_speed.toFixed(1)} m/s
							</p>
							<p className="text-sm text-gray-500">Wiatr</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className="max-w-5xl mx-auto overflow-x-auto">
				<CardHeader>
					<h3 className="text-xl font-medium">5-dniowa prognoza</h3>
				</CardHeader>
				<CardContent>
					<div className="flex space-x-4 pb-4">
						{forecast.map(({ dt, main, weather }) => (
							<div
								key={dt}
								className="flex-shrink-0 w-24 text-center bg-white bg-opacity-80 rounded p-2"
							>
								<p className="text-sm text-gray-500">
									{format(new Date(dt * 1000), "EEE", { locale: pl })}
								</p>
								<img
									src={`https://openweathermap.org/img/wn/${weather[0].icon}.png`}
									alt={weather[0].description}
									className="mx-auto"
								/>
								<p className="font-semibold">{Math.round(main.temp)}°C</p>
								<p className="text-xs text-gray-500">
									{Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°
								</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
			<Card className="max-w-5xl mx-auto">
				<CardHeader>
					<h3 className="text-xl font-medium">
						Porównanie z popularnymi miastami
					</h3>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell>Miasto</TableCell>
								<TableCell>Temperatur (°C)</TableCell>
								<TableCell>Wilgotność (%)</TableCell>
								<TableCell>Wiatr (m/s)</TableCell>
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
