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