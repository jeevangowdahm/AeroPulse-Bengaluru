'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme, ThemeMode } from './ThemeContext';
import { DataSourceModal } from './DataSourceModal';
import { getProcessedBengaluruZones } from '@/lib/data-providers/bengaluruData';

import {
  ShieldAlert,
  LayoutDashboard,
  MapPin,
  Flame,
  Activity,
  Truck,
  Trees,
  FileSpreadsheet,
  Compass,
  Bot,
  UserCheck,
  Calendar,
  Search,
  Bell,
  Palette,
  Database,
  Menu,
  X,
  ActivitySquare,
  Building2,
  ChevronDown,
  Sun,
  Leaf,
  Cloud,
  Moon
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCitationOpen, setIsCitationOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const zones = getProcessedBengaluruZones();

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const matched = zones.filter(z =>
        z.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        z.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        z.zoneName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(matched);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, zones]);

  const handleSelectSearchResult = (locality: string) => {
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/pollution-map?locality=${encodeURIComponent(locality)}`);
  };

  const navItems = [
    { name: 'Landing', path: '/', icon: ShieldAlert },
    { name: 'Command Center', path: '/command-center', icon: LayoutDashboard },
    { name: 'Pollution Map', path: '/pollution-map', icon: MapPin },
    { name: 'Early Warning', path: '/early-warning', icon: Flame },
    { name: 'Air Analytics Lab', path: '/analytics', icon: Activity },
    { name: 'Traffic & Industry', path: '/traffic-industry', icon: Truck },
    { name: 'Green Bengaluru', path: '/green-bengaluru', icon: Trees },
    { name: 'Civic Reports', path: '/civic-reports', icon: FileSpreadsheet },
    { name: 'Safe Zone Finder', path: '/safe-zones', icon: Compass },
    { name: 'Primus AI', path: '/primus', icon: Bot },
    { name: 'Exposure Survey', path: '/exposure', icon: UserCheck },
    { name: 'Pollution Calendar', path: '/calendar', icon: Calendar },
    { name: 'Govt Intelligence', path: '/government-reports', icon: Building2 },
    { name: 'Data Health', path: '/data-health', icon: ActivitySquare },
  ];

  const themeOptions = [
    { mode: 'day' as ThemeMode, name: 'Clean Modern Day', icon: Sun },
    { mode: 'emerald' as ThemeMode, name: 'Nature Emerald & Mint', icon: Leaf },
    { mode: 'sky' as ThemeMode, name: 'Airy Sky & Marine', icon: Cloud },
    { mode: 'charcoal' as ThemeMode, name: 'Executive Charcoal Dark', icon: Moon },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans flex flex-col transition-colors duration-300">
      {/* Top Header Shell */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md px-4 py-3 shadow-sm">
        <div className="mx-auto flex items-center justify-between">
          {/* Logo & Scope */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 font-bold text-white shadow-lg shadow-blue-500/20">
                AQI
              </div>
              <div>
                <div className="font-bold tracking-wider text-base">AQI SENTINEL</div>
                <div className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase font-semibold">Bengaluru Environmental Operating System</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 text-xs text-emerald-500 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE ● BENGALURU GRID</span>
            </div>
          </div>

          {/* Search Bar with Autocomplete Dropdown */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search 20+ Bengaluru zones (e.g. Silk Board, Whitefield, Yelahanka)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] pl-9 pr-4 py-1.5 text-xs text-[var(--text-main)] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {searchResults.length > 0 && (
              <div className="absolute top-10 left-0 right-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 shadow-2xl z-50 text-xs space-y-1 max-h-60 overflow-y-auto">
                {searchResults.map((res) => (
                  <button
                    key={res.stationId}
                    onClick={() => handleSelectSearchResult(res.locality)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-main)] text-[var(--text-main)] text-left transition-colors"
                  >
                    <div>
                      <div className="font-bold">{res.locality}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">Ward #{res.wardNumber} ({res.zoneName})</div>
                    </div>
                    <span className="font-mono font-bold text-amber-500">AQI {res.aqi}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Controls: Theme Selector Dropdown & Citations */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCitationOpen(true)}
              className="flex items-center space-x-1 rounded-lg border border-blue-500/30 bg-blue-950/20 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-900/30 transition-colors"
            >
              <Database className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Data Sources</span>
            </button>

            {/* 4 Theme Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className="flex items-center space-x-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-1.5 text-xs font-medium text-[var(--text-main)] hover:border-blue-500 transition-colors"
              >
                <Palette className="h-3.5 w-3.5 text-blue-500" />
                <span className="capitalize hidden sm:inline">{theme} Theme</span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              </button>

              {showThemeDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 shadow-2xl z-50 text-xs space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-[var(--text-muted)] border-b border-[var(--border-color)]">
                    Theme Presets
                  </div>
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.mode}
                        onClick={() => {
                          setTheme(opt.mode);
                          setShowThemeDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                          theme === opt.mode
                            ? 'bg-blue-600/20 text-blue-500 font-bold border border-blue-500/30'
                            : 'hover:bg-[var(--bg-main)] text-[var(--text-main)]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{opt.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] p-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-2xl z-50 text-xs">
                  <div className="font-semibold border-b border-[var(--border-color)] pb-2 mb-2 flex items-center justify-between">
                    <span>Early Warning Alerts</span>
                    <span className="text-[10px] text-amber-500 font-mono">2 Active</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded bg-amber-950/20 border border-amber-500/30 p-2 text-amber-500">
                      <div className="font-bold">Peenya Industrial Alert</div>
                      <div>AQI 340 (Critical). High PM10 and SO2 stack emissions detected.</div>
                    </div>
                    <div className="rounded bg-red-950/20 border border-red-500/30 p-2 text-red-500">
                      <div className="font-bold">Silk Board Traffic Bottleneck</div>
                      <div>NO2 concentration elevated at 98 µg/m³. Severe idle congestion.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* DATA COVERAGE INDICATOR BAR */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 px-4 py-1 text-center font-mono text-[11px] text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Bengaluru Coverage: <strong>20 Monitored Localities</strong></span>
          <span>•</span>
          <span>BBMP Wards Monitored: <strong>198 Wards</strong></span>
          <span>•</span>
          <span>Live Telemetry: <strong className="text-emerald-500">100% Operational</strong></span>
          <span>•</span>
          <span>Last Sync: <strong>Just now</strong></span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 px-4 overflow-x-auto scrollbar-none">
        <div className="mx-auto flex space-x-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-500 border border-blue-500/30 shadow-sm'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-500' : 'text-[var(--text-muted)]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Page Canvas */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Data Source Citation Modal */}
      <DataSourceModal
        isOpen={isCitationOpen}
        onClose={() => setIsCitationOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] py-4 px-6 text-center text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-[var(--text-main)]">AQI SENTINEL</span> — Restricted to Bengaluru Municipality Bounds
          </div>
          <div className="font-mono text-[11px]">
            CPCB / KSPCB Telemetry • Open-Meteo Grid • Azure OpenAI • Supabase Realtime
          </div>
        </div>
      </footer>
    </div>
  );
};
