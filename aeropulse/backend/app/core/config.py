"""
AeroPulse Bengaluru - Application Configuration
"""
import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "AeroPulse Bengaluru"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DEMO_MODE: bool = True
    DEFAULT_AQI_STANDARD: str = "NAQI_INDIA" # "NAQI_INDIA" | "US_EPA"
    PRIMARY_CITY: str = "Bengaluru"
    PRIMARY_REGION: str = "Bengaluru Urban Region, Karnataka, India"
    COORDINATES: dict = {"lat": 12.9716, "lon": 77.5946}
    DATA_QUALITY_DEFAULT: str = "SIMULATED"
    DATA_SOURCE_DEFAULT: str = "DEMO"
    MAP_API_KEY: str = "4376f1eb0d9cfd1591a6e424ce3b50d5"
    OPENWEATHER_API_KEY: str = "4376f1eb0d9cfd1591a6e424ce3b50d5"

settings = Settings()
