import React from 'react';
import { Wind, Sparkles, ArrowDown, ArrowUp, Info } from 'lucide-react';

interface AQIGaugeProps {
  aqi: number;
  category: string;
  primaryPollutant: string;
  color: string;
  badge: string;
  standard?: string;
  min24h?: number;
  max24h?: number;
  stationName?: string;
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({
  aqi,
  category,
  primaryPollutant,
  color,
  badge,
  standard = "Indian NAQI",
  min24h = Math.round(aqi * 0.72),
  max24h = Math.round(aqi * 1.32),
  stationName = "Silk Board Junction"
}) => {
  const pct = Math.min(Math.max((aqi / 450) * 100, 4), 100);

  return (
    <div className="classy-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
      {/* Soft ambient radial glow */}
      <div 
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Current Ambient Index</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            {stationName}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs font-mono font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span>{standard}</span>
        </div>
      </div>

      {/* Center Dial and Numbers */}
      <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-8 z-10">
        <div className="relative flex items-center justify-center">
          <svg className="w-52 h-52 transform -rotate-135">
            {/* Background Arc */}
            <circle
              cx="104"
              cy="104"
              r="78"
              stroke="#E2E8F0"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="490"
              strokeDashoffset="122"
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <circle
              cx="104"
              cy="104"
              r="78"
              stroke={color}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="490"
              strokeDashoffset={490 - (490 * (pct * 0.75)) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 2px 8px ${color}50)` }}
            />
          </svg>

          {/* Value Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-black tracking-tight font-mono text-slate-900">
              {aqi}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold mt-0.5">AQI INDEX</span>
          </div>
        </div>

        {/* Severity & Primary Pollutant details */}
        <div className="flex flex-col gap-3.5 max-w-xs text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border self-center sm:self-start text-xs font-bold shadow-sm"
               style={{ backgroundColor: `${color}18`, borderColor: `${color}40`, color: color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span>{category}</span>
            <span className="text-slate-600 font-normal">({badge})</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            <span className="font-bold text-slate-900">{primaryPollutant}</span> is the dominant air pollutant in this area.
          </p>

          {/* 24-Hour Min / Max */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">24h Low</span>
                <span className="text-emerald-700 font-black font-mono text-xs">{min24h} AQI</span>
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
              <ArrowUp className="w-3.5 h-3.5 text-rose-600" />
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">24h Peak</span>
                <span className="text-rose-700 font-black font-mono text-xs">{max24h} AQI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between text-xs text-slate-500 z-10 font-medium">
        <span className="flex items-center gap-1.5 text-[11px]">
          <Info className="w-3.5 h-3.5 text-sky-600" />
          Continuous 7-pollutant sub-index aggregation
        </span>
        <span className="text-slate-600 font-mono text-[11px]">Telemetry Active</span>
      </div>
    </div>
  );
};
