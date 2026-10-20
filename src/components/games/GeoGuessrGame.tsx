import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Trophy, Globe, MapPin, Sparkles, Check, HelpCircle } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface GeoQuestion {
  id: string;
  landmark: string;
  imageEmoji: string;
  clues: string[];
  options: string[];
  correctAnswer: string;
  country: string;
  funFact: string;
}

const GEO_QUESTIONS: GeoQuestion[] = [
  {
    id: 'g1',
    landmark: 'Partenone & Acropoli',
    imageEmoji: '🏛️ 🇬🇷',
    clues: [
      'Culla della democrazia e della filosofia occidentale.',
      'Sorge su una rupe sacra affacciata sul Mar Egeo.',
      'Costruito nel V secolo a.C. per la dea Atena.'
    ],
    options: ['Atene, Grecia', 'Roma, Italia', 'Alessandria, Egitto', 'Istanbul, Turchia'],
    correctAnswer: 'Atene, Grecia',
    country: 'Grecia',
    funFact: 'I templi dell\'Acropoli furono costruiti secondo calcoli geometrici e ottici per sembrare perfettamente diritti da lontano.'
  },
  {
    id: 'g2',
    landmark: 'Machu Picchu',
    imageEmoji: '🏔️ 🇵🇪',
    clues: [
      'Cittadella misteriosa incastonata nelle Ande a oltre 2.400 metri.',
      'Capolavoro di ingegneria a secco dell\'Impero Inca.',
      'Riscoperta a livello globale da Hiram Bingham nel 1911.'
    ],
    options: ['Cusco, Perù', 'La Paz, Bolivia', 'Quito, Ecuador', 'Santiago, Cile'],
    correctAnswer: 'Cusco, Perù',
    country: 'Perù',
    funFact: 'Le pietre di Machu Picchu sono incastrate così precisamente che non passa nemmeno una lama di coltello tra di esse.'
  },
  {
    id: 'g3',
    landmark: 'Taj Mahal',
    imageEmoji: '🕌 🇮🇳',
    clues: [
      'Monumento in marmo bianco candido sul fiume Yamuna.',
      'Costruito dall\'imperatore Moghul Shah Jahan per la sua amata sposa.',
      'Simbolo supremo di simmetria architettonica e amore eterno.'
    ],
    options: ['Agra, India', 'Nuova Delhi, India', 'Lahore, Pakistan', 'Jaipur, India'],
    correctAnswer: 'Agra, India',
    country: 'India',
    funFact: 'I 4 minareti pendono leggermente verso l\'esterno per non danneggiare la cupola centrale in caso di terremoto.'
  },
  {
    id: 'g4',
    landmark: 'Tempio di Angkor Wat',
    imageEmoji: '🛕 🇰🇭',
    clues: [
      'Il più grande complesso religioso al mondo.',
      'Costruito nel XII secolo dall\'Impero Khmer tra giungle e canali.',
      'Raffigurato sulla bandiera nazionale dello Stato.'
    ],
    options: ['Siem Reap, Cambogia', 'Bangkok, Thailandia', 'Hanoi, Vietnam', 'Kyoto, Giappone'],
    correctAnswer: 'Siem Reap, Cambogia',
    country: 'Cambogia',
    funFact: 'Angkor Wat è orientato a ovest (a differenza della maggior parte dei templi indù), associato al tramonto e a Vishnu.'
  }
];

export const GeoGuessrGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [clueStep, setClueStep] = useState<number>(1);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const question = GEO_QUESTIONS[currentIdx];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === question.correctAnswer;
    if (isCorrect) {
      soundFx.playSuccess();
      const points = 300 - (clueStep - 1) * 50;
      setScore(s => s + points);
    } else {
      soundFx.playError();
    }
  };

  const nextQuestion = () => {
    soundFx.playClick();
    if (currentIdx < GEO_QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setClueStep(1);
      setIsAnswered(false);
    } else {
      soundFx.playLevelUp();
      setIsGameOver(true);
      onComplete({
        gameId: 'geoguessr-mind',
        gameTitle: 'GeoGuessr & Cultura Mondiale',
        category: 'language',
        score: Math.min(1000, score + 200),
        accuracy: 90,
        averageReactionTimeMs: 4500,
        difficultyLevel: 2,
      });
    }
  };

  return (
    <div id="geoguessr-game-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Conoscenza & Mondo
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-3 py-1 rounded-full border border-[#CBDDD2]">
            {score} pt
          </span>
          <span className="text-xs font-mono font-bold text-[#557163]">
            {currentIdx + 1}/{GEO_QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Visual Landmark Card */}
      <div className="bg-[#122219] p-6 rounded-3xl border border-[#2B4B39] shadow-xl text-center space-y-3">
        <div className="text-5xl drop-shadow-md py-2">{question.imageEmoji}</div>
        <h3 className="text-lg font-black text-white">{question.landmark}</h3>
      </div>

      {/* Incremental Clues */}
      <div className="p-4 rounded-3xl bg-white border border-[#CBDDD2] shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-[#557163] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#2E7652]" /> Indizi Geografici
          </span>
          {clueStep < question.clues.length && !isAnswered && (
            <button
              onClick={() => {
                soundFx.playClick();
                setClueStep(c => c + 1);
              }}
              className="text-[11px] font-bold text-[#2E7652] hover:underline cursor-pointer"
            >
              + Rivela Altro Indizio (-50 pt)
            </button>
          )}
        </div>

        <div className="space-y-1.5 pt-1">
          {question.clues.slice(0, clueStep).map((clue, idx) => (
            <div key={idx} className="text-xs text-[#122219] bg-[#F4F9F6] p-2.5 rounded-xl border border-[#CBDDD2]">
              • {clue}
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map(opt => {
          let optStyle = 'bg-white border-[#CBDDD2] text-[#122219] hover:bg-[#E5F2EC] shadow-2xs';
          if (isAnswered) {
            if (opt === question.correctAnswer) {
              optStyle = 'bg-[#2E7652] text-white border-[#22573C] shadow-md font-bold';
            } else if (opt === selectedOption) {
              optStyle = 'bg-[#E63946] text-white border-[#9E1A25] opacity-80';
            } else {
              optStyle = 'bg-[#F2F7F4] text-[#88A89A] opacity-50 border-[#CBDDD2]';
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`w-full p-3 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${optStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && opt === question.correctAnswer && <Check className="w-4 h-4 text-white" />}
            </button>
          );
        })}
      </div>

      {/* Fact & Next Button */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-3xl bg-[#EAF3EE] border border-[#B2D4BD] space-y-3"
        >
          <div className="text-xs text-[#1E4332] leading-relaxed">
            <strong className="block mb-0.5 text-[#122219]">Curiosità Culturale:</strong>
            {question.funFact}
          </div>
          <button
            onClick={nextQuestion}
            className="w-full py-3 rounded-2xl bg-[#1E4332] text-white text-xs font-bold shadow-xs hover:bg-[#2A5741] transition cursor-pointer"
          >
            {currentIdx < GEO_QUESTIONS.length - 1 ? 'Prossima Destinazione' : 'Concludi GeoGuessr'}
          </button>
        </motion.div>
      )}

      {/* Final GameOver Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
          >
            <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
            <h3 className="text-lg font-bold">Esplorazione Completata!</h3>
            <p className="text-xs text-[#BED8CA]">Punteggio Totale: <strong className="text-[#52D195]">{score} pt</strong></p>
            <button
              onClick={onExit}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Torna al Reparto Giochi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
