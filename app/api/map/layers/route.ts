export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getStationDataList } from '@/lib/aeropulse-engine/bengaluruStations';
import { BENGALURU_URBAN_PARKS } from '@/lib/aeropulse-engine/greenSpacesData';

export async function GET() {
  const stations = getStationDataList('NAQI_INDIA');

  return NextResponse.json({
    stations,
    parks: BENGALURU_URBAN_PARKS,
    wind_vectors: {
      speed_ms: 3.2,
      direction_deg: 245,
      streamline_particles_count: 85
    }
  });
}
