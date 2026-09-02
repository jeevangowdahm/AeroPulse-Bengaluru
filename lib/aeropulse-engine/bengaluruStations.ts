import { StationData, WeatherData, AQIStandard } from '@/lib/types/aeropulse';
import { calculateAQIComposite } from './aqiCalculator';

export const BENGALURU_STATIONS_METADATA = [
  {
    station_id: "BLR_ST01",
    station_name: "Silk Board Junction",
    latitude: 12.9176,
    longitude: 77.6238,
    address: "Central Silk Board, Hosur Road, BTM 2nd Stage",
    area: "Silk Board / BTM Layout",
    zone: "South",
    station_type: "CAAQMS",
    environment_type: "Traffic Intersection Chokepoint",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 84.5,
    base_pm10: 168.2,
    base_no2: 68.4,
    base_so2: 14.2,
    base_co: 2.85,
    base_o3: 28.1,
    base_nh3: 36.4
  },
  {
    station_id: "BLR_ST02",
    station_name: "Peenya Industrial Area",
    latitude: 13.0285,
    longitude: 77.5197,
    address: "Peenya 2nd Stage, Industrial Estate",
    area: "Peenya Industrial Area",
    zone: "North-West",
    station_type: "CAAQMS",
    environment_type: "Industrial & Manufacturing Zone",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 92.1,
    base_pm10: 194.5,
    base_no2: 54.2,
    base_so2: 24.8,
    base_co: 2.1,
    base_o3: 32.5,
    base_nh3: 48.2
  },
  {
    station_id: "BLR_ST03",
    station_name: "KR Puram Railway Station",
    latitude: 13.0012,
    longitude: 77.6789,
    address: "Old Madras Road, Near Hanging Bridge",
    area: "KR Puram / Tin Factory",
    zone: "East",
    station_type: "CAAQMS",
    environment_type: "High Density Transit & Highway",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 78.6,
    base_pm10: 156.4,
    base_no2: 62.1,
    base_so2: 12.6,
    base_co: 2.4,
    base_o3: 24.9,
    base_nh3: 31.8
  },
  {
    station_id: "BLR_ST04",
    station_name: "Hebbal Flyover Junction",
    latitude: 13.0358,
    longitude: 77.5970,
    address: "Bellary Road, Outer Ring Road Interchange",
    area: "Hebbal",
    zone: "North",
    station_type: "CAAQMS",
    environment_type: "Airport Corridor Highway",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 72.4,
    base_pm10: 142.1,
    base_no2: 58.7,
    base_so2: 11.2,
    base_co: 1.95,
    base_o3: 34.2,
    base_nh3: 26.5
  },
  {
    station_id: "BLR_ST05",
    station_name: "City Railway Station (Majestic)",
    latitude: 12.9781,
    longitude: 77.5696,
    address: "Gubbi Thotadappa Road, Majestic",
    area: "Majestic / Gandhinagar",
    zone: "Central",
    station_type: "CAAQMS",
    environment_type: "Intercity Bus & Rail Terminal",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 68.2,
    base_pm10: 135.0,
    base_no2: 51.3,
    base_so2: 9.8,
    base_co: 1.8,
    base_o3: 29.4,
    base_nh3: 28.7
  },
  {
    station_id: "BLR_ST06",
    station_name: "Whitefield Export Promotion Park",
    latitude: 12.9698,
    longitude: 77.7499,
    address: "EPIP Zone, Near ITPL Main Road",
    area: "Whitefield / IT Corridor",
    zone: "East",
    station_type: "CAAQMS",
    environment_type: "Tech Park & Metro Construction",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 64.5,
    base_pm10: 128.4,
    base_no2: 44.8,
    base_so2: 8.5,
    base_co: 1.45,
    base_o3: 38.6,
    base_nh3: 22.1
  },
  {
    station_id: "BLR_ST07",
    station_name: "Jayanagar 4th Block",
    latitude: 12.9299,
    longitude: 77.5824,
    address: "Near Jayanagar Shopping Complex",
    area: "Jayanagar",
    zone: "South",
    station_type: "CAAQMS",
    environment_type: "Planned Residential & Commercial",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 42.1,
    base_pm10: 82.5,
    base_no2: 32.4,
    base_so2: 6.2,
    base_co: 0.95,
    base_o3: 31.0,
    base_nh3: 18.4
  },
  {
    station_id: "BLR_ST08",
    station_name: "Koramangala 5th Block",
    latitude: 12.9352,
    longitude: 77.6245,
    address: "100ft Intermediate Ring Road",
    area: "Koramangala",
    zone: "South-East",
    station_type: "CAAQMS",
    environment_type: "Commercial & Cafe District",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 58.4,
    base_pm10: 114.2,
    base_no2: 46.5,
    base_so2: 7.8,
    base_co: 1.35,
    base_o3: 35.8,
    base_nh3: 24.6
  },
  {
    station_id: "BLR_ST09",
    station_name: "BTM Layout 2nd Stage",
    latitude: 12.9165,
    longitude: 77.6101,
    address: "Near Madiwala Lake Eco-Park",
    area: "BTM Layout",
    zone: "South",
    station_type: "CAAQMS",
    environment_type: "Urban Residential near Lake",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 52.8,
    base_pm10: 102.6,
    base_no2: 38.9,
    base_so2: 7.1,
    base_co: 1.15,
    base_o3: 33.2,
    base_nh3: 21.0
  },
  {
    station_id: "BLR_ST10",
    station_name: "Indiranagar 100ft Road",
    latitude: 12.9719,
    longitude: 77.6412,
    address: "12th Main Road, HAL 2nd Stage",
    area: "Indiranagar",
    zone: "East",
    station_type: "CAAQMS",
    environment_type: "Commercial Arterial High-Street",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 56.1,
    base_pm10: 110.5,
    base_no2: 45.2,
    base_so2: 8.0,
    base_co: 1.25,
    base_o3: 36.4,
    base_nh3: 23.5
  },
  {
    station_id: "BLR_ST11",
    station_name: "Electronic City Phase 1",
    latitude: 12.8452,
    longitude: 77.6602,
    address: "Near Infosys Gate 1, Hosur Road",
    area: "Electronic City",
    zone: "South-East",
    station_type: "CAAQMS",
    environment_type: "Elevated Expressway & Tech Hub",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 61.2,
    base_pm10: 120.8,
    base_no2: 42.1,
    base_so2: 9.2,
    base_co: 1.4,
    base_o3: 41.2,
    base_nh3: 25.1
  },
  {
    station_id: "BLR_ST12",
    station_name: "Yelahanka New Town",
    latitude: 13.1007,
    longitude: 77.5963,
    address: "Mother Dairy Circle, Yelahanka",
    area: "Yelahanka",
    zone: "North",
    station_type: "CAAQMS",
    environment_type: "Suburban Open Residential",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 38.5,
    base_pm10: 74.2,
    base_no2: 26.8,
    base_so2: 5.4,
    base_co: 0.75,
    base_o3: 44.5,
    base_nh3: 16.2
  },
  {
    station_id: "BLR_ST13",
    station_name: "Malleshwaram 18th Cross",
    latitude: 13.0068,
    longitude: 77.5684,
    address: "Near Margosa Road & Sankey Tank",
    area: "Malleshwaram",
    zone: "North-West",
    station_type: "CAAQMS",
    environment_type: "Canopy-Rich Heritage Residential",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 36.2,
    base_pm10: 69.8,
    base_no2: 24.5,
    base_so2: 4.8,
    base_co: 0.7,
    base_o3: 39.1,
    base_nh3: 15.0
  },
  {
    station_id: "BLR_ST14",
    station_name: "HSR Layout Sector 1",
    latitude: 12.9116,
    longitude: 77.6389,
    address: "27th Main Road, Near Agara Lake",
    area: "HSR Layout",
    zone: "South-East",
    station_type: "CAAQMS",
    environment_type: "Residential-Tech Buffer Zone",
    status: "ACTIVE",
    data_quality: "SIMULATED",
    data_source: "KSPCB & CSTEP Anchored",
    base_pm25: 54.7,
    base_pm10: 108.4,
    base_no2: 41.0,
    base_so2: 7.5,
    base_co: 1.2,
    base_o3: 37.0,
    base_nh3: 22.8
  }
];

export function getStationDataList(standard: AQIStandard = "NAQI_INDIA"): StationData[] {
  return BENGALURU_STATIONS_METADATA.map((st) => {
    const comp = calculateAQIComposite({
      pm2_5: st.base_pm25,
      pm10: st.base_pm10,
      no2: st.base_no2,
      so2: st.base_so2,
      co: st.base_co,
      o3: st.base_o3,
      nh3: st.base_nh3
    }, standard);

    return {
      station_id: st.station_id,
      station_name: st.station_name,
      latitude: st.latitude,
      longitude: st.longitude,
      address: st.address,
      area: st.area,
      zone: st.zone,
      station_type: st.station_type,
      environment_type: st.environment_type,
      status: st.status,
      data_quality: st.data_quality,
      data_source: st.data_source,
      aqi: comp.aqi,
      category: comp.category,
      primary_pollutant: comp.primary_pollutant,
      color: comp.color,
      badge: comp.badge,
      pm2_5: st.base_pm25,
      pm10: st.base_pm10,
      no2: st.base_no2,
      so2: st.base_so2,
      co: st.base_co,
      o3: st.base_o3,
      nh3: st.base_nh3,
      last_updated: new Date().toISOString()
    };
  });
}

export function getCurrentWeather(): WeatherData {
  return {
    temperature_c: 27.4,
    humidity_pct: 58,
    pressure_hpa: 1013,
    wind_speed_ms: 3.2,
    wind_direction_deg: 245,
    rainfall_mm: 0.0,
    cloud_cover_pct: 35,
    visibility_km: 7.2,
    boundary_layer_height_m: 620
  };
}

export function getStation24hHistory(stationId: string, standard: AQIStandard = "NAQI_INDIA") {
  const st = BENGALURU_STATIONS_METADATA.find(s => s.station_id === stationId) || BENGALURU_STATIONS_METADATA[0];
  const history = [];
  const now = new Date();

  // Hourly diurnal pattern in Bengaluru (peaks at 8 AM - 10 AM, 7 PM - 9 PM)
  const hourMultipliers = [
    1.1, 1.15, 1.2, 1.25, 1.3, 1.4, 1.5, 1.6, 1.45, 1.2,
    0.9, 0.75, 0.7, 0.72, 0.75, 0.82, 0.95, 1.2, 1.45, 1.55,
    1.4, 1.3, 1.2, 1.15
  ];

  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 3600 * 1000);
    const hour = d.getHours();
    const mult = hourMultipliers[hour] || 1.0;
    
    const pm25 = Number((st.base_pm25 * mult).toFixed(1));
    const pm10 = Number((st.base_pm10 * mult).toFixed(1));
    const no2 = Number((st.base_no2 * mult).toFixed(1));
    
    const comp = calculateAQIComposite({
      pm2_5: pm25,
      pm10: pm10,
      no2: no2,
      so2: st.base_so2,
      co: st.base_co,
      o3: st.base_o3,
      nh3: st.base_nh3
    }, standard);

    history.push({
      time: `${String(hour).padStart(2, '0')}:00`,
      timestamp: d.toISOString(),
      aqi: comp.aqi,
      pm2_5: pm25,
      pm10: pm10,
      no2: no2
    });
  }

  return history;
}
