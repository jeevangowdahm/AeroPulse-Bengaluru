'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getProcessedBengaluruZones, BengaluruZoneData } from '@/lib/data-providers/bengaluruData';
import { MapPin, Info, Layers, Wind, ShieldAlert, Filter } from 'lucide-react';

const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; color: white; box-shadow: 0 0 12px ${color};">${label}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

interface BengaluruMapProps {
  timeOffsetHour?: number;
  activeLayers?: {
    aqi: boolean;
    traffic: boolean;
    green: boolean;
    industry: boolean;
  };
  selectedLocality?: string;
}

// Sub-component to center map on selected locality
function MapFlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 1.5 });
  }, [lat, lng, map]);
  return null;
}

export const BengaluruMapComponent: React.FC<BengaluruMapProps> = ({
  timeOffsetHour = 0,
  activeLayers = { aqi: true, traffic: true, green: true, industry: true },
  selectedLocality,
}) => {
  const [zones, setZones] = useState<BengaluruZoneData[]>([]);
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [targetCoords, setTargetCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const raw = getProcessedBengaluruZones();
    const shifted = raw.map(z => {
      const factor = Math.sin((timeOffsetHour / 24) * Math.PI * 2) * 0.15;
      const adjustedAQI = Math.max(30, Math.round(z.aqi * (1 + factor)));
      return {
        ...z,
        aqi: adjustedAQI,
      };
    });
    setZones(shifted);
  }, [timeOffsetHour]);

  useEffect(() => {
    if (selectedLocality) {
      const matched = zones.find(z => z.locality.toLowerCase().includes(selectedLocality.toLowerCase()));
      if (matched) {
        setTargetCoords({ lat: matched.latitude, lng: matched.longitude });
      }
    }
  }, [selectedLocality, zones]);

  const getAQIColor = (aqi: number) => {
    if (aqi >= 300) return '#ef4444'; // Red (Critical)
    if (aqi >= 200) return '#f97316'; // Orange (High)
    if (aqi >= 100) return '#f59e0b'; // Amber (Moderate)
    return '#10b981'; // Green (Clean)
  };

  const filteredZones = zones.filter(z => {
    if (riskFilter === 'ALL') return true;
    return z.riskLevel === riskFilter;
  });

  return (
    <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-[var(--border-color)] shadow-2xl">
      {/* Map Risk Level Filter Bar */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center space-x-1.5 rounded-lg bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-color)] p-1.5 text-xs shadow-lg">
        <Filter className="h-4 w-4 text-blue-500 ml-1.5" />
        <span className="font-mono font-semibold text-[var(--text-muted)] mr-1">Risk Filter:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map(level => (
          <button
            key={level}
            onClick={() => setRiskFilter(level)}
            className={`px-2 py-1 rounded font-mono text-[10px] font-bold transition-colors ${
              riskFilter === level
                ? 'bg-blue-600 text-white'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-main)]'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', backgroundColor: '#090d16' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> Dark Matter'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {targetCoords && <MapFlyTo lat={targetCoords.lat} lng={targetCoords.lng} />}

        {filteredZones.map(zone => {
          const color = getAQIColor(zone.aqi);
          const icon = createCustomIcon(color, zone.aqi.toString());

          return (
            <React.Fragment key={zone.stationId}>
              {/* Pollution Fog / Density Ring Layer */}
              {activeLayers.aqi && (
                <Circle
                  center={[zone.latitude, zone.longitude]}
                  radius={zone.aqi * 14}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.25,
                    stroke: true,
                    weight: 1.5,
                  }}
                />
              )}

              {/* Station Marker */}
              <Marker
                position={[zone.latitude, zone.longitude]}
                icon={icon}
              >
                <Popup className="bengaluru-popup">
                  <div className="p-2 text-gray-900 font-sans min-w-[220px]">
                    <div className="font-bold text-sm border-b pb-1 border-gray-200 flex justify-between items-center">
                      <span>{zone.locality}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono">Ward #{zone.wardNumber}</span>
                    </div>
                    <div className="mt-1.5 space-y-1 text-xs">
                      <div>Zone: <strong>{zone.zoneName}</strong></div>
                      <div>AQI: <strong style={{ color }}>{zone.aqi}</strong> ({zone.riskLevel})</div>
                      <div>PM2.5: <strong>{zone.pm25} µg/m³</strong></div>
                      <div>NO2: <strong>{zone.no2} µg/m³</strong></div>
                      <div>Traffic Density: <strong>{zone.trafficDensity}%</strong></div>
                      <div>Green Cover: <strong>{zone.greenCoverPct}%</strong></div>
                      <div className="text-[10px] text-gray-500 mt-1 border-t pt-1">Source: {zone.source}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Map Overlay Badge */}
      <div className="absolute top-4 left-4 z-[1000] rounded-lg bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-color)] p-3 text-xs space-y-1 text-[var(--text-main)] shadow-lg">
        <div className="font-bold flex items-center space-x-1.5">
          <MapPin className="h-4 w-4 text-cyan-400" />
          <span>Bengaluru Environmental Map</span>
        </div>
        <div>Coordinates: 12.9716° N, 77.5946° E</div>
        <div className="text-[10px] text-cyan-500 font-mono font-semibold">
          {filteredZones.length} Localities Rendered ({riskFilter} Risk)
        </div>
      </div>
    </div>
  );
};

export default BengaluruMapComponent;
