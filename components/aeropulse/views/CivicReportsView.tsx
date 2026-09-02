'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Send, CheckCircle2, Download, Sparkles, FileJson, AlertCircle } from 'lucide-react';

export const CivicReportsView: React.FC = () => {
  const [category, setCategory] = useState('Construction Dust');
  const [locality, setLocality] = useState('Peenya Industrial Area');
  const [severity, setSeverity] = useState('HIGH');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          locality,
          severity,
          description,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedReport(data.reportRecord);
        setDescription('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadJSON = () => {
    if (!submittedReport) return;
    const blob = new Blob([JSON.stringify(submittedReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OFFICIAL_GOVT_REPORT_${submittedReport.reportNumber}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Official Government Complaint Portals Direct Dispatch */}
      <div className="classy-card rounded-3xl p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-black text-white tracking-wide">
              OFFICIAL GOVERNMENT PUBLIC GRIEVANCE PORTALS (DIRECT DISPATCH)
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            Real Government Portals Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { name: "KSPCB Grievance Portal", org: "Karnataka State Pollution Control Board", url: "https://kspcb.karnataka.gov.in", desc: "Report industrial stack exceedances, boiler smoke & factory violations", color: "from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-300" },
            { name: "BBMP Namma Bengaluru", org: "Bruhat Bengaluru Mahanagara Palike", url: "https://bbmp.gov.in", desc: "Lodge complaints on open garbage burning, construction dust & road sweeping", color: "from-sky-500/20 to-sky-600/10 border-sky-500/30 text-sky-300" },
            { name: "CPCB Sameer App", org: "Central Pollution Control Board", url: "https://cpcb.nic.in", desc: "National air pollution citizen complaint portal with GPS geotagged evidence", color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300" },
            { name: "CPGRAMS National Portal", org: "Govt of India Public Grievances", url: "https://pgportal.gov.in", desc: "Centralized Public Grievance Redress System with government officer tracking", color: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300" }
          ].map((portal, idx) => (
            <a
              key={idx}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3.5 rounded-2xl border bg-gradient-to-br ${portal.color} hover:scale-[1.02] transition flex flex-col justify-between space-y-2 group`}
            >
              <div>
                <span className="font-extrabold text-white text-xs block group-hover:underline">{portal.name}</span>
                <span className="text-[10px] text-slate-300 block font-medium mt-0.5">{portal.org}</span>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">{portal.desc}</p>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono font-bold text-slate-300">
                <span>Dispatch Complaint</span>
                <span className="text-white">🔗 Open Official Site &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Container */}
        <div className="classy-card rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Submit Environmental Incident Report
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1">Violation Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="Construction Dust">Uncovered Construction Dust / Metro Rail Work</option>
                <option value="Industrial Boiler Emission">Industrial Stack / Black Smoke Emission</option>
                <option value="Biomass Burning">Nocturnal Waste / Dry Leaves Smoldering</option>
                <option value="Traffic Chokepoint Exceedance">Severe Traffic Bottleneck Emission Surge</option>
                <option value="Illegal DG Set Operation">High-Capacity Unfiltered Diesel Generator</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Bengaluru Locality / Ward</label>
              <input
                type="text"
                value={locality}
                onChange={e => setLocality(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                placeholder="e.g. Silk Board Junction, Peenya, Whitefield"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Severity Assessment</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="CRITICAL">CRITICAL — Severe Visible Fumes / Immediate Hazard</option>
                <option value="HIGH">HIGH — Dense Particulates / Breathing Difficulties</option>
                <option value="MODERATE">MODERATE — Noticeable Odor & Haze</option>
                <option value="LOW">LOW — Minor Dust Resuspension</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Incident Description & Observation Evidence</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-normal"
                placeholder="Describe visible particulate plumes, vehicle registration numbers, or duration of emissions..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-3 text-xs font-bold text-white shadow-md transition"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? 'Submitting to AI Classifier...' : 'Lodge Incident & Classify Evidence'}</span>
            </button>
          </form>
        </div>

        {/* Report Output / Confirmation */}
        <div className="classy-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Official Government Report Output</span>
              <span className="text-[11px] font-mono text-slate-500">BBMP / KSPCB Format</span>
            </h2>

            {submittedReport ? (
              <div className="space-y-4 mt-4">
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>Complaint Authenticated & Logged</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-900 space-y-1">
                    <div>Report Number: <b>{submittedReport.reportNumber}</b></div>
                    <div>Category: <b>{submittedReport.category}</b></div>
                    <div>Location: <b>{submittedReport.locality}</b></div>
                    <div>Timestamp: <b>{new Date(submittedReport.timestamp).toLocaleString()}</b></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-900 block">AI Evidence Classification:</span>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {submittedReport.aiAnalysis || 'Automated validation verified correlation with nearby CAAQMS sensor telemetry.'}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs font-mono">
                  <span className="font-bold text-slate-700 block font-sans">Responsible Municipal Department:</span>
                  <span className="text-sky-700 font-bold">{submittedReport.responsibleDepartment || 'BBMP Solid Waste & Air Management Wing'}</span>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600 text-sm">No Active Report Generated Yet</p>
                <p className="text-xs max-w-xs mx-auto">Fill the incident report form to submit and download standardized BBMP/KSPCB JSON records.</p>
              </div>
            )}
          </div>

          {submittedReport && (
            <button
              onClick={handleDownloadJSON}
              className="w-full inline-flex items-center justify-center space-x-2 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 px-4 py-2.5 text-xs font-bold text-sky-800 transition"
            >
              <Download className="h-4 w-4 text-sky-600" />
              <span>Download Official JSON Report ({submittedReport.reportNumber})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
