import React from 'react';
import { UserProfile, MicroWorkoutPlan } from '../types';
import { getCurrentReceptivityAnalysis, getOptimalNextReminder } from '../utils/receptivityML';
import { Zap, Bell, Sparkles, Clock, ArrowRight, Play, Activity } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  profile: UserProfile;
  onOpenSettings: () => void;
  onLaunchMicroWorkout: (plan: MicroWorkoutPlan) => void;
}

export const MLReceptivityCard: React.FC<Props> = ({
  profile,
  onOpenSettings,
  onLaunchMicroWorkout,
}) => {
  const analysis = getCurrentReceptivityAnalysis(profile);
  const nextReminder = getOptimalNextReminder(profile);

  return (
    <div className="bg-gradient-to-br from-[#1B3C2D] via-[#1E4332] to-[#2B543F] text-white rounded-3xl p-4 shadow-md border border-[#2E5E47] relative overflow-hidden">
      {/* Background ambient decorative shapes */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Tag & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
            ML Receptivity Engine
          </span>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenSettings();
          }}
          className="p-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-emerald-100 flex items-center gap-1 transition active:scale-95"
        >
          <Bell className="w-3 h-3" />
          <span>Notifiche ML</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>Ricettività Neurale:</span>
            <span className="text-emerald-300 font-mono text-base">{analysis.currentScore}%</span>
          </h3>
          {analysis.isOptimalNow && (
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-md border border-emerald-500/40">
              Momento Ottimale
            </span>
          )}
        </div>

        <p className="text-xs text-emerald-100/80 mt-1 leading-snug">
          {analysis.actionMessage}
        </p>
      </div>

      {/* Micro-Workout Action Box */}
      <div className="mt-3.5 bg-black/20 rounded-2xl p-3 border border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#A7F3D0] flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">Micro-Workout 60s:</span>
            <h4 className="text-xs font-bold text-white truncate">{analysis.microWorkout.title}</h4>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onLaunchMicroWorkout(analysis.microWorkout);
          }}
          className="py-1.5 px-3 bg-emerald-400 hover:bg-emerald-300 text-[#0E261A] font-bold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1 shrink-0"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Inizia (+{analysis.microWorkout.xpReward} XP)</span>
        </button>
      </div>
    </div>
  );
};
