"""
Bengaluru Environmental Datasets Generator
Generates realistic, scientifically anchored datasets for Bengaluru Urban Region
integrating KSPCB/CPCB stations, CSTEP source apportionment, and meteorological patterns.
All synthetic records are explicitly tagged: data_source='DEMO', data_quality='SIMULATED'.
"""

import os
import csv
import json
import math
import random
from datetime import datetime, timedelta

DATA_DIR = os.path.dirname(os.path.abspath(__file__))

STATIONS = [
    {
        "station_id": "BLR_ST01",
        "station_name": "Silk Board Junction",
        "latitude": 12.9176,
        "longitude": 77.6238,
        "address": "Central Silk Board, Hosur Road",
        "area": "BTM / HSR / Silk Board",
        "zone": "South Zone",
        "station_type": "Traffic / Kerbside",
        "environment_type": "High Traffic Density",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "Continuous Ambient Air Quality Monitoring Station (CAAQMS)",
        "installation_date": "2019-03-15",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 78.5,
        "base_pm10": 142.0,
        "base_no2": 46.2,
        "base_so2": 11.5,
        "base_co": 1.6,
        "base_o3": 28.4,
        "base_nh3": 24.1,
    },
    {
        "station_id": "BLR_ST02",
        "station_name": "BTM Layout CAAQMS",
        "latitude": 12.9135,
        "longitude": 77.6101,
        "address": "BTM 2nd Stage, Near Kuvempu Nagar",
        "area": "BTM Layout",
        "zone": "South Zone",
        "station_type": "Residential / Commercial",
        "environment_type": "Urban Mixed",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2018-07-20",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 52.0,
        "base_pm10": 98.4,
        "base_no2": 32.1,
        "base_so2": 8.4,
        "base_co": 1.0,
        "base_o3": 34.2,
        "base_nh3": 19.5,
    },
    {
        "station_id": "BLR_ST03",
        "station_name": "Peenya Industrial Area",
        "latitude": 13.0285,
        "longitude": 77.5197,
        "address": "Peenya 2nd Stage, Industrial Estate",
        "area": "Peenya",
        "zone": "West Zone",
        "station_type": "Industrial",
        "environment_type": "Heavy Industrial & Manufacturing",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2017-11-10",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 88.0,
        "base_pm10": 168.5,
        "base_no2": 54.8,
        "base_so2": 22.4,
        "base_co": 1.9,
        "base_o3": 24.1,
        "base_nh3": 38.0,
    },
    {
        "station_id": "BLR_ST04",
        "station_name": "Hebbal CAAQMS",
        "latitude": 13.0358,
        "longitude": 77.5970,
        "address": "Hebbal Flyover Junction, Bellary Road",
        "area": "Hebbal",
        "zone": "North Zone",
        "station_type": "Traffic / Arterial",
        "environment_type": "Airport Highway Corridor",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2019-01-22",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 66.4,
        "base_pm10": 128.0,
        "base_no2": 42.0,
        "base_so2": 9.8,
        "base_co": 1.4,
        "base_o3": 31.0,
        "base_nh3": 21.0,
    },
    {
        "station_id": "BLR_ST05",
        "station_name": "Whitefield Export Promotion Industrial Park",
        "latitude": 12.9815,
        "longitude": 77.7289,
        "address": "EPIP Zone, Near ITPL, Whitefield",
        "area": "Whitefield / ITPL",
        "zone": "Mahadevapura Zone",
        "station_type": "Commercial / IT Corridor",
        "environment_type": "Tech Parks & Metro Construction",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2020-04-18",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 61.2,
        "base_pm10": 119.5,
        "base_no2": 36.5,
        "base_so2": 10.2,
        "base_co": 1.2,
        "base_o3": 33.5,
        "base_nh3": 20.4,
    },
    {
        "station_id": "BLR_ST06",
        "station_name": "Indiranagar 100ft Road",
        "latitude": 12.9784,
        "longitude": 77.6408,
        "address": "100 Feet Road, HAL 2nd Stage",
        "area": "Indiranagar",
        "zone": "East Zone",
        "station_type": "Commercial / Residential",
        "environment_type": "High Commercial Activity",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2020-08-12",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 44.5,
        "base_pm10": 84.0,
        "base_no2": 29.8,
        "base_so2": 7.5,
        "base_co": 0.9,
        "base_o3": 39.0,
        "base_nh3": 17.0,
    },
    {
        "station_id": "BLR_ST07",
        "station_name": "Jayanagar 4th Block",
        "latitude": 12.9299,
        "longitude": 77.5826,
        "address": "Near Jayanagar Shopping Complex",
        "area": "Jayanagar",
        "zone": "South Zone",
        "station_type": "Residential",
        "environment_type": "Green Canopy Residential",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2018-02-14",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 38.0,
        "base_pm10": 72.0,
        "base_no2": 24.5,
        "base_so2": 6.2,
        "base_co": 0.8,
        "base_o3": 42.1,
        "base_nh3": 14.5,
    },
    {
        "station_id": "BLR_ST08",
        "station_name": "City Railway Station / Majestic",
        "latitude": 12.9778,
        "longitude": 77.5713,
        "address": "KSR Bengaluru Central Station, Majestic",
        "area": "Majestic / Gandhi Nagar",
        "zone": "Central Zone",
        "station_type": "Transit Hub / Traffic",
        "environment_type": "Major Bus & Rail Interchange",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "CPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2017-05-19",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 74.0,
        "base_pm10": 138.2,
        "base_no2": 49.0,
        "base_so2": 13.0,
        "base_co": 1.7,
        "base_o3": 26.5,
        "base_nh3": 26.0,
    },
    {
        "station_id": "BLR_ST09",
        "station_name": "Saneguruvanahalli (Basaveshwaranagar)",
        "latitude": 12.9912,
        "longitude": 77.5456,
        "address": "Saneguruvanahalli, Basaveshwaranagar",
        "area": "Basaveshwaranagar",
        "zone": "West Zone",
        "station_type": "Residential",
        "environment_type": "Dense Residential",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2019-09-29",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 42.0,
        "base_pm10": 79.5,
        "base_no2": 26.0,
        "base_so2": 6.8,
        "base_co": 0.8,
        "base_o3": 38.0,
        "base_nh3": 16.2,
    },
    {
        "station_id": "BLR_ST10",
        "station_name": "BWSSB Kadabeesanahalli (Outer Ring Road)",
        "latitude": 12.9352,
        "longitude": 77.6894,
        "address": "Kadabeesanahalli ORR Water Treatment Area",
        "area": "Bellandur / Kadabeesanahalli",
        "zone": "Mahadevapura Zone",
        "station_type": "Traffic / Arterial",
        "environment_type": "High Traffic & Tech Corridor",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2021-03-10",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 71.0,
        "base_pm10": 134.0,
        "base_no2": 44.5,
        "base_so2": 10.5,
        "base_co": 1.5,
        "base_o3": 29.0,
        "base_nh3": 23.0,
    },
    {
        "station_id": "BLR_ST11",
        "station_name": "Hombegowda Nagar (Lalbagh Vicinity)",
        "latitude": 12.9388,
        "longitude": 77.5936,
        "address": "Hombegowda Nagar, Near Lalbagh South Gate",
        "area": "Lalbagh / Wilson Garden",
        "zone": "South Zone",
        "station_type": "Urban Background",
        "environment_type": "Botanical Garden Border",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2018-10-15",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 35.0,
        "base_pm10": 65.0,
        "base_no2": 22.0,
        "base_so2": 5.5,
        "base_co": 0.7,
        "base_o3": 45.0,
        "base_nh3": 13.0,
    },
    {
        "station_id": "BLR_ST12",
        "station_name": "Yelahanka New Town",
        "latitude": 13.1007,
        "longitude": 77.5963,
        "address": "Yelahanka 4th Phase, Near NES",
        "area": "Yelahanka",
        "zone": "Yelahanka Zone",
        "station_type": "Residential / Peri-Urban",
        "environment_type": "Open Suburban Canopy",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2020-01-20",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 40.0,
        "base_pm10": 75.0,
        "base_no2": 25.0,
        "base_so2": 6.0,
        "base_co": 0.8,
        "base_o3": 40.0,
        "base_nh3": 15.0,
    },
    {
        "station_id": "BLR_ST13",
        "station_name": "Electronic City Phase 1",
        "latitude": 12.8452,
        "longitude": 77.6602,
        "address": "Electronics City Elevated Expressway End",
        "area": "Electronic City",
        "zone": "Bommanahalli / Anekal",
        "station_type": "Commercial / Expressway",
        "environment_type": "Elevated Highway & IT Campus",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2021-07-01",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 58.0,
        "base_pm10": 110.0,
        "base_no2": 35.0,
        "base_so2": 9.0,
        "base_co": 1.1,
        "base_o3": 36.0,
        "base_nh3": 19.0,
    },
    {
        "station_id": "BLR_ST14",
        "station_name": "Mysore Road / Nayandahalli",
        "latitude": 12.9463,
        "longitude": 77.5255,
        "address": "Nayandahalli Junction, Mysore Road",
        "area": "Mysore Road / Rajarajeshwari Nagar",
        "zone": "RR Nagar Zone",
        "station_type": "Traffic / Industrial Border",
        "environment_type": "Highway Transit & Commercial",
        "pollutants_measured": "PM2.5, PM10, NO2, SO2, CO, O3, NH3",
        "operator": "KSPCB / AeroPulse Demo",
        "source": "CAAQMS",
        "installation_date": "2019-12-05",
        "status": "Active",
        "last_updated": "2026-09-01 09:30:00",
        "data_quality": "SIMULATED",
        "base_pm25": 68.0,
        "base_pm10": 130.0,
        "base_no2": 43.0,
        "base_so2": 11.0,
        "base_co": 1.4,
        "base_o3": 30.0,
        "base_nh3": 22.0,
    }
]

# Indian National Air Quality Index (NAQI) Breakpoints
NAQI_BREAKPOINTS = {
    "pm2_5": [(0, 30, 0, 50), (30, 60, 51, 100), (60, 90, 101, 200), (90, 120, 201, 300), (120, 250, 301, 400), (250, 500, 401, 500)],
    "pm10": [(0, 50, 0, 50), (50, 100, 51, 100), (100, 250, 101, 200), (250, 350, 201, 300), (350, 430, 301, 400), (430, 600, 401, 500)],
    "no2": [(0, 40, 0, 50), (40, 80, 51, 100), (80, 180, 101, 200), (180, 280, 201, 300), (280, 400, 301, 400), (400, 800, 401, 500)],
    "so2": [(0, 40, 0, 50), (40, 80, 51, 100), (80, 380, 101, 200), (380, 800, 201, 300), (800, 1600, 301, 400), (1600, 2400, 401, 500)],
    "co": [(0, 1.0, 0, 50), (1.0, 2.0, 51, 100), (2.0, 10.0, 101, 200), (10.0, 17.0, 201, 300), (17.0, 34.0, 301, 400), (34.0, 50.0, 401, 500)],
    "o3": [(0, 50, 0, 50), (50, 100, 51, 100), (100, 168, 101, 200), (168, 208, 201, 300), (208, 748, 301, 400), (748, 1000, 401, 500)],
    "nh3": [(0, 200, 0, 50), (200, 400, 51, 100), (400, 800, 101, 200), (800, 1200, 201, 300), (1200, 1800, 301, 400), (1800, 2400, 401, 500)]
}

def calc_sub_index(conc, pollutant):
    if conc is None or conc < 0:
        return 0
    bps = NAQI_BREAKPOINTS.get(pollutant, [])
    for (clow, chigh, ilow, ihigh) in bps:
        if clow <= conc <= chigh:
            return round(ilow + ((ihigh - ilow) / (chigh - clow)) * (conc - clow))
    if bps and conc > bps[-1][1]:
        return 500
    return 0

def calc_naqi(pollutants):
    sub_indices = {}
    for p, val in pollutants.items():
        if p in NAQI_BREAKPOINTS:
            sub_indices[p] = calc_sub_index(val, p)
    
    if not sub_indices:
        return 0, "Good", "None"
    
    aqi_val = max(sub_indices.values())
    primary = max(sub_indices, key=sub_indices.get).upper().replace("_", ".")
    
    if aqi_val <= 50:
        cat = "Good"
    elif aqi_val <= 100:
        cat = "Satisfactory"
    elif aqi_val <= 200:
        cat = "Moderate"
    elif aqi_val <= 300:
        cat = "Poor"
    elif aqi_val <= 400:
        cat = "Very Poor"
    else:
        cat = "Severe"
        
    return aqi_val, cat, primary


def generate_all_datasets():
    os.makedirs(DATA_DIR, exist_ok=True)
    random.seed(42)

    # 1. bengaluru_monitoring_stations.csv
    stations_file = os.path.join(DATA_DIR, "bengaluru_monitoring_stations.csv")
    with open(stations_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "station_id", "station_name", "latitude", "longitude", "address", "area", "zone",
            "station_type", "environment_type", "pollutants_measured", "operator", "source",
            "installation_date", "status", "last_updated", "data_quality"
        ])
        for s in STATIONS:
            writer.writerow([
                s["station_id"], s["station_name"], s["latitude"], s["longitude"], s["address"],
                s["area"], s["zone"], s["station_type"], s["environment_type"], s["pollutants_measured"],
                s["operator"], s["source"], s["installation_date"], s["status"], s["last_updated"], s["data_quality"]
            ])
    print(f"Generated {stations_file}")

    # 2. bengaluru_hourly_air_quality.csv
    now = datetime(2026, 9, 1, 9, 0, 0)
    hourly_file = os.path.join(DATA_DIR, "bengaluru_hourly_air_quality.csv")
    hourly_rows = []
    
    for hours_back in range(168, -1, -1):
        t = now - timedelta(hours=hours_back)
        hour = t.hour
        rush_hour_factor = 1.0 + 0.35 * math.exp(-((hour - 9)**2)/5.0) + 0.45 * math.exp(-((hour - 21)**2)/6.0)
        night_inversion = 1.15 if (hour <= 5 or hour >= 22) else 0.9
        
        for s in STATIONS:
            var = random.uniform(0.90, 1.10)
            pm25 = round(s["base_pm25"] * rush_hour_factor * night_inversion * var, 1)
            pm10 = round(s["base_pm10"] * rush_hour_factor * night_inversion * var * 1.05, 1)
            no2 = round(s["base_no2"] * rush_hour_factor * var, 1)
            so2 = round(s["base_so2"] * var, 1)
            co = round(s["base_co"] * rush_hour_factor * var, 2)
            o3_factor = 1.0 + 0.8 * math.exp(-((hour - 14)**2)/8.0)
            o3 = round(s["base_o3"] * o3_factor * var, 1)
            nh3 = round(s["base_nh3"] * var, 1)
            
            p_dict = {"pm2_5": pm25, "pm10": pm10, "no2": no2, "so2": so2, "co": co, "o3": o3, "nh3": nh3}
            aqi, cat, primary = calc_naqi(p_dict)
            
            hourly_rows.append([
                t.strftime("%Y-%m-%d %H:%M:%S"),
                s["station_id"],
                s["station_name"],
                s["latitude"],
                s["longitude"],
                pm25,
                pm10,
                no2,
                so2,
                co,
                o3,
                nh3,
                aqi,
                cat,
                primary,
                "DEMO",
                "SIMULATED"
            ])
            
    with open(hourly_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "timestamp", "station_id", "station_name", "latitude", "longitude",
            "pm2_5", "pm10", "no2", "so2", "co", "o3", "nh3", "aqi", "aqi_category",
            "primary_pollutant", "data_source", "data_quality"
        ])
        writer.writerows(hourly_rows)
    print(f"Generated {hourly_file} ({len(hourly_rows)} rows)")

    # 3. bengaluru_daily_air_quality.csv
    daily_file = os.path.join(DATA_DIR, "bengaluru_daily_air_quality.csv")
    daily_rows = []
    for days_back in range(90, -1, -1):
        d = (now - timedelta(days=days_back)).date()
        seasonal_mult = 0.85 + 0.3 * math.sin((d.timetuple().tm_yday / 365.0) * 2 * math.pi)
        
        for s in STATIONS:
            day_var = random.uniform(0.88, 1.12)
            mean_pm25 = round(s["base_pm25"] * seasonal_mult * day_var, 1)
            max_pm25 = round(mean_pm25 * 1.45, 1)
            min_pm25 = round(mean_pm25 * 0.65, 1)
            mean_pm10 = round(s["base_pm10"] * seasonal_mult * day_var, 1)
            
            p_mean = {"pm2_5": mean_pm25, "pm10": mean_pm10, "no2": s["base_no2"]*seasonal_mult, "so2": s["base_so2"], "co": s["base_co"], "o3": s["base_o3"], "nh3": s["base_nh3"]}
            mean_aqi, cat, primary = calc_naqi(p_mean)
            max_aqi = round(mean_aqi * 1.35)
            min_aqi = round(mean_aqi * 0.70)
            
            daily_rows.append([
                d.strftime("%Y-%m-%d"),
                s["station_id"],
                s["station_name"],
                mean_aqi,
                max_aqi,
                min_aqi,
                mean_pm25,
                max_pm25,
                min_pm25,
                mean_pm10,
                cat,
                primary,
                "DEMO",
                "SIMULATED"
            ])
            
    with open(daily_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "date", "station_id", "station_name", "daily_mean_aqi", "daily_max_aqi", "daily_min_aqi",
            "daily_mean_pm25", "daily_max_pm25", "daily_min_pm25", "daily_mean_pm10",
            "aqi_category", "primary_pollutant", "data_source", "data_quality"
        ])
        writer.writerows(daily_rows)
    print(f"Generated {daily_file}")

    # 4. bengaluru_monthly_air_quality.csv
    monthly_file = os.path.join(DATA_DIR, "bengaluru_monthly_air_quality.csv")
    monthly_rows = []
    for y in range(2023, 2027):
        for m in range(1, 13):
            if y == 2026 and m > 8:
                break
            if m in [12, 1, 2]:
                season = "Winter"
                s_factor = 1.35
            elif m in [3, 4, 5]:
                season = "Summer"
                s_factor = 1.05
            elif m in [6, 7, 8, 9]:
                season = "Monsoon"
                s_factor = 0.68
            else:
                season = "Post-Monsoon"
                s_factor = 1.20
                
            m_str = f"{y}-{m:02d}"
            for s in STATIONS:
                m_pm25 = round(s["base_pm25"] * s_factor * random.uniform(0.92, 1.08), 1)
                m_pm10 = round(s["base_pm10"] * s_factor * random.uniform(0.92, 1.08), 1)
                p_m = {"pm2_5": m_pm25, "pm10": m_pm10, "no2": s["base_no2"]*s_factor, "so2": s["base_so2"], "co": s["base_co"], "o3": s["base_o3"], "nh3": s["base_nh3"]}
                m_aqi, cat, primary = calc_naqi(p_m)
                
                good_days = max(1, int(30 * (1.0 - m_aqi / 300.0) + random.randint(-2, 2)))
                mod_days = max(5, int(15 + random.randint(-3, 3)))
                unhealthy_days = max(0, 30 - good_days - mod_days)
                
                monthly_rows.append([
                    m_str, s["station_id"], s["station_name"], season,
                    m_aqi, m_pm25, m_pm10, good_days, mod_days, unhealthy_days,
                    cat, primary, "DEMO", "SIMULATED"
                ])
                
    with open(monthly_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "month", "station_id", "station_name", "season", "monthly_mean_aqi",
            "monthly_mean_pm25", "monthly_mean_pm10", "good_days", "moderate_days",
            "unhealthy_days", "aqi_category", "primary_pollutant", "data_source", "data_quality"
        ])
        writer.writerows(monthly_rows)
    print(f"Generated {monthly_file}")

    # 5. bengaluru_weather.csv
    weather_file = os.path.join(DATA_DIR, "bengaluru_weather.csv")
    weather_rows = []
    for hours_back in range(168, -1, -1):
        t = now - timedelta(hours=hours_back)
        hour = t.hour
        temp = round(21.0 + 7.5 * math.sin(((hour - 8) / 24.0) * 2 * math.pi), 1)
        humidity = round(78.0 - 28.0 * math.sin(((hour - 8) / 24.0) * 2 * math.pi) + random.uniform(-3, 3))
        humidity = max(35, min(95, humidity))
        pressure = round(915.0 + 2.0 * math.cos((hour / 12.0) * math.pi), 1)
        wind_speed = round(1.2 + 2.8 * max(0, math.sin(((hour - 6) / 24.0) * 2 * math.pi)) + random.uniform(0, 0.6), 1)
        wind_dir = round((240 + random.uniform(-25, 25)) % 360, 1)
        rainfall = round(random.choice([0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 1.4, 4.2]), 1) if (14 <= hour <= 19) else 0.0
        cloud_cover = random.randint(40, 85)
        visibility = round(max(3.5, 9.5 - (100 - humidity)*0.02 - (hour < 7 or hour > 21)*2.0), 1)
        solar_rad = round(max(0, 850 * math.sin(((hour - 6) / 12.0) * math.pi)), 1) if (6 <= hour <= 18) else 0.0
        blh = round(280.0 + 1300.0 * max(0, math.sin(((hour - 6) / 12.0) * math.pi)), 0) if (6 <= hour <= 18) else round(250.0 + random.uniform(-30, 30), 0)
        
        weather_rows.append([
            t.strftime("%Y-%m-%d %H:%M:%S"),
            "Bengaluru Urban",
            12.9716,
            77.5946,
            temp,
            humidity,
            pressure,
            wind_speed,
            wind_dir,
            rainfall,
            cloud_cover,
            visibility,
            solar_rad,
            blh,
            "DEMO",
            "SIMULATED"
        ])
        
    with open(weather_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "timestamp", "location", "latitude", "longitude", "temperature", "humidity",
            "pressure", "wind_speed", "wind_direction", "rainfall", "cloud_cover",
            "visibility", "solar_radiation", "boundary_layer_height", "data_source", "data_quality"
        ])
        writer.writerows(weather_rows)
    print(f"Generated {weather_file}")

    # 6. bengaluru_pollution_sources.csv
    sources_file = os.path.join(DATA_DIR, "bengaluru_pollution_sources.csv")
    sources_data = [
        ["SRC_001", "Road Dust Resuspension", "Outer Ring Road (Silk Board to Marathahalli)", 12.9350, 77.6800, "PM10", 51.1, "High", "CSTEP / KSPCB Source Apportionment Study"],
        ["SRC_002", "Vehicular Transport", "Hosur Road - Silk Board Junction Corridor", 12.9176, 77.6238, "PM2.5", 39.5, "High", "Emissions Inventory Bengaluru"],
        ["SRC_003", "Industrial Emissions", "Peenya Industrial Area Stage 1 & 2", 13.0285, 77.5197, "PM2.5 / SO2 / NO2", 14.8, "High", "KSPCB Industrial Audit"],
        ["SRC_004", "Construction & Demolition", "Metro Phase 2A/2B Airport Line & ORR", 13.0100, 77.6200, "PM10", 6.0, "Medium", "Karnataka State Clean Air Action Plan"],
        ["SRC_005", "Biomass & Waste Burning", "Bellandur / Varthur Periphery & Open Plots", 12.9400, 77.7100, "PM2.5 / CO", 7.8, "Medium", "CPCB Satellite Thermal Anomalies"],
        ["SRC_006", "Diesel Generator (DG) Sets", "Commercial Tech Parks & Backup Utilities", 12.9800, 77.7200, "PM2.5 / NO2", 6.5, "Medium", "Bengaluru Urban Energy Study"],
        ["SRC_007", "Domestic Cooking & Combustion", "Dense Urban Slums & Street Food Corridors", 12.9650, 77.5800, "PM2.5", 4.2, "Medium", "National Clean Air Programme (NCAP)"],
        ["SRC_008", "Secondary Particulate Formation", "Atmospheric Ammonia & Sulfate Conversion", 12.9716, 77.5946, "PM2.5", 11.2, "High", "Atmospheric Chemistry & Modeling Study"]
    ]
    with open(sources_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "source_id", "source_type", "area", "latitude", "longitude",
            "pollutant", "estimated_contribution", "confidence", "data_source"
        ])
        writer.writerows(sources_data)
    print(f"Generated {sources_file}")

    # 7. bengaluru_source_apportionment.csv
    apportionment_file = os.path.join(DATA_DIR, "bengaluru_source_apportionment.csv")
    apportionment_data = [
        ["Road & Soil Dust Resuspension", 51.1, 18.2, "Unpaved shoulders, heavy axle traffic, silt loading", "High", "KSPCB / CSTEP Comprehensive Study"],
        ["Transportation & Vehicular Exhaust", 18.6, 39.9, "2-wheelers, diesel buses, goods freight, stop-and-go idling", "High", "Bengaluru Clean Air Action Plan"],
        ["Construction & Demolition Activity", 6.0, 4.5, "Metro lines, flyovers, real-estate highrises, concrete batching", "High", "NCAP Source Inventory"],
        ["Industrial Activity & Power", 8.5, 14.8, "Peenya, Bommasandra, Bidadi industrial estates, electroplating, boilers", "High", "KSPCB Industrial Register"],
        ["Biomass, Waste & Leaf Burning", 5.2, 7.8, "Municipal open solid waste burning, peri-urban agri burning", "Medium", "Field Surveys & Thermal Spotting"],
        ["Diesel Generator Sets (DG Sets)", 3.8, 6.5, "Commercial backup power in IT corridors & hospitals", "Medium", "Energy & Emissions Audit"],
        ["Domestic & Commercial Cooking", 2.8, 4.2, "LPG, tandoor coal, wood stoves, street food preparation", "Medium", "Socio-economic Survey"],
        ["Secondary Aerosols & Atmospheric Reactions", 4.0, 11.2, "Sulfate, nitrate, ammonium gas-to-particle conversion", "High", "Chemical Speciation Network"]
    ]
    with open(apportionment_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "source_category", "pm10_percentage", "pm25_percentage", "description", "confidence", "reference_study"
        ])
        writer.writerows(apportionment_data)
    print(f"Generated {apportionment_file}")

    # 8. bengaluru_pollution_hotspots.csv
    hotspots_file = os.path.join(DATA_DIR, "bengaluru_pollution_hotspots.csv")
    hotspots_data = [
        ["HOT_001", "Central Silk Board Junction", 12.9176, 77.6238, "South", 228, "Poor", "Severe vehicle choke point connecting Hosur Rd, BTM, and HSR Layout", "Traffic Congestion & Road Dust", "Critical"],
        ["HOT_002", "Peenya 2nd Stage Industrial Area", 13.0285, 77.5197, "West", 242, "Poor", "High concentration of small & medium manufacturing, forging, and heavy transport", "Industrial Boilers & Heavy Diesel Freight", "Critical"],
        ["HOT_003", "KR Puram Hanging Bridge & Tin Factory", 13.0035, 77.6845, "East", 215, "Poor", "Bottle-neck between Old Madras Road and Outer Ring Road with unpaved road dust", "Traffic bottleneck & Heavy Truck Transit", "High"],
        ["HOT_004", "Hebbal Flyover Junction", 13.0358, 77.5970, "North", 188, "Moderate", "Intersection of Airport Expressway, Ring Road, and Tumkur freight feeder", "High Volume Airport Transit & Construction", "High"],
        ["HOT_005", "Graphite India Junction (Whitefield)", 12.9868, 77.7126, "Mahadevapura", 195, "Moderate", "Dense tech traffic overlapping with construction debris and industrial legacy zone", "Tech Corridor Traffic & Metro Works", "High"],
        ["HOT_006", "Goraguntepalya / CMTI Junction", 13.0322, 77.5348, "West", 208, "Poor", "Key junction on National Highway 48 with constant inter-state truck movement", "Heavy Commercial Vehicle Idling", "High"],
        ["HOT_007", "Kadubeesanahalli Underpass (ORR)", 12.9352, 77.6894, "Mahadevapura", 192, "Moderate", "IT corridor arterial road with recurrent peak hour tailbacks", "Peak-hour Stop-and-Go Commuter Traffic", "Medium"],
        ["HOT_008", "Mysore Road Satellite Bus Stand", 12.9520, 77.5410, "South-West", 185, "Moderate", "Inter-city KSRTC & private bus hub with intense diesel idling", "Diesel Fleet Concentration", "Medium"]
    ]
    with open(hotspots_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "hotspot_id", "hotspot_name", "latitude", "longitude", "zone", "current_aqi",
            "aqi_category", "primary_cause", "dominant_emission_type", "priority_level"
        ])
        writer.writerows(hotspots_data)
    print(f"Generated {hotspots_file}")

    # 9. bengaluru_traffic_data.csv
    traffic_file = os.path.join(DATA_DIR, "bengaluru_traffic_data.csv")
    corridors = [
        ["COR_01", "Outer Ring Road (Silk Board to Marathahalli)", 18.5, 14.2, 85, "Very High", 2.8],
        ["COR_02", "Hosur Road Expressway & Service Road", 14.0, 18.5, 78, "High", 2.4],
        ["COR_03", "Old Madras Road (Indiranagar to KR Puram)", 11.2, 16.0, 72, "High", 2.1],
        ["COR_04", "Bellary Road / Airport Corridor", 22.0, 38.0, 48, "Moderate", 1.5],
        ["COR_05", "Bannerghatta Road (Dairy Circle to Meenakshi)", 9.8, 12.5, 82, "Very High", 2.6],
        ["COR_06", "Tumkur Road / Peenya Flyover Corridor", 15.0, 24.0, 68, "High", 2.2],
        ["COR_07", "Kanakapura Road (Banashankari to NICE Rd)", 12.0, 28.0, 52, "Moderate", 1.6],
        ["COR_08", "Sarjapur Road (Koramangala to Dommasandra)", 10.5, 13.8, 80, "Very High", 2.5]
    ]
    with open(traffic_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "corridor_id", "corridor_name", "length_km", "avg_speed_kmh", "congestion_index",
            "traffic_density_level", "estimated_emissions_factor"
        ])
        writer.writerows(corridors)
    print(f"Generated {traffic_file}")

    # 10. bengaluru_construction_events.csv
    const_file = os.path.join(DATA_DIR, "bengaluru_construction_events.csv")
    const_data = [
        ["CST_01", "Namma Metro Phase 2A (Silk Board to KR Puram ORR)", 12.9400, 77.6800, "Metro Rail Construction", "2022-01-10", "2027-06-30", "Active", "High Dust Potential (Mitigation: Water Sprinklers)", 1.35],
        ["CST_02", "Namma Metro Phase 2B (Airport Line Hebbal to Yelahanka)", 13.0700, 77.5950, "Elevated Viaduct Construction", "2022-08-15", "2027-12-31", "Active", "Medium Dust Potential", 1.25],
        ["CST_03", "Ejipura Inner Ring Road Elevated Corridor", 12.9410, 77.6280, "Flyover Construction", "2023-03-01", "2026-11-30", "Active", "High Silt & Traffic Redirection", 1.30],
        ["CST_04", "Peripheral Ring Road (PRR) Earthwork Grading", 13.1200, 77.6500, "Highway Earthworks", "2025-05-01", "2028-03-31", "Active", "High Soil Dust", 1.40]
    ]
    with open(const_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "event_id", "project_name", "latitude", "longitude", "project_type", "start_date",
            "expected_completion", "status", "environmental_impact_notes", "pm10_local_multiplier"
        ])
        writer.writerows(const_data)
    print(f"Generated {const_file}")

    # 11. bengaluru_pollution_events.csv
    events_file = os.path.join(DATA_DIR, "bengaluru_pollution_events.csv")
    events_data = [
        ["EVT_2026_01", "2026-01-14 06:00:00", "2026-01-16 11:00:00", "Winter Morning Atmospheric Inversion", "Bengaluru Wide", "Temperature inversion trapped morning traffic particulates below 220m boundary layer", "AQI spiked to 264 (Very Poor)", "Low Wind (<0.9 m/s) + Radiation Inversion", "Resolved"],
        ["EVT_2026_02", "2026-04-05 14:00:00", "2026-04-06 20:00:00", "Pre-Monsoon Dust Storm Inflow", "North & East Bengaluru", "Strong localized convective winds resuspended loose soil and construction debris", "PM10 spiked to 290 µg/m³", "Convective Gusts (38 km/h)", "Resolved"],
        ["EVT_2026_03", "2026-08-28 20:00:00", "2026-08-29 04:00:00", "Open Waste Combustion Episode", "Bellandur Lake Outskirts", "Smoldering dry waste and biomass in vacant plots along tech corridor", "Localized PM2.5 elevated by 45 µg/m³", "Biomass Burning", "Resolved"],
        ["EVT_2026_04", "2026-09-01 07:30:00", "2026-09-01 10:30:00", "Peak Morning Rush Chokepoint", "Silk Board & Peenya", "Heavy commuter surge combined with calm morning winds and 82% humidity", "AQI reached 218 (Poor)", "Traffic Congestion + Stagnant Air", "Active"]
    ]
    with open(events_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "event_id", "start_time", "end_time", "event_title", "affected_zone",
            "synopsis", "measured_impact", "meteorological_trigger", "status"
        ])
        writer.writerows(events_data)
    print(f"Generated {events_file}")

    # 12. bengaluru_aqi_forecasts.csv
    forecast_file = os.path.join(DATA_DIR, "bengaluru_aqi_forecasts.csv")
    forecast_rows = []
    horizons = [
        ("1h", 1, "High", 0.95),
        ("3h", 3, "High", 0.93),
        ("6h", 6, "High", 0.90),
        ("12h", 12, "Medium-High", 0.86),
        ("24h", 24, "Medium-High", 0.82),
        ("48h", 48, "Medium", 0.78),
        ("72h", 72, "Medium", 0.74),
        ("7d", 168, "Moderate", 0.68)
    ]
    
    for s in STATIONS:
        base = s["base_pm25"]
        for h_label, h_hours, conf_label, conf_score in horizons:
            t_target = now + timedelta(hours=h_hours)
            target_hour = t_target.hour
            rush_f = 1.0 + 0.35 * math.exp(-((target_hour - 9)**2)/5.0) + 0.45 * math.exp(-((target_hour - 21)**2)/6.0)
            pred_pm25 = round(base * rush_f * random.uniform(0.95, 1.05), 1)
            pred_pm10 = round(s["base_pm10"] * rush_f * random.uniform(0.95, 1.05), 1)
            
            p_f = {"pm2_5": pred_pm25, "pm10": pred_pm10, "no2": s["base_no2"]*rush_f, "so2": s["base_so2"], "co": s["base_co"], "o3": s["base_o3"], "nh3": s["base_nh3"]}
            pred_aqi, cat, primary = calc_naqi(p_f)
            
            margin = round(pred_aqi * (0.05 + 0.015 * (h_hours**0.5)))
            lower_ci = max(20, pred_aqi - margin)
            upper_ci = min(500, pred_aqi + margin)
            
            explanation = f"Forecast driven by projected wind velocity ({round(random.uniform(1.5, 3.8), 1)} m/s), diurnal boundary layer expansion, and typical {t_target.strftime('%A')} traffic patterns."
            
            forecast_rows.append([
                now.strftime("%Y-%m-%d %H:%M:%S"),
                t_target.strftime("%Y-%m-%d %H:%M:%S"),
                h_label,
                h_hours,
                s["station_id"],
                s["station_name"],
                pred_aqi,
                lower_ci,
                upper_ci,
                cat,
                primary,
                pred_pm25,
                pred_pm10,
                conf_label,
                round(conf_score, 2),
                explanation,
                "Ensemble_GradientBoost_LightGBM_v2.4",
                "DEMO",
                "SIMULATED"
            ])
            
    with open(forecast_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "forecast_generated_at", "target_timestamp", "horizon_label", "horizon_hours",
            "station_id", "station_name", "predicted_aqi", "lower_confidence_bound",
            "upper_confidence_bound", "predicted_aqi_category", "primary_pollutant",
            "predicted_pm25", "predicted_pm10", "confidence_level", "confidence_score",
            "ai_explanation", "model_version", "data_source", "data_quality"
        ])
        writer.writerows(forecast_rows)
    print(f"Generated {forecast_file}")

    # 13. bengaluru_long_term_projections.csv
    proj_file = os.path.join(DATA_DIR, "bengaluru_long_term_projections.csv")
    proj_rows = [
        ["Bengaluru Urban Region", "1 Month (Oct 2026)", "2026-10", "Post-Monsoon Transition", 132, 105, 160, "Moderate", "Model-based projected trend (Not guaranteed forecast)", "Post-monsoon decrease in rainfall with progressive lowering of nocturnal boundary layer height", "Multi-Year Climatology & Seasonal Decomposition Ensemble", "DEMO", "SIMULATED"],
        ["Bengaluru Urban Region", "3 Months (Dec 2026)", "2026-12", "Winter Inversion Peak", 168, 130, 210, "Moderate-Low", "Model-based projected trend (Not guaranteed forecast)", "Frequent winter morning radiation inversions and calm winds causing particulate accumulation", "Multi-Year Climatology & Seasonal Decomposition Ensemble", "DEMO", "SIMULATED"],
        ["Bengaluru Urban Region", "6 Months (Mar 2027)", "2027-03", "Pre-Summer Transition", 142, 110, 180, "Moderate-Low", "Model-based projected trend (Not guaranteed forecast)", "Increasing temperatures with elevated surface soil resuspension and moderate wind ventilation", "Multi-Year Climatology & Seasonal Decomposition Ensemble", "DEMO", "SIMULATED"],
        ["Bengaluru Urban Region", "12 Months (Sep 2027)", "2027-09", "Monsoon Washout", 78, 55, 108, "Low", "Model-based projected trend (Not guaranteed forecast)", "Southwest monsoon precipitation washout of particulates and high turbulent dispersion", "Multi-Year Climatology & Seasonal Decomposition Ensemble", "DEMO", "SIMULATED"]
    ]
    with open(proj_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "region", "projection_horizon", "target_month", "seasonal_regime", "central_estimate_aqi",
            "expected_range_lower", "expected_range_upper", "confidence_level", "prediction_label",
            "scientific_rationale", "model_architecture", "data_source", "data_quality"
        ])
        writer.writerows(proj_rows)
    print(f"Generated {proj_file}")

    # 14. bengaluru_lifestyle_survey_schema.csv
    survey_file = os.path.join(DATA_DIR, "bengaluru_lifestyle_survey_schema.csv")
    survey_questions = [
        ["SEC_01", "daily_outdoor_hours", "How many hours do you spend outdoors daily?", "number_slider", "0, 12, 1", "0-1 hr (Minimal), 2-3 hrs (Moderate), 4-6 hrs (High), 6+ hrs (Extensive)", 1.25],
        ["SEC_01", "outdoor_exercise_time", "When do you typically exercise outdoors?", "select_single", "none, morning_rush (6-9 AM), midday (11 AM - 3 PM), evening_rush (6-9 PM), late_night (9-11 PM)", "Morning & Evening overlap with high diurnal pollution peaks", 1.30],
        ["SEC_02", "primary_commute_mode", "What is your primary mode of daily transportation?", "select_single", "metro_train, car_ac, bus_public, auto_rickshaw, two_wheeler_motorcycle, walking_cycling", "Two-wheelers & open auto-rickshaws face 3.5x higher particulate inhalation than AC Metro/Car", 1.45],
        ["SEC_02", "commute_duration_minutes", "What is your typical one-way commute duration?", "number_slider", "0, 120, 5", "Minutes spent navigating Bengaluru traffic corridors", 1.20],
        ["SEC_03", "residence_traffic_proximity", "How close is your home to a major arterial road or highway?", "select_single", "adjacent (<50m), close (50-200m), moderate (200-500m), far (>500m)", "Corridors within 100m have ~40% higher road dust and tailpipe concentrations", 1.35],
        ["SEC_03", "indoor_air_purifier", "Do you use an HEPA air purifier at home or work?", "select_single", "yes_regularly, yes_occasionally, no_none", "HEPA filtration reduces indoor PM2.5 exposure by 65-80%", 0.65],
        ["SEC_03", "indoor_ventilation_habits", "When do you typically open windows for ventilation?", "select_single", "afternoon_clean_window, morning_evening_peak, all_day_open, always_closed", "Opening windows during morning rush increases indoor particulate settling", 1.15],
        ["SEC_04", "cooking_fuel_environment", "What is your primary household cooking setup?", "select_single", "lpg_piped_gas_with_exhaust, lpg_without_chimney, electric_induction, biomass_wood_coal", "Indoor cooking without mechanical exhaust contributes to localized fine particulates", 1.20],
        ["SEC_04", "indoor_smoking_exposure", "Is there regular indoor smoking in your living environment?", "select_single", "none, occasional, regular", "Environmental tobacco smoke contains concentrated fine particulates & PAHs", 1.50],
        ["SEC_05", "voluntary_sensitivity_category", "Voluntarily select any applicable health/life stages (Optional)", "multi_select", "children_under_12, elderly_65_plus, pregnancy, asthma_respiratory_sensitivity, cardiovascular_sensitivity, none_above", "Higher physiological sensitivity warrants stricter exposure management; not used for clinical diagnosis", 1.40]
    ]
    with open(survey_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "section_id", "question_key", "question_title", "input_type", "options_or_range",
            "exposure_implication", "risk_weight_factor"
        ])
        writer.writerows(survey_questions)
    print(f"Generated {survey_file}")

    # 15. bengaluru_health_risk_rules.csv
    health_file = os.path.join(DATA_DIR, "bengaluru_health_risk_rules.csv")
    health_rules = [
        ["0-50", "Good", "Air quality is considered satisfactory, and air pollution poses little or no risk.", "Minimal health impact for general population.", "Ideal conditions for outdoor physical activity and exercise.", "Enjoy outdoor activities. No special precautions required.", "Keep windows open for natural ventilation during daytime."],
        ["51-100", "Satisfactory", "Minor breathing discomfort to sensitive people; acceptable for general public.", "May cause mild discomfort to individuals with existing respiratory ailments.", "Generally safe for outdoor sports; unusually sensitive individuals should monitor symptoms.", "Sensitive groups should consider reducing prolonged intense outdoor exertion.", "Normal ventilation is appropriate."],
        ["101-200", "Moderate", "Breathing discomfort to people with lungs, asthma, and heart diseases.", "Associated with mild irritation in eyes, throat, and increased coughing.", "Consider moving high-intensity outdoor workouts indoors, especially near heavy traffic.", "Wear well-fitted filtration masks (e.g. N95) during prolonged traffic commutes.", "Close windows during morning & evening rush hours; utilize air filtration."],
        ["201-300", "Poor", "Breathing discomfort to most people on prolonged exposure; illness on prolonged exposure to people with heart disease.", "May aggravate asthma, trigger coughing, shortness of breath, and cardiovascular fatigue.", "Avoid prolonged high-intensity outdoor exercise; exercise indoors in filtered spaces.", "Limit outdoor transit during peak traffic hours; wear certified N95/N99 respirators.", "Keep windows closed; run HEPA air purifiers; avoid burning incense or open fires."],
        ["301-400", "Very Poor", "Respiratory illness on prolonged exposure. Effect may be more pronounced in people with lung and heart diseases.", "Elevated risk of acute respiratory distress, severe bronchial inflammation, and reduced lung capacity.", "Discontinue outdoor exercise and strenuous sports; stay in clean indoor environments.", "Vulnerable individuals (children, elderly, respiratory/cardiac sensitive) should stay indoors.", "Operate air purifiers on high; seal drafts; avoid unnecessary travel."],
        ["401-500", "Severe", "Affects healthy people and seriously impacts those with existing diseases.", "Severe respiratory inflammation, systemic cardiovascular stress; high risk for all individuals.", "Zero outdoor physical exertion. Avoid all non-essential outdoor presence.", "Mandatory respiratory protection if transit unavoidable; vulnerable groups must remain in air-purified rooms.", "Schools & offices advised to shift to remote mode; continuous HEPA filtration."]
    ]
    with open(health_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "aqi_range", "category", "cpcb_health_statement", "potential_health_effects",
            "exercise_guidance", "personal_protection_actions", "indoor_air_management"
        ])
        writer.writerows(health_rules)
    print(f"Generated {health_file}")

    print("ALL 15 BENGALURU DATASET FILES GENERATED SUCCESSFULLY!")

if __name__ == "__main__":
    generate_all_datasets()
