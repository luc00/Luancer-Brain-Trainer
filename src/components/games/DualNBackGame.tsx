import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { Brain, Play, RotateCcw, Volume2, Check, X, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

const LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];
const TOTAL_ROUNDS = 16;
const STIMULUS_DURATION = 1500; // ms
const ISI_DURATION = 600; // ms interval between stimuli

export const DualNBackGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [nBack, setNBack] = useState<number>(2);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'round_over'>('intro');
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [currentLetter, setCurrentLetter] = useState<string>('');
  
  // History of stimuli: { position: 0-8, letter: 'A' }
  const stimuliHistoryRef = useRef<Array<{ position: number; letter: string }>>([]);
  const userResponsesRef = useRef<Array<{ posPressed: boolean; soundPressed: boolean; posCorrect: boolean; soundCorrect: boolean }>>([]);
  
  const [posPressedThisTurn, setPosPressedThisTurn] = useState<boolean>(false);
  const [soundPressedThisTurn, setSoundPressedThisTurn] = useState<boolean>(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const turnStartTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startNewGame = (customN = nBack) => {
    soundFx.playClick();
    setNBack(customN);
    setGameState('playing');
    setCurrentRound(0);
    stimuliHistoryRef.current = [];
    userResponsesRef.current = [];
    setReactionTimes([]);
    setPosPressedThisTurn(false);
    setSoundPressedThisTurn(false);
    nextStimulus(0, customN);
  };

  const nextStimulus = (roundIdx: number, currentN: number) => {
    if (roundIdx >= TOTAL_ROUNDS) {
      finishGame(currentN);
      return;
    }

    setCurrentRound(roundIdx + 1);
    setPosPressedThisTurn(false);
    setSoundPressedThisTurn(false);

    // Determine position & letter, with a 30% probability of matching the N-back item
    let nextPos = Math.floor(Math.random() * 9);
    let nextLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];

    const history = stimuliHistoryRef.current;
    if (roundIdx >= currentN) {
      const targetPosMatch = Math.random() < 0.35;
      const targetSoundMatch = Math.random() < 0.35;

      if (targetPosMatch && history[roundIdx - currentN]) {
        nextPos = history[roundIdx - currentN].position;
      }
      if (targetSoundMatch && history[roundIdx - currentN]) {
        nextLetter = history[roundIdx - currentN].letter;
      }
    }

    const currentStimulus = { position: nextPos, letter: nextLetter };
    stimuliHistoryRef.current.push(currentStimulus);

    // Show stimulus
    setActiveCell(nextPos);
    setCurrentLetter(nextLetter);
    turnStartTimeRef.current = performance.now();

    // Play neuro-tone
    const letterIdx = LETTERS.indexOf(nextLetter);
    soundFx.playNeuroTone(letterIdx >= 0 ? letterIdx : 0);

    // Schedule hide stimulus and wait for response
    timerRef.current = setTimeout(() => {
      setActiveCell(null);
      setCurrentLetter('');

      // Evaluate turn responses before moving to next
      timerRef.current = setTimeout(() => {
        evaluateTurn(roundIdx, currentN);
        nextStimulus(roundIdx + 1, currentN);
      }, ISI_DURATION);
    }, STIMULUS_DURATION);
  };

  const evaluateTurn = (roundIdx: number, currentN: number) => {
    const history = stimuliHistoryRef.current;
    const current = history[roundIdx];
    if (!current) return;

    const hasPosMatch = roundIdx >= currentN && history[roundIdx - currentN]?.position === current.position;
    const hasSoundMatch = roundIdx >= currentN && history[roundIdx - currentN]?.letter === current.letter;

    // Check correctness
    const posCorrect = (hasPosMatch && posPressedThisTurn) || (!hasPosMatch && !posPressedThisTurn);
    const soundCorrect = (hasSoundMatch && soundPressedThisTurn) || (!hasSoundMatch && !soundPressedThisTurn);

    userResponsesRef.current.push({
      posPressed: posPressedThisTurn,
      soundPressed: soundPressedThisTurn,
      posCorrect,
      soundCorrect,
    });
  };

  const handlePositionMatch = () => {
    if (posPressedThisTurn) return;
    setPosPressedThisTurn(true);
    soundFx.playClick();
    const rt = performance.now() - turnStartTimeRef.current;
    setReactionTimes((prev) => [...prev, rt]);
  };

  const handleSoundMatch = () => {
    if (soundPressedThisTurn) return;
    setSoundPressedThisTurn(true);
    soundFx.playClick();
    const rt = performance.now() - turnStartTimeRef.current;
    setReactionTimes((prev) => [...prev, rt]);
  };

  const finishGame = (currentN: number) => {
    setGameState('round_over');
    if (timerRef.current) clearTimeout(timerRef.current);

    const responses = userResponsesRef.current;
    const totalChecks = responses.length * 2;
    let correctChecks = 0;

    responses.forEach((r) => {
      if (r.posCorrect) correctChecks++;
      if (r.soundCorrect) correctChecks++;
    });

    const accuracy = totalChecks > 0 ? Math.round((correctChecks / totalChecks) * 100) : 70;
    const avgRt = reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 450;
    const score = Math.round((accuracy * 7.5) + (currentN * 120) + Math.max(0, (600 - avgRt) * 0.4));

    if (accuracy >= 80) {
      soundFx.playSuccess();
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch {}
    } else {
      soundFx.playError();
    }

    onComplete({
      gameId: 'dual-n-back',
      gameTitle: `Quantum Dual N-Back (${currentN}-Back)`,
      category: 'memory',
      score,
      accuracy,
      averageReactionTimeMs: avgRt,
      difficultyLevel: currentN,
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div id="dual-n-back-container" className="w-full max-w-md mx-auto flex flex-col flex-1 pb-16">
      {gameState === 'intro' && (
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <Brain className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-display">Quantum Dual N-Back</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Il gold standard delle neuroscienze per ampliare la <strong>memoria di lavoro</strong> e la fluidità cognitiva. 
            Confronta la posizione del quadrato e la lettera sonora con quella apparsa esattamente <strong>{nBack} passi fa</strong>.
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3, 4].map((level) => (
              <button
                key={level}
                onClick={() => {
                  soundFx.playClick();
                  setNBack(level);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  nBack === level
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {level}-Back
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Indietro
            </button>
            <button
              onClick={() => startNewGame(nBack)}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" /> Inizia Sessione
            </button>
          </div>
        </motion.div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col flex-1 justify-between">
          {/* Header Stats */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Livello:</span>
              <span className="text-sm font-bold text-cyan-400">{nBack}-Back</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Round:</span>
              <span className="text-sm font-mono font-bold text-white">{currentRound} / {TOTAL_ROUNDS}</span>
            </div>
          </div>

          {/* 3x3 Grid Visual Area */}
          <div className="relative aspect-square w-full max-w-[320px] mx-auto bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-3 grid grid-cols-3 grid-rows-3 gap-3 shadow-2xl backdrop-blur-sm">
            {Array.from({ length: 9 }).map((_, idx) => {
              const isActive = activeCell === idx;
              return (
                <div
                  key={idx}
                  className={`relative rounded-xl border transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? 'bg-cyan-500 border-cyan-300 shadow-[0_0_24px_rgba(6,182,212,0.8)] scale-95'
                      : 'bg-slate-900/60 border-slate-800/80'
                  }`}
                >
                  {isActive && currentLetter && (
                    <motion.span 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-slate-950 font-extrabold text-2xl font-mono select-none"
                    >
                      {currentLetter}
                    </motion.span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Audio Letter Indicator */}
          <div className="text-center my-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Ascolta la frequenza e osserva la matrice</span>
          </div>

          {/* Action Match Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button
              id="dual-nback-pos-btn"
              onClick={handlePositionMatch}
              className={`h-16 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all active:scale-95 ${
                posPressedThisTurn
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-cyan-500/40 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-1.5 text-sm">
                <Brain className="w-4 h-4" /> Uguale Posizione
              </div>
              <span className="text-[10px] font-normal opacity-80">({nBack} passi fa)</span>
            </button>

            <button
              id="dual-nback-sound-btn"
              onClick={handleSoundMatch}
              className={`h-16 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all active:scale-95 ${
                soundPressedThisTurn
                  ? 'bg-blue-500 text-white border-blue-300 shadow-lg shadow-blue-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-blue-500/40 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center gap-1.5 text-sm">
                <Volume2 className="w-4 h-4" /> Uguale Suono / Lettera
              </div>
              <span className="text-[10px] font-normal opacity-80">({nBack} passi fa)</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'round_over' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md my-auto"
        >
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-3 text-cyan-400">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Sessione N-Back Completata!</h3>
          <p className="text-xs text-slate-400 mb-6">I dati sinaptici sono stati registrati e sincronizzati.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Livello N-Back</span>
              <span className="text-lg font-bold text-cyan-400">{nBack}-Back</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Round Totali</span>
              <span className="text-lg font-bold text-white">{TOTAL_ROUNDS}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startNewGame(nBack)}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" /> Riprova
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition"
            >
              Continua
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
