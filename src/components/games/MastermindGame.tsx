import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, Check, Sparkles, HelpCircle, Lock } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

const PEGS_COLORS = [
  { id: 'red', bg: 'bg-[#E63946]', border: 'border-[#BA1826]' },
  { id: 'blue', bg: 'bg-[#2D6A8E]', border: 'border-[#1C4E6D]' },
  { id: 'green', bg: 'bg-[#2E7652]', border: 'border-[#1E553A]' },
  { id: 'yellow', bg: 'bg-[#D4A325]', border: 'border-[#AA821C]' },
  { id: 'purple', bg: 'bg-[#8F4882]', border: 'border-[#6D2E62]' },
  { id: 'orange', bg: 'bg-[#E76F51]', border: 'border-[#C84F33]' },
];

interface GuessRow {
  pegs: string[]; // array of 4 color ids
  blackPegs: number; // Exact color & exact position
  whitePegs: number; // Correct color, wrong position
}

export const MastermindGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [secretCode, setSecretCode] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<GuessRow[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const initGame = useCallback(() => {
    const code: string[] = [];
    for (let i = 0; i < 4; i++) {
      const randomColor = PEGS_COLORS[Math.floor(Math.random() * PEGS_COLORS.length)].id;
      code.push(randomColor);
    }
    setSecretCode(code);
    setGuesses([]);
    setCurrentGuess([]);
    setIsWon(false);
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const selectColor = (colorId: string) => {
    if (currentGuess.length < 4 && !isGameOver) {
      soundFx.playClick();
      setCurrentGuess([...currentGuess, colorId]);
    }
  };

  const removeColor = (idx: number) => {
    if (isGameOver) return;
    soundFx.playClick();
    setCurrentGuess(currentGuess.filter((_, i) => i !== idx));
  };

  const submitGuess = () => {
    if (currentGuess.length !== 4 || isGameOver) return;

    soundFx.playClick();

    // Calculate black & white feedback pegs
    let blackPegs = 0;
    let whitePegs = 0;

    const secretCopy = [...secretCode];
    const guessCopy = [...currentGuess];

    // 1st pass: exact matches (black)
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        blackPegs++;
        secretCopy[i] = 'MATCHED';
        guessCopy[i] = 'CHECKED';
      }
    }

    // 2nd pass: color matches in wrong positions (white)
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== 'CHECKED') {
        const foundIdx = secretCopy.findIndex(c => c === guessCopy[i]);
        if (foundIdx !== -1) {
          whitePegs++;
          secretCopy[foundIdx] = 'MATCHED';
        }
      }
    }

    const newRow: GuessRow = {
      pegs: currentGuess,
      blackPegs,
      whitePegs,
    };

    const newGuesses = [...guesses, newRow];
    setGuesses(newGuesses);
    setCurrentGuess([]);

    if (blackPegs === 4) {
      soundFx.playLevelUp();
      setIsWon(true);
      setIsGameOver(true);
      onComplete({
        gameId: 'mastermind-code',
        gameTitle: 'Mastermind Decifra Codice',
        category: 'logic',
        score: Math.max(400, 1000 - (newGuesses.length - 1) * 75),
        accuracy: 100,
        averageReactionTimeMs: 4000,
        difficultyLevel: 3,
      });
    } else if (newGuesses.length >= 8) {
      soundFx.playError();
      setIsGameOver(true);
    }
  };

  return (
    <div id="mastermind-game-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Logica & Deduzione
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-3 py-1 rounded-full border border-[#CBDDD2]">
            Tentativo: {guesses.length + 1} / 8
          </span>
          <button
            onClick={initGame}
            className="p-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secret Code Concealed / Revealed */}
      <div className="bg-[#122219] p-3.5 rounded-3xl border border-[#2B4B39] shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-[#52D195]">
          <Lock className="w-4 h-4" /> Codice Segreto:
        </div>
        <div className="flex gap-2">
          {secretCode.map((colId, i) => {
            const col = PEGS_COLORS.find(c => c.id === colId);
            return (
              <div
                key={i}
                className={`w-7 h-7 rounded-full border-2 ${
                  isGameOver ? `${col?.bg} ${col?.border}` : 'bg-[#1F3D2E] border-[#376950] flex items-center justify-center text-[10px] text-white/40 font-mono'
                }`}
              >
                {!isGameOver && '?'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Guesses History Board */}
      <div className="p-3.5 rounded-3xl bg-white border border-[#CBDDD2] shadow-xs space-y-2 min-h-[200px]">
        {guesses.length === 0 ? (
          <p className="text-center text-xs text-[#557163] py-8">
            Seleziona 4 colori sotto e premi &ldquo;Verifica Codice&rdquo;
          </p>
        ) : (
          guesses.map((row, rIdx) => (
            <div
              key={rIdx}
              className="flex items-center justify-between p-2 rounded-2xl bg-[#F4F9F6] border border-[#CBDDD2]"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#557163] w-4">{rIdx + 1}</span>
                <div className="flex gap-1.5">
                  {row.pegs.map((peg, pIdx) => {
                    const col = PEGS_COLORS.find(c => c.id === peg);
                    return (
                      <div
                        key={pIdx}
                        className={`w-6 h-6 rounded-full border-2 ${col?.bg} ${col?.border}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Feedback Clues: Black = exact pos, White = correct color */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-[#CBDDD2]">
                <div className="flex gap-1">
                  {Array(row.blackPegs).fill(0).map((_, i) => (
                    <div key={`b-${i}`} className="w-2.5 h-2.5 rounded-full bg-black" title="Colore e posizione esatti" />
                  ))}
                  {Array(row.whitePegs).fill(0).map((_, i) => (
                    <div key={`w-${i}`} className="w-2.5 h-2.5 rounded-full bg-white border border-gray-400" title="Colore presente ma posizione errata" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-[#557163]">
                  {row.blackPegs}● {row.whitePegs}○
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Current Pending Guess Slots */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#CBDDD2] shadow-2xs">
        <div className="flex gap-2">
          {[0, 1, 2, 3].map(slotIdx => {
            const colId = currentGuess[slotIdx];
            const col = PEGS_COLORS.find(c => c.id === colId);
            return (
              <button
                key={slotIdx}
                onClick={() => removeColor(slotIdx)}
                className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer ${
                  col
                    ? `${col.bg} ${col.border} shadow-sm active:scale-90`
                    : 'bg-[#F2F7F4] border-dashed border-[#CBDDD2]'
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={submitGuess}
          disabled={currentGuess.length !== 4 || isGameOver}
          className="px-4 py-2 rounded-xl bg-[#1E4332] text-white text-xs font-bold hover:bg-[#2A5741] disabled:opacity-40 transition shadow-xs cursor-pointer"
        >
          Verifica Codice
        </button>
      </div>

      {/* Color Palette Buttons */}
      <div className="flex justify-center gap-2.5 pt-1">
        {PEGS_COLORS.map(c => (
          <button
            key={c.id}
            onClick={() => selectColor(c.id)}
            disabled={currentGuess.length >= 4 || isGameOver}
            className={`w-11 h-11 rounded-full border-2 ${c.bg} ${c.border} active:scale-90 transition shadow-xs cursor-pointer`}
          />
        ))}
      </div>

      {/* Victory / Defeat Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
          >
            <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
            <h3 className="text-lg font-bold">{isWon ? 'Codice Decifrato!' : 'Tentativi Esauriti'}</h3>
            <p className="text-xs text-[#BED8CA]">
              {isWon
                ? `Hai scoperto la combinazione in ${guesses.length} tentativi.`
                : 'La combinazione segreta è stata rivelata in alto.'}
            </p>
            <button
              onClick={initGame}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Nuova Partita
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
