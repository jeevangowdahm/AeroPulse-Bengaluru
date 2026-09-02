export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getProcessedBengaluruZones } from '@/lib/data-providers/bengaluruData';
import { calculatePearsonCorrelation } from '@/lib/algorithms/correlation';

export async function GET() {
  const zones = getProcessedBengaluruZones();

  const trafficValues = zones.map(z => z.trafficDensity);
  const no2Values = zones.map(z => z.no2);

  const correlation = calculatePearsonCorrelation(trafficValues, no2Values);

  const bottlenecks = zones
    .filter(z => z.trafficDensity >= 70)
    .map(z => ({
      locality: z.locality,
      trafficDensity: z.trafficDensity,
      no2: z.no2,
      aqi: z.aqi,
      probableCauses: [
        'High diesel vehicular idling at signal bottlenecks',
        'Commercial transport corridor congestion',
        'Road width constriction during peak hours'
      ],
      recommendedInterventions: [
        'Dynamic traffic signal timing optimization',
        'Commercial heavy vehicle rerouting during 08:00 - 11:00 AM',
        'Green dust barriers along road corridors'
      ]
    }));

  return NextResponse.json({
    success: true,
    correlation,
    bottlenecks,
    sampleSize: zones.length,
    source: 'Bengaluru Traffic & CPCB NO2 Telemetry',
    dataType: 'LIVE',
    lastUpdated: new Date().toISOString(),
  });
}
