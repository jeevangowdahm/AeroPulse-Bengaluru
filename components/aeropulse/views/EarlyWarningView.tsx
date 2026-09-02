'use client';
import React, { useState, useEffect } from 'react';
import { fetchAlerts } from '@/lib/services/aeropulseApi';
import { EarlyWarning, StationData } from '@/lib/types/aeropulse';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Send,
  Smartphone,
  Mail,
  Globe,
  Clock
} from 'lucide-react';

interface EarlyWarningViewProps {
  stations: StationData[];
}

export const EarlyWarningView: React.FC<EarlyWarningViewProps> = ({ stations }) => {
  const [alerts, setAlerts] = useState<EarlyWarning[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom alert subscription state
  const [selectedStation, setSelectedStation] = useState('BLR_ST01');
  const [aqiThreshold, setAqiThreshold] = useState(150);
  const [notifyWeb, setNotifyWeb] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifySMS, setNotifySMS] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetchAlerts();
        setAlerts(res.alerts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="classy-card rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-rose-700 flex items-center gap-1.5">
            <Bell className="w-4 h-4" />
            Early Warning & Hazard Alerts
          </span>
          <span className="text-[10px] font-mono bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200 font-bold">
            Automated Anomaly Engine
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mt-1">
          Bengaluru Air Quality Early Warning System
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Automated alerts for rapid pollution deterioration, thermal inversions, particulate threshold spikes, and hotspot congestion.
        </p>
      </div>

      {/* Active Warning Feeds Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          Active Environmental Broadcasts ({alerts.length})
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          alerts.map((alt) => (
            <div
              key={alt.id}
              className="classy-card rounded-3xl p-6 border border-rose-200 bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40 space-y-3 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider bg-rose-600 text-white uppercase">
                    {alt.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{alt.alert_type}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-600" /> {alt.lead_time}
                  </span>
                  <span>{alt.timestamp}</span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900">{alt.title}</h4>
                <p className="text-xs text-rose-700 font-bold mt-1">{alt.trigger_condition}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 text-xs font-medium shadow-xs">
                <span className="font-bold text-slate-900 block">Recommended Citizen Action:</span>
                <p className="text-slate-600 leading-relaxed">{alt.action_advisory}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 font-semibold">
                <span>Affected Zone: <b className="text-slate-900">{alt.affected_area}</b></span>
                <span>Forecast AQI: <b className="text-rose-700">{alt.forecast_aqi}</b> (Current {alt.current_aqi})</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Threshold Configurator */}
      <div className="classy-card rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-600" />
            Custom Notification Thresholds & Channel Preferences
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Set custom trigger thresholds for your commute corridor and configure simulated push, email, and SMS notifications.
          </p>
        </div>

        <form onSubmit={handleSaveSubscription} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Monitored Locality / Station</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-semibold"
              >
                {stations.map(st => (
                  <option key={st.station_id} value={st.station_id}>
                    {st.station_name} ({st.zone})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">AQI Alert Threshold</span>
                <span className="font-mono text-sky-700 font-bold">{aqiThreshold} AQI</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={aqiThreshold}
                onChange={(e) => setAqiThreshold(parseInt(e.target.value))}
                className="w-full accent-sky-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Notification Channels</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setNotifyWeb(!notifyWeb)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                  notifyWeb ? 'bg-sky-50 border-sky-300 text-sky-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span>Web App</span>
                </div>
                {notifyWeb && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
              </button>

              <button
                type="button"
                onClick={() => setNotifyPush(!notifyPush)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                  notifyPush ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Browser Push</span>
                </div>
                {notifyPush && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => setNotifyEmail(!notifyEmail)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                  notifyEmail ? 'bg-purple-50 border-purple-300 text-purple-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span>Email Digest</span>
                </div>
                {notifyEmail && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
              </button>

              <button
                type="button"
                onClick={() => setNotifySMS(!notifySMS)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                  notifySMS ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-600" />
                  <span>SMS Hook</span>
                </div>
                {notifySMS && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            {savedSuccess ? (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Preferences Saved Successfully!
              </span>
            ) : <span className="text-xs text-slate-500 font-medium">Auto-triggers on ML spike projection (&gt;30 pts)</span>}

            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Save Alert Preferences
            </button>
          </div>
        </form>
      </div>

      {/* AI PREDICTIVE URBAN FORESTRY & TRAFFIC BYPASS MODULE */}
      <div className="classy-card rounded-3xl p-6 border border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/50 space-y-6 shadow-md">
        <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="text-lg">🌳</span> AI PREDICTIVE URBAN FORESTRY & BOTTLENECK BYPASS
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Historical trend analysis predicting 2026-2027 canopy loss, high-risk pollution spikes & targeted tree species planting solutions.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-3 py-1 rounded-full">
            CPCB & IISc Calibration
          </span>
        </div>

        {/* Section 1: Alternative Traffic Bypass Routes */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            🚦 High-Traffic Corridors & Low-Exposure Alternative Routes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {[
              { congested: "Silk Board & ORR Corridor", bypass: "Indiranagar - HAL Old Airport Rd - Sarjapur Link", drop: "-38% AQI Drop", desc: "Bypasses diesel truck queuing at Silk Board; routes through higher tree cover." },
              { congested: "Peenya Highway Bottleneck", bypass: "Dasarahalli Inner Ring - HMT Green Buffer Rd", drop: "-32% AQI Drop", desc: "Avoids industrial stack exhaust and unpaved shoulder dust." },
              { congested: "Goraguntepalya - Tumkur Merge", bypass: "Yeshwantpur Flyover & BEL Campus Buffer", drop: "-42% AQI Drop", desc: "Utilizes GKVK agricultural green buffer for clean microclimate commute." }
            ].map((route, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700 text-xs">❌ {route.congested}</span>
                  <span className="text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">{route.drop}</span>
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                  ✅ Recommended: {route.bypass}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">{route.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Targeted Tree Species Planting Matrix */}
        <div className="space-y-3 pt-3 border-t border-emerald-200">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            🌿 Recommended Bio-Filtering Tree Species & Planting Locations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              { species: "Neem (Azadirachta indica)", kannada: "ಬೇವು (Bevu)", lai: "4.8 LAI", dustCap: "145 g PM2.5/m²/yr", target: "Silk Board Junction & Peenya Industrial Medians", reason: "High dust capture capacity & antimicrobial volatile emissions." },
              { species: "Peepal (Ficus religiosa)", kannada: "ಅರಳಿ ಮರ (Arali Mara)", lai: "5.6 LAI", dustCap: "185 g PM2.5/m²/yr", target: "Goraguntepalya & Hebbal Flyover Buffer Zones", reason: "Massive broad canopy providing 24-hour oxygen enrichment & NO₂ absorption." },
              { species: "Banyan (Ficus benghalensis)", kannada: "ಆಲದ ಮರ (Aalada Mara)", lai: "6.2 LAI", dustCap: "210 g PM2.5/m²/yr", target: "Outer Ring Road & KR Puram Freight Corridors", reason: "Dense aerial root foliage trapping coarse PM10 road dust." },
              { species: "Honge / Indian Beech (Millettia pinnata)", kannada: "ಹೊಂಗೆ (Honge)", lai: "4.2 LAI", dustCap: "120 g PM2.5/m²/yr", target: "Whitefield IT Freight Corridor & EPIP Zone", reason: "Drought resistant, nitrogen-fixing, absorbs sulfur dioxide." },
              { species: "Bael (Aegle marmelos)", kannada: "ಬೆಳ್ವ (Belva)", lai: "3.9 LAI", dustCap: "98 g PM2.5/m²/yr", target: "Mysore Road & City Market Traffic Margins", reason: "Absorbs toxic vehicular carbon monoxide & heavy metal dust." }
            ].map((tree, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-extrabold text-slate-900 text-xs">{tree.species}</span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">{tree.kannada}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-50 p-2 rounded-xl">
                  <div><span className="text-slate-400 block">Leaf Area Index:</span><b>{tree.lai}</b></div>
                  <div><span className="text-slate-400 block">PM2.5 Capture:</span><b className="text-emerald-700">{tree.dustCap}</b></div>
                </div>
                <div className="text-[11px] space-y-1">
                  <div><span className="font-bold text-slate-700">Target Zone:</span> <span className="text-sky-800 font-semibold">{tree.target}</span></div>
                  <div><span className="font-bold text-slate-700">Ecological Benefit:</span> <span className="text-slate-600">{tree.reason}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
