import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { CommunicationScenario } from '../../types';
import { MessageSquare, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, HeartHandshake, Sparkles, UserCheck } from 'lucide-react';

interface Props {
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

const SCENARIOS: CommunicationScenario[] = [
  {
    id: 'comm-1',
    title: 'Dire di "NO" con Rispetto e Fermezza',
    context: 'Un tuo conoscente o collega ti chiede di occuparti di un suo compito personale per l\'ennesima volta, sapendo che hai già le tue priorità piene.',
    trigger: 'Ti senti in colpa al solo pensiero di rifiutare, temendo di rovinare il rapporto o di sembrare egoista.',
    options: [
      {
        id: 'opt-1',
        text: 'Accetti controvoglia dicendo "Va bene, ci penso io", accumulando rabbia repressa e trascurando le tue cose.',
        style: 'Passivo / Evitante',
        score: 20,
        feedback: 'Questo alimenta il risentimento interiore e insegna agli altri che il tuo tempo non ha valore.',
        psychologicalInsight: 'Dire "sì" agli altri quando vuoi dire "no" significa dire di no a te stesso e alla tua integrità.',
      },
      {
        id: 'opt-2',
        text: 'Ti arrabbi e rispondi bruscamente: "Ma ti sembra normale chiedermelo ancora? Non sono il tuo schiavo!".',
        style: 'Reattivo / Aggressivo',
        score: 35,
        feedback: 'Anche se il limite è giusto, la reattività distrugge la comunicazione e sposta l\'attenzione sulla tua rabbia.',
        psychologicalInsight: 'La rabbia spesso maschera una difficoltà a stabilire confini sereni prima che la pentola a pressione esploda.',
      },
      {
        id: 'opt-3',
        text: 'Rispondi con calma e chiarezza: "Capisco che tu sia di fretta, ma oggi ho le mie priorità e non posso aiutarti. Ti auguro di risolvere al meglio".',
        style: 'Assertivo & Empatico',
        score: 100,
        feedback: 'Perfetto! Comunichi empatia per la sua situazione ma mantieni un confine chiaro e inattaccabile, senza scuse prolungate.',
        psychologicalInsight: 'L\'assertività pura non ha bisogno di giustificazioni estenuanti: la fermezza gentile è la chiave del rispetto duraturo.',
      },
    ],
  },
  {
    id: 'comm-2',
    title: 'Ricevere una Critica Ingiusta o Brusca',
    context: 'Durante una riunione o una cena, qualcuno critica duramente il tuo operato di fronte agli altri con un commento svalutante.',
    trigger: 'L\'istinto immediato dell\'ego è difendersi, contrattaccare o andare nel panico.',
    options: [
      {
        id: 'opt-1',
        text: 'Attacchi subito la persona sul piano personale: "Guarda che tu fai molti più errori di me, taci!".',
        style: 'Reattivo / Aggressivo',
        score: 25,
        feedback: 'Cadere nel fango con l\'interlocutore convalida l\'escalation e riduce la tua credibilità.',
        psychologicalInsight: 'Chi controlla la propria reazione controlla l\'esito della stanza.',
      },
      {
        id: 'opt-2',
        text: 'Fai finta di nulla, abbassi lo sguardo e rimani in silenzio sentendoti umiliato per tutto il giorno.',
        style: 'Passivo / Evitante',
        score: 30,
        feedback: 'Subire passivamente rafforza l\'insicurezza e lascia aperta la porta a futuri abusi verbali.',
        psychologicalInsight: 'Il silenzio passivo non è tolleranza, è auto-abbandono.',
      },
      {
        id: 'opt-3',
        text: 'Mantieni il contatto visivo, fai un respiro profondo e chiedi con tono neutro: "Qual è il dato specifico da cui trai questa conclusione, così possiamo analizzarlo costruttivamente?".',
        style: 'Assertivo & Empatico',
        score: 100,
        feedback: 'Brillante mossa stoica! Disinneschi l\'emotività, separi i fatti dai giudizi ed esponi l\'inconsistenza dell\'attacco.',
        psychologicalInsight: 'Chiedere specificità e chiarimenti toglie potere alla provocazione e costringe l\'altro a tornare sul piano razionale.',
      },
    ],
  },
  {
    id: 'comm-3',
    title: 'Ascolto Attivo in un Momento di Conflitto',
    context: 'Il tuo partner o un caro amico è visibilmente contrariato e comincia a sfogarsi su una situazione difficile.',
    trigger: 'Vuoi subito dare consigli tecnici, interrompere per dare soluzioni o spiegare perché sbaglia ad agitarsi.',
    options: [
      {
        id: 'opt-1',
        text: 'Interrompi subito: "Stai esagerando, la soluzione è facilissima: fai semplicemente così e risolvi".',
        style: 'Reattivo / Aggressivo',
        score: 30,
        feedback: 'Invalidi il suo stato d\'animo. Le persone non vogliono sentirsi dire che i loro sentimenti sono stupidi.',
        psychologicalInsight: 'Prima di cercare soluzioni, le persone hanno bisogno di sentirsi ascoltate e comprese.',
      },
      {
        id: 'opt-2',
        text: 'Annuisci mentre guardi distrattamente lo smartphone pensando a cosa cucinare stasera.',
        style: 'Passivo / Evitante',
        score: 20,
        feedback: 'La finta presenza è peggio dell\'assenza: fa sentire l\'altro invisibile e non apprezzato.',
        psychologicalInsight: 'La presenza totale è il dono più raro e prezioso che puoi fare a un essere umano.',
      },
      {
        id: 'opt-3',
        text: 'Riponi ogni distrazione, mantieni il contatto visivo, ascolti senza interrompere e rifletti: "Vedo che questa cosa ti ha davvero provato. Sono qui, raccontami tutto".',
        style: 'Assertivo & Empatico',
        score: 100,
        feedback: 'Eccellente! Crei uno spazio psicologico sicuro. Solo dopo aver convalidato l\'emozione potrete esplorare opzioni insieme.',
        psychologicalInsight: 'L\'ascolto empatico disarma la reattività del sistema nervoso ed edifica una connessione autentica.',
      },
    ],
  },
];

export const CommunicationGym: React.FC<Props> = ({ onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const scenario = SCENARIOS[currentIndex];
  const selectedOption = scenario.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    if (showAnalysis) return;
    soundFx.playClick();
    setSelectedOptionId(optId);
    setShowAnalysis(true);

    const chosen = scenario.options.find((o) => o.id === optId);
    if (chosen && chosen.score >= 80) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowAnalysis(false);
    } else {
      onComplete(180);
    }
  };

  return (
    <div id="communication-gym" className="space-y-4 max-w-md mx-auto pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-2xl p-3.5 shadow-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-xs font-semibold text-[#3D5B4D] hover:text-[#122219] transition"
        >
          <ArrowLeft className="w-4 h-4" /> Esci
        </button>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#1E4332]" />
          <span className="text-xs font-bold text-[#122219]">Scenario {currentIndex + 1} di {SCENARIOS.length}</span>
        </div>
        <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-2 py-0.5 rounded-full border border-[#CBDDD2]">
          +40 XP
        </span>
      </div>

      {/* Scenario Context Card */}
      <div className="bg-white border border-[#CBDDD2] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#E5F2EC] text-[#1E4332] border border-[#CBDDD2]">
            Competenza Umana & Relazioni
          </span>
          <span className="text-[10px] text-[#69887A] font-medium">Laboratorio di Assertività</span>
        </div>

        <h2 className="text-lg font-bold text-[#122219] font-display flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-[#376951]" /> {scenario.title}
        </h2>

        <div className="bg-[#F7FAF8] p-3.5 rounded-2xl border border-[#CBDDD2] space-y-2">
          <div>
            <span className="text-[10px] font-bold text-[#1E4332] uppercase tracking-wider block">Situazione Reale:</span>
            <p className="text-xs text-[#294B3C] font-medium leading-relaxed mt-0.5">
              {scenario.context}
            </p>
          </div>
          <div className="pt-2 border-t border-[#CBDDD2]">
            <span className="text-[10px] font-bold text-[#8C5D19] uppercase tracking-wider block">Frizione Emotiva:</span>
            <p className="text-xs text-[#544026] italic mt-0.5">
              {scenario.trigger}
            </p>
          </div>
        </div>
      </div>

      {/* Decision Options */}
      <div className="bg-white border border-[#CBDDD2] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#122219] uppercase tracking-wider">Come decidi di rispondere?</h3>
        </div>

        <div className="space-y-3">
          {scenario.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let cardStyle = 'bg-[#FAFDFB] border-[#CBDDD2] hover:bg-[#EBF3EE] hover:border-[#5C8C74] text-[#1D3629]';
            if (showAnalysis) {
              if (opt.style === 'Assertivo & Empatico') {
                cardStyle = 'bg-[#E5F2EC] border-[#2A6547] text-[#122A1E] font-bold shadow-xs';
              } else if (isSelected) {
                cardStyle = 'bg-[#FDF0F2] border-[#D98293] text-[#691829]';
              } else {
                cardStyle = 'opacity-50 bg-white border-[#CBDDD2] text-[#7A998C]';
              }
            }

            return (
              <button
                key={opt.id}
                disabled={showAnalysis}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs leading-relaxed flex flex-col gap-2 cursor-pointer ${cardStyle}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#CBDDD2]">
                    Stile: {opt.style}
                  </span>
                  {showAnalysis && opt.style === 'Assertivo & Empatico' && (
                    <span className="text-[11px] font-bold text-[#1E4332] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Ottimale
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed">
                  &ldquo;{opt.text}&rdquo;
                </p>
              </button>
            );
          })}
        </div>

        {/* Psychological Insight Drawer */}
        <AnimatePresence>
          {showAnalysis && selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-4 rounded-2xl bg-[#F4F9F6] border border-[#CBDDD2] text-xs space-y-2.5"
            >
              <div className="flex items-center gap-1.5 font-bold text-[#1E4332]">
                <ShieldCheck className="w-4 h-4" />
                <span>Lezione Psicologica & Relazionale:</span>
              </div>
              <p className="text-[#365747] leading-relaxed">
                {selectedOption.feedback}
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#CBDDD2]">
                <span className="text-[10px] font-bold text-[#193B2B] uppercase tracking-wider block mb-1">
                  Principio Guida:
                </span>
                <p className="text-xs text-[#2E4E3E] font-medium italic">
                  {selectedOption.psychologicalInsight}
                </p>
              </div>

              <button
                onClick={handleNext}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#1E4332] hover:bg-[#2A5741] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                {currentIndex < SCENARIOS.length - 1 ? (
                  <>Prossimo Scenario <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Completa Laboratorio (+180 XP) <CheckCircle2 className="w-4 h-4" /></>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
