'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Cpu, CheckCircle, ShieldCheck, MapPin, Trees, Sliders } from 'lucide-react';
import { getProcessedBengaluruZones } from '@/lib/data-providers/bengaluruData';
import { binarySearchSafeZones } from '@/lib/algorithms/binarySearch';
import { AlgorithmModal } from '@/components/shell/AlgorithmModal';

export const SafeZonesView: React.FC = () => {
  const [maxAQI, setMaxAQI] = useState(150);
  const [safeZones, setSafeZones] = useState<any[]>([]);
  const [showAlgoModal, setShowAlgoModal] = useState(false);

  useEffect(() => {
    const raw = getProcessedBengaluruZones();
    // Sort in ascending order of AQI for manual Binary Search
    const sortedAsc = [...raw].sort((a, b) => a.aqi - b.aqi);
    const { safeZones: matches } = binarySearchSafeZones(sortedAsc, maxAQI);
    setSafeZones(matches);
  }, [maxAQI]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="classy-card rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              SAFE ZONE FINDER (O(log N))
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Discover clean air havens across Bengaluru using manual Binary Search over pre-sorted AQI indices.
          </p>
        </div>

        <button
          onClick={() => setShowAlgoModal(true)}
          className="flex items-center space-x-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-mono font-bold text-sky-800 hover:bg-sky-100 transition shadow-xs"
        >
          <Cpu className="h-4 w-4 text-sky-600" />
          <span>How Binary Search Works</span>
        </button>
      </div>

      {/* Target Slider Box */}
      <div className="classy-card rounded-3xl p-6 border border-emerald-300/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Target Maximum AQI Ceiling
            </div>
            <div className="text-3xl font-black text-emerald-700 font-mono">
              AQI ≤ {maxAQI}
            </div>
            <span className="text-[11px] text-slate-500">
              Filtering Bengaluru zones under safety limit
            </span>
          </div>

          <div className="w-full md:w-96 space-y-2">
            <input
              type="range"
              min={50}
              max={300}
              step={5}
              value={maxAQI}
              onChange={e => setMaxAQI(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500 font-semibold">
              <span className="text-emerald-700">50 (Pristine)</span>
              <span className="text-amber-700">150 (Moderate)</span>
              <span className="text-rose-700">300 (Severe)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span className="text-sm font-bold text-slate-800">
            {safeZones.length} Safe Zones Discovered (Binary Search Filtered)
          </span>
        </div>
        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
          Sorted Ascending by AQI
        </span>
      </div>

      {/* Safe Zones Grid */}
      {safeZones.length === 0 ? (
        <div className="classy-card rounded-3xl p-12 text-center text-slate-500 space-y-2">
          <p className="font-bold text-base text-slate-700">No zones currently meet AQI ≤ {maxAQI}.</p>
          <p className="text-xs">Try increasing the AQI ceiling slider to view candidate safe zones.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeZones.map((zone) => (
            <div
              key={zone.locality}
              className="classy-card classy-card-hover rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 text-slate-900 font-black text-base">
                    <MapPin className="h-4 w-4 text-sky-600 shrink-0" />
                    <span className="truncate">{zone.locality}</span>
                  </div>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black"
                    style={{
                      backgroundColor: zone.aqi <= 100 ? '#10B98120' : zone.aqi <= 200 ? '#F59E0B20' : '#EF444420',
                      color: zone.aqi <= 100 ? '#047857' : zone.aqi <= 200 ? '#B45309' : '#B91C1C'
                    }}
                  >
                    AQI {zone.aqi}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-2 mb-3">
                  <span className="font-semibold">{zone.areaType || zone.zoneName || 'Bengaluru Zone'}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Trees className="w-3.5 h-3.5" />
                    {zone.greenCoverPct}% Green Canopy
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">PM2.5</span>
                    <span className="text-xs font-black font-mono text-slate-900">{zone.pm25} µg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">PM10</span>
                    <span className="text-xs font-black font-mono text-slate-900">{zone.pm10} µg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">NO2</span>
                    <span className="text-xs font-black font-mono text-slate-900">{zone.no2} µg</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Within Safe Threshold
                </span>
                <span className="text-slate-500 font-mono">Risk: {zone.compositeRiskScore || 28}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Algorithm Modal */}
      <AlgorithmModal
        isOpen={showAlgoModal}
        onClose={() => setShowAlgoModal(false)}
        algorithmName="Binary Search"
      />
    </div>
  );
};
