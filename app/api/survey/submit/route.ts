export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { calculateLifestyleExposureRisk } from '@/lib/aeropulse-engine/lifestyleRiskEngine';
import { LifestyleSurveyData } from '@/lib/types/aeropulse';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LifestyleSurveyData;
    const result = calculateLifestyleExposureRisk(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid survey payload' }, { status: 400 });
  }
}
