'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StationData } from '@/lib/types/aeropulse';
import { reverseGeocodeGPS, fetchRealtimeCustomLocationAQI } from '@/lib/services/aeropulseApi';
import {
  Layers,
  Wind,
  Clock,
  Play,
  Pause,
  Search,
  MapPin,
  Trees,
  SlidersHorizontal,
  Info,
  Navigation,
  Crosshair,
  Sparkles
} from 'lucide-react';
import L from 'leaflet';

interface LiveMapGISViewProps {
  stations: StationData[];
  selectedStationId: string;
  onSelectStation: (id: string) => void;
}

// Major Bengaluru Urban Forests and Parks Coordinates & Geometry
const BENGALURU_PARKS_GIS = [
  { name: "Cubbon Park", lat: 12.9763, lon: 77.5929, acres: 300, drop: "-28% PM2.5", color: "#059669" },
  { name: "Lalbagh Botanical Garden", lat: 12.9507, lon: 77.5848, acres: 240, drop: "-32% PM2.5", color: "#059669" },
  { name: "Turahalli Reserve Forest", lat: 12.8856, lon: 77.5256, acres: 590, drop: "-42% PM2.5", color: "#047857" },
  { name: "Bannerghatta Forest Buffer", lat: 12.8009, lon: 77.5777, acres: 25000, drop: "-48% PM2.5", color: "#065F46" },
  { name: "GKVK Green Campus", lat: 13.0768, lon: 77.5753, acres: 300, drop: "-35% PM2.5", color: "#059669" },
  { name: "JP Nagar Mini Forest", lat: 12.9081, lon: 77.5956, acres: 32, drop: "-24% PM2.5", color: "#10B981" },
  { name: "Sankey Tank Green Belt", lat: 13.0076, lon: 77.5744, acres: 37.5, drop: "-22% PM2.5", color: "#10B981" },
  { name: "Bugle Rock Park", lat: 12.9427, lon: 77.5681, acres: 16, drop: "-20% PM2.5", color: "#10B981" }
];

export const LiveMapGISView: React.FC<LiveMapGISViewProps> = ({
  stations,
  selectedStationId,
  onSelectStation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.LayerGroup | null>(null);
  const parksLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocationLayerRef = useRef<L.LayerGroup | null>(null);

  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapStyle, setMapStyle] = useState<'hybrid' | 'satellite' | 'roadmap' | 'terrain' | 'dark'>('hybrid');
  const [activeLayer, setActiveLayer] = useState<'aqi' | 'pm25' | 'pm10' | 'no2'>('aqi');
  const [showParks, setShowParks] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [timeOffset, setTimeOffset] = useState('Now');
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestStationInfo, setNearestStationInfo] = useState<{ name: string; distKm: number } | null>(null);
  const [selectedStationInfo, setSelectedStationInfo] = useState<StationData | null>(null);

  const TIME_STEPS = ['-24h', '-12h', '-6h', '-1h', 'Now', '+6h', '+24h', '+48h', '+7d'];

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

  // Initialize Leaflet Map with Google Maps Tile Layers
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.5946],
      zoom: 11,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    tileLayerRef.current = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps Telemetry',
      maxZoom: 20,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    heatLayerRef.current = L.layerGroup().addTo(map);
    parksLayerRef.current = L.layerGroup().addTo(map);
    userLocationLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer on mapStyle change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    let attribution = '&copy; Google Maps';

    switch (mapStyle) {
      case 'satellite':
        tileUrl = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
        break;
      case 'roadmap':
        tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        break;
      case 'terrain':
        tileUrl = 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
        break;
      case 'dark':
        tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        attribution = '&copy; CARTO & OpenStreetMap';
        break;
      case 'hybrid':
      default:
        tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
        break;
    }

    tileLayerRef.current = L.tileLayer(tileUrl, { attribution, maxZoom: 20 }).addTo(mapInstanceRef.current);
  }, [mapStyle]);

  // Handle Live GPS System Location Tracking
  const handleTrackLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setUserCoords({ lat: userLat, lng: userLon });

        if (mapInstanceRef.current && userLocationLayerRef.current) {
          userLocationLayerRef.current.clearLayers();

          // Pulsing user location icon
          const userIcon = L.divIcon({
            className: 'custom-aqi-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
                <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: #0284C7; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="width: 16px; height: 16px; border-radius: 50%; background: #0284C7; border: 3px solid #FFFFFF; box-shadow: 0 0 10px rgba(2, 132, 199, 0.8);"></div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const userMarker = L.marker([userLat, userLon], { icon: userIcon });
          userMarker.bindPopup(`
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
              <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #0284C7;">📍 Your Live GPS Location</h4>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748B;">Lat: ${userLat.toFixed(4)}, Lon: ${userLon.toFixed(4)}</p>
            </div>
          `);

          // Accuracy circle
          const accuracyCircle = L.circle([userLat, userLon], {
            radius: Math.max(position.coords.accuracy, 300),
            color: '#0284C7',
            fillColor: '#0284C7',
            fillOpacity: 0.1,
            weight: 1.5
          });

          userMarker.addTo(userLocationLayerRef.current);
          accuracyCircle.addTo(userLocationLayerRef.current);

          // Pan smoothly to user's location
          mapInstanceRef.current.flyTo([userLat, userLon], 13, { duration: 1.5 });
        }

        // Reverse-geocode exact live GPS locality name and fetch real-time telemetry for user location
        reverseGeocodeGPS(userLat, userLon).then(async (localityName) => {
          const name = localityName || `Live GPS (${userLat.toFixed(2)}, ${userLon.toFixed(2)})`;
          
          let closestStation = stations[0];
          let minDistance = Infinity;

          stations.forEach((st) => {
            const dist = calculateDistance(userLat, userLon, st.latitude, st.longitude);
            if (dist < minDistance) {
              minDistance = dist;
              closestStation = st;
            }
          });

          try {
            const liveCustomStation = await fetchRealtimeCustomLocationAQI(userLat, userLon, name);
            if (liveCustomStation) {
              setSelectedStationInfo({
                ...liveCustomStation,
                station_name: `📍 Live GPS: ${name}`,
                area: `Nearest CAAQMS: ${closestStation?.station_name || 'Bengaluru'} (${minDistance.toFixed(1)} km)`
              });
            } else {
              setSelectedStationInfo(closestStation);
            }
          } catch {
            setSelectedStationInfo(closestStation);
          }

          if (closestStation) {
            setNearestStationInfo({
              name: closestStation.station_name,
              distKm: Number(minDistance.toFixed(1))
            });
          }
          setIsLocating(false);
        }).catch(() => {
          setIsLocating(false);
        });
      },
      (err) => {
        console.warn("Geolocation tracking error:", err);
        // Fallback to Silk Board Central Node
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([12.9176, 77.6238], 13, { duration: 1.2 });
        }
        onSelectStation("BLR_ST01");
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Update Parks Overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !parksLayerRef.current) return;
    parksLayerRef.current.clearLayers();

    if (showParks) {
      BENGALURU_PARKS_GIS.forEach((park) => {
        const radius = Math.min(Math.max(park.acres * 4.5, 400), 2500);
        const circle = L.circle([park.lat, park.lon], {
          radius: radius,
          color: park.color,
          fillColor: park.color,
          fillOpacity: 0.35,
          weight: 2
        });

        circle.bindPopup(`
          <div style="min-width: 190px; padding: 4px; color: #0F172A; font-family: 'Plus Jakarta Sans', sans-serif;">
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
              <span style="font-size: 14px;">🌳</span>
              <h4 style="font-weight: 800; font-size: 13px; margin: 0; color: #065F46;">${park.name}</h4>
            </div>
            <span style="font-size: 11px; color: #64748B;">Natural Urban Lung Space</span>
            
            <div style="margin: 8px 0; padding: 6px 8px; background: #ECFDF5; border-radius: 10px; border: 1px solid #A7F3D0;">
              <div style="font-size: 10px; color: #065F46; font-weight: bold; text-transform: uppercase;">Pollution Drop</div>
              <div style="font-size: 16px; font-weight: 900; color: #047857;">${park.drop}</div>
            </div>
            <div style="font-size: 11px; color: #334155;">Canopy: <b>${park.acres} Acres</b></div>
          </div>
        `);

        circle.addTo(parksLayerRef.current!);
      });
    }
  }, [showParks]);

  // Update Station Markers & AQI Heatmap
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !heatLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    heatLayerRef.current.clearLayers();

    stations.forEach((st) => {
      let metricValue = st.aqi;
      let metricUnit = "AQI";
      if (activeLayer === 'pm25') { metricValue = st.pm2_5; metricUnit = "µg/m³"; }
      if (activeLayer === 'pm10') { metricValue = st.pm10; metricUnit = "µg/m³"; }
      if (activeLayer === 'no2') { metricValue = st.no2; metricUnit = "µg/m³"; }

      // 1. Heat Diffusion Circle
      const heatCircle = L.circle([st.latitude, st.longitude], {
        radius: 2200,
        color: st.color,
        fillColor: st.color,
        fillOpacity: 0.18,
        weight: 0
      });
      heatCircle.addTo(heatLayerRef.current!);

      // 2. Custom Station Pill Marker
      const customIcon = L.divIcon({
        className: 'custom-aqi-marker',
        html: `
          <div style="
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid ${st.color};
            border-radius: 9999px;
            padding: 3px 10px;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
            cursor: pointer;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 800;
            white-space: nowrap;
            transform: translate(-50%, -50%);
          ">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${st.color};"></span>
            <span style="font-size: 11px; color: #0F172A;">${st.station_name.split(' ')[0]}</span>
            <span style="font-size: 11px; font-family: monospace; color: ${st.color};">${metricValue}</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([st.latitude, st.longitude], { icon: customIcon });

      marker.on('click', () => {
        onSelectStation(st.station_id);
        setSelectedStationInfo(st);
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [stations, activeLayer]);

  const filteredStations = stations.filter(s =>
    s.station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.area && s.area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 pb-12">
      {/* Top Map Action & Filter Bar */}
      <div className="classy-card rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Google Maps Base View Style Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 text-white p-1 rounded-2xl border border-slate-800 shadow-md">
          {[
            { id: 'hybrid', label: '🗺️ Hybrid' },
            { id: 'satellite', label: '🛰️ Satellite' },
            { id: 'roadmap', label: '🛣️ Normal' },
            { id: 'terrain', label: '⛰️ Terrain' },
            { id: 'dark', label: '🌙 Dark' },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setMapStyle(style.id as any)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                mapStyle === style.id
                  ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-sm font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Layer Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {[
            { id: 'aqi', label: 'Composite AQI' },
            { id: 'pm25', label: 'PM2.5' },
            { id: 'pm10', label: 'PM10' },
            { id: 'no2', label: 'NO₂' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeLayer === l.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Live GPS Track Button & Overlays Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTrackLiveLocation}
            disabled={isLocating}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition shadow-sm ${
              userCoords
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-sky-600 hover:bg-sky-700 text-white border-transparent'
            }`}
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS...' : userCoords ? 'GPS Located' : 'Locate My Position'}</span>
          </button>

          <button
            onClick={() => setShowParks(!showParks)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              showParks
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            <span>Parks ({showParks ? 'ON' : 'OFF'})</span>
          </button>
        </div>
      </div>

      {/* GPS Location Notification Banner */}
      {nearestStationInfo && (
        <div className="classy-card rounded-2xl p-3 border border-emerald-300 bg-emerald-50/80 flex items-center justify-between text-xs text-emerald-950 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>
              Live GPS locked! Nearest monitoring station: <b>{nearestStationInfo.name}</b> ({nearestStationInfo.distKm} km away).
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 font-bold">CPCB / Open-Meteo Synced</span>
        </div>
      )}

      {/* Map Container */}
      <div className="classy-card rounded-3xl p-2 relative overflow-hidden shadow-lg border border-slate-200">
        <div
          ref={mapContainerRef}
          className="w-full h-[580px] rounded-2xl z-0"
        />

        {/* Floating Station Inspector Card */}
        {selectedStationInfo && (
          <div className="absolute top-4 left-4 z-10 w-80 classy-card rounded-2xl p-4 border border-white/80 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Inspecting Station</span>
                <h4 className="font-bold text-slate-900 text-sm">{selectedStationInfo.station_name}</h4>
                <span className="text-[11px] text-slate-500">{selectedStationInfo.zone} Zone</span>
              </div>
              <button
                onClick={() => setSelectedStationInfo(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                &times;
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span
                className="text-3xl font-black font-mono"
                style={{ color: selectedStationInfo.color }}
              >
                {selectedStationInfo.aqi}
              </span>
              <div>
                <span className="text-xs font-bold block" style={{ color: selectedStationInfo.color }}>
                  {selectedStationInfo.category}
                </span>
                <span className="text-[10px] text-slate-500">Primary: {selectedStationInfo.primary_pollutant}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 text-center text-[11px] font-mono bg-white p-2 rounded-xl border border-slate-100">
              <div>PM2.5: <b>{selectedStationInfo.pm2_5}</b></div>
              <div>PM10: <b>{selectedStationInfo.pm10}</b></div>
              <div>NO2: <b>{selectedStationInfo.no2}</b></div>
            </div>

            <button
              onClick={() => onSelectStation(selectedStationInfo.station_id)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Set as Primary Station
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
