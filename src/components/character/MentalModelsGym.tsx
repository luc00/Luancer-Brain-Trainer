import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { MentalModelLesson } from '../../types';
import { Lightbulb, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Brain, BookOpen, Compass, Award } from 'lucide-react';

interface Props {
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

const MENTAL_MODELS: MentalModelLesson[] = [
  {
    id: 'second-order-thinking',
    name: 'Pensiero di Secondo Ordine',
    category: 'Decisioni',
    summary: 'Non valutare solo le conseguenze immediate di una scelta, ma gli effetti a lungo termine a catena.',
    deepDive: 'Il pensiero di primo ordine dice: "Ho fame e sono stanco, mangio zuccheri e salto la palestra per sentirmi subito meglio". Il pensiero di secondo ordine chiede: "E poi cosa succede? Calo di energia, senso di colpa, sonno peggiore e perdita di disciplina". I grandi leader e le persone sagge decidono sempre guardando il secondo e terzo livello.',
    realWorldExample: 'Prendere una decisione finanziaria o relazionale guardando come influenzerà i prossimi 6 mesi, non i prossimi 10 minuti.',
    quiz: {
      scenario: 'Ti viene offerto un progetto extra molto ben pagato ma che ti costringerà a lavorare 70 ore a settimana togliendo tempo al sonno e alla famiglia per 3 mesi. Come si applica il Pensiero di Secondo Ordine?',
      options: [
        'Accetti subito perché il guadagno immediato a breve termine è molto elevato.',
        'Valuti l\'effetto a catena: il burnout potenziale, il logoramento dei rapporti e il calo di lucidità nel lavoro principale.',
        'Rifiuti categoricamente ogni tipo di opportunità senza analizzare le risorse.',
      ],
      correctIndex: 1,
      explanation: 'Esatto! Il secondo ordine analizza le conseguenze secondarie (salute, lucidità, relazioni) che spesso superano di gran lunga il beneficio superficiale immediato.',
    },
  },
  {
    id: 'sunk-cost-fallacy',
    name: 'Fallacia dei Costi Sommersi',
    category: 'Ragionamento',
    summary: 'Non continuare un progetto o una relazione dannosa solo perché vi hai già investito tempo o denaro nel passato.',
    deepDive: 'Il denaro, il tempo e le energie già spesi non torneranno indietro indipendentemente da cosa farai adesso. L\'unica domanda razionale per il futuro è: "Se partissi da zero oggi, continuerei a investire in questa direzione?".',
    realWorldExample: 'Continuare a guardare un film orribile solo perché hai pagato il biglietto, sprecando altre 2 ore del tuo tempo prezioso.',
    quiz: {
      scenario: 'Hai iniziato un corso universitario o un progetto da 6 mesi che detesti e che non ha alcuno sbocco con i tuoi veri valori. Tuttavia pensi: "Ho già sprecato 6 mesi, devo finirlo per forza". Cosa consiglia la lucidità mentale?',
      options: [
        'Continuare fino alla fine per non buttare via i 6 mesi già trascorsi.',
        'Riconoscere che i 6 mesi sono già andati: rimanere peggiora solo la situazione e ruba il tuo futuro. Rivaluta razionalmente le alternative.',
        'Lamentarsi ogni giorno ma non cambiare rotta.',
      ],
      correctIndex: 1,
      explanation: 'Corretto! Il passato è irrecuperabile. Continuare per non ammettere la perdita ti condanna a perdere anche i prossimi 2 anni.',
    },
  },
  {
    id: 'hanlons-razor',
    name: 'Rasoio di Hanlon',
    category: 'Psicologia',
    summary: 'Non attribuire mai a cattiveria o malizia ciò che può essere adeguatamente spiegato con distrazione o incomprensione.',
    deepDive: 'Quando qualcuno non risponde a un messaggio o fa un errore che ti danneggia, la mente tende a pensare istintivamente: "Ce l\'ha con me, mi vuole sabotare". Il Rasoio di Hanlon protegge la tua serenità ricordandoti che le persone sono spesso solo stanche, distratte o sopraffatte.',
    realWorldExample: 'Un collega non ti saluta al mattino: invece di covare rancore, consideri che potrebbe essere preoccupato per un problema personale.',
    quiz: {
      scenario: 'Un amico fidato visualizza un tuo messaggio importante e non risponde per 24 ore. Qual è la risposta basata sul Rasoio di Hanlon?',
      options: [
        'Supporre che sia arrabbiato con te e rispondergli con un tono passivo-aggressivo.',
        'Presumere che sia stato interrotto, sia impegnato o abbia avuto una giornata intensa, e ricontattarlo con calma e garbo.',
        'Bloccarlo e chiudere l\'amicizia per orgoglio personale.',
      ],
      correctIndex: 1,
      explanation: 'Perfetto! Evitare di inventare scenari persecutori riduce l\'ansia relazionale e mantiene i rapporti sani ed equilibrati.',
    },
  },
  {
    id: 'circle-of-competence',
    name: 'Cerchio di Competenza',
    category: 'Decisioni',
    summary: 'Conosci con precisione i limiti di ciò che sai davvero e non temere di dire "non lo so".',
    deepDive: 'Warren Buffett e Charlie Munger hanno dimostrato che il successo nella vita non dipende da quanto è grande il tuo cerchio, ma dal sapere esattamente dove si trova il suo confine. Operare all\'interno del cerchio produce risultati solidi; operare fuori con presunzione porta a errori fatali.',
    realWorldExample: 'Dire onestamente al lavoro: "Su questo argomento non ho ancora abbastanza dati per dare un giudizio certo, mi informo e ti rispondo".',
    quiz: {
      scenario: 'In una discussione di gruppo ti viene chiesta un\'opinione su un argomento complesso e tecnico di cui hai solo letto un titolo sui social. Come agisce una persona lucida?',
      options: [
        'Inventare un parere autorevole per non sembrare ignorante davanti agli altri.',
        'Ammutolirsi e sentirsi inferiori a tutti.',
        'Dichiarare onestamente il proprio limite di conoscenza e fare domande curiose per ascoltare e imparare.',
      ],
      correctIndex: 2,
      explanation: 'Esatto! L\'umiltà intellettuale è la massima dimostrazione di saggezza e protegge dalla superficialità.',
    },
  },
  {
    id: 'premeditatio-malorum',
    name: 'Inversione Stoica (Pre-Mortem)',
    category: 'Ragionamento',
    summary: 'Anticipa mentalmente i possibili ostacoli prima di iniziare, per disinnescare la paura e preparare soluzioni.',
    deepDive: 'Invece di sperare ciecamente che tutto vada liscio (ottimismo ingenuo), visualizza in anticipo cosa potrebbe andare storto: "Se piove? Se perdo la connessione? Se mi sento stanco?". Questo ti rende calmo, resiliente e antifragile di fronte agli imprevisti.',
    realWorldExample: 'Prima di una presentazione importante, pianificare un piano B per le slide e respirare sapendo di essere preparati a ogni evenienza.',
    quiz: {
      scenario: 'Devi iniziare una nuova abitudine di sveglia presto alle 6:30. Come applichi il Pre-Mortem stoico?',
      options: [
        'Conti solo sulla forza di volontà del momento senza pianificare nulla.',
        'Identifichi in anticipo gli ostacoli (andare a letto tardi, telefono sul comodino) e crei contromisure (telefono in un\'altra stanza, orario fisso di sonno).',
        'Decidi di non iniziare perché svegliarsi presto è faticoso.',
      ],
      correctIndex: 1,
      explanation: 'Ottimo! Eliminare le frizioni in anticipo trasforma le buone intenzioni in abitudini automatiche e durature.',
    },
  },
];

export const MentalModelsGym: React.FC<Props> = ({ onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const current = MENTAL_MODELS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (showResult) return;
    soundFx.playClick();
    setSelectedOption(idx);
    setShowResult(true);

    if (idx === current.quiz.correctIndex) {
      soundFx.playSuccess();
      setCompletedCount((prev) => prev + 1);
    } else {
      soundFx.playError();
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentIndex < MENTAL_MODELS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      onComplete(200);
    }
  };

  return (
    <div id="mental-models-gym" className="space-y-4 max-w-md mx-auto pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-2xl p-3.5 shadow-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-xs font-semibold text-[#3D5B4D] hover:text-[#122219] transition"
        >
          <ArrowLeft className="w-4 h-4" /> Esci
        </button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#1E4332]" />
          <span className="text-xs font-bold text-[#122219]">Modello {currentIndex + 1} di {MENTAL_MODELS.length}</span>
        </div>
        <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-2 py-0.5 rounded-full border border-[#CBDDD2]">
          +40 XP
        </span>
      </div>

      {/* Model Overview Card */}
      <div className="bg-white border border-[#CBDDD2] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#E5F2EC] text-[#1E4332] border border-[#CBDDD2]">
            {current.category}
          </span>
          <span className="text-[10px] text-[#69887A] font-medium">Modello Mentale Fondamentale</span>
        </div>

        <h2 className="text-lg font-bold text-[#122219] font-display flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#376951]" /> {current.name}
        </h2>

        <p className="text-xs text-[#294B3C] font-semibold leading-relaxed bg-[#F7FAF8] p-3 rounded-2xl border border-[#CBDDD2]">
          &ldquo;{current.summary}&rdquo;
        </p>

        <p className="text-xs text-[#446253] leading-relaxed">
          {current.deepDive}
        </p>

        <div className="pt-2 border-t border-[#E5EFE9]">
          <span className="text-[11px] font-bold text-[#193B2B] block mb-1">Applicazione Pratica nella Vita:</span>
          <p className="text-xs text-[#527163] italic">
            {current.realWorldExample}
          </p>
        </div>
      </div>

      {/* Interactive Quiz / Scenario Application */}
      <div className="bg-white border border-[#CBDDD2] rounded-3xl p-5 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#C48C2E]" />
          <h3 className="text-xs font-bold text-[#122219] uppercase tracking-wider">Metti alla Prova la tua Lucidità</h3>
        </div>

        <p className="text-xs font-medium text-[#1A3125] leading-relaxed">
          {current.quiz.scenario}
        </p>

        <div className="space-y-2.5 pt-1">
          {current.quiz.options.map((opt, idx) => {
            let btnStyle = 'bg-[#FAFDFB] border-[#CBDDD2] text-[#1D3629] hover:bg-[#EBF3EE] hover:border-[#5C8C74]';
            if (showResult) {
              if (idx === current.quiz.correctIndex) {
                btnStyle = 'bg-[#E5F2EC] border-[#2A6547] text-[#122A1E] font-bold shadow-xs';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-[#FDF0F2] border-[#D98293] text-[#691829]';
              } else {
                btnStyle = 'opacity-50 bg-white border-[#CBDDD2] text-[#7A998C]';
              }
            }

            return (
              <button
                key={idx}
                disabled={showResult}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs leading-relaxed flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
              >
                <span className="w-5 h-5 rounded-full bg-white border border-[#CBDDD2] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-[#1E4332]">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{opt}</span>
                {showResult && idx === current.quiz.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-[#1E4332] shrink-0 mt-0.5" />
                )}
                {showResult && idx === selectedOption && idx !== current.quiz.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3.5 rounded-2xl bg-[#F4F9F6] border border-[#CBDDD2] text-xs space-y-2"
            >
              <div className="flex items-center gap-1.5 font-bold text-[#1E4332]">
                <Award className="w-4 h-4" />
                <span>Analisi del Modello:</span>
              </div>
              <p className="text-[#365747] leading-relaxed">
                {current.quiz.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#1E4332] hover:bg-[#2A5741] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                {currentIndex < MENTAL_MODELS.length - 1 ? (
                  <>Prossimo Modello <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Completa Sessione (+200 XP) <CheckCircle2 className="w-4 h-4" /></>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
