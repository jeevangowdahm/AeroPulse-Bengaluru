/**
 * Custom Merge Sort Implementation
 * Time Complexity: O(N log N)
 * Used to rank Bengaluru pollution zones and hotspots strictly by composite risk score or AQI.
 */

export interface RankableZone {
  locality: string;
  aqi: number;
  compositeRiskScore: number;
  pm25: number;
  no2: number;
  riskLevel: string;
  [key: string]: any;
}

export function mergeSortByRisk(
  arr: RankableZone[],
  key: 'compositeRiskScore' | 'aqi' = 'compositeRiskScore',
  descending: boolean = true
): RankableZone[] {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSortByRisk(arr.slice(0, mid), key, descending);
  const right = mergeSortByRisk(arr.slice(mid), key, descending);

  return merge(left, right, key, descending);
}

function merge(
  left: RankableZone[],
  right: RankableZone[],
  key: 'compositeRiskScore' | 'aqi',
  descending: boolean
): RankableZone[] {
  const result: RankableZone[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    const valLeft = left[i][key];
    const valRight = right[j][key];

    const condition = descending ? valLeft >= valRight : valLeft <= valRight;

    if (condition) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}
