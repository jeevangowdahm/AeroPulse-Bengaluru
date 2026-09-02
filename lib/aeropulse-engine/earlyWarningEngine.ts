import { EarlyWarning } from '@/lib/types/aeropulse';

export function getActiveEarlyWarnings(): EarlyWarning[] {
  const now = new Date();
  return [
    {
      id: "WARN-BLR-001",
      severity: "CRITICAL",
      alert_type: "Particulate Inversion Spike",
      title: "Nocturnal Temperature Inversion Watch — Silk Board & Hosur Road",
      station_id: "BLR_ST01",
      affected_area: "Silk Board Junction / BTM Layout Corridor",
      current_aqi: 186,
      forecast_aqi: 228,
      primary_pollutant: "PM2.5",
      lead_time: "Next 4 Hours",
      timestamp: now.toISOString(),
      trigger_condition: "Boundary Layer Height dropping below 280m + Peak Evening Traffic Surge",
      action_advisory: "Sensitive individuals, children, and elderly should avoid outdoor physical exertion. Two-wheeler commuters strongly advised to wear N95 masks.",
      color: "#EF4444"
    },
    {
      id: "WARN-BLR-002",
      severity: "WARNING",
      alert_type: "Industrial Proxy Concentration",
      title: "Elevated SO2 & PM10 Stagnation — Peenya Industrial Area",
      station_id: "BLR_ST02",
      affected_area: "Peenya Industrial Zone & Tumkur Road",
      current_aqi: 198,
      forecast_aqi: 215,
      primary_pollutant: "PM10 / SO2",
      lead_time: "Next 6 Hours",
      timestamp: now.toISOString(),
      trigger_condition: "Low wind velocity (<1.5 m/s) with industrial boiler emission accumulation",
      action_advisory: "Industrial workers and local residents should keep windows closed and utilize indoor filtration.",
      color: "#F59E0B"
    },
    {
      id: "WARN-BLR-003",
      severity: "ADVISORY",
      alert_type: "Construction Dust Advisory",
      title: "Metro Phase 2A Alignment Dust Suspension — KR Puram & Tin Factory",
      station_id: "BLR_ST03",
      affected_area: "KR Puram Railway Station / Old Madras Road",
      current_aqi: 164,
      forecast_aqi: 178,
      primary_pollutant: "PM10",
      lead_time: "Next 12 Hours",
      timestamp: now.toISOString(),
      trigger_condition: "Elevated surface wind resuspending unmitigated excavation silt",
      action_advisory: "BBMP water sprinkling tankers requested along arterial roads. Pedestrians advised eye protection.",
      color: "#3B82F6"
    }
  ];
}
