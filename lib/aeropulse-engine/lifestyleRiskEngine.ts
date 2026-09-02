import { LifestyleSurveyData, ExposureRiskResult } from '@/lib/types/aeropulse';

export function calculateLifestyleExposureRisk(input: LifestyleSurveyData): ExposureRiskResult {
  // Base calculations
  let outdoorScore = Math.min((input.daily_outdoor_hours / 8) * 25, 25);
  
  // Commute mode scoring
  let commuteScore = 15;
  const mode = (input.primary_commute_mode || '').toLowerCase();
  if (mode.includes('two') || mode.includes('bike') || mode.includes('scooter') || mode.includes('walk') || mode.includes('bicycle')) {
    commuteScore = 25;
  } else if (mode.includes('auto') || mode.includes('bus')) {
    commuteScore = 20;
  } else if (mode.includes('metro') || mode.includes('train')) {
    commuteScore = 8;
  } else if (mode.includes('car') || mode.includes('cab')) {
    commuteScore = 12;
  } else if (mode.includes('wfh') || mode.includes('home')) {
    commuteScore = 4;
  }

  // Exercise timing score
  let exerciseScore = 10;
  const exTime = (input.outdoor_exercise_time || '').toLowerCase();
  if (exTime.includes('early') || exTime.includes('morning') || exTime.includes('6am') || exTime.includes('7am')) {
    exerciseScore = 20; // High exposure due to morning thermal inversion
  } else if (exTime.includes('evening') || exTime.includes('rush') || exTime.includes('7pm') || exTime.includes('8pm')) {
    exerciseScore = 18;
  } else if (exTime.includes('afternoon') || exTime.includes('midday') || exTime.includes('12') || exTime.includes('2pm') || exTime.includes('4pm')) {
    exerciseScore = 8; // Best dispersion window
  } else if (exTime.includes('indoor') || exTime.includes('gym') || exTime.includes('none')) {
    exerciseScore = 4;
  }

  // Residential score
  let residentialScore = 10;
  const prox = (input.residence_traffic_proximity || '').toLowerCase();
  if (prox.includes('<50') || prox.includes('arterial') || prox.includes('main road') || prox.includes('junction')) {
    residentialScore = 20;
  } else if (prox.includes('50') || prox.includes('100') || prox.includes('secondary')) {
    residentialScore = 14;
  } else if (prox.includes('interior') || prox.includes('residential') || prox.includes('park') || prox.includes('lake')) {
    residentialScore = 6;
  }

  // Indoor score (filter reduction)
  let indoorScore = 10;
  const purifier = (input.indoor_air_purifier || '').toLowerCase();
  if (purifier.includes('hepa') || purifier.includes('yes') || purifier.includes('active')) {
    indoorScore = 3;
  } else if (purifier.includes('plants') || purifier.includes('partial')) {
    indoorScore = 7;
  } else {
    indoorScore = 10;
  }

  // Vulnerability adjustment
  let vulnerabilityAdj = 0;
  const sensitivities = input.voluntary_sensitivity_category || [];
  if (sensitivities.length > 0 && !sensitivities.includes('None')) {
    vulnerabilityAdj = Math.min(sensitivities.length * 4, 15);
  }

  // Aggregate Personal Exposure Score (0 - 100)
  const totalScore = Math.min(
    Math.round(outdoorScore + commuteScore + exerciseScore + residentialScore + indoorScore + vulnerabilityAdj),
    100
  );

  let riskLevel = "Moderate Exposure";
  let color = "#F59E0B";
  let badge = "Moderate Concern";

  if (totalScore <= 35) {
    riskLevel = "Low Environmental Exposure";
    color = "#10B981";
    badge = "Healthy Lifestyle Shield";
  } else if (totalScore <= 65) {
    riskLevel = "Moderate Exposure Risk";
    color = "#F59E0B";
    badge = "Precaution Recommended";
  } else if (totalScore <= 85) {
    riskLevel = "Elevated Exposure Risk";
    color = "#EF4444";
    badge = "Action Recommended";
  } else {
    riskLevel = "Severe Inhalation Exposure";
    color = "#881337";
    badge = "Urgent Interventions Required";
  }

  // Green Footprint Score
  let footprintScore = 68;
  if (mode.includes('metro') || mode.includes('walk') || mode.includes('bicycle')) {
    footprintScore += 22;
  } else if (mode.includes('two') || mode.includes('car')) {
    footprintScore -= 15;
  }
  footprintScore = Math.min(Math.max(footprintScore, 20), 100);

  return {
    personal_exposure_score: totalScore,
    risk_level: riskLevel,
    color,
    badge,
    explanation: `Your profile indicates an overall exposure index of ${totalScore}/100 in Bengaluru. Commute choices and outdoor timing account for the largest proportion of your cumulative particulate intake.`,
    green_footprint_score: footprintScore,
    green_badge: footprintScore > 75 ? "Eco Champion" : footprintScore > 50 ? "Balanced Footprint" : "Carbon Intensive",
    green_color: footprintScore > 75 ? "#10B981" : footprintScore > 50 ? "#F59E0B" : "#EF4444",
    estimated_annual_emissions_saved_kg: Math.round(footprintScore * 4.2),
    sub_scores: {
      outdoor_time_score: Math.round(outdoorScore),
      commute_score: Math.round(commuteScore),
      exercise_score: Math.round(exerciseScore),
      residential_score: Math.round(residentialScore),
      indoor_score: Math.round(indoorScore),
      vulnerability_adjustment: vulnerabilityAdj
    },
    health_solutions: [
      {
        category: "Exercise Routine",
        title: "Shift Jogging Window to 11:00 AM – 4:00 PM",
        action: "Bengaluru boundary layer height rises from 250m to >800m during midday, dispersing micro-particulates and reducing peak lung deposition."
      },
      {
        category: "Commute Shield",
        title: "Upgrade to N95 / FFP2 Mask During 2-Wheeler Commute",
        action: "Standard cloth masks filter <20% of PM2.5 exhaust. An N95 filter provides >95% protection against ultrafine diesel particulate matter."
      },
      {
        category: "Indoor Environment",
        title: "Deploy True-HEPA Air Purifier in Bedroom",
        action: "Running a certified HEPA unit for 6 hours nightly reduces sleeping exposure by up to 82%."
      }
    ],
    reduction_solutions: [
      {
        category: "Transit Mode",
        title: "Switch 2 Days/Week to Namma Metro",
        action: "Using Namma Metro Purple/Green lines reduces your direct tailpipe inhalation by 64% while abating 210 kg CO2e annually."
      },
      {
        category: "Home Greenery",
        title: "Cultivate Air-Purifying Indoor Plants",
        action: "Introduce Snake Plants (Sansevieria), Areca Palms, and Peace Lilies to improve bedroom micro-oxygenation."
      }
    ],
    recommendations: [
      {
        category: "Immediate Action",
        title: "Avoid Early Morning Outdoor Strenuous Workouts on Hosur Road / Silk Board Corridor",
        action: "Winter & post-monsoon morning inversion traps exhaust at head-level."
      }
    ],
    disclaimer: "This environmental exposure index is computed for informational public health guidance. It does not constitute medical diagnosis or clinical advice."
  };
}
