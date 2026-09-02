export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getGreenSpacesOverview } from '@/lib/aeropulse-engine/greenSpacesData';

export async function GET() {
  const data = getGreenSpacesOverview();
  return NextResponse.json(data);
}
