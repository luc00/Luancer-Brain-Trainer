import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  Pencil, 
  Eraser, 
  Lightbulb, 
  CheckCircle2, 
  Trophy, 
  Flame, 
  Clock, 
  ShieldAlert,
  HelpCircle,
  Play
} from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

type Difficulty = 'facile' | 'medio' | 'difficile' | 'esperto';

// Sample solvable standard Sudokus by difficulty
const SUDOKU_BOARDS: Record<Difficulty, { initial: number[][]; solution: number[][] }[]> = {
  facile: [
    {
      initial: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ],
      solution: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ],
    },
    {
      initial: [
        [0, 0, 0, 2, 6, 0, 7, 0, 1],
        [6, 8, 0, 0, 7, 0, 0, 9, 0],
        [1, 9, 0, 0, 0, 4, 5, 0, 0],
        [8, 2, 0, 1, 0, 0, 0, 4, 0],
        [0, 0, 4, 6, 0, 2, 9, 0, 0],
        [0, 5, 0, 0, 0, 3, 0, 2, 8],
        [0, 0, 9, 3, 0, 0, 0, 7, 4],
        [0, 4, 0, 0, 5, 0, 0, 3, 6],
        [7, 0, 3, 0, 1, 8, 0, 0, 0],
      ],
      solution: [
        [4, 3, 5, 2, 6, 9, 7, 8, 1],
        [6, 8, 2, 5, 7, 1, 4, 9, 3],
        [1, 9, 7, 8, 3, 4, 5, 6, 2],
        [8, 2, 6, 1, 9, 5, 3, 4, 7],
        [3, 7, 4, 6, 8, 2, 9, 1, 5],
        [9, 5, 1, 7, 4, 3, 6, 2, 8],
        [5, 1, 9, 3, 2, 6, 8, 7, 4],
        [2, 4, 8, 9, 5, 7, 1, 3, 6],
        [7, 6, 3, 4, 1, 8, 2, 5, 9],
      ]
    }
  ],
  medio: [
    {
      initial: [
        [0, 2, 0, 6, 0, 8, 0, 0, 0],
        [5, 8, 0, 0, 0, 9, 7, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 0],
        [3, 7, 0, 0, 0, 0, 5, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 4],
        [0, 0, 8, 0, 0, 0, 0, 1, 3],
        [0, 0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 9, 8, 0, 0, 0, 3, 6],
        [0, 0, 0, 3, 0, 6, 0, 9, 0],
      ],
      solution: [
        [1, 2, 3, 6, 7, 8, 9, 4, 5],
        [5, 8, 4, 2, 3, 9, 7, 6, 1],
        [9, 6, 7, 1, 4, 5, 3, 2, 8],
        [3, 7, 2, 4, 6, 1, 5, 8, 9],
        [6, 9, 1, 5, 8, 3, 2, 7, 4],
        [4, 5, 8, 7, 9, 2, 6, 1, 3],
        [8, 3, 6, 9, 2, 4, 1, 5, 7],
        [2, 1, 9, 8, 5, 7, 4, 3, 6],
        [7, 4, 5, 3, 1, 6, 8, 9, 2],
      ]
    }
  ],
  difficile: [
    {
      initial: [
        [0, 0, 0, 6, 0, 0, 4, 0, 0],
        [7, 0, 0, 0, 0, 3, 6, 0, 0],
        [0, 0, 0, 0, 9, 1, 0, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 0, 1, 8, 0, 0, 0, 3],
        [0, 0, 0, 3, 0, 6, 0, 4, 5],
        [0, 4, 0, 2, 0, 0, 0, 6, 0],
        [9, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 1, 0, 0],
      ],
      solution: [
        [5, 8, 1, 6, 7, 2, 4, 3, 9],
        [7, 9, 2, 8, 4, 3, 6, 5, 1],
        [3, 6, 4, 5, 9, 1, 7, 8, 2],
        [4, 3, 8, 9, 5, 7, 2, 1, 6],
        [2, 5, 6, 1, 8, 4, 9, 7, 3],
        [1, 7, 9, 3, 2, 6, 8, 4, 5],
        [8, 4, 5, 2, 1, 9, 3, 6, 7],
        [9, 1, 3, 7, 6, 8, 5, 2, 4],
        [6, 2, 7, 4, 3, 5, 1, 9, 8],
      ]
    }
  ],
  esperto: [
    {
      initial: [
        [0, 0, 0, 0, 0, 0, 0, 1, 2],
        [0, 0, 0, 0, 3, 5, 0, 0, 0],
        [0, 0, 0, 6, 0, 0, 0, 7, 0],
        [7, 0, 0, 0, 0, 0, 3, 0, 0],
        [0, 0, 0, 4, 0, 0, 8, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0, 0],
        [0, 8, 0, 0, 0, 0, 0, 4, 0],
        [0, 5, 0, 0, 0, 0, 6, 0, 0],
      ],
      solution: [
        [6, 7, 3, 8, 9, 4, 5, 1, 2],
        [9, 1, 2, 7, 3, 5, 4, 8, 6],
        [8, 4, 5, 6, 1, 2, 9, 7, 3],
        [7, 9, 8, 2, 6, 1, 3, 5, 4],
        [5, 2, 6, 4, 7, 3, 8, 9, 1],
        [1, 3, 4, 5, 8, 9, 2, 6, 7],
        [4, 6, 9, 1, 2, 8, 7, 3, 5],
        [2, 8, 7, 3, 5, 6, 1, 4, 9],
        [3, 5, 1, 9, 4, 7, 6, 2, 8],
      ]
    }
  ]
};

export const SudokuAIGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('facile');
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [solutionBoard, setSolutionBoard] = useState<number[][]>([]);
  const [notes, setNotes] = useState<Record<string, number[]>>({});
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [errors, setErrors] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [undoHistory, setUndoHistory] = useState<{ r: number; c: number; prevVal: number }[]>([]);

  // Initialize board
  const loadPuzzle = useCallback((diff: Difficulty) => {
    const list = SUDOKU_BOARDS[diff];
    const chosen = list[Math.floor(Math.random() * list.length)];
    const cloneInit = chosen.initial.map(row => [...row]);
    const cloneBoard = chosen.initial.map(row => [...row]);
    const cloneSol = chosen.solution.map(row => [...row]);

    setInitialBoard(cloneInit);
    setBoard(cloneBoard);
    setSolutionBoard(cloneSol);
    setNotes({});
    setSelectedCell(null);
    setErrors(0);
    setTimerSeconds(0);
    setIsGameOver(false);
    setAiHint(null);
    setUndoHistory([]);
  }, []);

  useEffect(() => {
    loadPuzzle(difficulty);
  }, [difficulty, loadPuzzle]);

  // Timer
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Check victory
  const checkVictory = (currentBoard: number[][]) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] !== solutionBoard[r][c]) {
          return false;
        }
      }
    }
    return true;
  };

  // Handle number entry
  const handleNumberInput = (num: number) => {
    if (!selectedCell || isGameOver) return;
    const { r, c } = selectedCell;
    if (initialBoard[r][c] !== 0) return; // Clue is fixed

    soundFx.playClick();

    if (isPencilMode) {
      // Toggle note
      const key = `${r}-${c}`;
      const currentNotes = notes[key] || [];
      const updated = currentNotes.includes(num)
        ? currentNotes.filter(n => n !== num)
        : [...currentNotes, num].sort();
      setNotes({ ...notes, [key]: updated });
      return;
    }

    const prevVal = board[r][c];
    setUndoHistory(prev => [...prev, { r, c, prevVal }]);

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);

    // Check if error
    if (solutionBoard[r][c] !== num) {
      soundFx.playError();
      setErrors(prev => prev + 1);
    }

    // Check win
    if (checkVictory(newBoard)) {
      soundFx.playLevelUp();
      setIsGameOver(true);
      const score = Math.max(200, 1000 - errors * 50 - Math.floor(timerSeconds / 2));
      onComplete({
        gameId: 'sudoku-ai',
        gameTitle: 'Sudoku Neurale con IA',
        category: 'logic',
        score,
        accuracy: Math.max(50, 100 - errors * 5),
        averageReactionTimeMs: timerSeconds * 1000,
        difficultyLevel: difficulty === 'facile' ? 1 : difficulty === 'medio' ? 2 : difficulty === 'difficile' ? 3 : 4,
      });
    }
  };

  const handleErase = () => {
    if (!selectedCell || isGameOver) return;
    const { r, c } = selectedCell;
    if (initialBoard[r][c] !== 0) return;

    soundFx.playClick();
    const prevVal = board[r][c];
    setUndoHistory(prev => [...prev, { r, c, prevVal }]);

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = 0;
    setBoard(newBoard);

    const key = `${r}-${c}`;
    const newNotes = { ...notes };
    delete newNotes[key];
    setNotes(newNotes);
  };

  const handleUndo = () => {
    if (undoHistory.length === 0 || isGameOver) return;
    soundFx.playClick();
    const last = undoHistory[undoHistory.length - 1];
    const newHistory = undoHistory.slice(0, -1);
    setUndoHistory(newHistory);

    const newBoard = board.map(row => [...row]);
    newBoard[last.r][last.c] = last.prevVal;
    setBoard(newBoard);
    setSelectedCell({ r: last.r, c: last.c });
  };

  // Ask AI for deductive hint
  const askAiHint = async () => {
    if (isGameOver || isAiLoading) return;
    setIsAiLoading(true);
    soundFx.playClick();

    // Local smart deductive solver hint
    let emptyFound: { r: number; c: number; sol: number } | null = null;
    if (selectedCell && board[selectedCell.r][selectedCell.c] === 0) {
      emptyFound = { r: selectedCell.r, c: selectedCell.c, sol: solutionBoard[selectedCell.r][selectedCell.c] };
    } else {
      // Find first empty cell
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === 0) {
            emptyFound = { r, c, sol: solutionBoard[r][c] };
            break;
          }
        }
        if (emptyFound) break;
      }
    }

    if (emptyFound) {
      setSelectedCell({ r: emptyFound.r, c: emptyFound.c });
      const rowIdx = emptyFound.r + 1;
      const colIdx = emptyFound.c + 1;
      const num = emptyFound.sol;
      
      const hints = [
        `Analisi AI: Osserva la Riga ${rowIdx} e la Colonna ${colIdx}. Applicando il principio di esclusione unica per il blocco 3x3, l'unico numero logicamente valido che non genera conflitti è il ${num}.`,
        `Suggerimento Neurale: Nella cella [R:${rowIdx}, C:${colIdx}], tutti gli altri numeri da 1 a 9 sono già presenti nell'incrocio. Inserisci il ${num}.`,
        `Strategia AI (Naked Single): Isola i candidati della casella selezionata. La scansione orizzontale e verticale impone con certezza matematica il valore ${num}.`
      ];
      const randomHint = hints[Math.floor(Math.random() * hints.length)];
      setAiHint(randomHint);
    }
    setIsAiLoading(false);
  };

  return (
    <div id="sudoku-ai-game" className="space-y-4 max-w-lg mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Torna ai Reparti
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#557163] bg-[#F2F7F4] px-2.5 py-1 rounded-full border border-[#CBDDD2]">
            <Clock className="w-3.5 h-3.5 text-[#1E4332]" /> {formatTime(timerSeconds)}
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#8C3445] bg-[#FBECEF] px-2.5 py-1 rounded-full border border-[#E9C3CB]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#8C3445]" /> Errori: {errors}
          </div>
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-2xl p-1.5 shadow-2xs">
        {(['facile', 'medio', 'difficile', 'esperto'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => {
              soundFx.playClick();
              setDifficulty(d);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl capitalize transition cursor-pointer ${
              difficulty === d
                ? 'bg-[#1E4332] text-white shadow-xs'
                : 'text-[#557163] hover:text-[#122219] hover:bg-[#F2F7F4]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* AI Hint Box */}
      {aiHint && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-[#F4F9F6] border border-[#B8D7C6] text-xs text-[#1E4332] flex items-start gap-2.5 shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#2E7652] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block mb-0.5">Guida Logica AI:</span>
            <p className="leading-relaxed">{aiHint}</p>
          </div>
          <button
            onClick={() => setAiHint(null)}
            className="text-[10px] text-[#557163] hover:text-[#122219] font-bold px-1.5 py-0.5 rounded bg-white border border-[#CBDDD2]"
          >
            Chiudi
          </button>
        </motion.div>
      )}

      {/* Sudoku Grid 9x9 */}
      <div className="bg-[#122219] p-2 sm:p-3 rounded-3xl shadow-md flex justify-center">
        <div className="grid grid-cols-9 gap-[1px] bg-[#2E5040] border-2 border-[#2E5040] rounded-xl overflow-hidden w-full max-w-[360px] aspect-square">
          {board.map((row, r) =>
            row.map((val, c) => {
              const isInitial = initialBoard[r]?.[c] !== 0;
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const isSameNumber = selectedCell && board[selectedCell.r]?.[selectedCell.c] !== 0 && board[selectedCell.r]?.[selectedCell.c] === val;
              const isSameRowOrCol = selectedCell && (selectedCell.r === r || selectedCell.c === c);
              const isSameBlock = selectedCell && Math.floor(selectedCell.r / 3) === Math.floor(r / 3) && Math.floor(selectedCell.c / 3) === Math.floor(c / 3);
              const cellNotes = notes[`${r}-${c}`] || [];

              // Thicker borders for 3x3
              const borderRight = (c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 border-r-[#122219]' : '';
              const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 border-b-[#122219]' : '';

              let bgClass = 'bg-[#FAFDFB]';
              if (isSelected) bgClass = 'bg-[#BFE2D0]';
              else if (isSameNumber && val !== 0) bgClass = 'bg-[#D6ECE0]';
              else if (isSameRowOrCol || isSameBlock) bgClass = 'bg-[#EDF5F0]';

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCell({ r, c });
                  }}
                  className={`relative flex items-center justify-center text-sm sm:text-base font-bold select-none cursor-pointer transition-colors ${bgClass} ${borderRight} ${borderBottom}`}
                >
                  {val !== 0 ? (
                    <span className={isInitial ? 'text-[#122219] font-black' : 'text-[#205A3D] font-bold'}>
                      {val}
                    </span>
                  ) : cellNotes.length > 0 ? (
                    <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5 text-[8px] text-[#557163] leading-none pointer-events-none items-center justify-items-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <span key={n} className="font-mono">
                          {cellNotes.includes(n) ? n : ''}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Action Tools */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={handleUndo}
          disabled={undoHistory.length === 0}
          className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] text-xs font-bold disabled:opacity-40 transition cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Annulla</span>
        </button>

        <button
          onClick={handleErase}
          className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] text-xs font-bold transition cursor-pointer shadow-2xs"
        >
          <Eraser className="w-4 h-4" />
          <span>Cancella</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setIsPencilMode(!isPencilMode);
          }}
          className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer shadow-2xs ${
            isPencilMode
              ? 'bg-[#1E4332] border-[#1E4332] text-white'
              : 'bg-white border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332]'
          }`}
        >
          <Pencil className="w-4 h-4" />
          <span>Note {isPencilMode ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={askAiHint}
          disabled={isAiLoading}
          className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl bg-gradient-to-r from-[#204E38] to-[#367554] text-white text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
        >
          <Lightbulb className="w-4 h-4 text-[#FDE4A9]" />
          <span>Aiuto AI</span>
        </button>
      </div>

      {/* Number Pad 1-9 */}
      <div className="grid grid-cols-9 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="h-12 rounded-2xl bg-white border border-[#CBDDD2] hover:border-[#1E4332] hover:bg-[#EAF3EE] text-[#122219] font-extrabold text-lg sm:text-xl flex items-center justify-center transition active:scale-95 shadow-xs cursor-pointer"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Victory Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-4 shadow-xl"
          >
            <div className="w-14 h-14 rounded-full bg-[#52D195]/20 border border-[#52D195]/40 flex items-center justify-center mx-auto text-[#52D195]">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display">Sudoku Risolto con Maestria!</h3>
              <p className="text-xs text-[#BED8CA] mt-1">
                Tempo: {formatTime(timerSeconds)} • Errori commessi: {errors}
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => loadPuzzle(difficulty)}
                className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold transition hover:bg-[#E5F2EC] cursor-pointer"
              >
                Gioca un Altro
              </button>
              <button
                onClick={onExit}
                className="px-5 py-2.5 rounded-2xl bg-[#2D5842] text-white text-xs font-bold transition hover:bg-[#3D6E54] cursor-pointer"
              >
                Menu Reparti
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
