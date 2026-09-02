'use client';
import React, { useState, useEffect } from 'react';
import { fetchHealthGuidelines } from '@/lib/services/aeropulseApi';
import {
  HeartPulse,
  ShieldCheck,
  Info,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const HealthSafetyView: React.FC = () => {
  const [guidelines, setGuidelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetchHealthGuidelines();
        setGuidelines(res.guidelines);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const TIER_COLORS: Record<string, { color: string; border: string; bg: string }> = {
    'Good': { color: '#059669', border: 'border-emerald-200', bg: 'bg-emerald-50' },
    'Satisfactory': { color: '#65A30D', border: 'border-lime-200', bg: 'bg-lime-50' },
    'Moderate': { color: '#D97706', border: 'border-amber-200', bg: 'bg-amber-50' },
    'Poor': { color: '#DC2626', border: 'border-rose-200', bg: 'bg-rose-50' },
    'Very Poor': { color: '#7C3AED', border: 'border-purple-200', bg: 'bg-purple-50' },
    'Severe': { color: '#881337', border: 'border-rose-300', bg: 'bg-rose-100' }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Public Health Header */}
      <div className="classy-card rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-rose-700 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4" />
            Public Health & Physiological Safety
          </span>
          <span className="text-[10px] font-mono bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-700 font-bold">
            CPCB / WHO Guideline Grounding
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mt-1">
          Air Pollution Exposure & Health Guidance Matrix
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Authoritative, evidence-based guidance for general citizens, sensitive groups, outdoor athletes, and indoor environments.
        </p>
      </div>

      {/* Prominent Legal & Medical Disclaimer Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-3xl p-4 flex items-center gap-3.5 text-xs text-sky-900 font-medium shadow-xs">
        <Info className="w-5 h-5 text-sky-600 shrink-0" />
        <p className="leading-relaxed">
          <b>Medical & Diagnostic Disclaimer:</b> This platform provides environmental exposure risk analysis and general public-health guidance based on published CPCB/WHO standards. It does <span className="underline font-bold">not diagnose clinical diseases</span> or replace medical consultation from a qualified physician.
        </p>
      </div>

      {/* Guidelines Grid by AQI Tier */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          guidelines.map((g, idx) => {
            const style = TIER_COLORS[g.category] || { color: '#0284C7', border: 'border-slate-200', bg: 'bg-slate-50' };
            return (
              <div
                key={idx}
                className={`classy-card rounded-3xl p-6 border ${style.border} space-y-4 shadow-sm`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-xl font-mono font-black text-sm"
                      style={{ backgroundColor: `${style.color}18`, color: style.color }}
                    >
                      AQI {g.aqi_range}
                    </span>
                    <h3 className="text-lg font-black text-slate-900">{g.category}</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono font-bold">
                    CPCB National Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                  {/* Potential Health Effects */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Associated Physiological Effects
                    </span>
                    <p className="text-slate-600 leading-relaxed">{g.potential_health_effects}</p>
                    <p className="text-[11px] text-slate-500 pt-1 font-mono">{g.cpcb_health_statement}</p>
                  </div>

                  {/* Exercise Guidance */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-sky-600" />
                      Physical Exercise Guidance
                    </span>
                    <p className="text-slate-600 leading-relaxed">{g.exercise_guidance}</p>
                  </div>

                  {/* Personal Protection Actions */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Personal Protection Measures
                    </span>
                    <p className="text-slate-600 leading-relaxed">{g.personal_protection_actions}</p>
                  </div>

                  {/* Indoor Air Management */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                      Indoor Ventilation & Air Management
                    </span>
                    <p className="text-slate-600 leading-relaxed">{g.indoor_air_management}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
