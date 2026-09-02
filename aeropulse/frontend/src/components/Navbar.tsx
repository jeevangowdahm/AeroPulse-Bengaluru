import React, { useState } from 'react';
import { ViewType, AQIStandard, StationData } from '../types';
import {
  Wind,
  MapPin,
  Compass,
  TrendingUp,
  UserCheck,
  Bot,
  Layers,
  Search,
  ChevronDown,
  Navigation,
  Image as ImageIcon
} from 'lucide-react';

export type ScenicBg = 'cubbon' | 'vidhana' | 'lalbagh';

interface NavbarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  stations: StationData[];
  selectedStationId: string;
  onSelectStation: (id: string) => void;
  standard: AQIStandard;
  onToggleStandard: (std: AQIStandard) => void;
  scenicBg: ScenicBg;
  onSelectScenicBg: (bg: ScenicBg) => void;
  activeAlertCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  stations,
  selectedStationId,
  onSelectStation,
  standard,
  onToggleStandard,
  scenicBg,
  onSelectScenicBg
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isStationOpen, setIsStationOpen] = useState(false);
  const [isBgOpen, setIsBgOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [liveLocationDetected, setLiveLocationDetected] = useState<string | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        let closestStation = stations[0];
        let minDistance = Infinity;

        stations.forEach((st) => {
          const dist = calculateDistance(userLat, userLon, st.latitude, st.longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closestStation = st;
          }
        });

        if (closestStation) {
          onSelectStation(closestStation.station_id);
          setLiveLocationDetected(`${closestStation.station_name} (${minDistance.toFixed(1)} km away)`);
        }
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation fallback:", error.message);
        onSelectStation("BLR_ST01");
        setLiveLocationDetected("Silk Board Central Node");
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const filteredStations = stations.filter(s =>
    s.station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.area && s.area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedStation = stations.find(s => s.station_id === selectedStationId) || stations[0];

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Live Air', icon: Wind },
    { id: 'map', label: 'Pollution Map', icon: Compass },
    { id: 'forecast', label: 'Forecasts', icon: TrendingUp },
    { id: 'exposure', label: 'Personal Advisor', icon: UserCheck },
    { id: 'assistant', label: 'AeroBot AI', icon: Bot, isSpecial: true },
    { id: 'insights', label: 'Insights & Hub', icon: Layers },
  ];

  const BG_OPTIONS: { id: ScenicBg; label: string; icon: string; preview: string }[] = [
    { id: 'cubbon', label: '🌳 Cubbon Park (Your Photo)', icon: '🌳', preview: '/images/cubbon_park.jpg' },
    { id: 'vidhana', label: '🏛️ Vidhana Soudha Palace', icon: '🏛️', preview: '/images/vidhana_soudha.jpg' },
    { id: 'lalbagh', label: '🌺 Lalbagh Botanical Garden', icon: '🌺', preview: '/images/lalbagh.jpg' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => onSelectView('dashboard')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-600 p-[2px] shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Wind className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">AeroPulse</span>
              <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Bengaluru
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Live Air Quality & Green Defense</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md border border-slate-200/80 p-1 rounded-2xl shadow-xs">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'insights' && ['greenspaces', 'sources', 'rankings', 'trends', 'calendar', 'health', 'alerts', 'saved', 'admin', 'datasets'].includes(currentView)) ||
              (item.id === 'exposure' && currentView === 'survey');

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id as ViewType)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : item.isSpecial
                    ? 'text-sky-700 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.id === 'assistant' && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Full Background Photo Selector + GPS Location + Station Selector */}
        <div className="flex items-center gap-2">
          {/* Full Screen Scenic Background Photo Selector */}
          <div className="relative">
            <button
              onClick={() => setIsBgOpen(!isBgOpen)}
              className="bg-white/90 hover:bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-800 shadow-sm transition"
              title="Change Full Page Background Photo"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Background Photo</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isBgOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl p-2 z-50 border border-slate-200 shadow-xl space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1 block">
                  Full Page Scenic Backdrop
                </span>
                {BG_OPTIONS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      onSelectScenicBg(bg.id);
                      setIsBgOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 text-xs font-bold transition ${
                      scenicBg === bg.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      <img src={bg.preview} alt={bg.label} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate pr-1">
                      <span className="block truncate">{bg.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live GPS Location Detect Button */}
          <button
            onClick={handleDetectLiveLocation}
            disabled={isLocating}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
              liveLocationDetected
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white/90 hover:bg-white border-slate-200 text-sky-700'
            }`}
            title="Detect closest Bengaluru CAAQMS station to your live GPS coordinates"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-sky-600' : 'text-emerald-600'}`} />
            <span className="hidden xl:inline">
              {isLocating ? 'Locating...' : liveLocationDetected ? 'Live GPS Active' : 'Live GPS'}
            </span>
          </button>

          {/* Station Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsStationOpen(!isStationOpen)}
              className="bg-white/90 hover:bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-xs transition shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="font-bold text-slate-800 max-w-[100px] sm:max-w-[130px] truncate">
                {selectedStation ? selectedStation.station_name : 'Select Locality'}
              </span>
              {selectedStation && (
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-black font-mono"
                  style={{ backgroundColor: `${selectedStation.color}20`, color: selectedStation.color }}
                >
                  {selectedStation.aqi}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isStationOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl p-2.5 z-50 border border-slate-200 max-h-80 overflow-y-auto shadow-xl">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Bengaluru locality..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  {filteredStations.map((st) => (
                    <button
                      key={st.station_id}
                      onClick={() => {
                        onSelectStation(st.station_id);
                        setLiveLocationDetected(null);
                        setIsStationOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition ${
                        st.station_id === selectedStationId
                          ? 'bg-sky-50 border border-sky-200 text-sky-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold block truncate text-slate-900">{st.station_name}</span>
                        <span className="text-[10px] text-slate-500">{st.zone}</span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded font-mono font-bold text-[10px]"
                        style={{ backgroundColor: `${st.color}20`, color: st.color }}
                      >
                        {st.aqi}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Standard Toggle Pill */}
          <div className="bg-slate-100/90 border border-slate-200 p-0.5 rounded-xl flex items-center text-[11px] font-bold">
            <button
              onClick={() => onToggleStandard("NAQI_INDIA")}
              className={`px-2.5 py-1 rounded-lg transition ${
                standard === "NAQI_INDIA"
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              NAQI
            </button>
            <button
              onClick={() => onToggleStandard("US_EPA")}
              className={`px-2.5 py-1 rounded-lg transition ${
                standard === "US_EPA"
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EPA
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="md:hidden overflow-x-auto px-4 py-2 border-t border-white/60 flex gap-1 no-scrollbar bg-white/90">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id as ViewType)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-slate-500" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
