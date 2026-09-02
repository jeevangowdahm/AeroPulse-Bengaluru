import React, { useState, useEffect } from 'react';
import { fetchRiskRankings } from '../services/api';
import {
  Award,
  ArrowUpDown,
  Filter,
  ShieldCheck,
  Flame,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface RiskRankingsViewProps {
  onSelectStation: (id: string) => void;
}

export const RiskRankingsView: React.FC<RiskRankingsViewProps> = ({ onSelectStation }) => {
  const [rankings, setRankings] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>('aqi');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchRiskRankings(sortBy);
        setRankings(data.leaderboard || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sortBy]);

  const filteredRankings = zoneFilter === 'all'
    ? rankings
    : rankings.filter(r => r.zone?.toLowerCase() === zoneFilter.toLowerCase());

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="classy-card rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-700 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Locality Risk Leaderboards
            </span>
            <span className="text-[10px] font-mono bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200 font-bold">
              14 CAAQMS Stations Ranked
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Bengaluru Air Quality Risk Rankings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Real-time ranked comparison of air pollution exposure across all monitored Bengaluru localities.
          </p>
        </div>

        {/* Sort and Zone Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500 font-semibold"
          >
            <option value="aqi">Sort by Highest AQI</option>
            <option value="pm25">Sort by Highest PM2.5</option>
            <option value="pm10">Sort by Highest PM10</option>
            <option value="spike">Sort by 24h Deterioration Rate</option>
          </select>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500 font-semibold"
          >
            <option value="all">All Zones</option>
            <option value="South">South Zone</option>
            <option value="North">North Zone</option>
            <option value="East">East Zone</option>
            <option value="West">West Zone</option>
            <option value="Central">Central Zone</option>
          </select>
        </div>
      </div>

      {/* Rankings Table Card */}
      <div className="classy-card rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 w-16">Rank</th>
                <th className="pb-3">Locality / Station</th>
                <th className="pb-3">Zone</th>
                <th className="pb-3 font-mono">Current AQI</th>
                <th className="pb-3">Severity Tier</th>
                <th className="pb-3 font-mono">PM2.5 (µg)</th>
                <th className="pb-3 font-mono">PM10 (µg)</th>
                <th className="pb-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRankings.map((st, idx) => (
                <tr key={st.station_id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 font-bold font-mono">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      idx === 0 ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      idx === 1 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      idx === 2 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-slate-900 block text-sm">{st.station_name}</span>
                    <span className="text-[11px] text-slate-500">{st.environment_type || "Urban Commercial"}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {st.zone}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-base font-black" style={{ color: st.color }}>
                    {st.aqi}
                  </td>
                  <td className="py-3.5">
                    <span
                      className="px-2.5 py-1 rounded-full font-bold text-[11px]"
                      style={{ backgroundColor: `${st.color}18`, color: st.color, border: `1px solid ${st.color}35` }}
                    >
                      {st.category}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono font-bold text-slate-800">{st.pm2_5}</td>
                  <td className="py-3.5 font-mono font-bold text-slate-800">{st.pm10}</td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => onSelectStation(st.station_id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-sky-600 hover:text-white rounded-xl text-slate-700 font-bold transition text-xs shadow-xs"
                    >
                      View Live &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
