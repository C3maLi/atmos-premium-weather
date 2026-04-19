import React, { useState, useRef, useEffect } from 'react';
import { TURKISH_CITIES } from '../constants/cities';

interface CityDropdownProps {
  currentCity: string;
  onCitySelect: (city: (typeof TURKISH_CITIES)[0]) => void;
}

const CityDropdown: React.FC<CityDropdownProps> = ({
  currentCity,
  onCitySelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCities = TURKISH_CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className='city-dropdown-container relative z-1000'
      ref={dropdownRef}
    >
      <div
        className='user-info flex items-center gap-3 p-1.5 pr-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-full cursor-pointer transition-all active:scale-95 pointer-events-auto'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='user-avatar w-8 h-8 bg-linear-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-inner'>
          {currentCity.substring(0, 2).toUpperCase()}
        </div>
        <div className='flex flex-col'>
          <div className='text-[13px] font-bold leading-none mb-0.5'>
            {currentCity}
          </div>
          <div className='text-[10px] opacity-40 font-medium tracking-tight'>
            Location
          </div>
        </div>
        <span
          className={`dropdown-arrow ml-2 transition-transform duration-300 text-[10px] opacity-40 ${isOpen ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </div>

      {isOpen && (
        <div className='city-list-dropdown absolute top-[55px] right-0 w-[260px] bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300'>
          <div className='dropdown-search p-4 bg-black/20 border-b border-white/5'>
            <input
              ref={inputRef}
              type='text'
              placeholder='Search location...'
              className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/10 transition-all'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className='dropdown-items max-h-[320px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scroll-smooth'>
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div
                  key={city.name}
                  className={`dropdown-item px-4 py-3 rounded-xl text-sm cursor-pointer transition-all flex justify-between items-center mb-1 last:mb-0 ${
                    currentCity === city.name
                      ? 'bg-white/10 font-bold text-white border border-white/10'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => {
                    onCitySelect(city);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {city.name}
                  {currentCity === city.name && (
                    <span className='text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/20 uppercase tracking-widest'>
                      Active
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className='p-10 text-center text-xs opacity-30 italic'>
                No location found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityDropdown;
