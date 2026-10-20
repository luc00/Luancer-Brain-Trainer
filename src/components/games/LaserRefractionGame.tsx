import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { CognitiveCategory } from '../../types';
import {
  ArrowLeft,
  RotateCcw,
  Play,
  CheckCircle2,
  Trophy,
  Flame,
  Lightbulb,
  Sparkles,
  Zap,
  HelpCircle,
  Eye,
  Sliders
} from 'lucide-react';

interface Props {
  onComplete: (score: number, accuracy: number, category: CognitiveCategory) => void;
  onBack: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type PieceType = 'empty' | 'wall' | 'mirror_forward' | 'mirror_backward' | 'splitter_h' | 'splitter_v' | 'emitter' | 'receptor';

interface GridCell {
  r: number;
  c: number;
  type: PieceType;
  fixed?: boolean;
  color?: string; // e.g. '#EF4444' (red), '#10B981' (green), '#3B82F6' (blue), '#8B5CF6' (purple)
  emitterDir?: Direction;
  receptorActive?: boolean;
}

interface InventoryItem {
  type: 'mirror_forward' | 'mirror_backward' | 'splitter_h' | 'splitter_v';
  label: string;
  count: number;
  symbol: string;
}

interface LevelConfig {
  id: number;
  name: string;
  difficulty: 'Avanzato' | 'Difficile' | 'Estremo' | 'Grandmaster';
  rows: number;
  cols: number;
  description: string;
  initialGrid: GridCell[];
  inventory: InventoryItem[];
  receptors: { r: number; c: number; requiredColor: string }[];
}

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Rifrazione Fondamentale',
    difficulty: 'Avanzato',
    rows: 6,
    cols: 6,
    description: 'Guida il raggio rosso verso il ricevitore posizionando gli specchi a 45° con precisione.',
    initialGrid: [
      { r: 0, c: 1, type: 'emitter', color: '#EF4444', emitterDir: 'DOWN', fixed: true },
      { r: 5, c: 4, type: 'receptor', color: '#EF4444', fixed: true },
      { r: 2, c: 1, type: 'wall', fixed: true },
      { r: 3, c: 3, type: 'wall', fixed: true },
    ],
    inventory: [
      { type: 'mirror_forward', label: 'Specchio [/]', count: 2, symbol: '╱' },
      { type: 'mirror_backward', label: 'Specchio [\\]', count: 2, symbol: '╲' },
    ],
    receptors: [{ r: 5, c: 4, requiredColor: '#EF4444' }]
  },
  {
    id: 2,
    name: 'Biforcazione del Fotone',
    difficulty: 'Difficile',
    rows: 6,
    cols: 6,
    description: 'Usa lo sdoppiatore di fascio (Splitter) per illuminare contemporaneamente due ricevitori con un unico laser.',
    initialGrid: [
      { r: 0, c: 2, type: 'emitter', color: '#10B981', emitterDir: 'DOWN', fixed: true },
      { r: 3, c: 0, type: 'receptor', color: '#10B981', fixed: true },
      { r: 3, c: 5, type: 'receptor', color: '#10B981', fixed: true },
      { r: 2, c: 2, type: 'splitter_h', fixed: false },
      { r: 1, c: 1, type: 'wall', fixed: true },
      { r: 4, c: 4, type: 'wall', fixed: true },
    ],
    inventory: [
      { type: 'mirror_forward', label: 'Specchio [/]', count: 2, symbol: '╱' },
      { type: 'mirror_backward', label: 'Specchio [\\]', count: 2, symbol: '╲' },
      { type: 'splitter_h', label: 'Divisore Orizzontale', count: 1, symbol: '─┼─' },
    ],
    receptors: [
      { r: 3, c: 0, requiredColor: '#10B981' },
      { r: 3, c: 5, requiredColor: '#10B981' }
    ]
  },
  {
    id: 3,
    name: 'Matrice Quantica a 3 Bersagli',
    difficulty: 'Estremo',
    rows: 7,
    cols: 7,
    description: 'Doppio emettitore (Rosso e Blu) e tre recettori da attivare tra barriere riflettenti.',
    initialGrid: [
      { r: 0, c: 1, type: 'emitter', color: '#EF4444', emitterDir: 'DOWN', fixed: true },
      { r: 6, c: 5, type: 'emitter', color: '#3B82F6', emitterDir: 'UP', fixed: true },
      { r: 3, c: 6, type: 'receptor', color: '#EF4444', fixed: true },
      { r: 0, c: 5, type: 'receptor', color: '#3B82F6', fixed: true },
      { r: 6, c: 1, type: 'receptor', color: '#EF4444', fixed: true },
      { r: 3, c: 3, type: 'wall', fixed: true },
      { r: 1, c: 4, type: 'wall', fixed: true },
      { r: 5, c: 2, type: 'wall', fixed: true },
    ],
    inventory: [
      { type: 'mirror_forward', label: 'Specchio [/]', count: 4, symbol: '╱' },
      { type: 'mirror_backward', label: 'Specchio [\\]', count: 4, symbol: '╲' },
      { type: 'splitter_h', label: 'Divisore Orizzontale', count: 1, symbol: '─┼─' },
      { type: 'splitter_v', label: 'Divisore Verticale', count: 1, symbol: '│┼│' },
    ],
    receptors: [
      { r: 3, c: 6, requiredColor: '#EF4444' },
      { r: 0, c: 5, requiredColor: '#3B82F6' },
      { r: 6, c: 1, requiredColor: '#EF4444' }
    ]
  },
  {
    id: 4,
    name: 'Grandmaster Laser Labyrinth',
    difficulty: 'Grandmaster',
    rows: 8,
    cols: 8,
    description: 'La sfida ottica definitiva: 4 ricevitori sincronizzati e una rete complessa di riflessioni multiple a cascata.',
    initialGrid: [
      { r: 0, c: 3, type: 'emitter', color: '#8B5CF6', emitterDir: 'DOWN', fixed: true },
      { r: 7, c: 0, type: 'receptor', color: '#8B5CF6', fixed: true },
      { r: 7, c: 7, type: 'receptor', color: '#8B5CF6', fixed: true },
      { r: 2, c: 0, type: 'receptor', color: '#8B5CF6', fixed: true },
      { r: 2, c: 7, type: 'receptor', color: '#8B5CF6', fixed: true },
      { r: 1, c: 3, type: 'wall', fixed: true },
      { r: 3, c: 3, type: 'wall', fixed: true },
      { r: 4, c: 4, type: 'wall', fixed: true },
      { r: 5, c: 2, type: 'wall', fixed: true },
    ],
    inventory: [
      { type: 'mirror_forward', label: 'Specchio [/]', count: 5, symbol: '╱' },
      { type: 'mirror_backward', label: 'Specchio [\\]', count: 5, symbol: '╲' },
      { type: 'splitter_h', label: 'Divisore Orizzontale', count: 2, symbol: '─┼─' },
      { type: 'splitter_v', label: 'Divisore Verticale', count: 2, symbol: '│┼│' },
    ],
    receptors: [
      { r: 7, c: 0, requiredColor: '#8B5CF6' },
      { r: 7, c: 7, requiredColor: '#8B5CF6' },
      { r: 2, c: 0, requiredColor: '#8B5CF6' },
      { r: 2, c: 7, requiredColor: '#8B5CF6' }
    ]
  }
];

interface LaserSegment {
  fromR: number;
  fromC: number;
  toR: number;
  toC: number;
  color: string;
}

export const LaserRefractionGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const level = LEVELS[currentLevelIdx];

  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeReceptors, setActiveReceptors] = useState<Record<string, boolean>>({});
  const [laserBeams, setLaserBeams] = useState<LaserSegment[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Initialize level grid
  useEffect(() => {
    const newGrid: GridCell[][] = [];
    for (let r = 0; r < level.rows; r++) {
      const row: GridCell[] = [];
      for (let c = 0; c < level.cols; c++) {
        row.push({ r, c, type: 'empty' });
      }
      newGrid.push(row);
    }

    // Place initial fixed elements
    level.initialGrid.forEach(item => {
      newGrid[item.r][item.c] = { ...item };
    });

    setGrid(newGrid);
    setInventory(level.inventory.map(i => ({ ...i })));
    setSelectedTool(level.inventory[0]?.type || null);
    setIsWon(false);
    setMoves(0);
    setElapsedSeconds(0);
    setActiveReceptors({});
  }, [currentLevelIdx]);

  // Timer
  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  // Raytracing Engine
  useEffect(() => {
    if (grid.length === 0) return;

    const segments: LaserSegment[] = [];
    const hitReceptors: Record<string, boolean> = {};

    // Find all emitters
    const emitters: { r: number; c: number; dir: Direction; color: string }[] = [];
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.type === 'emitter' && cell.emitterDir && cell.color) {
          emitters.push({
            r: cell.r,
            c: cell.c,
            dir: cell.emitterDir,
            color: cell.color,
          });
        }
      });
    });

    // Queue of ray pulses: { r, c, dir, color, steps }
    interface Ray {
      r: number;
      c: number;
      dir: Direction;
      color: string;
      steps: number;
    }

    const queue: Ray[] = emitters.map(e => ({
      r: e.r,
      c: e.c,
      dir: e.dir,
      color: e.color,
      steps: 0,
    }));

    const maxSteps = 50;

    while (queue.length > 0) {
      const ray = queue.shift()!;
      if (ray.steps > maxSteps) continue;

      let nextR = ray.r;
      let nextC = ray.c;

      if (ray.dir === 'UP') nextR--;
      else if (ray.dir === 'DOWN') nextR++;
      else if (ray.dir === 'LEFT') nextC--;
      else if (ray.dir === 'RIGHT') nextC++;

      // Check boundary
      if (nextR < 0 || nextR >= level.rows || nextC < 0 || nextC >= level.cols) {
        // Beam leaves grid
        segments.push({
          fromR: ray.r,
          fromC: ray.c,
          toR: nextR,
          toC: nextC,
          color: ray.color,
        });
        continue;
      }

      segments.push({
        fromR: ray.r,
        fromC: ray.c,
        toR: nextR,
        toC: nextC,
        color: ray.color,
      });

      const targetCell = grid[nextR][nextC];

      // Handle element collisions
      if (targetCell.type === 'wall') {
        // Beam stops
        continue;
      } else if (targetCell.type === 'receptor') {
        // Beam triggers receptor
        hitReceptors[`${nextR},${nextC}`] = true;
        continue;
      } else if (targetCell.type === 'mirror_forward') {
        // '/' mirror reflections
        let newDir: Direction | null = null;
        if (ray.dir === 'UP') newDir = 'RIGHT';
        else if (ray.dir === 'RIGHT') newDir = 'UP';
        else if (ray.dir === 'DOWN') newDir = 'LEFT';
        else if (ray.dir === 'LEFT') newDir = 'DOWN';

        if (newDir) {
          queue.push({ r: nextR, c: nextC, dir: newDir, color: ray.color, steps: ray.steps + 1 });
        }
      } else if (targetCell.type === 'mirror_backward') {
        // '\' mirror reflections
        let newDir: Direction | null = null;
        if (ray.dir === 'UP') newDir = 'LEFT';
        else if (ray.dir === 'LEFT') newDir = 'UP';
        else if (ray.dir === 'DOWN') newDir = 'RIGHT';
        else if (ray.dir === 'RIGHT') newDir = 'DOWN';

        if (newDir) {
          queue.push({ r: nextR, c: nextC, dir: newDir, color: ray.color, steps: ray.steps + 1 });
        }
      } else if (targetCell.type === 'splitter_h') {
        // Splits incoming ray horizontally
        if (ray.dir === 'DOWN' || ray.dir === 'UP') {
          queue.push({ r: nextR, c: nextC, dir: 'LEFT', color: ray.color, steps: ray.steps + 1 });
          queue.push({ r: nextR, c: nextC, dir: 'RIGHT', color: ray.color, steps: ray.steps + 1 });
        } else {
          // Passes through along horizontal
          queue.push({ r: nextR, c: nextC, dir: ray.dir, color: ray.color, steps: ray.steps + 1 });
        }
      } else if (targetCell.type === 'splitter_v') {
        // Splits incoming ray vertically
        if (ray.dir === 'LEFT' || ray.dir === 'RIGHT') {
          queue.push({ r: nextR, c: nextC, dir: 'UP', color: ray.color, steps: ray.steps + 1 });
          queue.push({ r: nextR, c: nextC, dir: 'DOWN', color: ray.color, steps: ray.steps + 1 });
        } else {
          // Passes through along vertical
          queue.push({ r: nextR, c: nextC, dir: ray.dir, color: ray.color, steps: ray.steps + 1 });
        }
      } else {
        // Empty cell, continue straight
        queue.push({ r: nextR, c: nextC, dir: ray.dir, color: ray.color, steps: ray.steps + 1 });
      }
    }

    setLaserBeams(segments);
    setActiveReceptors(hitReceptors);

    // Check victory: all level receptors active
    const allActive = level.receptors.every(rec => hitReceptors[`${rec.r},${rec.c}`]);
    if (allActive && level.receptors.length > 0 && !isWon) {
      soundFx.playSuccess();
      setIsWon(true);
      if (currentLevelIdx === LEVELS.length - 1) {
        onComplete(2800, 100, 'logic');
      }
    }
  }, [grid, level]);

  const handleCellClick = (r: number, c: number) => {
    const cell = grid[r][c];
    if (cell.fixed) return;

    soundFx.playClick();
    setMoves(m => m + 1);

    setGrid(prev => {
      const next = prev.map(row => row.map(cell => ({ ...cell })));
      const target = next[r][c];

      if (target.type !== 'empty') {
        // Return item to inventory
        setInventory(inv =>
          inv.map(i => (i.type === target.type ? { ...i, count: i.count + 1 } : i))
        );
        target.type = 'empty';
      } else if (selectedTool) {
        // Place selected tool if count > 0
        const invItem = inventory.find(i => i.type === selectedTool);
        if (invItem && invItem.count > 0) {
          target.type = selectedTool as PieceType;
          setInventory(inv =>
            inv.map(i => (i.type === selectedTool ? { ...i, count: i.count - 1 } : i))
          );
        }
      }
      return next;
    });
  };

  const handleReset = () => {
    soundFx.playToggle();
    const newGrid: GridCell[][] = [];
    for (let r = 0; r < level.rows; r++) {
      const row: GridCell[] = [];
      for (let c = 0; c < level.cols; c++) {
        row.push({ r, c, type: 'empty' });
      }
      newGrid.push(row);
    }
    level.initialGrid.forEach(item => {
      newGrid[item.r][item.c] = { ...item };
    });
    setGrid(newGrid);
    setInventory(level.inventory.map(i => ({ ...i })));
    setIsWon(false);
    setMoves(0);
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(idx => idx + 1);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const r = secs % 60;
    return `${mins}:${r < 10 ? '0' : ''}${r}`;
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-6 bg-[#0F172A] text-[#E2E8F0] overflow-y-auto rounded-3xl border border-[#1E293B] shadow-2xl">
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
                <Zap className="w-5 h-5 text-[#38BDF8]" /> Quantum Laser Labyrinth
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7F3847] text-white flex items-center gap-1">
                <Flame className="w-3 h-3" /> {level.difficulty}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Rifrazione ottica 2D e calcolo vettoriale del fotone in tempo reale
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-[#94A3B8]">Tempo / Mosse</span>
            <div className="text-sm font-mono font-bold text-[#38BDF8]">
              {formatTime(elapsedSeconds)} • {moves}m
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#1E293B] border border-[#334155] hover:bg-[#334155] text-[#94A3B8] transition-colors"
            title="Resetta Livello"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="flex items-center justify-between gap-2 bg-[#1E293B] p-2 rounded-2xl mb-4 border border-[#334155]">
        <div className="flex gap-2 overflow-x-auto">
          {LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => setCurrentLevelIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                currentLevelIdx === idx
                  ? 'bg-[#38BDF8] text-[#0F172A] shadow-md'
                  : 'bg-[#0F172A] text-[#94A3B8] hover:text-white'
              }`}
            >
              <span>Lv.{lvl.id}</span>
              <span className="hidden sm:inline">{lvl.name}</span>
            </button>
          ))}
        </div>
        <span className="text-xs text-[#38BDF8] font-mono shrink-0 pr-2">
          Ricevitori: {Object.values(activeReceptors).filter(Boolean).length}/{level.receptors.length}
        </span>
      </div>

      {/* Main Board & Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        {/* Optical Matrix Canvas & Cells (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B1120] rounded-2xl p-4 border border-[#334155] shadow-inner flex flex-col items-center justify-center relative min-h-[420px]">
          {/* Laser SVG Overlay for sharp photon beam rendering */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {laserBeams.map((b, idx) => {
              // Convert grid coords to percentage offsets
              const cellWidth = 100 / level.cols;
              const cellHeight = 100 / level.rows;
              const x1 = (b.fromC + 0.5) * cellWidth;
              const y1 = (b.fromR + 0.5) * cellHeight;
              const x2 = (b.toC + 0.5) * cellWidth;
              const y2 = (b.toR + 0.5) * cellHeight;

              return (
                <g key={idx}>
                  {/* Beam glow */}
                  <line
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={b.color}
                    strokeWidth="8"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                  />
                  {/* Core sharp beam */}
                  <line
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {/* Grid Cells */}
          <div
            className="grid gap-1.5 w-full max-w-[420px] aspect-square relative z-20"
            style={{
              gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${level.rows}, minmax(0, 1fr))`
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isReceptorActive = activeReceptors[`${r},${c}`];
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`rounded-xl border flex items-center justify-center cursor-pointer transition-all relative overflow-hidden select-none ${
                      cell.type === 'wall'
                        ? 'bg-[#1E293B] border-[#475569] shadow-inner'
                        : cell.type === 'emitter'
                        ? 'bg-[#0F172A] border-[#38BDF8] shadow-lg ring-2 ring-[#38BDF8]/40'
                        : cell.type === 'receptor'
                        ? isReceptorActive
                          ? 'bg-[#052E16] border-[#22C55E] ring-4 ring-[#22C55E]/60 animate-pulse'
                          : 'bg-[#1E293B] border-[#64748B]'
                        : cell.type !== 'empty'
                        ? 'bg-[#1E293B] border-[#38BDF8] hover:border-white shadow-md'
                        : 'bg-[#0F172A]/70 border-[#1E293B] hover:border-[#475569]'
                    }`}
                  >
                    {/* Visual Cell Icon Content */}
                    {cell.type === 'emitter' && (
                      <div className="flex flex-col items-center">
                        <Zap className="w-5 h-5" style={{ color: cell.color }} />
                        <span className="text-[9px] font-mono text-white/80">{cell.emitterDir}</span>
                      </div>
                    )}

                    {cell.type === 'receptor' && (
                      <div className="flex flex-col items-center">
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor: cell.color,
                            backgroundColor: isReceptorActive ? cell.color : 'transparent'
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>
                      </div>
                    )}

                    {cell.type === 'wall' && (
                      <div className="w-full h-full flex items-center justify-center opacity-30 text-xs font-mono">
                        ██
                      </div>
                    )}

                    {cell.type === 'mirror_forward' && (
                      <span className="text-xl font-bold text-[#38BDF8] font-mono select-none">╱</span>
                    )}

                    {cell.type === 'mirror_backward' && (
                      <span className="text-xl font-bold text-[#38BDF8] font-mono select-none">╲</span>
                    )}

                    {cell.type === 'splitter_h' && (
                      <span className="text-sm font-bold text-[#A855F7] font-mono select-none">─┼─</span>
                    )}

                    {cell.type === 'splitter_v' && (
                      <span className="text-sm font-bold text-[#A855F7] font-mono select-none">│┼│</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Inventory & Optical Toolkit (4 cols) */}
        <div className="lg:col-span-4 bg-[#1E293B] rounded-2xl p-4 border border-[#334155] shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#38BDF8]" /> Componenti Ottici Disponibili
            </h2>
            <p className="text-xs text-[#94A3B8] mb-4">
              Seleziona uno specchio o divisore e clicca su una casella libera per posizionarlo. Clicca su un elemento per rimuoverlo.
            </p>

            <div className="space-y-2">
              {inventory.map(item => {
                const isSelected = selectedTool === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedTool(item.type);
                    }}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-[#0F172A] border-[#38BDF8] shadow-md ring-2 ring-[#38BDF8]/40'
                        : 'bg-[#0F172A]/50 border-[#334155] hover:border-[#64748B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center font-mono font-bold text-base text-[#38BDF8]">
                        {item.symbol}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white">{item.label}</div>
                        <div className="text-[10px] text-[#94A3B8]">Riflessione angolare 45°</div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-bold ${
                        item.count > 0 ? 'bg-[#38BDF8]/20 text-[#38BDF8]' : 'bg-red-950/40 text-red-400'
                      }`}
                    >
                      x{item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Objectives Card */}
          <div className="mt-4 p-3 bg-[#0F172A] rounded-xl border border-[#334155]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8] block mb-1">
              Obiettivo Livello {level.id}:
            </span>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              {level.description}
            </p>
          </div>
        </div>
      </div>

      {/* Win Banner / Next Level */}
      {isWon && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl p-4 text-center shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ricevitori Ottici Sincronizzati!</h3>
              <p className="text-xs text-emerald-200">
                Fascio collimato in {formatTime(elapsedSeconds)} con {moves} manipolazioni.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {currentLevelIdx < LEVELS.length - 1 ? (
              <button
                onClick={handleNextLevel}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all shadow-md"
              >
                Prossimo Livello ({currentLevelIdx + 2}/{LEVELS.length})
              </button>
            ) : (
              <button
                onClick={onBack}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all shadow-md"
              >
                Completa & Registra Punteggio
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
