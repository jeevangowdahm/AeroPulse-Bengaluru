export const BENGALURU_DATASETS_REGISTRY = [
  {
    filename: "bengaluru_monitoring_stations.csv",
    title: "Bengaluru CAAQMS Monitoring Stations",
    category: "Monitoring Network",
    rows_approx: 14,
    description: "Spatial coordinates, environment type, zone, sensor model, and operational status of all 14 Continuous Ambient Air Quality Monitoring Stations in Bengaluru.",
    sample_columns: ["station_id", "station_name", "latitude", "longitude", "zone", "environment_type", "status"]
  },
  {
    filename: "bengaluru_hourly_air_quality.csv",
    title: "Hourly Air Quality Telemetry (7 Pollutants)",
    category: "Telemetry & Time-Series",
    rows_approx: 2366,
    description: "Hourly observations across 14 stations covering PM2.5, PM10, NO2, SO2, CO, O3, and NH3 with computed NAQI and US-EPA sub-indices.",
    sample_columns: ["timestamp", "station_id", "station_name", "pm2_5", "pm10", "no2", "so2", "co", "o3", "nh3", "aqi_naqi", "aqi_epa"]
  },
  {
    filename: "bengaluru_daily_air_quality.csv",
    title: "Daily Aggregated Air Quality Metrics",
    category: "Historical Climatology",
    rows_approx: 1260,
    description: "90-day daily aggregated metrics (24h mean, min, max, 95th percentile, dominant pollutant) across all Bengaluru monitoring stations.",
    sample_columns: ["date", "station_id", "pm25_24h_mean", "pm10_24h_mean", "no2_24h_mean", "dominant_pollutant", "aqi_category"]
  },
  {
    filename: "bengaluru_monthly_air_quality.csv",
    title: "36-Month Climatological Trend Baseline",
    category: "Historical Climatology",
    rows_approx: 504,
    description: "Monthly seasonal climatology for Bengaluru Urban Region (2023–2026) capturing Monsoon scavenging, Winter inversions, and Summer dispersion.",
    sample_columns: ["year_month", "station_id", "monthly_avg_pm25", "monthly_avg_pm10", "exceedance_days_naaqs", "seasonal_regime"]
  },
  {
    filename: "bengaluru_weather.csv",
    title: "Surface & Boundary Layer Meteorology",
    category: "Meteorology",
    rows_approx: 168,
    description: "Hourly weather parameters: 2m Temperature, Relative Humidity, Surface Pressure, Wind Speed/Direction, Planetary Boundary Layer Height (PBLH), and Ventilation Coefficient.",
    sample_columns: ["timestamp", "temperature_c", "humidity_pct", "pressure_hpa", "wind_speed_ms", "wind_direction_deg", "boundary_layer_height_m", "ventilation_coeff_m2s"]
  },
  {
    filename: "bengaluru_pollution_sources.csv",
    title: "Spatial Point & Line Emission Sources",
    category: "Emissions Inventory",
    rows_approx: 25,
    description: "Spatial coordinates of key industrial boiler clusters, waste processing facilities, and highway junctions in Bengaluru with estimated emission rates.",
    sample_columns: ["source_id", "source_name", "source_type", "latitude", "longitude", "est_pm25_kg_day", "est_no2_kg_day", "compliance_status"]
  },
  {
    filename: "bengaluru_source_apportionment.csv",
    title: "CSTEP & KSPCB Source Apportionment Benchmarks",
    category: "Scientific Benchmarks",
    rows_approx: 18,
    description: "Sector-wise empirical contribution percentages for PM2.5 and PM10 in Bengaluru (Transport, Road Dust, Construction Silt, Industry, Biomass Burning).",
    sample_columns: ["sector_name", "pm25_share_pct", "pm10_share_pct", "primary_chemical_markers", "study_reference"]
  },
  {
    filename: "bengaluru_pollution_hotspots.csv",
    title: "Bengaluru Critical Pollution Hotspots",
    category: "Hotspot Ranking",
    rows_approx: 12,
    description: "Ranked critical pollution corridors (Silk Board, Peenya, KR Puram, Tin Factory, Goraguntepalya) with causal factor breakdowns and composite risk scores.",
    sample_columns: ["hotspot_rank", "hotspot_name", "composite_risk_score", "avg_peak_aqi", "primary_cause", "recommended_bbmp_action"]
  },
  {
    filename: "bengaluru_traffic_data.csv",
    title: "Arterial Traffic Congestion & Bottlenecks",
    category: "Traffic & Mobility",
    rows_approx: 84,
    description: "Hourly congestion indices, average vehicular speeds, and idle emission proxies across Outer Ring Road, Hosur Road, and Old Madras Road.",
    sample_columns: ["timestamp", "corridor_name", "congestion_index_pct", "avg_speed_kmh", "vehicular_volume_vph", "idle_emission_factor"]
  },
  {
    filename: "bengaluru_construction_events.csv",
    title: "Metro Phase 2A/2B & Civic Infrastructure Projects",
    category: "Construction & Dust",
    rows_approx: 15,
    description: "Spatial log of major infrastructure works (ORR Metro line, flyover construction, road widening) with dust mitigation compliance ratings.",
    sample_columns: ["project_id", "project_name", "location", "excavation_phase", "dust_barrier_deployed", "water_sprinkling_compliance"]
  },
  {
    filename: "bengaluru_pollution_events.csv",
    title: "Atmospheric Stagnation & Inversion Events",
    category: "Environmental Events",
    rows_approx: 28,
    description: "Historical log of severe pollution episodes, nocturnal temperature inversions, regional dust storms, and festive firecracker spikes in Bengaluru.",
    sample_columns: ["event_id", "event_date", "event_type", "max_aqi_recorded", "duration_hours", "meteorological_trigger"]
  },
  {
    filename: "bengaluru_aqi_forecasts.csv",
    title: "1-Hour to 7-Day Machine Learning Forecasts",
    category: "Predictive Intelligence",
    rows_approx: 112,
    description: "Short-term horizon predictions (+1h, +3h, +6h, +12h, +24h, +48h, +72h, +7d) with 90% confidence intervals and SHAP feature importance.",
    sample_columns: ["forecast_id", "station_id", "horizon_label", "predicted_aqi", "ci_lower_90", "ci_upper_90", "dominant_feature_driver"]
  },
  {
    filename: "bengaluru_long_term_projections.csv",
    title: "Seasonal Multi-Month Long-Term Scenarios",
    category: "Predictive Intelligence",
    rows_approx: 4,
    description: "1-month, 3-month, 6-month, and 12-month projected seasonal scenarios for Bengaluru with scientific rationale and disclaimer metadata.",
    sample_columns: ["horizon", "target_month", "seasonal_regime", "central_aqi_projection", "projection_range", "scientific_rationale"]
  },
  {
    filename: "bengaluru_lifestyle_survey_schema.csv",
    title: "Personal Exposure Risk Assessment Schema",
    category: "Health & Lifestyle",
    rows_approx: 16,
    description: "Questionnaire weighting schema, commute emission factors, and lifestyle exposure matrices used by the 0–100 Personal Exposure Risk Engine.",
    sample_columns: ["question_id", "dimension", "option_label", "exposure_risk_weight", "footprint_credit_kg_yr"]
  },
  {
    filename: "bengaluru_health_risk_rules.csv",
    title: "CPCB & WHO Public Health Impact Matrix",
    category: "Health & Lifestyle",
    rows_approx: 6,
    description: "Health severity guidelines, physiological symptom risks, vulnerable population advisories, and outdoor exercise safety windows per AQI band.",
    sample_columns: ["aqi_band", "severity_level", "general_public_effect", "sensitive_groups_advisory", "recommended_protective_action"]
  }
];
