import {
  CityOverview,
  StationData,
  ForecastItem,
  LongTermProjection,
  LifestyleSurveyData,
  ExposureRiskResult,
  EarlyWarning,
  AQIStandard
} from '../types';

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

export async function sendChatMessage(query: string, stationName?: string, currentAqi?: number): Promise<any> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      station_name: stationName || "Silk Board Junction",
      current_aqi: currentAqi || 186
    })
  });
  if (!res.ok) throw new Error('Failed to send chat message');
  return res.json();
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
