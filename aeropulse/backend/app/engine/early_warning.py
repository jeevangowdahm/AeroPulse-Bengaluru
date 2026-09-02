"""
Air Quality Early Warning & Anomaly Alert Engine
Monitors real-time station metrics, forecast spikes, meteorological inversions,
and hotspot developments to generate early-warning broadcasts and customizable alerts.
"""

import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from pydantic import BaseModel

class AlertSubscription(BaseModel):
    user_id: Optional[str] = "USR_DEMO"
    station_id: str = "BLR_ST01"
    aqi_threshold: int = 150
    pm25_threshold: float = 60.0
    notify_rapid_spike: bool = True
    notify_inversion_stagnation: bool = True
    channel_web: bool = True
    channel_push: bool = True
    channel_email: bool = False
    channel_sms: bool = False
    contact_email: Optional[str] = ""
    contact_phone: Optional[str] = ""

class EarlyWarningEngine:
    def __init__(self):
        self.active_alerts: List[Dict[str, Any]] = []
        self._generate_system_warnings()

    def _generate_system_warnings(self):
        """Generates realistic live warnings based on Bengaluru current state."""
        self.active_alerts = [
            {
                "id": "WARN_2026_0901_01",
                "severity": "CRITICAL",
                "alert_type": "Rapid Deterioration Forecast",
                "title": "Air Quality Deterioration Warning: South & East Corridors",
                "station_id": "BLR_ST01",
                "affected_area": "Silk Board, BTM Layout & Outer Ring Road",
                "current_aqi": 186,
                "forecast_aqi": 224,
                "primary_pollutant": "PM2.5",
                "lead_time": "Next 6 to 12 Hours",
                "timestamp": "2026-09-01 08:45:00",
                "trigger_condition": "AQI predicted to increase from 186 to 224 (+38 pts) due to calm evening winds and evening rush congestion.",
                "action_advisory": "Sensitive populations should reduce prolonged outdoor exertion. Wear N95 protection if commuting on open two-wheelers between 6:30 PM and 9:30 PM.",
                "color": "#EF4444"
            },
            {
                "id": "WARN_2026_0901_02",
                "severity": "WARNING",
                "alert_type": "Industrial Particulate Hotspot",
                "title": "Elevated Industrial PM10 & SO2 Advisory: Peenya Industrial Zone",
                "station_id": "BLR_ST03",
                "affected_area": "Peenya 1st & 2nd Stage, CMTI Junction",
                "current_aqi": 218,
                "forecast_aqi": 235,
                "primary_pollutant": "PM10 / SO2",
                "lead_time": "Ongoing Episode",
                "timestamp": "2026-09-01 09:15:00",
                "trigger_condition": "Continuous particulate levels exceeding 165 µg/m³ with heavy diesel freight movements.",
                "action_advisory": "Keep commercial facility doors and windows sealed. Industrial workers should adhere to particulate respirator protocols.",
                "color": "#F97316"
            },
            {
                "id": "WARN_2026_0901_03",
                "severity": "ADVISORY",
                "alert_type": "Meteorological Stagnation Watch",
                "title": "Low Dispersion & Boundary Layer Stagnation Watch",
                "station_id": "ALL",
                "affected_area": "Bengaluru Urban Basin",
                "current_aqi": 145,
                "forecast_aqi": 180,
                "primary_pollutant": "PM2.5",
                "lead_time": "Tonight 10:00 PM – Tomorrow 8:00 AM",
                "timestamp": "2026-09-01 09:30:00",
                "trigger_condition": "Surface wind speed forecast drops below 1.1 m/s with nocturnal radiation cooling.",
                "action_advisory": "Refrain from early morning strenuous outdoor running before 8:30 AM tomorrow. Run indoor air purifiers overnight.",
                "color": "#F59E0B"
            }
        ]

    def get_active_warnings(self, station_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Returns active warnings filtered by station or all."""
        if not station_id or station_id == "ALL":
            return self.active_alerts
        return [a for a in self.active_alerts if a["station_id"] in [station_id, "ALL"]]

    def check_thresholds(self, aqi: int, pm25: float, subscription: AlertSubscription) -> Optional[Dict[str, Any]]:
        """Evaluates custom alert thresholds against live reading."""
        if aqi >= subscription.aqi_threshold:
            return {
                "triggered": True,
                "alert_type": "Custom AQI Threshold Breach",
                "message": f"AQI reached {aqi}, crossing your configured threshold of {subscription.aqi_threshold}.",
                "channels": {
                    "web": subscription.channel_web,
                    "push": subscription.channel_push,
                    "email": subscription.channel_email,
                    "sms": subscription.channel_sms
                }
            }
        return None

early_warning_engine = EarlyWarningEngine()
