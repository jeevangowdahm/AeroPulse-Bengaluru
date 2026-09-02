/**
 * Backend Risk Engine — Composite Pollution Risk Calculation
 * Computes a weighted, normalized environmental risk score for Bengaluru zones.
 */

export interface EnvironmentalInputs {
  pm25: number;   // µg/m³
  pm10: number;   // µg/m³
  no2: number;    // µg/m³
  so2: number;    // µg/m³
  co: number;     // mg/m³
  o3: number;     // µg/m³
  trafficDensity: number; // 0 - 100
  greenCoverPct: number;  // 0 - 100
  windSpeedKmh: number;   // km/h
  temperatureC: number;   // °C
}

export interface RiskEvaluation {
  compositeRiskScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  dominantPollutant: string;
  contributingFactors: { factor: string; impact: string }[];
  confidence: number;
}

export function evaluateCompositeRisk(inputs: EnvironmentalInputs): RiskEvaluation {
  // Regulatory reference caps (CPCB India Standards)
  const CAP_PM25 = 120; // High severity limit
  const CAP_PM10 = 250;
  const CAP_NO2 = 120;
  const CAP_SO2 = 80;

  // Normalized ratios (0 to 1)
  const normPM25 = Math.min(1, inputs.pm25 / CAP_PM25);
  const normPM10 = Math.min(1, inputs.pm10 / CAP_PM10);
  const normNO2 = Math.min(1, inputs.no2 / CAP_NO2);
  const normSO2 = Math.min(1, inputs.so2 / CAP_SO2);
  const normTraffic = Math.min(1, inputs.trafficDensity / 100);
  const normGreenDeficit = Math.max(0, (35 - inputs.greenCoverPct) / 35); // Target 35% greenery
  const normStagnantWind = inputs.windSpeedKmh < 8 ? 0.8 : inputs.windSpeedKmh < 15 ? 0.4 : 0.1;

  // Weights (Sum = 1.0)
  const wPM25 = 0.30;
  const wPM10 = 0.20;
  const wNO2 = 0.20;
  const wTraffic = 0.15;
  const wGreen = 0.10;
  const wWind = 0.05;

  const rawScore =
    normPM25 * wPM25 +
    normPM10 * wPM10 +
    normNO2 * wNO2 +
    normTraffic * wTraffic +
    normGreenDeficit * wGreen +
    normStagnantWind * wWind;

  const compositeRiskScore = Math.min(100, Math.round(rawScore * 100));

  let riskLevel: RiskEvaluation['riskLevel'] = 'LOW';
  if (compositeRiskScore >= 75) riskLevel = 'CRITICAL';
  else if (compositeRiskScore >= 55) riskLevel = 'HIGH';
  else if (compositeRiskScore >= 35) riskLevel = 'MODERATE';

  // Determine dominant pollutant
  const pollutants = [
    { name: 'PM2.5', val: normPM25 },
    { name: 'PM10', val: normPM10 },
    { name: 'NO2', val: normNO2 },
    { name: 'SO2', val: normSO2 },
  ];
  pollutants.sort((a, b) => b.val - a.val);
  const dominantPollutant = pollutants[0].name;

  // Contributing factors with evidence
  const contributingFactors: RiskEvaluation['contributingFactors'] = [];
  if (normPM25 > 0.5) {
    contributingFactors.push({
      factor: 'Fine Particulate Matter (PM2.5)',
      impact: `Elevated at ${inputs.pm25} µg/m³ (CPCB Standard 60 µg/m³)`
    });
  }
  if (inputs.trafficDensity > 70) {
    contributingFactors.push({
      factor: 'High Traffic Congestion',
      impact: `Traffic density measured at ${inputs.trafficDensity}%, boosting NO2 emissions`
    });
  }
  if (inputs.greenCoverPct < 15) {
    contributingFactors.push({
      factor: 'Low Vegetation Canopy',
      impact: `Green cover is low (${inputs.greenCoverPct}%), reducing natural particulate filtration`
    });
  }
  if (inputs.windSpeedKmh < 8) {
    contributingFactors.push({
      factor: 'Stagnant Atmospheric Conditions',
      impact: `Low wind speed (${inputs.windSpeedKmh} km/h) prevents pollutant dispersion`
    });
  }

  return {
    compositeRiskScore,
    riskLevel,
    dominantPollutant,
    contributingFactors,
    confidence: 0.94,
  };
}
