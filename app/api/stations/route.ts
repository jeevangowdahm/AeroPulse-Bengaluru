export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getStationDataList } from '@/lib/aeropulse-engine/bengaluruStations';
import { AQIStandard } from '@/lib/types/aeropulse';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const standard = (searchParams.get('standard') as AQIStandard) || 'NAQI_INDIA';

  const stations = getStationDataList(standard);

  return NextResponse.json({
    count: stations.length,
    stations
  });
}
