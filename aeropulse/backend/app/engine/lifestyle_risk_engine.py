"""
Personal Lifestyle & Exposure Risk Scoring Engine
Computes:
1. 0-100 Personal Exposure Risk Score (Inhalation Risk - Lower is safer)
2. 0-100 Clean-Air Green Contribution Score (Pollution Footprint - Higher is cleaner)
Provides dual solutions: Protecting personal health + Reducing personal pollution footprint in Bengaluru.
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel

class LifestyleSurveyInput(BaseModel):
    # Exposure Inhalation Dimensions
    daily_outdoor_hours: float = 2.5
    outdoor_exercise_time: str = "morning_rush" # morning_rush, midday, evening_rush, late_night, none
    primary_commute_mode: str = "two_wheeler_motorcycle" # two_wheeler_motorcycle, two_wheeler_with_n95, auto_rickshaw, bus_public, car_ac, metro_train, walking_cycling, ev_two_wheeler_or_car
    commute_duration_minutes: int = 45
    residence_traffic_proximity: str = "close" # adjacent (<50m), close (50-200m), moderate (200-500m), far_park (>500m/near park)
    indoor_air_purifier: str = "no_none" # yes_regularly, yes_occasionally, no_none
    indoor_ventilation_habits: str = "morning_evening_peak" # afternoon_clean_window, morning_evening_peak, all_day_open, always_closed
    voluntary_sensitivity_category: List[str] = ["none_above"]
    
    # Personal Pollution Footprint Dimensions
    vehicle_fuel_type: str = "petrol" # electric_ev, petrol, diesel, public_transit_only, bicycle_walk
    engine_idling_habit: str = "sometimes" # always_off_at_signals, sometimes, keep_running
    waste_disposal_habit: str = "segregated_compost" # segregated_compost, municipality_bin, occasional_garden_burning
    home_greenery_plants_count: str = "5_to_10_plants" # none, 1_to_4_plants, 5_to_10_plants, 10_plus_plants_rooftop
    home_energy_efficiency: str = "moderate" # high_solar_inverter, moderate, standard_grid
    
    current_local_aqi: int = 155
    forecast_local_aqi: int = 178

COMMUTE_MULTIPLIERS = {
    "walking_cycling": 1.35,
    "two_wheeler_motorcycle": 1.45,
    "two_wheeler_with_n95": 0.40,
    "auto_rickshaw": 1.20,
    "bus_public": 0.85,
    "car_ac": 0.50,
    "ev_two_wheeler_or_car": 0.45,
    "metro_train": 0.30
}

EXERCISE_MULTIPLIERS = {
    "morning_rush": 1.35, # 6:30-9:30 AM ground inversion
    "evening_rush": 1.40, # 6-9:30 PM traffic congestion
    "midday": 0.65,       # 11 AM - 4 PM optimal boundary layer dilution
    "late_night": 1.05,
    "none": 0.20
}

PROXIMITY_MULTIPLIERS = {
    "adjacent": 1.35,
    "close": 1.15,
    "moderate": 0.85,
    "far_park": 0.60
}

PURIFIER_FACTORS = {
    "yes_regularly": 0.40,
    "yes_occasionally": 0.70,
    "no_none": 1.10
}

def calculate_exposure_risk(survey: LifestyleSurveyInput) -> Dict[str, Any]:
    """
    Computes both the 0-100 Personal Exposure Risk Score and the 0-100 Clean-Air Contribution Score.
    """
    base_aqi_factor = min(survey.current_local_aqi / 300.0, 1.3)
    forecast_factor = min(survey.forecast_local_aqi / 300.0, 1.3)
    aqi_blended = 0.65 * base_aqi_factor + 0.35 * forecast_factor

    # 1. Outdoor Hours Exposure (0 - 25 pts)
    outdoor_hrs = min(survey.daily_outdoor_hours, 12.0)
    score_outdoor = min(25.0, (outdoor_hrs / 8.0) * 25.0 * aqi_blended)

    # 2. Commute Exposure (0 - 25 pts)
    commute_mins = min(survey.commute_duration_minutes, 120)
    comm_mult = COMMUTE_MULTIPLIERS.get(survey.primary_commute_mode, 1.0)
    score_commute = min(25.0, (commute_mins / 60.0) * 16.0 * comm_mult * aqi_blended)

    # 3. Exercise Timing Exposure (0 - 20 pts)
    ex_mult = EXERCISE_MULTIPLIERS.get(survey.outdoor_exercise_time, 0.8)
    score_exercise = min(20.0, 14.0 * ex_mult * aqi_blended) if survey.outdoor_exercise_time != "none" else 2.0

    # 4. Residential & Proximity Exposure (0 - 15 pts)
    prox_mult = PROXIMITY_MULTIPLIERS.get(survey.residence_traffic_proximity, 1.0)
    score_residential = min(15.0, 11.0 * prox_mult * aqi_blended)

    # 5. Indoor Environment Exposure (0 - 15 pts)
    pur_mult = PURIFIER_FACTORS.get(survey.indoor_air_purifier, 1.0)
    vent_mult = 1.25 if survey.indoor_ventilation_habits == "morning_evening_peak" else (0.75 if survey.indoor_ventilation_habits == "afternoon_clean_window" else 0.9)
    score_indoor = min(15.0, 10.0 * pur_mult * vent_mult * aqi_blended)

    raw_total = score_outdoor + score_commute + score_exercise + score_residential + score_indoor

    # Health category adjustment
    vuln_count = len([v for v in survey.voluntary_sensitivity_category if v != "none_above"])
    vuln_multiplier = 1.0 + min(vuln_count * 0.08, 0.24)
    final_exposure_score = min(100, max(5, round(raw_total * vuln_multiplier)))

    # Classification
    if final_exposure_score <= 30:
        risk_level = "Low"
        risk_color = "#059669"
        risk_badge = "Minimal Exposure Risk"
    elif final_exposure_score <= 55:
        risk_level = "Moderate"
        risk_color = "#D97706"
        risk_badge = "Moderate Exposure Risk"
    elif final_exposure_score <= 75:
        risk_level = "High"
        risk_color = "#DC2626"
        risk_badge = "High Exposure Risk"
    else:
        risk_level = "Critical"
        risk_color = "#881337"
        risk_badge = "Severe Exposure Alert"

    # ==========================================
    # GREEN CONTRIBUTION / FOOTPRINT SCORE (0 - 100)
    # ==========================================
    green_points = 50.0 # Base neutral

    # Vehicle / Transit Contribution
    if survey.vehicle_fuel_type in ["electric_ev", "public_transit_only", "bicycle_walk"] or survey.primary_commute_mode in ["metro_train", "walking_cycling"]:
        green_points += 20.0
    elif survey.vehicle_fuel_type == "petrol":
        green_points += 5.0
    elif survey.vehicle_fuel_type == "diesel":
        green_points -= 15.0

    # Engine Idling
    if survey.engine_idling_habit == "always_off_at_signals":
        green_points += 10.0
    elif survey.engine_idling_habit == "keep_running":
        green_points -= 10.0

    # Waste Burning / Composting
    if survey.waste_disposal_habit == "segregated_compost":
        green_points += 10.0
    elif survey.waste_disposal_habit == "occasional_garden_burning":
        green_points -= 20.0

    # Home & Balcony Plants
    if survey.home_greenery_plants_count == "10_plus_plants_rooftop":
        green_points += 12.0
    elif survey.home_greenery_plants_count == "5_to_10_plants":
        green_points += 8.0
    elif survey.home_greenery_plants_count == "1_to_4_plants":
        green_points += 4.0

    # Energy
    if survey.home_energy_efficiency == "high_solar_inverter":
        green_points += 8.0

    final_green_score = min(100, max(10, round(green_points)))

    if final_green_score >= 80:
        green_badge = "Eco-Champion & Clean Mobility Pioneer"
        green_color = "#059669"
    elif final_green_score >= 60:
        green_badge = "Conscious Urban Citizen"
        green_color = "#65A30D"
    elif final_green_score >= 40:
        green_badge = "Moderate Footprint"
        green_color = "#D97706"
    else:
        green_badge = "High Emission Footprint"
        green_color = "#DC2626"

    # Explainability
    drivers = []
    if comm_mult >= 1.25 and commute_mins >= 30:
        drivers.append(f"commuting {commute_mins} mins via open road transport")
    if survey.outdoor_exercise_time in ["morning_rush", "evening_rush"]:
        drivers.append(f"exercising outdoors during peak diurnal traffic smog hours")
    if survey.residence_traffic_proximity in ["adjacent", "close"]:
        drivers.append("living near an arterial ring road / highway corridor")
    if survey.indoor_air_purifier == "no_none":
        drivers.append("lack of indoor HEPA filtration")

    if drivers:
        explanation = f"Your inhalation score is {final_exposure_score}/100, driven by " + ", ".join(drivers[:3]) + f" under prevailing Bengaluru AQI ({survey.current_local_aqi})."
    else:
        explanation = f"Your inhalation score is {final_exposure_score}/100. Your protective habits shield you well from ambient Bengaluru AQI ({survey.current_local_aqi})."

    # Solutions for PERSONAL HEALTH PROTECTION (Inhalation reduction)
    health_solutions = [
        {
            "category": "Commute Protection",
            "title": "Wear an N95 Mask on Two-Wheelers or Switch to Namma Metro",
            "action": "A certified N95 respirator reduces fine soot inhalation by up to 90% in stop-and-go Bengaluru traffic (Silk Board, Tin Factory, Hebbal)."
        },
        {
            "category": "Exercise Timing",
            "title": "Shift Outdoor Workouts to 12:30 PM – 4:30 PM",
            "action": "Solar heating lifts the ground thermal inversion in the afternoon, cutting particulate density by 35–45% compared to 7:00–9:00 AM."
        },
        {
            "category": "Indoor Ventilation",
            "title": "Ventilate Only During Afternoon Sunshine",
            "action": "Keep windows firmly shut between 6:30–9:30 AM and 6:30–9:30 PM when traffic exhaust peaks. Open windows for 30 mins during clean midday hours."
        }
    ]

    # Solutions for COMMUNITY POLLUTION REDUCTION (Personal Footprint reduction)
    reduction_solutions = [
        {
            "category": "Clean Mobility Shift",
            "title": "Adopt Namma Metro & BMTC Feeder Buses",
            "action": "Replacing 2 days of solo motorcycle or car commute with Namma Metro eliminates ~3.2 kg of PM2.5 and 180 kg of CO2 emissions annually per commuter."
        },
        {
            "category": "Traffic Signal Etiquette",
            "title": "Turn Off Engine at Signals (>20 Seconds)",
            "action": "Switching off ignition at long signals (e.g. Silk Board, Marathahalli) saves fuel and prevents toxic ground-level carbon monoxide buildup."
        },
        {
            "category": "Urban Greenery & Air Purifying Plants",
            "title": "Grow High-Absorption Balcony & Indoor Plants",
            "action": "NASA studies show 4–5 potted Areca Palms, Snake Plants (Sansevieria), or Tulsi per room absorb indoor VOCs and naturally filter fine dust."
        },
        {
            "category": "Zero Open Burning",
            "title": "Compost Dry Leaves & Report Waste Burning",
            "action": "Never burn dry garden leaves or plastic waste. Composting dry foliage enriches Bengaluru soil while preventing dangerous smoke plumes."
        }
    ]

    return {
        "personal_exposure_score": final_exposure_score,
        "risk_level": risk_level,
        "color": risk_color,
        "badge": risk_badge,
        "explanation": explanation,
        "green_footprint_score": final_green_score,
        "green_badge": green_badge,
        "green_color": green_color,
        "estimated_annual_emissions_saved_kg": round((final_green_score / 100.0) * 140.0, 1),
        "sub_scores": {
            "outdoor_time_score": round(score_outdoor, 1),
            "commute_score": round(score_commute, 1),
            "exercise_score": round(score_exercise, 1),
            "residential_score": round(score_residential, 1),
            "indoor_score": round(score_indoor, 1),
            "vulnerability_adjustment": round((vuln_multiplier - 1.0) * 100, 1)
        },
        "health_solutions": health_solutions,
        "reduction_solutions": reduction_solutions,
        "recommendations": health_solutions + reduction_solutions,
        "disclaimer": "This assessment provides lifestyle insights and environmental guidance. It does not constitute a clinical medical diagnosis."
    }
