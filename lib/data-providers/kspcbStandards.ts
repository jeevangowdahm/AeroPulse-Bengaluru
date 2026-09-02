/**
 * KSPCB & CPCB (Central Pollution Control Board India) Official Ambient Air Quality Standards
 * Thresholds based on NAAQS Notification 2009.
 */

export interface RegulatoryStandard {
  pollutant: string;
  annualAvg: number;
  twentyFourHourAvg: number;
  unit: string;
  jurisdiction: string;
  source: string;
  effectiveDate: string;
}

export const KSPCB_STANDARDS: Record<string, RegulatoryStandard> = {
  PM25: {
    pollutant: 'PM2.5',
    annualAvg: 40,
    twentyFourHourAvg: 60,
    unit: 'µg/m³',
    jurisdiction: 'India (CPCB / KSPCB)',
    source: 'NAAQS Gazette Notification 2009',
    effectiveDate: '2009-11-18',
  },
  PM10: {
    pollutant: 'PM10',
    annualAvg: 60,
    twentyFourHourAvg: 100,
    unit: 'µg/m³',
    jurisdiction: 'India (CPCB / KSPCB)',
    source: 'NAAQS Gazette Notification 2009',
    effectiveDate: '2009-11-18',
  },
  NO2: {
    pollutant: 'NO2',
    annualAvg: 40,
    twentyFourHourAvg: 80,
    unit: 'µg/m³',
    jurisdiction: 'India (CPCB / KSPCB)',
    source: 'NAAQS Gazette Notification 2009',
    effectiveDate: '2009-11-18',
  },
  SO2: {
    pollutant: 'SO2',
    annualAvg: 50,
    twentyFourHourAvg: 80,
    unit: 'µg/m³',
    jurisdiction: 'India (CPCB / KSPCB)',
    source: 'NAAQS Gazette Notification 2009',
    effectiveDate: '2009-11-18',
  },
  CO: {
    pollutant: 'CO',
    annualAvg: 2.0,
    twentyFourHourAvg: 4.0,
    unit: 'mg/m³',
    jurisdiction: 'India (CPCB / KSPCB)',
    source: 'NAAQS Gazette Notification 2009',
    effectiveDate: '2009-11-18',
  },
};
