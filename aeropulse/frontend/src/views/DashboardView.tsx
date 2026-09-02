import React, { useState } from 'react';
import { CityOverview, StationData, ViewType } from '../types';
import { AQIGauge } from '../components/AQIGauge';
import { PollutantGrid } from '../components/PollutantGrid';
import { WeatherStrip } from '../components/WeatherStrip';
import {
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Flame,
  HeartPulse,
  UserCheck,
  Compass,
  Sparkles,
  MapPin,
  Trees,
  Image as ImageIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DashboardViewProps {
  overview: CityOverview | null;
  selectedStation: StationData | null;
  stationProfile: any | null;
  onNavigate: (view: ViewType) => void;
  onSelectStation: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  overview,
  selectedStation,
  stationProfile,
  onNavigate,
  onSelectStation
}) => {
  const [heroBg, setHeroBg] = useState<'cubbon' | 'vidhana'>('cubbon');

  if (!overview || !selectedStation) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const historyData = stationProfile?.history_24h || [];

  const bgImage = heroBg === 'cubbon' 
    ? '/images/cubbon_park.jpg' 
    : '/images/vidhana_soudha.jpg';

  return (
    <div className="space-y-6 pb-12">
      {/* Scenic Background Hero Banner featuring Cubbon Park & Vidhana Soudha */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md min-h-[220px] sm:min-h-[250px] flex flex-col justify-between p-6 sm:p-8 transition-all duration-700 bg-slate-900 group">
        {/* Background Image with Gentle Zoom Animation */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-80 group-hover:scale-105"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        
        {/* Dark & Frosted Glass Gradient Overlay for High-Contrast Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent backdrop-blur-[2px]" />

        {/* Top Floating Controls & Location Tag */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase font-black tracking-wider bg-emerald-500/90 text-white px-3 py-1 rounded-full backdrop-blur-md shadow-sm flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5" />
              {heroBg === 'cubbon' ? 'Cubbon Park Forest Canopy' : 'Vidhana Soudha Capitol Lawns'}
            </span>
            <span className="text-[11px] font-mono text-slate-200 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 hidden sm:inline">
              Bengaluru Urban District
            </span>
          </div>

          {/* Background Toggle Buttons */}
          <div className="bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-white/20 flex items-center gap-1 text-xs font-bold text-white shadow-lg">
            <button
              onClick={() => setHeroBg('cubbon')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                heroBg === 'cubbon'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🌳</span>
              <span>Cubbon Park</span>
            </button>
            <button
              onClick={() => setHeroBg('vidhana')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                heroBg === 'vidhana'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🏛️</span>
              <span>Vidhana Soudha</span>
            </button>
          </div>
        </div>

        {/* Bottom Hero Content */}
        <div className="relative z-10 space-y-1.5 max-w-2xl mt-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
            Bengaluru Air Quality & Environmental Defense
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed drop-shadow">
            Real-time multi-station telemetry across 14 CAAQMS nodes, AI hazard forecasting, and urban forest particulate absorption intelligence.
          </p>
        </div>
      </div>

      {/* Top Banner Alert if active warnings exist */}
      {overview.active_warnings_count > 0 && (
        <div 
          onClick={() => onNavigate('insights')}
          className="cursor-pointer bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-rose-300 transition duration-300"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-2xl">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900 tracking-wide">EARLY WARNING ACTIVE</span>
                <span className="text-[10px] bg-rose-600 text-white font-black px-2 py-0.5 rounded-full">
                  {overview.active_warnings_count} Zones Elevated
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Rapid AQI increase predicted for South & East corridors (Silk Board, Outer Ring Road).
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800 shrink-0">
            Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Grid: AQI Gauge + Health Advisory & Personal Exposure CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main AQI Gauge Card (7 cols) */}
        <div className="lg:col-span-7">
          <AQIGauge
            aqi={selectedStation.aqi}
            category={selectedStation.category}
            primaryPollutant={selectedStation.primary_pollutant}
            color={selectedStation.color}
            badge={selectedStation.badge}
            stationName={selectedStation.station_name}
            standard={overview.aqi_standard === "NAQI_INDIA" ? "Indian NAQI" : "US EPA"}
          />
        </div>

        {/* Quick Health Advisory & Personal Advisor CTA (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {/* Quick Health Advisory */}
          <div className="classy-card rounded-3xl p-6 border border-slate-200/80 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                  Health & Activity Advisory
                </span>
                <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 font-semibold">
                  Non-Diagnostic
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-2">
                {selectedStation.aqi > 200
                  ? "Elevated Particulate Exposure Risk"
                  : selectedStation.aqi > 100
                  ? "Moderate Sensitivity Advisory"
                  : "Satisfactory Breathing Conditions"}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedStation.aqi > 200
                  ? "Avoid high-intensity outdoor workouts. Sensitive individuals (children, elderly, asthma) should remain in air-filtered spaces."
                  : selectedStation.aqi > 100
                  ? "Sensitive groups should reduce prolonged outdoor exertion. Morning rush hours have higher particulate trapping."
                  : "Ideal for outdoor running, cycling, and natural indoor window ventilation."}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <button 
                onClick={() => onNavigate('insights')}
                className="text-sky-700 font-bold hover:text-sky-800 flex items-center gap-1 transition"
              >
                Health Rules Matrix <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={() => onNavigate('insights')}
                className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition"
              >
                Why is it polluted? <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Personal Exposure Calculator CTA */}
          <div className="classy-card rounded-3xl p-6 border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Personal Exposure & Footprint
              </span>
              <h4 className="text-sm font-bold text-slate-900">How much pollution do you inhale & emit?</h4>
              <p className="text-xs text-slate-600">
                Calculate your personalized 0–100 Inhalation Score & Clean-Air Green Contribution Score.
              </p>
            </div>
            <button
              onClick={() => onNavigate('exposure')}
              className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-500/20 shrink-0 transition"
            >
              Start Advisor
            </button>
          </div>
        </div>
      </div>

      {/* Surface Meteorological Strip */}
      <WeatherStrip weather={overview.weather} />

      {/* Criteria Pollutants Grid (7 Pollutants) */}
      <PollutantGrid 
        pollutants={overview.city_composite.pollutants}
        subIndices={overview.city_composite.sub_indices}
      />

      {/* 24-Hour Diurnal Sparkline Trend + Top Bengaluru Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 24-Hour Trend Chart (7 cols) */}
        <div className="lg:col-span-7 classy-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                24-Hour Diurnal Trajectory ({selectedStation.station_name})
              </h3>
              <p className="text-xs text-slate-500">Hourly progression showing morning/evening traffic inversion peaks</p>
            </div>
            <button 
              onClick={() => onNavigate('forecast')}
              className="text-xs text-sky-700 hover:text-sky-800 font-bold flex items-center gap-1 transition"
            >
              7-Day Forecast <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 'dataMax + 40']} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '16px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  labelStyle={{ color: '#64748B', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="aqi" stroke="#0284C7" strokeWidth={2.5} fillOpacity={1} fill="url(#aqiGrad)" name="AQI" />
                <Area type="monotone" dataKey="pm2_5" stroke="#D97706" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={0} name="PM2.5 (µg/m³)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200 font-mono">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-600 inline-block"></span> Total AQI
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-3"></span> PM2.5 (µg/m³)
            </span>
            <span>Peak: 08:30 AM & 08:45 PM</span>
          </div>
        </div>

        {/* Top Hotspots & Quick Map Preview (5 cols) */}
        <div className="lg:col-span-5 classy-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                Top Bengaluru Pollution Hotspots
              </h3>
              <button 
                onClick={() => onNavigate('map')}
                className="text-xs text-sky-700 hover:text-sky-800 font-bold flex items-center gap-1 transition"
              >
                GIS Map <Compass className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Corridors experiencing high particulate congestion today:
            </p>

            <div className="space-y-2">
              {[
                { name: "Silk Board Junction", zone: "South", aqi: 228, cause: "Vehicular Idling & Road Dust", id: "BLR_ST01" },
                { name: "Peenya Industrial 2nd Stage", zone: "West", aqi: 242, cause: "Boilers & Heavy Freight", id: "BLR_ST03" },
                { name: "KR Puram Tin Factory", zone: "East", aqi: 215, cause: "Transit Bottleneck & Silt", id: "BLR_ST08" },
                { name: "Hebbal Flyover Junction", zone: "North", aqi: 188, cause: "Airport Transit & Metro Works", id: "BLR_ST04" }
              ].map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => onSelectStation(spot.id)}
                  className="bg-slate-50 hover:bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer transition classy-card-hover"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">{spot.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({spot.zone})</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{spot.cause}</span>
                  </div>
                  <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                    AQI {spot.aqi}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">14 CAAQMS Stations Audited</span>
            <button 
              onClick={() => onNavigate('insights')}
              className="text-sky-700 hover:text-sky-800 font-bold transition"
            >
              Locality Risk Rankings &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
