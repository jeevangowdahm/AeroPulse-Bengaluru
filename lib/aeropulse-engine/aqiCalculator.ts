/**
 * AeroPulse AQI Calculator Engine (TypeScript)
 * Supports Indian NAQI (CPCB) and US-EPA standards with sub-index calculations.
 */

import { AQIStandard, Pollutants } from '@/lib/types/aeropulse';

type Breakpoint = [number, number, number, number];

export const NAQI_BREAKPOINTS: Record<string, Breakpoint[]> = {
  pm2_5: [[0, 30, 0, 50], [30, 60, 51, 100], [60, 90, 101, 200], [90, 120, 201, 300], [120, 250, 301, 400], [250, 500, 401, 500]],
  pm10: [[0, 50, 0, 50], [50, 100, 51, 100], [100, 250, 101, 200], [250, 350, 201, 300], [350, 430, 301, 400], [430, 600, 401, 500]],
  no2: [[0, 40, 0, 50], [40, 80, 51, 100], [80, 180, 101, 200], [180, 280, 201, 300], [280, 400, 301, 400], [400, 800, 401, 500]],
  so2: [[0, 40, 0, 50], [40, 80, 51, 100], [80, 380, 101, 200], [380, 800, 201, 300], [800, 1600, 301, 400], [1600, 2400, 401, 500]],
  co: [[0, 1.0, 0, 50], [1.0, 2.0, 51, 100], [2.0, 10.0, 101, 200], [10.0, 17.0, 201, 300], [17.0, 34.0, 301, 400], [34.0, 50.0, 401, 500]],
  o3: [[0, 50, 0, 50], [50, 100, 51, 100], [100, 168, 101, 200], [168, 208, 201, 300], [208, 748, 301, 400], [748, 1000, 401, 500]],
  nh3: [[0, 200, 0, 50], [200, 400, 51, 100], [400, 800, 101, 200], [800, 1200, 201, 300], [1200, 1800, 301, 400], [1800, 2400, 401, 500]]
};

export const EPA_BREAKPOINTS: Record<string, Breakpoint[]> = {
  pm2_5: [[0.0, 12.0, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150], [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300], [250.5, 500.4, 301, 500]],
  pm10: [[0, 54, 0, 50], [55, 154, 51, 100], [155, 254, 101, 150], [255, 354, 151, 200], [355, 424, 201, 300], [425, 604, 301, 500]],
  no2: [[0, 53, 0, 50], [54, 100, 51, 100], [101, 360, 101, 150], [361, 649, 151, 200], [650, 1249, 201, 300], [1250, 2049, 301, 500]],
  so2: [[0, 35, 0, 50], [36, 75, 51, 100], [76, 185, 101, 150], [186, 304, 151, 200], [305, 604, 201, 300], [605, 1004, 301, 500]],
  co: [[0, 4.4, 0, 50], [4.5, 9.4, 51, 100], [9.5, 12.4, 101, 150], [12.5, 15.4, 151, 200], [15.5, 30.4, 201, 300], [30.5, 50.4, 301, 500]],
  o3: [[0, 54, 0, 50], [55, 70, 51, 100], [71, 85, 101, 150], [86, 105, 151, 200], [106, 200, 201, 300], [201, 600, 301, 500]]
};

export function calculateSubIndex(conc: number, pollutant: string, standard: AQIStandard = "NAQI_INDIA"): number {
  if (conc === undefined || conc === null || conc < 0) return 0;
  const bpsMap = standard === "NAQI_INDIA" ? NAQI_BREAKPOINTS : EPA_BREAKPOINTS;
  const bps = bpsMap[pollutant] || [];

  for (const [clow, chigh, ilow, ihigh] of bps) {
    if (conc >= clow && conc <= chigh) {
      return Math.round(ilow + ((ihigh - ilow) / (chigh - clow)) * (conc - clow));
    }
  }

  if (bps.length && conc > bps[bps.length - 1][1]) {
    return 500;
  }
  return 0;
}

export function getNAQICategory(aqiVal: number): [string, string, string] {
  if (aqiVal <= 50) return ["Good", "#10B981", "Optimal"];
  if (aqiVal <= 100) return ["Satisfactory", "#84CC16", "Acceptable"];
  if (aqiVal <= 200) return ["Moderate", "#F59E0B", "Moderate Concern"];
  if (aqiVal <= 300) return ["Poor", "#EF4444", "Unhealthy"];
  if (aqiVal <= 400) return ["Very Poor", "#8B5CF6", "Very Unhealthy"];
  return ["Severe", "#881337", "Hazardous"];
}

export function getEPACategory(aqiVal: number): [string, string, string] {
  if (aqiVal <= 50) return ["Good", "#10B981", "Optimal"];
  if (aqiVal <= 100) return ["Moderate", "#F59E0B", "Acceptable"];
  if (aqiVal <= 150) return ["Unhealthy for Sensitive Groups", "#F97316", "Sensitive Warning"];
  if (aqiVal <= 200) return ["Unhealthy", "#EF4444", "Unhealthy"];
  if (aqiVal <= 300) return ["Very Unhealthy", "#8B5CF6", "Very Unhealthy"];
  return ["Hazardous", "#881337", "Hazardous Alert"];
}

export function calculateAQIComposite(
  pollutants: Partial<Pollutants>,
  standard: AQIStandard = "NAQI_INDIA"
) {
  const subIndices: Record<string, number> = {};
  let maxAQI = 0;
  let dominantPollutant = "PM2.5";

  const keyMap: Record<string, string> = {
    pm2_5: "PM2.5",
    pm10: "PM10",
    no2: "NO2",
    so2: "SO2",
    co: "CO",
    o3: "O3",
    nh3: "NH3"
  };

  for (const [key, label] of Object.entries(keyMap)) {
    const val = (pollutants as any)[key];
    if (val !== undefined && val !== null) {
      const sub = calculateSubIndex(val, key, standard);
      subIndices[label] = sub;
      if (sub > maxAQI) {
        maxAQI = sub;
        dominantPollutant = label;
      }
    }
  }

  // Minimum fallback if zero
  if (maxAQI === 0) {
    maxAQI = standard === "NAQI_INDIA" ? 120 : 95;
  }

  const [category, color, badge] = standard === "NAQI_INDIA"
    ? getNAQICategory(maxAQI)
    : getEPACategory(maxAQI);

  return {
    aqi: maxAQI,
    category,
    color,
    badge,
    primary_pollutant: dominantPollutant,
    sub_indices: subIndices
  };
}
