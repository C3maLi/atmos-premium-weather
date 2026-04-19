import React from 'react';
import Dashboard from './components/Dashboard';
import WeatherEffects from './components/WeatherEffects';
import { TURKISH_CITIES } from './constants/cities';
import { useWeather } from './hooks/useWeather';

const App: React.FC = () => {
  const { 
    setSelectedCity, 
    weatherData, 
    loading, 
    error 
  } = useWeather(TURKISH_CITIES[0]);

  return (
    <div className={`scene relative w-[1340px] h-[780px] rounded-[32px] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] transition-all duration-1000 ${weatherData?.isSunny ? 'mode-sunny' : 'mode-storm'}`}>
      {/* Background Layers */}
      <div className="bg-storm absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,#3a4060_0%,#1a1f2e_50%,#0d0f1a_100%)] opacity-100 transition-opacity duration-1000"></div>
      <div className="bg-sunny absolute inset-0 bg-[radial-gradient(ellipse_at_65%_30%,#ffe8a3_0%,#87c1e8_35%,#4a8db8_80%,#2a6a9e_100%)] opacity-0 transition-opacity duration-1000"></div>
      
      {/* State Overlays */}
      {loading && (
        <div className="loading-screen absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center z-[9999] animate-in fade-in duration-300">
          <div className="loader w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
          <div className="mt-8 text-white text-[10px] font-bold tracking-[0.4em] opacity-40 uppercase">Fetching Weather Data</div>
        </div>
      )}

      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center z-[9999] bg-slate-900/80 backdrop-blur-md">
           <div className="text-white/30 text-xs font-bold uppercase tracking-widest text-center">
             Connection Error<br/>
             <span className="text-[10px] opacity-50 font-medium lowercase">{error}</span>
           </div>
        </div>
      )}

      {weatherData && (
        <>
          <WeatherEffects isSunny={weatherData.isSunny} />
          <Dashboard weatherData={weatherData} onCityChange={setSelectedCity} />
        </>
      )}
    </div>
  );
};

export default App;
