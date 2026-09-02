import { BENGALURU_STATIONS_METADATA } from './bengaluruStations';

export function getSourceAttribution(stationId: string = "BLR_ST01") {
  const st = BENGALURU_STATIONS_METADATA.find(s => s.station_id === stationId) || BENGALURU_STATIONS_METADATA[0];

  // Specific profiles based on zone/station type
  let vehicular = 42;
  let roadDust = 28;
  let construction = 14;
  let industry = 10;
  let biomass = 6;

  if (st.station_id === "BLR_ST02") {
    // Peenya Industrial
    industry = 36;
    vehicular = 30;
    roadDust = 18;
    construction = 10;
    biomass = 6;
  } else if (st.station_id === "BLR_ST06" || st.station_id === "BLR_ST03") {
    // Whitefield / KR Puram (High Metro construction)
    construction = 26;
    vehicular = 38;
    roadDust = 24;
    industry = 6;
    biomass = 6;
  } else if (st.station_id === "BLR_ST07" || st.station_id === "BLR_ST13") {
    // Jayanagar / Malleshwaram (Residential canopy)
    vehicular = 46;
    roadDust = 22;
    construction = 12;
    industry = 8;
    biomass = 12;
  }

  return {
    station_id: st.station_id,
    station_name: st.station_name,
    environment_type: st.environment_type,
    study_benchmark: "CSTEP & KSPCB Comprehensive Bengaluru Air Source Apportionment Study",
    pm25_sources: [
      { name: "Transport & Vehicular Exhaust", percentage: vehicular, color: "#EF4444", description: "Diesel freight trucks, 2-wheelers, and idling passenger cars." },
      { name: "Road Dust Resuspension", percentage: roadDust, color: "#F59E0B", description: "Unpaved road shoulders and mechanical tire abrasion." },
      { name: "Construction Silt & Metro Work", percentage: construction, color: "#8B5CF6", description: "Metro rail piling, commercial excavation, and aggregate hauling." },
      { name: "Industrial Boilers & DG Sets", percentage: industry, color: "#06B6D4", description: "Small-scale diesel generators, dye units, and boiler stacks." },
      { name: "Biomass & Waste Combustion", percentage: biomass, color: "#10B981", description: "Nocturnal dry leaf burning and municipal waste smoldering." }
    ],
    meteorological_factors: {
      boundary_layer_height_m: 620,
      ventilation_coefficient_m2s: 1984,
      inversion_risk: "MODERATE",
      inversion_explanation: "Early morning radiational ground cooling creates shallow mixing layer (<350m), causing emissions to linger near street breathing level."
    },
    actionable_interventions: [
      "BBMP Mechanical sweeping deployed along Hosur Road and Outer Ring Road corridors.",
      "Strict enforcement of green netting barriers around active commercial construction sites.",
      "Traffic signal cycle optimization at Silk Board to reduce idling emissions by 18%."
    ]
  };
}
