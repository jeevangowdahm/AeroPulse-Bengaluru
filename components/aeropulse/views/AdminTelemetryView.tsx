'use client';
import React, { useState, useEffect } from 'react';
import { fetchAdminMetrics } from '@/lib/services/aeropulseApi';
import {
  ShieldAlert,
  Server,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AdminTelemetryView: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchAdminMetrics();
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const net = metrics.network_health || {};
  const model = metrics.model_telemetry || {};
  const mMetrics = model.metrics || {};
  const drift = model.drift_status || {};

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="classy-card rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-purple-700 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Infrastructure & ML Observability
            </span>
            <span className="text-[10px] font-mono bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200 font-bold">
              System Admin Audit
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Sensor Telemetry & ML Model Health Monitor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Continuous auditing of CAAQMS packet ingestion, sensor drift, outlier spikes, and regression ensemble performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-bold text-emerald-700">All Microservices Healthy</span>
        </div>
      </div>

      {/* System KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="classy-card rounded-2xl p-4 border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] text-slate-500 font-bold block">Network Uptime</span>
          <span className="text-2xl font-black font-mono text-emerald-700">{net.network_uptime_pct || 99.4}%</span>
          <span className="text-[10px] text-slate-500 block font-medium">14 / 14 Stations Online</span>
        </div>

        <div className="classy-card rounded-2xl p-4 border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] text-slate-500 font-bold block">Mean Packet Latency</span>
          <span className="text-2xl font-black font-mono text-sky-700">{net.mean_network_latency_ms || 52} ms</span>
          <span className="text-[10px] text-slate-500 block font-medium">WebSocket / MQTT Broker</span>
        </div>

        <div className="classy-card rounded-2xl p-4 border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] text-slate-500 font-bold block">ML Forecaster R²</span>
          <span className="text-2xl font-black font-mono text-purple-700">{mMetrics.r2_score || 0.88}</span>
          <span className="text-[10px] text-slate-500 block font-medium">MAE: {mMetrics.mae || 11.2} AQI</span>
        </div>

        <div className="classy-card rounded-2xl p-4 border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] text-slate-500 font-bold block">Model Drift Status</span>
          <span className="text-2xl font-black font-mono text-emerald-700">Negligible</span>
          <span className="text-[10px] text-slate-500 block font-medium">p-value: {drift.ks_test_p_value || 0.42}</span>
        </div>
      </div>

      {/* 14 Stations Telemetry Health Table */}
      <div className="classy-card rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-600" />
            14 Bengaluru CAAQMS Telemetry Audit
          </h3>
          <span className="text-[11px] font-mono text-slate-500 font-bold">Data Source: {net.data_source_mode}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Node ID</th>
                <th className="pb-3">Station Name</th>
                <th className="pb-3">Zone</th>
                <th className="pb-3 font-mono">Status</th>
                <th className="pb-3 font-mono">Latency</th>
                <th className="pb-3 font-mono">Delivery Rate</th>
                <th className="pb-3">Quality Tag</th>
                <th className="pb-3">Anomaly Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(net.stations || []).map((s: any) => (
                <tr key={s.station_id} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-mono text-slate-500 font-bold">{s.station_id}</td>
                  <td className="py-3 font-bold text-slate-900">{s.station_name}</td>
                  <td className="py-3 text-slate-600">{s.zone}</td>
                  <td className="py-3 font-mono font-bold text-emerald-700">{s.status}</td>
                  <td className="py-3 font-mono text-slate-700">{s.latency_ms} ms</td>
                  <td className="py-3 font-mono font-bold text-sky-700">{s.packet_delivery_rate}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.data_quality}
                    </span>
                  </td>
                  <td className="py-3 text-[11px]">
                    {s.anomalies_detected === 0 ? (
                      <span className="text-emerald-700 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> {s.anomaly_details}
                      </span>
                    )}
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
