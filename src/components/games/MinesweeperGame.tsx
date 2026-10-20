import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Flag, Trophy, Clock, Bomb, Smile, Frown } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  neighborMines: number;
  revealed: boolean;
  flagged: boolean;
}

type GridSize = '8x8' | '10x10' | '12x12';

const CONFIGS: Record<GridSize, { rows: number; cols: number; mines: number }> = {
  '8x8': { rows: 8, cols: 8, mines: 10 },
  '10x10': { rows: 10, cols: 10, mines: 15 },
  '12x12': { rows: 12, cols: 12, mines: 22 },
};

const NUMBER_COLORS = [
  '',
  'text-[#2E7652]', // 1 green
  'text-[#2D6A8E]', // 2 blue
  'text-[#C84630]', // 3 red
  'text-[#4D3B6A]', // 4 purple
  'text-[#8C5D19]', // 5 dark yellow/brown
  'text-[#0E6C75]', // 6 teal
  'text-[#122219]', // 7 black
  'text-[#6E7C75]', // 8 gray
];

export const MinesweeperGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [sizeKey, setSizeKey] = useState<GridSize>('8x8');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isFlagMode, setIsFlagMode] = useState<boolean>(false);
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);

  const { rows, cols, mines } = CONFIGS[sizeKey];

  // Initialize empty grid
  const initBoard = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          r,
          c,
          isMine: false,
          neighborMines: 0,
          revealed: false,
          flagged: false,
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setIsFirstClick(true);
    setTimerSeconds(0);
    setIsGameOver(false);
    setIsWon(false);
  }, [rows, cols]);

  useEffect(() => {
    initBoard();
  }, [sizeKey, initBoard]);

  // Timer
  useEffect(() => {
    if (isGameOver || isFirstClick) return;
    const interval = setInterval(() => {
      setTimerSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, isFirstClick]);

  // Plant mines after safe first click
  const populateMines = (startR: number, startC: number, baseGrid: Cell[][]) => {
    let planted = 0;
    const newGrid = baseGrid.map(row => row.map(cell => ({ ...cell })));

    while (planted < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      // Safe zone around first click
      if (Math.abs(r - startR) <= 1 && Math.abs(c - startC) <= 1) continue;

      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        planted++;
      }
    }

    // Calculate neighbour numbers
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newGrid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
              count++;
            }
          }
        }
        newGrid[r][c].neighborMines = count;
      }
    }

    return newGrid;
  };

  // Flood fill reveal
  const revealCell = (r: number, c: number, currentGrid: Cell[][]) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    const cell = currentGrid[r][c];
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;

    if (cell.neighborMines === 0 && !cell.isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            revealCell(r + dr, c + dc, currentGrid);
          }
        }
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (isGameOver) return;

    let activeGrid = grid;
    if (isFirstClick) {
      activeGrid = populateMines(r, c, grid);
      setIsFirstClick(false);
    }

    const cell = activeGrid[r][c];

    if (isFlagMode) {
      // Toggle flag
      if (cell.revealed) return;
      soundFx.playClick();
      const updated = activeGrid.map(row => row.map(cl => (cl.r === r && cl.c === c ? { ...cl, flagged: !cl.flagged } : cl)));
      setGrid(updated);
      return;
    }

    if (cell.flagged || cell.revealed) return;

    soundFx.playClick();

    if (cell.isMine) {
      // Hit mine! Game over
      soundFx.playError();
      setIsGameOver(true);
      setIsWon(false);
      // Reveal all mines
      const exploded = activeGrid.map(row =>
        row.map(cl => (cl.isMine ? { ...cl, revealed: true } : cl))
      );
      setGrid(exploded);
      return;
    }

    // Reveal
    const cloned = activeGrid.map(row => row.map(cl => ({ ...cl })));
    revealCell(r, c, cloned);
    setGrid(cloned);

    // Check victory
    let nonMineCovered = 0;
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
      for (let colIdx = 0; colIdx < cols; colIdx++) {
        if (!cloned[rowIdx][colIdx].isMine && !cloned[rowIdx][colIdx].revealed) {
          nonMineCovered++;
        }
      }
    }

    if (nonMineCovered === 0) {
      soundFx.playLevelUp();
      setIsWon(true);
      setIsGameOver(true);
      onComplete({
        gameId: 'minesweeper-logic',
        gameTitle: 'Campo Minato Neurale',
        category: 'logic',
        score: Math.max(300, 1000 - timerSeconds * 5),
        accuracy: 100,
        averageReactionTimeMs: 1200,
        difficultyLevel: sizeKey === '8x8' ? 1 : sizeKey === '10x10' ? 2 : 3,
      });
    }
  };

  const flaggedCount = grid.flat().filter(c => c.flagged).length;

  return (
    <div id="minesweeper-view" className="space-y-4 max-w-md mx-auto pb-10">
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
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-2.5 py-1 rounded-full border border-[#CBDDD2]">
            <Clock className="w-3.5 h-3.5" /> {timerSeconds}s
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#C84630] bg-[#FBECEF] px-2.5 py-1 rounded-full border border-[#E9C3CB]">
            <Bomb className="w-3.5 h-3.5" /> {mines - flaggedCount}
          </div>
        </div>
      </div>

      {/* Mode & Difficulty Bar */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-2xl p-1.5 shadow-2xs">
        <div className="flex gap-1">
          {(['8x8', '10x10', '12x12'] as GridSize[]).map(sz => (
            <button
              key={sz}
              onClick={() => {
                soundFx.playClick();
                setSizeKey(sz);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                sizeKey === sz
                  ? 'bg-[#1E4332] text-white shadow-xs'
                  : 'text-[#557163] hover:bg-[#F2F7F4]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setIsFlagMode(!isFlagMode);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            isFlagMode
              ? 'bg-[#E63946] text-white shadow-xs'
              : 'bg-[#F2F7F4] text-[#1E4332] border border-[#CBDDD2]'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Bandierina: {isFlagMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Minesweeper Grid */}
      <div className="bg-[#122219] p-3 rounded-3xl shadow-xl flex items-center justify-center">
        <div
          className="grid gap-1 select-none"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            width: '100%',
            maxWidth: '360px',
          }}
        >
          {grid.map(row =>
            row.map(cell => {
              return (
                <button
                  key={`${cell.r}-${cell.c}`}
                  onClick={() => handleCellClick(cell.r, cell.c)}
                  className={`aspect-square rounded-lg flex items-center justify-center font-black text-xs sm:text-sm transition-all duration-100 cursor-pointer ${
                    cell.revealed
                      ? cell.isMine
                        ? 'bg-[#E63946] text-white border border-[#9E1A25]'
                        : 'bg-[#FAFDFB] text-[#122219] shadow-inner'
                      : 'bg-[#2E5040] hover:bg-[#3D6954] border border-[#43755E] text-transparent shadow-xs active:scale-95'
                  }`}
                >
                  {cell.revealed ? (
                    cell.isMine ? (
                      <Bomb className="w-4 h-4" />
                    ) : cell.neighborMines > 0 ? (
                      <span className={NUMBER_COLORS[cell.neighborMines]}>{cell.neighborMines}</span>
                    ) : (
                      ''
                    )
                  ) : cell.flagged ? (
                    <Flag className="w-3.5 h-3.5 text-[#FFB703] fill-current" />
                  ) : (
                    ''
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Victory / Defeat Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
          >
            {isWon ? (
              <>
                <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
                <h3 className="text-lg font-bold">Campo Bonificato!</h3>
                <p className="text-xs text-[#BED8CA]">Completato in {timerSeconds} secondi senza errori.</p>
              </>
            ) : (
              <>
                <Frown className="w-10 h-10 text-[#E63946] mx-auto" />
                <h3 className="text-lg font-bold">Mina Esplosa!</h3>
                <p className="text-xs text-[#BED8CA]">Fai affidamento sulla deduzione certa prima di cliccare.</p>
              </>
            )}
            <button
              onClick={initBoard}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Riprova Campo Minato
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
