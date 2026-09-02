export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const greenPriorityList = [
    {
      wardName: 'Peenya Industrial Area',
      greenCoverPct: 6.1,
      canopyDensityIndex: 0.12,
      priorityRank: 'Priority 1 (Critical)',
      priorityScore: 94,
      recommendedIntervention: 'Industrial Green Buffer & Heavy Dust Vegetation Barriers (Neem, Pongamia)',
      targetReductionPct: 24.5,
      confidence: 0.89,
    },
    {
      wardName: 'Silk Board Corridor',
      greenCoverPct: 8.5,
      canopyDensityIndex: 0.18,
      priorityRank: 'Priority 2 (High)',
      priorityScore: 88,
      recommendedIntervention: 'Roadside Canopy Planting & Flyover Vertical Gardens',
      targetReductionPct: 18.2,
      confidence: 0.91,
    },
    {
      wardName: 'Majestic Bus Terminal',
      greenCoverPct: 9.8,
      canopyDensityIndex: 0.21,
      priorityRank: 'Priority 3 (High)',
      priorityScore: 82,
      recommendedIntervention: 'Transit Terminal Urban Forest Buffer & Park Restoration',
      targetReductionPct: 15.0,
      confidence: 0.88,
    },
    {
      wardName: 'Whitefield IT Corridor',
      greenCoverPct: 12.0,
      canopyDensityIndex: 0.28,
      priorityRank: 'Priority 4 (Moderate)',
      priorityScore: 74,
      recommendedIntervention: 'Corporate Corridor Tree Avenues & Median Vegetative Strips',
      targetReductionPct: 12.4,
      confidence: 0.85,
    },
  ];

  return NextResponse.json({
    success: true,
    priorities: greenPriorityList,
    source: 'BBMP Green Cover & Satellite Vegetation Canopy Survey',
    dataType: 'ESTIMATED',
    lastUpdated: new Date().toISOString(),
  });
}
