import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult, AIPuzzle } from '../../types';
import { Sparkles, Play, RotateCcw, Award, CheckCircle2, XCircle, Loader2, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

const FALLBACK_PUZZLES: AIPuzzle[] = [
  {
    question: "Se tutti i neuroni 'Alpha' trasmettono a frequenza rapida, e nessun neurone 'Delta' è rapido, cosa possiamo dedurre logicamente?",
    options: [
      "Nessun neurone Alpha è un neurone Delta",
      "Tutti i neuroni Delta sono lenti solo di notte",
      "I neuroni Alpha e Delta sono identici",
      "Nessuna deduzione è possibile"
    ],
    correctAnswer: "Nessun neurone Alpha è un neurone Delta",
    explanation: "Per sillogismo categorico: poiché tutti gli Alpha hanno la proprietà P (rapidi) e nessun Delta ha la proprietà P, le due classi sono mutualmente esclusive.",
    category: "Deduzione Sillogistica",
    difficulty: 3
  },
  {
    question: "Trova la parola che completa l'analogia semantica:\nMEMORIA sta a SINAPSI come EDIFICIO sta a...",
    options: [
      "MATTONE",
      "STRADA",
      "FINESTRA",
      "ABITANTE"
    ],
    correctAnswer: "MATTONE",
    explanation: "La sinapsi è l'unità fondamentale costitutiva della rete di memoria, così come il mattone lo è per l'edificio.",
    category: "Fluidità Verbale & Analogica",
    difficulty: 2
  }
];

export const AIPuzzleGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [gameState, setGameState] = useState<'intro' | 'loading' | 'playing' | 'revealed' | 'finished'>('intro');
  const [currentPuzzle, setCurrentPuzzle] = useState<AIPuzzle | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [puzzleCount, setPuzzleCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);

  const fetchPuzzle = async (level = 3) => {
    setGameState('loading');
    setSelectedOption(null);
    try {
      const res = await fetch('/api/ai/generate-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'logic', level }),
      });
      const data = await res.json();
      if (data.puzzle && data.puzzle.question) {
        setCurrentPuzzle(data.puzzle);
      } else {
        setCurrentPuzzle(FALLBACK_PUZZLES[Math.floor(Math.random() * FALLBACK_PUZZLES.length)]);
      }
    } catch {
      setCurrentPuzzle(FALLBACK_PUZZLES[Math.floor(Math.random() * FALLBACK_PUZZLES.length)]);
    }
    setGameState('playing');
    setStartTime(performance.now());
  };

  const startSession = () => {
    soundFx.playClick();
    setPuzzleCount(1);
    setScore(0);
    setCorrectAnswers(0);
    fetchPuzzle(3);
  };

  const handleSelectOption = (opt: string) => {
    if (gameState !== 'playing' || !currentPuzzle) return;

    setSelectedOption(opt);
    setGameState('revealed');
    const isCorrect = opt.trim().toLowerCase() === currentPuzzle.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      soundFx.playSuccess();
      setCorrectAnswers((prev) => prev + 1);
      setScore((prev) => prev + 250);
    } else {
      soundFx.playError();
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (puzzleCount >= 3) {
      // Completed 3 AI puzzles
      finishGame();
    } else {
      setPuzzleCount((prev) => prev + 1);
      fetchPuzzle(puzzleCount + 2);
    }
  };

  const finishGame = () => {
    setGameState('finished');
    const accuracy = Math.round((correctAnswers / 3) * 100);
    const finalScore = score + (accuracy === 100 ? 150 : 0);

    if (accuracy >= 66) {
      soundFx.playSuccess();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      } catch {}
    }

    onComplete({
      gameId: 'ai-adaptive-puzzle',
      gameTitle: 'Enigma Logico AI Adattivo',
      category: 'language',
      score: finalScore,
      accuracy,
      averageReactionTimeMs: 1200,
      difficultyLevel: 4,
    });
  };

  return (
    <div id="ai-puzzle-container" className="w-full max-w-md mx-auto flex flex-col flex-1 pb-16">
      {gameState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-violet-500/30 rounded-2xl p-6 text-center shadow-xl backdrop-blur-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/40 flex items-center justify-center mx-auto mb-4 text-violet-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-display">Enigma Adattivo AI</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Risolvi 3 enigmi unici generati in tempo reale dall&apos;IA neurale per potenziare il ragionamento deduttivo, 
            la fluidità semantica e il pensiero laterale.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Indietro
            </button>
            <button
              onClick={startSession}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" /> Genera Enigma
            </button>
          </div>
        </motion.div>
      )}

      {gameState === 'loading' && (
        <div className="flex flex-col items-center justify-center flex-1 my-auto text-center p-8">
          <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4" />
          <p className="text-sm font-semibold text-white">Generazione neurale in corso...</p>
          <span className="text-xs text-slate-400 mt-1">L&apos;IA sta sintetizzando un dilemma su misura</span>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'revealed') && currentPuzzle && (
        <div className="flex flex-col flex-1 justify-between">
          {/* Header Stats */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 mb-4">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-300">{currentPuzzle.category}</span>
            </div>
            <div className="text-sm font-mono font-bold text-white">
              Enigma {puzzleCount} / 3
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-950 border border-violet-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md mb-4">
            <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed whitespace-pre-line">
              {currentPuzzle.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5 mb-4">
            {currentPuzzle.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt.trim().toLowerCase() === currentPuzzle.correctAnswer.trim().toLowerCase();
              
              let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-violet-500';
              if (gameState === 'revealed') {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                } else {
                  btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={gameState === 'revealed'}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {gameState === 'revealed' && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />}
                  {gameState === 'revealed' && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Explanation when revealed */}
          {gameState === 'revealed' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-4"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                <Lightbulb className="w-4 h-4" /> Spiegazione Neurale:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentPuzzle.explanation}
              </p>
            </motion.div>
          )}

          {gameState === 'revealed' && (
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm shadow-lg shadow-violet-500/20 transition active:scale-95 mt-auto"
            >
              {puzzleCount >= 3 ? 'Vedi Risultato Finale' : 'Prossimo Enigma ➔'}
            </button>
          )}
        </div>
      )}

      {gameState === 'finished' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/95 border border-violet-500/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md my-auto"
        >
          <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-400 flex items-center justify-center mx-auto mb-3 text-violet-400">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Enigmi Completati!</h3>
          <p className="text-xs text-slate-400 mb-6">Risposte corrette: {correctAnswers} su 3</p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
            <span className="text-xs text-slate-400 block mb-1">Punti Linguaggio & Logica</span>
            <span className="text-2xl font-bold text-violet-400">{score} pt</span>
          </div>

          <button
            onClick={onExit}
            className="w-full py-3.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm transition"
          >
            Continua
          </button>
        </motion.div>
      )}
    </div>
  );
};
