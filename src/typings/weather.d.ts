/* --- typy danych --- */
export type WeatherData = {
  name: string;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  description: string;
  icon: string;
};

/* --- stan modułu --- */
export interface WeatherState {
  current: WeatherData | null;
}

export type OpenWeatherResponse = {
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