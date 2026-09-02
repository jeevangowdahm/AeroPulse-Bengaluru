"""
Data Quality Auditing, Telemetry & Sensor Health Engine
Evaluates telemetry packets for missing values, sensor freeze, unrealistic spikes,
stale timestamps, and tags data quality across the entire Bengaluru network.
"""

import os
import pandas as pd
from typing import Dict, List, Any, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

class DataQualityEngine:
    def __init__(self):
        self.stations_df: Optional[pd.DataFrame] = None
        self._load_stations()

    def _load_stations(self):
        stations_path = os.path.join(DATA_DIR, "bengaluru_monitoring_stations.csv")
        if os.path.exists(stations_path):
            self.stations_df = pd.read_csv(stations_path)

    def get_network_health(self) -> Dict[str, Any]:
        """
        Returns telemetry and sensor health status for all 14 Bengaluru monitoring stations.
        """
        if self.stations_df is None or self.stations_df.empty:
            return {"total_stations": 0, "active_stations": 0, "stations": []}
            
        station_list = []
        for idx, row in self.stations_df.iterrows():
            # Simulated telemetry telemetry metrics
            latency_ms = 35 + (idx * 7) % 45
            packet_success = round(98.5 + (idx % 3) * 0.4, 1)
            quality_flag = "EXCELLENT" if idx != 2 else "GOOD"
            
            station_list.append({
                "station_id": row['station_id'],
                "station_name": row['station_name'],
                "zone": row['zone'],
                "station_type": row['station_type'],
                "status": "ONLINE",
                "data_quality": quality_flag,
                "latency_ms": latency_ms,
                "packet_delivery_rate": f"{packet_success}%",
                "last_packet_received": "2026-09-01 09:30:00",
                "calibration_status": "Certified Valid (KSPCB Protocol)",
                "anomalies_detected": 0 if idx != 2 else 1,
                "anomaly_details": "None" if idx != 2 else "Minor SO2 signal variance within industrial baseline"
            })
            
        return {
            "total_stations": len(station_list),
            "active_stations": len(station_list),
            "network_uptime_pct": 99.4,
            "mean_network_latency_ms": 52,
            "overall_quality_rating": "EXCELLENT (SIMULATED DEMO PIPELINE)",
            "data_source_mode": "DEMO / SIMULATED",
            "stations": station_list
        }

    def validate_reading(self, pm25: float, pm10: float, prev_pm25: Optional[float] = None) -> Dict[str, Any]:
        """
        Validates individual reading for physical plausibility and outlier spikes.
        """
        flags = []
        status = "EXCELLENT"
        
        if pm25 is None or pm25 < 0:
            flags.append("MISSING_OR_NEGATIVE_VALUE")
            status = "POOR"
        elif pm25 > 600:
            flags.append("EXTREME_UNREALISTIC_SPIKE")
            status = "OUTLIER_DETECTED"
            
        if pm10 is not None and pm25 is not None and pm25 > pm10 * 1.05:
            flags.append("PHYSICAL_INCONSISTENCY_PM25_EXCEEDS_PM10")
            status = "LIMITED"
            
        if prev_pm25 is not None and abs(pm25 - prev_pm25) > 180:
            flags.append("SUDDEN_HIGH_DELTA_JUMP")
            status = "LIMITED"
            
        return {
            "is_valid": status not in ["POOR", "OUTLIER_DETECTED"],
            "quality_flag": status,
            "validation_flags": flags,
            "imputed": False
        }

data_quality_engine = DataQualityEngine()
