import React from 'react';
import { WeatherData } from '../types';
import { Thermometer, Droplets, Wind, Gauge, Eye, Layers } from 'lucide-react';

interface WeatherStripProps {
  weather: WeatherData;
}

export const WeatherStrip: React.FC<WeatherStripProps> = ({ weather }) => {
  const getWindDirectionLabel = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="classy-card rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[11px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-sky-600" />
          Surface Meteorology
        </span>
        <span className="text-[10px] text-slate-500 font-mono">Atmospheric State Feed</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {/* Temperature */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Temperature</span>
            <span className="text-sm font-black text-slate-900 font-mono">{weather.temperature_c}°C</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Humidity</span>
            <span className="text-sm font-black text-slate-900 font-mono">{weather.humidity_pct}%</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Wind</span>
            <span className="text-sm font-black text-slate-900 font-mono">
              {weather.wind_speed_ms} <span className="text-[10px] font-normal text-slate-500">{getWindDirectionLabel(weather.wind_direction_deg)}</span>
            </span>
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Pressure</span>
            <span className="text-sm font-black text-slate-900 font-mono">{weather.pressure_hpa} <span className="text-[10px] font-normal text-slate-500">hPa</span></span>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Visibility</span>
            <span className="text-sm font-black text-slate-900 font-mono">{weather.visibility_km} <span className="text-[10px] font-normal text-slate-500">km</span></span>
          </div>
        </div>

        {/* Boundary Layer */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Boundary Layer</span>
            <span className="text-sm font-black text-slate-900 font-mono">{Math.round(weather.boundary_layer_height_m)} <span className="text-[10px] font-normal text-slate-500">m</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
