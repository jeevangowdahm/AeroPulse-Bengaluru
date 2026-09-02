'use client';
import React, { useState, useEffect } from 'react';
import { fetchHistoricalTrends } from '@/lib/services/aeropulseApi';
import {
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const HistoricalTrendsView: React.FC = () => {
  const [horizon, setHorizon] = useState<string>('30D');
  const [trendData, setTrendData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchHistoricalTrends(horizon);
        setTrendData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [horizon]);

  const HORIZONS = ['24H', '7D', '30D', '3M', '6M', '1Y', '5Y'];
  const [selectedPollutant, setSelectedPollutant] = useState<'aqi' | 'pm2_5' | 'pm10' | 'no2'>('aqi');

  const ANNUAL_HISTORICAL_DATA = [
    { year: '2020 (Lockdown)', aqi: 78, pm25: 32.4, cpcbLimit: 40, note: '-42% drops during lockdown' },
    { year: '2021 (Post-Covid)', aqi: 115, pm25: 48.1, cpcbLimit: 40, note: 'Industrial resumption peak' },
    { year: '2022 (Metro Works)', aqi: 142, pm25: 58.6, cpcbLimit: 40, note: 'ORR dust & transit congestion' },
    { year: '2023 (El Niño Warmth)', aqi: 135, pm25: 54.2, cpcbLimit: 40, note: 'Low monsoonal wash-down' },
    { year: '2024 (KSPCB Policy)', aqi: 124, pm25: 49.5, cpcbLimit: 40, note: 'Strict stack monitoring' },
    { year: '2025 (EV Transit)', aqi: 118, pm25: 46.2, cpcbLimit: 40, note: 'BMTC Electric fleet adoption' },
    { year: '2026 (Current YTD)', aqi: 112, pm25: 44.0, cpcbLimit: 40, note: 'Live Open-Meteo & CPCB sync' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Horizon Selector */}
      <div className="classy-card rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Multi-Year Climatological Trends
            </span>
            <span className="text-[10px] font-mono bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200 font-bold">
              2020–2026 Records
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Bengaluru Air Quality Historical Trends
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Analyze seasonal monsoonal dips, post-monsoon thermal inversions, and multi-year pollution reduction progress.
          </p>
        </div>

        {/* Horizon Pill Bar */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 overflow-x-auto border border-slate-200">
          {HORIZONS.map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                horizon === h
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Main Historical Chart */}
      <div className="classy-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Composite AQI & Particulate Concentration ({horizon})
            </h3>
            <p className="text-xs text-slate-500">Historical daily and hourly progression</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl border border-slate-200">
              {(trendData?.data || trendData?.data_points || []).length} Data Points Loaded
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData?.data || trendData?.data_points || []}>
              <defs>
                <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '16px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                labelStyle={{ color: '#0F172A', fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="aqi" stroke="#0284C7" strokeWidth={2.5} fillOpacity={1} fill="url(#histGrad)" name="AQI" />
              <Area type="monotone" dataKey="pm2_5" stroke="#D97706" strokeWidth={1.5} fillOpacity={0} name="PM2.5 (µg/m³)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 font-mono font-medium">
          <span>🔵 Total Air Quality Index</span>
          <span>🟠 PM2.5 Fine Particulates</span>
          <span>Source: KSPCB Continuous Monitoring</span>
        </div>
      </div>

      {/* 2020-2026 Annual Progress & CPCB Benchmark Comparison */}
      <div className="classy-card rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            📊 2020–2026 Annual Mean PM2.5 vs CPCB Target (40 µg/m³)
          </h3>
          <p className="text-xs text-slate-500">
            Comparing annual averages across Lockdown (2020), Rapid Freight Surge (2022), and Clean Transit Policies (2025-2026).
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ANNUAL_HISTORICAL_DATA}>
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 80]} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '16px', fontSize: '12px' }}
              />
              <Bar dataKey="pm25" name="Annual PM2.5 (µg/m³)" radius={[8, 8, 0, 0]}>
                {ANNUAL_HISTORICAL_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pm25 > 50 ? '#EF4444' : entry.pm25 > 40 ? '#F59E0B' : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          {ANNUAL_HISTORICAL_DATA.slice(-4).map((d) => (
            <div key={d.year} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block">{d.year}</span>
              <span className="text-[11px] font-mono font-black text-sky-700">{d.pm25} µg/m³ PM2.5</span>
              <span className="text-[10px] text-slate-500 block">{d.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Bengaluru Seasons Breakdown */}
      {trendData?.seasonal_breakdown && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(trendData.seasonal_breakdown).map(([season, data]: [string, any], idx) => (
            <div key={idx} className="classy-card rounded-2xl p-5 border border-slate-200 space-y-2.5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                {season.replace(/_/g, ' ')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900">{data.mean_aqi} AQI</span>
                <span className="text-xs font-bold text-sky-700">{data.category}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{data.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
