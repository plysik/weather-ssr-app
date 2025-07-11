import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { WeatherData } from 'shared/types';

dotenv.config();



type OpenWeatherResponse = {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    wind: {
        speed: number;
        deg: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
    dt: number;
};

const API_KEY = process.env.WEATHER_API_KEY;

export async function fetchWeather(city: string): Promise<WeatherData> {
    console.log('🔑 WEATHER_API_KEY:', API_KEY?.slice(0, 5), '...');

    if (!API_KEY) {
        throw new Error('❌ WEATHER_API_KEY is missing in .env!');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
    )}&units=metric&appid=${API_KEY}&lang=pl`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`🌩 Weather fetch failed: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as OpenWeatherResponse;

    return {
        name: data.name,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind_speed: data.wind.speed,
        wind_deg: data.wind.deg,
        description: data.weather[0].description,
        icon: data.weather[0]?.icon,
    };


}
