"""
Unit tests for Lifestyle Survey and Personal Exposure Risk Scoring Engine.
"""

from app.engine.lifestyle_risk_engine import calculate_exposure_risk, LifestyleSurveyInput

def test_exposure_risk_calculation():
    survey = LifestyleSurveyInput(
        daily_outdoor_hours=3.5,
        outdoor_exercise_time="morning_rush",
        primary_commute_mode="two_wheeler_motorcycle",
        commute_duration_minutes=60,
        residence_traffic_proximity="close",
        indoor_air_purifier="no_none",
        indoor_ventilation_habits="morning_evening_peak",
        cooking_fuel_environment="lpg_without_chimney",
        indoor_smoking_exposure="none",
        voluntary_sensitivity_category=["asthma_respiratory_sensitivity"],
        current_local_aqi=185,
        forecast_local_aqi=210
    )
    result = calculate_exposure_risk(survey)
    
    assert 0 <= result["personal_exposure_score"] <= 100
    assert result["risk_level"] in ["Low", "Moderate", "High", "Critical"]
    assert "sub_scores" in result
    assert "outdoor_time_score" in result["sub_scores"]
    assert "commute_score" in result["sub_scores"]
    assert len(result["recommendations"]) >= 3
    assert "disclaimer" in result

def test_protected_lifestyle_lower_exposure():
    protected_survey = LifestyleSurveyInput(
        daily_outdoor_hours=0.5,
        outdoor_exercise_time="none",
        primary_commute_mode="metro_train",
        commute_duration_minutes=20,
        residence_traffic_proximity="far",
        indoor_air_purifier="yes_regularly",
        indoor_ventilation_habits="afternoon_clean_window",
        cooking_fuel_environment="electric_induction",
        indoor_smoking_exposure="none",
        voluntary_sensitivity_category=["none_above"],
        current_local_aqi=120,
        forecast_local_aqi=130
    )
    result = calculate_exposure_risk(protected_survey)
    assert result["personal_exposure_score"] < 40
    assert result["risk_level"] in ["Low", "Moderate"]
