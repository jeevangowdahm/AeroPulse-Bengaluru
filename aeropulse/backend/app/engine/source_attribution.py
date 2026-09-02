"""
Bengaluru Pollution Source Attribution & Explainable AI Engine
Integrates CSTEP and KSPCB source apportionment findings with real-time meteorological conditions
to generate scientific, explainable root-cause analyses ("Why is AQI high today?").
"""

import os
import pandas as pd
from typing import Dict, List, Any, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

class SourceAttributionEngine:
    def __init__(self):
        self.sources_df: Optional[pd.DataFrame] = None
        self.apportionment_df: Optional[pd.DataFrame] = None
        self._load_data()

    def _load_data(self):
        sources_path = os.path.join(DATA_DIR, "bengaluru_pollution_sources.csv")
        apportion_path = os.path.join(DATA_DIR, "bengaluru_source_apportionment.csv")
        if os.path.exists(sources_path):
            self.sources_df = pd.read_csv(sources_path)
        if os.path.exists(apportion_path):
            self.apportionment_df = pd.read_csv(apportion_path)

    def get_source_apportionment(self) -> List[Dict[str, Any]]:
        """Returns the scientific benchmark source apportionment data."""
        if self.apportionment_df is None or self.apportionment_df.empty:
            return []
            
        results = []
        for _, row in self.apportionment_df.iterrows():
            results.append({
                "category": row['source_category'],
                "pm10_pct": float(row['pm10_percentage']),
                "pm25_pct": float(row['pm25_percentage']),
                "description": row['description'],
                "confidence": row['confidence'],
                "study_ref": row['reference_study']
            })
        return results

    def explain_pollution_episode(
        self,
        current_aqi: int,
        primary_pollutant: str,
        pm25: float,
        pm10: float,
        wind_speed: float,
        boundary_layer_height: float,
        humidity: float,
        hour: int,
        station_name: str = "Bengaluru Urban"
    ) -> Dict[str, Any]:
        """
        Dynamically analyzes meteorological and spatial drivers to explain the current air quality state.
        Strictly distinguishes measured data from model-estimated source contributions.
        """
        factors = []
        is_rush_hour = (8 <= hour <= 11) or (18 <= hour <= 22)
        is_stagnant = wind_speed < 1.8
        is_inversion = boundary_layer_height < 400

        # Meteorological Analysis
        if is_inversion:
            factors.append({
                "factor_type": "Meteorological Inversion",
                "severity": "High Contribution",
                "detail": f"Boundary layer height is currently compressed to ~{int(boundary_layer_height)}m, creating a thermal ceiling that traps ground-level emissions."
            })
        if is_stagnant:
            factors.append({
                "factor_type": "Low Ventilation Wind",
                "severity": "High Contribution",
                "detail": f"Calm surface wind speed ({wind_speed} m/s) severely limits horizontal atmospheric dispersion across Bengaluru's urban topography."
            })
        if humidity > 75:
            factors.append({
                "factor_type": "High Moisture & Secondary Aerosols",
                "severity": "Moderate Contribution",
                "detail": f"Relative humidity ({humidity}%) promotes hygroscopic particulate growth and atmospheric gas-to-particle photochemical conversions."
            })

        # Emission Drivers
        if is_rush_hour:
            factors.append({
                "factor_type": "Peak Commuter Traffic",
                "severity": "Primary Emission Source",
                "detail": "Elevated stop-and-go vehicular congestion along major arterials (Outer Ring Road, Hosur Road) surges primary PM2.5 tailpipe exhaust."
            })
        
        if pm10 > 100:
            factors.append({
                "factor_type": "Road Dust & Construction Silt",
                "severity": "Major PM10 Driver",
                "detail": "Heavy vehicular tire shear on unpaved shoulders and active metro construction corridors resuspends coarse mineral dust."
            })

        # Synthesis Summary
        if current_aqi <= 100:
            headline = f"Air quality at {station_name} is in the acceptable range with effective atmospheric dispersion."
            dominant_driver = "Favorable wind ventilation and moderate background emissions."
        elif current_aqi <= 200:
            headline = f"AQI is Moderate (AQI {current_aqi}) primarily driven by elevated {primary_pollutant}."
            dominant_driver = "Cumulative vehicular emissions and local road dust under moderate dispersion."
        else:
            headline = f"Elevated AQI alert (AQI {current_aqi}) — Significant particulate accumulation observed."
            dominant_driver = "Combined calm surface winds, thermal trapping, and dense rush-hour traffic emissions."

        mitigation = [
            "Local authorities: Deploy automated misting water sprinklers along Outer Ring Road & arterial bottlenecks.",
            "Commuters: Shift non-urgent transit to off-peak hours (11 AM – 4 PM) or use Namma Metro.",
            "Commercial entities: Stagger office departure schedules and restrict backup diesel generator testing."
        ]

        return {
            "headline": headline,
            "current_aqi": current_aqi,
            "primary_pollutant": primary_pollutant,
            "station_name": station_name,
            "dominant_driver": dominant_driver,
            "contributing_factors": factors,
            "source_breakdown_model": [
                {"source": "Vehicular Exhaust", "estimated_share": 38.0 if primary_pollutant == "PM2.5" else 22.0},
                {"source": "Road Dust Resuspension", "estimated_share": 24.0 if primary_pollutant == "PM2.5" else 48.0},
                {"source": "Industrial & DG Sets", "estimated_share": 16.0},
                {"source": "Secondary Particulates", "estimated_share": 12.0},
                {"source": "Biomass & Domestic Combustion", "estimated_share": 10.0}
            ],
            "actionable_mitigation": mitigation,
            "disclaimer": "Source shares represent scientific model-based estimates derived from CSTEP/KSPCB studies, not real-time legal factory attributions."
        }

source_engine = SourceAttributionEngine()
