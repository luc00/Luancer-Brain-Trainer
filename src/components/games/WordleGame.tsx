import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, CheckCircle2, Delete, Sparkles, Globe, HelpCircle } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

const ITALIAN_WORDS = [
  'FORZA', 'MENTE', 'LUOGO', 'TEMPO', 'SENSO', 'VALOR', 'ANIMA', 'PENSO', 'GUIDA',
  'CUORE', 'PASSO', 'RAGIO', 'NOTTE', 'MONDO', 'FUOCO', 'CORPO', 'PIANO', 'SEGNO',
  'SPAZI', 'VIVERE', 'FUTUR', 'LOGIC', 'FOCUS', 'VERITA'
];

const ENGLISH_WORDS = [
  'BRAIN', 'FOCUS', 'POWER', 'LIGHT', 'GRACE', 'STORM', 'HABIT', 'DREAM', 'SMART',
  'THINK', 'LOGIC', 'SKILL', 'SOLVE', 'TRAIN', 'CLEAR', 'PEACE', 'FORCE', 'VALUE'
];

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['INVIO', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
];

export const WordleGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [lang, setLang] = useState<'it' | 'en'>('it');
  const [targetWord, setTargetWord] = useState<string>('MENTE');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [shakeRow, setShakeRow] = useState<boolean>(false);

  const startNewGame = useCallback((language: 'it' | 'en') => {
    const list = language === 'it' ? ITALIAN_WORDS : ENGLISH_WORDS;
    const randomWord = list[Math.floor(Math.random() * list.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setIsWon(false);
    setIsGameOver(false);
    setShakeRow(false);
  }, []);

  useEffect(() => {
    startNewGame(lang);
  }, [lang, startNewGame]);

  const wordLength = targetWord.length;

  const handleKeyPress = useCallback((key: string) => {
    if (isGameOver || isWon) return;

    if (key === 'DEL' || key === 'Backspace') {
      soundFx.playClick();
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (key === 'INVIO' || key === 'Enter') {
      if (currentGuess.length !== wordLength) {
        soundFx.playError();
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 500);
        return;
      }

      soundFx.playClick();
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);

      if (currentGuess === targetWord) {
        soundFx.playLevelUp();
        setIsWon(true);
        setIsGameOver(true);
        onComplete({
          gameId: 'wordle-mind',
          gameTitle: 'Wordle Linguistico',
          category: 'language',
          score: Math.max(300, 1000 - (newGuesses.length - 1) * 120),
          accuracy: 100,
          averageReactionTimeMs: 12000,
          difficultyLevel: 2,
        });
      } else if (newGuesses.length >= 6) {
        soundFx.playError();
        setIsGameOver(true);
      }

      setCurrentGuess('');
      return;
    }

    if (/^[A-Z]$/i.test(key) && currentGuess.length < wordLength) {
      soundFx.playClick();
      setCurrentGuess(prev => prev + key.toUpperCase());
    }
  }, [isGameOver, isWon, currentGuess, wordLength, targetWord, guesses, onComplete]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  // Get letter status for coloring (green, yellow, gray)
  const getLetterStatus = (letter: string, index: number, word: string) => {
    if (targetWord[index] === letter) return 'correct';
    if (targetWord.includes(letter)) return 'present';
    return 'absent';
  };

  // Keyboard letter states
  const getKeyStatus = (key: string) => {
    let status = 'default';
    guesses.forEach(g => {
      for (let i = 0; i < g.length; i++) {
        if (g[i] === key) {
          if (targetWord[i] === key) status = 'correct';
          else if (targetWord.includes(key) && status !== 'correct') status = 'present';
          else if (status === 'default') status = 'absent';
        }
      }
    });
    return status;
  };

  return (
    <div id="wordle-game-view" className="space-y-4 max-w-md mx-auto pb-10">
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
          <button
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            className="flex items-center gap-1 text-xs font-bold text-[#1E4332] bg-[#E5F2EC] px-2.5 py-1 rounded-full border border-[#CBDDD2] cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" /> {lang === 'it' ? 'Italiano' : 'English'}
          </button>
          <button
            onClick={() => startNewGame(lang)}
            className="p-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Wordle 6-Row Grid */}
      <div className="flex flex-col items-center gap-2 py-2">
        {Array(6).fill(0).map((_, rowIdx) => {
          const isCurrentRow = rowIdx === guesses.length;
          const guess = guesses[rowIdx] || (isCurrentRow ? currentGuess : '');

          return (
            <div
              key={rowIdx}
              className={`flex gap-1.5 ${isCurrentRow && shakeRow ? 'animate-shake' : ''}`}
            >
              {Array(wordLength).fill(0).map((_, colIdx) => {
                const letter = guess[colIdx] || '';
                const isGuessedRow = rowIdx < guesses.length;
                let bgStyle = 'bg-white border-2 border-[#CBDDD2] text-[#122219]';

                if (isGuessedRow && letter) {
                  const status = getLetterStatus(letter, colIdx, guess);
                  if (status === 'correct') bgStyle = 'bg-[#2E7652] text-white border-2 border-[#22573C]';
                  else if (status === 'present') bgStyle = 'bg-[#D4A325] text-white border-2 border-[#AA821C]';
                  else bgStyle = 'bg-[#768C80] text-white border-2 border-[#5E7066]';
                } else if (letter) {
                  bgStyle = 'bg-white border-2 border-[#1E4332] text-[#122219] scale-105';
                }

                return (
                  <div
                    key={colIdx}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl uppercase transition-all duration-200 ${bgStyle}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* On-screen Keyboard */}
      <div className="space-y-1.5 pt-2">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1">
            {row.map(key => {
              const status = getKeyStatus(key);
              let keyBg = 'bg-white border border-[#CBDDD2] text-[#122219]';
              if (status === 'correct') keyBg = 'bg-[#2E7652] text-white border-[#22573C]';
              else if (status === 'present') keyBg = 'bg-[#D4A325] text-white border-[#AA821C]';
              else if (status === 'absent') keyBg = 'bg-[#D0DED6] text-[#718A7D] border-[#CBDDD2] opacity-60';

              const isWide = key === 'INVIO' || key === 'DEL';

              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`h-11 rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs ${keyBg} ${
                    isWide ? 'px-3 font-extrabold text-[11px]' : 'w-8 sm:w-9'
                  }`}
                >
                  {key === 'DEL' ? <Delete className="w-4 h-4" /> : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl mt-4"
          >
            {isWon ? (
              <>
                <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
                <h3 className="text-lg font-bold">Parola Indovinata!</h3>
                <p className="text-xs text-[#BED8CA]">
                  La parola era <strong>{targetWord}</strong>. Trovata in {guesses.length} tentativi.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold">Tentativi Esauriti</h3>
                <p className="text-xs text-[#BED8CA]">
                  La parola corretta era: <strong className="text-[#52D195] text-sm tracking-wider">{targetWord}</strong>
                </p>
              </>
            )}
            <button
              onClick={() => startNewGame(lang)}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Gioca un&apos;altra Parola
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
