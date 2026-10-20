import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, Sparkles, HelpCircle, Check, Lightbulb } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface TrickyPuzzle {
  id: string;
  title: string;
  scenario: string;
  question: string;
  options: { text: string; isCorrect: boolean; feedback: string }[];
  lateralInsight: string;
}

const TRICKY_PUZZLES: TrickyPuzzle[] = [
  {
    id: 't1',
    title: 'Il Dilemma dei Due Barbieri di Atene',
    scenario: 'Arrivi in una remota cittadina greca dove ci sono solo due barbieri. Il primo ha un negozio impeccabile, pulitissimo e un taglio di capelli perfetto. Il secondo ha un negozio disordinato, polveroso e un taglio di capelli visibilmente asimmetrico e trasandato.',
    question: 'Da quale dei due barbieri ti conviene andare a farti tagliare i capelli?',
    options: [
      {
        text: 'Dal primo barbiere (pulito e perfetto)',
        isCorrect: false,
        feedback: 'Apparenza ingannevole: se in città ci sono solo 2 barbieri, chi ha tagliato i capelli al primo barbiere? Il secondo!'
      },
      {
        text: 'Dal secondo barbiere (trasandato)',
        isCorrect: true,
        feedback: 'Esatto! Poiché ci sono solo due barbieri, ciascuno deve tagliare i capelli all\'altro. Il secondo barbiere è l\'artefice del taglio perfetto del primo!'
      },
      {
        text: 'A nessuno dei due, tagliateli da solo',
        isCorrect: false,
        feedback: 'Soluzione evasiva che non risolve il dilemma logico.'
      }
    ],
    lateralInsight: 'Pensiero di Secondo Ordine & Causalità Circolare: Guarda oltre l\'attributo visivo superficiale e rintraccia chi ha prodotto quel risultato.'
  },
  {
    id: 't2',
    title: 'Le Tre Candele e la Stanza Buia',
    scenario: 'Entri in una stanza completamente buia e gelata. In tasca hai soltanto un fiammifero. Nella stanza ci sono: una candela di cera d\'api, una stufa a legna spenta e una lampada a cherosene.',
    question: 'Cosa devi accendere per prima cosa per sopravvivere alla notte?',
    options: [
      {
        text: 'La candela di cera per fare luce',
        isCorrect: false,
        feedback: 'Non puoi accendere la candela senza aver prima acceso qualcos\'altro!'
      },
      {
        text: 'La stufa a legna per riscaldarti',
        isCorrect: false,
        feedback: 'Anche la stufa richiede una fonte d\'innesco iniziale.'
      },
      {
        text: 'Il fiammifero',
        isCorrect: true,
        feedback: 'Brillante! Prima di poter accendere qualsiasi candela, lampada o stufa, devi accendere il fiammifero stesso.'
      }
    ],
    lateralInsight: 'Focalizzazione sui Prerequisiti Nascosti: Spesso ignoriamo lo strumento primario che abbiamo in mano perché siamo ossessionati dagli oggetti dell\'ambiente.'
  },
  {
    id: 't3',
    title: 'Il Ponte delle Tre Scatole Chiuse',
    scenario: 'Hai 3 scatole etichettate: "MELE", "ARANCE", "MELE E ARANCE". Ti viene detto che TUTTE le etichette sono sbagliate. Puoi estrarre un solo frutto a occhi chiusi da una sola scatola.',
    question: 'Da quale scatola devi estrarre il frutto per etichettarle tutte correttamente con certezza assoluta?',
    options: [
      {
        text: 'Dalla scatola etichettata "MELE E ARANCE"',
        isCorrect: true,
        feedback: 'Geniale! Poiché l\'etichetta è sicuramente sbagliata, la scatola contiene solo un tipo di frutto (es. Mele). Di conseguenza, le altre due si deducono a cascata!'
      },
      {
        text: 'Dalla scatola etichettata "MELE"',
        isCorrect: false,
        feedback: 'Se estrai un\'arancia, la scatola potrebbe essere sia "ARANCE" sia "MELE E ARANCE", lasciando ambiguità.'
      },
      {
        text: 'Dalla scatola etichettata "ARANCE"',
        isCorrect: false,
        feedback: 'Stesso problema: estraendo una mela rimangono due possibilità aperte per le altre scatole.'
      }
    ],
    lateralInsight: 'Sfruttare la Garanzia dell\'Errore (Inversione): Quando sai per certo che una condizione è falsa al 100%, quella scatola contiene la massima quantità di informazione risolutiva.'
  }
];

export const TrickyPuzzlesGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const puzzle = TRICKY_PUZZLES[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOptIdx(idx);
    setIsAnswered(true);

    const isCorrect = puzzle.options[idx].isCorrect;
    if (isCorrect) {
      soundFx.playSuccess();
      setScore(s => s + 300);
    } else {
      soundFx.playError();
    }
  };

  const nextPuzzle = () => {
    soundFx.playClick();
    if (currentIdx < TRICKY_PUZZLES.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOptIdx(null);
      setIsAnswered(false);
    } else {
      soundFx.playLevelUp();
      setIsGameOver(true);
      onComplete({
        gameId: 'tricky-puzzles',
        gameTitle: 'Enigmi Laterali & Tricky Puzzles',
        category: 'logic',
        score: Math.min(1000, score + 100),
        accuracy: 100,
        averageReactionTimeMs: 3500,
        difficultyLevel: 3,
      });
    }
  };

  return (
    <div id="tricky-puzzles-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Logica Laterale
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-3 py-1 rounded-full border border-[#CBDDD2]">
            {score} pt
          </span>
          <span className="text-xs font-mono font-bold text-[#557163]">
            {currentIdx + 1}/{TRICKY_PUZZLES.length}
          </span>
        </div>
      </div>

      {/* Puzzle Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#CBDDD2] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2E7652]">
          <Sparkles className="w-4 h-4 text-[#2E7652]" /> {puzzle.title}
        </div>
        <p className="text-xs sm:text-sm text-[#122219] leading-relaxed bg-[#F4F9F6] p-3.5 rounded-2xl border border-[#CBDDD2]">
          {puzzle.scenario}
        </p>
        <h4 className="text-sm font-extrabold text-[#122219] pt-1">
          {puzzle.question}
        </h4>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {puzzle.options.map((opt, idx) => {
          let optStyle = 'bg-white border-[#CBDDD2] text-[#122219] hover:bg-[#E5F2EC] shadow-2xs';
          if (isAnswered) {
            if (opt.isCorrect) {
              optStyle = 'bg-[#2E7652] text-white border-[#22573C] shadow-md font-bold';
            } else if (idx === selectedOptIdx) {
              optStyle = 'bg-[#E63946] text-white border-[#9E1A25] opacity-80';
            } else {
              optStyle = 'bg-[#F2F7F4] text-[#88A89A] opacity-50 border-[#CBDDD2]';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-left transition-all duration-150 flex items-start justify-between gap-2 cursor-pointer ${optStyle}`}
            >
              <span>{opt.text}</span>
              {isAnswered && opt.isCorrect && <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Insight & Next */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-3xl bg-[#EAF3EE] border border-[#B2D4BD] space-y-3"
        >
          <div className="text-xs text-[#1E4332] leading-relaxed">
            <strong className="block mb-1 text-[#122219] flex items-center gap-1 font-bold">
              <Lightbulb className="w-3.5 h-3.5 text-[#D4A325]" /> Modello di Pensiero Laterale:
            </strong>
            <p className="mb-1">{puzzle.options[selectedOptIdx!].feedback}</p>
            <p className="text-[11px] text-[#557163] font-medium mt-1">★ {puzzle.lateralInsight}</p>
          </div>
          <button
            onClick={nextPuzzle}
            className="w-full py-3 rounded-2xl bg-[#1E4332] text-white text-xs font-bold shadow-xs hover:bg-[#2A5741] transition cursor-pointer"
          >
            {currentIdx < TRICKY_PUZZLES.length - 1 ? 'Prossimo Enigma Laterale' : 'Concludi Sessione'}
          </button>
        </motion.div>
      )}

      {/* Final Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
          >
            <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
            <h3 className="text-lg font-bold">Flessibilità Cognitiva Testata!</h3>
            <p className="text-xs text-[#BED8CA]">Punteggio: <strong className="text-[#52D195]">{score} pt</strong></p>
            <button
              onClick={onExit}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Torna ai Reparti
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
