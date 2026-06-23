import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MapPin, Bot, Users } from 'lucide-react';

function AnimatedCounter({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    prevRef.current = end;
  }, [value, duration]);

  return <span>{display}</span>;
}

export default function HeroSection({ stats, onScrollToMap }) {
  const steps = [
    { icon: MapPin, text: 'Click the map or describe your situation' },
    { icon: Bot, text: 'AI fills in the details automatically' },
    { icon: Users, text: 'Community connects and resolves' },
  ];

  return (
    <section className="relative min-h-[70vh] md:min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent pointer-events-none" />

      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
        Crisis<span className="text-red-500">Mapper</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed">
        Real-time community crisis coordination. No signup. No app. Just help.
      </p>

      <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-red-400">
            <AnimatedCounter value={stats.activeCrises} />
          </div>
          <div className="text-sm text-slate-400 mt-1">Active Crises</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-green-400">
            <AnimatedCounter value={stats.resolvedToday} />
          </div>
          <div className="text-sm text-slate-400 mt-1">Resolved Today</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-green-400">
            <AnimatedCounter value={stats.helpersAvailable} />
          </div>
          <div className="text-sm text-slate-400 mt-1">Helpers Available</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full mb-12">
        {steps.map(({ icon: Icon, text }, i) => (
          <div key={i} className="glass-card p-4 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Icon size={20} className="text-red-400" />
            </div>
            <span className="text-sm text-slate-300">
              <span className="font-semibold text-white mr-1">{i + 1}.</span>
              {text}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onScrollToMap}
        className="animate-bounce-slow text-slate-400 hover:text-white transition-colors"
        aria-label="Scroll to map"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
}
