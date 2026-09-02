import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';

interface DemoBannerProps {
  quality?: string;
  source?: string;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  quality = "SIMULATED",
  source = "KSPCB & CSTEP Anchored"
}) => {
  return (
    <div className="bg-amber-50/80 border-b border-amber-200/70 px-4 py-1.5 text-xs text-amber-950 font-medium">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-extrabold text-[11px] tracking-wider text-amber-800 uppercase">PROTOTYPE MODE</span>
          <span className="text-amber-300">|</span>
          <span className="text-amber-900 text-xs">
            Model-driven synthetic telemetry calibrated against KSPCB & CSTEP Bengaluru studies.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/90 px-2 py-0.5 rounded-lg border border-amber-200 font-mono text-[11px] shadow-2xs">
            <Database className="w-3 h-3 text-sky-600" />
            <span className="text-slate-500">Source:</span>
            <span className="text-slate-800 font-semibold">{source}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/90 px-2 py-0.5 rounded-lg border border-amber-200 font-mono text-[11px] shadow-2xs">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span className="text-slate-500">Quality:</span>
            <span className="text-emerald-700 font-bold">{quality}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
