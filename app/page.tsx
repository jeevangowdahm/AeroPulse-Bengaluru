'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ViewType, AQIStandard, CityOverview, StationData, ExposureRiskResult } from '@/lib/types/aeropulse';
import { fetchCurrentOverview, fetchStations, fetchStationProfile } from '@/lib/services/aeropulseApi';
import Navbar, { ScenicBg } from '@/components/aeropulse/Navbar';
import { DemoBanner } from '@/components/aeropulse/DemoBanner';

import { DashboardView } from '@/components/aeropulse/views/DashboardView';
import { ForecastView } from '@/components/aeropulse/views/ForecastView';
import { PersonalExposureAdvisorView } from '@/components/aeropulse/views/PersonalExposureAdvisorView';
import { AIAssistantView } from '@/components/aeropulse/views/AIAssistantView';
import { InsightsHubView } from '@/components/aeropulse/views/InsightsHubView';

// Merged Sentinel Views
import { SafeZonesView } from '@/components/aeropulse/views/SafeZonesView';
import { AirAnalyticsView } from '@/components/aeropulse/views/AirAnalyticsView';
import { MedicalIllnessAnalyticsView } from '@/components/aeropulse/views/MedicalIllnessAnalyticsView';
import { TrafficIndustryView } from '@/components/aeropulse/views/TrafficIndustryView';
import { CivicReportsView } from '@/components/aeropulse/views/CivicReportsView';
import { CommandCenterView } from '@/components/aeropulse/views/CommandCenterView';

// Dynamically import Leaflet Map View to prevent SSR window issues
const LiveMapGISView = dynamic(
  () => import('@/components/aeropulse/views/LiveMapGISView').then((mod) => mod.LiveMapGISView),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[600px] classy-card rounded-3xl">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
          <span className="text-sm font-bold text-slate-700">Loading Bengaluru GIS Map...</span>
        </div>
      </div>
    )
  }
);

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [standard, setStandard] = useState<AQIStandard>('NAQI_INDIA');
  const [selectedStationId, setSelectedStationId] = useState<string>('BLR_ST01');
  const [scenicBg, setScenicBg] = useState<ScenicBg>('cubbon'); // Default to Cubbon Park
  const [theme, setTheme] = useState<'default' | 'cyber-emerald'>('default');

  const [overview, setOverview] = useState<CityOverview | null>(null);
  const [stations, setStations] = useState<StationData[]>([]);
  const [stationProfile, setStationProfile] = useState<any | null>(null);
  const [exposureResult, setExposureResult] = useState<ExposureRiskResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Initial Overview and Station List
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        const [ovData, stData] = await Promise.all([
          fetchCurrentOverview(standard),
          fetchStations(standard)
        ]);
        setOverview(ovData);
        setStations(stData.stations);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, [standard]);

  // Auto-refresh telemetry data every 10 minutes (600,000 ms)
  useEffect(() => {
    const TEN_MINUTES_MS = 10 * 60 * 1000;
    const interval = setInterval(async () => {
      console.log("Auto-updating telemetry (10-minute sync)...");
      try {
        const [ovData, stData] = await Promise.all([
          fetchCurrentOverview(standard),
          fetchStations(standard)
        ]);
        setOverview(ovData);
        setStations(prev => {
          const userGpsStation = prev.find(s => s.station_id === 'USER_LIVE_GPS');
          return userGpsStation ? [userGpsStation, ...stData.stations] : stData.stations;
        });
      } catch (err) {
        console.warn("10-minute auto refresh warning:", err);
      }
    }, TEN_MINUTES_MS);

    return () => clearInterval(interval);
  }, [standard]);

  const handleSelectStation = (id: string, customStation?: StationData) => {
    if (customStation) {
      setStations(prev => [customStation, ...prev.filter(s => s.station_id !== 'USER_LIVE_GPS')]);
      setSelectedStationId('USER_LIVE_GPS');
    } else {
      setSelectedStationId(id);
    }
  };

  // Load Station Profile when station changes
  useEffect(() => {
    async function loadProfile() {
      if (selectedStationId === 'USER_LIVE_GPS') return;
      try {
        const prof = await fetchStationProfile(selectedStationId, standard);
        setStationProfile(prof);
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
    }
    loadProfile();
  }, [selectedStationId, standard]);

  const selectedStation = stations.find(s => s.station_id === selectedStationId) || stations[0] || null;

  const isDirectSubTab = ['greenspaces', 'sources', 'rankings', 'trends', 'calendar', 'health', 'alerts', 'saved', 'admin', 'datasets'].includes(currentView);
  const defaultSubTab = isDirectSubTab ? currentView : 'greenspaces';

  const getScenicBgUrl = () => {
    switch (scenicBg) {
      case 'cubbon': return '/images/cubbon_park.jpg';
      case 'vidhana': return '/images/vidhana_soudha.jpg';
      case 'lalbagh': return '/images/lalbagh.jpg';
      default: return '/images/cubbon_park.jpg';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative text-slate-900 selection:bg-emerald-500 selection:text-white ${theme === 'cyber-emerald' ? 'theme-cyber-emerald' : ''}`}>
      {/* 🌟 FULL SCREEN SCENIC BACKGROUND PHOTO OF BENGALURU (CUBBON PARK / VIDHANA SOUDHA / LALBAGH) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url('${getScenicBgUrl()}')` }}
      />
      {/* Subtle Atmospheric Backdrop Overlay for Perfect Legibility */}
      <div className="fixed inset-0 z-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none" />

      {/* Light Demo Disclaimer Banner */}
      <div className="relative z-10">
        <DemoBanner />
      </div>

      {/* Navigation Header with Background Photo Switcher */}
      <div className="sticky top-0 z-50">
        <Navbar
          currentView={currentView}
          onSelectView={setCurrentView}
          stations={stations}
          selectedStationId={selectedStationId}
          onSelectStation={handleSelectStation}
          standard={standard}
          onToggleStandard={setStandard}
          scenicBg={scenicBg}
          onSelectScenicBg={setScenicBg}
          theme={theme}
          onToggleTheme={(t) => setTheme(t)}
          activeAlertCount={overview?.active_warnings_count || 3}
        />
      </div>

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 relative z-10">
        {currentView === 'dashboard' && (
          <DashboardView
            overview={overview}
            selectedStation={selectedStation}
            stationProfile={stationProfile}
            onNavigate={setCurrentView}
            onSelectStation={setSelectedStationId}
          />
        )}

        {currentView === 'map' && (
          <LiveMapGISView
            stations={stations}
            selectedStationId={selectedStationId}
            onSelectStation={setSelectedStationId}
          />
        )}

        {currentView === 'forecast' && (
          <ForecastView
            selectedStationId={selectedStationId}
          />
        )}

        {(currentView === 'exposure' || currentView === 'survey') && (
          <PersonalExposureAdvisorView
            currentAqi={selectedStation?.aqi || 176}
            selectedStationName={selectedStation?.station_name}
            exposureResult={exposureResult}
            onSetExposureResult={setExposureResult}
          />
        )}

        {currentView === 'safezones' && (
          <SafeZonesView />
        )}

        {currentView === 'analytics' && (
          <AirAnalyticsView />
        )}

        {currentView === 'medical' && (
          <MedicalIllnessAnalyticsView />
        )}

        {currentView === 'command' && (
          <CommandCenterView />
        )}

        {currentView === 'traffic' && (
          <TrafficIndustryView />
        )}

        {currentView === 'reports' && (
          <CivicReportsView />
        )}

        {currentView === 'assistant' && (
          <AIAssistantView
            selectedStation={selectedStation}
          />
        )}

        {(currentView === 'insights' || isDirectSubTab) && (
          <InsightsHubView
            stations={stations}
            selectedStationId={selectedStationId}
            onSelectStation={(id) => {
              setSelectedStationId(id);
              setCurrentView('dashboard');
            }}
            defaultSubTab={defaultSubTab}
          />
        )}
      </main>

      {/* Clean Minimalist Glass Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/60 py-6 text-xs text-slate-700 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight">AeroPulse &bull; AQI Sentinel Unified</span>
            <span className="text-slate-500">&copy; 2026 Environmental Intelligence & Risk-Ranking Platform.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <button onClick={() => setCurrentView('safezones')} className="hover:text-slate-900 transition">
              🔍 Safe Zones (O(log N))
            </button>
            <button onClick={() => setCurrentView('analytics')} className="hover:text-slate-900 transition">
              🔬 Analytics Lab (Pearson r)
            </button>
            <button onClick={() => setCurrentView('greenspaces')} className="hover:text-slate-900 transition">
              🌳 Green Canopy & Parks
            </button>
            <button onClick={() => setCurrentView('datasets')} className="hover:text-slate-900 transition">
              15 Datasets Export
            </button>
            <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All Engines Online
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
