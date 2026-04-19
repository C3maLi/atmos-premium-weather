import { TURKISH_CITIES } from '../constants/cities';

export const fetchWeatherData = async (city: typeof TURKISH_CITIES[0], signal?: AbortSignal) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,sunrise,sunset&hourly=wind_speed_10m&timezone=auto`;
  
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Weather data could not be fetched");
  
  return await response.json();
};
