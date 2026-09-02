import React, { useState, useEffect } from 'react';
import { fetchExportDatasets } from '../services/api';
import {
  Database,
  Download,
  FileSpreadsheet,
  ShieldCheck
} from 'lucide-react';

export const DataQualityExportView: React.FC = () => {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchExportDatasets();
        setDatasets(data.datasets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDownload = (filename: string) => {
    window.open(`/api/export/dataset/${filename}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="classy-card rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-sky-700 flex items-center gap-1.5">
            <Database className="w-4 h-4" />
            Open Environmental Data & Exports
          </span>
          <span className="text-[10px] font-mono bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200 font-bold">
            15 Standardized CSV Schemas
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mt-1">
          Bengaluru Prototype Environmental Datasets & Exports
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Download structured CSV datasets covering monitoring stations, hourly readings, weather, CSTEP source apportionments, traffic congestion, forecasts, and health rules.
        </p>
      </div>

      {/* Transparency Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-center gap-3.5 text-xs text-amber-900 font-medium">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="leading-relaxed">
          <b>Scientific Data Transparency:</b> All records generated in prototype mode contain explicit metadata tags <code className="bg-white px-1.5 py-0.5 rounded text-amber-800 font-mono font-bold border border-amber-200">data_source = DEMO</code> and <code className="bg-white px-1.5 py-0.5 rounded text-amber-800 font-mono font-bold border border-amber-200">data_quality = SIMULATED</code>. The dataset format conforms directly to KSPCB and CPCB Open Data specifications for seamless real-API hot-swapping.
        </p>
      </div>

      {/* Datasets Table */}
      <div className="classy-card rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Available Dataset Files ({datasets.length})
          </h3>
          <span className="text-xs font-mono text-slate-500 font-bold">Format: UTF-8 RFC 4180 CSV</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Dataset Identifier</th>
                  <th className="pb-3 font-mono">Size</th>
                  <th className="pb-3 font-mono">Row Count</th>
                  <th className="pb-3">Provenance Grounding</th>
                  <th className="pb-3">Quality Status</th>
                  <th className="pb-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {datasets.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-mono font-bold text-sky-800 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                      {d.filename}
                    </td>
                    <td className="py-3 font-mono text-slate-700 font-semibold">{d.size_kb} KB</td>
                    <td className="py-3 font-mono text-slate-700 font-semibold">{d.rows.toLocaleString()}</td>
                    <td className="py-3 text-slate-600">{d.data_source}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {d.data_quality}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDownload(d.filename)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-xl text-slate-700 font-bold transition flex items-center gap-1.5 ml-auto text-xs shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" /> CSV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
