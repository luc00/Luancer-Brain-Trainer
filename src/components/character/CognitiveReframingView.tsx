import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { CognitiveReframing } from '../../types';
import { Sparkles, Brain, Loader2, Send, Lightbulb, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (xp: number) => void;
  onExit: () => void;
}

const PRESET_THOUGHTS = [
  "Non riesco a concentrarmi e sto perdendo tempo prezioso.",
  "Ho commesso un errore stupido e tutti perderanno fiducia in me.",
  "La quantità di lavoro è schiacciante e non ce la farò mai.",
  "Non sono portato per le materie logiche o complesse."
];

export const CognitiveReframingView: React.FC<Props> = ({ onComplete, onExit }) => {
  const [thoughtInput, setThoughtInput] = useState<string>('');
  const [situationInput, setSituationInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CognitiveReframing | null>(null);

  const handleReframe = async () => {
    if (!thoughtInput.trim()) return;
    soundFx.playClick();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/reframe-thought', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          negativeThought: thoughtInput,
          situation: situationInput || 'Sfida quotidiana',
        }),
      });

      const data = await res.json();
      if (data.reframing) {
        setResult(data.reframing);
        soundFx.playSuccess();
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch {}
      }
    } catch {
      setResult({
        distortion: "Pensiero polarizzato e sovra-generalizzazione",
        stoicLens: "Non sono le cose che ci turbano, ma le opinioni che abbiamo su di esse. (Epitteto)",
        reframedPerspective: "Questo momento di stallo è una curva di apprendimento naturale, non una misura del mio valore.",
        actionStep: "Fai un respiro profondo e scrivi la prima singola azione da compiere nei prossimi 5 minuti."
      });
      soundFx.playSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="cognitive-reframing-container" className="w-full max-w-md mx-auto flex flex-col flex-1 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 mb-4">
        <div className="flex items-center gap-1.5 text-purple-400">
          <Brain className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Reframing Cognitivo & Stoicismo</span>
        </div>
      </div>

      {!result ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 font-display">Palestra Mentale: Re-Framing</h2>
            <p className="text-xs text-slate-300">
              Trasforma i pensieri limitanti o lo stress in lucidità antifragile attraverso la Terapia Cognitivo-Comportamentale e i Modelli Mentali Stoici.
            </p>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-xs text-slate-400 font-semibold block mb-2">Seleziona un pensiero comune o scrivi il tuo:</span>
            <div className="space-y-1.5">
              {PRESET_THOUGHTS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundFx.playClick();
                    setThoughtInput(t);
                  }}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left text-xs text-slate-300 transition"
                >
                  &ldquo;{t}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Input text box */}
          <div className="space-y-2">
            <textarea
              value={thoughtInput}
              onChange={(e) => setThoughtInput(e.target.value)}
              placeholder="Descrivi il pensiero limitante o la frustrazione..."
              rows={3}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-400 text-white placeholder-slate-500 text-sm focus:outline-none transition resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Indietro
            </button>
            <button
              onClick={handleReframe}
              disabled={loading || !thoughtInput.trim()}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Elaborazione IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Riformula con IA
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                Distorsione Cognitiva Identificata:
              </span>
              <p className="text-xs font-semibold text-slate-200 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-lg">
                {result.distortion}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Lente Stoica & Principio di Controllo:
              </span>
              <p className="text-xs italic text-slate-300 bg-amber-950/30 border border-amber-800/40 p-2.5 rounded-lg leading-relaxed">
                &ldquo;{result.stoicLens}&rdquo;
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Prospettiva Riformulata (Nuovo Modello Mentale):
              </span>
              <p className="text-sm font-medium text-emerald-200 bg-emerald-950/40 border border-emerald-700/50 p-3 rounded-lg leading-relaxed">
                {result.reframedPerspective}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Azione Immediata (Pratica di 2 Minuti):
              </span>
              <div className="flex items-start gap-2 bg-cyan-950/40 border border-cyan-700/50 p-3 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-200 leading-relaxed">
                  {result.actionStep}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setResult(null)}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition"
            >
              Altro Pensiero
            </button>
            <button
              onClick={() => onComplete(120)}
              className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition"
            >
              Integra & Salva (+120 XP)
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
