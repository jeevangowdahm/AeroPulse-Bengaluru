export type AQIStandard = "NAQI_INDIA" | "US_EPA";

export type ViewType =
  | "dashboard"
  | "map"
  | "forecast"
  | "exposure"
  | "assistant"
  | "insights"
  // Sentinel Merged Views:
  | "command"
  | "safezones"
  | "analytics"
  | "medical"
  | "traffic"
  | "reports"
  // Subtab aliases:
  | "greenspaces"
  | "sources"
  | "hotspots"
  | "rankings"
  | "trends"
  | "calendar"
  | "survey"
  | "health"
  | "alerts"
  | "saved"
  | "admin"
  | "datasets";

export interface Pollutants {
  pm2_5: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  nh3: number;
}

export interface WeatherData {
  temperature_c: number;
  humidity_pct: number;
  pressure_hpa: number;
  wind_speed_ms: number;
  wind_direction_deg: number;
  rainfall_mm: number;
  cloud_cover_pct: number;
  visibility_km: number;
  boundary_layer_height_m: number;
}

export interface StationData {
  station_id: string;
  station_name: string;
  latitude: number;
  longitude: number;
  address?: string;
  area?: string;
  zone?: string;
  station_type?: string;
  environment_type?: string;
  status: string;
  data_quality: string;
  data_source: string;
  aqi: number;
  category: string;
  primary_pollutant: string;
  color: string;
  badge: string;
  pm2_5: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  nh3: number;
  last_updated?: string;
}

export interface CityOverview {
  city: string;
  region: string;
  timestamp: string;
  aqi_standard: AQIStandard;
  city_composite: {
    aqi: number;
    category: string;
    primary_pollutant: string;
    color: string;
    badge: string;
    pollutants: Pollutants;
    sub_indices: Record<string, number>;
  };
  primary_station: StationData;
  weather: WeatherData;
  active_warnings_count: number;
  demo_banner: string;
}

export interface ForecastItem {
  target_timestamp: string;
  horizon_label: string;
  horizon_hours: number;
  predicted_aqi: number;
  lower_bound: number;
  upper_bound: number;
  category: string;
  color: string;
  primary_pollutant: string;
  predicted_pm25: number;
  predicted_pm10: number;
  confidence_level: string;
  confidence_score: number;
  explanation: string;
  model_version: string;
}

export interface LongTermProjection {
  region: string;
  projection_horizon: string;
  target_month: string;
  seasonal_regime: string;
  central_aqi: number;
  range_lower: number;
  range_upper: number;
  confidence: string;
  disclaimer_label: string;
  scientific_rationale: string;
  model_architecture: string;
}

export interface LifestyleSurveyData {
  daily_outdoor_hours: number;
  outdoor_exercise_time: string;
  primary_commute_mode: string;
  commute_duration_minutes: number;
  residence_traffic_proximity: string;
  indoor_air_purifier: string;
  indoor_ventilation_habits: string;
  voluntary_sensitivity_category: string[];
  
  // Footprint & optional fields
  vehicle_fuel_type?: string;
  engine_idling_habit?: string;
  waste_disposal_habit?: string;
  home_greenery_plants_count?: string;
  home_energy_efficiency?: string;
  cooking_fuel_environment?: string;
  indoor_smoking_exposure?: string;

  current_local_aqi: number;
  forecast_local_aqi: number;
}

export interface ExposureRiskResult {
  personal_exposure_score: number;
  risk_level: string;
  color: string;
  badge: string;
  explanation: string;
  green_footprint_score: number;
  green_badge: string;
  green_color: string;
  estimated_annual_emissions_saved_kg: number;
  sub_scores: {
    outdoor_time_score: number;
    commute_score: number;
    exercise_score: number;
    residential_score: number;
    indoor_score: number;
    vulnerability_adjustment: number;
  };
  health_solutions: Array<{
    category: string;
    title: string;
    action: string;
  }>;
  reduction_solutions: Array<{
    category: string;
    title: string;
    action: string;
  }>;
  recommendations: Array<{
    category: string;
    title: string;
    action: string;
  }>;
  disclaimer: string;
}

export interface EarlyWarning {
  id: string;
  severity: "CRITICAL" | "WARNING" | "ADVISORY";
  alert_type: string;
  title: string;
  station_id: string;
  affected_area: string;
  current_aqi: number;
  forecast_aqi: number;
  primary_pollutant: string;
  lead_time: string;
  timestamp: string;
  trigger_condition: string;
  action_advisory: string;
  color: string;
}

export interface SavedLocation {
  id: string;
  label: string;
  name: string;
  station_id: string;
  type: "home" | "work" | "school" | "parents" | "favorite";
}

export interface UrbanPark {
  name: string;
  zone: string;
  area_acres: number;
  tree_count: number;
  pm25_reduction_pct: number;
  co2_absorption_tons_yr: number;
  key_species: string;
  clean_air_window: string;
  description: string;
}

export interface PurifyingPlant {
  name: string;
  kannada_name?: string;
  type: string;
  target_pollutants: string;
  benefits: string;
  care_level: string;
  efficiency_rating: string;
}
