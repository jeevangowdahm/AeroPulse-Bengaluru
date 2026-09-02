import { UrbanPark, PurifyingPlant } from '@/lib/types/aeropulse';

export const BENGALURU_URBAN_PARKS: UrbanPark[] = [
  {
    name: "Cubbon Park (Sri Chamarajendra Park)",
    zone: "Central Zone",
    area_acres: 300,
    tree_count: 6800,
    pm25_reduction_pct: 28.5,
    co2_absorption_tons_yr: 142.0,
    key_species: "Silver Oak, Mahagony, Bamboo Grove, Gulmohar",
    clean_air_window: "05:30 AM – 08:30 AM (Vehicular Traffic Banned)",
    description: "The primary green lung of central Bengaluru, providing substantial aerosol buffering against surrounding arterial corridors."
  },
  {
    name: "Lalbagh Botanical Garden",
    zone: "South Zone",
    area_acres: 240,
    tree_count: 5400,
    pm25_reduction_pct: 32.0,
    co2_absorption_tons_yr: 128.5,
    key_species: "Centuries-old Ficus, Baobab, Tabebuia, Conifers",
    clean_air_window: "06:00 AM – 09:00 AM",
    description: "Centuries-old botanical sanctuary offering massive particulate interception and microclimatic cooling of -2.8°C."
  },
  {
    name: "Turahalli Reserve Forest",
    zone: "South-West Zone",
    area_acres: 590,
    tree_count: 14200,
    pm25_reduction_pct: 42.5,
    co2_absorption_tons_yr: 380.0,
    key_species: "Eucalyptus, Acacia, Indigenous Scrub, Neem",
    clean_air_window: "All Day (Pristine Forest Air)",
    description: "The last surviving natural reserve forest inside Bengaluru BBMP limits, with PM2.5 levels consistently 40% below city average."
  },
  {
    name: "Bannerghatta National Park Buffer",
    zone: "South Perimeter",
    area_acres: 25000,
    tree_count: 120000,
    pm25_reduction_pct: 48.0,
    co2_absorption_tons_yr: 2400.0,
    key_species: "Teak, Sandalwood, Bamboo, Deciduous Canopy",
    clean_air_window: "All Day",
    description: "Massive biological buffer on the southern edge of Bengaluru providing vital regional airshed purification."
  },
  {
    name: "GKVK University Green Campus",
    zone: "North Zone",
    area_acres: 300,
    tree_count: 8500,
    pm25_reduction_pct: 35.0,
    co2_absorption_tons_yr: 165.0,
    key_species: "Indigenous Agro-forestry, Tamarind, Banyan",
    clean_air_window: "06:00 AM – 09:30 AM",
    description: "Agricultural university campus providing northern Bengaluru with critical green density and low particulate counts."
  },
  {
    name: "JP Nagar Mini Forest (Doresanipalya)",
    zone: "South Zone",
    area_acres: 32,
    tree_count: 1800,
    pm25_reduction_pct: 24.0,
    co2_absorption_tons_yr: 36.0,
    key_species: "Teak Plantation, Medicinal Forest, Native Shrubs",
    clean_air_window: "06:00 AM – 08:30 AM",
    description: "Dense urban pocket forest in JP Nagar with rich birdlife and effective localized dust dampening."
  },
  {
    name: "Sankey Tank Green Belt",
    zone: "North-West Zone",
    area_acres: 37.5,
    tree_count: 1200,
    pm25_reduction_pct: 22.0,
    co2_absorption_tons_yr: 28.0,
    key_species: "Mayflower, Honge, Peepal, Rain Trees",
    clean_air_window: "05:30 AM – 08:30 AM",
    description: "Water body and botanical promenade in Malleshwaram acting as a micro-oasis for morning walkers."
  },
  {
    name: "Bugle Rock Park & Basavanagudi Greenery",
    zone: "South Zone",
    area_acres: 16,
    tree_count: 750,
    pm25_reduction_pct: 20.0,
    co2_absorption_tons_yr: 18.0,
    key_species: "Native Ficus, Peepal, Bougainvillea, Cassia",
    clean_air_window: "06:00 AM – 09:00 AM",
    description: "Historic heritage park built on 3,000-million-year-old rock formations with dense tree shade."
  }
];

export const AIR_PURIFYING_PLANTS: PurifyingPlant[] = [
  {
    name: "Snake Plant / Mother-in-Law's Tongue (Sansevieria trifasciata)",
    kannada_name: "ಸರ್ಪ ಗಿಡ (Sarpa Gida)",
    type: "Indoor / Bedroom Specialist",
    target_pollutants: "Formaldehyde, Benzene, Trichloroethylene, Xylene, NO2",
    benefits: "One of the few plants that releases pure Oxygen at night (CAM photosynthesis). Ideal for bedrooms.",
    care_level: "Ultra-Low (Water once in 2 weeks)",
    efficiency_rating: "9.5 / 10"
  },
  {
    name: "Areca Palm (Dypsis lutescens)",
    kannada_name: "ಅಡಿಕೆ ತಾಳೆ (Adike Taale)",
    type: "Living Room / High-Volume Filter",
    target_pollutants: "Toluene, Xylene, Formaldehyde, Fine Respirable Silt",
    benefits: "High transpiration rate; acts as a natural humidifier and large-surface particulate filter.",
    care_level: "Medium (Filtered sunlight, regular watering)",
    efficiency_rating: "9.2 / 10"
  },
  {
    name: "Money Plant / Golden Pothos (Epipremnum aureum)",
    kannada_name: "ಮನಿ ಪ್ಲಾಂಟ್ (Money Plant)",
    type: "Balcony / Indoor All-Rounder",
    target_pollutants: "Carbon Monoxide (CO), Benzene, Formaldehyde, VOCs",
    benefits: "Extremely resilient Bengaluru climate survivor that absorbs VOCs emitted by synthetic furniture and paint.",
    care_level: "Low (Grows in water or soil, indirect light)",
    efficiency_rating: "8.8 / 10"
  },
  {
    name: "Tulsi / Holy Basil (Ocimum tenuiflorum)",
    kannada_name: "ಶ್ರೀ ತುಳಸಿ (Shree Tulasi)",
    type: "Balcony / Courtyard Bio-Shield",
    target_pollutants: "Carbon Dioxide, Sulfur Oxides, Airborne Bacteria",
    benefits: "Releases oxygen for 20 hours daily; rich in phytochemical eugenol with anti-microbial air-purification properties.",
    care_level: "Medium (Daily sunlight, moist soil)",
    efficiency_rating: "9.0 / 10"
  },
  {
    name: "Neem Plant (Azadirachta indica)",
    kannada_name: "ಬೇವಿನ ಮರ (Bevina Mara)",
    type: "Terrace / Outdoor Buffer",
    target_pollutants: "SO2, NO2, Suspended Particulate Matter (SPM)",
    benefits: "The quintessential Indian bio-filter. Heavy foliage intercepts vehicular dust and cleans ambient roadside air.",
    care_level: "Low (Full sun, drought tolerant)",
    efficiency_rating: "9.6 / 10"
  },
  {
    name: "Spider Plant (Chlorophytum comosum)",
    kannada_name: "ಸ್ಪೈಡರ್ ಪ್ಲಾಂಟ್ (Spider Plant)",
    type: "Work Desk / Bedroom",
    target_pollutants: "Carbon Monoxide, Xylene, Formaldehyde",
    benefits: "Safe for pets and children. NASA clean air study ranked it top for removing 95% of toxic formaldehyde.",
    care_level: "Low (Indirect light, water weekly)",
    efficiency_rating: "8.7 / 10"
  },
  {
    name: "Peace Lily (Spathiphyllum)",
    kannada_name: "ಶಾಂತಿ ಲಿಲ್ಲಿ (Shanthi Lily)",
    type: "Indoor Bathrooms / Hallways",
    target_pollutants: "Ammonia (NH3), Acetone, Benzene, Trichloroethylene",
    benefits: "Glossy deep-green leaves break down mold spores and indoor ammonia fumes.",
    care_level: "Medium (Low light, keep soil moist)",
    efficiency_rating: "8.9 / 10"
  },
  {
    name: "Rubber Plant (Ficus elastica)",
    kannada_name: "ರಬ್ಬರ್ ಗಿಡ (Rubber Gida)",
    type: "Indoor Large Foliage",
    target_pollutants: "Formaldehyde, Surface Dust Interception",
    benefits: "Broad, waxy leaves capture airborne dust and eliminate bacteria/mold spores in indoor air.",
    care_level: "Low-Medium (Bright indirect light)",
    efficiency_rating: "8.6 / 10"
  }
];

export function getGreenSpacesOverview() {
  return {
    canopy_overview: {
      bengaluru_total_tree_canopy_pct: 6.8,
      bbmp_target_canopy_pct: 15.0,
      annual_carbon_sequestration_tons: 34200,
      pm25_canopy_absorption_tons: 840,
      top_canopy_wards: ["Malleshwaram", "Jayanagar", "Basavanagudi", "Sadashivanagar"],
      lowest_canopy_wards: ["Peenya Industrial", "Silk Board Chokepoint", "KR Puram Transit Hub", "Mahadevapura IT Corridor"]
    },
    urban_forests_and_parks: BENGALURU_URBAN_PARKS,
    air_purifying_plants: AIR_PURIFYING_PLANTS
  };
}
