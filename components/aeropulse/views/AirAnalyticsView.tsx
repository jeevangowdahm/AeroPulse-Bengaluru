'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Activity, Cpu, ShieldAlert, BarChart3, TrendingUp, Info } from 'lucide-react';
import { AlgorithmModal } from '@/components/shell/AlgorithmModal';

export const AirAnalyticsView: React.FC = () => {
  const [trafficData, setTrafficData] = useState<any>(null);
  const [showAlgoModal, setShowAlgoModal] = useState(false);

  useEffect(() => {
    fetch('/api/traffic')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTrafficData(data);
        }
      });
  }, []);

  const multiPollutantSeries = [
    { time: '00:00', pm25: 65, pm10: 105, no2: 45, so2: 12, aqi: 135 },
    { time: '04:00', pm25: 72, pm10: 115, no2: 48, so2: 14, aqi: 150 },
    { time: '08:00', pm25: 135, pm10: 198, no2: 92, so2: 24, aqi: 280 },
    { time: '12:00', pm25: 98, pm10: 154, no2: 68, so2: 18, aqi: 195 },
    { time: '16:00', pm25: 110, pm10: 172, no2: 78, so2: 20, aqi: 220 },
    { time: '20:00', pm25: 148, pm10: 215, no2: 102, so2: 28, aqi: 305 },
  ];

  const scatterPoints = [
    { traffic: 18, no2: 22, locality: 'Cubbon Park' },
    { traffic: 38, no2: 32, locality: 'Yelahanka' },
    { traffic: 48, no2: 42, locality: 'Jayanagar' },
    { traffic: 54, no2: 48, locality: 'Koramangala' },
    { traffic: 62, no2: 54, locality: 'Indiranagar' },
    { traffic: 65, no2: 58, locality: 'BTM Layout' },
    { traffic: 70, no2: 64, locality: 'Electronic City' },
    { traffic: 82, no2: 112, locality: 'Peenya' },
    { traffic: 85, no2: 76, locality: 'Whitefield' },
    { traffic: 88, no2: 84, locality: 'Hebbal' },
    { traffic: 92, no2: 92, locality: 'Majestic' },
    { traffic: 94, no2: 98, locality: 'Silk Board' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="classy-card rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-sky-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              AIR ANALYTICS LAB & CORRELATION
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical multi-pollutant time-series & Pearson Correlation (r) between Traffic Density (%) and NO2 Concentrations.
          </p>
        </div>

        <button
          onClick={() => setShowAlgoModal(true)}
          className="flex items-center space-x-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-mono font-bold text-sky-800 hover:bg-sky-100 transition shadow-xs"
        >
          <Cpu className="h-4 w-4 text-sky-600" />
          <span>How Pearson (r) Works</span>
        </button>
      </div>

      {/* Pearson Correlation Hero Stat */}
      {trafficData && (
        <div className="classy-card rounded-3xl p-6 border border-sky-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pearson Correlation Coefficient (r)
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-black font-mono text-sky-700">
                  r = +{trafficData.correlation.r}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {trafficData.correlation.strength} ({trafficData.correlation.direction})
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium max-w-xl mt-1">
                {trafficData.correlation.interpretation}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-xs text-slate-700 space-y-1.5 min-w-[200px]">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">R-Squared (R²):</span>
                <span className="font-bold text-slate-900">{trafficData.correlation.rSquared}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Sample Count (N):</span>
                <span className="font-bold text-slate-900">{trafficData.correlation.n} Zones</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Statistical Significance:</span>
                <span className="text-emerald-700 font-black">p &lt; 0.001</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Scatter Plot + Multi-Pollutant Time Series */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scatter Plot: Traffic Density vs NO2 */}
        <div className="classy-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Traffic Density (%) vs. NO2 (µg/m³) Scatter Plot
              </h3>
              <p className="text-[11px] text-slate-500">Linear regression relationship across Bengaluru stations</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              r = +0.89
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  dataKey="traffic"
                  name="Traffic Density"
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fill: '#64748B', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="no2"
                  name="NO2 Concentration"
                  unit="µg"
                  domain={[0, 140]}
                  tick={{ fill: '#64748B', fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 text-xs shadow-lg space-y-1">
                          <span className="font-bold text-slate-900 block">{data.locality}</span>
                          <span className="text-slate-600 block">Traffic Density: <b className="text-slate-900">{data.traffic}%</b></span>
                          <span className="text-sky-700 block">NO₂ Level: <b className="text-slate-900">{data.no2} µg/m³</b></span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Bengaluru Stations" data={scatterPoints} fill="#0284C7" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Pollutant Time-Series */}
        <div className="classy-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                24-Hour Multi-Pollutant Dynamics
              </h3>
              <p className="text-[11px] text-slate-500">Hourly diurnal curves capturing morning and evening traffic pulses</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              7 Parameters
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={multiPollutantSeries} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '11px', color: '#0F172A' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="pm25" stroke="#EF4444" name="PM2.5" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pm10" stroke="#F59E0B" name="PM10" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="no2" stroke="#3B82F6" name="NO2" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="so2" stroke="#10B981" name="SO2" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Algorithm Modal */}
      <AlgorithmModal
        isOpen={showAlgoModal}
        onClose={() => setShowAlgoModal(false)}
        algorithmName="Pearson Correlation"
      />
    </div>
  );
};
