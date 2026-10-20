import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Trophy, Zap, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

// Block orientation:
// 'standing': covers 1 cell (x, y)
// 'lying-h': covers 2 cells horizontally (x, y) and (x+1, y)
// 'lying-v': covers 2 cells vertically (x, y) and (x, y+1)
type Orientation = 'standing' | 'lying-h' | 'lying-v';

interface Stage {
  name: string;
  grid: number[][]; // 0: void, 1: solid tile, 2: goal hole, 3: fragile tile (falls if standing)
  startX: number;
  startY: number;
  parMoves: number;
}

const STAGES: Stage[] = [
  {
    name: 'Livello 1 - Il Risveglio del Prisma',
    grid: [
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1, 2, 1, 1],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    ],
    startX: 1,
    startY: 1,
    parMoves: 7,
  },
  {
    name: 'Livello 2 - Il Ponte Sospeso',
    grid: [
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 1, 2, 1, 1],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    ],
    startX: 1,
    startY: 0,
    parMoves: 12,
  },
  {
    name: 'Livello 3 - Il Labirinto di Vetro',
    grid: [
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0, 0, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 1, 1, 0, 0, 1, 1, 1, 2, 1],
      [0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    ],
    startX: 1,
    startY: 1,
    parMoves: 16,
  }
];

export const BloxorzGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [blockX, setBlockX] = useState<number>(1);
  const [blockY, setBlockY] = useState<number>(1);
  const [orientation, setOrientation] = useState<Orientation>('standing');
  const [moves, setMoves] = useState<number>(0);
  const [isFalling, setIsFalling] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);

  const stage = STAGES[currentStageIdx];

  const resetStage = useCallback(() => {
    soundFx.playClick();
    setBlockX(stage.startX);
    setBlockY(stage.startY);
    setOrientation('standing');
    setMoves(0);
    setIsFalling(false);
    setIsWon(false);
  }, [stage]);

  useEffect(() => {
    resetStage();
  }, [currentStageIdx, resetStage]);

  // Check if position is valid on grid
  const checkPositionStatus = (x: number, y: number, ori: Orientation): 'valid' | 'won' | 'fell' => {
    const grid = stage.grid;
    const getTile = (gx: number, gy: number) => {
      if (gy < 0 || gy >= grid.length || gx < 0 || gx >= grid[0].length) return 0;
      return grid[gy][gx];
    };

    if (ori === 'standing') {
      const tile = getTile(x, y);
      if (tile === 2) return 'won'; // Fell into goal hole standing!
      if (tile === 0) return 'fell';
      return 'valid';
    } else if (ori === 'lying-h') {
      const tile1 = getTile(x, y);
      const tile2 = getTile(x + 1, y);
      if (tile1 === 0 || tile2 === 0) return 'fell';
      return 'valid';
    } else {
      // lying-v
      const tile1 = getTile(x, y);
      const tile2 = getTile(x, y + 1);
      if (tile1 === 0 || tile2 === 0) return 'fell';
      return 'valid';
    }
  };

  const roll = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    if (isFalling || isWon) return;

    let nextX = blockX;
    let nextY = blockY;
    let nextOri: Orientation = orientation;

    if (orientation === 'standing') {
      if (dir === 'left') {
        nextX = blockX - 2;
        nextOri = 'lying-h';
      } else if (dir === 'right') {
        nextX = blockX + 1;
        nextOri = 'lying-h';
      } else if (dir === 'up') {
        nextY = blockY - 2;
        nextOri = 'lying-v';
      } else if (dir === 'down') {
        nextY = blockY + 1;
        nextOri = 'lying-v';
      }
    } else if (orientation === 'lying-h') {
      if (dir === 'left') {
        nextX = blockX - 1;
        nextOri = 'standing';
      } else if (dir === 'right') {
        nextX = blockX + 2;
        nextOri = 'standing';
      } else if (dir === 'up') {
        nextY = blockY - 1;
        nextOri = 'lying-h';
      } else if (dir === 'down') {
        nextY = blockY + 1;
        nextOri = 'lying-h';
      }
    } else if (orientation === 'lying-v') {
      if (dir === 'left') {
        nextX = blockX - 1;
        nextOri = 'lying-v';
      } else if (dir === 'right') {
        nextX = blockX + 1;
        nextOri = 'lying-v';
      } else if (dir === 'up') {
        nextY = blockY - 1;
        nextOri = 'standing';
      } else if (dir === 'down') {
        nextY = blockY + 2;
        nextOri = 'standing';
      }
    }

    setBlockX(nextX);
    setBlockY(nextY);
    setOrientation(nextOri);
    setMoves(m => m + 1);
    soundFx.playClick();

    const status = checkPositionStatus(nextX, nextY, nextOri);
    if (status === 'won') {
      soundFx.playLevelUp();
      setIsWon(true);
      if (currentStageIdx === STAGES.length - 1) {
        onComplete({
          gameId: 'bloxorz-3d',
          gameTitle: 'Bloxorz Spaziale 3D',
          category: 'logic',
          score: 950,
          accuracy: 100,
          averageReactionTimeMs: 1500,
          difficultyLevel: 3,
        });
      }
    } else if (status === 'fell') {
      soundFx.playError();
      setIsFalling(true);
      setTimeout(() => {
        resetStage();
      }, 700);
    }
  }, [blockX, blockY, orientation, isFalling, isWon, currentStageIdx, onComplete, resetStage]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        roll('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        roll('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        roll('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        roll('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roll]);

  return (
    <div id="bloxorz-game-view" className="space-y-4 max-w-lg mx-auto pb-10">
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
            Mosse: {moves} / Par {stage.parMoves}
          </span>
          <button
            onClick={resetStage}
            className="p-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] transition cursor-pointer"
            title="Riavvia livello"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage Info */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-[#122219]">{stage.name}</h3>
        <span className="text-xs text-[#557163]">Livello {currentStageIdx + 1} di {STAGES.length}</span>
      </div>

      {/* Isometric 3D Board Grid View */}
      <div className="relative bg-[#0E1A14] p-4 rounded-3xl border border-[#2B4B39] shadow-xl overflow-hidden flex items-center justify-center min-h-[300px]">
        <div className="grid grid-rows-6 gap-1 sm:gap-1.5 transform rotate-x-20">
          {stage.grid.map((row, y) => (
            <div key={y} className="flex gap-1 sm:gap-1.5">
              {row.map((tile, x) => {
                // Check if block covers (x, y)
                const isBlockHere =
                  (orientation === 'standing' && blockX === x && blockY === y) ||
                  (orientation === 'lying-h' && ((blockX === x && blockY === y) || (blockX + 1 === x && blockY === y))) ||
                  (orientation === 'lying-v' && ((blockX === x && blockY === y) || (blockX === x && blockY + 1 === y)));

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all ${
                      tile === 0
                        ? 'opacity-0 pointer-events-none'
                        : tile === 2
                        ? 'bg-[#E63946]/20 border-2 border-dashed border-[#E63946] flex items-center justify-center shadow-inner'
                        : 'bg-[#213F30] border border-[#3E6C54] shadow-xs'
                    }`}
                  >
                    {tile === 2 && <div className="w-4 h-4 rounded-full bg-[#E63946]/60 animate-ping"></div>}

                    {/* Block visual avatar */}
                    {isBlockHere && (
                      <motion.div
                        layoutId="bloxorz-block"
                        className={`absolute inset-0 rounded-lg flex items-center justify-center font-bold text-white text-[10px] shadow-lg ${
                          isFalling
                            ? 'bg-[#E63946] scale-50 opacity-0 transition-all duration-500'
                            : 'bg-gradient-to-tr from-[#D4A325] via-[#E8BE54] to-[#F7DE8F] border-2 border-[#FFE8A3] text-[#543800]'
                        }`}
                      >
                        {orientation === 'standing' ? '■' : '═'}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* On-screen Direction Arrows */}
      <div className="grid grid-cols-3 gap-2 max-w-[190px] mx-auto pt-1">
        <div></div>
        <button
          onClick={() => roll('up')}
          className="h-11 rounded-2xl bg-white border border-[#CBDDD2] hover:bg-[#E5F2EC] text-[#1E4332] flex items-center justify-center active:scale-95 shadow-xs cursor-pointer"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <div></div>
        <button
          onClick={() => roll('left')}
          className="h-11 rounded-2xl bg-white border border-[#CBDDD2] hover:bg-[#E5F2EC] text-[#1E4332] flex items-center justify-center active:scale-95 shadow-xs cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => roll('down')}
          className="h-11 rounded-2xl bg-white border border-[#CBDDD2] hover:bg-[#E5F2EC] text-[#1E4332] flex items-center justify-center active:scale-95 shadow-xs cursor-pointer"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
        <button
          onClick={() => roll('right')}
          className="h-11 rounded-2xl bg-white border border-[#CBDDD2] hover:bg-[#E5F2EC] text-[#1E4332] flex items-center justify-center active:scale-95 shadow-xs cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Victory Level Banner */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
          >
            <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
            <h3 className="text-lg font-bold">Obiettivo Raggiunto!</h3>
            <p className="text-xs text-[#BED8CA]">
              Hai completato il livello in <strong>{moves}</strong> mosse.
            </p>
            <div className="flex gap-2 justify-center">
              {currentStageIdx < STAGES.length - 1 ? (
                <button
                  onClick={() => setCurrentStageIdx(idx => idx + 1)}
                  className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
                >
                  Prossimo Livello
                </button>
              ) : (
                <button
                  onClick={onExit}
                  className="px-5 py-2.5 rounded-2xl bg-[#52D195] text-[#122219] text-xs font-bold hover:bg-[#6BE8AC] cursor-pointer"
                >
                  Ritorna al Hub Giochi
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
