import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Play, Trophy, Sparkles, Flame } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

const PADS = [
  { id: 0, color: 'bg-[#2E7652]', activeColor: 'bg-[#52D195]', label: 'Verde Smeraldo', border: 'border-[#22573C]', toneIndex: 0 },
  { id: 1, color: 'bg-[#D4A325]', activeColor: 'bg-[#FDE4A9]', label: 'Oro Solare', border: 'border-[#AA821C]', toneIndex: 2 },
  { id: 2, color: 'bg-[#C84630]', activeColor: 'bg-[#F97058]', label: 'Rubino Ardente', border: 'border-[#9E301E]', toneIndex: 4 },
  { id: 3, color: 'bg-[#2D6A8E]', activeColor: 'bg-[#6EB5DF]', label: 'Zaffiro Profondo', border: 'border-[#1C4E6D]', toneIndex: 5 },
];

export const MemoColorGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState<number>(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const triggerPad = useCallback((padId: number, durationMs = 350) => {
    setActivePad(padId);
    soundFx.playNeuroTone(PADS[padId].toneIndex);
    setTimeout(() => {
      setActivePad(null);
    }, durationMs);
  }, []);

  const playSequence = useCallback((seq: number[]) => {
    setIsPlayingSeq(true);
    setUserStep(0);

    seq.forEach((padId, index) => {
      setTimeout(() => {
        triggerPad(padId, 300);
        if (index === seq.length - 1) {
          setTimeout(() => {
            setIsPlayingSeq(false);
          }, 350);
        }
      }, (index + 1) * 600);
    });
  }, [triggerPad]);

  const startGame = () => {
    soundFx.playClick();
    const firstPad = Math.floor(Math.random() * 4);
    const initialSeq = [firstPad];
    setSequence(initialSeq);
    setScore(0);
    setIsGameOver(false);
    setGameStarted(true);
    playSequence(initialSeq);
  };

  const handlePadClick = (padId: number) => {
    if (isPlayingSeq || isGameOver || !gameStarted) return;

    triggerPad(padId, 250);

    if (padId === sequence[userStep]) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      if (nextStep === sequence.length) {
        soundFx.playSuccess();
        const newScore = score + 1;
        setScore(newScore);
        if (newScore > bestScore) setBestScore(newScore);

        const nextPad = Math.floor(Math.random() * 4);
        const newSeq = [...sequence, nextPad];
        setSequence(newSeq);

        setTimeout(() => {
          playSequence(newSeq);
        }, 800);
      }
    } else {
      // Mistake
      soundFx.playError();
      setIsGameOver(true);
      onComplete({
        gameId: 'memocolor',
        gameTitle: 'MemoColor Sequencer',
        category: 'memory',
        score: Math.min(1000, score * 100),
        accuracy: Math.max(50, 100 - (sequence.length > 5 ? 10 : 20)),
        averageReactionTimeMs: 800,
        difficultyLevel: score > 8 ? 3 : score > 4 ? 2 : 1,
      });
    }
  };

  return (
    <div id="memocolor-game-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Memoria
        </button>

        <div className="flex items-center gap-2">
          <div className="text-right px-3 py-1 rounded-2xl bg-[#E5F2EC] border border-[#CBDDD2]">
            <span className="text-[9px] text-[#557163] uppercase block font-bold">Livello</span>
            <span className="text-sm font-black font-mono text-[#1E4332]">{score}</span>
          </div>
          <div className="text-right px-3 py-1 rounded-2xl bg-[#FBF2E3] border border-[#E8CE9E]">
            <span className="text-[9px] text-[#8C5D19] uppercase block font-bold">Record</span>
            <span className="text-sm font-black font-mono text-[#8C5D19]">{bestScore}</span>
          </div>
        </div>
      </div>

      {/* Instruction banner */}
      <div className="p-3 rounded-2xl bg-white border border-[#CBDDD2] text-center text-xs font-medium text-[#557163] shadow-2xs">
        {isPlayingSeq ? (
          <span className="text-[#2E7652] font-bold animate-pulse">Osserva e ascolta la sequenza luminosa...</span>
        ) : gameStarted ? (
          <span className="text-[#122219] font-bold">Tocca i pad nel medesimo ordine! ({userStep}/{sequence.length})</span>
        ) : (
          <span>Premi &ldquo;Inizia Sequenza&rdquo; per testare la tua memoria di lavoro</span>
        )}
      </div>

      {/* 4 Colored Sound Pads Grid */}
      <div className="bg-[#122219] p-4 rounded-3xl shadow-xl aspect-square flex items-center justify-center">
        <div className="grid grid-cols-2 gap-3.5 w-full h-full">
          {PADS.map(pad => {
            const isActive = activePad === pad.id;
            return (
              <button
                key={pad.id}
                onClick={() => handlePadClick(pad.id)}
                disabled={isPlayingSeq || !gameStarted || isGameOver}
                className={`rounded-3xl border-4 transition-all duration-150 active:scale-95 shadow-md flex items-center justify-center cursor-pointer ${
                  pad.border
                } ${isActive ? `${pad.activeColor} scale-95 shadow-2xl brightness-125` : `${pad.color} opacity-85 hover:opacity-100`}`}
              >
                <div className={`w-8 h-8 rounded-full border-2 border-white/40 transition-all ${isActive ? 'scale-125 bg-white/60' : 'bg-white/10'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Start / Restart button */}
      {!gameStarted && (
        <div className="text-center pt-2">
          <button
            onClick={startGame}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#1E4332] hover:bg-[#2A5741] text-white font-bold text-sm shadow-md transition cursor-pointer active:scale-98"
          >
            <Play className="w-4 h-4 fill-current" /> Inizia Sequenza Neurale
          </button>
        </div>
      )}

      {/* Game Over Banner */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
          >
            <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
            <h3 className="text-lg font-bold">Sequenza Interrotta</h3>
            <p className="text-xs text-[#BED8CA]">
              Hai memorizzato fino a <strong className="text-[#52D195] font-mono text-sm">{score}</strong> nodi sequenziali consecutivi.
            </p>
            <button
              onClick={startGame}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Riprova
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
