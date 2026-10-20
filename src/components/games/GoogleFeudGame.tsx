import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, Search, X, Check, Sparkles, HelpCircle } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface QuestionPrompt {
  id: string;
  category: 'Cultura' | 'Psicologia' | 'Scienza' | 'Domande';
  query: string; // e.g. "Perché la mente..."
  answers: { text: string; points: number; revealed: boolean }[];
}

const FEUD_QUESTIONS: QuestionPrompt[] = [
  {
    id: 'f1',
    category: 'Psicologia',
    query: 'Perché procrastiniamo quando...',
    answers: [
      { text: 'dobbiamo studiare', points: 1000, revealed: false },
      { text: 'abbiamo paura di fallire', points: 900, revealed: false },
      { text: 'siamo stanchi', points: 800, revealed: false },
      { text: 'il compito è noioso', points: 700, revealed: false },
      { text: 'siamo ansiosi', points: 600, revealed: false },
      { text: 'siamo perfezionisti', points: 500, revealed: false },
      { text: 'non abbiamo motivazione', points: 400, revealed: false },
    ],
  },
  {
    id: 'f2',
    category: 'Cultura',
    query: 'Cosa fare se ti senti...',
    answers: [
      { text: 'solo', points: 1000, revealed: false },
      { text: 'triste', points: 900, revealed: false },
      { text: 'ansioso', points: 800, revealed: false },
      { text: 'perso nella vita', points: 700, revealed: false },
      { text: 'sopraffatto', points: 600, revealed: false },
      { text: 'bloccato', points: 500, revealed: false },
      { text: 'stanco mentalmente', points: 400, revealed: false },
    ],
  },
  {
    id: 'f3',
    category: 'Scienza',
    query: 'Come funziona il cervello quando...',
    answers: [
      { text: 'dormiamo', points: 1000, revealed: false },
      { text: 'sogniamo', points: 900, revealed: false },
      { text: 'siamo innamorati', points: 800, revealed: false },
      { text: 'meditiamo', points: 700, revealed: false },
      { text: 'siamo sotto stress', points: 600, revealed: false },
      { text: 'ascoltiamo musica', points: 500, revealed: false },
      { text: 'impariamo cose nuove', points: 400, revealed: false },
    ],
  },
  {
    id: 'f4',
    category: 'Domande',
    query: 'È normale sentirsi...',
    answers: [
      { text: 'insicuri', points: 1000, revealed: false },
      { text: 'in ritardo nella vita', points: 900, revealed: false },
      { text: 'confusi sul futuro', points: 800, revealed: false },
      { text: 'soli in mezzo alla gente', points: 700, revealed: false },
      { text: 'ansiosi senza motivo', points: 600, revealed: false },
      { text: 'diversi dagli altri', points: 500, revealed: false },
      { text: 'stanchi di tutto', points: 400, revealed: false },
    ],
  },
];

export const GoogleFeudGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [question, setQuestion] = useState<QuestionPrompt>(() => {
    return JSON.parse(JSON.stringify(FEUD_QUESTIONS[0]));
  });
  const [inputVal, setInputVal] = useState<string>('');
  const [strikes, setStrikes] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [isRoundOver, setIsRoundOver] = useState<boolean>(false);

  const loadQuestion = (idx: number) => {
    setCurrentIdx(idx);
    setQuestion(JSON.parse(JSON.stringify(FEUD_QUESTIONS[idx])));
    setInputVal('');
    setStrikes(0);
    setIsRoundOver(false);
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isRoundOver) return;

    const queryClean = inputVal.trim().toLowerCase();
    setInputVal('');

    let matchIdx = -1;
    question.answers.forEach((ans, idx) => {
      if (!ans.revealed) {
        const targetClean = ans.text.toLowerCase();
        if (targetClean.includes(queryClean) || queryClean.includes(targetClean)) {
          matchIdx = idx;
        }
      }
    });

    if (matchIdx !== -1) {
      soundFx.playSuccess();
      const newAnswers = [...question.answers];
      newAnswers[matchIdx].revealed = true;
      setQuestion({ ...question, answers: newAnswers });
      setTotalScore(s => s + newAnswers[matchIdx].points);

      if (newAnswers.every(a => a.revealed)) {
        soundFx.playLevelUp();
        setIsRoundOver(true);
      }
    } else {
      soundFx.playError();
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      if (newStrikes >= 3) {
        setIsRoundOver(true);
        // Reveal all
        setQuestion({
          ...question,
          answers: question.answers.map(a => ({ ...a, revealed: true })),
        });
      }
    }
  };

  return (
    <div id="google-feud-view" className="space-y-4 max-w-lg mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Linguaggio & Mente
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  s <= strikes
                    ? 'bg-[#E63946] text-white shadow-2xs'
                    : 'bg-[#F2F7F4] text-[#CBDDD2] border border-[#CBDDD2]'
                }`}
              >
                ✕
              </div>
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-3 py-1 rounded-full border border-[#CBDDD2]">
            {totalScore} pt
          </span>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {FEUD_QUESTIONS.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => {
              soundFx.playClick();
              loadQuestion(idx);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              currentIdx === idx
                ? 'bg-[#1E4332] text-white shadow-xs'
                : 'bg-white border border-[#CBDDD2] text-[#557163] hover:bg-[#F2F7F4]'
            }`}
          >
            {q.category}
          </button>
        ))}
      </div>

      {/* Search Box / Feud Query */}
      <div className="p-4 rounded-3xl bg-white border border-[#CBDDD2] shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-[#557163] text-xs font-semibold">
          <Search className="w-4 h-4 text-[#1E4332]" />
          <span>Indovina i completamenti di ricerca più frequenti su Google:</span>
        </div>

        <div className="text-base sm:text-lg font-extrabold text-[#122219] p-3 rounded-2xl bg-[#F4F9F6] border border-[#CBDDD2]">
          &ldquo;{question.query} <span className="text-[#3F805E] animate-pulse">...</span>&rdquo;
        </div>

        {/* Input guess form */}
        <form onSubmit={handleGuess} className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            disabled={isRoundOver}
            placeholder="Scrivi il completamento e premi Invio..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-[#CBDDD2] focus:border-[#1E4332] text-xs sm:text-sm text-[#122219] outline-none shadow-2xs"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isRoundOver}
            className="px-5 py-2.5 rounded-2xl bg-[#1E4332] hover:bg-[#2A5741] text-white text-xs font-bold transition disabled:opacity-40 shadow-xs cursor-pointer"
          >
            Invia
          </button>
        </form>
      </div>

      {/* Answers Board */}
      <div className="space-y-2">
        {question.answers.map((ans, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
              ans.revealed
                ? 'bg-white border-[#CBDDD2] shadow-2xs'
                : 'bg-[#F2F7F4] border-[#D4E4DB] text-[#718D80]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E5F2EC] text-[#1E4332] text-xs font-bold font-mono flex items-center justify-center">
                {idx + 1}
              </span>
              <span className={`text-xs sm:text-sm font-bold ${ans.revealed ? 'text-[#122219]' : 'text-transparent select-none bg-[#CBDDD2] rounded-md px-4'}`}>
                {ans.revealed ? ans.text : '••••••••••••••••'}
              </span>
            </div>

            <span className={`text-xs font-mono font-bold ${ans.revealed ? 'text-[#2E7652]' : 'text-[#8EAFA0]'}`}>
              {ans.revealed ? `${ans.points} pt` : '???'}
            </span>
          </div>
        ))}
      </div>

      {/* Next round action */}
      {isRoundOver && (
        <div className="text-center pt-2">
          <button
            onClick={() => loadQuestion((currentIdx + 1) % FEUD_QUESTIONS.length)}
            className="px-6 py-3 rounded-2xl bg-[#1E4332] text-white text-xs font-bold shadow-md hover:bg-[#2B5842] transition cursor-pointer"
          >
            Prossima Domanda ({currentIdx + 1}/{FEUD_QUESTIONS.length})
          </button>
        </div>
      )}
    </div>
  );
};
