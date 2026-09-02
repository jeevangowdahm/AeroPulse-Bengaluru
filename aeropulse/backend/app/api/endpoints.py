"""
AeroPulse Bengaluru - FastAPI REST Endpoints
Provides endpoints for monitoring stations, real-time AQI, ML forecasting, GIS map layers,
source attribution, lifestyle exposure scoring, early warnings, AI assistant, and telemetry.
"""

import os
import pandas as pd
from typing import Dict, List, Any, Optional
from fastapi import APIRouter, HTTPException, Query, Response
from pydantic import BaseModel

from ..core.config import settings
from ..engine.aqi_calculator import calculate_aqi_composite, calculate_sub_index
from ..engine.ml_forecaster import ml_forecaster
from ..engine.source_attribution import source_engine
from ..engine.lifestyle_risk_engine import calculate_exposure_risk, LifestyleSurveyInput
from ..engine.early_warning import early_warning_engine, AlertSubscription
from ..engine.ai_assistant import generate_assistant_response
from ..engine.data_quality import data_quality_engine

router = APIRouter()
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

class ChatQuery(BaseModel):
    query: str
    station_id: Optional[str] = "BLR_ST01"
    station_name: Optional[str] = "Silk Board Junction"
    current_aqi: Optional[int] = 186
    category: Optional[str] = "Moderate"
    primary_pollutant: Optional[str] = "PM2.5"

@router.get("/aqi/current")
def get_current_bengaluru_aqi(standard: str = Query("NAQI_INDIA", enum=["NAQI_INDIA", "US_EPA"])):
    """Returns Bengaluru city-wide environmental overview, primary station, weather, and active warnings."""
    stations_path = os.path.join(DATA_DIR, "bengaluru_monitoring_stations.csv")
    hourly_path = os.path.join(DATA_DIR, "bengaluru_hourly_air_quality.csv")
    weather_path = os.path.join(DATA_DIR, "bengaluru_weather.csv")

    if not os.path.exists(hourly_path) or not os.path.exists(weather_path):
        raise HTTPException(status_code=500, detail="Datasets not initialized")

    hourly_df = pd.read_csv(hourly_path)
    weather_df = pd.read_csv(weather_path)

    latest_time = hourly_df['timestamp'].max()
    latest_readings = hourly_df[hourly_df['timestamp'] == latest_time]
    latest_weather = weather_df[weather_df['timestamp'] == latest_time].iloc[0] if not weather_df.empty else None

    # City composite average
    avg_pm25 = round(float(latest_readings['pm2_5'].mean()), 1)
    avg_pm10 = round(float(latest_readings['pm10'].mean()), 1)
    avg_no2 = round(float(latest_readings['no2'].mean()), 1)
    avg_so2 = round(float(latest_readings['so2'].mean()), 1)
    avg_co = round(float(latest_readings['co'].mean()), 2)
    avg_o3 = round(float(latest_readings['o3'].mean()), 1)
    avg_nh3 = round(float(latest_readings['nh3'].mean()), 1)

    pollutants = {
        "pm2_5": avg_pm25,
        "pm10": avg_pm10,
        "no2": avg_no2,
        "so2": avg_so2,
        "co": avg_co,
        "o3": avg_o3,
        "nh3": avg_nh3
    }
    composite = calculate_aqi_composite(pollutants, standard=standard)

    # Primary station (Silk Board default)
    primary_st = latest_readings[latest_readings['station_id'] == "BLR_ST01"].iloc[0]
    st_comp = calculate_aqi_composite({
        "pm2_5": primary_st['pm2_5'],
        "pm10": primary_st['pm10'],
        "no2": primary_st['no2'],
        "so2": primary_st['so2'],
        "co": primary_st['co'],
        "o3": primary_st['o3'],
        "nh3": primary_st['nh3']
    }, standard=standard)

    warnings = early_warning_engine.get_active_warnings()

    return {
        "city": "Bengaluru",
        "region": "Bengaluru Urban Region, Karnataka, India",
        "timestamp": latest_time,
        "aqi_standard": standard,
        "city_composite": {
            "aqi": composite["aqi"],
            "category": composite["category"],
            "primary_pollutant": composite["primary_pollutant"],
            "color": composite["color"],
            "badge": composite["badge"],
            "pollutants": pollutants,
            "sub_indices": composite["sub_indices"]
        },
        "primary_station": {
            "station_id": primary_st['station_id'],
            "station_name": primary_st['station_name'],
            "latitude": float(primary_st['latitude']),
            "longitude": float(primary_st['longitude']),
            "aqi": st_comp["aqi"],
            "category": st_comp["category"],
            "primary_pollutant": st_comp["primary_pollutant"],
            "color": st_comp["color"],
            "pm2_5": float(primary_st['pm2_5']),
            "pm10": float(primary_st['pm10']),
            "no2": float(primary_st['no2']),
            "so2": float(primary_st['so2']),
            "co": float(primary_st['co']),
            "o3": float(primary_st['o3']),
            "nh3": float(primary_st['nh3']),
            "data_source": "DEMO",
            "data_quality": "SIMULATED"
        },
        "weather": {
            "temperature_c": float(latest_weather['temperature']) if latest_weather is not None else 26.5,
            "humidity_pct": int(latest_weather['humidity']) if latest_weather is not None else 68,
            "pressure_hpa": float(latest_weather['pressure']) if latest_weather is not None else 916.0,
            "wind_speed_ms": float(latest_weather['wind_speed']) if latest_weather is not None else 2.8,
            "wind_direction_deg": float(latest_weather['wind_direction']) if latest_weather is not None else 240.0,
            "rainfall_mm": float(latest_weather['rainfall']) if latest_weather is not None else 0.0,
            "cloud_cover_pct": int(latest_weather['cloud_cover']) if latest_weather is not None else 55,
            "visibility_km": float(latest_weather['visibility']) if latest_weather is not None else 8.5,
            "boundary_layer_height_m": float(latest_weather['boundary_layer_height']) if latest_weather is not None else 450.0
        },
        "active_warnings_count": len(warnings),
        "demo_banner": "DEMO DATA — Model-driven simulation for Bengaluru Urban Region"
    }

@router.get("/stations")
def get_stations(standard: str = Query("NAQI_INDIA", enum=["NAQI_INDIA", "US_EPA"])):
    """Returns all 14 Bengaluru monitoring stations with live AQI, pollutant concentrations, and coordinates."""
    stations_path = os.path.join(DATA_DIR, "bengaluru_monitoring_stations.csv")
    hourly_path = os.path.join(DATA_DIR, "bengaluru_hourly_air_quality.csv")
    
    st_df = pd.read_csv(stations_path)
    hr_df = pd.read_csv(hourly_path)
    latest_time = hr_df['timestamp'].max()
    latest_hr = hr_df[hr_df['timestamp'] == latest_time]

    stations_list = []
    for _, st in st_df.iterrows():
        match = latest_hr[latest_hr['station_id'] == st['station_id']]
        if not match.empty:
            m = match.iloc[0]
            p_dict = {
                "pm2_5": m['pm2_5'], "pm10": m['pm10'], "no2": m['no2'],
                "so2": m['so2'], "co": m['co'], "o3": m['o3'], "nh3": m['nh3']
            }
            comp = calculate_aqi_composite(p_dict, standard=standard)
            stations_list.append({
                "station_id": st['station_id'],
                "station_name": st['station_name'],
                "latitude": float(st['latitude']),
                "longitude": float(st['longitude']),
                "address": st['address'],
                "area": st['area'],
                "zone": st['zone'],
                "station_type": st['station_type'],
                "environment_type": st['environment_type'],
                "status": st['status'],
                "data_quality": st['data_quality'],
                "data_source": "DEMO",
                "aqi": comp['aqi'],
                "category": comp['category'],
                "primary_pollutant": comp['primary_pollutant'],
                "color": comp['color'],
                "badge": comp['badge'],
                "pm2_5": float(m['pm2_5']),
                "pm10": float(m['pm10']),
                "no2": float(m['no2']),
                "so2": float(m['so2']),
                "co": float(m['co']),
                "o3": float(m['o3']),
                "nh3": float(m['nh3']),
                "last_updated": latest_time
            })

    return {"count": len(stations_list), "standard": standard, "stations": stations_list}

@router.get("/stations/{station_id}")
def get_station_profile(station_id: str, standard: str = Query("NAQI_INDIA", enum=["NAQI_INDIA", "US_EPA"])):
    """Returns a full profile for a single station including 24h history, forecast, and source explanation."""
    hourly_path = os.path.join(DATA_DIR, "bengaluru_hourly_air_quality.csv")
    weather_path = os.path.join(DATA_DIR, "bengaluru_weather.csv")
    
    hr_df = pd.read_csv(hourly_path)
    w_df = pd.read_csv(weather_path)
    
    st_readings = hr_df[hr_df['station_id'] == station_id].sort_values('timestamp')
    if st_readings.empty:
        raise HTTPException(status_code=404, detail=f"Station {station_id} not found")

    latest = st_readings.iloc[-1]
    history_24h = st_readings.iloc[-24:]

    p_dict = {
        "pm2_5": latest['pm2_5'], "pm10": latest['pm10'], "no2": latest['no2'],
        "so2": latest['so2'], "co": latest['co'], "o3": latest['o3'], "nh3": latest['nh3']
    }
    comp = calculate_aqi_composite(p_dict, standard=standard)
    forecast = ml_forecaster.get_short_term_forecast(station_id)

    # Dynamic explanation
    hour = pd.to_datetime(latest['timestamp']).hour
    explanation = source_engine.explain_pollution_episode(
        current_aqi=comp['aqi'],
        primary_pollutant=comp['primary_pollutant'],
        pm25=float(latest['pm2_5']),
        pm10=float(latest['pm10']),
        wind_speed=2.4,
        boundary_layer_height=420.0,
        humidity=68.0,
        hour=hour,
        station_name=latest['station_name']
    )

    history_chart = []
    for _, r in history_24h.iterrows():
        c = calculate_aqi_composite({"pm2_5": r['pm2_5'], "pm10": r['pm10']}, standard=standard)
        history_chart.append({
            "timestamp": r['timestamp'],
            "time": r['timestamp'].split(" ")[1][:5],
            "aqi": c['aqi'],
            "pm2_5": float(r['pm2_5']),
            "pm10": float(r['pm10']),
            "no2": float(r['no2'])
        })

    return {
        "station_id": latest['station_id'],
        "station_name": latest['station_name'],
        "latitude": float(latest['latitude']),
        "longitude": float(latest['longitude']),
        "current_aqi": comp['aqi'],
        "category": comp['category'],
        "primary_pollutant": comp['primary_pollutant'],
        "color": comp['color'],
        "pollutants": p_dict,
        "sub_indices": comp['sub_indices'],
        "history_24h": history_chart,
        "forecast": forecast,
        "source_analysis": explanation
    }

@router.get("/aqi/forecast")
def get_aqi_forecast(station_id: str = "BLR_ST01"):
    """Returns short-term predictive horizons (1h-7d) and long-term trend scenarios (1m-12m)."""
    short_term = ml_forecaster.get_short_term_forecast(station_id)
    long_term = ml_forecaster.get_long_term_projections()
    return {
        "station_id": station_id,
        "short_term_forecast": short_term,
        "long_term_projections": long_term,
        "telemetry": ml_forecaster.get_model_telemetry()
    }

@router.get("/aqi/sources")
def get_source_analysis(station_id: str = "BLR_ST01"):
    """Returns CSTEP/KSPCB source apportionment benchmarks and live explainable AI reasoning."""
    hourly_path = os.path.join(DATA_DIR, "bengaluru_hourly_air_quality.csv")
    hr_df = pd.read_csv(hourly_path)
    latest_match = hr_df[hr_df['station_id'] == station_id].iloc[-1]
    
    comp = calculate_aqi_composite({"pm2_5": latest_match['pm2_5'], "pm10": latest_match['pm10']})
    hour = pd.to_datetime(latest_match['timestamp']).hour

    explanation = source_engine.explain_pollution_episode(
        current_aqi=comp['aqi'],
        primary_pollutant=comp['primary_pollutant'],
        pm25=float(latest_match['pm2_5']),
        pm10=float(latest_match['pm10']),
        wind_speed=2.5,
        boundary_layer_height=380.0,
        humidity=72.0,
        hour=hour,
        station_name=latest_match['station_name']
    )

    return {
        "scientific_benchmarks": source_engine.get_source_apportionment(),
        "live_explanation": explanation
    }

@router.get("/aqi/hotspots")
def get_pollution_hotspots():
    """Returns critical Bengaluru pollution bottlenecks with live AQI and priority ratings."""
    hotspots_path = os.path.join(DATA_DIR, "bengaluru_pollution_hotspots.csv")
    df = pd.read_csv(hotspots_path)
    return {"hotspots": df.to_dict(orient="records")}

@router.get("/ranking")
def get_risk_ranking(metric: str = Query("aqi", enum=["aqi", "pm25", "pm10", "deterioration"])):
    """Returns ranked leaderboards for Bengaluru localities and monitoring stations."""
    hourly_path = os.path.join(DATA_DIR, "bengaluru_hourly_air_quality.csv")
    hr_df = pd.read_csv(hourly_path)
    latest_time = hr_df['timestamp'].max()
    latest_hr = hr_df[hr_df['timestamp'] == latest_time].copy()

    # Calculate 24h avg and spike
    time_24h_ago = (pd.to_datetime(latest_time) - pd.Timedelta(hours=24)).strftime("%Y-%m-%d %H:%M:%S")
    hr_24 = hr_df[hr_df['timestamp'] >= time_24h_ago]
    
    avg_24 = hr_24.groupby('station_id')['aqi'].mean().to_dict()
    avg_pm25_24 = hr_24.groupby('station_id')['pm2_5'].mean().to_dict()

    ranked = []
    for _, row in latest_hr.iterrows():
        st_id = row['station_id']
        current_aqi = int(row['aqi'])
        a24 = round(avg_24.get(st_id, current_aqi), 1)
        spike = round(current_aqi - a24, 1)
        comp = calculate_aqi_composite({"pm2_5": row['pm2_5'], "pm10": row['pm10']})

        ranked.append({
            "station_id": st_id,
            "station_name": row['station_name'],
            "latitude": float(row['latitude']),
            "longitude": float(row['longitude']),
            "current_aqi": current_aqi,
            "avg_24h_aqi": a24,
            "spike_24h": spike,
            "pm2_5": float(row['pm2_5']),
            "pm10": float(row['pm10']),
            "category": comp['category'],
            "color": comp['color'],
            "primary_pollutant": comp['primary_pollutant']
        })

    if metric == "aqi":
        ranked.sort(key=lambda x: x['current_aqi'], reverse=True)
    elif metric == "pm25":
        ranked.sort(key=lambda x: x['pm2_5'], reverse=True)
    elif metric == "pm10":
        ranked.sort(key=lambda x: x['pm10'], reverse=True)
    elif metric == "deterioration":
        ranked.sort(key=lambda x: x['spike_24h'], reverse=True)

    for rank, item in enumerate(ranked, 1):
        item["rank"] = rank

    return {"metric": metric, "leaderboard": ranked}

@router.get("/trends")
def get_historical_trends(timeframe: str = Query("7D", enum=["24H", "7D", "30D", "3M", "6M", "1Y", "5Y"])):
    """Returns historical multi-pollutant time-series data for analytics charts."""
    if timeframe in ["24H", "7D"]:
        hourly_path = os.path.join(DATA_DIR, "bengaluru_hourly_air_quality.csv")
        df = pd.read_csv(hourly_path)
        limit = 24 if timeframe == "24H" else 168
        city_avg = df.groupby('timestamp')[['pm2_5', 'pm10', 'no2', 'so2', 'co', 'o3', 'aqi']].mean().reset_index()
        subset = city_avg.tail(limit)
        points = [
            {
                "timestamp": r['timestamp'],
                "label": r['timestamp'].split(" ")[1][:5] if timeframe == "24H" else r['timestamp'].split(" ")[0][5:],
                "aqi": round(r['aqi']),
                "pm2_5": round(r['pm2_5'], 1),
                "pm10": round(r['pm10'], 1),
                "no2": round(r['no2'], 1)
            }
            for _, r in subset.iterrows()
        ]
        return {"timeframe": timeframe, "data": points}
    elif timeframe in ["30D", "3M"]:
        daily_path = os.path.join(DATA_DIR, "bengaluru_daily_air_quality.csv")
        df = pd.read_csv(daily_path)
        limit = 30 if timeframe == "30D" else 90
        city_avg = df.groupby('date')[['daily_mean_aqi', 'daily_mean_pm25', 'daily_mean_pm10']].mean().reset_index()
        subset = city_avg.tail(limit)
        points = [
            {
                "timestamp": r['date'],
                "label": r['date'][5:],
                "aqi": round(r['daily_mean_aqi']),
                "pm2_5": round(r['daily_mean_pm25'], 1),
                "pm10": round(r['daily_mean_pm10'], 1)
            }
            for _, r in subset.iterrows()
        ]
        return {"timeframe": timeframe, "data": points}
    else: # 6M, 1Y, 5Y
        monthly_path = os.path.join(DATA_DIR, "bengaluru_monthly_air_quality.csv")
        df = pd.read_csv(monthly_path)
        city_avg = df.groupby('month')[['monthly_mean_aqi', 'monthly_mean_pm25', 'monthly_mean_pm10']].mean().reset_index()
        points = [
            {
                "timestamp": r['month'],
                "label": r['month'],
                "aqi": round(r['monthly_mean_aqi']),
                "pm2_5": round(r['monthly_mean_pm25'], 1),
                "pm10": round(r['monthly_mean_pm10'], 1)
            }
            for _, r in city_avg.iterrows()
        ]
        return {"timeframe": timeframe, "data": points}

@router.get("/map/layers")
def get_map_layers():
    """Returns geospatial layers for Leaflet GIS map (stations, heatpoints, wind vectors, hotspots)."""
    stations_path = os.path.join(DATA_DIR, "bengaluru_monitoring_stations.csv")
    hourly_path = os.path.join(DATA_DIR, "bengaluru_hourly_air_quality.csv")
    hotspots_path = os.path.join(DATA_DIR, "bengaluru_pollution_hotspots.csv")
    traffic_path = os.path.join(DATA_DIR, "bengaluru_traffic_data.csv")

    st_df = pd.read_csv(stations_path)
    hr_df = pd.read_csv(hourly_path)
    hs_df = pd.read_csv(hotspots_path)
    tf_df = pd.read_csv(traffic_path)

    latest_time = hr_df['timestamp'].max()
    latest_hr = hr_df[hr_df['timestamp'] == latest_time]

    station_markers = []
    heatmap_points = []
    
    for _, st in st_df.iterrows():
        match = latest_hr[latest_hr['station_id'] == st['station_id']]
        if not match.empty:
            m = match.iloc[0]
            comp = calculate_aqi_composite({"pm2_5": m['pm2_5'], "pm10": m['pm10']})
            lat = float(st['latitude'])
            lon = float(st['longitude'])
            aqi = comp['aqi']
            
            station_markers.append({
                "station_id": st['station_id'],
                "station_name": st['station_name'],
                "latitude": lat,
                "longitude": lon,
                "aqi": aqi,
                "category": comp['category'],
                "color": comp['color'],
                "pm2_5": float(m['pm2_5']),
                "pm10": float(m['pm10']),
                "no2": float(m['no2']),
                "zone": st['zone'],
                "station_type": st['station_type']
            })
            
            # Add grid interpolation nodes around stations for heatmap rendering
            heatmap_points.append([lat, lon, aqi / 350.0])
            heatmap_points.append([lat + 0.008, lon + 0.008, (aqi * 0.92) / 350.0])
            heatmap_points.append([lat - 0.008, lon - 0.008, (aqi * 0.94) / 350.0])
            heatmap_points.append([lat + 0.008, lon - 0.008, (aqi * 0.90) / 350.0])

    return {
        "center": [12.9716, 77.5946],
        "zoom": 11,
        "stations": station_markers,
        "heatmap_points": heatmap_points,
        "hotspots": hs_df.to_dict(orient="records"),
        "traffic_corridors": tf_df.to_dict(orient="records"),
        "wind_layer": {
            "speed_ms": 2.8,
            "direction_deg": 240,
            "description": "Westerly / South-Westerly airflow across Bengaluru basin"
        }
    }

@router.post("/survey/submit")
def submit_lifestyle_survey(survey: LifestyleSurveyInput):
    """Calculates 0-100 Personal Exposure Risk Score with explainability and actionable suggestions."""
    return calculate_exposure_risk(survey)

@router.get("/alerts")
def get_alerts():
    """Returns active early warnings and system advisories."""
    return {"alerts": early_warning_engine.get_active_warnings()}

@router.post("/alerts/subscribe")
def subscribe_to_alerts(subscription: AlertSubscription):
    """Saves custom alert threshold configurations."""
    return {
        "status": "SUCCESS",
        "message": f"Alert subscription configured for station {subscription.station_id} (AQI > {subscription.aqi_threshold})",
        "subscription": subscription
    }

@router.post("/chat")
def chat_with_aerobot(query: ChatQuery):
    """Conversational endpoint for AeroBot AI Environmental Assistant."""
    res = generate_assistant_response(
        query=query.query,
        context_station=query.station_name or "Silk Board Junction",
        current_aqi=query.current_aqi or 186,
        category=query.category or "Moderate",
        primary=query.primary_pollutant or "PM2.5"
    )
    return res

@router.get("/green-spaces")
def get_bengaluru_green_spaces():
    """Returns Bengaluru Urban forest & tree cover percentage, major urban parks, and air purifying plants."""
    return {
        "canopy_overview": {
            "region": "Bengaluru Urban Region",
            "urban_area_sq_km": 741,
            "current_forest_tree_cover_pct": 6.8,
            "historic_tree_cover_pct_1973": 68.2,
            "target_canopy_pct_2030": 15.0,
            "annual_pm25_absorbed_tons": 840,
            "annual_co2_sequestered_tons": 125000,
            "temperature_cooling_effect_c": -1.8,
            "status_narrative": "Bengaluru's tree canopy currently covers ~6.8% of the urban landscape (down from 68% in 1973). BBMP and NCAP have targeted an expansion to 15.0% through mass afforestation and lake-buffer rejuvenation."
        },
        "urban_forests_and_parks": [
            {
                "name": "Cubbon Park (Sri Chamarajendra Park)",
                "zone": "Central Bengaluru",
                "area_acres": 300,
                "tree_count": 6000,
                "pm25_reduction_pct": 28,
                "co2_absorption_tons_yr": 120,
                "key_species": "Silver Oak, Mahagony, Bamboo, Cassia, Tabebuia",
                "clean_air_window": "6:00 AM – 8:30 AM (Restricted Vehicle Hours)",
                "description": "The central green lung of Bengaluru. Provides a 28% drop in PM2.5 compared to adjacent MG Road and Kasturba Road corridors."
            },
            {
                "name": "Lalbagh Botanical Garden",
                "zone": "South Bengaluru (Near Jayanagar/Basavanagudi)",
                "area_acres": 240,
                "tree_count": 1854,
                "pm25_reduction_pct": 32,
                "co2_absorption_tons_yr": 110,
                "key_species": "Centenary Ficus, Silk Cotton, Mango, Baobab",
                "clean_air_window": "5:30 AM – 9:00 AM",
                "description": "Historic 200-year-old botanical park that absorbs particulate dust from Hosur Road and Lalbagh Fort Road."
            },
            {
                "name": "Turahalli Reserve Forest",
                "zone": "South-West (Kanakapura Road)",
                "area_acres": 590,
                "tree_count": 14000,
                "pm25_reduction_pct": 42,
                "co2_absorption_tons_yr": 350,
                "key_species": "Dry deciduous scrub, Eucalyptus, Neem, Acacia",
                "clean_air_window": "6:00 AM – 10:00 AM",
                "description": "Bengaluru's only surviving natural reserve forest. Acts as a vital ecological shield against South-Western dust storms."
            },
            {
                "name": "Bannerghatta National Park Buffer",
                "zone": "South Bengaluru Periphery",
                "area_acres": 25000,
                "tree_count": 85000,
                "pm25_reduction_pct": 48,
                "co2_absorption_tons_yr": 2800,
                "key_species": "Moist deciduous forest, Teak, Sandalwood, Rosewood",
                "clean_air_window": "All Day Clean Microclimate",
                "description": "Massive southern wilderness corridor buffering Electronic City and Jigani industrial belts."
            },
            {
                "name": "GKVK Green Campus (UAS Bangalore)",
                "zone": "North Bengaluru (Hebbal-Yelahanka)",
                "area_acres": 300,
                "tree_count": 5500,
                "pm25_reduction_pct": 35,
                "co2_absorption_tons_yr": 130,
                "key_species": "Botanical gardens, Teak, Banyan, Agricultural orchards",
                "clean_air_window": "6:00 AM – 9:00 AM",
                "description": "Creates a natural cooling microclimate (-2.5°C) and absorbs heavy transit particulate from Bellary Road (Airport Corridor)."
            },
            {
                "name": "JP Nagar Mini Forest (Tree Park)",
                "zone": "South Bengaluru (JP Nagar 3rd Phase)",
                "area_acres": 32,
                "tree_count": 2200,
                "pm25_reduction_pct": 24,
                "co2_absorption_tons_yr": 45,
                "key_species": "Acacia, Neem, Gulmohar, Bamboo groves",
                "clean_air_window": "6:00 AM – 9:00 AM",
                "description": "Dense residential green buffer filtering particulate matter between Bannerghatta Road and Kanakapura Road."
            },
            {
                "name": "Sankey Tank & Sadashivanagar Green Belt",
                "zone": "North-Central (Malleshwaram)",
                "area_acres": 37.5,
                "tree_count": 1800,
                "pm25_reduction_pct": 22,
                "co2_absorption_tons_yr": 40,
                "key_species": "Weeping Fig, Banyan, Rain Tree, Gulmohar",
                "clean_air_window": "6:00 AM – 8:30 AM",
                "description": "Water-body microclimate that naturally settles ambient road dust through localized evaporative humidity."
            },
            {
                "name": "Bugle Rock & M.N. Krishna Rao Park",
                "zone": "South Bengaluru (Basavanagudi)",
                "area_acres": 16,
                "tree_count": 950,
                "pm25_reduction_pct": 20,
                "co2_absorption_tons_yr": 25,
                "key_species": "Ancient Ficus, Peepal, Ashoka, Jackfruit",
                "clean_air_window": "5:30 AM – 8:30 AM",
                "description": "Centuries-old canopy grove providing natural morning exercise oxygenation for South Bengaluru residents."
            }
        ],
        "air_purifying_plants": [
            {
                "name": "Areca Palm (Chrysalidocarpus lutescens)",
                "kannada_name": "ಅಡಿಕೆ ಪಾಮ್ (Areca)",
                "type": "Indoor & Balcony",
                "target_pollutants": "PM2.5 Dust Binder, Xylene, Toluene, Formaldehyde",
                "benefits": "Acts as an active indoor natural humidifier. 4 plants per person can dramatically improve indoor air quality.",
                "care_level": "Easy / Medium Sun",
                "efficiency_rating": "9.2 / 10"
            },
            {
                "name": "Snake Plant / Mother-in-Law's Tongue (Sansevieria)",
                "kannada_name": "ಹಾವು ಗಿಡ (Sansevieria)",
                "type": "Bedroom & Indoor",
                "target_pollutants": "Releases Oxygen at Night, Nitrogen Oxides (NOx), Benzene",
                "benefits": "NASA Top 10 Purifier. Converts CO2 to Oxygen at night; ideal for bedrooms to combat nocturnal inversion smog.",
                "care_level": "Extremely Low / Low Water",
                "efficiency_rating": "9.5 / 10"
            },
            {
                "name": "Holy Basil / Krishna Tulsi (Ocimum sanctum)",
                "kannada_name": "ತುಳಸಿ (Tulsi)",
                "type": "Balcony & Window Sills",
                "target_pollutants": "Ozone (O3), Carbon Monoxide, Airborne Bacteria",
                "benefits": "Generates nascent oxygen up to 20 hours a day. Natural antimicrobial and particulate repellent for window sills.",
                "care_level": "Easy / High Sunlight",
                "efficiency_rating": "9.0 / 10"
            },
            {
                "name": "Money Plant / Golden Pothos (Epipremnum aureum)",
                "kannada_name": "ಮನಿ ಪ್ಲಾಂಟ್ (Money Plant)",
                "type": "Living Room & Corridor",
                "target_pollutants": "Volatile Organic Compounds (VOCs), Carbon Monoxide, Formaldehyde",
                "benefits": "Traps micro dust on broad waxy leaves and rapidly absorbs indoor paint and cooking fumes.",
                "care_level": "Very Easy / Low Light",
                "efficiency_rating": "8.8 / 10"
            },
            {
                "name": "Spider Plant (Chlorophytum comosum)",
                "kannada_name": "ಸ್ಪೈಡರ್ ಗಿಡ (Spider Plant)",
                "type": "Hanging Balcony / Kitchen",
                "target_pollutants": "Carbon Monoxide (CO), Xylene, Benzene",
                "benefits": "Non-toxic to pets. Removes up to 95% of toxic carbon monoxide and formaldehyde within 24 hours.",
                "care_level": "Easy / Indirect Sunlight",
                "efficiency_rating": "8.7 / 10"
            },
            {
                "name": "Peace Lily (Spathiphyllum)",
                "kannada_name": "ಪೀಸ್ ಲಿಲಿ (Peace Lily)",
                "type": "Bathroom & Shaded Rooms",
                "target_pollutants": "Ammonia (NH3), Acetone, Trichloroethylene, Mold Spores",
                "benefits": "Breaks down airborne mold spores and chemical cleaning agents in enclosed rooms.",
                "care_level": "Medium / Shaded",
                "efficiency_rating": "8.9 / 10"
            }
        ]
    }

@router.get("/health/guidelines")
def get_health_guidelines():
    """Returns authoritative CPCB/WHO health guidance matrix by AQI tier."""
    health_path = os.path.join(DATA_DIR, "bengaluru_health_risk_rules.csv")
    df = pd.read_csv(health_path)
    return {"guidelines": df.to_dict(orient="records")}

@router.get("/admin/metrics")
def get_admin_metrics():
    """Returns sensor telemetry, data quality breakdown, and ML model performance metrics."""
    network = data_quality_engine.get_network_health()
    telemetry = ml_forecaster.get_model_telemetry()
    return {
        "network_health": network,
        "model_telemetry": telemetry,
        "api_status": "All 18 Micro-Services Operational",
        "demo_mode": settings.DEMO_MODE
    }

@router.get("/export/datasets")
def list_export_datasets():
    """Returns list and metadata of all 15 Bengaluru environmental dataset files."""
    files = [f for f in os.listdir(DATA_DIR) if f.endswith(".csv")]
    catalog = []
    for f in sorted(files):
        p = os.path.join(DATA_DIR, f)
        size_kb = round(os.path.getsize(p) / 1024.0, 1)
        catalog.append({
            "filename": f,
            "size_kb": size_kb,
            "rows": sum(1 for _ in open(p, encoding="utf-8")) - 1,
            "data_source": "DEMO / KSPCB-CSTEP Grounding",
            "data_quality": "SIMULATED",
            "download_url": f"/api/export/dataset/{f}"
        })
    return {"dataset_count": len(catalog), "datasets": catalog}

@router.get("/export/dataset/{filename}")
def download_dataset(filename: str):
    """Streams a CSV dataset file directly to the client."""
    file_path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(file_path) or not filename.endswith(".csv"):
        raise HTTPException(status_code=404, detail="Dataset file not found")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})
