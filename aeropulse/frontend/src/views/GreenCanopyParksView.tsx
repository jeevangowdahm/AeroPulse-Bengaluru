import React, { useState, useEffect } from 'react';
import { fetchGreenSpaces } from '../services/api';
import { UrbanPark, PurifyingPlant } from '../types';
import {
  Trees,
  Leaf,
  Flower2,
  Wind,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Droplets,
  Heart,
  TrendingDown,
  Info,
  Image as ImageIcon
} from 'lucide-react';

export const GreenCanopyParksView: React.FC = () => {
  const [canopyOverview, setCanopyOverview] = useState<any>(null);
  const [parks, setParks] = useState<UrbanPark[]>([]);
  const [plants, setPlants] = useState<PurifyingPlant[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'parks' | 'plants'>('parks');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchGreenSpaces();
        setCanopyOverview(data.canopy_overview);
        setParks(data.urban_forests_and_parks);
        setPlants(data.air_purifying_plants);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getParkImage = (name: string) => {
    if (name.toLowerCase().includes('cubbon')) return '/images/cubbon_park.jpg';
    if (name.toLowerCase().includes('lalbagh')) return '/images/lalbagh.jpg';
    return null;
  };

  const filteredParks = selectedZone === 'all'
    ? parks
    : parks.filter(p => p.zone.toLowerCase().includes(selectedZone.toLowerCase()));

  return (
    <div className="space-y-6 pb-12">
      {/* Bengaluru Landmarks & Green Lungs Visual Hero Header */}
      <div className="classy-card rounded-3xl p-6 sm:p-8 border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-emerald-600" />
                Bengaluru Green Canopy & Natural Air Filters
              </span>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                Urban Forest Ecology
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Bengaluru Tree Canopy, Urban Forests & Parks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium leading-relaxed">
              Explore how Bengaluru's botanical gardens, reserve forests, and tree canopy absorb thousands of tons of particulate dust (PM2.5/PM10) and cool the city's microclimate.
            </p>
          </div>

          <div className="bg-white p-1 rounded-2xl flex items-center text-xs font-bold border border-slate-200 shadow-xs shrink-0">
            <button
              onClick={() => setActiveTab('parks')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'parks'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌳 Urban Forests & Parks
            </button>
            <button
              onClick={() => setActiveTab('plants')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'plants'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🪴 Home Air Purifying Plants
            </button>
          </div>
        </div>

        {/* Featured Photo Highlights: Cubbon Park & Vidhana Soudha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* User's Cubbon Park Photo Card */}
          <div className="group relative rounded-3xl overflow-hidden border border-emerald-200 shadow-sm h-48 sm:h-52 bg-slate-900">
            <img
              src="/images/cubbon_park.jpg"
              alt="Cubbon Park Gazebo & Tree Canopy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Central Green Lung &bull; 300 Acres
              </span>
              <h4 className="text-base font-extrabold text-white">Cubbon Park Gazebo & Forest Canopy</h4>
              <p className="text-[11px] text-slate-200 mt-0.5">-28% PM2.5 natural particulate drop</p>
            </div>
          </div>

          {/* Vidhana Soudha Landmark Photo Card */}
          <div className="group relative rounded-3xl overflow-hidden border border-sky-200 shadow-sm h-48 sm:h-52 bg-slate-900">
            <img
              src="/images/vidhana_soudha.jpg"
              alt="Vidhana Soudha Bengaluru"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 font-mono">
                State Legislative Capitol & Gardens
              </span>
              <h4 className="text-base font-extrabold text-white">Vidhana Soudha & Surrounding Lawns</h4>
              <p className="text-[11px] text-slate-200 mt-0.5">Central Bengaluru microclimate buffer</p>
            </div>
          </div>

          {/* Lalbagh Botanical Garden Photo Card */}
          <div className="group relative rounded-3xl overflow-hidden border border-purple-200 shadow-sm h-48 sm:h-52 bg-slate-900 hidden lg:block">
            <img
              src="/images/lalbagh.jpg"
              alt="Lalbagh Botanical Garden Glass House"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 font-mono">
                Botanical Heritage &bull; 240 Acres
              </span>
              <h4 className="text-base font-extrabold text-white">Lalbagh Glass House & Garden</h4>
              <p className="text-[11px] text-slate-200 mt-0.5">-32% PM2.5 natural air cleansing</p>
            </div>
          </div>
        </div>

        {/* Key Canopy KPI Cards */}
        {canopyOverview && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Current Tree Cover</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-mono text-emerald-700">{canopyOverview.current_forest_tree_cover_pct}%</span>
                <span className="text-xs text-slate-400 font-semibold font-mono">of 741 km²</span>
              </div>
              <span className="text-[10px] text-slate-500 block font-medium">Down from 68% in 1973</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">2030 NCAP Target</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-mono text-sky-700">{canopyOverview.target_canopy_pct_2030}%</span>
                <span className="text-xs text-emerald-700 font-bold">+8.2% Goal</span>
              </div>
              <span className="text-[10px] text-slate-500 block font-medium">BBMP Afforestation Plan</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Annual PM2.5 Absorbed</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-mono text-emerald-700">{canopyOverview.annual_pm25_absorbed_tons}</span>
                <span className="text-xs text-slate-500 font-bold font-mono">Tons / Year</span>
              </div>
              <span className="text-[10px] text-slate-500 block font-medium">Dust binding by foliage</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Urban Cooling Buffer</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-mono text-teal-700">{canopyOverview.temperature_cooling_effect_c}°C</span>
                <span className="text-xs text-slate-500 font-bold">Reduction</span>
              </div>
              <span className="text-[10px] text-slate-500 block font-medium">Mitigates urban heat island</span>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'parks' ? (
        /* URBAN FORESTS & PARKS DIRECTORY */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trees className="w-5 h-5 text-emerald-600" />
                Bengaluru Major Urban Forests, Gardens & Green Lung Spaces
              </h3>
              <p className="text-xs text-slate-500">
                Natural botanical buffers that actively filter particulate pollution and provide clean air exercise corridors.
              </p>
            </div>

            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Bengaluru Zones</option>
              <option value="central">Central (Cubbon Park)</option>
              <option value="south">South (Lalbagh / JP Nagar / Bugle Rock)</option>
              <option value="west">South-West (Turahalli Forest)</option>
              <option value="north">North (GKVK / Sankey Tank)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredParks.map((park, idx) => {
              const imgUrl = getParkImage(park.name);
              return (
                <div
                  key={idx}
                  className="classy-card rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm transition classy-card-hover overflow-hidden"
                >
                  {imgUrl && (
                    <div className="h-40 -mx-6 -mt-6 mb-2 overflow-hidden relative">
                      <img
                        src={imgUrl}
                        alt={park.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-emerald-800 font-mono font-black text-xs shadow-sm">
                          -{park.pm25_reduction_pct}% PM2.5
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {park.zone}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-1">{park.name}</h4>
                      </div>

                      {!imgUrl && (
                        <div className="text-right shrink-0">
                          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-mono font-black text-xs block">
                            -{park.pm25_reduction_pct}% PM2.5
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">Local Drop</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
                      {park.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Area & Canopy:</span>
                        <span className="font-bold text-slate-800">{park.area_acres} Acres &bull; ~{park.tree_count.toLocaleString()} Trees</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">CO₂ Absorption:</span>
                        <span className="font-bold text-emerald-700 font-mono">{park.co2_absorption_tons_yr} Tons / Year</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Cleanest Air Window: <b className="text-slate-900">{park.clean_air_window}</b></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">Key Flora: {park.key_species}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* NASA / CPCB RECOMMENDED HOME & BALCONY AIR-PURIFYING PLANTS */
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Flower2 className="w-5 h-5 text-emerald-600" />
              Air-Purifying Plants for Bengaluru Homes & Balconies
            </h3>
            <p className="text-xs text-slate-500">
              NASA Clean Air Study and CPCB verified botanical species that trap airborne particulate matter, absorb volatile toxins, and produce oxygen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plants.map((plant, idx) => (
              <div
                key={idx}
                className="classy-card rounded-3xl p-5 border border-slate-200 flex flex-col justify-between space-y-3.5 shadow-sm transition classy-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {plant.type}
                    </span>
                    <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-lg">
                      ⭐ {plant.efficiency_rating}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{plant.name}</h4>
                  {plant.kannada_name && (
                    <span className="text-[11px] text-slate-500 font-medium block">{plant.kannada_name}</span>
                  )}

                  <div className="mt-2.5 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Target Air Pollutants:
                    </span>
                    <p className="text-xs text-sky-800 font-bold bg-sky-50 p-2 rounded-xl border border-sky-100">
                      {plant.target_pollutants}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                    {plant.benefits}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                  <span>Care: {plant.care_level}</span>
                  <span className="text-emerald-700 font-bold">Natural Bio-Filter</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
