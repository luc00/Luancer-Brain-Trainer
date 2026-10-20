import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/audio';
import { MicroWorkoutPlan, UserProfile } from '../types';
import { recordMicroWorkoutCompletion } from '../utils/storage';
import { 
  Zap, 
  Brain, 
  Shield, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Timer, 
  ArrowRight, 
  Send, 
  Volume2, 
  Award,
  Flame,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plan: MicroWorkoutPlan;
  onCompleteMicro: (updatedProfile: UserProfile) => void;
}

export const MicroWorkoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  plan,
  onCompleteMicro,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(plan.durationSeconds || 60);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [round, setRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [userTextNote, setUserTextNote] = useState<string>('');

  // 1. Stroop Blitz State
  const stroopColors = [
    { name: 'ROSSO', colorHex: '#EF4444', label: 'Rosso' },
    { name: 'VERDE', colorHex: '#10B981', label: 'Verde' },
    { name: 'BLU', colorHex: '#3B82F6', label: 'Blu' },
    { name: 'GIALLO', colorHex: '#F59E0B', label: 'Giallo' },
  ];
  const [stroopTrial, setStroopTrial] = useState({
    text: 'ROSSO',
    textColor: '#3B82F6',
    correctName: 'BLU',
  });

  // 2. Speed Math State
  const [mathQuestion, setMathQuestion] = useState({
    question: '24 + 37',
    answer: 61,
    options: [51, 61, 59, 63],
  });

  // 3. Vagal Sigh State (4s inhale, 1.5s sniff, 7s exhale)
  const [sighPhase, setSighPhase] = useState<'inhale1' | 'inhale2' | 'exhale'>('inhale1');
  const [sighCycle, setSighCycle] = useState<number>(1);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isFinished) return;
    setTimeLeft(plan.durationSeconds || 60);
    setScore(0);
    setRound(0);
    setIsFinished(false);

    generateNextStroop();
    generateNextMath();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, plan.id]);

  // Vagal Sigh Phase Controller
  useEffect(() => {
    if (!isOpen || isFinished || plan.id !== 'vagal_sigh') return;

    let timer: number;
    if (sighPhase === 'inhale1') {
      timer = window.setTimeout(() => setSighPhase('inhale2'), 3500);
    } else if (sighPhase === 'inhale2') {
      timer = window.setTimeout(() => setSighPhase('exhale'), 1500);
    } else if (sighPhase === 'exhale') {
      timer = window.setTimeout(() => {
        if (sighCycle < 3) {
          setSighCycle((c) => c + 1);
          setSighPhase('inhale1');
        } else {
          handleFinishSession();
        }
      }, 7000);
    }

    return () => window.clearTimeout(timer);
  }, [isOpen, sighPhase, sighCycle, plan.id, isFinished]);

  const generateNextStroop = () => {
    const textItem = stroopColors[Math.floor(Math.random() * stroopColors.length)];
    let colorItem = stroopColors[Math.floor(Math.random() * stroopColors.length)];
    while (colorItem.name === textItem.name) {
      colorItem = stroopColors[Math.floor(Math.random() * stroopColors.length)];
    }
    setStroopTrial({
      text: textItem.name,
      textColor: colorItem.colorHex,
      correctName: colorItem.name,
    });
  };

  const handleStroopAnswer = (selectedColorName: string) => {
    if (selectedColorName === stroopTrial.correctName) {
      soundFx.playCorrect();
      setScore((s) => s + 1);
    } else {
      soundFx.playIncorrect();
    }
    const nextRound = round + 1;
    setRound(nextRound);
    if (nextRound >= 8) {
      handleFinishSession();
    } else {
      generateNextStroop();
    }
  };

  const generateNextMath = () => {
    const a = Math.floor(Math.random() * 45) + 12;
    const b = Math.floor(Math.random() * 35) + 8;
    const isSub = Math.random() > 0.5;
    const ans = isSub ? a + b : a + b;
    const qText = isSub ? `${ans} - ${b}` : `${a} + ${b}`;
    const realAns = isSub ? a : ans;

    const opts = [
      realAns,
      realAns + (Math.random() > 0.5 ? 10 : -10),
      realAns + 2,
      realAns - 2,
    ].sort(() => Math.random() - 0.5);

    setMathQuestion({
      question: qText,
      answer: realAns,
      options: opts,
    });
  };

  const handleMathAnswer = (chosen: number) => {
    if (chosen === mathQuestion.answer) {
      soundFx.playCorrect();
      setScore((s) => s + 1);
    } else {
      soundFx.playIncorrect();
    }
    const nextRound = round + 1;
    setRound(nextRound);
    if (nextRound >= 6) {
      handleFinishSession();
    } else {
      generateNextMath();
    }
  };

  const handleFinishSession = () => {
    setIsFinished(true);
    soundFx.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    const updated = recordMicroWorkoutCompletion(plan);
    onCompleteMicro(updated);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#CBDDD2] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E4332] to-[#2E5E47] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-[#F6C667]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#A8D5BA] flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Micro-Workout Neurale ML
                </span>
                <h2 className="text-sm font-bold leading-tight">{plan.title}</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress / Timer Bar */}
          {!isFinished && (
            <div className="px-4 pt-3 pb-1 bg-[#F5FAF7] border-b border-[#E0EFE7] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#24523C] font-mono font-bold">
                <Timer className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>00:{timeLeft.toString().padStart(2, '0')}s</span>
              </div>
              <span className="text-[11px] text-[#557766] font-medium">
                {plan.targetSkill}
              </span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                +{plan.xpReward} XP
              </span>
            </div>
          )}

          {/* Body */}
          <div className="p-4 flex-1 overflow-y-auto">
            {isFinished ? (
              /* Completion Screen */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#122219]">Micro-Allenamento Completato!</h3>
                  <p className="text-xs text-[#527363] mt-1">
                    Hai stimolato la neuroplasticità e rafforzato il tuo ritmo circadiano.
                  </p>
                </div>

                <div className="bg-[#F0F7F3] rounded-2xl p-3.5 border border-[#D0E5D9] text-left space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#204734] flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-500" /> Ricompensa Guadagnata
                    </span>
                    <span className="text-emerald-700 font-mono">+{plan.xpReward} XP</span>
                  </div>
                  <p className="text-[11px] text-[#426151] leading-relaxed">
                    💡 <strong>Neuro-Beneficio:</strong> {plan.neuroBenefit}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-[#1E4332] hover:bg-[#163426] text-white font-bold rounded-2xl shadow-md transition active:scale-98 flex items-center justify-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#F6C667]" />
                  Torna alla Dashboard
                </button>
              </div>
            ) : (
              /* Active Interactive Drills */
              <div>
                {/* 1. STROOP BLITZ */}
                {plan.id === 'stroop_blitz' && (
                  <div className="space-y-4 text-center py-2">
                    <div className="text-xs text-[#597969] bg-[#E8F3ED] py-1.5 px-3 rounded-xl inline-block">
                      Tocca il <strong>COLORE</strong> dell'inchiostro (Round {round + 1}/8)
                    </div>

                    <div className="h-24 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-200">
                      <span
                        className="text-4xl font-extrabold tracking-widest transition-transform transform active:scale-95 select-none"
                        style={{ color: stroopTrial.textColor }}
                      >
                        {stroopTrial.text}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {stroopColors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => handleStroopAnswer(c.name)}
                          className="py-3 px-2 rounded-xl text-white font-bold text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
                          style={{ backgroundColor: c.colorHex }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. SPEED MATH */}
                {plan.id === 'speed_math' && (
                  <div className="space-y-4 text-center py-2">
                    <div className="text-xs text-[#597969] bg-[#E8F3ED] py-1.5 px-3 rounded-xl inline-block">
                      Calcolo a Mente Rapido (Q {round + 1}/6)
                    </div>

                    <div className="h-24 flex items-center justify-center bg-[#F3F7F5] rounded-2xl border border-[#D5E6DC]">
                      <span className="text-3xl font-extrabold text-[#153325] font-mono tracking-wider">
                        {mathQuestion.question} = ?
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {mathQuestion.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleMathAnswer(opt)}
                          className="py-3 bg-white hover:bg-[#EBF5EF] text-[#1E4332] border-2 border-[#CBDDD2] rounded-xl font-bold font-mono text-lg shadow-xs transition active:scale-95"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. VAGAL SIGH */}
                {plan.id === 'vagal_sigh' && (
                  <div className="text-center py-4 space-y-4">
                    <div className="text-xs text-[#597969] bg-[#E8F3ED] py-1 px-3 rounded-xl inline-block">
                      Ciclo {sighCycle} di 3 - Modulazione Nervo Vago
                    </div>

                    <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: sighPhase === 'inhale1' ? 1.35 : sighPhase === 'inhale2' ? 1.45 : 0.95,
                          backgroundColor: sighPhase === 'exhale' ? '#D1FAE5' : '#FEF3C7',
                        }}
                        transition={{
                          duration: sighPhase === 'inhale1' ? 3.5 : sighPhase === 'inhale2' ? 1.2 : 6.8,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 rounded-full border-4 border-emerald-400/40"
                      />
                      <div className="relative z-10 text-center px-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1F4533] block">
                          {sighPhase === 'inhale1' && '1. Inspira dal Naso'}
                          {sighPhase === 'inhale2' && '2. Colpo Finale Nasale'}
                          {sighPhase === 'exhale' && '3. Espira Lento dalla Bocca'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#4F6E5E] italic">
                      "Il doppio inspiro riapre gli alveoli polmonari collassati, diminuendo istantaneamente la frequenza cardiaca."
                    </p>

                    <button
                      onClick={handleFinishSession}
                      className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 py-2 px-4 rounded-xl transition"
                    >
                      Completa Subito
                    </button>
                  </div>
                )}

                {/* 4. ALTRUISM & REAL ACTION / STOIC PAUSE */}
                {(plan.id === 'altruism_kindness' || plan.id === 'stoic_pause' || plan.id === 'memory_matrix') && (
                  <div className="space-y-4 py-2">
                    <div className="bg-[#F0F8F4] p-3.5 rounded-2xl border border-[#CCE2D5] space-y-2">
                      <h4 className="text-xs font-bold text-[#183B2A] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" /> Istruzione Pratica:
                      </h4>
                      <p className="text-xs text-[#305342] leading-relaxed">
                        {plan.actionGuide}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#456656] block">
                        Cosa hai fatto o pensato? (Opzionale):
                      </label>
                      <input
                        type="text"
                        value={userTextNote}
                        onChange={(e) => setUserTextNote(e.target.value)}
                        placeholder="Es: Ho inviato un messaggio di ringraziamento a Marco..."
                        className="w-full text-xs p-2.5 rounded-xl border border-[#CBDDD2] focus:outline-none focus:ring-2 focus:ring-[#1E4332] bg-[#FAFCFA]"
                      />
                    </div>

                    <button
                      onClick={handleFinishSession}
                      className="w-full py-3 bg-[#1E4332] hover:bg-[#163426] text-white font-bold rounded-2xl shadow-md transition active:scale-98 flex items-center justify-center gap-2 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#A8D5BA]" />
                      Azione Compiuta! (+{plan.xpReward} XP)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
