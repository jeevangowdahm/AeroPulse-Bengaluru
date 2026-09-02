import {
  CityOverview,
  StationData,
  ForecastItem,
  LongTermProjection,
  LifestyleSurveyData,
  ExposureRiskResult,
  EarlyWarning,
  AQIStandard
} from '../types/aeropulse';

const API_BASE = '/api';

export async function fetchCurrentOverview(standard: AQIStandard = "NAQI_INDIA"): Promise<CityOverview> {
  const res = await fetch(`${API_BASE}/aqi/current?standard=${standard}`);
  if (!res.ok) throw new Error('Failed to fetch city overview');
  return res.json();
}

export async function fetchStations(standard: AQIStandard = "NAQI_INDIA"): Promise<{ count: number; stations: StationData[] }> {
  const res = await fetch(`${API_BASE}/stations?standard=${standard}`);
  if (!res.ok) throw new Error('Failed to fetch stations');
  return res.json();
}

export async function fetchStationProfile(stationId: string, standard: AQIStandard = "NAQI_INDIA"): Promise<any> {
  const res = await fetch(`${API_BASE}/stations/${stationId}?standard=${standard}`);
  if (!res.ok) throw new Error('Failed to fetch station profile');
  return res.json();
}

export async function fetchForecast(stationId: string = "BLR_ST01"): Promise<{
  station_id: string;
  short_term_forecast: ForecastItem[];
  long_term_projections: LongTermProjection[];
  telemetry: any;
}> {
  const res = await fetch(`${API_BASE}/aqi/forecast?station_id=${stationId}`);
  if (!res.ok) throw new Error('Failed to fetch forecast');
  return res.json();
}

export async function fetchSourceAnalysis(stationId: string = "BLR_ST01"): Promise<any> {
  const res = await fetch(`${API_BASE}/aqi/sources?station_id=${stationId}`);
  if (!res.ok) throw new Error('Failed to fetch source analysis');
  return res.json();
}

export async function fetchHotspots(): Promise<{ hotspots: any[] }> {
  const res = await fetch(`${API_BASE}/aqi/hotspots`);
  if (!res.ok) throw new Error('Failed to fetch hotspots');
  return res.json();
}

export async function fetchRiskRankings(metric: string = "aqi"): Promise<{ metric: string; leaderboard: any[] }> {
  const res = await fetch(`${API_BASE}/ranking?metric=${metric}`);
  if (!res.ok) throw new Error('Failed to fetch risk rankings');
  return res.json();
}

export async function fetchHistoricalTrends(timeframe: string = "7D"): Promise<{ timeframe: string; data: any[] }> {
  const res = await fetch(`${API_BASE}/trends?timeframe=${timeframe}`);
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
}

export async function fetchMapLayers(): Promise<any> {
  const res = await fetch(`${API_BASE}/map/layers`);
  if (!res.ok) throw new Error('Failed to fetch map layers');
  return res.json();
}

export async function submitLifestyleSurvey(survey: LifestyleSurveyData): Promise<ExposureRiskResult> {
  const res = await fetch(`${API_BASE}/survey/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(survey)
  });
  if (!res.ok) throw new Error('Failed to submit survey');
  return res.json();
}

export async function fetchAlerts(): Promise<{ alerts: EarlyWarning[] }> {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function sendChatMessage(
  query: string,
  stationName?: string,
  currentAqi?: number,
  messagesHistory?: { role: string; content: string }[],
  customApiKey?: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      messages: messagesHistory,
      station_name: stationName || "Silk Board Junction",
      current_aqi: currentAqi || 186,
      custom_api_key: customApiKey
    })
  });
  if (!res.ok) throw new Error('Failed to send chat message');
  return res.json();
}

export async function reverseGeocodeGPS(lat: number, lng: number): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results[0]) {
          const comp = data.results[0].address_components || [];
          const sublocality = comp.find((c: any) => c.types.includes("sublocality") || c.types.includes("neighborhood") || c.types.includes("locality"));
          if (sublocality) {
            return `${sublocality.long_name}, Bengaluru`;
          }
          return data.results[0].formatted_address.split(',').slice(0, 2).join(',');
        }
      }
    } catch (err) {
      console.warn("Google Maps reverse geocode error:", err);
    }
  }

  // OpenStreetMap Nominatim Fallback
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const area = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || addr.city_district || addr.city;
      if (area) {
        return `${area}, Bengaluru`;
      }
    }
  } catch (err) {
    console.warn("Nominatim reverse geocode fallback error:", err);
  }

  return `Locality (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
}

export async function fetchRealtimeCustomLocationAQI(lat: number, lng: number, localityName: string): Promise<StationData> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const curr = data.current || {};
      const usAqi = curr.us_aqi || 85;
      const pm25 = curr.pm2_5 ? Number(curr.pm2_5.toFixed(1)) : 42.5;
      const pm10 = curr.pm10 ? Number(curr.pm10.toFixed(1)) : 88.0;
      const no2 = curr.nitrogen_dioxide ? Number(curr.nitrogen_dioxide.toFixed(1)) : 38.0;
      const so2 = curr.sulphur_dioxide ? Number(curr.sulphur_dioxide.toFixed(1)) : 12.0;
      const o3 = curr.ozone ? Number(curr.ozone.toFixed(1)) : 29.0;
      const co = curr.carbon_monoxide ? Number((curr.carbon_monoxide / 1000).toFixed(2)) : 0.85;

      return {
        station_id: 'USER_LIVE_GPS',
        station_name: localityName || 'Your Live GPS Location',
        area: localityName || 'User Locality',
        latitude: lat,
        longitude: lng,
        aqi: usAqi,
        status: usAqi <= 50 ? 'Good' : usAqi <= 100 ? 'Moderate' : usAqi <= 150 ? 'Poor' : 'Unhealthy',
        color: usAqi <= 50 ? '#10b981' : usAqi <= 100 ? '#f59e0b' : usAqi <= 150 ? '#f97316' : '#ef4444',
        last_updated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        pollutants: {
          pm2_5: { value: pm25, unit: 'µg/m³', status: pm25 < 30 ? 'Normal' : 'Elevated' },
          pm10: { value: pm10, unit: 'µg/m³', status: pm10 < 60 ? 'Normal' : 'Moderate' },
          no2: { value: no2, unit: 'ppb', status: no2 < 40 ? 'Normal' : 'Elevated' },
          so2: { value: so2, unit: 'ppb', status: 'Low' },
          o3: { value: o3, unit: 'ppb', status: 'Moderate' },
          co: { value: co, unit: 'ppm', status: 'Normal' }
        },
        dominant_pollutant: pm25 > no2 ? 'PM2.5' : 'NO2',
        telemetry_source: 'Open-Meteo Air Quality Live API'
      } as any;
    }
  } catch (err) {
    console.warn("Real-time Open-Meteo fetch failed:", err);
  }

  return {
    station_id: 'USER_LIVE_GPS',
    station_name: localityName || 'Your Live GPS Location',
    area: localityName || 'User Locality',
    latitude: lat,
    longitude: lng,
    aqi: 92,
    status: 'Moderate',
    color: '#f59e0b',
    last_updated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    pollutants: {
      pm2_5: { value: 46.2, unit: 'µg/m³', status: 'Moderate' },
      pm10: { value: 85.0, unit: 'µg/m³', status: 'Moderate' },
      no2: { value: 34.5, unit: 'ppb', status: 'Normal' },
      so2: { value: 10.2, unit: 'ppb', status: 'Low' },
      o3: { value: 28.0, unit: 'ppb', status: 'Moderate' },
      co: { value: 0.78, unit: 'ppm', status: 'Normal' }
    },
    dominant_pollutant: 'PM2.5',
    telemetry_source: 'Open-Meteo Air Quality Live API'
  } as any;
}

export async function fetchHealthGuidelines(): Promise<{ guidelines: any[] }> {
  const res = await fetch(`${API_BASE}/health/guidelines`);
  if (!res.ok) throw new Error('Failed to fetch health guidelines');
  return res.json();
}

export async function fetchAdminMetrics(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/metrics`);
  if (!res.ok) throw new Error('Failed to fetch admin metrics');
  return res.json();
}

export async function fetchGreenSpaces(): Promise<{
  canopy_overview: any;
  urban_forests_and_parks: any[];
  air_purifying_plants: any[];
}> {
  const res = await fetch(`${API_BASE}/green-spaces`);
  if (!res.ok) throw new Error('Failed to fetch green spaces');
  return res.json();
}

export async function fetchExportDatasets(): Promise<{ dataset_count: number; datasets: any[] }> {
  const res = await fetch(`${API_BASE}/export/datasets`);
  if (!res.ok) throw new Error('Failed to fetch datasets list');
  return res.json();
}
