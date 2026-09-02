import React, { useState } from 'react';
import { LifestyleSurveyData, ExposureRiskResult } from '../types';
import { submitLifestyleSurvey } from '../services/api';
import {
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  Info,
  ShieldCheck,
  Leaf,
  Trees,
  TrendingDown,
  Heart
} from 'lucide-react';

interface PersonalExposureAdvisorViewProps {
  currentAqi: number;
  selectedStationName?: string;
  exposureResult: ExposureRiskResult | null;
  onSetExposureResult: (res: ExposureRiskResult) => void;
}

export const PersonalExposureAdvisorView: React.FC<PersonalExposureAdvisorViewProps> = ({
  currentAqi,
  selectedStationName = "Bengaluru Urban",
  exposureResult,
  onSetExposureResult
}) => {
  const [isSurveyMode, setIsSurveyMode] = useState(exposureResult === null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<LifestyleSurveyData>({
    daily_outdoor_hours: 2.5,
    outdoor_exercise_time: 'morning_rush',
    primary_commute_mode: 'two_wheeler_motorcycle',
    commute_duration_minutes: 45,
    residence_traffic_proximity: 'close',
    indoor_air_purifier: 'no_none',
    indoor_ventilation_habits: 'morning_evening_peak',
    voluntary_sensitivity_category: ['none_above'],
    
    // Footprint reduction dimensions
    vehicle_fuel_type: 'petrol',
    engine_idling_habit: 'sometimes',
    waste_disposal_habit: 'segregated_compost',
    home_greenery_plants_count: '5_to_10_plants',
    home_energy_efficiency: 'moderate',

    current_local_aqi: currentAqi || 176,
    forecast_local_aqi: Math.round((currentAqi || 176) * 1.15)
  });

  const handleSensitivityToggle = (key: string) => {
    setFormData(prev => {
      let updated = [...prev.voluntary_sensitivity_category];
      if (key === 'none_above') {
        return { ...prev, voluntary_sensitivity_category: ['none_above'] };
      }
      updated = updated.filter(k => k !== 'none_above');
      if (updated.includes(key)) {
        updated = updated.filter(k => k !== key);
      } else {
        updated.push(key);
      }
      if (updated.length === 0) updated = ['none_above'];
      return { ...prev, voluntary_sensitivity_category: updated };
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await submitLifestyleSurvey(formData);
      onSetExposureResult(res);
      setIsSurveyMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const subScoresData = exposureResult ? [
    { name: "Outdoor Exposure", score: exposureResult.sub_scores.outdoor_time_score, max: 25, color: "#0284C7" },
    { name: "Commute Inhalation", score: exposureResult.sub_scores.commute_score, max: 25, color: "#D97706" },
    { name: "Exercise Timing", score: exposureResult.sub_scores.exercise_score, max: 20, color: "#DC2626" },
    { name: "Road Proximity", score: exposureResult.sub_scores.residential_score, max: 15, color: "#7C3AED" },
    { name: "Indoor Filtration", score: exposureResult.sub_scores.indoor_score, max: 15, color: "#059669" }
  ] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Friendly Header */}
      <div className="classy-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-700 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              Personal Air Advisor & Footprint Calculator
            </span>
            <span className="text-[11px] font-mono bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200 font-bold">
              Dual Impact Assessment
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Personal Exposure & Clean-Air Contribution Assessment
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Get clear insights on how much pollution you inhale each day, and actionable solutions to both protect your lungs and reduce your personal emissions in Bengaluru.
          </p>
        </div>

        {exposureResult && !isSurveyMode && (
          <button
            onClick={() => {
              setIsSurveyMode(true);
              setStep(1);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl border border-slate-200 flex items-center gap-1.5 transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Survey
          </button>
        )}
      </div>

      {/* SURVEY MODE (5 Clear & Actionable Steps) */}
      {isSurveyMode ? (
        <div className="classy-card rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 shadow-sm">
          {/* Step Progress Tracker */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Step {step} of 5 &bull; {
                step === 1 ? 'Outdoor Routine' :
                step === 2 ? 'Commute & Travel' :
                step === 3 ? 'Living Environment' :
                step === 4 ? 'Home Habits & Plants' :
                'Clean Air Actions'
              }
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-10 bg-sky-600'
                      : s < step
                      ? 'w-3 bg-emerald-500'
                      : 'w-3 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: Outdoor Time & Peak Exercise Window */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>⏱️</span> 1. Daily Outdoor Activity & Workout Hours
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  How much time are you outside exposed to Bengaluru traffic and ambient dust?
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Daily Outdoor Duration:</span>
                  <span className="font-mono font-black text-sky-700 text-lg bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
                    {formData.daily_outdoor_hours} Hours / Day
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={formData.daily_outdoor_hours}
                  onChange={(e) => setFormData({ ...formData, daily_outdoor_hours: parseFloat(e.target.value) })}
                  className="w-full accent-sky-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span>30 mins (Mostly indoors)</span>
                  <span>5 hours</span>
                  <span>10+ hours (Field work)</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  🏃 When do you typically exercise outdoors or walk?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { key: 'morning_rush', label: '🌅 Morning Rush (6:30 – 9:30 AM)', desc: 'Ground temperature inversion traps fine smoke and vehicle exhaust close to the ground.' },
                    { key: 'midday', label: '☀️ Midday (11:00 AM – 4:00 PM)', desc: 'Best natural sun dispersion; boundary layer rises, lowering particulate density.' },
                    { key: 'evening_rush', label: '🌆 Evening Rush (6:00 – 9:30 PM)', desc: 'Heavy stop-and-go traffic emissions along Outer Ring Road & arterial bottlenecks.' },
                    { key: 'none', label: '🏢 Indoor Gym / No Outdoor Workout', desc: 'Exercising in an enclosed, protected indoor space.' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, outdoor_exercise_time: opt.key })}
                      className={`p-4 rounded-2xl border text-left transition ${
                        formData.outdoor_exercise_time === opt.key
                          ? 'bg-sky-50 border-sky-300 text-slate-900 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-sm block text-slate-900 mb-1">{opt.label}</span>
                      <span className="text-[11px] text-slate-500 leading-relaxed block">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Commute Mode & Vehicle Fuel Type */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>🛵</span> 2. Your Travel Mode & Commute Footprint
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  How you travel determines both your direct inhalation and your personal emissions in the city.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Primary Travel Mode in Bengaluru:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { key: 'two_wheeler_motorcycle', label: '2-Wheeler (Standard)', icon: '🛵', note: 'High direct road dust' },
                    { key: 'two_wheeler_with_n95', label: '2-Wheeler with N95 Mask', icon: '😷', note: 'Filters 95% soot' },
                    { key: 'auto_rickshaw', label: 'Auto-Rickshaw', icon: '🛺', note: 'Open cabin transit' },
                    { key: 'bus_public', label: 'BMTC Bus', icon: '🚌', note: 'Low per-person emissions' },
                    { key: 'car_ac', label: 'Car / Cab (AC)', icon: '🚗', note: 'Filtered cabin' },
                    { key: 'metro_train', label: 'Namma Metro', icon: '🚇', note: 'Zero tailpipe exposure' }
                  ].map((opt) => {
                    const isSel = formData.primary_commute_mode === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, primary_commute_mode: opt.key })}
                        className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between gap-1.5 transition ${
                          isSel
                            ? 'bg-sky-50 border-sky-300 text-slate-900 font-bold shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="font-bold text-xs text-slate-900">{opt.label}</span>
                        <span className="text-[10px] text-slate-500">{opt.note}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Vehicle Fuel / Engine Type:</label>
                  <select
                    value={formData.vehicle_fuel_type}
                    onChange={(e) => setFormData({ ...formData, vehicle_fuel_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-500"
                  >
                    <option value="electric_ev">⚡ Electric Vehicle (EV Scooter / EV Car)</option>
                    <option value="public_transit_only">🚇 Public Transit / Metro Commuter (No Personal Vehicle)</option>
                    <option value="petrol">⛽ Petrol Vehicle (BS6 / BS4)</option>
                    <option value="diesel">🛢️ Diesel Vehicle</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Traffic Signal Idling Habit:</label>
                  <select
                    value={formData.engine_idling_habit}
                    onChange={(e) => setFormData({ ...formData, engine_idling_habit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-500"
                  >
                    <option value="always_off_at_signals">🛑 Always switch engine off at long signals (&gt;20s)</option>
                    <option value="sometimes">⏱️ Sometimes switch off at long bottlenecks</option>
                    <option value="keep_running">🚗 Keep engine running continuously</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Residence Location & Urban Park Proximity */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>🏡</span> 3. Residential Location & Green Buffer
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Proximity to busy flyovers or green lung spaces significantly affects ambient air at your doorstep.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { key: 'adjacent', label: '🛣️ Directly on Highway / Main Flyover (<50m)', desc: 'High diesel exhaust, tire-wear dust, and continuous vehicle soot.' },
                  { key: 'close', label: '🏙️ Busy Ring Road / Junction (50–200m)', desc: 'Moderate dispersion; peak rush-hour plumes reach balconies.' },
                  { key: 'moderate', label: '🏡 Inner Layout / Side Street (200–500m)', desc: 'Residential shielding with moderate tree cover.' },
                  { key: 'far_park', label: '🌳 Near Park, Lake, or Forest (>500m)', desc: 'Clean microclimate near Cubbon, Lalbagh, Turahalli, or lake buffers.' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, residence_traffic_proximity: opt.key })}
                    className={`p-4 rounded-2xl border text-left transition ${
                      formData.residence_traffic_proximity === opt.key
                        ? 'bg-sky-50 border-sky-300 text-slate-900 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <span className="font-bold text-sm block text-slate-900 mb-1">{opt.label}</span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Home Indoor Air & Air-Purifying Plants */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>🪴</span> 4. Indoor Air Quality & Greenery Habits
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Air-purifying plants (Areca Palm, Tulsi, Snake Plant) and smart window timings dramatically reduce indoor toxicity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Balcony / Indoor Plants at Home:</label>
                  <select
                    value={formData.home_greenery_plants_count}
                    onChange={(e) => setFormData({ ...formData, home_greenery_plants_count: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-500"
                  >
                    <option value="10_plus_plants_rooftop">🌿 10+ Plants / Rooftop Garden (Natural Bio-filter)</option>
                    <option value="5_to_10_plants">🪴 5 to 10 Potted Plants (Areca, Tulsi, Snake Plant)</option>
                    <option value="1_to_4_plants">🌱 1 to 4 Small Plants</option>
                    <option value="none">❌ No Plants</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Home HEPA Air Purifier:</label>
                  <select
                    value={formData.indoor_air_purifier}
                    onChange={(e) => setFormData({ ...formData, indoor_air_purifier: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-500"
                  >
                    <option value="yes_regularly">✨ Active HEPA Purifier (Regularly Running)</option>
                    <option value="yes_occasionally">🔌 Occasionally during winter/spikes</option>
                    <option value="no_none">❌ No / None</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Window Ventilation Habit:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { key: 'afternoon_clean_window', label: '🌤️ Afternoon (12:00 PM – 4:00 PM)', desc: 'Cleanest time for fresh air; sunlight helps disperse morning traffic soot.' },
                    { key: 'morning_evening_peak', label: '🌅 Morning / Evening Rush Breeze', desc: 'Opening windows during rush hour pulls heavy traffic exhaust indoors.' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, indoor_ventilation_habits: opt.key })}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        formData.indoor_ventilation_habits === opt.key
                          ? 'bg-sky-50 border-sky-300 text-slate-900 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <span className="font-bold text-xs block text-slate-900 mb-0.5">{opt.label}</span>
                      <span className="text-[11px] text-slate-500 leading-relaxed block">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Voluntary Health Factors */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>❤️</span> 5. Household Health Sensitivity Factors
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Optional
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Select any factors that apply to fine-tune your personalized advice. (Non-diagnostic).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { key: 'children_under_12', label: '👶 Children / Toddlers (Under 12 yrs)', desc: 'Lungs are developing; higher breathing rate per body weight.' },
                  { key: 'elderly_65_plus', label: '👵 Seniors / Older Adults (65+ yrs)', desc: 'More susceptible to fine particulate cardiovascular stress.' },
                  { key: 'asthma_respiratory_sensitivity', label: '🫁 Asthma / Dust Allergy / Bronchitis', desc: 'Airway hyper-responsiveness during particulate spikes.' },
                  { key: 'none_above', label: '✨ None / Healthy Adult', desc: 'Standard environmental exposure profile.' }
                ].map((opt) => {
                  const isChecked = formData.voluntary_sensitivity_category.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSensitivityToggle(opt.key)}
                      className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-2 transition ${
                        isChecked
                          ? 'bg-sky-50 border-sky-300 text-slate-900 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm block text-slate-900 mb-0.5">{opt.label}</span>
                        <span className="text-[11px] text-slate-500 leading-relaxed block">{opt.desc}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Wizard Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 hover:opacity-95 text-white text-xs font-black flex items-center gap-2 shadow-lg transition"
              >
                {submitting ? 'Calculating Your Scores...' : 'Generate My Dual Score & Solutions'}
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* DUAL RESULTS VIEW: EXPOSURE SCORE + GREEN FOOTPRINT SCORE + DUAL ACTION PLANS */
        <div className="space-y-6">
          {/* Dual Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score 1: Inhalation Exposure Risk Score */}
            <div className="classy-card rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 block">
                1. Your Inhalation Exposure Risk
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-mono text-slate-900">
                  {exposureResult.personal_exposure_score}
                </span>
                <span className="text-xl font-normal text-slate-400 font-mono">/ 100</span>
                <span
                  className="ml-auto px-3 py-1 rounded-full text-xs font-black"
                  style={{ backgroundColor: `${exposureResult.color}18`, color: exposureResult.color, border: `1.5px solid ${exposureResult.color}40` }}
                >
                  {exposureResult.risk_level} Risk
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {exposureResult.explanation}
              </p>

              {/* Sub-Score Bars */}
              <div className="pt-2 space-y-2 border-t border-slate-200">
                {subScoresData.map((d, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between font-semibold mb-0.5">
                      <span className="text-slate-600">{d.name}</span>
                      <span className="text-slate-900 font-mono font-bold">{d.score} / {d.max}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(d.score / d.max) * 100}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score 2: Clean-Air Contribution Score */}
            <div className="classy-card rounded-3xl p-6 sm:p-7 border border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 shadow-sm space-y-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 block">
                2. Your Clean-Air Green Contribution
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-mono text-emerald-800">
                  {exposureResult.green_footprint_score}
                </span>
                <span className="text-xl font-normal text-slate-400 font-mono">/ 100</span>
                <span className="ml-auto px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {exposureResult.green_badge}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 text-xs font-medium space-y-1">
                <span className="text-slate-500 font-bold block">Estimated Personal Emissions Avoided:</span>
                <span className="text-xl font-black font-mono text-emerald-700">
                  ~{exposureResult.estimated_annual_emissions_saved_kg} kg CO₂ & PM / Year
                </span>
                <p className="text-[11px] text-slate-500">Based on transit mode, zero waste burning, and home greenery.</p>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                <Trees className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Urban Tip: Growing 5 potted plants at home absorbs ~1.2 kg of dust particles each year.</span>
              </div>
            </div>
          </div>

          {/* DUAL ACTIONABLE SOLUTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SOLUTION LIST 1: HEALTH PROTECTION ACTIONS */}
            <div className="classy-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Solutions to Protect Your Health
                </h3>
              </div>
              <p className="text-xs text-slate-500">Specific actions to reduce your particulate inhalation burden:</p>

              <div className="space-y-3">
                {(exposureResult.health_solutions || []).map((sol, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-sky-700">
                      {sol.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{sol.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{sol.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SOLUTION LIST 2: POLLUTION REDUCTION ACTIONS */}
            <div className="classy-card rounded-3xl p-6 border border-emerald-200 bg-emerald-50/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Solutions to Reduce Bengaluru's Pollution
                </h3>
              </div>
              <p className="text-xs text-slate-500">Everyday actions you can take to lower emissions in your city:</p>

              <div className="space-y-3">
                {(exposureResult.reduction_solutions || []).map((sol, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-1 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-700">
                      {sol.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{sol.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{sol.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footnote */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3 text-xs text-slate-500 font-medium">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{exposureResult.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};
