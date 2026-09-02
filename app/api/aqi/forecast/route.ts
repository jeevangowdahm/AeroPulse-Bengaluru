export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getShortTermForecast, getLongTermProjections } from '@/lib/aeropulse-engine/forecastEngine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stationId = searchParams.get('station_id') || 'BLR_ST01';

  const shortTerm = getShortTermForecast(stationId);
  const longTerm = getLongTermProjections();

  return NextResponse.json({
    station_id: stationId,
    short_term_forecast: shortTerm,
    long_term_projections: longTerm,
    telemetry: {
      ml_model: "AeroPulse-GBM-Bengaluru-v2.4",
      features: [
        { name: "Boundary Layer Height (m)", importance: 0.34, status: "Compressing (620m)" },
        { name: "Wind Velocity & Direction", importance: 0.26, status: "3.2 m/s (WSW)" },
        { name: "Arterial Congestion Index", importance: 0.22, status: "Elevated (74%)" },
        { name: "Diurnal Harmonics & Temp", importance: 0.18, status: "27.4°C" }
      ],
      metrics: {
        r2_score: 0.884,
        mae: 7.2,
        rmse: 10.4
      }
    }
  });
}
