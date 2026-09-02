import React, { useState, useEffect } from 'react';
import { fetchSourceAnalysis } from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  SlidersHorizontal,
  Flame,
  Truck,
  Building2,
  Factory,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface SourceAnalysisViewProps {
  selectedStationId: string;
}

export const SourceAnalysisView: React.FC<SourceAnalysisViewProps> = ({ selectedStationId }) => {
  const [sources, setSources] = useState<any[]>([]);
  const [whyData, setWhyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchSourceAnalysis(selectedStationId);
        setSources(data.cstep_study_breakdown || []);
        setWhyData(data.dynamic_explanation);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedStationId]);

  const SECTOR_COLORS: Record<string, string> = {
    'Road Dust (Resuspension)': '#D97706',
    'Vehicular Transport': '#DC2626',
    'Construction & Demolition': '#7C3AED',
    'Industrial & Diesel Generators': '#0284C7',
    'Biomass & Waste Burning': '#EA580C',
    'Secondary Particulates & Others': '#059669'
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="classy-card rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-sky-700 flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4" />
            Source Apportionment & XAI
          </span>
          <span className="text-[10px] font-mono bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200 font-bold">
            CSTEP / KSPCB Study Grounded
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mt-1">
          Bengaluru Urban Pollution Source Apportionment
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Quantified sectoral contribution to PM2.5 and PM10 particulate mass based on published empirical chemical speciation studies.
        </p>
      </div>

      {/* Dynamic Explainable AI Card: "Why is Bengaluru AQI High Today?" */}
      {whyData && (
        <div className="classy-card rounded-3xl p-6 sm:p-8 border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Dynamic Environmental Reasoner</span>
                <h3 className="text-lg font-black text-slate-900">{whyData.headline || "Why is AQI High in Bengaluru Today?"}</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-xl border border-slate-200 text-slate-700 shadow-xs">
              Locality: {whyData.station_name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 block">Primary Dominant Cause:</span>
              <p className="text-slate-600 leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                {whyData.dominant_cause}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 block">Atmospheric Boundary Layer Factor:</span>
              <p className="text-slate-600 leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                {whyData.meteorological_factor}
              </p>
            </div>
          </div>

          {/* Actionable citizen & policy mitigation tips */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-900 block mb-2">Key Contributing Factors Today:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {(whyData.contributing_factors || []).map((f: string, i: number) => (
                <div key={i} className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-start gap-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Donut Charts Grid: PM2.5 vs PM10 Sector Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PM2.5 Sector Donut */}
        <div className="classy-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Fine Particulate (PM2.5) Sources</h3>
              <p className="text-xs text-slate-500">Combustion & tailpipe dominant</p>
            </div>
            <span className="text-xs font-mono font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-xl border border-rose-200">
              Transport 39.9%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sources}
                  dataKey="pm2_5_share_pct"
                  nameKey="source_name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SECTOR_COLORS[entry.source_name] || '#64748B'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '16px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(val: any) => [`${val}% Share`, 'PM2.5 Contribution']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            {sources.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SECTOR_COLORS[s.source_name] }} />
                  <span className="text-slate-700 truncate">{s.source_name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{s.pm2_5_share_pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* PM10 Sector Donut */}
        <div className="classy-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Coarse Dust (PM10) Sources</h3>
              <p className="text-xs text-slate-500">Resuspension & mechanical wear dominant</p>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl border border-amber-200">
              Road Dust 51.1%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sources}
                  dataKey="pm10_share_pct"
                  nameKey="source_name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {sources.map((entry, index) => (
                    <Cell key={`cell-pm10-${index}`} fill={SECTOR_COLORS[entry.source_name] || '#64748B'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '16px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(val: any) => [`${val}% Share`, 'PM10 Contribution']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            {sources.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SECTOR_COLORS[s.source_name] }} />
                  <span className="text-slate-700 truncate">{s.source_name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{s.pm10_share_pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
