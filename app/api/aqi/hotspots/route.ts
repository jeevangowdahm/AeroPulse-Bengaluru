export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getStationDataList } from '@/lib/aeropulse-engine/bengaluruStations';
import { mergeSortByRisk, RankableZone } from '@/lib/algorithms/mergeSort';

export async function GET() {
  const stations = getStationDataList('NAQI_INDIA');

  const formatted: RankableZone[] = stations.map(s => ({
    locality: s.station_name,
    station_id: s.station_id,
    aqi: s.aqi,
    compositeRiskScore: Math.round((s.aqi * 0.45) + (s.pm2_5 * 0.3) + (s.no2 * 0.25)),
    pm25: s.pm2_5,
    pm10: s.pm10,
    no2: s.no2,
    riskLevel: s.category,
    zone: s.zone,
    color: s.color
  }));

  const sorted = mergeSortByRisk(formatted, 'compositeRiskScore', true);

  return NextResponse.json({
    hotspots: sorted.slice(0, 5),
    algorithm: "Merge Sort O(N log N)",
    total_analyzed: formatted.length
  });
}
