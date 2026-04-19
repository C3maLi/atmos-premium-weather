import { useState, useEffect, useCallback, useRef } from 'react';
import { TURKISH_CITIES } from '../constants/cities';
import { fetchWeatherData } from '../services/weatherService';
import { getWeatherInfo, getWeatherIcon, formatDayName } from '../utils/weatherUtils';
import type { WeatherData } from '../types';

export const useWeather = (initialCity: typeof TURKISH_CITIES[0]) => {
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // To prevent redundant fetches on same city
  const lastFetchedCity = useRef<string>("");

  const updateWeather = useCallback(async (city: typeof TURKISH_CITIES[0], signal?: AbortSignal) => {
    // If we already have data for this city and it's fresh, we could skip (optional)
    // But for now, we just handle the double-mount issue via AbortController
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherData(city, signal);
      
      const info = getWeatherInfo(data.current.weather_code);
      
      const forecast = (data.daily?.time || []).map((time: string, i: number) => ({
        day: formatDayName(time),
        temp: Math.round(data.daily.temperature_2m_max[i]),
        icon: getWeatherIcon(data.daily.weather_code[i]),
        code: data.daily.weather_code[i]
      }));

      const hourlyWind = (data.hourly?.wind_speed_10m || []).slice(0, 24).map((speed: number) => Math.round(speed));

      setWeatherData({
        city: city.name,
        temp: Math.round(data.current.temperature_2m).toString(),
        title: info.title,
        subtitle: info.sub,
        desc: `Current weather update for ${city.name}. The atmosphere is predominantly ${info.title.toLowerCase()}. Wind speed is ${data.current.wind_speed_10m} km/h.`,
        wind: data.current.wind_speed_10m.toString(),
        isSunny: !info.isStormy,
        forecast: forecast.slice(0, 7),
        sunrise: data.daily?.sunrise?.[0]?.split('T')[1] || "06:00",
        sunset: data.daily?.sunset?.[0]?.split('T')[1] || "19:00",
        hourlyWind: hourlyWind.length > 0 ? hourlyWind : Array(24).fill(5)
      });
      
      lastFetchedCity.current = city.name;
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      console.error("Weather fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    updateWeather(selectedCity, controller.signal);
    
    return () => controller.abort();
  }, [selectedCity, updateWeather]);

  return {
    selectedCity,
    setSelectedCity,
    weatherData,
    loading,
    error
  };
};
