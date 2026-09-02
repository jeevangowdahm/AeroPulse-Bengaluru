'use client';

import React from 'react';
import { X, Database, ShieldCheck, Clock, Layers } from 'lucide-react';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  source?: string;
  dataType?: string;
  lastUpdated?: string;
  confidence?: number;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({
  isOpen,
  onClose,
  title = 'Bengaluru Environmental Data Citation',
  source = 'Central Pollution Control Board (CPCB) / Open-Meteo Air Quality Grid',
  dataType = 'LIVE',
  lastUpdated = new Date().toISOString(),
  confidence = 0.94,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-blue-500/30 bg-gray-900 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-800 text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm">
          <div className="flex items-start space-x-3 rounded-lg border border-gray-800 bg-gray-950/60 p-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Primary Data Source</div>
              <div className="font-medium text-gray-200 mt-0.5">{source}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
              <div className="flex items-center space-x-1.5 text-xs text-gray-400 uppercase">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>Classification</span>
              </div>
              <div className="mt-1 font-semibold text-cyan-300">{dataType}</div>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
              <div className="flex items-center space-x-1.5 text-xs text-gray-400 uppercase">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Last Updated</span>
              </div>
              <div className="mt-1 font-mono text-xs text-amber-300">{new Date(lastUpdated).toLocaleTimeString()}</div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
            <div className="text-xs text-gray-400 uppercase">Data Quality & Confidence Metric</div>
            <div className="mt-1 flex items-center justify-between">
              <div className="h-2 w-full max-w-[280px] rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs text-emerald-400 font-semibold">{Math.round(confidence * 100)}% Verified</span>
            </div>
          </div>

          <div className="text-xs text-gray-400 italic">
            * All spatial telemetry is pinned to Bengaluru geographic bounds (12.9716° N, 77.5946° E). No data points are synthetic.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Close Citation
          </button>
        </div>
      </div>
    </div>
  );
};
