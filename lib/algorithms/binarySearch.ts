/**
 * Custom Binary Search Implementation
 * Time Complexity: O(log N)
 * Used in Safe Zone Finder to locate zones with AQI/Risk score <= maxThreshold
 * Array MUST be sorted in ascending order of target key.
 */

import { RankableZone } from './mergeSort';

export function binarySearchSafeZones(
  sortedZonesAsc: RankableZone[],
  maxAQIThreshold: number
): { matchedIndex: number; safeZones: RankableZone[] } {
  let low = 0;
  let high = sortedZonesAsc.length - 1;
  let bestIndex = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = sortedZonesAsc[mid].aqi;

    if (midVal <= maxAQIThreshold) {
      bestIndex = mid; // Found candidate, try to find a higher matching threshold index
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // All elements from index 0 up to bestIndex satisfy AQI <= maxAQIThreshold
  const safeZones = bestIndex >= 0 ? sortedZonesAsc.slice(0, bestIndex + 1) : [];

  return {
    matchedIndex: bestIndex,
    safeZones,
  };
}
