import React, { useState } from 'react';
import { LifestyleSurveyData, ExposureRiskResult, ViewType } from '../types';
import { submitLifestyleSurvey } from '../services/api';
import {
  ClipboardList,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Bike,
  Car,
  Train,
  Wind,
  Home,
  Flame,
  HeartPulse,
  Sparkles
} from 'lucide-react';

interface LifestyleSurveyViewProps {
  currentAqi: number;
  onSurveyComplete: (result: ExposureRiskResult) => void;
  onNavigate: (view: ViewType) => void;
}

export const LifestyleSurveyView: React.FC<LifestyleSurveyViewProps> = ({
  currentAqi,
  onSurveyComplete,
  onNavigate
}) => {
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
    cooking_fuel_environment: 'lpg_without_chimney',
    indoor_smoking_exposure: 'none',
    voluntary_sensitivity_category: ['none_above'],
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
      onSurveyComplete(res);
      onNavigate('exposure');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Title Card */}
      <div className="glass-panel rounded-2xl p-6 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold font-mono">
          <UserCheck className="w-3.5 h-3.5" />
          5-Minute Personal Exposure Assessment
        </div>
        <h2 className="text-2xl font-black text-white">
          Personal Lifestyle & Air Pollution Exposure Survey
        </h2>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Evaluate how your commute route, exercise routine, and indoor ventilation interact with Bengaluru's ambient air quality to determine your Personal Exposure Score.
        </p>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-sky-400'
                  : s < step
                  ? 'w-4 bg-emerald-500'
                  : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] font-mono text-slate-500 block">Step {step} of 5</span>
      </div>

      {/* Step Container */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        {/* STEP 1: Daily Routine & Exercise */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Step 1: Daily Routine & Outdoor Activity</h3>
              <p className="text-xs text-slate-400">Estimate how much time you spend outdoors during diurnal peaks.</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                How many hours do you spend outdoors daily? (Work, transit, walking, recreation)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={formData.daily_outdoor_hours}
                  onChange={(e) => setFormData({ ...formData, daily_outdoor_hours: parseFloat(e.target.value) })}
                  className="w-full accent-sky-400 bg-slate-800"
                />
                <span className="font-mono font-bold text-sky-400 text-sm w-16 text-right shrink-0">
                  {formData.daily_outdoor_hours} hrs
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                When do you typically exercise outdoors? (Running, walking, sports)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  { key: 'morning_rush', label: 'Morning Rush (6:00 – 9:00 AM)', desc: 'High ground inversion & particulate trapping' },
                  { key: 'midday', label: 'Midday / Afternoon (11:00 AM – 3:30 PM)', desc: 'Maximum solar boundary layer dilution' },
                  { key: 'evening_rush', label: 'Evening Peak (6:00 – 9:30 PM)', desc: 'High commuter traffic emissions' },
                  { key: 'late_night', label: 'Night (10:00 PM onwards)', desc: 'Lower traffic, night cooling' },
                  { key: 'none', label: 'Indoor / No Regular Outdoor Exercise', desc: 'Protected indoor environment' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, outdoor_exercise_time: opt.key })}
                    className={`p-3 rounded-xl border text-left transition ${
                      formData.outdoor_exercise_time === opt.key
                        ? 'bg-sky-500/20 border-sky-500/60 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-slate-200">{opt.label}</span>
                    <span className="text-[10px] text-slate-400">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Commute & Transit Mode */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Step 2: Commute Mode & Traffic Exposure</h3>
              <p className="text-xs text-slate-400">Open-air transport modes face 3.5x higher fine particulate inhalation.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                What is your primary mode of daily transportation in Bengaluru?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {[
                  { key: 'two_wheeler_motorcycle', label: '2-Wheeler / Scooter', icon: Bike, risk: 'High Exposure' },
                  { key: 'auto_rickshaw', label: 'Auto-Rickshaw', icon: Bike, risk: 'High Exposure' },
                  { key: 'bus_public', label: 'BMTC Bus (Non-AC / AC)', icon: Train, risk: 'Moderate Exposure' },
                  { key: 'car_ac', label: 'Personal Car (AC / Cabin Filter)', icon: Car, risk: 'Protected' },
                  { key: 'metro_train', label: 'Namma Metro', icon: Train, risk: 'Low Exposure' },
                  { key: 'walking_cycling', label: 'Walking / Cycling', icon: Bike, risk: 'Extensive Inhalation' }
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSel = formData.primary_commute_mode === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, primary_commute_mode: opt.key })}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center justify-between gap-1.5 transition ${
                        isSel
                          ? 'bg-sky-500/20 border-sky-500/60 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-sky-400" />
                      <span className="font-bold block text-xs">{opt.label}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{opt.risk}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Typical one-way commute duration across Bengaluru traffic:
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={formData.commute_duration_minutes}
                  onChange={(e) => setFormData({ ...formData, commute_duration_minutes: parseInt(e.target.value) })}
                  className="w-full accent-sky-400 bg-slate-800"
                />
                <span className="font-mono font-bold text-sky-400 text-sm w-20 text-right shrink-0">
                  {formData.commute_duration_minutes} mins
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Residence & Traffic Proximity */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Step 3: Residential & Proximity Exposure</h3>
              <p className="text-xs text-slate-400">Locations adjacent to major arterial expressways encounter elevated road dust.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                How close is your residence or workplace to a major arterial road / highway (e.g. ORR, Hosur Rd, Tumkur Rd)?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  { key: 'adjacent', label: 'Directly Adjacent (<50 meters)', desc: 'Direct tailpipe & tire shear dust impact' },
                  { key: 'close', label: 'Close Corridor (50 – 200 meters)', desc: 'High secondary particulate infiltration' },
                  { key: 'moderate', label: 'Moderate Distance (200 – 500 meters)', desc: 'Partial dispersion by urban structures' },
                  { key: 'far', label: 'Set Back / Interior (>500 meters)', desc: 'Canopied residential background' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, residence_traffic_proximity: opt.key })}
                    className={`p-3 rounded-xl border text-left transition ${
                      formData.residence_traffic_proximity === opt.key
                        ? 'bg-sky-500/20 border-sky-500/60 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-slate-200">{opt.label}</span>
                    <span className="text-[10px] text-slate-400">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Indoor Air Quality & Mitigations */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Step 4: Indoor Air Environment & Filtration</h3>
              <p className="text-xs text-slate-400">Indoor mitigations can reduce inhaled particulate burden by up to 80%.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Do you utilize an active HEPA air purifier at home or office?
              </label>
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                {[
                  { key: 'yes_regularly', label: 'Yes, Regularly', desc: 'Continuous HEPA' },
                  { key: 'yes_occasionally', label: 'Occasionally', desc: 'During peak spikes' },
                  { key: 'no_none', label: 'No / None', desc: 'Unfiltered indoor' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, indoor_air_purifier: opt.key })}
                    className={`p-3 rounded-xl border text-center transition ${
                      formData.indoor_air_purifier === opt.key
                        ? 'bg-sky-500/20 border-sky-500/60 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-slate-200">{opt.label}</span>
                    <span className="text-[10px] text-slate-500">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                When do you typically open windows for room ventilation?
              </label>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {[
                  { key: 'afternoon_clean_window', label: 'Afternoon (12 – 4 PM)', desc: 'Best outdoor dispersion' },
                  { key: 'morning_evening_peak', label: 'Morning / Evening Peaks', desc: 'Allows rush-hour dust inside' },
                  { key: 'all_day_open', label: 'All Day Open', desc: 'Continuous ambient equilibrium' },
                  { key: 'always_closed', label: 'Mostly Sealed / AC', desc: 'Shielded from outdoor spikes' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, indoor_ventilation_habits: opt.key })}
                    className={`p-3 rounded-xl border text-left transition ${
                      formData.indoor_ventilation_habits === opt.key
                        ? 'bg-sky-500/20 border-sky-500/60 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-slate-200">{opt.label}</span>
                    <span className="text-[10px] text-slate-400">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Voluntary Sensitivity Category */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Step 5: Voluntary Sensitivity Factors</h3>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  Optional & Non-Diagnostic
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Helps calibrate personal exposure safety thresholds. No clinical diagnosis is performed.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Select any applicable physiological stages or sensitivities (Select all that apply):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  { key: 'children_under_12', label: 'Children (Under 12 yrs)', desc: 'Higher breathing rate per body mass' },
                  { key: 'elderly_65_plus', label: 'Seniors / Older Adults (65+ yrs)', desc: 'Elevated cardiovascular vulnerability' },
                  { key: 'pregnancy', label: 'Pregnancy', desc: 'Fetal & maternal particulate sensitivity' },
                  { key: 'asthma_respiratory_sensitivity', label: 'Asthma / Respiratory Sensitivity', desc: 'Higher bronchospasm reactivity' },
                  { key: 'cardiovascular_sensitivity', label: 'Cardiovascular History', desc: 'Elevated vascular stress from PM2.5' },
                  { key: 'none_above', label: 'None of the Above / Prefer not to say', desc: 'Standard baseline calibration' }
                ].map((opt) => {
                  const isChecked = formData.voluntary_sensitivity_category.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSensitivityToggle(opt.key)}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between gap-2 transition ${
                        isChecked
                          ? 'bg-sky-500/20 border-sky-500/60 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-slate-200">{opt.label}</span>
                        <span className="text-[10px] text-slate-400">{opt.desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-sky-500 border-sky-400 text-white' : 'border-slate-700 bg-slate-950'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/25 transition"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition"
            >
              {submitting ? 'Calculating Score...' : 'Calculate My Exposure Score'}
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
