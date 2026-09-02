'use client';

import React from 'react';
import { X, Code2, Cpu, CheckCircle } from 'lucide-react';

interface AlgorithmModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithmName: 'Merge Sort' | 'Binary Search' | 'Pearson Correlation' | 'Moving Average Trend';
}

export const AlgorithmModal: React.FC<AlgorithmModalProps> = ({
  isOpen,
  onClose,
  algorithmName,
}) => {
  if (!isOpen) return null;

  const algoDetails = {
    'Merge Sort': {
      title: 'Manual Merge Sort Hotspot Ranking',
      complexity: 'Time: O(N log N) | Space: O(N)',
      description: 'Used to sort all Bengaluru pollution zones strictly by composite risk score or AQI without hiding logic behind array built-ins.',
      codeSnippet: `function mergeSortByRisk(arr, key = 'compositeRiskScore', descending = true) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSortByRisk(arr.slice(0, mid), key, descending);
  const right = mergeSortByRisk(arr.slice(mid), key, descending);
  return merge(left, right, key, descending);
}`,
      steps: [
        'Divide array of Bengaluru stations into two halves recursively.',
        'Compare composite risk scores across left and right sub-arrays.',
        'Merge elements in descending order to form ranked hotspot list.'
      ]
    },
    'Binary Search': {
      title: 'Binary Search Safe Zone Lookup',
      complexity: 'Time: O(log N) | Space: O(1)',
      description: 'Executes fast logarithmic target matching over pre-sorted Bengaluru AQI index.',
      codeSnippet: `function binarySearchSafeZones(sortedZonesAsc, maxAQIThreshold) {
  let low = 0, high = sortedZonesAsc.length - 1, bestIndex = -1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedZonesAsc[mid].aqi <= maxAQIThreshold) {
      bestIndex = mid; low = mid + 1;
    } else high = mid - 1;
  }
  return { matchedIndex: bestIndex, safeZones: sortedZonesAsc.slice(0, bestIndex + 1) };
}`,
      steps: [
        'Initialize low and high pointers over pre-sorted AQI array.',
        'Evaluate midpoint AQI against user specified safety ceiling.',
        'Slice all candidate safe zones in logarithmic time.'
      ]
    },
    'Pearson Correlation': {
      title: 'Pearson Correlation Coefficient (r) Engine',
      complexity: 'Time: O(N) | Space: O(1)',
      description: 'Computes explicit linear correlation between Traffic Density (%) and NO2 Concentration (µg/m³).',
      codeSnippet: `function calculatePearsonCorrelation(xValues, yValues) {
  const n = xValues.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += xValues[i]; sumY += yValues[i];
    sumXY += xValues[i] * yValues[i];
    sumX2 += xValues[i] ** 2; sumY2 += yValues[i] ** 2;
  }
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX**2) * (n * sumY2 - sumY**2));
  return numerator / denominator;
}`,
      steps: [
        'Iterate through synchronized traffic density and NO2 reading pairs.',
        'Compute sum of products and squared deviations.',
        'Output normalized r value (-1.0 to +1.0) and strength classification.'
      ]
    },
    'Moving Average Trend': {
      title: 'Simple Moving Average & Trend Slope',
      complexity: 'Time: O(N) | Space: O(N)',
      description: 'Filters short-term atmospheric noise and predicts 24-hour pollution spike probability.',
      codeSnippet: `function calculateMovingAverage(data, windowSize = 3) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const subset = data.slice(start, i + 1);
    result.push(subset.reduce((a, b) => a + b, 0) / subset.length);
  }
  return result;
}`,
      steps: [
        'Slide 3-observation window over historical telemetry.',
        'Calculate linear regression slope of smoothed values.',
        'Flag anomalies when reading exceeds mean + 1.8 * stdDev.'
      ]
    }
  }[algorithmName];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-xl border border-purple-500/30 bg-gray-950 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-lg">{algoDetails.title}</h3>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-800 text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm">
          <div className="flex items-center justify-between rounded-lg border border-purple-500/20 bg-purple-950/20 p-3">
            <span className="text-gray-300">{algoDetails.description}</span>
            <span className="rounded bg-purple-900/60 px-2.5 py-1 text-xs font-mono text-purple-300 font-semibold">{algoDetails.complexity}</span>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900/90 p-4 font-mono text-xs text-green-400 overflow-x-auto">
            <div className="flex items-center space-x-2 text-gray-500 mb-2 border-b border-gray-800 pb-1 font-sans text-xs">
              <Code2 className="h-4 w-4 text-purple-400" />
              <span>TypeScript Implementation</span>
            </div>
            <pre>{algoDetails.codeSnippet}</pre>
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase font-semibold tracking-wider text-gray-400">Execution Stepper</div>
            {algoDetails.steps.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-gray-300">
                <CheckCircle className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
