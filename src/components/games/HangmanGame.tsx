import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, Heart, Sparkles, BookOpen, Lightbulb } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface HangmanWord {
  word: string;
  category: 'Filosofia Stoica' | 'Neuroscienze' | 'Vocabolario Raro' | 'Scienza';
  hint: string;
  definition: string;
}

const WORDS_DATABASE: HangmanWord[] = [
  {
    word: 'ATARASSIA',
    category: 'Filosofia Stoica',
    hint: 'Stato di perfetta quiete e serenità d\'animo imperturbabile.',
    definition: 'Termine filosofico stoico ed epicureo che denota la libertà da ogni turbamento emotivo ed eccitazione ansiosa.'
  },
  {
    word: 'NEUROPLASTICITA',
    category: 'Neuroscienze',
    hint: 'La capacità del cervello di rimodellarsi strutturalmente con l\'esperienza.',
    definition: 'Proprietà intrinseca del sistema nervoso di adattare connessioni e mappe corticali in risposta all\'apprendimento e alle abitudini.'
  },
  {
    word: 'PROSOCHE',
    category: 'Filosofia Stoica',
    hint: 'L\'attenzione continua e vigile su se stessi e sul momento presente.',
    definition: 'La disciplina stoica della consapevolezza continua dei propri giudizi morali e delle proprie azioni (presenza mentale).'
  },
  {
    word: 'ANTIFRAGILITA',
    category: 'Scienza',
    hint: 'La caratteristica dei sistemi che prosperano e migliorano sotto stress e shock.',
    definition: 'Concetto sviluppato da Taleb per descrivere ciò che va oltre la semplice resilienza: diventare più forti a seguito delle avversità.'
  },
  {
    word: 'SINAPSI',
    category: 'Neuroscienze',
    hint: 'Giunzione funzionale tra due neuroni per la trasmissione del segnale.',
    definition: 'Struttura specializzata dove avviene il passaggio di neurotrasmettitori tra la terminazione assonica e la cellula bersaglio.'
  },
  {
    word: 'DISCERNIMENTO',
    category: 'Vocabolario Raro',
    hint: 'Capacità di valutare con saggezza e chiarezza distinguendo il bene dal male.',
    definition: 'Facoltà dell\'intelletto di giudicare rettamente, cogliendo differenze sottili e orientando decisioni virtuose.'
  },
  {
    word: 'EUDEMONIA',
    category: 'Filosofia Stoica',
    hint: 'La fioritura umana e la felicità raggiunta attraverso la virtù.',
    definition: 'Il sommo bene della filosofia greca antica: una vita pienamente realizzata e conforme a ragione e rettitudine morale.'
  }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_MISTAKES = 6;

export const HangmanGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [currentWordObj, setCurrentWordObj] = useState<HangmanWord>(WORDS_DATABASE[0]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);

  const startNewWord = useCallback((item?: HangmanWord) => {
    const selected = item || WORDS_DATABASE[Math.floor(Math.random() * WORDS_DATABASE.length)];
    setCurrentWordObj(selected);
    setGuessedLetters([]);
    setMistakes(0);
    setShowHint(false);
    setIsGameOver(false);
    setIsWon(false);
  }, []);

  useEffect(() => {
    startNewWord();
  }, [startNewWord]);

  const targetWord = currentWordObj.word.toUpperCase();
  const wordLetters = targetWord.split('');

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || isGameOver) return;

    soundFx.playClick();
    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (wordLetters.includes(letter)) {
      // Check win
      const won = wordLetters.every(l => newGuessed.includes(l));
      if (won) {
        soundFx.playLevelUp();
        setIsWon(true);
        setIsGameOver(true);
        onComplete({
          gameId: 'hangman-philosophy',
          gameTitle: 'Impiccato Filosofico & Neurale',
          category: 'language',
          score: Math.max(300, 1000 - mistakes * 100),
          accuracy: 100 - mistakes * 10,
          averageReactionTimeMs: 8000,
          difficultyLevel: 2,
        });
      }
    } else {
      soundFx.playError();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= MAX_MISTAKES) {
        setIsGameOver(true);
      }
    }
  };

  return (
    <div id="hangman-game-view" className="space-y-4 max-w-md mx-auto pb-10">
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
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-3 py-1 rounded-full border border-[#CBDDD2]">
            <Heart className="w-3.5 h-3.5 fill-[#E63946] text-[#E63946]" /> Vite: {MAX_MISTAKES - mistakes} / {MAX_MISTAKES}
          </div>
          <button
            onClick={() => startNewWord()}
            className="p-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Badge & Hint */}
      <div className="p-4 rounded-3xl bg-white border border-[#CBDDD2] shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#2E7652] uppercase bg-[#E5F2EC] px-2.5 py-1 rounded-full">
            {currentWordObj.category}
          </span>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 text-xs font-bold text-[#8C5D19] bg-[#FBF2E3] border border-[#E8CE9E] px-2.5 py-1 rounded-full hover:bg-[#F6E6CA] transition cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" /> {showHint ? 'Nascondi Indizio' : 'Mostra Indizio'}
          </button>
        </div>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-[#557163] bg-[#F4F9F6] p-2.5 rounded-2xl border border-[#CBDDD2]"
          >
            <strong>Indizio:</strong> {currentWordObj.hint}
          </motion.div>
        )}

        {/* Word Blank Line Slots */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 pb-2">
          {wordLetters.map((char, idx) => {
            const revealed = guessedLetters.includes(char) || (isGameOver && !isWon);
            return (
              <div
                key={idx}
                className={`w-9 h-11 sm:w-11 sm:h-13 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl transition-all duration-200 ${
                  revealed
                    ? 'bg-[#1E4332] text-white shadow-xs'
                    : 'bg-[#F2F7F4] border-2 border-dashed border-[#CBDDD2] text-transparent'
                }`}
              >
                {revealed ? char : '_'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Letter Pad */}
      <div className="bg-white border border-[#CBDDD2] rounded-3xl p-3 shadow-xs">
        <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
          {ALPHABET.map(letter => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = wordLetters.includes(letter);

            let btnStyle = 'bg-[#FAFDFB] text-[#122219] border border-[#CBDDD2] hover:bg-[#E5F2EC] hover:border-[#1E4332] shadow-2xs';
            if (isGuessed) {
              btnStyle = isCorrect
                ? 'bg-[#2E7652] text-white border-[#22573C] opacity-80 pointer-events-none'
                : 'bg-[#EAEFEA] text-[#9FB5A9] border-[#CBDDD2] opacity-40 pointer-events-none';
            }

            return (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed || isGameOver}
                className={`h-10 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center transition active:scale-95 cursor-pointer ${btnStyle}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Over / Victory Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] space-y-3 shadow-xl text-center"
          >
            <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
            <h3 className="text-lg font-bold">{isWon ? 'Parola Svelata!' : 'Vite Esaurite'}</h3>
            <p className="text-xs text-[#BED8CA]">
              La parola era: <strong className="text-[#52D195] text-sm tracking-wider">{targetWord}</strong>
            </p>
            <div className="text-left bg-[#1C412F] p-3 rounded-2xl border border-[#3E6C55] text-xs leading-relaxed text-[#D0EADB]">
              <span className="font-bold block mb-1 text-[#78EAB1] flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Definizione Culturale:
              </span>
              {currentWordObj.definition}
            </div>
            <button
              onClick={() => startNewWord()}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Prossima Parola
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
