import React, { useState, useEffect } from 'react';
import { ViewType, AQIStandard, CityOverview, StationData, ExposureRiskResult } from './types';
import { fetchCurrentOverview, fetchStations, fetchStationProfile } from './services/api';
import { Navbar, ScenicBg } from './components/Navbar';
import { DemoBanner } from './components/DemoBanner';

import { DashboardView } from './views/DashboardView';
import { LiveMapGISView } from './views/LiveMapGISView';
import { ForecastView } from './views/ForecastView';
import { PersonalExposureAdvisorView } from './views/PersonalExposureAdvisorView';
import { AIAssistantView } from './views/AIAssistantView';
import { InsightsHubView } from './views/InsightsHubView';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [standard, setStandard] = useState<AQIStandard>('NAQI_INDIA');
  const [selectedStationId, setSelectedStationId] = useState<string>('BLR_ST01');
  const [scenicBg, setScenicBg] = useState<ScenicBg>('cubbon'); // Default to Cubbon Park (User's Photo) for the whole page!

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

  // Load Station Profile when station changes
  useEffect(() => {
    async function loadProfile() {
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
    <div className="min-h-screen flex flex-col relative text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* 🌟 FULL SCREEN SCENIC BACKGROUND PHOTO OF BENGALURU (CUBBON PARK / VIDHANA SOUDHA) */}
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
      <div className="relative z-10">
        <Navbar
          currentView={currentView}
          onSelectView={setCurrentView}
          stations={stations}
          selectedStationId={selectedStationId}
          onSelectStation={setSelectedStationId}
          standard={standard}
          onToggleStandard={setStandard}
          scenicBg={scenicBg}
          onSelectScenicBg={setScenicBg}
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
            <span className="font-extrabold text-slate-900 tracking-tight">AeroPulse Bengaluru</span>
            <span className="text-slate-500">&copy; 2026 Environmental Intelligence Platform.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <button onClick={() => setCurrentView('insights')} className="hover:text-slate-900 transition">
              🌳 Green Canopy & Parks
            </button>
            <button onClick={() => setCurrentView('insights')} className="hover:text-slate-900 transition">
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
};

export default App;
