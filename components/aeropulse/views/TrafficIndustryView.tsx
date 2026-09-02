'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Factory, ShieldAlert, AlertTriangle, CheckCircle2, FileText, Send, Sparkles } from 'lucide-react';

export const TrafficIndustryView: React.FC = () => {
  const [trafficData, setTrafficData] = useState<any>(null);
  const [industryData, setIndustryData] = useState<any>(null);
  const [reportSubmitted, setReportSubmitted] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/traffic').then(res => res.json()).then(data => setTrafficData(data)).catch(() => {});
    fetch('/api/industry').then(res => res.json()).then(data => setIndustryData(data)).catch(() => {});
  }, []);

  const handleLaunchComplaint = async (ind: any) => {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Industrial Emission Exceedance',
        locality: ind.area,
        severity: ind.severity,
        description: `Potential stack emission exceedance of ${ind.pollutant} measured at ${ind.measuredValue} ${ind.unit} against KSPCB threshold of ${ind.referenceThreshold} ${ind.unit} at ${ind.industryName}.`,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setReportSubmitted(data.reportNumber);
    }
  };

  const bottlenecks = trafficData?.bottlenecks || [];
  const industries = industryData?.monitoredIndustries || industryData?.emissions || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="classy-card rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="h-6 w-6 text-amber-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              TRAFFIC & INDUSTRIAL EMISSION WATCH
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bengaluru traffic bottlenecks & KSPCB regulatory stack emission compliance telemetry.
          </p>
        </div>
      </div>

        {/* Module A: Traffic Bottlenecks */}
        <div className="classy-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Truck className="h-5 w-5 text-amber-600" />
            <h2 className="font-bold text-slate-900 text-sm tracking-wide">
              MODULE A: ALL BENGALURU TRAFFIC CORRIDORS & BOTTLENECK INTENSITY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { corridor: "Silk Board Junction", congestionIndex: 94, speed: "8 km/h", no2: "112 µg/m³", cause: "Multi-direction vehicle convergence & diesel freight idling", solution: "Reroute heavy trucks via Peripheral Ring Road; sync signal timers" },
              { corridor: "Peenya Industrial Cross", congestionIndex: 88, speed: "12 km/h", no2: "98 µg/m³", cause: "Heavy commercial logistics & unpaved shoulder dust", solution: "Pave road shoulders; deploy mechanical vacuum sweepers twice daily" },
              { corridor: "Whitefield Hope Farm", congestionIndex: 85, speed: "14 km/h", no2: "89 µg/m³", cause: "Metro construction lane restrictions & IT commute rush", solution: "Enforce staggered office shift timings & shuttle transit" },
              { corridor: "Electronic City Flyover Toll", congestionIndex: 82, speed: "16 km/h", no2: "84 µg/m³", cause: "Toll plaza queuing & inter-state freight transport", solution: "Implement FASTag multi-lane barrierless tolling" },
              { corridor: "Hebbal Flyover Junction", congestionIndex: 91, speed: "10 km/h", no2: "105 µg/m³", cause: "Airport corridor traffic merge & intercity buses", solution: "Construct dedicated bus bay bypass & grade separator" },
              { corridor: "Mysore Road Satellite Bus Station", congestionIndex: 87, speed: "11 km/h", no2: "92 µg/m³", cause: "KSRTC bus idling & market entry congestion", solution: "Mandate engine shut-off at terminal bays; enforce no-parking zone" },
              { corridor: "Goraguntepalya Junction", congestionIndex: 93, speed: "9 km/h", no2: "110 µg/m³", cause: "Tumkur road highway freight & metro station drop-offs", solution: "Accelerate grade-separated elevated corridor completion" },
              { corridor: "KR Puram Railway Station", congestionIndex: 89, speed: "11 km/h", no2: "96 µg/m³", cause: "Narrow bottleneck underpass & autorickshaw queuing", solution: "Widen underpass bay & construct dedicated pickup terminal" }
            ].map((btn, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{btn.corridor}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${btn.congestionIndex >= 90 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                    {btn.congestionIndex >= 90 ? 'CRITICAL' : 'HIGH'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 font-mono text-[11px] pt-1">
                  <div><span className="text-slate-400 text-[9px] block">Congestion</span><b>{btn.congestionIndex}%</b></div>
                  <div><span className="text-slate-400 text-[9px] block">Speed</span><b>{btn.speed}</b></div>
                  <div><span className="text-slate-400 text-[9px] block">NO₂</span><b className="text-rose-600">{btn.no2}</b></div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] space-y-1">
                  <div><span className="font-bold text-slate-700">Root Cause:</span> <span className="text-slate-600">{btn.cause}</span></div>
                  <div><span className="font-bold text-emerald-700">Mitigation:</span> <span className="text-emerald-900 font-medium">{btn.solution}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Module B: KSPCB Stack Emission Monitoring */}
      <div className="classy-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Factory className="h-5 w-5 text-sky-600" />
            <h2 className="font-bold text-slate-900 text-sm tracking-wide">
              MODULE B: KSPCB STACK EMISSION & BOILER TELEMETRY
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Standard: NAAQS (2009)</span>
        </div>

        {reportSubmitted && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs text-emerald-900 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>
                Official Citizen Complaint Lodged! Reference Report ID: <b>{reportSubmitted}</b>
              </span>
            </div>
            <button
              onClick={() => setReportSubmitted(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "IND_01", industryName: "Peenya Heavy Metal Casting & Plating Cluster", area: "Peenya Industrial Area (Zone 1)", type: "Metallurgical & Electroplating", pollutant: "SPM & Heavy Metals", measuredValue: "185", unit: "mg/Nm³", referenceThreshold: "115", status: "EXCEEDANCE", cause: "Incomplete combustion in aging furnace boilers & unbagged scrubber exhaust", solution: "Mandate installation of high-efficiency Baghouse Dust Collector & CEMS sensor" },
            { id: "IND_02", industryName: "Electronic City Phase 1 Thermal Captive Plant", area: "Electronic City Phase 1", type: "Captive Power Generation", pollutant: "SO2", measuredValue: "420", unit: "mg/Nm³", referenceThreshold: "350", status: "EXCEEDANCE", cause: "High-sulfur diesel fuel blending during grid power backup cycles", solution: "Transition captive generator fuel to PNG (Piped Natural Gas) grid" },
            { id: "IND_03", industryName: "Whitefield ITPB Industrial Boiler Hub", area: "Whitefield EPIP Zone", type: "Textile & Dyeing Boilers", pollutant: "NOx", measuredValue: "380", unit: "mg/Nm³", referenceThreshold: "300", status: "EXCEEDANCE", cause: "High combustion temperature without Selective Non-Catalytic Reduction (SNCR)", solution: "Retrofit Low-NOx burners & water-cooled furnace walls" },
            { id: "IND_04", industryName: "Jigani Granite Processing & Quarrying Estate", area: "Jigani Industrial Area", type: "Stone Cutting & Mineral Processing", pollutant: "PM10 / Silica Dust", measuredValue: "240", unit: "mg/Nm³", referenceThreshold: "150", status: "EXCEEDANCE", cause: "Dry grinding & uncontained fugitive dust emissions during stone sawing", solution: "Install high-pressure water mist suppression curtains around perimeter" },
            { id: "IND_05", industryName: "Bidadi Auto Manufacturing & Paint Spray Line", area: "Bidadi Industrial Area", type: "Automotive Paint Shop & VOC", pollutant: "VOC / Solvent Vapor", measuredValue: "85", unit: "ppm", referenceThreshold: "50", status: "EXCEEDANCE", cause: "Inadequate thermal oxidizer residence time in paint curing ovens", solution: "Upgrade Regenerative Thermal Oxidizer (RTO) efficiency to 99%" },
            { id: "IND_06", industryName: "Bommasandra Chemical Synthesis Works", area: "Bommasandra Industrial Estate", type: "Bulk Drug & Chemical", pollutant: "SO2 & Organic Vapors", measuredValue: "48", unit: "mg/Nm³", referenceThreshold: "50", status: "COMPLIANT", cause: "Wet alkali scrubber functioning normally", solution: "Maintain weekly sodium hydroxide dosing in scrubber tank" },
            { id: "IND_07", industryName: "Doddaballapur Industrial Textile Dyeing Unit", area: "Doddaballapur Industrial Park", type: "Textile Processing", pollutant: "Particulate Matter", measuredValue: "92", unit: "mg/Nm³", referenceThreshold: "115", status: "COMPLIANT", cause: "Electrostatic precipitator operational", solution: "Scheduled quarterly electrode cleaning and voltage calibration" },
            { id: "IND_08", industryName: "Kumbalgodu Refractory & Clay Kiln Unit", area: "Kumbalgodu Industrial Area", type: "Brick & Ceramic Kilns", pollutant: "SPM", measuredValue: "165", unit: "mg/Nm³", referenceThreshold: "115", status: "EXCEEDANCE", cause: "Traditional clamp kiln design using low-grade coal fuel", solution: "Mandate conversion to Zig-Zag kiln technology or PNG firing" }
          ].map((ind: any) => (
            <div
              key={ind.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition ${
                ind.status === 'EXCEEDANCE'
                  ? 'border-rose-200 bg-rose-50/40'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">{ind.industryName}</h3>
                  <span className="text-[11px] text-slate-500 font-semibold">{ind.area} &bull; {ind.type}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    ind.status === 'EXCEEDANCE'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {ind.status}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Pollutant</span>
                  <span className="font-bold text-slate-800">{ind.pollutant}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Measured</span>
                  <span className={`font-bold ${ind.status === 'EXCEEDANCE' ? 'text-rose-700' : 'text-slate-900'}`}>
                    {ind.measuredValue} {ind.unit}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Limit</span>
                  <span className="font-bold text-slate-600">{ind.referenceThreshold} {ind.unit}</span>
                </div>
              </div>

              <div className="text-[11px] space-y-1 bg-white/70 p-2.5 rounded-xl border border-slate-200">
                <div><span className="font-bold text-slate-700">Root Cause:</span> <span className="text-slate-600">{ind.cause}</span></div>
                <div><span className="font-bold text-emerald-700">Required Solution:</span> <span className="text-emerald-900 font-medium">{ind.solution}</span></div>
              </div>

              {ind.status === 'EXCEEDANCE' ? (
                <button
                  onClick={() => handleLaunchComplaint(ind)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 px-3 py-2 text-xs font-bold text-white shadow-xs transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Lodge Official KSPCB Grievance Report</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold justify-center py-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>NAAQS Compliant & CEMS Verified</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
