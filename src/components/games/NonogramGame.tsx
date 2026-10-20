import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, Check, X, Sparkles, Heart } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface NonogramPuzzle {
  name: string;
  size: number;
  rowClues: number[][];
  colClues: number[][];
  solution: number[][]; // 1: filled, 0: empty
}

const PUZZLES: NonogramPuzzle[] = [
  {
    name: 'Cuore Antifragile',
    size: 5,
    rowClues: [[1, 1], [5], [5], [3], [1]],
    colClues: [[2], [4], [4], [4], [2]],
    solution: [
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
  },
  {
    name: 'Lampadina dell\'Intuizione',
    size: 5,
    rowClues: [[3], [5], [3], [1], [1]],
    colClues: [[1], [3], [5], [3], [1]],
    solution: [
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
  },
  {
    name: 'Calice Stoico',
    size: 5,
    rowClues: [[5], [3], [1], [1], [3]],
    colClues: [[1, 1], [1, 1], [5], [1, 1], [1, 1]],
    solution: [
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
    ],
  },
];

export const NonogramGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const [board, setBoard] = useState<number[][]>([]); // 0: empty, 1: filled, 2: marked X
  const [tool, setTool] = useState<'fill' | 'cross'>('fill');
  const [mistakes, setMistakes] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  const puzzle = PUZZLES[puzzleIdx];

  const initPuzzle = useCallback((idx: number) => {
    const p = PUZZLES[idx];
    const initialBoard = Array(p.size)
      .fill(0)
      .map(() => Array(p.size).fill(0));
    setBoard(initialBoard);
    setTool('fill');
    setMistakes(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initPuzzle(puzzleIdx);
  }, [puzzleIdx, initPuzzle]);

  const handleCellClick = (r: number, c: number) => {
    if (isWon) return;

    soundFx.playClick();
    const currentVal = board[r][c];
    const newBoard = board.map(row => [...row]);

    if (tool === 'fill') {
      newBoard[r][c] = currentVal === 1 ? 0 : 1;
    } else {
      newBoard[r][c] = currentVal === 2 ? 0 : 2;
    }

    setBoard(newBoard);

    // Check if correct
    let matches = true;
    for (let row = 0; row < puzzle.size; row++) {
      for (let col = 0; col < puzzle.size; col++) {
        const isFilled = newBoard[row][col] === 1;
        const shouldBeFilled = puzzle.solution[row][col] === 1;
        if (isFilled !== shouldBeFilled) {
          matches = false;
          break;
        }
      }
    }

    if (matches) {
      soundFx.playLevelUp();
      setIsWon(true);
      onComplete({
        gameId: 'nonogram-picross',
        gameTitle: 'Nonogram Pixel Logic',
        category: 'logic',
        score: 950,
        accuracy: 100,
        averageReactionTimeMs: 1800,
        difficultyLevel: 2,
      });
    }
  };

  return (
    <div id="nonogram-game-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Logica Visiva
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => initPuzzle(puzzleIdx)}
            className="p-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Puzzle selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {PUZZLES.map((p, idx) => (
          <button
            key={p.name}
            onClick={() => {
              soundFx.playClick();
              setPuzzleIdx(idx);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              puzzleIdx === idx
                ? 'bg-[#1E4332] text-white shadow-xs'
                : 'bg-white border border-[#CBDDD2] text-[#557163] hover:bg-[#F2F7F4]'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Tools toggle (Fill vs Cross) */}
      <div className="flex gap-2 bg-white border border-[#CBDDD2] rounded-2xl p-1.5 shadow-2xs">
        <button
          onClick={() => {
            soundFx.playClick();
            setTool('fill');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            tool === 'fill'
              ? 'bg-[#1E4332] text-white shadow-xs'
              : 'text-[#557163] hover:bg-[#F2F7F4]'
          }`}
        >
          <div className="w-3.5 h-3.5 bg-[#52D195] rounded-sm" />
          <span>Colora Cella</span>
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            setTool('cross');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            tool === 'cross'
              ? 'bg-[#1E4332] text-white shadow-xs'
              : 'text-[#557163] hover:bg-[#F2F7F4]'
          }`}
        >
          <X className="w-4 h-4 text-[#E63946]" />
          <span>Segna Croce (X)</span>
        </button>
      </div>

      {/* Nonogram Grid Container with Column & Row Clues */}
      <div className="bg-[#122219] p-4 rounded-3xl shadow-xl flex justify-center">
        <div className="inline-block">
          {/* Top Column Clues */}
          <div className="flex pl-12 sm:pl-16 mb-1 gap-1">
            {puzzle.colClues.map((clues, cIdx) => (
              <div
                key={cIdx}
                className="w-10 sm:w-12 flex flex-col items-center justify-end text-[11px] font-mono font-bold text-[#52D195] leading-tight pb-1"
              >
                {clues.map((num, i) => (
                  <span key={i}>{num}</span>
                ))}
              </div>
            ))}
          </div>

          {/* Grid Rows with Left Clues */}
          <div className="space-y-1">
            {puzzle.rowClues.map((clues, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1">
                {/* Left Row Clues */}
                <div className="w-12 sm:w-16 flex items-center justify-end gap-1.5 pr-2 text-[11px] font-mono font-bold text-[#52D195]">
                  {clues.map((num, i) => (
                    <span key={i}>{num}</span>
                  ))}
                </div>

                {/* Grid Cells in this row */}
                <div className="flex gap-1">
                  {board[rIdx]?.map((cellVal, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-sm select-none transition-all duration-100 cursor-pointer ${
                        cellVal === 1
                          ? 'bg-[#52D195] text-[#122219] shadow-inner'
                          : cellVal === 2
                          ? 'bg-[#1D382A] text-[#E63946]'
                          : 'bg-[#FAFDFB] hover:bg-[#E5F2EC] text-transparent'
                      }`}
                    >
                      {cellVal === 2 ? '✕' : ''}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
            <h3 className="text-lg font-bold">Immagine Svelata: {puzzle.name}!</h3>
            <p className="text-xs text-[#BED8CA]">Hai completato il Nonogram con deduzione logica rigorosa.</p>
            <button
              onClick={() => setPuzzleIdx((puzzleIdx + 1) % PUZZLES.length)}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Prossimo Schema
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
