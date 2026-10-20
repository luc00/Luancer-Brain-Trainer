import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { Calculator, Play, RotateCcw, Award, CheckCircle2, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface MathProblem {
  question: string;
  options: number[];
  answer: number;
}

const TOTAL_ROUNDS = 12;

export const SpeedMathLogicGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'round_over'>('intro');
  const [round, setRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [problem, setProblem] = useState<MathProblem>({ question: '', options: [], answer: 0 });
  const [timeLeft, setTimeLeft] = useState<number>(8);

  const reactionTimesRef = useRef<number[]>([]);
  const roundStartTimeRef = useRef<number>(0);
  const correctCountRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateProblem = (roundNum: number): MathProblem => {
    // Generate adaptive problem based on round
    const types = ['add_sub', 'mult', 'sequence', 'algebra'];
    const selectedType = types[Math.min(types.length - 1, Math.floor(roundNum / 3))];

    let question = '';
    let answer = 0;

    if (selectedType === 'add_sub') {
      const a = Math.floor(Math.random() * 40) + 10;
      const b = Math.floor(Math.random() * 30) + 5;
      const isSub = Math.random() > 0.5;
      question = `${a} ${isSub ? '-' : '+'} ${b} = ?`;
      answer = isSub ? a - b : a + b;
    } else if (selectedType === 'mult') {
      const a = Math.floor(Math.random() * 12) + 3;
      const b = Math.floor(Math.random() * 9) + 3;
      question = `${a} × ${b} = ?`;
      answer = a * b;
    } else if (selectedType === 'sequence') {
      const step = Math.floor(Math.random() * 6) + 2;
      const start = Math.floor(Math.random() * 20) + 2;
      const seq = [start, start + step, start + step * 2, '?'];
      question = `Sequenza: ${seq.join(', ')}`;
      answer = start + step * 3;
    } else {
      // Missing variable: 3x + 4 = 19 -> x = ?
      const x = Math.floor(Math.random() * 8) + 2;
      const mult = Math.floor(Math.random() * 4) + 2;
      const add = Math.floor(Math.random() * 10) + 1;
      const res = mult * x + add;
      question = `${mult}x + ${add} = ${res}  ➔  x = ?`;
      answer = x;
    }

    // Generate 3 wrong options
    const optionsSet = new Set<number>();
    optionsSet.add(answer);

    while (optionsSet.size < 4) {
      const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = answer + offset;
      if (wrong !== answer && wrong >= 0) {
        optionsSet.add(wrong);
      }
    }

    return {
      question,
      answer,
      options: Array.from(optionsSet).sort(() => 0.5 - Math.random()),
    };
  };

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

    if (timerRef.current) clearInterval(timerRef.current);

    setRound(currentRoundIdx + 1);
    const newProb = generateProblem(currentRoundIdx);
    setProblem(newProb);
    setTimeLeft(8);
    roundStartTimeRef.current = performance.now();

    // Round countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    soundFx.playError();
    setStreak(0);
    nextRound(round);
  };

  const handleSelectOption = (opt: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const reactionTime = performance.now() - roundStartTimeRef.current;
    reactionTimesRef.current.push(reactionTime);

    if (opt === problem.answer) {
      soundFx.playSuccess();
      correctCountRef.current += 1;
      const speedBonus = Math.round(timeLeft * 25);
      const roundScore = 120 + speedBonus + streak * 20;
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
    if (timerRef.current) clearInterval(timerRef.current);

    const accuracy = Math.round((correctCountRef.current / TOTAL_ROUNDS) * 100);
    const avgRt = reactionTimesRef.current.length > 0
      ? Math.round(reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length)
      : 800;

    if (accuracy >= 75) {
      soundFx.playSuccess();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      } catch {}
    } else {
      soundFx.playError();
    }

    onComplete({
      gameId: 'speed-math',
      gameTitle: 'Calcolo & Logica Fluida',
      category: 'logic',
      score,
      accuracy,
      averageReactionTimeMs: avgRt,
      difficultyLevel: 3,
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div id="speed-math-container" className="w-full max-w-md mx-auto flex flex-col flex-1 pb-16">
      {gameState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/40 flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <Calculator className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-display">Calcolo & Logica Fluida</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Stimola la corteccia prefrontale dorsolaterale attraverso equazioni rapide, 
            estrapolazione di pattern numerici e deduzione logica sotto pressione temporale.
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
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" /> Inizia Sfida
            </button>
          </div>
        </motion.div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col flex-1 justify-between">
          {/* Header Stats */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 mb-4">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-indigo-400">{score} pt</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">Timer:</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                timeLeft <= 3 ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' : 'bg-slate-800 text-white'
              }`}>
                {timeLeft}s
              </span>
            </div>
            <div className="text-sm font-mono font-bold text-white">
              {round} / {TOTAL_ROUNDS}
            </div>
          </div>

          {/* Question Display Card */}
          <div className="bg-slate-950 border-2 border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[180px] shadow-2xl backdrop-blur-md my-auto text-center">
            <span className="text-xs text-indigo-400 uppercase font-semibold tracking-wider mb-2">Risolvi con rapidità</span>
            <motion.div
              key={`${round}-${problem.question}`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-wider select-none"
            >
              {problem.question}
            </motion.div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {problem.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="h-16 rounded-xl bg-slate-900 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500 text-white font-mono font-bold text-xl transition-all active:scale-95 shadow-md flex items-center justify-center"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'round_over' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/95 border border-indigo-500/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md my-auto"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center mx-auto mb-3 text-indigo-400">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Sessione Logica Completata!</h3>
          <p className="text-xs text-slate-400 mb-6">Velocità di calcolo e schema solver aggiornati.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Punti Totali</span>
              <span className="text-xl font-bold text-indigo-400">{score} pt</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Precisione</span>
              <span className="text-xl font-bold text-white">
                {Math.round((correctCountRef.current / TOTAL_ROUNDS) * 100)}%
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" /> Riprova
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm transition"
            >
              Continua
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
