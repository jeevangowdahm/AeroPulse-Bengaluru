"""
Air Quality Index (AQI) Calculation Engine
Supports both Indian National Air Quality Index (NAQI) and US-EPA standards.
Stores raw pollutant concentrations separately from calculated AQI sub-indices.
"""

from typing import Dict, Any, Tuple, Optional

# Indian NAQI (CPCB) Breakpoints
# Format: (C_low, C_high, I_low, I_high)
NAQI_BREAKPOINTS = {
    "pm2_5": [(0, 30, 0, 50), (30, 60, 51, 100), (60, 90, 101, 200), (90, 120, 201, 300), (120, 250, 301, 400), (250, 500, 401, 500)],
    "pm10": [(0, 50, 0, 50), (50, 100, 51, 100), (100, 250, 101, 200), (250, 350, 201, 300), (350, 430, 301, 400), (430, 600, 401, 500)],
    "no2": [(0, 40, 0, 50), (40, 80, 51, 100), (80, 180, 101, 200), (180, 280, 201, 300), (280, 400, 301, 400), (400, 800, 401, 500)],
    "so2": [(0, 40, 0, 50), (40, 80, 51, 100), (80, 380, 101, 200), (380, 800, 201, 300), (800, 1600, 301, 400), (1600, 2400, 401, 500)],
    "co": [(0, 1.0, 0, 50), (1.0, 2.0, 51, 100), (2.0, 10.0, 101, 200), (10.0, 17.0, 201, 300), (17.0, 34.0, 301, 400), (34.0, 50.0, 401, 500)],
    "o3": [(0, 50, 0, 50), (50, 100, 51, 100), (100, 168, 101, 200), (168, 208, 201, 300), (208, 748, 301, 400), (748, 1000, 401, 500)],
    "nh3": [(0, 200, 0, 50), (200, 400, 51, 100), (400, 800, 101, 200), (800, 1200, 201, 300), (1200, 1800, 301, 400), (1800, 2400, 401, 500)]
}

# US EPA Breakpoints
EPA_BREAKPOINTS = {
    "pm2_5": [(0.0, 12.0, 0, 50), (12.1, 35.4, 51, 100), (35.5, 55.4, 101, 150), (55.5, 150.4, 151, 200), (150.5, 250.4, 201, 300), (250.5, 500.4, 301, 500)],
    "pm10": [(0, 54, 0, 50), (55, 154, 51, 100), (155, 254, 101, 150), (255, 354, 151, 200), (355, 424, 201, 300), (425, 604, 301, 500)],
    "no2": [(0, 53, 0, 50), (54, 100, 51, 100), (101, 360, 101, 150), (361, 649, 151, 200), (650, 1249, 201, 300), (1250, 2049, 301, 500)],
    "so2": [(0, 35, 0, 50), (36, 75, 51, 100), (76, 185, 101, 150), (186, 304, 151, 200), (305, 604, 201, 300), (605, 1004, 301, 500)],
    "co": [(0, 4.4, 0, 50), (4.5, 9.4, 51, 100), (9.5, 12.4, 101, 150), (12.5, 15.4, 151, 200), (15.5, 30.4, 201, 300), (30.5, 50.4, 301, 500)],
    "o3": [(0, 54, 0, 50), (55, 70, 51, 100), (71, 85, 101, 150), (86, 105, 151, 200), (106, 200, 201, 300), (201, 600, 301, 500)]
}

def calculate_sub_index(conc: float, pollutant: str, standard: str = "NAQI_INDIA") -> int:
    """Calculates sub-index for a single pollutant given its concentration."""
    if conc is None or conc < 0:
        return 0
    
    bps_map = NAQI_BREAKPOINTS if standard == "NAQI_INDIA" else EPA_BREAKPOINTS
    bps = bps_map.get(pollutant, [])
    
    for (clow, chigh, ilow, ihigh) in bps:
        if clow <= conc <= chigh:
            # Piecewise linear formula: Ip = ((Ihi - Ilo)/(BPhi - BPlo)) * (Cp - BPlo) + Ilo
            return round(ilow + ((ihigh - ilow) / (chigh - clow)) * (conc - clow))
            
    if bps and conc > bps[-1][1]:
        return 500
    return 0

def get_naqi_category(aqi_val: int) -> Tuple[str, str, str]:
    """Returns (Category Name, Hex Color, Severity Badge) for Indian NAQI."""
    if aqi_val <= 50:
        return ("Good", "#10B981", "Optimal")
    elif aqi_val <= 100:
        return ("Satisfactory", "#84CC16", "Acceptable")
    elif aqi_val <= 200:
        return ("Moderate", "#F59E0B", "Moderate Concern")
    elif aqi_val <= 300:
        return ("Poor", "#EF4444", "Unhealthy")
    elif aqi_val <= 400:
        return ("Very Poor", "#8B5CF6", "Very Unhealthy")
    else:
        return ("Severe", "#881337", "Hazardous")

def get_epa_category(aqi_val: int) -> Tuple[str, str, str]:
    """Returns (Category Name, Hex Color, Severity Badge) for US-EPA."""
    if aqi_val <= 50:
        return ("Good", "#10B981", "Optimal")
    elif aqi_val <= 100:
        return ("Moderate", "#F59E0B", "Acceptable")
    elif aqi_val <= 150:
        return ("Unhealthy for Sensitive Groups", "#F97316", "Sensitive Warning")
    elif aqi_val <= 200:
        return ("Unhealthy", "#EF4444", "Unhealthy")
    elif aqi_val <= 300:
        return ("Very Unhealthy", "#8B5CF6", "Very Unhealthy")
    else:
        return ("Hazardous", "#881337", "Hazardous")

def calculate_aqi_composite(pollutants: Dict[str, float], standard: str = "NAQI_INDIA") -> Dict[str, Any]:
    """
    Computes overall AQI, individual sub-indices, primary pollutant, and standard-specific category.
    """
    normalized = {}
    for k, v in pollutants.items():
        key = k.lower().replace(".", "_").replace("-", "_")
        if v is not None and v >= 0:
            normalized[key] = float(v)
            
    sub_indices = {}
    bps_map = NAQI_BREAKPOINTS if standard == "NAQI_INDIA" else EPA_BREAKPOINTS
    
    for p in bps_map.keys():
        if p in normalized:
            sub_indices[p] = calculate_sub_index(normalized[p], p, standard)
            
    if not sub_indices:
        return {
            "aqi": 0,
            "category": "Unknown",
            "primary_pollutant": "None",
            "color": "#94A3B8",
            "badge": "No Data",
            "sub_indices": {},
            "standard_used": standard
        }
        
    overall_aqi = max(sub_indices.values())
    primary_p = max(sub_indices, key=sub_indices.get).upper().replace("_", ".")
    
    if standard == "NAQI_INDIA":
        category, color, badge = get_naqi_category(overall_aqi)
    else:
        category, color, badge = get_epa_category(overall_aqi)
        
    return {
        "aqi": overall_aqi,
        "category": category,
        "primary_pollutant": primary_p,
        "color": color,
        "badge": badge,
        "sub_indices": {k.upper().replace("_", "."): v for k, v in sub_indices.items()},
        "standard_used": standard
    }
