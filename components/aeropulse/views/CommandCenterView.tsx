'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  Trees,
  Truck,
  ArrowRight,
  Info,
  MapPin
} from 'lucide-react';
import { getProcessedBengaluruZones } from '@/lib/data-providers/bengaluruData';
import { AlgorithmModal } from '@/components/shell/AlgorithmModal';

export const CommandCenterView: React.FC = () => {
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showAlgoModal, setShowAlgoModal] = useState(false);

  useEffect(() => {
    const raw = getProcessedBengaluruZones();
    setZones(raw);
    if (raw.length > 0) {
      setSelectedZone(raw[0]);
    }
  }, []);

  const handleAskAI = async (zone: any) => {
    setSelectedZone(zone);
    setLoadingAi(true);
    setAiAnalysis(null);

    try {
      const res = await fetch('/api/primus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Explain why ${zone.locality} has high environmental risk. AQI: ${zone.aqi}, PM2.5: ${zone.pm25}, Traffic Density: ${zone.trafficDensity}%.`,
          contextZone: zone.locality,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.response);
      }
    } catch (err) {
      console.error(err);
      setAiAnalysis(`Automated Analysis for ${zone.locality}: High traffic congestion combined with road dust resuspension creates acute particulate concentration.`);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="classy-card rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-rose-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              BENGALURU ENVIRONMENTAL COMMAND CENTER
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-factor pollution risk ranking powered by Merge Sort (O(N log N)) & Azure OpenAI reasoning.
          </p>
        </div>

        <button
          onClick={() => setShowAlgoModal(true)}
          className="flex items-center space-x-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-mono font-bold text-sky-800 hover:bg-sky-100 transition shadow-xs"
        >
          <Cpu className="h-4 w-4 text-sky-600" />
          <span>How Merge Sort Works</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ranked Hotspots */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              Bengaluru Hotspots Ranked by Composite Risk Score
            </h2>
            <span className="text-[10px] font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-slate-600">
              O(N log N) Merge Sort
            </span>
          </div>

          <div className="space-y-3">
            {zones.slice(0, 8).map((zone, index) => {
              const isSelected = selectedZone?.locality === zone.locality;
              return (
                <div
                  key={zone.locality}
                  onClick={() => setSelectedZone(zone)}
                  className={`classy-card rounded-2xl p-4 border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-sky-400 bg-sky-50/70 shadow-md ring-2 ring-sky-300/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                      index === 0
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : index === 1
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{zone.locality}</span>
                        <span className="text-[10px] font-semibold text-slate-500 font-sans">
                          ({zone.wardName})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Traffic: <b className="text-slate-700">{zone.trafficDensity}%</b></span>
                        <span>&bull;</span>
                        <span>Canopy: <b className="text-emerald-700">{zone.greenCoverPct}%</b></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right font-mono">
                      <div className="text-base font-black text-slate-900">AQI {zone.aqi}</div>
                      <div className="text-[10px] text-slate-500">Risk: {zone.compositeRiskScore}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAskAI(zone);
                      }}
                      className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      <span>Why?</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: AI Explanation & Risk Inspector */}
        <div className="space-y-4">
          <div className="classy-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Why is this area high risk?
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-sky-50 text-sky-800 px-2 py-0.5 rounded font-bold">
                gpt-4o
              </span>
            </div>

            {selectedZone && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-slate-900">{selectedZone.locality}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    AQI {selectedZone.aqi} &bull; Risk Score: {selectedZone.compositeRiskScore}/100
                  </div>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed font-medium space-y-2 min-h-[140px]">
                  {loadingAi ? (
                    <div className="flex items-center justify-center py-10 space-x-2 text-slate-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-600 border-t-transparent" />
                      <span>Querying Azure OpenAI reasoning engine...</span>
                    </div>
                  ) : aiAnalysis ? (
                    <p className="whitespace-pre-line">{aiAnalysis}</p>
                  ) : (
                    <div className="space-y-2">
                      <p>
                        <b>Dominant Drivers:</b>
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        <li>High arterial vehicular volume along {selectedZone.locality} corridor.</li>
                        <li>Reduced urban canopy ({selectedZone.greenCoverPct}%) limiting micro-particulate absorption.</li>
                        <li>Diurnal temperature inversion trapping $NO_2$ exhaust.</li>
                      </ul>
                      <button
                        onClick={() => handleAskAI(selectedZone)}
                        className="mt-3 w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Run Full Azure OpenAI Diagnostic</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Algorithm Modal */}
      <AlgorithmModal
        isOpen={showAlgoModal}
        onClose={() => setShowAlgoModal(false)}
        algorithmName="Merge Sort"
      />
    </div>
  );
};
