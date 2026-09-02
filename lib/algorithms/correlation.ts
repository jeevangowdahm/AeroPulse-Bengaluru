/**
 * Custom Pearson Correlation Coefficient (r) Implementation
 * Calculates r between Traffic Density and NO2 Concentration.
 * Range: -1.0 to +1.0
 */

export interface CorrelationResult {
  pearsonR: number;
  sampleSize: number;
  strength: 'Strong Positive' | 'Moderate Positive' | 'Weak Positive' | 'No Correlation' | 'Negative';
  interpretation: string;
}

export function calculatePearsonCorrelation(
  xValues: number[], // e.g. Traffic Density (0-100)
  yValues: number[]  // e.g. NO2 Concentration (µg/m³)
): CorrelationResult {
  const n = Math.min(xValues.length, yValues.length);
  if (n < 2) {
    return {
      pearsonR: 0,
      sampleSize: n,
      strength: 'No Correlation',
      interpretation: 'Insufficient data points to compute Pearson correlation.',
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const x = xValues[i];
    const y = yValues[i];

    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );

  if (denominator === 0) {
    return {
      pearsonR: 0,
      sampleSize: n,
      strength: 'No Correlation',
      interpretation: 'Zero variance detected in input metrics.',
    };
  }

  const r = numerator / denominator;
  let strength: CorrelationResult['strength'] = 'No Correlation';

  if (r >= 0.7) strength = 'Strong Positive';
  else if (r >= 0.4) strength = 'Moderate Positive';
  else if (r >= 0.1) strength = 'Weak Positive';
  else if (r < 0) strength = 'Negative';

  return {
    pearsonR: Number(r.toFixed(4)),
    sampleSize: n,
    strength,
    interpretation: `Traffic density and NO2 concentration exhibit a ${strength.toLowerCase()} linear correlation (r = ${r.toFixed(2)}).`,
  };
}
