import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { CognitiveCategory } from '../../types';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Flame,
  Lightbulb,
  Calculator,
  Sparkles,
  HelpCircle,
  Check
} from 'lucide-react';

interface Props {
  onComplete: (score: number, accuracy: number, category: CognitiveCategory) => void;
  onBack: () => void;
}

interface CryptarithmPuzzle {
  id: string;
  title: string;
  difficulty: 'Difficile' | 'Estremo' | 'Grandmaster';
  words: string[]; // e.g. ['SEND', 'MORE', 'MONEY'] (sum of first N-1 equals last)
  solution: Record<string, number>;
  description: string;
}

const PUZZLES: CryptarithmPuzzle[] = [
  {
    id: 'send-more-money',
    title: 'SEND + MORE = MONEY',
    difficulty: 'Difficile',
    words: ['SEND', 'MORE', 'MONEY'],
    solution: { S: 9, E: 5, N: 6, D: 7, M: 1, O: 0, R: 8, Y: 2 },
    description: 'Il più celebre criptoaritmo della storia (Dudeney, 1924). Determina la cifra unica (0-9) corrispondente a ciascuna lettera.'
  },
  {
    id: 'cross-roads-danger',
    title: 'CROSS + ROADS = DANGER',
    difficulty: 'Estremo',
    words: ['CROSS', 'ROADS', 'DANGER'],
    solution: { C: 9, R: 6, O: 2, S: 3, A: 5, D: 1, N: 8, G: 7, E: 4 },
    description: 'Nove lettere uniche e riporti multipli a cascata su 6 colonne aritmetiche.'
  },
  {
    id: 'base-ball-games',
    title: 'BASE + BALL = GAMES',
    difficulty: 'Grandmaster',
    solution: { B: 7, A: 4, S: 8, E: 3, L: 5, G: 1, M: 9 },
    words: ['BASE', 'BALL', 'GAMES'],
    description: 'Tre parole a 4 e 5 lettere con vincoli di parità e riporto superiore.'
  }
];

export const CryptarithmGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = PUZZLES[puzzleIdx];

  // Mapping from Letter -> Digit (or null)
  const [letterMap, setLetterMap] = useState<Record<string, number | null>>({});
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);

  // Extract all unique letters in puzzle
  const uniqueLetters = useMemo(() => {
    const letters = new Set<string>();
    puzzle.words.forEach(w => {
      w.split('').forEach(char => letters.add(char));
    });
    return Array.from(letters);
  }, [puzzle]);

  // First letters cannot be 0
  const leadingLetters = useMemo(() => {
    return new Set(puzzle.words.map(w => w[0]));
  }, [puzzle]);

  useEffect(() => {
    const initialMap: Record<string, number | null> = {};
    uniqueLetters.forEach(l => (initialMap[l] = null));
    setLetterMap(initialMap);
    setSelectedLetter(uniqueLetters[0] || null);
    setElapsedSeconds(0);
    setIsWon(false);
    setHintsLeft(3);
  }, [puzzleIdx, uniqueLetters]);

  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  // Calculate arithmetic sum from current letterMap
  const wordValues = useMemo(() => {
    return puzzle.words.map(word => {
      let valStr = '';
      let isComplete = true;
      for (const ch of word) {
        const mapped = letterMap[ch];
        if (mapped === null || mapped === undefined) {
          isComplete = false;
          valStr += ch;
        } else {
          valStr += mapped.toString();
        }
      }
      return {
        word,
        valStr,
        num: isComplete ? parseInt(valStr, 10) : null,
        isComplete,
      };
    });
  }, [puzzle, letterMap]);

  // Check if math equation holds
  const isEquationValid = useMemo(() => {
    const operands = wordValues.slice(0, wordValues.length - 1);
    const result = wordValues[wordValues.length - 1];

    if (operands.some(op => op.num === null) || result.num === null) return false;

    // Check no leading letter is 0
    for (const lead of leadingLetters) {
      if (letterMap[lead] === 0) return false;
    }

    const operandsSum = operands.reduce((acc, curr) => acc + (curr.num || 0), 0);
    return operandsSum === result.num;
  }, [wordValues, leadingLetters, letterMap]);

  // Handle digit assignment
  const assignDigit = (digit: number) => {
    if (!selectedLetter) return;
    soundFx.playClick();

    // Check if leading letter is assigned 0
    if (digit === 0 && leadingLetters.has(selectedLetter)) {
      soundFx.playError();
      alert(`La lettera '${selectedLetter}' è la prima cifra di una parola e non può essere zero.`);
      return;
    }

    setLetterMap(prev => {
      const next = { ...prev };
      // If another letter already has this digit, free it
      Object.keys(next).forEach(k => {
        if (next[k] === digit && k !== selectedLetter) {
          next[k] = null;
        }
      });
      next[selectedLetter] = digit;
      return next;
    });

    // Auto-advance to next unassigned letter
    const unassigned = uniqueLetters.filter(l => l !== selectedLetter && letterMap[l] === null);
    if (unassigned.length > 0) {
      setSelectedLetter(unassigned[0]);
    }
  };

  const clearLetter = (letter: string) => {
    soundFx.playToggle();
    setLetterMap(prev => ({ ...prev, [letter]: null }));
  };

  const applyHint = () => {
    if (hintsLeft <= 0) return;
    soundFx.playSparkle();
    setHintsLeft(h => h - 1);

    // Find letter not yet correctly matched
    const unmatched = uniqueLetters.filter(l => letterMap[l] !== puzzle.solution[l]);
    if (unmatched.length > 0) {
      const target = unmatched[0];
      const correctVal = puzzle.solution[target];
      setLetterMap(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (next[k] === correctVal) next[k] = null;
        });
        next[target] = correctVal;
        return next;
      });
      setSelectedLetter(target);
    }
  };

  // Verify full correctness
  const handleVerify = () => {
    if (isEquationValid) {
      soundFx.playSuccess();
      setIsWon(true);
      if (puzzleIdx === PUZZLES.length - 1) {
        onComplete(3000, 100, 'logic');
      }
    } else {
      soundFx.playError();
      alert('L\'equazione matematica non è ancora verificata. Controlla i riporti e l\'uguaglianza numerica!');
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const r = secs % 60;
    return `${mins}:${r < 10 ? '0' : ''}${r}`;
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-6 bg-[#FAF7F2] text-[#2C3E50] overflow-y-auto rounded-3xl border border-[#E8E2D9] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F2ECE4] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-[#5C6B73]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold font-serif text-[#1F2937] flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#1E4332]" /> Criptoaritmetica Neurale
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7F3847] text-white flex items-center gap-1">
                <Flame className="w-3 h-3" /> {puzzle.difficulty}
              </span>
            </div>
            <p className="text-xs text-[#7F8C8D]">
              Ogni lettera corrisponde a una cifra unica (0-9). Nessuna parola inizia per zero.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-[#7F8C8D]">Tempo</span>
            <div className="text-sm font-mono font-bold text-[#1E4332]">{formatTime(elapsedSeconds)}</div>
          </div>
          <button
            onClick={applyHint}
            disabled={hintsLeft <= 0}
            className="px-3 py-1.5 rounded-xl bg-[#FBF2E3] border border-[#E8DCB8] text-[#8C5D19] text-xs font-medium flex items-center gap-1.5 disabled:opacity-40 shadow-sm"
          >
            <Lightbulb className="w-4 h-4" /> Hint ({hintsLeft})
          </button>
          <button
            onClick={() => {
              const resetMap: Record<string, number | null> = {};
              uniqueLetters.forEach(l => (resetMap[l] = null));
              setLetterMap(resetMap);
            }}
            className="p-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F2ECE4] text-[#5C6B73] transition-colors shadow-sm"
            title="Azzera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Puzzle Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl mb-4 border border-[#E8E2D9] shadow-sm">
        {PUZZLES.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setPuzzleIdx(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              puzzleIdx === idx
                ? 'bg-[#1E4332] text-white shadow-sm'
                : 'bg-[#FAF8F5] text-[#5C6B73] hover:bg-[#F2ECE4]'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Main Board */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-4">
        {/* Equation Display Canvas (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-[#E8E2D9] shadow-sm flex flex-col items-center justify-center">
          <div className="font-mono text-right space-y-2 select-none">
            {puzzle.words.map((word, wIdx) => {
              const isResult = wIdx === puzzle.words.length - 1;
              const isSecond = wIdx === 1;

              return (
                <div key={wIdx} className="flex items-center justify-end gap-3 text-2xl md:text-3xl font-bold">
                  {isSecond && <span className="text-xl text-[#7F8C8D] mr-2">+</span>}
                  <div
                    className={`flex items-center gap-1.5 pb-1 ${
                      isResult ? 'border-t-2 border-[#1F2937] pt-2' : ''
                    }`}
                  >
                    {word.split('').map((char, cIdx) => {
                      const val = letterMap[char];
                      const isSelected = selectedLetter === char;
                      return (
                        <div
                          key={cIdx}
                          onClick={() => setSelectedLetter(char)}
                          className={`w-10 h-12 md:w-12 md:h-14 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#1E4332] bg-[#E5F2EC] ring-4 ring-[#1E4332]/20'
                              : val !== null
                              ? 'border-[#CBD5E1] bg-[#FAF8F5]'
                              : 'border-dashed border-[#CBD5E1] bg-white hover:border-[#1E4332]'
                          }`}
                        >
                          <span className="text-base md:text-lg font-bold text-[#1F2937]">
                            {val !== null ? val : char}
                          </span>
                          <span className="text-[9px] font-semibold text-[#7F8C8D]">
                            {char}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arithmetic Verification Preview */}
          <div className="mt-6 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs font-mono text-center w-full max-w-sm">
            <span className="text-[#7F8C8D] block mb-1">Calcolo in Tempo Reale:</span>
            <div className="text-sm font-bold text-[#1F2937]">
              {wordValues.slice(0, -1).map(w => w.valStr).join(' + ')} = {wordValues[wordValues.length - 1].valStr}
            </div>
            {isEquationValid && (
              <span className="inline-flex items-center gap-1 text-[#1E4332] font-bold mt-1">
                <Check className="w-3.5 h-3.5" /> Equazione Matematica Perfetta!
              </span>
            )}
          </div>
        </div>

        {/* Digit Keypad & Letter Mapping (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-5 border border-[#E8E2D9] shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#1F2937] mb-2 flex items-center justify-between">
              <span>Mappatura Lettera Attiva:</span>
              <span className="text-base font-mono font-bold text-[#1E4332]">
                {selectedLetter ? `Lettera '${selectedLetter}'` : 'Nessuna'}
              </span>
            </h2>
            <p className="text-xs text-[#5C6B73] mb-4">
              Seleziona una lettera, poi clicca sulla cifra (0-9) da assegnare.
            </p>

            {/* Digit Keyboard (0-9) */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => {
                const assignedLetter = Object.keys(letterMap).find(k => letterMap[k] === d);
                return (
                  <button
                    key={d}
                    onClick={() => assignDigit(d)}
                    className={`h-12 rounded-xl border flex flex-col items-center justify-center font-mono font-bold text-base transition-all ${
                      assignedLetter
                        ? 'bg-[#E5F2EC] border-[#1E4332] text-[#1E4332]'
                        : 'bg-[#FAF8F5] border-[#CBD5E1] text-[#1F2937] hover:border-[#1E4332]'
                    }`}
                  >
                    <span>{d}</span>
                    <span className="text-[9px] font-normal text-[#5C6B73]">
                      {assignedLetter || '-'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Unique Letters Summary Pills */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#7F8C8D] uppercase tracking-wider">
                Lettere del Puzzle:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {uniqueLetters.map(l => (
                  <button
                    key={l}
                    onClick={() => setSelectedLetter(l)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                      selectedLetter === l
                        ? 'bg-[#1E4332] text-white border-[#1E4332]'
                        : letterMap[l] !== null
                        ? 'bg-[#FAF8F5] text-[#1F2937] border-[#CBD5E1]'
                        : 'bg-white text-[#94A3B8] border-dashed border-[#CBD5E1]'
                    }`}
                  >
                    {l} = {letterMap[l] !== null ? letterMap[l] : '?'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleVerify}
            className="w-full mt-4 py-3 rounded-2xl bg-[#1E4332] text-white font-bold text-xs hover:bg-[#163225] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Verifica Equazione
          </button>
        </div>
      </div>

      {/* Win Modal */}
      {isWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl bg-[#E5F2EC] border-2 border-[#1E4332] text-[#1E4332] flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#1E4332]" />
            <div>
              <h3 className="text-base font-bold">Criptoaritmo Risolto con Precisione!</h3>
              <p className="text-xs opacity-90">
                Tutte le cifre mappate con perfetta coerenza aritmetica in {formatTime(elapsedSeconds)}.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (puzzleIdx < PUZZLES.length - 1) {
                setPuzzleIdx(p => p + 1);
              } else {
                onBack();
              }
            }}
            className="px-5 py-2 rounded-xl bg-[#1E4332] text-white font-bold text-xs hover:bg-[#163225] transition-all shadow-md"
          >
            {puzzleIdx < PUZZLES.length - 1 ? 'Prossimo Criptoaritmo' : 'Torna all\'Hub'}
          </button>
        </motion.div>
      )}
    </div>
  );
};
