import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { Target, Play, RotateCcw, Award, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

const TOTAL_ROUNDS = 16;

export const FlankerFocusGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'round_over'>('intro');
  const [round, setRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  
  // Array of 5 arrow directions, e.g. ['<', '<', '>', '<', '<']
  const [arrows, setArrows] = useState<('left' | 'right')[]>(['left', 'left', 'left', 'left', 'left']);
  const [targetDirection, setTargetDirection] = useState<'left' | 'right'>('left');
  const [isCongruent, setIsCongruent] = useState<boolean>(true);

  const reactionTimesRef = useRef<number[]>([]);
  const roundStartTimeRef = useRef<number>(0);
  const correctCountRef = useRef<number>(0);

  const startGame = () => {
    soundFx.playClick();
    setGameState('playing');
    setRound(0);
    setScore(0);
    setStreak(0);
    reactionTimesRef.current = [];
    correctCountRef.current = 0;
    nextRound(0);
  };

  const nextRound = (currentRoundIdx: number) => {
    if (currentRoundIdx >= TOTAL_ROUNDS) {
      finishGame();
      return;
    }

    setRound(currentRoundIdx + 1);

    const centerDir: 'left' | 'right' = Math.random() > 0.5 ? 'left' : 'right';
    const congruent = Math.random() > 0.6; // 60% incongruent conflict
    const flankerDir = congruent ? centerDir : (centerDir === 'left' ? 'right' : 'left');

    const currentArrows: ('left' | 'right')[] = [
      flankerDir,
      flankerDir,
      centerDir, // target in center
      flankerDir,
      flankerDir,
    ];

    setTargetDirection(centerDir);
    setIsCongruent(congruent);
    setArrows(currentArrows);

    roundStartTimeRef.current = performance.now();
  };

  const handleUserChoice = (direction: 'left' | 'right') => {
    const reactionTime = performance.now() - roundStartTimeRef.current;
    reactionTimesRef.current.push(reactionTime);

    if (direction === targetDirection) {
      soundFx.playSuccess();
      correctCountRef.current += 1;
      const speedBonus = Math.max(0, Math.round((1000 - reactionTime) / 10));
      const roundScore = (isCongruent ? 80 : 130) + speedBonus + streak * 15;
      setScore((prev) => prev + roundScore);
      setStreak((prev) => prev + 1);
    } else {
      soundFx.playError();
      setStreak(0);
    }

    nextRound(round);
  };

  const finishGame = () => {
    setGameState('round_over');

    const accuracy = Math.round((correctCountRef.current / TOTAL_ROUNDS) * 100);
    const avgRt = reactionTimesRef.current.length > 0
      ? Math.round(reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length)
      : 400;

    if (accuracy >= 80) {
      soundFx.playSuccess();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      } catch {}
    } else {
      soundFx.playError();
    }

    onComplete({
      gameId: 'flanker-focus',
      gameTitle: 'Filtro Inibitorio Flanker',
      category: 'focus',
      score,
      accuracy,
      averageReactionTimeMs: avgRt,
      difficultyLevel: 3,
    });
  };

  return (
    <div id="flanker-game-container" className="w-full max-w-md mx-auto flex flex-col flex-1 pb-16">
      {gameState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <Target className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-display">Filtro Inibitorio Flanker</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Allena l&apos;<strong>attenzione focale</strong> e la soppressione dei distrattori periferici.
            Indica esclusivamente la direzione della <strong>freccia centrale</strong>, ignorando le frecce laterali che cercano di ingannarti!
          </p>

          <div className="flex gap-3">
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Indietro
            </button>
            <button
              onClick={startGame}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" /> Avvia Sessione
            </button>
          </div>
        </motion.div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col flex-1 justify-between">
          {/* Top Bar Stats */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 mb-4">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-bold text-rose-400">{score} pt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Focus Combo:</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                x{streak + 1}
              </span>
            </div>
            <div className="text-sm font-mono font-bold text-white">
              {round} / {TOTAL_ROUNDS}
            </div>
          </div>

          <div className="text-center mb-2">
            <span className="text-xs font-medium text-slate-400">
              Guarda solo la freccia al <strong className="text-rose-400">CENTRO</strong>
            </span>
          </div>

          {/* Stimulus Arrows Display */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-8 flex items-center justify-center min-h-[160px] shadow-2xl backdrop-blur-md my-auto">
            <motion.div
              key={`${round}-${arrows.join('-')}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 sm:gap-3"
            >
              {arrows.map((dir, idx) => {
                const isCenter = idx === 2;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-center rounded-xl transition-all ${
                      isCenter
                        ? 'w-14 h-14 sm:w-16 sm:h-16 bg-rose-500/20 border-2 border-rose-400 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                        : 'w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {dir === 'left' ? (
                      <ArrowLeft className={isCenter ? 'w-8 h-8 stroke-[3]' : 'w-5 h-5 stroke-[2]'} />
                    ) : (
                      <ArrowRight className={isCenter ? 'w-8 h-8 stroke-[3]' : 'w-5 h-5 stroke-[2]'} />
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Action Choice Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={() => handleUserChoice('left')}
              className="h-20 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-rose-500 text-white font-bold text-lg transition-all active:scale-95 shadow-lg flex flex-col items-center justify-center gap-1"
            >
              <ArrowLeft className="w-6 h-6 text-rose-400" />
              <span className="text-xs uppercase tracking-wider">Sinistra</span>
            </button>

            <button
              onClick={() => handleUserChoice('right')}
              className="h-20 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-rose-500 text-white font-bold text-lg transition-all active:scale-95 shadow-lg flex flex-col items-center justify-center gap-1"
            >
              <ArrowRight className="w-6 h-6 text-rose-400" />
              <span className="text-xs uppercase tracking-wider">Destra</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'round_over' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/95 border border-rose-500/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md my-auto"
        >
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center mx-auto mb-3 text-rose-400">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Sessione Flanker Completata!</h3>
          <p className="text-xs text-slate-400 mb-6">Inibizione selettiva e focus misurati con precisione.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Punti Totali</span>
              <span className="text-xl font-bold text-rose-400">{score} pt</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Tempo di Risposta</span>
              <span className="text-xl font-bold text-white">
                {reactionTimesRef.current.length > 0
                  ? Math.round(reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length)
                  : 0} ms
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" /> Rigioca
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm transition"
            >
              Continua
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
