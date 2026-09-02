export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getStationDataList } from '@/lib/aeropulse-engine/bengaluruStations';
import { mergeSortByRisk, RankableZone } from '@/lib/algorithms/mergeSort';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const metric = searchParams.get('metric') || 'aqi';

  const stations = getStationDataList('NAQI_INDIA');

  const formatted: RankableZone[] = stations.map((s, idx) => ({
    rank: idx + 1,
    locality: s.station_name,
    station_name: s.station_name,
    station_id: s.station_id,
    zone: s.zone,
    aqi: s.aqi,
    pm25: s.pm2_5,
    pm10: s.pm10,
    no2: s.no2,
    so2: s.so2,
    co: s.co,
    compositeRiskScore: Math.round((s.aqi * 0.45) + (s.pm2_5 * 0.3) + (s.no2 * 0.25)),
    riskLevel: s.category,
    color: s.color,
    badge: s.badge
  }));

  const sortKey = metric === 'pm25' ? 'pm25' : metric === 'no2' ? 'no2' : metric === 'risk' ? 'compositeRiskScore' : 'aqi';
  const sorted = mergeSortByRisk(formatted, sortKey as any, true).map((item, index) => ({
    ...item,
    rank: index + 1
  }));

  return NextResponse.json({
    metric,
    algorithm: "Merge Sort O(N log N)",
    leaderboard: sorted
  });
}
