export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getActiveEarlyWarnings } from '@/lib/aeropulse-engine/earlyWarningEngine';

export async function GET() {
  const alerts = getActiveEarlyWarnings();
  return NextResponse.json({
    alerts,
    active_count: alerts.length,
    timestamp: new Date().toISOString()
  });
}
