import React, { useState } from 'react';
import { StationData } from '../types';
import { GreenCanopyParksView } from './GreenCanopyParksView';
import { SourceAnalysisView } from './SourceAnalysisView';
import { RiskRankingsView } from './RiskRankingsView';
import { HistoricalTrendsView } from './HistoricalTrendsView';
import { HealthSafetyView } from './HealthSafetyView';
import { EarlyWarningView } from './EarlyWarningView';
import { SavedLocationsView } from './SavedLocationsView';
import { AdminTelemetryView } from './AdminTelemetryView';
import { DataQualityExportView } from './DataQualityExportView';
import {
  Trees,
  SlidersHorizontal,
  Award,
  TrendingUp,
  HeartPulse,
  Bell,
  Bookmark,
  ShieldAlert,
  Database
} from 'lucide-react';

interface InsightsHubViewProps {
  stations: StationData[];
  selectedStationId: string;
  onSelectStation: (id: string) => void;
  defaultSubTab?: string;
}

export const InsightsHubView: React.FC<InsightsHubViewProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  defaultSubTab = 'greenspaces'
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultSubTab);

  const TABS = [
    { id: 'greenspaces', label: '🌳 Green Canopy & Parks', icon: Trees },
    { id: 'sources', label: 'Source Apportionment & XAI', icon: SlidersHorizontal },
    { id: 'rankings', label: 'Risk Rankings', icon: Award },
    { id: 'trends', label: 'Historical Trends', icon: TrendingUp },
    { id: 'health', label: 'Health Guidelines', icon: HeartPulse },
    { id: 'alerts', label: 'Early Warnings', icon: Bell },
    { id: 'saved', label: 'Saved Places', icon: Bookmark },
    { id: 'telemetry', label: 'Admin Telemetry', icon: ShieldAlert },
    { id: 'datasets', label: '15 CSV Datasets & Export', icon: Database }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-Tab Navigation Bar */}
      <div className="classy-card rounded-2xl p-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border border-slate-200 shadow-xs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all duration-200 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab Active Content View */}
      <div>
        {activeTab === 'greenspaces' && (
          <GreenCanopyParksView />
        )}

        {activeTab === 'sources' && (
          <SourceAnalysisView selectedStationId={selectedStationId} />
        )}

        {activeTab === 'rankings' && (
          <RiskRankingsView onSelectStation={onSelectStation} />
        )}

        {activeTab === 'trends' && (
          <HistoricalTrendsView />
        )}

        {activeTab === 'health' && (
          <HealthSafetyView />
        )}

        {activeTab === 'alerts' && (
          <EarlyWarningView stations={stations} />
        )}

        {activeTab === 'saved' && (
          <SavedLocationsView stations={stations} onSelectStation={onSelectStation} />
        )}

        {activeTab === 'telemetry' && (
          <AdminTelemetryView />
        )}

        {activeTab === 'datasets' && (
          <DataQualityExportView />
        )}
      </div>
    </div>
  );
};
