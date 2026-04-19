import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface WeatherEffectsProps {
  isSunny: boolean;
}

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ isSunny }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const raindrops = useRef(Array.from({ length: 140 }).map(() => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.4 + Math.random() * 0.4,
    height: 30 + Math.random() * 35,
    opacity: 0.2 + Math.random() * 0.35
  })));

  // INDEPENDENT GSAP ANIMATION FOR EACH CLOUD
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cluster 1 (Main Center)
      gsap.to('.cloud-1', {
        x: '+=30', y: '+=15', rotation: 0.5, scale: 1.02,
        duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut"
      });

      // Cluster 2 (Upper Right)
      gsap.to('.cloud-2', {
        x: '-=40', y: '-=20', rotation: -1, scale: 1.03,
        duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1
      });

      // Cluster 3 (Left Small)
      gsap.to('.cloud-3', {
        x: '+=50', y: '+=10', rotation: 1.5, scale: 1.04,
        duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2
      });

      // Cluster 4 (Bottom Right Subtle)
      gsap.to('.cloud-4', {
        x: '-=25', y: '+=20', rotation: -0.5, scale: 1.02,
        duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isSunny]);

  // LIGHTNING EFFECT
  useEffect(() => {
    if (isSunny) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let timeoutId: number;
    const drawBolt = (x: number, y: number, angle: number, len: number, depth: number) => {
      if (depth === 0 || len < 5) return;
      const ex = x + Math.cos(angle) * len;
      const ey = y + Math.sin(angle) * len;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + depth * 0.08})`;
      ctx.lineWidth = depth * 1.2; ctx.stroke();
      drawBolt(ex, ey, angle + (Math.random() - 0.5) * 0.4, len * 0.75, depth - 1);
    };

    const flash = () => {
      if (isSunny) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawBolt(Math.random() * canvas.width, 0, Math.PI / 2 + (Math.random() - 0.5) * 0.4, 200, 6);
      setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 100);
      timeoutId = window.setTimeout(flash, 9000 + Math.random() * 10000);
    };
    timeoutId = window.setTimeout(flash, 5000);
    return () => window.clearTimeout(timeoutId);
  }, [isSunny]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" ref={containerRef}>
      
      {/* STORM CLOUDS - DYNAMIC & INDEPENDENT */}
      <div className={`storm-clouds absolute inset-0 transition-opacity duration-1500 ${isSunny ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Cluster 3 (Left Small - Background) */}
        <div className="cloud-3 absolute left-[-2%] top-[35%] w-[320px] opacity-60 z-10">
          <svg className="w-full" viewBox="0 0 420 250">
            <ellipse cx="210" cy="180" rx="195" ry="80" fill="#181d2c" opacity="0.9"/>
            <ellipse cx="140" cy="160" rx="120" ry="80" fill="#1e2338"/>
            <ellipse cx="260" cy="140" rx="130" ry="90" fill="#1a2035"/>
          </svg>
        </div>

        {/* Rain Layer (Sandwiched) */}
        <div className="rain-container absolute inset-0 z-20 opacity-30">
          {raindrops.current.map((drop, i) => (
            <div key={i} className="raindrop absolute bg-white/50" style={{
              left: `${drop.left}%`, width: '1.2px', height: `${drop.height}px`,
              animation: `rain ${drop.duration}s linear infinite`,
              animationDelay: `-${drop.delay}s`, opacity: drop.opacity
            }} />
          ))}
        </div>

        {/* Cluster 1 (Main Foreground - Center) */}
        <div className="cloud-1 absolute left-[22%] top-[18%] w-[650px] z-30">
          <svg className="w-full" viewBox="0 0 680 380">
            <ellipse cx="340" cy="280" rx="320" ry="120" fill="#1c2030" opacity="0.95"/>
            <ellipse cx="200" cy="240" rx="160" ry="100" fill="#222840"/>
            <ellipse cx="420" cy="220" rx="200" ry="130" fill="#1a1e2e"/>
            <ellipse cx="300" cy="200" rx="180" ry="140" fill="#252b40"/>
            <ellipse cx="360" cy="170" rx="160" ry="120" fill="#2a3050"/>
            <ellipse cx="280" cy="155" rx="130" ry="100" fill="#323860"/>
            <ellipse cx="400" cy="140" rx="110" ry="90" fill="#2e3455"/>
            <ellipse cx="330" cy="120" rx="100" ry="85" fill="#363d6a"/>
          </svg>
        </div>

        {/* Cluster 2 (Upper Right - Backgroundish) */}
        <div className="cloud-2 absolute right-[-5%] top-[8%] w-[480px] z-10 opacity-80">
          <svg className="w-full" viewBox="0 0 500 300">
            <ellipse cx="250" cy="220" rx="230" ry="90" fill="#1c2030" opacity="0.9"/>
            <ellipse cx="160" cy="190" rx="150" ry="100" fill="#202640"/>
            <ellipse cx="310" cy="170" rx="160" ry="110" fill="#1e2540"/>
            <ellipse cx="240" cy="150" rx="130" ry="100" fill="#262e50"/>
          </svg>
        </div>

        {/* Cluster 4 (Bottom Right - Foreground) */}
        <div className="cloud-4 absolute right-[10%] bottom-[15%] w-[380px] z-30 opacity-70">
          <svg className="w-full" viewBox="0 0 420 250">
            <ellipse cx="210" cy="180" rx="195" ry="80" fill="#1c2030" opacity="0.9"/>
            <ellipse cx="140" cy="160" rx="120" ry="80" fill="#1e2338"/>
            <ellipse cx="260" cy="140" rx="130" ry="90" fill="#1a2035"/>
          </svg>
        </div>
      </div>

      {/* SUNNY CLOUDS - VERY SUBTLE (Only 1 small cluster) */}
      <div className={`sunny-clouds absolute inset-0 transition-opacity duration-1500 ${isSunny ? 'opacity-100' : 'opacity-0'}`}>
        <div className="cloud-1 absolute left-[30%] top-[25%] w-[450px] opacity-[0.08]">
          <svg className="w-full" viewBox="0 0 700 350">
            <ellipse cx="350" cy="270" rx="320" ry="100" fill="white" opacity="0.8"/>
            <ellipse cx="220" cy="240" rx="180" ry="110" fill="white" opacity="0.6"/>
            <ellipse cx="430" cy="220" rx="210" ry="120" fill="white" opacity="0.7"/>
          </svg>
        </div>
      </div>

      <canvas className="lightning-canvas absolute inset-0 z-40 pointer-events-none" ref={canvasRef} style={{ opacity: isSunny ? 0 : 1 }} />
    </div>
  );
};

export default WeatherEffects;
