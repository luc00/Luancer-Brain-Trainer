import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Clock, Trophy, Flame, Sparkles, Check } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

const GRID_SIZE = 8;
const LETTERS = 'AAAAAEEEEIIIIOOOOOUUUBBCDDFGGHLLMMNNPPRRSSTTVVZ';

// Sample valid word check list in Italian
const VALID_WORDS = new Set([
  'MENTE', 'FORZA', 'TEMPO', 'MONDO', 'CUORE', 'VALORE', 'SENSO', 'ANIMA', 'PENSO', 'GUIDA',
  'PASSO', 'RAGIONE', 'NOTTE', 'FUOCO', 'CORPO', 'PIANO', 'SEGNO', 'SPAZIO', 'VIVERE', 'FUTURO',
  'LOGICA', 'FOCUS', 'VERITA', 'LUCE', 'VITA', 'RETE', 'MARE', 'SOLE', 'VENTO', 'ALTO', 'BASE',
  'PORTA', 'PACE', 'SOGNO', 'IDEA', 'ARTE', 'NOTE', 'LINEA', 'CASA', 'LUNA', 'ROMA', 'AMORE',
  'UOMO', 'DONNA', 'NERO', 'VERDE', 'LIBRO', 'ARIA', 'BENE', 'VIRTÙ', 'SAGGIO', 'CALMA', 'OTTIMO'
]);

export const WordWipeGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCoords, setSelectedCoords] = useState<{ r: number; c: number }[]>([]);
  const [score, setScore] = useState<number>(0);
  const [linesCleared, setLinesCleared] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  // Initialize random grid
  const initializeGrid = useCallback(() => {
    const newGrid: string[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: string[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        const char = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        row.push(char);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setSelectedCoords([]);
    setScore(0);
    setLinesCleared(0);
    setTimeLeft(120);
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  // Timer
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          soundFx.playError();
          onComplete({
            gameId: 'word-wipe',
            gameTitle: 'WordWipe Cascata di Parole',
            category: 'language',
            score: Math.min(1000, score),
            accuracy: 90,
            averageReactionTimeMs: 1400,
            difficultyLevel: 2,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver, score, onComplete]);

  // Current selected word string
  const currentWord = selectedCoords.map(coord => grid[coord.r]?.[coord.c] || '').join('');

  // Check if neighbour
  const isAdjacent = (last: { r: number; c: number }, next: { r: number; c: number }) => {
    const dr = Math.abs(last.r - next.r);
    const dc = Math.abs(last.c - next.c);
    return dr <= 1 && dc <= 1 && (dr !== 0 || dc !== 0);
  };

  const handleCellClick = (r: number, c: number) => {
    if (isGameOver) return;
    if (grid[r][c] === '') return;

    soundFx.playClick();
    const existingIdx = selectedCoords.findIndex(coord => coord.r === r && coord.c === c);

    if (existingIdx !== -1) {
      // Backtrack
      setSelectedCoords(selectedCoords.slice(0, existingIdx + 1));
      return;
    }

    if (selectedCoords.length === 0) {
      setSelectedCoords([{ r, c }]);
    } else {
      const last = selectedCoords[selectedCoords.length - 1];
      if (isAdjacent(last, { r, c })) {
        setSelectedCoords([...selectedCoords, { r, c }]);
      }
    }
  };

  // Submit word
  const submitWord = () => {
    if (selectedCoords.length < 3 || isGameOver) {
      setSelectedCoords([]);
      return;
    }

    const word = currentWord.toUpperCase();
    const isValid = VALID_WORDS.has(word) || word.length >= 4;

    if (isValid) {
      soundFx.playSuccess();
      const points = word.length * 50 + (word.length > 5 ? 150 : 0);
      setScore(s => s + points);

      // Wipe out letters
      const newGrid = grid.map(row => [...row]);
      selectedCoords.forEach(coord => {
        newGrid[coord.r][coord.c] = '';
      });

      // Apply Gravity down
      for (let c = 0; c < GRID_SIZE; c++) {
        let emptySpot = GRID_SIZE - 1;
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
          if (newGrid[r][c] !== '') {
            const val = newGrid[r][c];
            newGrid[r][c] = '';
            newGrid[emptySpot][c] = val;
            emptySpot--;
          }
        }
      }

      // Check fully cleared rows or columns
      let cleared = 0;
      for (let r = 0; r < GRID_SIZE; r++) {
        if (newGrid[r].every(ch => ch === '')) cleared++;
      }
      setLinesCleared(cleared);
      setGrid(newGrid);
    } else {
      soundFx.playError();
    }

    setSelectedCoords([]);
  };

  return (
    <div id="wordwipe-game-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Linguaggio
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-2.5 py-1 rounded-full border border-[#CBDDD2]">
            <Clock className="w-3.5 h-3.5" /> {timeLeft}s
          </div>
          <div className="text-right px-2.5 py-1 rounded-full bg-[#FBF2E3] border border-[#E9CE9E] text-xs font-mono font-bold text-[#8C5D19]">
            {score} pt
          </div>
        </div>
      </div>

      {/* Selected word display */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-2xl p-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#557163] font-bold uppercase">Parola:</span>
          <span className="text-base font-black font-mono tracking-wider text-[#1E4332]">
            {currentWord || 'SELEZIONA LETTERE'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedCoords([])}
            disabled={selectedCoords.length === 0}
            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#F0F5F2] hover:bg-[#E2ECE6] text-[#557163] disabled:opacity-40 cursor-pointer"
          >
            Cancella
          </button>
          <button
            onClick={submitWord}
            disabled={selectedCoords.length < 3}
            className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-[#1E4332] text-white hover:bg-[#2A5741] disabled:opacity-40 transition shadow-2xs cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Invia
          </button>
        </div>
      </div>

      {/* 8x8 Board Grid */}
      <div className="bg-[#122219] p-2.5 rounded-3xl shadow-lg aspect-square flex items-center justify-center">
        <div className="grid grid-cols-8 gap-1.5 w-full h-full">
          {grid.map((row, r) =>
            row.map((char, c) => {
              const isSelected = selectedCoords.some(coord => coord.r === r && coord.c === c);
              const isEmpty = char === '';

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  disabled={isEmpty}
                  className={`rounded-xl flex items-center justify-center font-extrabold text-sm sm:text-base select-none transition-all duration-150 cursor-pointer ${
                    isEmpty
                      ? 'bg-[#182C22] opacity-20 pointer-events-none'
                      : isSelected
                      ? 'bg-[#52D195] text-[#122219] scale-95 border-2 border-white shadow-md'
                      : 'bg-[#FAFDFB] text-[#122219] hover:bg-[#E5F2EC] shadow-2xs'
                  }`}
                >
                  {char}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Game Over Banner */}
      {isGameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
        >
          <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
          <h3 className="text-lg font-bold">Tempo Scaduto!</h3>
          <p className="text-xs text-[#BED8CA]">
            Punteggio ottenuto: <strong className="text-[#52D195] font-mono text-sm">{score} pt</strong>
          </p>
          <button
            onClick={initializeGrid}
            className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
          >
            Gioca di Nuovo
          </button>
        </motion.div>
      )}
    </div>
  );
};
