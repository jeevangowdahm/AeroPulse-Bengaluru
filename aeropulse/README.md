# AeroPulse Bengaluru: AI-Powered Air Quality Monitoring, Forecasting, Early Warning & Risk Ranking Platform

![AeroPulse Bengaluru](https://img.shields.io/badge/AeroPulse-Bengaluru-0284c7?style=for-the-badge&logo=wind)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit_learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)

---

## Executive Overview
**AeroPulse Bengaluru** is an environmental intelligence platform designed specifically for the **Bengaluru Urban Region, Karnataka, India**. Inspired by the density and usability of modern weather platforms (such as AccuWeather), the application incorporates its own original design system, empirical source apportionment models (CSTEP & KSPCB), Machine Learning forecasting engines, and personalized lifestyle exposure scoring.

---

## Key Modules & Features

### 1. Main Dashboard
- **Real-Time AQI Visualizer**: Radial circular meter with color-coded severity tiers across Indian NAQI (CPCB) and US EPA standards.
- **7 Criteria Pollutants**: Continuous monitoring of PM2.5, PM10, NO₂, SO₂, CO, O₃, and NH₃ with sub-index calculations.
- **Meteorological Strip**: Live surface temperature, relative humidity, wind speed/direction vectors, barometric pressure, visibility, and boundary layer height.
- **24-Hour Diurnal Sparkline**: Hourly progression displaying morning and evening boundary layer inversion spikes.
- **Top Hotspots & Quick Health Advisory**: Immediate visibility into critical chokepoints (Silk Board, Peenya, KR Puram).

### 2. Interactive GIS Pollution Map (Leaflet)
- **High-Density Heatmaps**: Seamless rendering of composite AQI, PM2.5, PM10, and NO₂ layers across Bengaluru.
- **14 CAAQMS Stations**: Interactive markers with popups displaying live metrics, environment type, and zone.
- **Wind Streamlines & Hotspots**: Visual vector overlays showing wind speed and direction.
- **Time Scrubber**: Interactive temporal slider traversing historical (-24h, -12h, -6h) to predictive horizons (+6h, +24h, +7d).

### 3. AQI Forecasting & Long-Term Projections
- **Short-Term Horizons**: 1h, 3h, 6h, 12h, 24h, 48h, 72h, and 7-day predictive curves with 90% confidence bands.
- **Long-Term Trend Scenarios**: 1-month, 3-month, 6-month, and 12-month projections explicitly marked as *"Model-based projected trend (Not guaranteed forecast)"*.
- **Explainable AI (XAI)**: SHAP-inspired feature importance breakdown (Boundary Layer Height, Wind Velocity, Traffic Congestion, Diurnal Harmonics).

### 4. Bengaluru Source Apportionment & "Why is AQI High?" Reasoner
- **CSTEP & KSPCB Study Grounding**: Road Dust (51.1% PM10), Transport Exhaust (39.9% PM2.5), Construction Silt (6%), Industrial Boilers (14.8%), Biomass & Waste Burning (7.8%), and Secondary Aerosols.
- **Dynamic Reasoner**: Synthesizes current wind velocity, boundary layer height, traffic congestion, and local topography to explain pollution episodes.

### 5. Personal Lifestyle Survey & 0–100 Exposure Risk Engine
- **5-Step Wizard**: Assesses daily outdoor hours, exercise timing windows, commute mode (Two-wheeler vs Metro vs Car), arterial proximity, and indoor HEPA filtration.
- **0–100 Exposure Risk Meter**: Computes domain sub-scores and provides plain-English explanations.
- **Actionable Recommendations**: Lower-exposure transit routing, exercise timing shifts (afternoon dispersion window), and personal footprint mitigation.

### 6. Early Warning & Anomaly Broadcast System
- Automated alerts for rapid AQI deterioration (>30 points in 3h), PM2.5 threshold breaches, and nocturnal radiation inversion watches.
- Custom threshold configurator with multi-channel simulator (Web, Browser Push, Email, SMS).

### 7. AeroBot AI Environmental Assistant
- Context-aware chatbot with live Bengaluru telemetry integration, natural language reasoning, and strict non-diagnostic public health guardrails.

### 8. Admin Telemetry & Data Quality Transparency
- 14 CAAQMS station telemetry audits (packet delivery rate, latency, anomaly flags).
- ML regression benchmarks ($R^2$, MAE, RMSE) and model drift tracking.
- Transparency center providing 1-click downloads for all 15 standardized CSV datasets.

---

## 15 Included Bengaluru Environmental Datasets
All 15 dataset files are generated in `backend/app/data/`:
1. `bengaluru_monitoring_stations.csv` (14 stations across South, North, East, West, and Central zones)
2. `bengaluru_hourly_air_quality.csv` (2,366+ rows of historical hourly telemetry)
3. `bengaluru_daily_air_quality.csv` (90-day daily aggregates)
4. `bengaluru_monthly_air_quality.csv` (36-month seasonal climatology)
5. `bengaluru_weather.csv` (Hourly meteorological parameters)
6. `bengaluru_pollution_sources.csv` (Spatial emission entities)
7. `bengaluru_source_apportionment.csv` (CSTEP/KSPCB sector benchmarks)
8. `bengaluru_pollution_hotspots.csv` (Silk Board, Peenya, KR Puram, Hebbal)
9. `bengaluru_traffic_data.csv` (Outer Ring Road, Hosur Road congestion metrics)
10. `bengaluru_construction_events.csv` (Metro Phase 2A/2B construction dust tracking)
11. `bengaluru_pollution_events.csv` (Thermal inversions, dust storms, biomass burning)
12. `bengaluru_aqi_forecasts.csv` (1h to 7-day predictive horizons)
13. `bengaluru_long_term_projections.csv` (1m to 12m seasonal scenarios)
14. `bengaluru_lifestyle_survey_schema.csv` (Question weights & risk factors)
15. `bengaluru_health_risk_rules.csv` (CPCB/WHO health effects matrix)

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Start the Backend API
```bash
cd backend
python app/data/generate_datasets.py   # Generate 15 CSV datasets
uvicorn app.main:app --reload --port 8000
```
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Run Backend Automated Tests
```bash
cd backend
python -m pytest tests/
```

### 3. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- Web Application: [http://localhost:3000](http://localhost:3000)

### 4. Docker Deployment
```bash
docker-compose up --build
```

---

## Scientific Safety & Medical Disclaimer
This application provides environmental exposure risk analysis and general public-health guidance based on published CPCB/WHO standards. It does **not diagnose clinical diseases** or replace medical consultation from a qualified physician. All prototype data is tagged with `data_source = DEMO` and `data_quality = SIMULATED`.
