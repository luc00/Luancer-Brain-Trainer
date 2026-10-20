import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, Check, Sparkles, HelpCircle, Calculator } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

// Kakuro Cell:
// type: 'black' (clue cell with down/across sums) or 'white' (user editable digit 1-9)
interface KakuroCell {
  r: number;
  c: number;
  type: 'black' | 'white';
  sumDown?: number;
  sumAcross?: number;
  val: number; // 0 if empty
  solutionVal?: number;
}

const KAKURO_PUZZLE_1: KakuroCell[][] = [
  [
    { r: 0, c: 0, type: 'black', val: 0 },
    { r: 0, c: 1, type: 'black', sumDown: 4, val: 0 },
    { r: 0, c: 2, type: 'black', sumDown: 11, val: 0 },
    { r: 0, c: 3, type: 'black', val: 0 },
  ],
  [
    { r: 1, c: 0, type: 'black', sumAcross: 3, val: 0 },
    { r: 1, c: 1, type: 'white', val: 0, solutionVal: 1 },
    { r: 1, c: 2, type: 'white', val: 0, solutionVal: 2 },
    { r: 1, c: 3, type: 'black', sumDown: 6, val: 0 },
  ],
  [
    { r: 2, c: 0, type: 'black', sumAcross: 12, val: 0 },
    { r: 2, c: 1, type: 'white', val: 0, solutionVal: 3 },
    { r: 2, c: 2, type: 'white', val: 0, solutionVal: 9 },
    { r: 2, c: 3, type: 'white', val: 0, solutionVal: 0 },
  ],
  [
    { r: 3, c: 0, type: 'black', val: 0 },
    { r: 3, c: 1, type: 'black', sumAcross: 6, val: 0 },
    { r: 3, c: 2, type: 'white', val: 0, solutionVal: 0 },
    { r: 3, c: 3, type: 'white', val: 0, solutionVal: 6 },
  ]
];

// Let's create a solid 4x4 Kakuro grid:
// Row 1: [Black] [Down: 4] [Down: 11] [Black]
// Row 2: [Across: 3] [Cell: 1] [Cell: 2] [Down: 7]
// Row 3: [Across: 16] [Cell: 3] [Cell: 9] [Cell: 4]
// Row 4: [Black] [Black] [Across: 3] [Cell: 3]
const SAMPLE_KAKURO: KakuroCell[][] = [
  [
    { r: 0, c: 0, type: 'black', val: 0 },
    { r: 0, c: 1, type: 'black', sumDown: 4, val: 0 },
    { r: 0, c: 2, type: 'black', sumDown: 11, val: 0 },
    { r: 0, c: 3, type: 'black', val: 0 },
  ],
  [
    { r: 1, c: 0, type: 'black', sumAcross: 3, val: 0 },
    { r: 1, c: 1, type: 'white', val: 0, solutionVal: 1 },
    { r: 1, c: 2, type: 'white', val: 0, solutionVal: 2 },
    { r: 1, c: 3, type: 'black', sumDown: 7, val: 0 },
  ],
  [
    { r: 2, c: 0, type: 'black', sumAcross: 16, val: 0 },
    { r: 2, c: 1, type: 'white', val: 0, solutionVal: 3 },
    { r: 2, c: 2, type: 'white', val: 0, solutionVal: 9 },
    { r: 2, c: 3, type: 'white', val: 0, solutionVal: 4 },
  ],
  [
    { r: 3, c: 0, type: 'black', val: 0 },
    { r: 3, c: 1, type: 'black', val: 0 },
    { r: 3, c: 2, type: 'black', sumAcross: 3, val: 0 },
    { r: 3, c: 3, type: 'white', val: 0, solutionVal: 3 },
  ],
];

export const KakuroGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [grid, setGrid] = useState<KakuroCell[][]>(() =>
    SAMPLE_KAKURO.map(row => row.map(cell => ({ ...cell })))
  );
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);

  const resetGame = () => {
    soundFx.playClick();
    setGrid(SAMPLE_KAKURO.map(row => row.map(cell => ({ ...cell, val: 0 }))));
    setSelectedCell(null);
    setIsWon(false);
  };

  const handleInputNumber = (num: number) => {
    if (!selectedCell || isWon) return;
    const { r, c } = selectedCell;
    if (grid[r][c].type !== 'white') return;

    soundFx.playClick();
    const updated = grid.map(row =>
      row.map(cell => (cell.r === r && cell.c === c ? { ...cell, val: num } : cell))
    );
    setGrid(updated);

    // Check solution
    let allCorrect = true;
    for (let row of updated) {
      for (let cell of row) {
        if (cell.type === 'white') {
          if (cell.val !== cell.solutionVal) {
            allCorrect = false;
            break;
          }
        }
      }
    }

    if (allCorrect) {
      soundFx.playLevelUp();
      setIsWon(true);
      onComplete({
        gameId: 'kakuro-math',
        gameTitle: 'Kakuro Somme Incrociate',
        category: 'logic',
        score: 950,
        accuracy: 100,
        averageReactionTimeMs: 2500,
        difficultyLevel: 2,
      });
    }
  };

  return (
    <div id="kakuro-game-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Logica & Numeri
        </button>

        <button
          onClick={resetGame}
          className="p-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Rules banner */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#CBDDD2] text-xs text-[#557163] shadow-2xs space-y-1">
        <strong className="text-[#122219] flex items-center gap-1.5 font-bold">
          <Calculator className="w-4 h-4 text-[#2E7652]" /> Regole del Kakuro:
        </strong>
        <p>
          Riempi le caselle bianche con cifre da 1 a 9 in modo che la somma delle cifre corrisponda al numero indicato (sotto la linea per la colonna, sopra la linea per la riga), senza ripetere cifre nella stessa sequenza.
        </p>
      </div>

      {/* 4x4 Kakuro Grid */}
      <div className="bg-[#122219] p-3 rounded-3xl shadow-xl flex items-center justify-center">
        <div className="grid grid-cols-4 gap-1.5 w-full max-w-[320px] aspect-square">
          {grid.map(row =>
            row.map(cell => {
              const isSelected = selectedCell?.r === cell.r && selectedCell?.c === cell.c;

              if (cell.type === 'black') {
                return (
                  <div
                    key={`${cell.r}-${cell.c}`}
                    className="relative bg-[#1A3326] border border-[#2D543F] rounded-xl overflow-hidden flex items-center justify-center select-none"
                  >
                    {/* Diagonal line if clue */}
                    {(cell.sumDown || cell.sumAcross) && (
                      <>
                        <div className="absolute inset-0 border-t border-[#3E6C55] transform rotate-45 origin-top-left scale-150 pointer-events-none" />
                        {cell.sumDown && (
                          <span className="absolute bottom-1 left-1.5 text-[11px] font-black text-[#52D195] font-mono leading-none">
                            {cell.sumDown}
                          </span>
                        )}
                        {cell.sumAcross && (
                          <span className="absolute top-1.5 right-1.5 text-[11px] font-black text-[#F4D06F] font-mono leading-none">
                            {cell.sumAcross}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={`${cell.r}-${cell.c}`}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCell({ r: cell.r, c: cell.c });
                  }}
                  className={`rounded-xl flex items-center justify-center font-black text-xl select-none transition-all duration-100 cursor-pointer ${
                    isSelected
                      ? 'bg-[#BFE2D0] border-2 border-[#1E4332] text-[#122219] scale-95 shadow-md'
                      : cell.val !== 0
                      ? 'bg-white text-[#1E4332] shadow-xs'
                      : 'bg-[#FAFDFB] hover:bg-[#E5F2EC] text-transparent'
                  }`}
                >
                  {cell.val !== 0 ? cell.val : ''}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Number keypad */}
      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleInputNumber(num)}
            className="h-11 rounded-2xl bg-white border border-[#CBDDD2] hover:bg-[#E5F2EC] text-[#122219] font-extrabold text-base flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleInputNumber(0)}
          className="h-11 rounded-2xl bg-[#F2F7F4] border border-[#CBDDD2] text-[#8C3445] font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer"
        >
          Cancella
        </button>
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
            <h3 className="text-lg font-bold">Kakuro Risolto!</h3>
            <p className="text-xs text-[#BED8CA]">Hai bilanciato perfettamente tutte le somme incrociate.</p>
            <button
              onClick={resetGame}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Rigioca
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
