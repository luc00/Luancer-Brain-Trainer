import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { CognitiveCategory } from '../../types';
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Flame,
  Lightbulb,
  Sparkles,
  Zap,
  HelpCircle,
  Cpu,
  Layers
} from 'lucide-react';

interface Props {
  onComplete: (score: number, accuracy: number, category: CognitiveCategory) => void;
  onBack: () => void;
}

type GameMode = 'binary' | 'trit_3phase' | 'diagonal_quantum';

interface LevelPreset {
  id: string;
  name: string;
  difficulty: 'Difficile' | 'Estremo' | 'Grandmaster';
  size: number; // 5 or 6
  mode: GameMode;
  description: string;
}

const PRESETS: LevelPreset[] = [
  {
    id: 'classic-5x5',
    name: 'Matrice 5x5 Parità Ortogonale',
    difficulty: 'Difficile',
    size: 5,
    mode: 'binary',
    description: 'Inverti lo stato del nodo e dei suoi 4 vicini ortogonali. Spegni tutti i nodi quantistici.'
  },
  {
    id: 'trit-5x5',
    name: 'Ciclo Quantico a 3 Fasi (Trit)',
    difficulty: 'Estremo',
    size: 5,
    mode: 'trit_3phase',
    description: 'Ogni impulso cicla i nodi tra 3 livelli energetici (Spento → Basso → Alto → Spento).'
  },
  {
    id: 'diagonal-6x6',
    name: 'Grandmaster Interferenza Diagonale 6x6',
    difficulty: 'Grandmaster',
    size: 6,
    mode: 'diagonal_quantum',
    description: 'Interferenza quantistica diagonale su matrice 6x6. Massima complessità combinatoria.'
  }
];

export const LightsOutGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [presetIdx, setPresetIdx] = useState(0);
  const preset = PRESETS[presetIdx];

  const [grid, setGrid] = useState<number[][]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);

  // Initialize a solvable board by applying random clicks to an empty board
  const initializeBoard = () => {
    const size = preset.size;
    const initialGrid = Array.from({ length: size }, () => Array(size).fill(0));

    // Scramble by simulating 10 to 18 valid moves
    const scrambleMoves = preset.mode === 'diagonal_quantum' ? 14 : 10;
    for (let i = 0; i < scrambleMoves; i++) {
      const randR = Math.floor(Math.random() * size);
      const randC = Math.floor(Math.random() * size);
      applyToggle(initialGrid, randR, randC, preset.mode, size);
    }

    setGrid(initialGrid);
    setMoves(0);
    setElapsedSeconds(0);
    setIsWon(false);
    setHintsLeft(3);
  };

  const applyToggle = (g: number[][], r: number, c: number, mode: GameMode, size: number) => {
    const maxVal = mode === 'trit_3phase' ? 3 : 2;

    const coordsToFlip: [number, number][] = [[r, c]];

    if (mode === 'diagonal_quantum') {
      coordsToFlip.push([r - 1, c - 1], [r - 1, c + 1], [r + 1, c - 1], [r + 1, c + 1]);
    } else {
      coordsToFlip.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
    }

    coordsToFlip.forEach(([nr, nc]) => {
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        g[nr][nc] = (g[nr][nc] + 1) % maxVal;
      }
    });
  };

  useEffect(() => {
    initializeBoard();
  }, [presetIdx]);

  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  const handleCellClick = (r: number, c: number) => {
    if (isWon) return;
    soundFx.playClick();

    setGrid(prev => {
      const next = prev.map(row => [...row]);
      applyToggle(next, r, c, preset.mode, preset.size);

      // Check win condition: all cells are 0 (off)
      const allOff = next.every(row => row.every(cell => cell === 0));
      if (allOff && !isWon) {
        soundFx.playSuccess();
        setIsWon(true);
        if (presetIdx === PRESETS.length - 1) {
          onComplete(3200, 100, 'logic');
        }
      }

      return next;
    });

    setMoves(m => m + 1);
  };

  const activeCount = useMemo(() => {
    return grid.reduce((acc, row) => acc + row.filter(c => c > 0).length, 0);
  }, [grid]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const r = secs % 60;
    return `${mins}:${r < 10 ? '0' : ''}${r}`;
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6 bg-[#0F172A] text-[#E2E8F0] overflow-y-auto rounded-3xl border border-[#1E293B] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-[#1E293B] border border-[#334155] hover:bg-[#334155] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#94A3B8]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#38BDF8]" /> Lights Out: Matrice a Parità Inversa
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7F3847] text-white flex items-center gap-1">
                <Flame className="w-3 h-3" /> {preset.difficulty}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Algebra lineare su campo finito GF(2) • Spegni tutti i nodi quantistici
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-[#94A3B8]">Mosse • Tempo</span>
            <div className="text-sm font-mono font-bold text-[#38BDF8]">
              {moves}m • {formatTime(elapsedSeconds)}
            </div>
          </div>
          <button
            onClick={initializeBoard}
            className="p-2 rounded-xl bg-[#1E293B] border border-[#334155] hover:bg-[#334155] text-[#94A3B8] transition-colors"
            title="Rimescola Matrice"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Tabs */}
      <div className="flex gap-2 bg-[#1E293B] p-2 rounded-2xl mb-4 border border-[#334155]">
        {PRESETS.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setPresetIdx(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              presetIdx === idx
                ? 'bg-[#38BDF8] text-[#0F172A] shadow-md'
                : 'bg-[#0F172A] text-[#94A3B8] hover:text-white'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Board & Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-4 items-center">
        {/* Matrix Canvas (7 cols) */}
        <div className="md:col-span-7 bg-[#0B1120] rounded-3xl p-6 border border-[#334155] shadow-inner flex flex-col items-center justify-center min-h-[380px]">
          <div
            className="grid gap-2 p-3 bg-[#0F172A] rounded-2xl border border-[#1E293B] shadow-2xl w-full max-w-[360px] aspect-square"
            style={{
              gridTemplateColumns: `repeat(${preset.size}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${preset.size}, minmax(0, 1fr))`
            }}
          >
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isActive = val > 0;
                return (
                  <motion.button
                    key={`${r}-${c}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleCellClick(r, c)}
                    className={`rounded-xl border transition-all flex items-center justify-center font-mono font-bold text-sm shadow-md select-none ${
                      val === 0
                        ? 'bg-[#1E293B]/60 border-[#334155] text-slate-600'
                        : val === 1
                        ? 'bg-[#0284C7] border-[#38BDF8] text-white ring-2 ring-[#38BDF8]/50 shadow-cyan-500/30'
                        : 'bg-[#8B5CF6] border-[#C084FC] text-white ring-2 ring-[#C084FC]/50 shadow-purple-500/30'
                    }`}
                  >
                    {val > 0 && <Zap className="w-5 h-5" />}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Tactical Overview (5 cols) */}
        <div className="md:col-span-5 bg-[#1E293B] rounded-3xl p-5 border border-[#334155] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
              Stato Matrice:
            </span>
            <span className="text-xs font-mono font-bold text-white px-2 py-1 rounded bg-[#0F172A]">
              {activeCount} Nodi Attivi
            </span>
          </div>

          <div className="space-y-2 text-xs text-[#94A3B8] leading-relaxed">
            <div className="p-3 bg-[#0F172A] rounded-xl border border-[#334155]">
              <strong className="text-white block mb-1">Regola di Propagazione:</strong>
              {preset.description}
            </div>
            <div className="p-3 bg-[#0F172A] rounded-xl border border-[#334155]">
              <strong className="text-white block mb-1">Strategia di Riduzione:</strong>
              Risolvi riga per riga (metodo "Light Chasing"): per spegnere una luce sulla riga superiore, premi il pulsante situato esattamente sotto di essa.
            </div>
          </div>
        </div>
      </div>

      {/* Win Banner */}
      {isWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500 text-white flex items-center justify-between shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">Tutti i Nodi Quantistici Spenti!</h3>
              <p className="text-xs text-emerald-200">
                Matrice a parità inversa azzerata in {formatTime(elapsedSeconds)} con {moves} impulsi.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (presetIdx < PRESETS.length - 1) {
                setPresetIdx(p => p + 1);
              } else {
                onBack();
              }
            }}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all shadow-md"
          >
            {presetIdx < PRESETS.length - 1 ? 'Livello Successivo' : 'Completa Sessione'}
          </button>
        </motion.div>
      )}
    </div>
  );
};
