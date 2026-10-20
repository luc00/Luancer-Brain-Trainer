import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { CharacterDilemma, CharacterDilemmaOption, CharacterTraits } from '../../types';
import { Shield, Sparkles, Loader2, CheckCircle2, RotateCcw, Compass, ArrowRight, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (delta: Partial<CharacterTraits>, xp: number) => void;
  onExit: () => void;
}

const FALLBACK_DILEMMA: CharacterDilemma = {
  id: 'fallback-1',
  title: 'La Promozione Contesa e l\'Attribuzione del Merito',
  context: 'Durante la presentazione annuale aziendale, il tuo collega di progetto presenta un\'innovazione chiave sviluppata per l\'80% da te come se fosse una sua intuizione personale, ricevendo gli elogi pubblici del comitato direttivo.',
  virtueFocus: 'Autocontrollo, Fermezza Morale & Giustizia',
  options: [
    {
      id: 'opt-1',
      text: 'Intervieni subito con un sorriso posato nel Q&A: ringrazi il collega e integri la spiegazione con i dati tecnici e i prossimi passi che stai guidando.',
      traitScore: { resilience: 90, temperance: 85, courage: 90, wisdom: 95 },
      virtue: 'Lucidità Strategica & Fermezza Posata',
      feedback: 'Eccellente: non cedi alla rabbia ma rivendichi con maestria il tuo contributo davanti a tutti senza apparire rancoroso.'
    },
    {
      id: 'opt-2',
      text: 'Non dici nulla in pubblico per evitare imbarazzo, ma in privato chiedi spiegazioni con fermezza e concordi una mail chiarificatrice al comitato.',
      traitScore: { resilience: 80, temperance: 90, courage: 75, wisdom: 85 },
      virtue: 'Temperanza & Risoluzione Diplomatica',
      feedback: 'Ottima salvaguardia della professionalità e dei rapporti, proteggendo la tua dignità a mente fredda.'
    },
    {
      id: 'opt-3',
      text: 'Interrompi bruscamente la presentazione denunciando il plagio davanti alla direzione.',
      traitScore: { resilience: 40, temperance: 25, courage: 60, wisdom: 35 },
      virtue: 'Impulsività Reattiva',
      feedback: 'Sebbene giustificato nei fatti, l\'attacco emotivo distrugge il decoro dell\'incontro e ti mette in cattiva luce.'
    },
    {
      id: 'opt-4',
      text: 'Decidi di lasciar correre interiormente ritenendo che il lavoro ben fatto parli da sé nel lungo periodo.',
      traitScore: { resilience: 70, temperance: 80, courage: 30, wisdom: 55 },
      virtue: 'Pazienza Passiva',
      feedback: 'Mostri distacco stoico, ma l\'eccessiva passività rischia di penalizzare la tua crescita ed incentivare comportamenti scorretti altrui.'
    }
  ]
};

export const CharacterDilemmaView: React.FC<Props> = ({ onComplete, onExit }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dilemma, setDilemma] = useState<CharacterDilemma>(FALLBACK_DILEMMA);
  const [selectedOption, setSelectedOption] = useState<CharacterDilemmaOption | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);

  const fetchDilemma = async () => {
    setLoading(true);
    setSelectedOption(null);
    setRevealed(false);
    try {
      const res = await fetch('/api/ai/generate-character-dilemma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'resilience', difficulty: 'hard' }),
      });
      const data = await res.json();
      if (data.dilemma && data.dilemma.title && data.dilemma.options?.length) {
        setDilemma(data.dilemma);
      } else {
        setDilemma(FALLBACK_DILEMMA);
      }
    } catch {
      setDilemma(FALLBACK_DILEMMA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDilemma();
  }, []);

  const handleSelectOption = (opt: CharacterDilemmaOption) => {
    if (revealed) return;
    soundFx.playClick();
    setSelectedOption(opt);
    setRevealed(true);

    const avgScore = (opt.traitScore.resilience + opt.traitScore.temperance + opt.traitScore.courage + opt.traitScore.wisdom) / 4;
    if (avgScore >= 75) {
      soundFx.playSuccess();
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch {}
    } else {
      soundFx.playError();
    }
  };

  const handleConfirmAndComplete = () => {
    if (!selectedOption) return;
    soundFx.playClick();
    
    // Map trait scores to incremental deltas
    const delta: Partial<CharacterTraits> = {
      resilience: Math.round((selectedOption.traitScore.resilience - 50) * 0.08),
      temperance: Math.round((selectedOption.traitScore.temperance - 50) * 0.08),
      courage: Math.round((selectedOption.traitScore.courage - 50) * 0.08),
      wisdom: Math.round((selectedOption.traitScore.wisdom - 50) * 0.08),
      emotionalMastery: Math.round((selectedOption.traitScore.temperance - 50) * 0.06),
    };

    onComplete(delta, 180);
  };

  return (
    <div id="character-dilemma-container" className="w-full max-w-md mx-auto flex flex-col flex-1 pb-16">
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1 my-auto text-center p-8">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-4" />
          <p className="text-sm font-semibold text-white">Generazione Dilemma Stoico...</p>
          <span className="text-xs text-slate-400 mt-1">L&apos;IA sta configurando uno scenario di bivio morale</span>
        </div>
      ) : (
        <div className="flex flex-col flex-1 justify-between">
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 mb-4">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Palestra del Carattere</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">{dilemma.virtueFocus}</span>
          </div>

          {/* Context Card */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 shadow-xl backdrop-blur-md mb-4">
            <h3 className="text-base font-bold text-white mb-2 font-display flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400 shrink-0" />
              {dilemma.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {dilemma.context}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5 mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Come reagisci da mente stoica e virtuosa?
            </span>
            {dilemma.options.map((opt) => {
              const isChosen = selectedOption?.id === opt.id;
              let style = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500/50';

              if (revealed) {
                if (isChosen) {
                  style = 'bg-amber-950/60 border-amber-400 text-white shadow-lg shadow-amber-500/10';
                } else {
                  style = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={revealed}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${style}`}
                >
                  <p className="leading-relaxed">{opt.text}</p>
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {revealed && selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 mb-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Virtù: {selectedOption.virtue}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {selectedOption.feedback}
              </p>

              {/* Trait metrics */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
                <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Resilienza</span>
                  <span className="font-bold text-amber-400">+{selectedOption.traitScore.resilience}</span>
                </div>
                <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Autocontrollo</span>
                  <span className="font-bold text-cyan-400">+{selectedOption.traitScore.temperance}</span>
                </div>
                <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Coraggio</span>
                  <span className="font-bold text-rose-400">+{selectedOption.traitScore.courage}</span>
                </div>
                <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Saggezza</span>
                  <span className="font-bold text-emerald-400">+{selectedOption.traitScore.wisdom}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Chiudi
            </button>
            {revealed ? (
              <button
                onClick={handleConfirmAndComplete}
                className="flex-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center justify-center gap-2"
              >
                Registra Virtù Neurale <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={fetchDilemma}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm flex items-center justify-center gap-1.5"
                title="Genera un altro scenario"
              >
                <RotateCcw className="w-4 h-4" /> Altro
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
