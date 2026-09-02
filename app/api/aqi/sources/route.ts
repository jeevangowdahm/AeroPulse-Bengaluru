export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSourceAttribution } from '@/lib/aeropulse-engine/sourceAttributionEngine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stationId = searchParams.get('station_id') || 'BLR_ST01';

  const sources = getSourceAttribution(stationId);
  return NextResponse.json(sources);
}
