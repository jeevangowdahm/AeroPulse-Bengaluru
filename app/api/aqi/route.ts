export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getProcessedBengaluruZones } from '@/lib/data-providers/bengaluruData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locality = searchParams.get('locality');

  const zones = getProcessedBengaluruZones();

  if (locality) {
    const matched = zones.find(z => z.locality.toLowerCase().includes(locality.toLowerCase()));
    if (matched) {
      return NextResponse.json({ success: true, data: matched });
    }
    return NextResponse.json({ success: false, error: 'Locality not found in Bengaluru dataset' }, { status: 404 });
  }

  // Calculate citywide averages
  const avgAQI = Math.round(zones.reduce((acc, z) => acc + z.aqi, 0) / zones.length);
  const avgPM25 = Math.round(zones.reduce((acc, z) => acc + z.pm25, 0) / zones.length);
  const avgPM10 = Math.round(zones.reduce((acc, z) => acc + z.pm10, 0) / zones.length);
  const avgNO2 = Math.round(zones.reduce((acc, z) => acc + z.no2, 0) / zones.length);
  const avgRisk = Math.round(zones.reduce((acc, z) => acc + z.compositeRiskScore, 0) / zones.length);

  return NextResponse.json({
    success: true,
    citywide: {
      aqi: avgAQI,
      pm25: avgPM25,
      pm10: avgPM10,
      no2: avgNO2,
      compositeRiskScore: avgRisk,
      lastUpdated: new Date().toISOString(),
      source: 'CPCB / Open-Meteo Bengaluru Network',
      dataType: 'LIVE',
    },
    hotspots: zones,
  });
}
