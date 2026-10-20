import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, Sparkles, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

type Board = number[][];

const BOARD_SIZE = 4;

const TILE_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  2: { bg: 'bg-[#EAF3EE]', text: 'text-[#1E4332]', border: 'border-[#CBDDD2]' },
  4: { bg: 'bg-[#D6EADC]', text: 'text-[#163828]', border: 'border-[#B2D4BD]' },
  8: { bg: 'bg-[#F9E2B8]', text: 'text-[#6E420B]', border: 'border-[#E9C37D]' },
  16: { bg: 'bg-[#F6CA84]', text: 'text-[#633500]', border: 'border-[#D9A550]' },
  32: { bg: 'bg-[#F4AC63]', text: 'text-[#542500]', border: 'border-[#D48530]' },
  64: { bg: 'bg-[#F07A54]', text: 'text-white', border: 'border-[#C85633]' },
  128: { bg: 'bg-[#4FA478]', text: 'text-white', border: 'border-[#3B805C]' },
  256: { bg: 'bg-[#2E7A52]', text: 'text-white', border: 'border-[#1E5738]' },
  512: { bg: 'bg-[#1E553A]', text: 'text-[#D0F0DE]', border: 'border-[#387C59]' },
  1024: { bg: 'bg-[#8F4882]', text: 'text-white', border: 'border-[#6D2E62]' },
  2048: { bg: 'bg-[#D4A325]', text: 'text-white', border: 'border-[#F8D468]' },
  4096: { bg: 'bg-[#11241A]', text: 'text-[#50E298]', border: 'border-[#50E298]' },
};

export const Game2048: React.FC<Props> = ({ onComplete, onExit }) => {
  const [board, setBoard] = useState<Board>(() => getInitialBoard());
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    const saved = localStorage.getItem('luancer_2048_best');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [history, setHistory] = useState<{ board: Board; score: number }[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [movesCount, setMovesCount] = useState<number>(0);
  const boardRef = useRef<HTMLDivElement>(null);

  function getInitialBoard(): Board {
    const empty: Board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    addRandomTile(empty);
    addRandomTile(empty);
    return empty;
  }

  function addRandomTile(b: Board): boolean {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (b[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return false;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    b[r][c] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  const restartGame = () => {
    soundFx.playClick();
    const newB = getInitialBoard();
    setBoard(newB);
    setScore(0);
    setHistory([]);
    setGameOver(false);
    setMovesCount(0);
  };

  const undoMove = () => {
    if (history.length === 0 || gameOver) return;
    soundFx.playClick();
    const last = history[history.length - 1];
    setBoard(last.board);
    setScore(last.score);
    setHistory(history.slice(0, -1));
  };

  const moveLeft = (currentBoard: Board): { newBoard: Board; pointsGained: number; moved: boolean } => {
    let pointsGained = 0;
    let moved = false;
    const newBoard = currentBoard.map(row => {
      const filtered = row.filter(val => val !== 0);
      const merged: number[] = [];
      let skip = false;

      for (let i = 0; i < filtered.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          const newVal = filtered[i] * 2;
          merged.push(newVal);
          pointsGained += newVal;
          skip = true;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < BOARD_SIZE) merged.push(0);
      if (row.some((val, idx) => val !== merged[idx])) moved = true;
      return merged;
    });

    return { newBoard, pointsGained, moved };
  };

  const rotateClockwise = (b: Board): Board => {
    const res: Board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        res[c][BOARD_SIZE - 1 - r] = b[r][c];
      }
    }
    return res;
  };

  const executeMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    let rotations = 0;
    if (direction === 'up') rotations = 3;
    else if (direction === 'right') rotations = 2;
    else if (direction === 'down') rotations = 1;

    let b = board.map(row => [...row]);
    for (let i = 0; i < rotations; i++) b = rotateClockwise(b);

    const { newBoard, pointsGained, moved } = moveLeft(b);

    let finalBoard = newBoard;
    const counterRotations = (4 - rotations) % 4;
    for (let i = 0; i < counterRotations; i++) finalBoard = rotateClockwise(finalBoard);

    if (moved) {
      soundFx.playClick();
      setHistory(prev => [...prev.slice(-10), { board, score }]);
      addRandomTile(finalBoard);
      setBoard(finalBoard);
      const newScore = score + pointsGained;
      setScore(newScore);
      setMovesCount(m => m + 1);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('luancer_2048_best', newScore.toString());
      }

      // Check if game over
      if (checkIsGameOver(finalBoard)) {
        soundFx.playError();
        setGameOver(true);
        onComplete({
          gameId: '2048-flow',
          gameTitle: '2048 Mind Flow',
          category: 'logic',
          score: Math.min(1000, Math.floor(newScore / 4)),
          accuracy: 95,
          averageReactionTimeMs: 1200,
          difficultyLevel: 2,
        });
      }
    }
  }, [board, score, bestScore, gameOver, onComplete]);

  function checkIsGameOver(b: Board): boolean {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (b[r][c] === 0) return false;
        if (c + 1 < BOARD_SIZE && b[r][c] === b[r][c + 1]) return false;
        if (r + 1 < BOARD_SIZE && b[r][c] === b[r + 1][c]) return false;
      }
    }
    return true;
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        executeMove('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        executeMove('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        executeMove('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        executeMove('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeMove]);

  // Touch swipe support
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 30) {
      if (absDx > absDy) {
        executeMove(dx > 0 ? 'right' : 'left');
      } else {
        executeMove(dy > 0 ? 'down' : 'up');
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div id="game-2048-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Giochi
        </button>

        <div className="flex items-center gap-2">
          <div className="text-right px-2.5 py-1 rounded-2xl bg-[#E5F2EC] border border-[#CBDDD2]">
            <span className="text-[9px] text-[#557163] uppercase block font-bold">Punti</span>
            <span className="text-sm font-black font-mono text-[#1E4332]">{score}</span>
          </div>
          <div className="text-right px-2.5 py-1 rounded-2xl bg-[#FBF2E3] border border-[#E8CE9E]">
            <span className="text-[9px] text-[#8C5D19] uppercase block font-bold">Record</span>
            <span className="text-sm font-black font-mono text-[#8C5D19]">{bestScore}</span>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-[#557163]">
          Mosse: <strong className="text-[#122219] font-mono">{movesCount}</strong>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={undoMove}
            disabled={history.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-xs font-bold text-[#1E4332] disabled:opacity-40 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Annulla
          </button>
          <button
            onClick={restartGame}
            className="px-3 py-1.5 rounded-xl bg-[#1E4332] text-white text-xs font-bold transition hover:bg-[#2A5741] cursor-pointer shadow-2xs"
          >
            Nuova Partita
          </button>
        </div>
      </div>

      {/* 2048 4x4 Board */}
      <div
        ref={boardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="bg-[#122219] p-3 rounded-3xl shadow-lg aspect-square flex items-center justify-center select-none"
      >
        <div className="grid grid-cols-4 gap-2.5 w-full h-full">
          {board.map((row, r) =>
            row.map((val, c) => {
              const tileStyle = val > 0 ? TILE_COLORS[val] || { bg: 'bg-[#0E1E14]', text: 'text-[#47E898]', border: 'border-[#47E898]' } : null;
              return (
                <div
                  key={`${r}-${c}`}
                  className={`rounded-2xl flex items-center justify-center font-extrabold transition-all duration-100 ${
                    val === 0
                      ? 'bg-[#1C3527]'
                      : `${tileStyle?.bg} ${tileStyle?.text} border-2 ${tileStyle?.border} shadow-sm text-lg sm:text-2xl`
                  }`}
                >
                  {val > 0 ? val : ''}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mobile Touch Arrow Controls */}
      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto pt-1">
        <div></div>
        <button
          onClick={() => executeMove('up')}
          className="h-11 rounded-2xl bg-white border border-[#CBDDD2] text-[#1E4332] flex items-center justify-center active:scale-95 shadow-xs cursor-pointer"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <div></div>
        <button
          onClick={() => executeMove('left')}
          className="h-11 rounded-2xl bg-white border border-[#CBDDD2] text-[#1E4332] flex items-center justify-center active:scale-95 shadow-xs cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => executeMove('down')}
          className="h-11 rounded-2xl bg-white border border-[#CBDDD2] text-[#1E4332] flex items-center justify-center active:scale-95 shadow-xs cursor-pointer"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
        <button
          onClick={() => executeMove('right')}
          className="h-11 rounded-2xl bg-white border border-[#CBDDD2] text-[#1E4332] flex items-center justify-center active:scale-95 shadow-xs cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Game Over Banner */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
        >
          <h3 className="text-lg font-bold">Nessuna Mossa Disponibile</h3>
          <p className="text-xs text-[#BED8CA]">
            Punteggio Finale: <strong className="text-[#52D195] font-mono text-sm">{score}</strong>
          </p>
          <button
            onClick={restartGame}
            className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
          >
            Riprova 2048
          </button>
        </motion.div>
      )}
    </div>
  );
};
