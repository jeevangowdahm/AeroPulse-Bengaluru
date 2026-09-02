'use client';

import React, { useState, useEffect } from 'react';
import { ViewType, AQIStandard, StationData } from '@/lib/types/aeropulse';
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
  Image as ImageIcon,
  Activity,
  Flame,
  Truck,
  FileSpreadsheet,
  HeartPulse,
  User as UserIcon,
  Palette
} from 'lucide-react';

import { reverseGeocodeGPS, fetchRealtimeCustomLocationAQI } from '@/lib/services/aeropulseApi';
import { AuthModal } from './AuthModal';
import { User } from '@supabase/supabase-js';

export type ScenicBg = 'cubbon' | 'vidhana' | 'lalbagh';
export type AppTheme = 'default' | 'cyber-emerald';

interface NavbarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  stations: StationData[];
  selectedStationId: string;
  onSelectStation: (id: string, customStation?: StationData) => void;
  standard: AQIStandard;
  onToggleStandard: (std: AQIStandard) => void;
  scenicBg: ScenicBg;
  onSelectScenicBg: (bg: ScenicBg) => void;
  theme?: AppTheme;
  onToggleTheme?: (theme: AppTheme) => void;
  activeAlertCount?: number;
}

export default function Navbar({
  currentView,
  onSelectView,
  stations,
  selectedStationId,
  onSelectStation,
  standard,
  onToggleStandard,
  scenicBg,
  onSelectScenicBg,
  theme = 'default',
  onToggleTheme,
  activeAlertCount = 3
}: NavbarProps) {
  const [isStationOpen, setIsStationOpen] = useState(false);
  const [isBgOpen, setIsBgOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [liveLocationDetected, setLiveLocationDetected] = useState<string | null>(null);

  // Close all popups when view changes
  const closeAllPopups = () => {
    setIsStationOpen(false);
    setIsBgOpen(false);
    setIsMoreOpen(false);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
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
      async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        try {
          const localityName = await reverseGeocodeGPS(userLat, userLon) || `GPS (${userLat.toFixed(2)}, ${userLon.toFixed(2)})`;
          const customStation = await fetchRealtimeCustomLocationAQI(userLat, userLon, localityName);
          onSelectStation('USER_LIVE_GPS', customStation);
          setLiveLocationDetected(localityName);
        } catch (err) {
          console.warn("Exact GPS geocode failed, finding nearest station preset...", err);
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
            setLiveLocationDetected(`${closestStation.station_name}`);
          }
        } finally {
          setIsLocating(false);
        }
      },
      async (error) => {
        console.warn("High accuracy GPS failed, falling back to standard position...", error.message);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const userLat = pos.coords.latitude;
            const userLon = pos.coords.longitude;
            try {
              const localityName = await reverseGeocodeGPS(userLat, userLon) || `GPS (${userLat.toFixed(2)}, ${userLon.toFixed(2)})`;
              const customStation = await fetchRealtimeCustomLocationAQI(userLat, userLon, localityName);
              onSelectStation('USER_LIVE_GPS', customStation);
              setLiveLocationDetected(localityName);
            } catch (err) {
              onSelectStation("BLR_ST01");
              setLiveLocationDetected("Silk Board Junction");
            } finally {
              setIsLocating(false);
            }
          },
          () => {
            onSelectStation("BLR_ST01");
            setLiveLocationDetected("Silk Board Junction");
            setIsLocating(false);
          },
          { timeout: 10000, enableHighAccuracy: false }
        );
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  };

  const filteredStations = stations.filter(s =>
    s.station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.area && s.area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedStation = stations.find(s => s.station_id === selectedStationId) || stations[0];

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Live Air', icon: Wind },
    { id: 'map', label: 'Map', icon: Compass },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'exposure', label: 'Advisor', icon: UserCheck },
    { id: 'assistant', label: 'AeroBot', icon: Bot, isSpecial: true },
    { id: 'medical', label: 'Medical', icon: HeartPulse, isSpecial: true },
    { id: 'insights', label: 'Insights', icon: Layers },
  ];

  const MORE_MODULES = [
    { id: 'medical', label: '🫁 Medical Illness Analytics (Streamlit)', desc: 'Respiratory, asthma & ER hospital visualizations', icon: HeartPulse },
    { id: 'command', label: '⚡ Command Center (Merge Sort)', desc: 'Ranked pollution hotspots & AI diagnostic', icon: Flame },
    { id: 'safezones', label: '🔍 Safe Zones (Binary Search)', desc: 'Find clean air zones with O(log N) lookup', icon: Compass },
    { id: 'analytics', label: '🔬 Air Analytics Lab (Pearson r)', desc: 'Traffic vs NO2 regression & diurnal graphs', icon: Activity },
    { id: 'traffic', label: '🏭 Traffic & Stack Watch (KSPCB)', desc: 'Bottleneck congestion & industrial stack compliance', icon: Truck },
    { id: 'reports', label: '📑 Civic & Govt Reports', desc: 'Submit complaints with AI validation & export JSON', icon: FileSpreadsheet }
  ];

  const BG_OPTIONS: { id: ScenicBg; label: string; icon: string; preview: string }[] = [
    { id: 'cubbon', label: '🌳 Cubbon Park (Your Photo)', icon: '🌳', preview: '/images/cubbon_park.jpg' },
    { id: 'vidhana', label: '🏛️ Vidhana Soudha Palace', icon: '🏛️', preview: '/images/vidhana_soudha.jpg' },
    { id: 'lalbagh', label: '🌺 Lalbagh Botanical Garden', icon: '🌺', preview: '/images/lalbagh.jpg' }
  ];

  return (
    <header className="sticky top-0 z-[1000] bg-white border-b border-slate-200/90 shadow-xs transition-all w-full">
      {/* Click-away backdrop overlay when any popup is open */}
      {(isStationOpen || isBgOpen || isMoreOpen) && (
        <div
          className="fixed inset-0 z-[990] bg-black/10 cursor-pointer"
          onClick={closeAllPopups}
        />
      )}

      <div className="max-w-[1440px] w-full mx-auto px-2 sm:px-3 py-1.5 flex items-center justify-between gap-1 sm:gap-2 relative z-[1001]">
        {/* Brand */}
        <div 
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none group shrink-0" 
          onClick={() => {
            onSelectView('dashboard');
            closeAllPopups();
          }}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-600 p-[2px] shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Wind className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">AeroPulse</span>
              <span className="text-[9px] font-extrabold tracking-wider px-1 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                BLR
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-slate-50 border border-slate-200 p-0.5 rounded-2xl shadow-xs shrink">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'insights' && ['greenspaces', 'sources', 'rankings', 'trends', 'calendar', 'health', 'alerts', 'saved', 'admin', 'datasets'].includes(currentView)) ||
              (item.id === 'exposure' && currentView === 'survey');

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id as ViewType);
                  closeAllPopups();
                }}
                className={`px-1.5 xl:px-2 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : item.isSpecial
                    ? 'text-sky-700 hover:text-slate-900 hover:bg-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.id === 'assistant' && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                )}
              </button>
            );
          })}

          {/* Sentinel Modules Dropdown */}
          <div className="relative z-[999]">
            <button
              onClick={() => {
                setIsMoreOpen(!isMoreOpen);
                setIsBgOpen(false);
                setIsStationOpen(false);
              }}
              className={`px-1.5 xl:px-2 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition ${
                ['command', 'traffic', 'reports'].includes(currentView)
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Modules</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl p-2.5 z-[9999] border border-slate-300 shadow-2xl space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-1 block border-b border-slate-100 mb-1">
                  Sentinel Algorithmic & Civic Tools
                </span>
                {MORE_MODULES.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => {
                      onSelectView(mod.id as ViewType);
                      closeAllPopups();
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 ${
                      currentView === mod.id
                        ? 'bg-slate-900 text-white'
                        : 'hover:bg-slate-100 text-slate-900'
                    }`}
                  >
                    <div className="mt-0.5">
                      <mod.icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="font-bold text-xs block">{mod.label}</span>
                      <span className={`text-[10px] block leading-tight ${currentView === mod.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {mod.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions: Auth + Theme + Station Selector + Photo + GPS */}
        <div className="flex items-center gap-1 shrink-0 z-[999]">
          {/* Supabase User Login / Auth Button */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className={`px-2 py-1 rounded-xl border text-[11px] font-black flex items-center gap-1 transition shadow-sm shrink-0 ${
              authUser
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-gradient-to-r from-emerald-500 to-sky-600 text-white border-sky-400/50 hover:brightness-110'
            }`}
            title="Supabase User Login & Authentication"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span className="inline max-w-[65px] xl:max-w-[90px] truncate">
              {authUser ? authUser.email?.split('@')[0] : 'Sign In'}
            </span>
          </button>

          {/* Theme Switcher Button */}
          {onToggleTheme && (
            <button
              onClick={() => onToggleTheme(theme === 'default' ? 'cyber-emerald' : 'default')}
              className={`p-1 px-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition shadow-xs shrink-0 ${
                theme === 'cyber-emerald'
                  ? 'bg-emerald-600 text-white border-emerald-400 font-black'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle App Visual Theme"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline text-[10px]">{theme === 'cyber-emerald' ? 'Cyber' : 'Theme'}</span>
            </button>
          )}

          {/* Station Selector Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setIsStationOpen(!isStationOpen);
                setIsBgOpen(false);
                setIsMoreOpen(false);
              }}
              className="bg-white/90 hover:bg-white border border-slate-200 rounded-xl px-1.5 py-1 flex items-center gap-1 text-[11px] transition shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="font-bold text-slate-800 max-w-[55px] xl:max-w-[75px] truncate">
                {selectedStation ? selectedStation.station_name : 'Locality'}
              </span>
              {selectedStation && (
                <span
                  className="px-1 py-0.2 rounded text-[9px] font-black font-mono hidden xl:inline"
                  style={{ backgroundColor: `${selectedStation.color}20`, color: selectedStation.color }}
                >
                  {selectedStation.aqi}
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isStationOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 z-[100] border border-slate-200 max-h-80 overflow-y-auto shadow-2xl space-y-1">
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
                        closeAllPopups();
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

          {/* Background Photo Selector */}
          <div className="relative z-[999] shrink-0">
            <button
              onClick={() => {
                setIsBgOpen(!isBgOpen);
                setIsMoreOpen(false);
                setIsStationOpen(false);
              }}
              className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 flex items-center gap-1 text-xs font-bold text-slate-800 shadow-xs transition"
              title="Change Full Page Background Photo"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline text-[11px]">Photo</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isBgOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl p-2.5 z-[9999] border border-slate-300 shadow-2xl space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1 block border-b border-slate-100">
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
            className={`px-2 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition shadow-xs shrink-0 ${
              liveLocationDetected
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white/90 hover:bg-white border-slate-200 text-sky-700'
            }`}
            title="Detect closest Bengaluru CAAQMS station to your live GPS coordinates"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-sky-600' : 'text-emerald-600'}`} />
            <span className="hidden 2xl:inline text-[11px]">
              {isLocating ? 'Locating...' : liveLocationDetected ? 'GPS' : 'GPS'}
            </span>
          </button>

          {/* Standard Toggle Pill */}
          <div className="bg-slate-100/90 border border-slate-200 p-0.5 rounded-xl flex items-center text-[10px] font-bold shrink-0 hidden md:flex">
            <button
              onClick={() => onToggleStandard("NAQI_INDIA")}
              className={`px-1.5 py-0.5 rounded-lg transition ${
                standard === "NAQI_INDIA"
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              NAQI
            </button>
            <button
              onClick={() => onToggleStandard("US_EPA")}
              className={`px-1.5 py-0.5 rounded-lg transition ${
                standard === "US_EPA"
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EPA
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onUserChange={(usr) => setAuthUser(usr)}
      />

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden overflow-x-auto px-4 py-2 border-t border-white/60 flex gap-1 no-scrollbar bg-white/90">
        {NAV_ITEMS.concat([
          { id: 'command', label: 'Command Center', icon: Flame },
          { id: 'traffic', label: 'Traffic & Stack', icon: Truck },
          { id: 'reports', label: 'Civic Reports', icon: FileSpreadsheet }
        ]).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectView(item.id as ViewType);
                closeAllPopups();
              }}
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
