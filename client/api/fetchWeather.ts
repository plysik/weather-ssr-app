export async function fetchWeather(city: string) {
  const res = await fetch(
    `/api/weather?city=${encodeURIComponent(city)}`
  );

  if (!res.ok) {
    throw new Error(`Błąd pobierania pogody: ${res.status}`);
  }

  return await res.json();
}
