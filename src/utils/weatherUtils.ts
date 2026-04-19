export const getWeatherInfo = (code: number) => {
  if (code === 0) return { title: "Sunny", sub: "Clear and bright skies", isStormy: false };
  if (code >= 1 && code <= 3) return { title: "Partly Cloudy", sub: "Sun with light clouds", isStormy: false };
  if (code === 45 || code === 48) return { title: "Foggy", sub: "Low visibility conditions", isStormy: true };
  if (code >= 51 && code <= 67) return { title: "Rainy", sub: "Persistent rain expected", isStormy: true };
  if (code >= 71 && code <= 77) return { title: "Snowy", sub: "Heavy snow and cold winds", isStormy: true };
  if (code >= 80 && code <= 82) return { title: "Showers", sub: "Brief heavy rain bursts", isStormy: true };
  if (code >= 95) return { title: "Thunderstorms", sub: "Electrical activity and heavy rain", isStormy: true };
  return { title: "Cloudy", sub: "Overcast skies", isStormy: true };
};

export const getWeatherIcon = (code: number) => {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "⛅";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 95) return "⛈️";
  return "☁️";
};

export const formatDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};
