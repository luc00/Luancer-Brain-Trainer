import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { Grid3X3, Play, RotateCcw, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

const GRID_SIZE = 16; // 4x4 matrix
const MAX_STRIKES = 3;

export const MatrixMemoryGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [gameState, setGameState] = useState<'intro' | 'memorizing' | 'input' | 'feedback' | 'game_over'>('intro');
  const [sequenceLength, setSequenceLength] = useState<number>(3);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentSequence, setCurrentSequence] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [strikes, setStrikes] = useState<number>(0);
  const [isReverseMode, setIsReverseMode] = useState<boolean>(false);
  const [roundCount, setRoundCount] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = (reverse = false) => {
    soundFx.playClick();
    setIsReverseMode(reverse);
    setGameState('memorizing');
    setSequenceLength(3);
    setScore(0);
    setStrikes(0);
    setRoundCount(1);
    generateAndPlaySequence(3);
  };

  const generateAndPlaySequence = (len: number) => {
    setGameState('memorizing');
    setUserSequence([]);
    setActiveCell(null);

    // Generate random sequence without immediate duplicates
    const seq: number[] = [];
    let last = -1;
    for (let i = 0; i < len; i++) {
      let next = Math.floor(Math.random() * GRID_SIZE);
      while (next === last) {
        next = Math.floor(Math.random() * GRID_SIZE);
      }
      seq.push(next);
      last = next;
    }
    setCurrentSequence(seq);

    // Animate sequence flashes
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < seq.length) {
        const cell = seq[idx];
        setActiveCell(cell);
        soundFx.playNeuroTone(cell);
        
        setTimeout(() => {
          setActiveCell(null);
        }, 400);

        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setGameState('input');
        }, 300);
      }
    }, 650);
  };

  const handleCellClick = (cellIdx: number) => {
    if (gameState !== 'input') return;

    soundFx.playClick();
    soundFx.playNeuroTone(cellIdx);
    setActiveCell(cellIdx);
    setTimeout(() => setActiveCell(null), 200);

    const newUserSeq = [...userSequence, cellIdx];
    setUserSequence(newUserSeq);

    const targetSeq = isReverseMode ? [...currentSequence].reverse() : currentSequence;
    const currentStep = newUserSeq.length - 1;

    // Check if the clicked cell matches the target sequence at this step
    if (newUserSeq[currentStep] !== targetSeq[currentStep]) {
      // Mistake!
      soundFx.playError();
      const nextStrikes = strikes + 1;
      setStrikes(nextStrikes);

      if (nextStrikes >= MAX_STRIKES) {
        finishGame(score, sequenceLength, strikes + 1);
      } else {
        setGameState('feedback');
        setTimeout(() => {
          generateAndPlaySequence(sequenceLength);
        }, 1000);
      }
      return;
    }

    // If completed the whole sequence correctly
    if (newUserSeq.length === targetSeq.length) {
      soundFx.playSuccess();
      const pointsEarned = sequenceLength * 120 + (isReverseMode ? 100 : 0);
      setScore((prev) => prev + pointsEarned);
      const nextLen = sequenceLength + 1;
      setSequenceLength(nextLen);
      setRoundCount((prev) => prev + 1);

      setGameState('feedback');
      setTimeout(() => {
        generateAndPlaySequence(nextLen);
      }, 800);
    }
  };

  const finishGame = (finalScore: number, maxSpan: number, totalStrikes: number) => {
    setGameState('game_over');
    if (timerRef.current) clearTimeout(timerRef.current);

    const accuracy = Math.max(50, Math.min(100, Math.round(100 - (totalStrikes * 12))));

    if (maxSpan >= 5) {
      soundFx.playSuccess();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      } catch {}
    } else {
      soundFx.playLevelUp();
    }

    onComplete({
      gameId: 'matrix-memory',
      gameTitle: `Matrice Sequenziale ${isReverseMode ? '(Reverse)' : ''}`,
      category: 'memory',
      score: finalScore,
      accuracy,
      averageReactionTimeMs: 380,
      difficultyLevel: maxSpan,
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div id="matrix-memory-container" className="w-full max-w-md mx-auto flex flex-col flex-1 pb-16">
      {gameState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Grid3X3 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-display">Matrice Sequenziale</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Allena la <strong>memoria visuo-spaziale</strong> a breve termine e la visualizzazione interna.
            Memorizza i nodi sinaptici che si illuminano ed effettua la rievocazione nell&apos;ordine corretto.
          </p>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => startGame(false)}
              className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> Ordine Diretto
            </button>
            <button
              onClick={() => startGame(true)}
              className="flex-1 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-300 font-bold text-sm transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" /> Ordine Inverso
            </button>
          </div>

          <button
            onClick={onExit}
            className="w-full py-2.5 rounded-xl bg-transparent text-slate-400 hover:text-white text-xs font-medium"
          >
            Torna al menu
          </button>
        </motion.div>
      )}

      {(gameState === 'memorizing' || gameState === 'input' || gameState === 'feedback') && (
        <div className="flex flex-col flex-1 justify-between">
          {/* Header Stats */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Punti:</span>
              <span className="text-sm font-bold text-emerald-400">{score}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 mr-1">Errori:</span>
              {Array.from({ length: MAX_STRIKES }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i < strikes ? 'bg-red-500 shadow-sm shadow-red-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md">
              Lunghezza: {sequenceLength}
            </div>
          </div>

          {/* Status Instruction Banner */}
          <div className="text-center mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md transition-all ${
                gameState === 'memorizing'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {gameState === 'memorizing' && '👀 Osserva la sequenza...'}
              {gameState === 'input' && (isReverseMode ? '🔄 Ripeti in ordine INVERSO' : '👉 Ripeti la sequenza')}
              {gameState === 'feedback' && '✨ Verifico connessione neurale...'}
            </span>
          </div>

          {/* 4x4 Grid Matrix */}
          <div className="relative aspect-square w-full max-w-[320px] mx-auto bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-3 grid grid-cols-4 grid-rows-4 gap-2.5 shadow-2xl backdrop-blur-md my-auto">
            {Array.from({ length: GRID_SIZE }).map((_, idx) => {
              const isFlashed = activeCell === idx;
              const isSelectedByUser = userSequence.includes(idx) && gameState === 'input';
              
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  disabled={gameState !== 'input'}
                  className={`rounded-xl border transition-all duration-150 relative overflow-hidden flex items-center justify-center ${
                    isFlashed
                      ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_25px_rgba(52,211,153,0.9)] scale-95'
                      : isSelectedByUser
                      ? 'bg-emerald-950/80 border-emerald-600/60'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 active:scale-95'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-700/50"></span>
                </button>
              );
            })}
          </div>

          {/* Progress indicators for clicks */}
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: sequenceLength }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  i < userSequence.length ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {gameState === 'game_over' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md my-auto"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Test Memoria Concluso!</h3>
          <p className="text-xs text-slate-400 mb-6">Capacità visuo-spaziale registrata nel profilo neurale.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Punti Ottenuti</span>
              <span className="text-xl font-bold text-emerald-400">{score} pt</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Span Massimo</span>
              <span className="text-xl font-bold text-white">{sequenceLength} nodi</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startGame(isReverseMode)}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" /> Riprova
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
            >
              Continua
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
