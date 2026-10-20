import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

const DISK_COLORS = [
  'bg-[#52D195] border-[#3CA774]',
  'bg-[#367554] border-[#22573C]',
  'bg-[#D4A325] border-[#AA821C]',
  'bg-[#2D6A8E] border-[#1C4E6D]',
  'bg-[#C84630] border-[#9E301E]',
];

export const TowerOfHanoiGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [numDisks, setNumDisks] = useState<number>(3);
  const [pegs, setPegs] = useState<number[][]>([[], [], []]);
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  const initGame = useCallback((disksCount: number) => {
    const startPeg: number[] = [];
    for (let i = disksCount; i >= 1; i--) {
      startPeg.push(i);
    }
    setPegs([startPeg, [], []]);
    setSelectedPeg(null);
    setMoves(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initGame(numDisks);
  }, [numDisks, initGame]);

  const minMoves = Math.pow(2, numDisks) - 1;

  const handlePegClick = (pegIdx: number) => {
    if (isWon) return;

    soundFx.playClick();

    if (selectedPeg === null) {
      if (pegs[pegIdx].length > 0) {
        setSelectedPeg(pegIdx);
      }
      return;
    }

    if (selectedPeg === pegIdx) {
      setSelectedPeg(null);
      return;
    }

    const sourcePeg = pegs[selectedPeg];
    const targetPeg = pegs[pegIdx];

    if (sourcePeg.length === 0) {
      setSelectedPeg(null);
      return;
    }

    const diskToMove = sourcePeg[sourcePeg.length - 1];
    const targetTopDisk = targetPeg[targetPeg.length - 1];

    if (targetTopDisk === undefined || diskToMove < targetTopDisk) {
      // Valid move!
      const newPegs = pegs.map((p, idx) => {
        if (idx === selectedPeg) return p.slice(0, -1);
        if (idx === pegIdx) return [...p, diskToMove];
        return p;
      });

      setPegs(newPegs);
      setMoves(m => m + 1);
      setSelectedPeg(null);

      // Check win condition (all disks on peg 2)
      if (newPegs[2].length === numDisks) {
        soundFx.playLevelUp();
        setIsWon(true);
        onComplete({
          gameId: 'tower-of-hanoi',
          gameTitle: 'Torre di Hanoi Ricorsiva',
          category: 'logic',
          score: Math.max(300, 1000 - (moves - minMoves) * 50),
          accuracy: moves <= minMoves ? 100 : Math.max(70, 100 - (moves - minMoves) * 5),
          averageReactionTimeMs: 1400,
          difficultyLevel: numDisks - 2,
        });
      }
    } else {
      // Invalid move: cannot place larger disk on smaller
      soundFx.playError();
      setSelectedPeg(null);
    }
  };

  return (
    <div id="tower-of-hanoi-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Logica
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-3 py-1 rounded-full border border-[#CBDDD2]">
            Mosse: {moves} / Min {minMoves}
          </span>
          <button
            onClick={() => initGame(numDisks)}
            className="p-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Disk count selector */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-2xl p-1.5 shadow-2xs">
        <span className="text-xs font-bold text-[#557163] pl-2">Numero Dischi:</span>
        <div className="flex gap-1">
          {[3, 4, 5].map(cnt => (
            <button
              key={cnt}
              onClick={() => {
                soundFx.playClick();
                setNumDisks(cnt);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                numDisks === cnt
                  ? 'bg-[#1E4332] text-white shadow-xs'
                  : 'text-[#557163] hover:bg-[#F2F7F4]'
              }`}
            >
              {cnt} Dischi
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Hanoi Stage */}
      <div className="bg-[#122219] p-4 rounded-3xl shadow-xl min-h-[260px] flex flex-col justify-end">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 relative h-48 items-end">
          {pegs.map((pegDisks, pegIdx) => {
            const isSelected = selectedPeg === pegIdx;
            return (
              <button
                key={pegIdx}
                onClick={() => handlePegClick(pegIdx)}
                className={`relative h-full flex flex-col justify-end items-center rounded-2xl transition-all duration-150 cursor-pointer ${
                  isSelected ? 'bg-[#254A37] border-2 border-[#52D195] shadow-lg' : 'hover:bg-[#1A3326]'
                }`}
              >
                {/* Vertical Pole */}
                <div className="absolute w-2.5 h-36 bg-[#3F6C54] rounded-t-full -z-0 bottom-3" />

                {/* Disks stacked */}
                <div className="flex flex-col-reverse items-center gap-1 w-full pb-3 z-10">
                  {pegDisks.map((diskSize, idx) => {
                    const widthPercent = 35 + diskSize * 13;
                    const colorClass = DISK_COLORS[(diskSize - 1) % DISK_COLORS.length];
                    const isTopDisk = idx === pegDisks.length - 1;

                    return (
                      <motion.div
                        key={diskSize}
                        layout
                        style={{ width: `${widthPercent}%` }}
                        className={`h-6 rounded-lg border-2 text-[10px] font-bold text-white flex items-center justify-center shadow-md ${colorClass} ${
                          isSelected && isTopDisk ? '-translate-y-3' : ''
                        }`}
                      >
                        {diskSize}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Base Plate */}
                <div className="w-full h-3 bg-[#2D543F] rounded-md border-t border-[#4E8067]" />
                <span className="text-[10px] font-mono font-bold text-[#6D9880] mt-1 pb-1">
                  Polo {pegIdx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Victory Banner */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
          >
            <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
            <h3 className="text-lg font-bold">Torre Trasferita!</h3>
            <p className="text-xs text-[#BED8CA]">
              Hai risolto la sequenza in <strong>{moves}</strong> mosse (Minimo teorico: {minMoves}).
            </p>
            <button
              onClick={() => initGame(numDisks)}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Riprova con Più Dischi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
