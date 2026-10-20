import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, Sparkles, ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface Block {
  id: string;
  isTarget: boolean; // The red primary block
  dir: 'h' | 'v';
  length: number; // 2 or 3
  r: number; // 0..5
  c: number; // 0..5
}

const INITIAL_PUZZLE: Block[] = [
  { id: 'red', isTarget: true, dir: 'h', length: 2, r: 2, c: 0 }, // Goal is to reach c = 4
  { id: 'b1', isTarget: false, dir: 'v', length: 3, r: 0, c: 2 },
  { id: 'b2', isTarget: false, dir: 'h', length: 2, r: 0, c: 3 },
  { id: 'b3', isTarget: false, dir: 'v', length: 2, r: 1, c: 5 },
  { id: 'b4', isTarget: false, dir: 'h', length: 2, r: 3, c: 3 },
  { id: 'b5', isTarget: false, dir: 'v', length: 2, r: 4, c: 2 },
  { id: 'b6', isTarget: false, dir: 'h', length: 2, r: 5, c: 3 },
];

export const UnblockMeGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_PUZZLE);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  const resetGame = useCallback(() => {
    soundFx.playClick();
    setBlocks(INITIAL_PUZZLE.map(b => ({ ...b })));
    setSelectedBlockId(null);
    setMoves(0);
    setIsWon(false);
  }, []);

  // Check collision grid
  const isOccupied = (r: number, c: number, ignoreId: string, currentBlocks: Block[]) => {
    if (r < 0 || r >= 6 || c < 0 || c >= 6) return true;
    for (let b of currentBlocks) {
      if (b.id === ignoreId) continue;
      if (b.dir === 'h') {
        if (b.r === r && c >= b.c && c < b.c + b.length) return true;
      } else {
        if (b.c === c && r >= b.r && r < b.r + b.length) return true;
      }
    }
    return false;
  };

  const moveBlock = (blockId: string, step: number) => {
    if (isWon) return;

    const b = blocks.find(blk => blk.id === blockId);
    if (!b) return;

    if (b.dir === 'h') {
      const targetC = step > 0 ? b.c + b.length : b.c - 1;
      if (!isOccupied(b.r, targetC, b.id, blocks)) {
        soundFx.playClick();
        const updated = blocks.map(blk => (blk.id === blockId ? { ...blk, c: blk.c + step } : blk));
        setBlocks(updated);
        setMoves(m => m + 1);

        // Check if red block reached exit (r: 2, c: 4)
        const redBlk = updated.find(blk => blk.isTarget);
        if (redBlk && redBlk.c >= 4) {
          soundFx.playLevelUp();
          setIsWon(true);
          onComplete({
            gameId: 'unblock-me',
            gameTitle: 'Unblock Me Logica Spaziale',
            category: 'logic',
            score: 950,
            accuracy: 100,
            averageReactionTimeMs: 1600,
            difficultyLevel: 2,
          });
        }
      } else {
        soundFx.playError();
      }
    } else {
      // vertical
      const targetR = step > 0 ? b.r + b.length : b.r - 1;
      if (!isOccupied(targetR, b.c, b.id, blocks)) {
        soundFx.playClick();
        const updated = blocks.map(blk => (blk.id === blockId ? { ...blk, r: blk.r + step } : blk));
        setBlocks(updated);
        setMoves(m => m + 1);
      } else {
        soundFx.playError();
      }
    }
  };

  const selected = blocks.find(b => b.id === selectedBlockId);

  return (
    <div id="unblock-me-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Spaziale
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-3 py-1 rounded-full border border-[#CBDDD2]">
            Mosse: {moves}
          </span>
          <button
            onClick={resetGame}
            className="p-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6x6 Wooden Board Stage */}
      <div className="relative bg-[#1A120B] p-4 rounded-3xl border-4 border-[#3D2817] shadow-xl flex items-center justify-center">
        {/* Exit Slot on Row 2 Right */}
        <div className="absolute -right-3 top-[108px] sm:top-[128px] w-4 h-14 bg-[#52D195] rounded-r-lg border-2 border-white shadow-lg flex items-center justify-center">
          <span className="text-[9px] font-black text-[#122219] rotate-90">USCITA</span>
        </div>

        {/* 6x6 Grid Frame */}
        <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] bg-[#2E1E12] rounded-2xl border border-[#4D321F] overflow-hidden">
          {/* Background grid lines */}
          <div className="grid grid-cols-6 grid-rows-6 w-full h-full opacity-20 pointer-events-none">
            {Array(36).fill(0).map((_, i) => (
              <div key={i} className="border border-white/40" />
            ))}
          </div>

          {/* Blocks */}
          {blocks.map(b => {
            const cellSize = 100 / 6;
            const leftPct = b.c * cellSize;
            const topPct = b.r * cellSize;
            const widthPct = (b.dir === 'h' ? b.length : 1) * cellSize;
            const heightPct = (b.dir === 'v' ? b.length : 1) * cellSize;
            const isSelected = selectedBlockId === b.id;

            return (
              <button
                key={b.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedBlockId(b.id);
                }}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `calc(${widthPct}% - 4px)`,
                  height: `calc(${heightPct}% - 4px)`,
                  margin: '2px',
                }}
                className={`rounded-xl border-2 transition-all select-none cursor-pointer flex items-center justify-center shadow-md ${
                  b.isTarget
                    ? 'bg-gradient-to-r from-[#D90429] to-[#EF233C] border-[#FF758F] text-white font-black'
                    : 'bg-gradient-to-br from-[#8D5B4C] to-[#63382D] border-[#B57C6D] text-[#ECD5CD]'
                } ${isSelected ? 'ring-3 ring-white scale-98 shadow-xl' : 'hover:brightness-110'}`}
              >
                {b.isTarget ? '★' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="flex justify-center gap-2">
        {selected?.dir === 'h' ? (
          <>
            <button
              onClick={() => selectedBlockId && moveBlock(selectedBlockId, -1)}
              className="flex items-center gap-1 px-5 py-3 rounded-2xl bg-white border border-[#CBDDD2] text-[#1E4332] font-bold text-xs hover:bg-[#E5F2EC] shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Scorri a Sinistra
            </button>
            <button
              onClick={() => selectedBlockId && moveBlock(selectedBlockId, 1)}
              className="flex items-center gap-1 px-5 py-3 rounded-2xl bg-[#1E4332] text-white font-bold text-xs hover:bg-[#2A5741] shadow-xs cursor-pointer"
            >
              Scorri a Destra <ChevronRight className="w-4 h-4" />
            </button>
          </>
        ) : selected?.dir === 'v' ? (
          <>
            <button
              onClick={() => selectedBlockId && moveBlock(selectedBlockId, -1)}
              className="flex items-center gap-1 px-5 py-3 rounded-2xl bg-white border border-[#CBDDD2] text-[#1E4332] font-bold text-xs hover:bg-[#E5F2EC] shadow-xs cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" /> Scorri in Alto
            </button>
            <button
              onClick={() => selectedBlockId && moveBlock(selectedBlockId, 1)}
              className="flex items-center gap-1 px-5 py-3 rounded-2xl bg-[#1E4332] text-white font-bold text-xs hover:bg-[#2A5741] shadow-xs cursor-pointer"
            >
              Scorri in Basso <ChevronDown className="w-4 h-4" />
            </button>
          </>
        ) : (
          <p className="text-xs text-[#557163] py-2 font-medium">Seleziona un blocco per muoverlo</p>
        )}
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
            <h3 className="text-lg font-bold">Blocco Rosso Liberato!</h3>
            <p className="text-xs text-[#BED8CA]">Hai aperto la via di fuga in {moves} mosse.</p>
            <button
              onClick={resetGame}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Riprova Puzzle
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
