import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../shared/store';
import { setCurrent } from '../../shared/store/weatherSlice';
import { fetchWeather } from '../api/fetchWeather';
import SearchForm from '../components/SearchForm';

export default function CityPage() {
  const { city = '' } = useParams<{ city: string }>();
  console.log('[CITYPAGE MOUNT]', city);
  const dispatch = useDispatch();
  const weather = useSelector((state: RootState) => state.weather.current);
  console.log('[SELECTOR] Weather:', weather);
  useEffect(() => {
  if (!weather || weather.name?.toLowerCase() !== city?.toLowerCase()) {
    fetchWeather(city)
      .then((data) => dispatch(setCurrent(data)))
      .catch((err) => console.error(err));
  }
}, [city]);

  if (!weather || weather.name.toLowerCase() !== city?.toLowerCase()) {
    return (
      <main>
        <SearchForm />
        <p>Ładowanie danych pogodowych...</p>
      </main>
    );
  }

  const windDir = (deg: number) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <main>
      <SearchForm />
      <section>
        <h1>Pogoda w {weather.name}</h1>
        <p style={{ textTransform: 'capitalize' }}>{weather.description}</p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
        />
        <ul>
          <li>🌡 Temperatura: {weather.temp} °C</li>
          <li>🥵 Odczuwalna: {weather.feels_like} °C</li>
          <li>💧 Wilgotność: {weather.humidity}%</li>
          <li>🔽 Ciśnienie: {weather.pressure} hPa</li>
          <li>
            💨 Wiatr: {weather.wind_speed} m/s ({windDir(weather.wind_deg)})
          </li>
        </ul>
      </section>
    </main>
  );
}
