import React, { useState } from 'react';
import { StationData, SavedLocation } from '../types';
import {
  Bookmark,
  Home,
  Briefcase,
  GraduationCap,
  Heart,
  Plus,
  Trash2,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface SavedLocationsViewProps {
  stations: StationData[];
  onSelectStation: (id: string) => void;
}

export const SavedLocationsView: React.FC<SavedLocationsViewProps> = ({
  stations,
  onSelectStation
}) => {
  const [savedPlaces, setSavedPlaces] = useState<SavedLocation[]>([
    { id: '1', label: 'Home (Residence)', name: 'Jayanagar 4th Block', station_id: 'BLR_ST07', type: 'home' },
    { id: '2', label: 'Workplace (Tech Park)', name: 'Whitefield EPIP Zone', station_id: 'BLR_ST05', type: 'work' },
    { id: '3', label: "Children's School", name: 'Indiranagar 100ft Road', station_id: 'BLR_ST06', type: 'school' },
    { id: '4', label: "Parents' House", name: 'Yelahanka New Town', station_id: 'BLR_ST12', type: 'parents' }
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [newStationId, setNewStationId] = useState('BLR_ST01');
  const [newType, setNewType] = useState<'home' | 'work' | 'school' | 'parents' | 'favorite'>('favorite');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const st = stations.find(s => s.station_id === newStationId);
    if (!st || !newLabel.trim()) return;

    const newItem: SavedLocation = {
      id: Date.now().toString(),
      label: newLabel,
      name: st.station_name,
      station_id: st.station_id,
      type: newType
    };

    setSavedPlaces([...savedPlaces, newItem]);
    setNewLabel('');
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    setSavedPlaces(savedPlaces.filter(p => p.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-5 h-5 text-emerald-600" />;
      case 'work': return <Briefcase className="w-5 h-5 text-sky-600" />;
      case 'school': return <GraduationCap className="w-5 h-5 text-purple-600" />;
      case 'parents': return <Heart className="w-5 h-5 text-rose-600" />;
      default: return <Bookmark className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="classy-card rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-700 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4" />
              Personalized Places
            </span>
            <span className="text-[10px] font-mono bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200 font-bold">
              Multi-Point Monitoring
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Saved Locations & Exposure Watchlist
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Monitor live air quality simultaneously across your home, office, school, and family localities in Bengaluru.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add New Place
        </button>
      </div>

      {/* Add Location Modal / Form */}
      {isAdding && (
        <form onSubmit={handleAddLocation} className="classy-card rounded-3xl p-6 border border-sky-300 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900">Add Custom Monitored Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Custom Label (e.g. Gym, Office)</label>
              <input
                type="text"
                placeholder="Location label..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Monitoring Node / Locality</label>
              <select
                value={newStationId}
                onChange={(e) => setNewStationId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-semibold"
              >
                {stations.map(s => (
                  <option key={s.station_id} value={s.station_id}>
                    {s.station_name} ({s.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Place Category</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-semibold"
              >
                <option value="home">Home</option>
                <option value="work">Workplace</option>
                <option value="school">School / College</option>
                <option value="parents">Parents / Family</option>
                <option value="favorite">Favorite Spot</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-sky-600 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Save Place
            </button>
          </div>
        </form>
      )}

      {/* Places Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedPlaces.map((place) => {
          const st = stations.find(s => s.station_id === place.station_id) || stations[0];
          return (
            <div
              key={place.id}
              className="classy-card rounded-3xl p-5 border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm transition classy-card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200">
                    {getIcon(place.type)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{place.label}</span>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-sky-600" />
                      {st.station_name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(place.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Station Metrics */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Air Quality</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono" style={{ color: st.color }}>
                      {st.aqi} AQI
                    </span>
                    <span className="text-xs font-bold" style={{ color: st.color }}>
                      {st.category}
                    </span>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-600 font-medium">
                  <div>PM2.5: <b className="text-slate-900">{st.pm2_5} µg</b></div>
                  <div>PM10: <b className="text-slate-900">{st.pm10} µg</b></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-slate-500 font-mono font-medium">Live Ingestion</span>
                <button
                  onClick={() => onSelectStation(st.station_id)}
                  className="text-sky-700 hover:text-sky-800 font-bold flex items-center gap-1"
                >
                  Inspect Locality <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
