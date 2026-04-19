import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import type { WeatherData } from '../types';
import CityDropdown from './CityDropdown';
import { TURKISH_CITIES } from '../constants/cities';

gsap.registerPlugin(MotionPathPlugin);

interface DashboardProps {
  weatherData: WeatherData;
  onCityChange: (city: (typeof TURKISH_CITIES)[0]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ weatherData, onCityChange }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Memoize calculations for performance
  const { forecastPath, getY } = useMemo(() => {
    const forecast = weatherData?.forecast || [];
    if (forecast.length < 2)
      return { forecastPath: '', getY: (_t: number) => 0 };

    const temps = forecast.map((f) => f.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const tempDiff = maxTemp - minTemp || 1;

    const getYFunc = (temp: number) => 40 - ((temp - minTemp) / tempDiff) * 20;

    const width = 1200;
    const step = width / 6.5;
    let path = `M 0 ${getYFunc(forecast[0].temp)}`;

    forecast.forEach((f, i) => {
      if (i === 0) return;
      const x = i * step;
      const prevX = (i - 1) * step;
      const cpX = (prevX + x) / 2;
      path += ` C ${cpX} ${getYFunc(forecast[i - 1].temp)} ${cpX} ${getYFunc(f.temp)} ${x} ${getYFunc(f.temp)}`;
    });

    return { forecastPath: path, getY: getYFunc };
  }, [weatherData?.forecast]);

  const windPath = useMemo(() => {
    const hourlyWind = weatherData?.hourlyWind || [];
    if (hourlyWind.length < 2) return '';

    const width = 240;
    const step = width / (hourlyWind.length - 1);
    const maxWind = Math.max(...hourlyWind, 10);
    const getHeight = (w: number) => 40 - (w / maxWind) * 30;

    let path = `M 0 ${getHeight(hourlyWind[0])}`;
    hourlyWind.forEach((w, i) => {
      if (i === 0) return;
      path += ` L ${i * step} ${getHeight(w)}`;
    });
    return path;
  }, [weatherData?.hourlyWind]);

  const currentDate = useMemo(() => {
    const d = new Date();
    return (
      d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) +
      ' | ' +
      d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    );
  }, []);

  // Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(dashboardRef);
      gsap.set(
        q(
          '.weather-title, .weather-subtitle, .temperature-box, .glass-card, .day-item',
        ),
        { opacity: 0, y: 15 },
      );

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.1,
      });
      tl.to(q('.weather-title'), { y: 0, opacity: 1, duration: 0.6 })
        .to(
          q('.weather-subtitle'),
          { y: 0, opacity: 0.7, duration: 0.4 },
          '-=0.4',
        )
        .to(q('.temperature-box'), { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
        .to(
          q('.glass-card'),
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
          '-=0.4',
        )
        .to(
          q('.day-item'),
          { opacity: 1, duration: 0.3, stagger: 0.04 },
          '-=0.3',
        );

      gsap.fromTo(
        q('.wind-bar'),
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.8,
          stagger: 0.02,
          ease: 'power2.out',
          delay: 0.4,
        },
      );

      isInitialMount.current = false;
    }, dashboardRef);
    return () => ctx.revert();
  }, []);

  // City Change Animation
  useEffect(() => {
    if (isInitialMount.current) return;
    const ctx = gsap.context(() => {
      const qLeft = gsap.utils.selector(leftPanelRef);
      gsap.fromTo(
        qLeft('.weather-title, .weather-subtitle, .temperature-box'),
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
      );
    }, leftPanelRef);
    return () => ctx.revert();
  }, [weatherData.city, weatherData.temp]);

  return (
    <div
      className='dashboard absolute inset-0 px-8 py-6 lg:px-16 lg:py-10 flex flex-col pointer-events-none z-50 text-white w-full h-full overflow-hidden'
      ref={dashboardRef}
    >
      <header className='h-12 flex justify-between items-center mb-6 lg:mb-10 pointer-events-auto shrink-0'>
        <div className='logo flex items-center gap-3 font-bold text-[18px] lg:text-[20px] tracking-tight select-none'>
          <div className='logo-icon w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-xl'>
             <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C17.7614 24 19.3804 23.4312 20.697 22.4727C21.4655 21.913 22.5 22.4431 22.5 23.4V23.5C22.5 23.7761 22.7239 24 23 24H23.5C23.7761 24 24 23.7761 24 23.5V16C24 11.5817 20.4183 8 16 8ZM16 21C13.2386 21 11 18.7614 11 16C11 13.2386 13.2386 11 16 11C18.7614 11 21 13.2386 21 16C21 18.7614 18.7614 21 16 21Z" fill="white"/>
             </svg>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">atmos.</span>
        </div>
        <div className='flex items-center gap-4'>
          <div className='time-display opacity-30 text-[11px] lg:text-[12px] font-medium hidden sm:block uppercase tracking-widest'>
            {currentDate}
          </div>
          <CityDropdown
            currentCity={weatherData.city}
            onCitySelect={onCityChange}
          />
        </div>
      </header>

      <main className='flex flex-1 flex-col lg:flex-row gap-6 lg:gap-16 min-h-0 pointer-events-auto'>
        <section
          className='left-panel flex-1 flex flex-col justify-between py-2'
          ref={leftPanelRef}
        >
          <div className='top-info'>
            <h1 className='weather-title text-[42px] md:text-[54px] lg:text-[68px] font-bold leading-[1.1] tracking-tighter mb-1 break-words uppercase'>
              {weatherData.title}
            </h1>
            <p className='weather-subtitle text-[16px] lg:text-[18px] opacity-60 font-medium mb-4'>
              {weatherData.subtitle}
            </p>
            <p className='weather-desc max-w-[380px] text-[13px] lg:text-[14px] leading-relaxed opacity-40 hidden md:block'>
              {weatherData.desc}
            </p>
          </div>

          <div className='temperature-box flex flex-col items-start'>
            <div className='temperature text-[90px] md:text-[110px] lg:text-[140px] font-bold leading-[0.8] tracking-tighter flex mb-2'>
              <span>{weatherData.temp}</span>
              <span className='text-[40px] lg:text-[60px] mt-2 lg:mt-4 opacity-40'>
                °
              </span>
            </div>
            <div className='city-label px-4 py-1.5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center gap-2 shadow-xl'>
              <span className='text-sm'>📍</span>
              <span className='text-[12px] lg:text-[14px] font-bold tracking-[0.2em] uppercase'>
                {weatherData.city}
              </span>
            </div>
          </div>
        </section>

        <section className='right-panel w-full lg:w-[320px] flex flex-row lg:flex-col gap-4 lg:gap-6 justify-center lg:justify-start shrink-0'>
          <article className='glass-card flex-1 lg:flex-none bg-[#1e293b]/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-7 shadow-2xl overflow-hidden'>
            <div className='flex justify-between items-start mb-2'>
              <div className='flex items-center gap-2 text-[11px] font-bold tracking-widest opacity-60 uppercase'>
                <span className='text-sm opacity-100'>🧭</span> WIND STATUS
              </div>
              <div className='flex items-baseline gap-1'>
                <span className='text-[38px] font-bold leading-none'>
                  {weatherData.wind}
                </span>
                <span className='text-[12px] opacity-40 font-medium'>km/h</span>
              </div>
            </div>

            <div className='relative h-20 w-full mt-4 flex items-end justify-between px-1'>
              {(weatherData?.hourlyWind || []).map((w, i) => (
                <div
                  key={i}
                  className='wind-bar w-[6px] bg-white/10 rounded-full origin-bottom'
                  style={{
                    height: `${(w / (Math.max(...(weatherData?.hourlyWind || []), 1) || 10)) * 100}%`,
                  }}
                />
              ))}
              <svg
                className='absolute inset-0 w-full h-full pointer-events-none'
                viewBox='0 0 240 40'
                preserveAspectRatio='none'
              >
                <path
                  d={windPath}
                  fill='none'
                  stroke='rgba(255,255,255,0.6)'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
          </article>

          <article className='glass-card flex-1 lg:flex-none bg-[#1e293b]/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-7 shadow-2xl'>
            <div className='flex justify-between items-center mb-10'>
              <div className='flex items-center gap-2 text-[12px] font-bold opacity-70'>
                <span>🌅</span> Sunrise ↑
              </div>
              <div className='flex items-center gap-2 text-[12px] font-bold opacity-70'>
                Sunset ↓ <span>🌇</span>
              </div>
            </div>

            <div className='relative h-24 w-full'>
              <svg
                className='w-full h-full overflow-visible'
                viewBox='0 0 260 60'
                preserveAspectRatio='none'
              >
                <path
                  d='M25,60 Q130,-10 235,60'
                  fill='none'
                  stroke='rgba(255,255,255,0.15)'
                  strokeWidth='2'
                  strokeDasharray='6,6'
                />
                <circle
                  cx='25'
                  cy='60'
                  r='4'
                  fill='#fb923c'
                  className='shadow-[0_0_10px_#fb923c]'
                />
                <circle
                  cx='235'
                  cy='60'
                  r='4'
                  fill='#60a5fa'
                  className='shadow-[0_0_10px_#60a5fa]'
                />
                <g transform='translate(115, 45) scale(0.5)'>
                  <circle
                    cx='30'
                    cy='30'
                    r='10'
                    stroke='white'
                    strokeWidth='1'
                    fill='none'
                    opacity='0.3'
                  />
                  <path
                    d='M30,10 L30,20 M30,40 L30,50 M10,30 L20,30 M40,30 L50,30 M15.8,15.8 L22.9,22.9 M37.1,37.1 L44.2,44.2 M15.8,44.2 L22.9,37.1 M37.1,22.9 L44.2,15.8'
                    stroke='white'
                    strokeWidth='1'
                    opacity='0.3'
                  />
                </g>
              </svg>
              <div className='absolute top-[65px] left-0 text-[10px] font-bold opacity-40'>
                {weatherData.sunrise} AM
              </div>
              <div className='absolute top-[65px] right-0 text-[10px] font-bold opacity-40'>
                {weatherData.sunset} PM
              </div>
            </div>
          </article>
        </section>
      </main>

      <footer className='forecast-bar mt-6 lg:mt-10 relative h-[100px] lg:h-[120px] pointer-events-auto shrink-0 w-full'>
        <svg
          className='absolute bottom-[20px] left-0 right-0 w-full h-[40px] pointer-events-none opacity-10'
          viewBox='0 0 1200 50'
          preserveAspectRatio='none'
        >
          <path
            d={forecastPath}
            fill='none'
            stroke='white'
            strokeWidth='1.5'
          />
        </svg>
        <div className='forecast-days flex justify-between px-4 lg:px-8 gap-4 overflow-x-auto no-scrollbar scroll-smooth'>
          {(weatherData?.forecast || []).map((f, i) => (
            <div
              key={i}
              className='day-item flex flex-col items-center transition-all min-w-[70px] lg:min-w-[100px]'
              style={{ transform: `translateY(${getY(f.temp) - 25}px)` }}
            >
              <div className='text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1'>
                {f.day}
              </div>
              <div className='text-[16px] lg:text-[18px] font-bold'>
                {f.temp}°
              </div>
              <div className='text-[22px] lg:text-[24px] mt-1 filter drop-shadow-md'>
                {f.icon}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
