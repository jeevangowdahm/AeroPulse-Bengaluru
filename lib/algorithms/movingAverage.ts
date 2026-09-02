/**
 * Manual Moving Average & Trend Slope Implementation
 * Used in Early Warning & Prediction Engine for time-series forecasting.
 */

export interface TrendAnalysisResult {
  sma: number[];
  slope: number;
  direction: 'RISING' | 'STABLE' | 'FALLING';
  pctChange: number;
  anomalyDetected: boolean;
}

export function calculateMovingAverage(data: number[], windowSize: number = 3): number[] {
  if (data.length === 0) return [];
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const subset = data.slice(start, i + 1);
    const sum = subset.reduce((acc, curr) => acc + curr, 0);
    result.push(Number((sum / subset.length).toFixed(1)));
  }

  return result;
}

export function analyzeTrend(series: number[]): TrendAnalysisResult {
  if (series.length < 2) {
    return {
      sma: series,
      slope: 0,
      direction: 'STABLE',
      pctChange: 0,
      anomalyDetected: false,
    };
  }

  const sma = calculateMovingAverage(series, 3);
  const first = series[0];
  const last = series[series.length - 1];

  const pctChange = first !== 0 ? Number((((last - first) / first) * 100).toFixed(1)) : 0;

  // Simple Linear Regression slope calculation
  const n = series.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += series[i];
    sumXY += i * series[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);

  // Anomaly detection: point > mean + 2 * stdDev
  const mean = sumY / n;
  const variance = series.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  const anomalyDetected = last > mean + 1.8 * stdDev;

  let direction: 'RISING' | 'STABLE' | 'FALLING' = 'STABLE';
  if (slope > 0.5) direction = 'RISING';
  else if (slope < -0.5) direction = 'FALLING';

  return {
    sma,
    slope: Number(slope.toFixed(2)),
    direction,
    pctChange,
    anomalyDetected,
  };
}
