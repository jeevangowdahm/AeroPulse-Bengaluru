export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getStationDataList, getCurrentWeather } from '@/lib/aeropulse-engine/bengaluruStations';
import { calculateAQIComposite } from '@/lib/aeropulse-engine/aqiCalculator';
import { getActiveEarlyWarnings } from '@/lib/aeropulse-engine/earlyWarningEngine';
import { AQIStandard } from '@/lib/types/aeropulse';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const standard = (searchParams.get('standard') as AQIStandard) || 'NAQI_INDIA';

  const stations = getStationDataList(standard);
  const weather = getCurrentWeather();
  const warnings = getActiveEarlyWarnings();

  // Compute city composite
  const avgPM25 = Number((stations.reduce((acc, s) => acc + s.pm2_5, 0) / stations.length).toFixed(1));
  const avgPM10 = Number((stations.reduce((acc, s) => acc + s.pm10, 0) / stations.length).toFixed(1));
  const avgNO2 = Number((stations.reduce((acc, s) => acc + s.no2, 0) / stations.length).toFixed(1));
  const avgSO2 = Number((stations.reduce((acc, s) => acc + s.so2, 0) / stations.length).toFixed(1));
  const avgCO = Number((stations.reduce((acc, s) => acc + s.co, 0) / stations.length).toFixed(2));
  const avgO3 = Number((stations.reduce((acc, s) => acc + s.o3, 0) / stations.length).toFixed(1));
  const avgNH3 = Number((stations.reduce((acc, s) => acc + s.nh3, 0) / stations.length).toFixed(1));

  const pollutants = {
    pm2_5: avgPM25,
    pm10: avgPM10,
    no2: avgNO2,
    so2: avgSO2,
    co: avgCO,
    o3: avgO3,
    nh3: avgNH3
  };

  const composite = calculateAQIComposite(pollutants, standard);
  const primaryStation = stations[0]; // Silk Board

  return NextResponse.json({
    city: "Bengaluru",
    region: "Bengaluru Urban Region, Karnataka, India",
    timestamp: new Date().toISOString(),
    aqi_standard: standard,
    city_composite: {
      aqi: composite.aqi,
      category: composite.category,
      primary_pollutant: composite.primary_pollutant,
      color: composite.color,
      badge: composite.badge,
      pollutants,
      sub_indices: composite.sub_indices
    },
    primary_station: primaryStation,
    weather,
    active_warnings_count: warnings.length,
    demo_banner: "Model-driven synthetic telemetry calibrated against KSPCB & CSTEP Bengaluru studies."
  });
}
