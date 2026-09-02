import React, { useState, useEffect, useRef } from 'react';
import { StationData } from '../types';
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
  Info
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

  const [activeLayer, setActiveLayer] = useState<'aqi' | 'pm25' | 'pm10' | 'no2'>('aqi');
  const [showParks, setShowParks] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [timeOffset, setTimeOffset] = useState('Now');
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStationInfo, setSelectedStationInfo] = useState<StationData | null>(null);

  const TIME_STEPS = ['-24h', '-12h', '-6h', '-1h', 'Now', '+6h', '+24h', '+48h', '+7d'];

  // Initialize Leaflet Map with Light CartoDB Tiles (Zoom control moved to top-right to prevent overlap)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.5946],
      zoom: 11,
      zoomControl: false // Custom placement to prevent overlapping search
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Light CartoDB Positron Base Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    heatLayerRef.current = L.layerGroup().addTo(map);
    parksLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

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
      let val = st.aqi;
      if (activeLayer === 'pm25') val = st.pm2_5 * 2.5;
      if (activeLayer === 'pm10') val = st.pm10 * 1.3;
      if (activeLayer === 'no2') val = st.no2 * 3.5;

      const radius = 2200 + (val / 300) * 1800;
      const heatCircle = L.circle([st.latitude, st.longitude], {
        radius: radius,
        color: st.color,
        fillColor: st.color,
        fillOpacity: 0.22,
        weight: 1.5,
        dashArray: '4, 4'
      });
      heatCircle.addTo(heatLayerRef.current!);

      // Light Custom Station Marker Pill
      const customIcon = L.divIcon({
        className: 'custom-aqi-marker',
        html: `
          <div style="
            background: #FFFFFF;
            border: 2px solid ${st.color};
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
            color: #0F172A;
            padding: 4px 9px;
            border-radius: 9999px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${st.color};"></span>
            <span>${st.aqi}</span>
          </div>
        `,
        iconSize: [44, 24],
        iconAnchor: [22, 12]
      });

      const marker = L.marker([st.latitude, st.longitude], { icon: customIcon });

      marker.on('click', () => {
        onSelectStation(st.station_id);
        setSelectedStationInfo(st);
      });

      marker.bindPopup(`
        <div style="min-width: 200px; padding: 4px; color: #0F172A; font-family: 'Plus Jakarta Sans', sans-serif;">
          <h4 style="font-weight: 800; font-size: 14px; margin-bottom: 2px; color: #0F172A;">${st.station_name}</h4>
          <span style="font-size: 11px; color: #64748B;">${st.area || st.zone}</span>
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin: 8px 0; padding: 6px 8px; background: #F1F5F9; border-radius: 10px;">
            <div>
              <span style="font-size: 10px; color: #64748B; text-transform: uppercase; font-weight: bold;">Air Quality</span>
              <div style="font-size: 18px; font-weight: 900; color: ${st.color};">${st.aqi} AQI</div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 10px; color: #64748B; font-weight: bold;">Category</span>
              <div style="font-size: 12px; font-weight: 700; color: #0284C7;">${st.category}</div>
            </div>
          </div>

          <div style="font-size: 11px; color: #334155; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-family: monospace;">
            <div>PM2.5: <b>${st.pm2_5}</b></div>
            <div>PM10: <b>${st.pm10}</b></div>
            <div>NO2: <b>${st.no2}</b></div>
            <div>SO2: <b>${st.so2}</b></div>
          </div>
        </div>
      `);

      marker.addTo(markersLayerRef.current!);
    });

    const activeSt = stations.find(s => s.station_id === selectedStationId);
    if (activeSt && mapInstanceRef.current) {
      setSelectedStationInfo(activeSt);
    }
  }, [stations, activeLayer, selectedStationId]);

  const handleLocateStation = (st: StationData) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([st.latitude, st.longitude], 13, { duration: 1.2 });
      onSelectStation(st.station_id);
      setSelectedStationInfo(st);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Clean Layer Toolbar (Zero Overlap, Zero API Key mention) */}
      <div className="classy-card rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3 border border-slate-200 shadow-sm">
        {/* Layer Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mr-1">
            <Layers className="w-4 h-4 text-sky-600" />
            Pollution Layers:
          </span>
          {[
            { id: 'aqi', label: 'Composite AQI' },
            { id: 'pm25', label: 'PM2.5 Fine Dust' },
            { id: 'pm10', label: 'PM10 Road Dust' },
            { id: 'no2', label: 'NO₂ Vehicle Gas' }
          ].map((lyr) => (
            <button
              key={lyr.id}
              onClick={() => setActiveLayer(lyr.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeLayer === lyr.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {lyr.label}
            </button>
          ))}
        </div>

        {/* Feature Toggles: Urban Forests & Wind Stream */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setShowParks(!showParks)}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition ${
              showParks ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            <Trees className="w-4 h-4 text-emerald-600" /> 🌳 Urban Forests & Parks
          </button>

          <button
            onClick={() => setShowWind(!showWind)}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition ${
              showWind ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold' : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            <Wind className="w-4 h-4 text-sky-600" /> Wind (2.8 m/s WSW)
          </button>
        </div>
      </div>

      {/* Main Map Container & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[680px]">
        {/* Map Canvas (Spacious & Clean, no overlapping floating controls) */}
        <div className="lg:col-span-8 xl:col-span-9 rounded-3xl overflow-hidden classy-card border border-slate-200 relative flex flex-col shadow-sm">
          {/* Top-Right Clean Legend Badge (Never overlaps search or zoom) */}
          <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 text-xs shadow-md hidden sm:flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AQI Scale:</span>
            <div className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-slate-700 text-[11px]">Good</span></div>
            <div className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-lime-500"></span><span className="text-slate-700 text-[11px]">Moderate</span></div>
            <div className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-slate-700 text-[11px]">Unhealthy</span></div>
            <div className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-slate-700 text-[11px]">Poor</span></div>
            <div className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span><span className="text-slate-700 text-[11px]">Severe</span></div>
          </div>

          {/* Leaflet Map DOM */}
          <div ref={mapContainerRef} className="w-full flex-1 z-0" />

          {/* Docked Time Scrubber Bar (Clean bottom placement with zero overlap) */}
          <div className="bg-white border-t border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                Time: <span className="text-sky-700 font-mono font-bold">{timeOffset}</span>
              </span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {TIME_STEPS.map((step) => (
                <button
                  key={step}
                  onClick={() => setTimeOffset(step)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition ${
                    timeOffset === step
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-500 font-mono font-medium hidden md:inline">
              Diurnal Dispersion Simulation
            </span>
          </div>
        </div>

        {/* Sidebar Station & Search Selector */}
        <div className="lg:col-span-4 xl:col-span-3 classy-card rounded-3xl p-4 flex flex-col justify-between overflow-y-auto space-y-4 border border-slate-200 shadow-sm">
          <div className="space-y-3">
            {/* Integrated Search Box in Sidebar (Eliminates map overlay) */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search station or locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-xs font-semibold"
              />
            </div>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              14 CAAQMS Stations & Parks
            </h3>

            <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-1">
              {stations
                .filter(s => s.station_name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.area && s.area.toLowerCase().includes(searchQuery.toLowerCase())))
                .map((st) => (
                  <button
                    key={st.station_id}
                    onClick={() => handleLocateStation(st)}
                    className={`w-full text-left p-2.5 rounded-2xl border flex items-center justify-between text-xs transition ${
                      st.station_id === selectedStationId
                        ? 'bg-sky-50 border-sky-300 text-slate-900 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold block truncate text-slate-900">{st.station_name}</span>
                      <span className="text-[10px] text-slate-500">{st.zone}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-md font-mono font-black text-[11px] shrink-0"
                      style={{ backgroundColor: `${st.color}20`, color: st.color }}
                    >
                      {st.aqi}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Selected Station Telemetry Card */}
          {selectedStationInfo && (
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Selected Node</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {selectedStationInfo.data_quality}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{selectedStationInfo.station_name}</h4>

              <div className="flex items-center justify-between py-1 border-y border-slate-200">
                <span className="text-2xl font-black font-mono" style={{ color: selectedStationInfo.color }}>
                  {selectedStationInfo.aqi} AQI
                </span>
                <span className="text-xs font-bold" style={{ color: selectedStationInfo.color }}>
                  {selectedStationInfo.category}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                <div>PM2.5: <span className="text-slate-900 font-bold">{selectedStationInfo.pm2_5} µg</span></div>
                <div>PM10: <span className="text-slate-900 font-bold">{selectedStationInfo.pm10} µg</span></div>
                <div>NO2: <span className="text-slate-900 font-bold">{selectedStationInfo.no2} µg</span></div>
                <div>SO2: <span className="text-slate-900 font-bold">{selectedStationInfo.so2} µg</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
