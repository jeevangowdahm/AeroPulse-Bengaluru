export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getProcessedBengaluruZones } from '@/lib/data-providers/bengaluruData';
import { binarySearchSafeZones } from '@/lib/algorithms/binarySearch';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const maxAQI = parseInt(searchParams.get('maxAQI') || '150', 10);

  const zones = getProcessedBengaluruZones();
  // Sort in ascending order of AQI for Binary Search
  const sortedAsc = [...zones].sort((a, b) => a.aqi - b.aqi);

  const { matchedIndex, safeZones } = binarySearchSafeZones(sortedAsc, maxAQI);

  return NextResponse.json({
    success: true,
    targetMaxAQI: maxAQI,
    matchedCount: safeZones.length,
    algorithm: 'Binary Search O(log N) over sorted AQI index',
    matchedIndex,
    safeZones,
    source: 'CPCB Bengaluru Network',
    dataType: 'LIVE',
  });
}
