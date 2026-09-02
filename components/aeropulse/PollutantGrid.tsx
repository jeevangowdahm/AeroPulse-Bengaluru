'use client';
import React from 'react';
import { Pollutants } from '@/lib/types/aeropulse';
import { Activity } from 'lucide-react';

interface PollutantGridProps {
  pollutants: Pollutants;
  subIndices?: Record<string, number>;
}

const POLLUTANT_CONFIG = [
  { key: 'pm2_5', name: 'PM2.5', label: 'Fine Particulates (<2.5 µm)', unit: 'µg/m³', safeLimit: 30, severeLimit: 120 },
  { key: 'pm10', name: 'PM10', label: 'Inhalable Dust (<10 µm)', unit: 'µg/m³', safeLimit: 50, severeLimit: 250 },
  { key: 'no2', name: 'NO₂', label: 'Nitrogen Dioxide', unit: 'µg/m³', safeLimit: 40, severeLimit: 180 },
  { key: 'so2', name: 'SO₂', label: 'Sulfur Dioxide', unit: 'µg/m³', safeLimit: 40, severeLimit: 380 },
  { key: 'co', name: 'CO', label: 'Carbon Monoxide', unit: 'mg/m³', safeLimit: 1.0, severeLimit: 10.0 },
  { key: 'o3', name: 'O₃', label: 'Ground Ozone', unit: 'µg/m³', safeLimit: 50, severeLimit: 168 },
  { key: 'nh3', name: 'NH₃', label: 'Ammonia', unit: 'µg/m³', safeLimit: 200, severeLimit: 800 }
];

export const PollutantGrid: React.FC<PollutantGridProps> = ({
  pollutants,
  subIndices = {}
}) => {
  return (
    <div className="classy-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600" />
            Criteria Pollutant Breakdown
          </h3>
          <p className="text-xs text-slate-500">Surface microgram concentrations & computed sub-indices</p>
        </div>
        <span className="text-[10px] font-mono bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 font-semibold">
          7 Criteria Parameters
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {POLLUTANT_CONFIG.map((p) => {
          const val = pollutants[p.key as keyof Pollutants] ?? 0;
          const subIdx = subIndices[p.name] ?? subIndices[p.key.toUpperCase()] ?? 0;
          const pctOfSevere = Math.min((val / p.severeLimit) * 100, 100);

          let statusColor = "text-emerald-700";
          let barColor = "bg-emerald-500";
          let pillBg = "bg-emerald-50 text-emerald-700 border-emerald-200";

          if (val > p.severeLimit * 0.75) {
            statusColor = "text-rose-700";
            barColor = "bg-rose-500";
            pillBg = "bg-rose-50 text-rose-700 border-rose-200";
          } else if (val > p.safeLimit) {
            statusColor = "text-amber-700";
            barColor = "bg-amber-500";
            pillBg = "bg-amber-50 text-amber-700 border-amber-200";
          }

          return (
            <div key={p.key} className="bg-slate-50 hover:bg-white rounded-2xl p-3.5 border border-slate-200 flex flex-col justify-between transition classy-card-hover">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-slate-900 tracking-wide">{p.name}</span>
                  {subIdx > 0 && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${pillBg}`}>
                      {subIdx}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate mb-3">{p.label}</p>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className={`text-xl font-black font-mono ${statusColor}`}>{val}</span>
                  <span className="text-[10px] text-slate-500 font-mono font-semibold">{p.unit}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.max(pctOfSevere, 8)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
