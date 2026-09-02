export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getStationDataList, getStation24hHistory } from '@/lib/aeropulse-engine/bengaluruStations';
import { getSourceAttribution } from '@/lib/aeropulse-engine/sourceAttributionEngine';
import { getShortTermForecast } from '@/lib/aeropulse-engine/forecastEngine';
import { AQIStandard } from '@/lib/types/aeropulse';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const standard = (searchParams.get('standard') as AQIStandard) || 'NAQI_INDIA';
  const stationId = params.id || 'BLR_ST01';

  const stations = getStationDataList(standard);
  const station = stations.find(s => s.station_id === stationId) || stations[0];
  const history24h = getStation24hHistory(stationId, standard);
  const sources = getSourceAttribution(stationId);
  const forecast = getShortTermForecast(stationId);

  return NextResponse.json({
    station,
    history_24h: history24h,
    source_attribution: sources,
    short_term_forecast: forecast,
    sensor_health: {
      uptime_pct: 99.4,
      packet_delivery_rate: 98.8,
      latency_ms: 42,
      last_calibration: "2026-08-15"
    }
  });
}
