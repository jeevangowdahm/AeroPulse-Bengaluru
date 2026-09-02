"""
Unit tests for Indian NAQI and US EPA AQI calculations.
"""

from app.engine.aqi_calculator import calculate_sub_index, calculate_aqi_composite, get_naqi_category

def test_pm25_naqi_sub_indices():
    # CPCB Breakpoints: 0-30 -> 0-50, 30-60 -> 51-100, 60-90 -> 101-200, 90-120 -> 201-300
    assert calculate_sub_index(15.0, "pm2_5", "NAQI_INDIA") == 25
    assert calculate_sub_index(45.0, "pm2_5", "NAQI_INDIA") == 76
    assert calculate_sub_index(75.0, "pm2_5", "NAQI_INDIA") in [150, 151]
    assert calculate_sub_index(105.0, "pm2_5", "NAQI_INDIA") in [250, 251]

def test_composite_aqi_determination():
    pollutants = {
        "pm2_5": 78.5, # NAQI sub-index ~ 162 (Moderate)
        "pm10": 110.0, # NAQI sub-index ~ 107 (Moderate)
        "no2": 32.0,   # NAQI sub-index ~ 40 (Good)
        "so2": 10.0,
        "co": 1.2,
        "o3": 25.0,
        "nh3": 18.0
    }
    res = calculate_aqi_composite(pollutants, standard="NAQI_INDIA")
    assert res["aqi"] == 162
    assert res["category"] == "Moderate"
    assert res["primary_pollutant"] == "PM2.5"
    assert "PM2.5" in res["sub_indices"]

def test_category_colors():
    cat, color, badge = get_naqi_category(35)
    assert cat == "Good" and color == "#10B981"
    cat, color, badge = get_naqi_category(245)
    assert cat == "Poor" and color == "#EF4444"
