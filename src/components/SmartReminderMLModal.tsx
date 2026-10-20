import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/audio';
import { UserProfile, ReminderMLSettings, MicroWorkoutPlan } from '../types';
import { updateReminderSettings } from '../utils/storage';
import { 
  predict24hReceptivityCurve, 
  detectUserChronotype, 
  getCurrentReceptivityAnalysis,
  getOptimalNextReminder,
  MICRO_WORKOUT_CATALOG
} from '../utils/receptivityML';
import { smartNotificationEngine } from '../utils/smartNotificationEngine';
import { 
  Bell, 
  BellRing, 
  Zap, 
  Brain, 
  Shield, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  X, 
  Play, 
  TrendingUp, 
  Activity, 
  Moon, 
  Sun, 
  Compass, 
  Sliders, 
  Send,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onLaunchMicroWorkout: (plan: MicroWorkoutPlan) => void;
  onRefreshProfile: () => void;
}

export const SmartReminderMLModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  onLaunchMicroWorkout,
  onRefreshProfile,
}) => {
  const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>(
    smartNotificationEngine.getPermission()
  );
  const [testSent, setTestSent] = useState<boolean>(false);

  const settings: ReminderMLSettings = profile.reminderSettings || {
    notificationsEnabled: true,
    autoSmartScheduling: true,
    dailyFrequency: 3,
    quietHoursStart: 22,
    quietHoursEnd: 7,
    userChronotype: 'auto_detected',
    completedMicroWorkoutsCount: 2,
  };

  const curve = predict24hReceptivityCurve(profile);
  const chronotypeInfo = detectUserChronotype(profile);
  const currentAnalysis = getCurrentReceptivityAnalysis(profile);
  const nextReminder = getOptimalNextReminder(profile);

  const handleToggleNotifications = async () => {
    soundFx.playClick();
    if (!settings.notificationsEnabled) {
      const permission = await smartNotificationEngine.requestPermission();
      setNotificationStatus(permission);
      const updated = updateReminderSettings({ notificationsEnabled: true });
      smartNotificationEngine.scheduleNextSmartReminder(updated);
      onRefreshProfile();
    } else {
      updateReminderSettings({ notificationsEnabled: false });
      onRefreshProfile();
    }
  };

  const handleChangeFrequency = (freq: 1 | 2 | 3 | 4) => {
    soundFx.playClick();
    updateReminderSettings({ dailyFrequency: freq });
    onRefreshProfile();
  };

  const handleTriggerTestNotification = () => {
    soundFx.playPowerUp();
    setTestSent(true);
    const plan = smartNotificationEngine.triggerInstantMLReminder(profile);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
    setTimeout(() => setTestSent(false), 4000);
  };

  const activeSelectedWindow = curve[selectedHour] || curve[10];
  const selectedPlan = MICRO_WORKOUT_CATALOG[activeSelectedWindow.recommendedMicroType] || MICRO_WORKOUT_CATALOG.stroop_blitz;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="w-full max-w-lg bg-[#F4F9F6] rounded-3xl shadow-2xl border border-[#CBDDD2] overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#173727] via-[#1E4332] to-[#2B5740] p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-[#F6C667] shadow-inner">
                <BellRing className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-emerald-400/20 text-emerald-300 rounded-full border border-emerald-400/30">
                    Machine Learning Chrono-Engine
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-0.5">
                  Promemoria Intelligente Micro-Allenamento
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-[#122219]">
            
            {/* 1. Live Current Receptivity Card */}
            <div className="bg-white rounded-2xl p-4 border border-[#CBDDD2] shadow-xs relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#527363]">
                    <Clock className="w-3.5 h-3.5 text-[#1E4332]" />
                    <span>Ora Attuale: {new Date().getHours()}:00</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-[#1E4332]">
                      {currentAnalysis.window.label}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#142A1F] mt-1 flex items-center gap-2">
                    Ricettività Neurale: {currentAnalysis.currentScore}%
                    {currentAnalysis.isOptimalNow && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 animate-pulse">
                        Momento Ottimale
                      </span>
                    )}
                  </h3>
                </div>

                {/* Progress Ring / Gauge */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#E5EFE9"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke={currentAnalysis.currentScore >= 75 ? '#10B981' : '#F59E0B'}
                      strokeWidth="4"
                      strokeDasharray={125}
                      strokeDashoffset={125 - (125 * currentAnalysis.currentScore) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-mono font-bold text-[#153424]">
                    {currentAnalysis.currentScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#4F7060] mt-2 leading-relaxed">
                {currentAnalysis.actionMessage}
              </p>

              {/* Recommended Micro-Workout CTA */}
              <div className="mt-3 pt-3 border-t border-[#EAF2ED] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E8F4EE] text-[#1E4332] flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#557565] block">Consigliato Ora:</span>
                    <span className="text-xs font-bold text-[#153325]">{currentAnalysis.microWorkout.title}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onLaunchMicroWorkout(currentAnalysis.microWorkout);
                    onClose();
                  }}
                  className="py-1.5 px-3 bg-[#1E4332] hover:bg-[#153124] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Avvia (60s)
                </button>
              </div>
            </div>

            {/* 2. 24-Hour ML Circadian Curve Visualizer */}
            <div className="bg-white rounded-2xl p-4 border border-[#CBDDD2] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F4533] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Curva Predittiva di Ricettività 24 Ore
                  </h4>
                  <p className="text-[11px] text-[#557766]">
                    Algoritmo di machine learning basato sul ritmo circadiano e sui tuoi orari di allenamento.
                  </p>
                </div>

                <span className="text-[10px] font-mono text-[#527363] bg-[#EAF3EE] px-2 py-0.5 rounded-md">
                  {profile.sessionsHistory.length} Sessioni Apprese
                </span>
              </div>

              {/* 24-Hour Interactive Bar Chart */}
              <div className="pt-2 pb-1">
                <div className="flex items-end justify-between gap-1 h-28 px-1 bg-[#F9FCFA] rounded-xl border border-[#E5EFE9] p-2">
                  {curve.map((item) => {
                    const isSelected = item.hour === selectedHour;
                    const isCurrent = item.hour === new Date().getHours();
                    const heightPercent = Math.max(10, item.probability);

                    let barColor = 'bg-[#CBDDD2]';
                    if (item.probability >= 85) barColor = 'bg-emerald-500';
                    else if (item.probability >= 70) barColor = 'bg-emerald-400';
                    else if (item.probability >= 50) barColor = 'bg-amber-300';
                    else barColor = 'bg-slate-200';

                    if (isSelected) {
                      barColor = 'bg-[#1E4332] ring-2 ring-emerald-400';
                    }

                    return (
                      <button
                        key={item.hour}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedHour(item.hour);
                        }}
                        className="flex-1 flex flex-col items-center justify-end h-full group relative focus:outline-none"
                        title={`Ore ${item.hour}:00 - Ricettività: ${item.probability}% (${item.label})`}
                      >
                        {/* Selected Indicator */}
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mb-0.5 animate-ping absolute -top-1" />
                        )}

                        <div
                          className={`w-full rounded-t-sm transition-all duration-300 ${barColor}`}
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[8px] font-mono text-[#719181] mt-1">
                          {item.hour % 4 === 0 ? `${item.hour}h` : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail on selected hour */}
              <div className="bg-[#F0F7F3] p-3 rounded-xl border border-[#D3E7DC] flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#183627]">
                      Ore {activeSelectedWindow.hour.toString().padStart(2, '0')}:00 • {activeSelectedWindow.label}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 font-mono">
                      {activeSelectedWindow.probability}%
                    </span>
                    {activeSelectedWindow.isHistoricalPeak && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                        Tuo Picco Storico
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#476B5A] mt-1 leading-snug">
                    {activeSelectedWindow.reasoning}
                  </p>
                  <span className="text-[10px] text-[#1E4332] font-semibold block mt-1">
                    🎯 Micro-Workout Ottimale: {selectedPlan.title} (+{selectedPlan.xpReward} XP)
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onLaunchMicroWorkout(selectedPlan);
                    onClose();
                  }}
                  className="p-2 bg-[#1E4332] hover:bg-[#163526] text-white rounded-xl shadow-xs transition active:scale-95 shrink-0"
                  title="Avvia questo micro-workout"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* 3. ML Chronotype & Spaced Repetition Insights */}
            <div className="bg-white rounded-2xl p-4 border border-[#CBDDD2] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F4533] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-600" />
                  Profilo Cronobiologico Rilevato dal Modello
                </h4>
                <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-2 py-0.5 rounded-full">
                  {chronotypeInfo.confidence}% Accuratezza
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#F8FAF9] p-2.5 rounded-xl border border-[#E3EDE7]">
                  <span className="text-[10px] text-[#608070] uppercase font-bold block">Cronotipo Predetto</span>
                  <span className="font-bold text-[#142A1F] text-sm mt-0.5 block">{chronotypeInfo.chronotype}</span>
                </div>
                <div className="bg-[#F8FAF9] p-2.5 rounded-xl border border-[#E3EDE7]">
                  <span className="text-[10px] text-[#608070] uppercase font-bold block">Finestra d'Oro Ideale</span>
                  <span className="font-bold text-emerald-800 text-sm mt-0.5 block">{chronotypeInfo.recommendedTime}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#4F7060] leading-relaxed">
                🧠 <strong>Diagnosi ML:</strong> {chronotypeInfo.explanation}
              </p>
            </div>

            {/* 4. Controls & Notification Setup */}
            <div className="bg-white rounded-2xl p-4 border border-[#CBDDD2] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#142A1F]">Notifiche Push & Promemoria</h4>
                  <p className="text-[11px] text-[#557766]">
                    Ricevi un invito discreto di 60 secondi solo nei momenti di massima lucidità.
                  </p>
                </div>

                <button
                  onClick={handleToggleNotifications}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notificationsEnabled ? 'bg-[#1E4332]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Daily Frequency Selector */}
              {settings.notificationsEnabled && (
                <div className="space-y-1.5 pt-2 border-t border-[#EAF2ED]">
                  <label className="text-[11px] font-bold text-[#456656] block">
                    Frequenza Giornaliera Ottimizzata:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {([1, 2, 3, 4] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => handleChangeFrequency(freq)}
                        className={`py-1.5 text-xs font-bold rounded-xl border transition ${
                          settings.dailyFrequency === freq
                            ? 'bg-[#1E4332] text-white border-[#1E4332] shadow-xs'
                            : 'bg-[#F5F9F6] text-[#345242] border-[#D5E5DB] hover:bg-[#EAF3EE]'
                        }`}
                      >
                        {freq}x / giorno
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Instant Test Simulator Button */}
              <div className="pt-2">
                <button
                  onClick={handleTriggerTestNotification}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  {testSent ? 'Notifica Inviata con Successo!' : 'Simula & Invia Notifica Smart Adesso'}
                </button>
                <p className="text-[10px] text-center text-[#628574] mt-1">
                  Invia una notifica di prova al browser e attiva il banner di micro-allenamento.
                </p>
              </div>
            </div>

            {/* 5. Complete Micro-Workouts Catalog */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F4533]">
                Catalogo Micro-Allenamenti (60 Secondi)
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(MICRO_WORKOUT_CATALOG).map((micro) => (
                  <div
                    key={micro.id}
                    className="bg-white p-3 rounded-2xl border border-[#CBDDD2] flex items-center justify-between hover:border-[#1E4332] transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#E8F4EE] text-[#1E4332] flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#142A1F]">{micro.title}</h5>
                        <p className="text-[10px] text-[#557766]">{micro.targetSkill}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onLaunchMicroWorkout(micro);
                        onClose();
                      }}
                      className="py-1 px-2.5 bg-[#E8F4EE] group-hover:bg-[#1E4332] group-hover:text-white text-[#1E4332] font-bold rounded-xl text-[11px] transition flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      + {micro.xpReward} XP
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
