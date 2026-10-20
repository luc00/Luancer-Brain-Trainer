import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx, BinauralPreset } from '../utils/audio';
import { Radio, X, Volume2, VolumeX, Sparkles, Waves } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BinauralModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activePreset, setActivePreset] = useState<BinauralPreset | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const presets = [
    {
      id: 'gamma' as BinauralPreset,
      name: 'Gamma Waves (40 Hz)',
      benefit: 'Hyper-Focus & Sincronizzazione Neurale',
      desc: 'Ideale durante sessioni di calcolo, memoria di lavoro intensiva e risoluzione di problemi complessi.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'alpha' as BinauralPreset,
      name: 'Alpha Waves (10 Hz)',
      benefit: 'Stato di Flow & Calma Vigile',
      desc: 'Migliora la memorizzazione a lungo termine, riduce lo stress e induce concentrazione senza ansia.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'theta' as BinauralPreset,
      name: 'Theta Waves (6 Hz)',
      benefit: 'Creatività Profonda & Intuizione',
      desc: 'Perfetto per il pensiero laterale, il reframing cognitivo e il recupero neurale post-allenamento.',
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  const togglePreset = (presetId: BinauralPreset) => {
    if (activePreset === presetId && isPlaying) {
      soundFx.stopBinauralBeats();
      setIsPlaying(false);
      setActivePreset(null);
    } else {
      soundFx.startBinauralBeats(presetId);
      setIsPlaying(true);
      setActivePreset(presetId);
    }
  };

  const stopAll = () => {
    soundFx.stopBinauralBeats();
    setIsPlaying(false);
    setActivePreset(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 relative"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <Waves className="w-5 h-5 animate-pulse" />
              <h3 className="text-base font-bold text-white font-display">Battiti Binaurali Neurali</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            I toni a frequenze differenziate stimolano il fenomeno dell&apos;<em>aggancio neurale (brainwave entrainment)</em>. 
            <strong> Usa le cuffie</strong> per il massimo beneficio.
          </p>

          <div className="space-y-2.5">
            {presets.map((p) => {
              const isActive = activePreset === p.id && isPlaying;
              return (
                <div
                  key={p.id}
                  onClick={() => togglePreset(p.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${isActive ? 'text-cyan-300' : 'text-white'}`}>
                      {p.name}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-400/90 block mb-1">
                    {p.benefit}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 pt-2">
            {isPlaying && (
              <button
                onClick={stopAll}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
              >
                Disattiva Toni
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
            >
              Fatto
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
