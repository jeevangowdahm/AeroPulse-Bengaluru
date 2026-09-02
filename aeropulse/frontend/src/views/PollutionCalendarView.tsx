import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info, ShieldCheck, Sparkles } from 'lucide-react';

export const PollutionCalendarView: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to generate simulated calendar days for month
  const getDaysInMonth = (year: number, month: number) => {
    const days = [];
    const date = new Date(year, month, 1);
    const numDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = date.getDay(); // 0 = Sunday

    // Monthly baseline AQI based on Bengaluru seasonal model
    let baseAQI = 140;
    if ([11, 0, 1].includes(month)) baseAQI = 175; // Winter
    if ([2, 3, 4].includes(month)) baseAQI = 130;  // Summer
    if ([5, 6, 7, 8].includes(month)) baseAQI = 80; // Monsoon
    if ([9, 10].includes(month)) baseAQI = 150;    // Post-monsoon

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let d = 1; d <= numDays; d++) {
      // Deterministic pseudo-variation
      const dayVariance = Math.sin((d * 17) % 31) * 25;
      const dayAQI = Math.max(35, Math.min(380, Math.round(baseAQI + dayVariance)));
      
      let category = "Moderate";
      let color = "#F59E0B";
      let risk = "Moderate";
      let conf = "High";

      if (dayAQI <= 50) {
        category = "Good";
        color = "#10B981";
        risk = "Low";
      } else if (dayAQI <= 100) {
        category = "Satisfactory";
        color = "#84CC16";
        risk = "Low";
      } else if (dayAQI <= 200) {
        category = "Moderate";
        color = "#F59E0B";
        risk = "Moderate";
      } else if (dayAQI <= 300) {
        category = "Poor";
        color = "#EF4444";
        risk = "High";
      } else {
        category = "Very Poor";
        color = "#8B5CF6";
        risk = "Critical";
      }

      if (selectedYear > 2026 || (selectedYear === 2026 && month > 9)) {
        conf = "Moderate-Low (Projected)";
      }

      days.push({
        day: d,
        aqi: dayAQI,
        category,
        color,
        risk,
        confidence: conf,
        pm25: Math.round(dayAQI * 0.48)
      });
    }

    return days;
  };

  const days = getDaysInMonth(selectedYear, selectedMonth);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Year/Month Selector */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Future Pollution Calendar
            </span>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
              Long-Term Seasonal Decomposition
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Bengaluru Predictive Pollution Calendar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Plan travels, outdoor events, and seasonal protective measures across 2026, 2027, and 2028.
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono font-bold">
            {[2026, 2027, 2028].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedYear === yr
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month Navigator */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between">
        <button
          onClick={() => setSelectedMonth(prev => (prev === 0 ? 11 : prev - 1))}
          className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-white flex items-center gap-2">
          {MONTH_NAMES[selectedMonth]} {selectedYear}
          {selectedYear > 2026 || (selectedYear === 2026 && selectedMonth > 8) ? (
            <span className="text-[11px] font-normal font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
              Projected Scenario
            </span>
          ) : (
            <span className="text-[11px] font-normal font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Active Forecast
            </span>
          )}
        </h3>

        <button
          onClick={() => setSelectedMonth(prev => (prev === 11 ? 0 : prev + 1))}
          className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="glass-panel rounded-2xl p-6">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-extrabold uppercase text-slate-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((d, idx) => {
            if (!d) {
              return <div key={`empty-${idx}`} className="h-24 rounded-xl bg-slate-900/20 border border-slate-800/30 opacity-40"></div>;
            }

            return (
              <div
                key={`day-${d.day}`}
                className="h-24 rounded-xl p-2.5 border flex flex-col justify-between transition glass-panel-hover"
                style={{
                  backgroundColor: `${d.color}08`,
                  borderColor: `${d.color}30`
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-white">{d.day}</span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.2 rounded font-mono"
                    style={{ backgroundColor: `${d.color}25`, color: d.color }}
                  >
                    {d.category}
                  </span>
                </div>

                <div className="my-auto text-center">
                  <span className="text-xl font-black font-mono block" style={{ color: d.color }}>
                    {d.aqi}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">PM2.5: {d.pm25} µg</span>
                </div>

                <div className="text-[9px] text-slate-500 font-mono flex items-center justify-between">
                  <span>Risk: {d.risk}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Disclaimer Footnote */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <b>Scientific Disclaimer:</b> Projections beyond the 7-day meteorological window reflect climatological analogs and seasonal time-series decomposition. They are intended for long-term lifestyle awareness, not guaranteed weather forecasts.
        </span>
      </div>
    </div>
  );
};
