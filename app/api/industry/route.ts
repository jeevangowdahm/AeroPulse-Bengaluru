export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { KSPCB_STANDARDS } from '@/lib/data-providers/kspcbStandards';

export async function GET() {
  const industrialUnits = [
    {
      id: 'IND_BLR_01',
      industryName: 'Peenya Electroplating & Metals Cluster',
      area: 'Peenya Industrial Area Stage II',
      type: 'Electroplating & Chemical Finishing',
      pollutant: 'SO2',
      measuredValue: 46.0,
      referenceThreshold: KSPCB_STANDARDS.SO2.twentyFourHourAvg,
      unit: 'µg/m³',
      complianceStatus: 'EXCEEDANCE',
      status: 'WARNING',
      severity: 'MODERATE',
      source: 'KSPCB Continuous Emission Monitoring System (CEMS)',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'IND_BLR_02',
      industryName: 'Bommasandra Chemical Processing Plant',
      area: 'Bommasandra Industrial Estate',
      type: 'Chemical & Polymer Synthesis',
      pollutant: 'NO2',
      measuredValue: 112.0,
      referenceThreshold: KSPCB_STANDARDS.NO2.twentyFourHourAvg,
      unit: 'µg/m³',
      complianceStatus: 'EXCEEDANCE',
      status: 'EXCEEDANCE',
      severity: 'HIGH',
      source: 'KSPCB Stack Monitor #4',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'IND_BLR_03',
      industryName: 'Bidadi Auto Ancillary Foundry',
      area: 'Bidadi Industrial Area',
      type: 'Die Casting & Smelting',
      pollutant: 'PM10',
      measuredValue: 245.0,
      referenceThreshold: KSPCB_STANDARDS.PM10.twentyFourHourAvg,
      unit: 'µg/m³',
      complianceStatus: 'EXCEEDANCE',
      status: 'EXCEEDANCE',
      severity: 'CRITICAL',
      source: 'KSPCB Ambient Sensor Bidadi',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'IND_BLR_04',
      industryName: 'Whitefield Tech Park Captive Power Unit',
      area: 'Whitefield EPIP Zone',
      type: 'Captive Diesel Generation (DG Set)',
      pollutant: 'CO',
      measuredValue: 2.3,
      referenceThreshold: KSPCB_STANDARDS.CO.twentyFourHourAvg,
      unit: 'mg/m³',
      complianceStatus: 'COMPLIANT',
      status: 'COMPLIANT',
      severity: 'LOW',
      source: 'Self-Reported CEMS Telemetry',
      lastUpdated: new Date().toISOString(),
    },
  ];

  return NextResponse.json({
    success: true,
    standards: KSPCB_STANDARDS,
    emissions: industrialUnits,
    monitoredIndustries: industrialUnits,
    exceedanceCount: industrialUnits.filter(u => u.complianceStatus === 'EXCEEDANCE').length,
    disclaimer: 'Status indicates potential exceedance requiring KSPCB field verification. Does not imply legal guilt.',
  });
}
