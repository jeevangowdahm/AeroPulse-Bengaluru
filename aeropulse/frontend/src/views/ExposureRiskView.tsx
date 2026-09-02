import React from 'react';
import { ExposureRiskResult, ViewType } from '../types';
import {
  UserCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Compass,
  HeartPulse,
  Info,
  CheckCircle2,
  Bike,
  Home,
  RotateCcw
} from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

interface ExposureRiskViewProps {
  exposureResult: ExposureRiskResult | null;
  onNavigate: (view: ViewType) => void;
}

export const ExposureRiskView: React.FC<ExposureRiskViewProps> = ({
  exposureResult,
  onNavigate
}) => {
  if (!exposureResult) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
        <UserCheck className="w-12 h-12 text-sky-400 mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-white">No Exposure Risk Profile Calculated Yet</h3>
        <p className="text-xs text-slate-400">
          Complete the quick 5-step Lifestyle & Commute Survey to generate your personalized 0–100 Exposure Risk Score.
        </p>
        <button
          onClick={() => onNavigate('survey')}
          className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/25 transition"
        >
          Take Lifestyle Survey
        </button>
      </div>
    );
  }

  const subScoresData = [
    { name: "Outdoor Time", score: exposureResult.sub_scores.outdoor_time_score, max: 25, color: "#38BDF8" },
    { name: "Commute Mode", score: exposureResult.sub_scores.commute_score, max: 25, color: "#F59E0B" },
    { name: "Exercise Timing", score: exposureResult.sub_scores.exercise_score, max: 20, color: "#EC4899" },
    { name: "Arterial Proximity", score: exposureResult.sub_scores.residential_score, max: 15, color: "#8B5CF6" },
    { name: "Indoor Air Filtration", score: exposureResult.sub_scores.indoor_score, max: 15, color: "#10B981" }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Score Hero Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6 border border-sky-500/30">
        <div className="space-y-2 text-center lg:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold font-mono">
            <UserCheck className="w-3.5 h-3.5" />
            Calibrated for Bengaluru Urban Exposure
          </div>
          <h2 className="text-2xl font-black text-white">
            Your Personal Air Exposure Risk Assessment
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {exposureResult.explanation}
          </p>
        </div>

        {/* Large Score Dial Card */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex items-center gap-6 shrink-0 shadow-2xl">
          <div className="text-center">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">
              Exposure Index
            </span>
            <div className="text-5xl font-black font-mono my-1" style={{ color: exposureResult.color }}>
              {exposureResult.personal_exposure_score}
              <span className="text-xl text-slate-500 font-normal">/100</span>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-extrabold inline-block"
              style={{ backgroundColor: `${exposureResult.color}20`, color: exposureResult.color, border: `1px solid ${exposureResult.color}40` }}
            >
              {exposureResult.risk_level} Risk Level
            </span>
          </div>

          <div className="border-l border-slate-800 pl-6 space-y-1 text-xs text-slate-400 hidden sm:block">
            <div className="flex items-center gap-1 text-slate-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Dynamic Lifestyle Factor
            </div>
            <p className="text-[11px] leading-tight">
              Combines commute corridor, outdoor exercise window, and home HEPA filtration against live Bengaluru AQI.
            </p>
            <button
              onClick={() => onNavigate('survey')}
              className="text-[11px] text-sky-400 font-bold hover:underline flex items-center gap-1 mt-2"
            >
              <RotateCcw className="w-3 h-3" /> Retake Survey
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Score Domain Breakdown */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-sky-400" />
              Exposure Domain Breakdown
            </h3>
            <p className="text-xs text-slate-400">Contribution of different lifestyle spheres to your overall score</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Scale: 0 to 100</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {subScoresData.map((d, i) => (
            <div key={i} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2 glass-panel-hover">
              <span className="text-xs font-bold text-slate-300 block truncate">{d.name}</span>
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-2xl font-black" style={{ color: d.color }}>{d.score}</span>
                <span className="text-xs text-slate-500">max {d.max}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(d.score / d.max) * 100}%`, backgroundColor: d.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Personalized Recommendations */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Personalized Exposure Reduction Plan
            </h3>
            <p className="text-xs text-slate-400">Evidence-based actions to cut your daily particulate inhalation burden in Bengaluru</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exposureResult.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5 glass-panel-hover">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider font-mono text-sky-400">
                  {rec.category}
                </span>
                <span className="w-2 h-2 rounded-full bg-sky-400" />
              </div>
              <h4 className="text-sm font-bold text-white">{rec.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{rec.action}</p>
            </div>
          ))}
        </div>

        {/* Footnote Non-Diagnostic Disclaimer */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            {exposureResult.disclaimer}
          </span>
        </div>
      </div>
    </div>
  );
};
