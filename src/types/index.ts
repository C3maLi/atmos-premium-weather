export interface ForecastDay {
  day: string;
  temp: number;
  icon: string;
  code: number;
}

export interface WeatherData {
  city: string;
  temp: string;
  title: string;
  subtitle: string;
  desc: string;
  wind: string;
  isSunny: boolean;
  forecast: ForecastDay[];
  sunrise: string;
  sunset: string;
  hourlyWind: number[];
}
