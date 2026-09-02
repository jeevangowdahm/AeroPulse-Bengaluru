export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { BENGALURU_DATASETS_REGISTRY } from '@/lib/aeropulse-engine/datasetsRegistry';

export async function GET() {
  return NextResponse.json({
    dataset_count: BENGALURU_DATASETS_REGISTRY.length,
    datasets: BENGALURU_DATASETS_REGISTRY
  });
}
