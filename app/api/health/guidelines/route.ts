export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const guidelines = [
    {
      aqi_range: "0 – 50",
      category: "Good",
      color: "#10B981",
      badge: "Optimal",
      health_impact: "Minimal impact. Clean, pristine air quality suitable for all outdoor sports and activities.",
      action: "Enjoy outdoor activities without restrictions.",
      sensitive_groups: "No precautions needed."
    },
    {
      aqi_range: "51 – 100",
      category: "Satisfactory",
      color: "#84CC16",
      badge: "Acceptable",
      health_impact: "Minor breathing discomfort to highly sensitive individuals with chronic asthma.",
      action: "Normal outdoor activity for the general population.",
      sensitive_groups: "Unusually sensitive people should consider reducing prolonged heavy exertion."
    },
    {
      aqi_range: "101 – 200",
      category: "Moderate",
      color: "#F59E0B",
      badge: "Moderate Concern",
      health_impact: "Breathing discomfort to people with lung disease, asthma, and heart disease.",
      action: "Take more breaks and do less strenuous outdoor activities during peak rush hours.",
      sensitive_groups: "Children, elderly, and individuals with respiratory illness should limit prolonged outdoor exertion."
    },
    {
      aqi_range: "201 – 300",
      category: "Poor",
      color: "#EF4444",
      badge: "Unhealthy",
      health_impact: "Breathing discomfort to most people on prolonged exposure; aggravation of heart and lung conditions.",
      action: "Wear an N95 mask during commutes. Shift outdoor workouts indoors.",
      sensitive_groups: "Avoid outdoor physical activity. Keep indoor windows closed and run HEPA air purifiers."
    },
    {
      aqi_range: "301 – 400",
      category: "Very Poor",
      color: "#8B5CF6",
      badge: "Very Unhealthy",
      health_impact: "Respiratory illness on prolonged exposure. Significant cardiovascular and pulmonary stress.",
      action: "Avoid outdoor activities. Use public transport with closed air-conditioning.",
      sensitive_groups: "Strictly remain indoors. Consult healthcare provider if experiencing chest tightness or persistent coughing."
    },
    {
      aqi_range: "401 – 500",
      category: "Severe",
      color: "#881337",
      badge: "Hazardous",
      health_impact: "Affects healthy people and seriously impacts those with existing diseases. Emergency conditions.",
      action: "Stay indoors. Seal windows and doorways. Continuous indoor air filtration required.",
      sensitive_groups: "Emergency public health advisory. Absolute restriction on outdoor exposure."
    }
  ];

  return NextResponse.json({
    guidelines,
    standard: "CPCB National Air Quality Index (NAQI 2014) & WHO Global Air Quality Guidelines 2021"
  });
}
