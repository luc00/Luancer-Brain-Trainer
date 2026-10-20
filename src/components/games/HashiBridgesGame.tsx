import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { CognitiveCategory } from '../../types';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Flame,
  Lightbulb,
  HelpCircle,
  Network,
  Check,
  X
} from 'lucide-react';

interface Props {
  onComplete: (score: number, accuracy: number, category: CognitiveCategory) => void;
  onBack: () => void;
}

interface Island {
  id: number;
  r: number;
  c: number;
  required: number;
}

interface Bridge {
  fromId: number;
  toId: number;
  count: 1 | 2;
  orientation: 'H' | 'V';
}

interface HashiLevel {
  id: number;
  name: string;
  difficulty: 'Avanzato' | 'Difficile' | 'Estremo' | 'Grandmaster';
  rows: number;
  cols: number;
  islands: Island[];
}

const HASHI_LEVELS: HashiLevel[] = [
  {
    id: 1,
    name: 'Arcipelago di Konigsberg',
    difficulty: 'Avanzato',
    rows: 6,
    cols: 6,
    islands: [
      { id: 1, r: 0, c: 0, required: 2 },
      { id: 2, r: 0, c: 3, required: 3 },
      { id: 3, r: 0, c: 5, required: 2 },
      { id: 4, r: 2, c: 0, required: 2 },
      { id: 5, r: 2, c: 3, required: 4 },
      { id: 6, r: 2, c: 5, required: 2 },
      { id: 7, r: 5, c: 0, required: 1 },
      { id: 8, r: 5, c: 3, required: 3 },
      { id: 9, r: 5, c: 5, required: 2 },
    ]
  },
  {
    id: 2,
    name: 'Topologia Neurale a 12 Nodi',
    difficulty: 'Difficile',
    rows: 7,
    cols: 7,
    islands: [
      { id: 1, r: 0, c: 1, required: 3 },
      { id: 2, r: 0, c: 4, required: 3 },
      { id: 3, r: 0, c: 6, required: 2 },
      { id: 4, r: 2, c: 1, required: 4 },
      { id: 5, r: 2, c: 4, required: 5 },
      { id: 6, r: 2, c: 6, required: 3 },
      { id: 7, r: 4, c: 0, required: 2 },
      { id: 8, r: 4, c: 2, required: 3 },
      { id: 9, r: 4, c: 4, required: 3 },
      { id: 10, r: 6, c: 0, required: 2 },
      { id: 11, r: 6, c: 2, required: 3 },
      { id: 12, r: 6, c: 6, required: 1 },
    ]
  },
  {
    id: 3,
    name: 'Grandmaster Hashi Lattice',
    difficulty: 'Grandmaster',
    rows: 8,
    cols: 8,
    islands: [
      { id: 1, r: 0, c: 0, required: 3 },
      { id: 2, r: 0, c: 3, required: 4 },
      { id: 3, r: 0, c: 7, required: 2 },
      { id: 4, r: 2, c: 0, required: 4 },
      { id: 5, r: 2, c: 3, required: 6 },
      { id: 6, r: 2, c: 5, required: 3 },
      { id: 7, r: 2, c: 7, required: 3 },
      { id: 8, r: 4, c: 1, required: 3 },
      { id: 9, r: 4, c: 3, required: 3 },
      { id: 10, r: 4, c: 5, required: 4 },
      { id: 11, r: 6, c: 0, required: 3 },
      { id: 12, r: 6, c: 3, required: 5 },
      { id: 13, r: 6, c: 5, required: 3 },
      { id: 14, r: 7, c: 0, required: 1 },
      { id: 15, r: 7, c: 3, required: 2 },
      { id: 16, r: 7, c: 7, required: 2 },
    ]
  }
];

export const HashiBridgesGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = HASHI_LEVELS[levelIdx];

  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [selectedIslandId, setSelectedIslandId] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    setBridges([]);
    setSelectedIslandId(null);
    setElapsedSeconds(0);
    setIsWon(false);
  }, [levelIdx]);

  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  // Calculate bridge counts per island
  const islandBridgeCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    level.islands.forEach(isl => {
      counts[isl.id] = 0;
    });

    bridges.forEach(b => {
      counts[b.fromId] = (counts[b.fromId] || 0) + b.count;
      counts[b.toId] = (counts[b.toId] || 0) + b.count;
    });

    return counts;
  }, [bridges, level]);

  // Check if two islands can connect (straight line, no intervening islands)
  const canConnect = (islA: Island, islB: Island): { valid: boolean; orientation?: 'H' | 'V' } => {
    if (islA.id === islB.id) return { valid: false };

    // Same row = horizontal
    if (islA.r === islB.r) {
      const minC = Math.min(islA.c, islB.c);
      const maxC = Math.max(islA.c, islB.c);
      // Check no intervening island
      const hasBetween = level.islands.some(
        isl => isl.id !== islA.id && isl.id !== islB.id && isl.r === islA.r && isl.c > minC && isl.c < maxC
      );
      if (!hasBetween) return { valid: true, orientation: 'H' };
    }

    // Same col = vertical
    if (islA.c === islB.c) {
      const minR = Math.min(islA.r, islB.r);
      const maxR = Math.max(islA.r, islB.r);
      const hasBetween = level.islands.some(
        isl => isl.id !== islA.id && isl.id !== islB.id && isl.c === islA.c && isl.r > minR && isl.r < maxR
      );
      if (!hasBetween) return { valid: true, orientation: 'V' };
    }

    return { valid: false };
  };

  const handleIslandClick = (island: Island) => {
    soundFx.playClick();

    if (selectedIslandId === null) {
      setSelectedIslandId(island.id);
    } else if (selectedIslandId === island.id) {
      setSelectedIslandId(null);
    } else {
      const firstIsland = level.islands.find(i => i.id === selectedIslandId)!;
      const { valid, orientation } = canConnect(firstIsland, island);

      if (valid && orientation) {
        // Toggle bridge (0 -> 1 -> 2 -> 0)
        const id1 = Math.min(firstIsland.id, island.id);
        const id2 = Math.max(firstIsland.id, island.id);

        const existingIdx = bridges.findIndex(b => b.fromId === id1 && b.toId === id2);

        setBridges(prev => {
          const next = [...prev];
          if (existingIdx >= 0) {
            if (next[existingIdx].count === 1) {
              next[existingIdx] = { ...next[existingIdx], count: 2 };
            } else {
              next.splice(existingIdx, 1); // remove
            }
          } else {
            next.push({ fromId: id1, toId: id2, count: 1, orientation });
          }
          return next;
        });
      } else {
        soundFx.playError();
      }
      setSelectedIslandId(null);
    }
  };

  // Full validation: All islands have exact required counts + graph is single connected component
  const validateSolution = () => {
    // 1. Check all island bridge counts match required
    const allCountsMatch = level.islands.every(isl => islandBridgeCounts[isl.id] === isl.required);
    if (!allCountsMatch) {
      soundFx.playError();
      alert('Alcune isole non hanno ancora il numero esatto di ponti richiesto (guarda i numeri evidenziati).');
      return;
    }

    // 2. Check single connected network (BFS)
    const adj: Record<number, number[]> = {};
    level.islands.forEach(i => (adj[i.id] = []));
    bridges.forEach(b => {
      adj[b.fromId].push(b.toId);
      adj[b.toId].push(b.fromId);
    });

    const visited = new Set<number>();
    const queue = [level.islands[0].id];
    visited.add(level.islands[0].id);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const neighbor of adj[curr] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    if (visited.size !== level.islands.length) {
      soundFx.playError();
      alert('Tutte le isole devono essere connesse in una singola rete unificata (nessun gruppo isolato separato)!');
      return;
    }

    // Victory!
    soundFx.playSuccess();
    setIsWon(true);
    if (levelIdx === HASHI_LEVELS.length - 1) {
      onComplete(3200, 100, 'logic');
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const r = secs % 60;
    return `${mins}:${r < 10 ? '0' : ''}${r}`;
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-6 bg-[#FAF7F2] text-[#2C3E50] overflow-y-auto rounded-3xl border border-[#E8E2D9] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F2ECE4] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-[#5C6B73]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold font-serif text-[#1F2937] flex items-center gap-2">
                <Network className="w-5 h-5 text-[#1E4332]" /> Hashiwokakero (Ponti Giapponesi)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7F3847] text-white flex items-center gap-1">
                <Flame className="w-3 h-3" /> {level.difficulty}
              </span>
            </div>
            <p className="text-xs text-[#7F8C8D]">
              Collega tutte le isole con 1 o 2 ponti ortogonali in una singola rete continua
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-[#7F8C8D]">Tempo</span>
            <div className="text-sm font-mono font-bold text-[#1E4332]">{formatTime(elapsedSeconds)}</div>
          </div>
          <button
            onClick={() => setBridges([])}
            className="p-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F2ECE4] text-[#5C6B73] transition-colors shadow-sm"
            title="Azzera Ponti"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level Selection Tabs */}
      <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-2xl mb-4 border border-[#E8E2D9] shadow-sm">
        <div className="flex gap-2">
          {HASHI_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => setLevelIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                levelIdx === idx
                  ? 'bg-[#1E4332] text-white shadow-sm'
                  : 'bg-[#FAF8F5] text-[#5C6B73] hover:bg-[#F2ECE4]'
              }`}
            >
              Livello {lvl.id}: {lvl.name}
            </button>
          ))}
        </div>
        <button
          onClick={validateSolution}
          className="px-4 py-1.5 rounded-xl bg-[#1E4332] text-white font-bold text-xs hover:bg-[#163225] transition-all shadow-md flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" /> Verifica Rete
        </button>
      </div>

      {/* Hashi Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        {/* Main Interactive Hashi Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#E8E2D9] shadow-sm flex flex-col items-center justify-center relative min-h-[460px]">
          <div
            className="relative w-full max-w-[440px] aspect-square bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] p-4 select-none"
          >
            {/* SVG Bridges Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {bridges.map(b => {
                const islA = level.islands.find(i => i.id === b.fromId)!;
                const islB = level.islands.find(i => i.id === b.toId)!;

                const stepX = 100 / (level.cols - 1);
                const stepY = 100 / (level.rows - 1);

                const x1 = islA.c * stepX;
                const y1 = islA.r * stepY;
                const x2 = islB.c * stepX;
                const y2 = islB.r * stepY;

                if (b.count === 1) {
                  return (
                    <line
                      key={`${b.fromId}-${b.toId}`}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="#1E4332"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  );
                } else {
                  // Double bridge (parallel lines)
                  const offset = 4;
                  const isH = b.orientation === 'H';
                  return (
                    <g key={`${b.fromId}-${b.toId}`}>
                      <line
                        x1={isH ? `${x1}%` : `calc(${x1}% - ${offset}px)`}
                        y1={isH ? `calc(${y1}% - ${offset}px)` : `${y1}%`}
                        x2={isH ? `${x2}%` : `calc(${x2}% - ${offset}px)`}
                        y2={isH ? `calc(${y2}% - ${offset}px)` : `${y2}%`}
                        stroke="#1E4332"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <line
                        x1={isH ? `${x1}%` : `calc(${x1}% + ${offset}px)`}
                        y1={isH ? `calc(${y1}% + ${offset}px)` : `${y1}%`}
                        x2={isH ? `${x2}%` : `calc(${x2}% + ${offset}px)`}
                        y2={isH ? `calc(${y2}% + ${offset}px)` : `${y2}%`}
                        stroke="#1E4332"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                }
              })}
            </svg>

            {/* Islands rendered absolute on coordinate grid */}
            {level.islands.map(isl => {
              const currentBridges = islandBridgeCounts[isl.id] || 0;
              const isSatisfied = currentBridges === isl.required;
              const isOver = currentBridges > isl.required;
              const isSelected = selectedIslandId === isl.id;

              const stepX = 100 / (level.cols - 1);
              const stepY = 100 / (level.rows - 1);

              return (
                <div
                  key={isl.id}
                  onClick={() => handleIslandClick(isl)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 flex flex-col items-center justify-center font-bold text-sm cursor-pointer transition-all z-20 shadow-md select-none ${
                    isSelected
                      ? 'bg-[#1E4332] text-white border-[#1E4332] ring-4 ring-[#1E4332]/30 scale-110'
                      : isOver
                      ? 'bg-rose-50 text-rose-700 border-rose-500 ring-2 ring-rose-300 animate-bounce'
                      : isSatisfied
                      ? 'bg-[#E5F2EC] text-[#1E4332] border-[#1E4332]'
                      : 'bg-white text-[#1F2937] border-[#CBD5E1] hover:border-[#1E4332]'
                  }`}
                  style={{
                    left: `${isl.c * stepX}%`,
                    top: `${isl.r * stepY}%`
                  }}
                >
                  <span>{isl.required}</span>
                  <span className="text-[9px] font-normal leading-none opacity-70">
                    ({currentBridges})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions & Guidelines (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-[#E8E2D9] shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#1F2937] mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#8C5D19]" /> Regole dei Ponti Giapponesi
            </h2>
            <div className="space-y-2 text-xs text-[#5C6B73] leading-relaxed">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]">
                <strong>1. Come creare ponti:</strong> Clicca sulla prima isola, poi sulla seconda allineata orizzontalmente o verticalmente. Cliccando di nuovo aggiungi un secondo ponte parallelo o lo rimuovi.
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]">
                <strong>2. Numero di Ponti:</strong> Ogni cerchio deve avere un numero esatto di ponti pari alla cifra indicata.
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]">
                <strong>3. Rete Unica:</strong> Alla fine, tutte le isole devono essere collegate in una singola rete continua senza isole separate.
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]">
                <strong>4. Nessun Incrocio:</strong> I ponti non possono attraversare altre isole o incrociare altri ponti perpendicolari.
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#E5F2EC] text-[#1E4332] text-xs">
            💡 <strong>Strategia Deduttiva:</strong> Inizia dalle isole angolari con numero 4 (richiedono 2 ponti su entrambi i lati disponibili) o isole centrali con numero 6 o 8!
          </div>
        </div>
      </div>

      {/* Win Banner */}
      {isWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-[#E5F2EC] border-2 border-[#1E4332] text-[#1E4332] flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#1E4332]" />
            <div>
              <h3 className="text-base font-bold">Rete di Hashi Perfettamente Connessa!</h3>
              <p className="text-xs opacity-90">Tutte le isole soddisfatte e connesse in una singola componente in {formatTime(elapsedSeconds)}.</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (levelIdx < HASHI_LEVELS.length - 1) {
                setLevelIdx(l => l + 1);
              } else {
                onBack();
              }
            }}
            className="px-5 py-2 rounded-xl bg-[#1E4332] text-white font-bold text-xs hover:bg-[#163225] transition-all shadow-md"
          >
            {levelIdx < HASHI_LEVELS.length - 1 ? 'Livello Successivo' : 'Completa Sessione'}
          </button>
        </motion.div>
      )}
    </div>
  );
};
