import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { Wind, Play, Pause, RotateCcw, HeartPulse, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (xp: number) => void;
  onExit: () => void;
}

type BreathingMode = 'box' | 'calm' | 'resonance';

interface ModeConfig {
  name: string;
  desc: string;
  phases: { name: 'Inspira' | 'Trattieni' | 'Espira' | 'Sospendi'; duration: number }[];
}

const MODES: Record<BreathingMode, ModeConfig> = {
  box: {
    name: 'Box Breathing (4-4-4-4)',
    desc: 'Protocollo dei Navy SEALs per annullare l\'ansia e massimizzare la concentrazione tattica sotto pressione.',
    phases: [
      { name: 'Inspira', duration: 4 },
      { name: 'Trattieni', duration: 4 },
      { name: 'Espira', duration: 4 },
      { name: 'Sospendi', duration: 4 },
    ],
  },
  calm: {
    name: 'Reset 4-7-8',
    desc: 'Attivazione immediata del sistema parasimpatico e del nervo vago per indurre profonda lucidità e calma.',
    phases: [
      { name: 'Inspira', duration: 4 },
      { name: 'Trattieni', duration: 7 },
      { name: 'Espira', duration: 8 },
    ],
  },
  resonance: {
    name: 'Coerenza Cardiaca (5.5s)',
    desc: 'Sincronizzazione armonica tra frequenza cardiaca e onde cerebrali Alpha per picchi di neuroplasticità.',
    phases: [
      { name: 'Inspira', duration: 5.5 },
      { name: 'Espira', duration: 5.5 },
    ],
  },
};

const TOTAL_CYCLES = 4;

export const NeuroBreathingView: React.FC<Props> = ({ onComplete, onExit }) => {
  const [selectedMode, setSelectedMode] = useState<BreathingMode>('box');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentModeConfig = MODES[selectedMode];
  const currentPhase = currentModeConfig.phases[currentPhaseIndex];

  const startBreathing = () => {
    soundFx.playClick();
    setIsActive(true);
    setIsCompleted(false);
    setCurrentCycle(1);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(currentModeConfig.phases[0].duration);
  };

  const stopBreathing = () => {
    soundFx.playClick();
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Advance phase
          const nextPhaseIdx = (currentPhaseIndex + 1) % currentModeConfig.phases.length;
          soundFx.playCountdownTick(nextPhaseIdx === 0);

          if (nextPhaseIdx === 0) {
            // Cycle finished
            if (currentCycle >= TOTAL_CYCLES) {
              // Workout completed
              setIsActive(false);
              setIsCompleted(true);
              soundFx.playSuccess();
              try {
                confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
              } catch {}
              return 0;
            }
            setCurrentCycle((c) => c + 1);
          }

          setCurrentPhaseIndex(nextPhaseIdx);
          return currentModeConfig.phases[nextPhaseIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, currentPhaseIndex, currentCycle, currentModeConfig]);

  // Determine circle animation scale based on phase
  const getCircleScale = () => {
    if (!isActive) return 1;
    if (currentPhase.name === 'Inspira') return 1.45;
    if (currentPhase.name === 'Espira') return 0.85;
    if (currentPhase.name === 'Trattieni') return 1.45;
    return 0.85;
  };

  return (
    <div id="neuro-breathing-container" className="w-full max-w-md mx-auto flex flex-col flex-1 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 mb-4">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <HeartPulse className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Biofeedback & Coerenza</span>
        </div>
        {isActive && (
          <span className="text-xs font-mono font-bold text-white">
            Ciclo {currentCycle} / {TOTAL_CYCLES}
          </span>
        )}
      </div>

      {!isActive && !isCompleted && (
        <div className="space-y-4 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-1 font-display">Respirazione Neurale</h2>
            <p className="text-xs text-slate-300">
              Regola la variabilità cardiaca (HRV), abbassa il cortisolo e prepara il cervello ad elevate prestazioni cognitive.
            </p>
          </div>

          <div className="space-y-2.5">
            {(Object.keys(MODES) as BreathingMode[]).map((key) => {
              const item = MODES[key];
              const isSelected = selectedMode === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedMode(key);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {item.name}
                    </span>
                    {isSelected && <Sparkles className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Indietro
            </button>
            <button
              onClick={startBreathing}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" /> Inizia Coerenza
            </button>
          </div>
        </div>
      )}

      {isActive && (
        <div className="flex flex-col flex-1 items-center justify-between my-auto py-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-1 font-display tracking-wide">
              {currentPhase.name}
            </h3>
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold">
              Rilassa le spalle e segui l&apos;espansione
            </span>
          </div>

          {/* Animated Visual Pacer Circle */}
          <div className="relative w-64 h-64 flex items-center justify-center my-8">
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-pulse"></div>
            
            <motion.div
              animate={{ scale: getCircleScale() }}
              transition={{
                duration: currentPhase.duration,
                ease: 'easeInOut',
              }}
              className="w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-500/30 to-blue-600/40 border-2 border-cyan-400/80 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.35)] backdrop-blur-sm"
            >
              <div className="text-center">
                <span className="text-5xl font-extrabold font-mono text-white select-none drop-shadow-md">
                  {phaseSecondsLeft}
                </span>
                <span className="text-[10px] text-cyan-200 block uppercase tracking-widest mt-1">sec</span>
              </div>
            </motion.div>
          </div>

          <button
            onClick={stopBreathing}
            className="py-3 px-6 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-2 transition"
          >
            <Pause className="w-4 h-4" /> Interrompi
          </button>
        </div>
      )}

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md my-auto"
        >
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-3 text-cyan-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Coerenza Raggiunta!</h3>
          <p className="text-xs text-slate-300 mb-6">
            La tua frequenza cardiaca e l&apos;attività cerebrale sono ora sincronizzate in stato di massima plasticità neurale.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
            <span className="text-xs text-slate-400 block mb-1">Padronanza Emotiva & Focus</span>
            <span className="text-xl font-bold text-cyan-400">+150 XP Guadagnati</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startBreathing}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" /> Ripeti
            </button>
            <button
              onClick={() => onComplete(150)}
              className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition"
            >
              Concludi
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
