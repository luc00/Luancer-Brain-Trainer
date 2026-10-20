import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MicroWorkoutPlan } from '../types';
import { Zap, Sparkles, X, ArrowRight, Activity } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  nudge: {
    plan: MicroWorkoutPlan;
    receptivityScore: number;
    reason: string;
    isTest?: boolean;
  } | null;
  onLaunch: (plan: MicroWorkoutPlan) => void;
  onDismiss: () => void;
}

export const SmartNudgeBanner: React.FC<Props> = ({ nudge, onLaunch, onDismiss }) => {
  if (!nudge) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.96 }}
        className="fixed top-3 left-3 right-3 z-50 max-w-md mx-auto"
      >
        <div className="bg-[#122E21]/95 text-white backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-[#4ADE80] flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    ML Smart Nudge • {nudge.receptivityScore}% Ricettività
                  </span>
                  {nudge.isTest && (
                    <span className="text-[9px] text-amber-300 font-mono">Test</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white mt-0.5">
                  {nudge.plan.title}
                </h4>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onDismiss();
              }}
              className="p-1 text-emerald-300/70 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-emerald-100/85 line-clamp-1 leading-snug">
            {nudge.reason}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                soundFx.playClick();
                onLaunch(nudge.plan);
                onDismiss();
              }}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#091D13] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Avvia Micro-Workout (60s) • +{nudge.plan.xpReward} XP
            </button>

            <button
              onClick={onDismiss}
              className="py-2 px-3 bg-white/10 hover:bg-white/20 text-xs text-white/90 rounded-xl transition"
            >
              Più Tardi
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
