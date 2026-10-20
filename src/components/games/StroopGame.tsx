import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { Zap, Play, RotateCcw, Award, CheckCircle2, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface ColorItem {
  name: string;      // Word text, e.g. "ROSSO"
  color: string;     // Tailwind/CSS color
  hex: string;
}

const COLORS: ColorItem[] = [
  { name: 'ROSSO', color: 'text-red-500', hex: '#ef4444' },
  { name: 'BLU', color: 'text-blue-500', hex: '#3b82f6' },
  { name: 'VERDE', color: 'text-emerald-500', hex: '#10b981' },
  { name: 'GIALLO', color: 'text-amber-400', hex: '#f59e0b' },
  { name: 'VIOLA', color: 'text-purple-500', hex: '#a855f7' },
];

const TOTAL_ROUNDS = 18;

export const StroopGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'round_over'>('intro');
  const [round, setRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [mode, setMode] = useState<'ink' | 'word'>('ink'); // 'ink' = choose font color, 'word' = choose text meaning
  
  const [displayedWord, setDisplayedWord] = useState<string>('');
  const [displayedColor, setDisplayedColor] = useState<ColorItem>(COLORS[0]);
  const [options, setOptions] = useState<ColorItem[]>([]);
  
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

    // 70% of time match ink, 30% switch to word meaning to test cognitive flexibility
    const currentMode: 'ink' | 'word' = Math.random() < 0.75 ? 'ink' : 'word';
    setMode(currentMode);

    // Pick random text and random ink color (frequently mismatching)
    const randomWordIdx = Math.floor(Math.random() * COLORS.length);
    let randomColorIdx = Math.floor(Math.random() * COLORS.length);
    // Force conflict in 75% of rounds
    if (Math.random() < 0.75 && randomColorIdx === randomWordIdx) {
      randomColorIdx = (randomColorIdx + 1) % COLORS.length;
    }

    const wordItem = COLORS[randomWordIdx];
    const colorItem = COLORS[randomColorIdx];

    setDisplayedWord(wordItem.name);
    setDisplayedColor(colorItem);

    // Generate 4 distinct option choices
    const correctTarget = currentMode === 'ink' ? colorItem : wordItem;
    const distractors = COLORS.filter((c) => c.name !== correctTarget.name);
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);
    const roundOptions = [...shuffledDistractors, correctTarget].sort(() => 0.5 - Math.random());

    setOptions(roundOptions);
    roundStartTimeRef.current = performance.now();
  };

  const handleChoice = (chosen: ColorItem) => {
    const reactionTime = performance.now() - roundStartTimeRef.current;
    reactionTimesRef.current.push(reactionTime);

    const isTargetInk = mode === 'ink';
    const correctTarget = isTargetInk ? displayedColor : COLORS.find((c) => c.name === displayedWord);

    const isCorrect = correctTarget && chosen.name === correctTarget.name;

    if (isCorrect) {
      soundFx.playSuccess();
      correctCountRef.current += 1;
      const speedBonus = Math.max(0, Math.round((1200 - reactionTime) / 10));
      const roundScore = 100 + speedBonus + streak * 15;
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
      : 500;

    if (accuracy >= 80) {
      soundFx.playSuccess();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      } catch {}
    } else {
      soundFx.playError();
    }

    onComplete({
      gameId: 'stroop-clash',
      gameTitle: 'Stroop Neuro-Cromatico',
      category: 'speed',
      score,
      accuracy,
      averageReactionTimeMs: avgRt,
      difficultyLevel: 3,
    });
  };

  return (
    <div id="stroop-game-container" className="w-full max-w-md mx-auto flex flex-col flex-1 pb-16">
      {gameState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-display">Stroop Neuro-Cromatico</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Allena il <strong>controllo inibitorio</strong>, la velocità di reazione e la flessibilità sinaptica.
            Presta massima attenzione all&apos;istruzione attiva: dovrai ignorare l&apos;impulso automatico di leggere la parola!
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs text-slate-300 space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span><strong>MODO INCHIOSTRO:</strong> Scegli il colore con cui è dipinto il testo.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span><strong>MODO PAROLA:</strong> Scegli il significato della parola scritta.</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Indietro
            </button>
            <button
              onClick={startGame}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" /> Inizia Test
            </button>
          </div>
        </motion.div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col flex-1 justify-between">
          {/* Top Bar Stats */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 mb-4">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-400">{score} pt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Combo:</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                x{streak + 1}
              </span>
            </div>
            <div className="text-sm font-mono font-bold text-white">
              {round} / {TOTAL_ROUNDS}
            </div>
          </div>

          {/* Mode Instruction Badge */}
          <div className="text-center mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md ${
                mode === 'ink'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-cyan-500/10'
                  : 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-purple-500/10'
              }`}
            >
              {mode === 'ink' ? '🎨 Tocca il COLORE dell\'Inchiostro' : '📝 Tocca la PAROLA Scritta'}
            </span>
          </div>

          {/* Stimulus Card */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-10 flex items-center justify-center min-h-[160px] shadow-2xl backdrop-blur-md my-auto">
            <motion.div
              key={`${round}-${displayedWord}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              style={{ color: displayedColor.hex }}
              className="text-4xl sm:text-5xl font-black font-display tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] select-none"
            >
              {displayedWord}
            </motion.div>
          </div>

          {/* 4 Choice Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            {options.map((opt) => (
              <button
                key={opt.name}
                onClick={() => handleChoice(opt)}
                className="h-16 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white font-bold text-base transition-all active:scale-95 shadow-md flex items-center justify-center"
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'round_over' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/95 border border-amber-500/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md my-auto"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto mb-3 text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Stroop Test Terminato!</h3>
          <p className="text-xs text-slate-400 mb-6">Velocità neurale e inibizione calcolate con successo.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Punteggio Totale</span>
              <span className="text-xl font-bold text-amber-400">{score} pt</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Tempo Medio</span>
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
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition"
            >
              Continua
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
