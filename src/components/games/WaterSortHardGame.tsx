import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { CognitiveCategory } from '../../types';
import {
  ArrowLeft,
  RotateCcw,
  Undo2,
  Trophy,
  Flame,
  Lightbulb,
  Beaker,
  AlertTriangle,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface Props {
  onComplete: (score: number, accuracy: number, category: CognitiveCategory) => void;
  onBack: () => void;
}

interface TubeLayer {
  color: string;
  name: string;
  hidden?: boolean;
}

interface LevelConfig {
  id: number;
  name: string;
  difficulty: 'Difficile' | 'Estremo' | 'Grandmaster';
  tubeCapacity: number;
  tubes: TubeLayer[][];
}

const COLOR_MAP: Record<string, { bg: string; name: string }> = {
  R: { bg: '#EF4444', name: 'Rosso Scarlatto' },
  G: { bg: '#10B981', name: 'Verde Smeraldo' },
  B: { bg: '#3B82F6', name: 'Blu Cobalto' },
  Y: { bg: '#F59E0B', name: 'Giallo Ambra' },
  P: { bg: '#8B5CF6', name: 'Viola Neurale' },
  C: { bg: '#06B6D4', name: 'Ciano Criogenico' },
  O: { bg: '#F97316', name: 'Arancio Magma' },
  M: { bg: '#EC4899', name: 'Magenta Laser' },
};

const SORT_LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Distillazione a 7 Provette',
    difficulty: 'Difficile',
    tubeCapacity: 4,
    tubes: [
      [{ color: 'R', name: 'R' }, { color: 'B', name: 'B' }, { color: 'G', name: 'G' }, { color: 'Y', name: 'Y' }],
      [{ color: 'B', name: 'B' }, { color: 'G', name: 'G' }, { color: 'R', name: 'R' }, { color: 'P', name: 'P' }],
      [{ color: 'P', name: 'P' }, { color: 'Y', name: 'Y' }, { color: 'B', name: 'B' }, { color: 'R', name: 'R' }],
      [{ color: 'G', name: 'G' }, { color: 'P', name: 'P' }, { color: 'Y', name: 'Y' }, { color: 'G', name: 'G' }],
      [{ color: 'Y', name: 'Y' }, { color: 'R', name: 'R' }, { color: 'P', name: 'P' }, { color: 'B', name: 'B' }],
      [], // empty buffer
      [], // empty buffer
    ]
  },
  {
    id: 2,
    name: 'Strati Oscurati & Reagenti Incogniti',
    difficulty: 'Estremo',
    tubeCapacity: 4,
    tubes: [
      [{ color: 'R', name: 'R', hidden: true }, { color: 'C', name: 'C', hidden: true }, { color: 'B', name: 'B' }, { color: 'G', name: 'G' }],
      [{ color: 'G', name: 'G', hidden: true }, { color: 'Y', name: 'Y', hidden: true }, { color: 'P', name: 'P' }, { color: 'R', name: 'R' }],
      [{ color: 'B', name: 'B', hidden: true }, { color: 'O', name: 'O', hidden: true }, { color: 'C', name: 'C' }, { color: 'Y', name: 'Y' }],
      [{ color: 'P', name: 'P', hidden: true }, { color: 'R', name: 'R', hidden: true }, { color: 'O', name: 'O' }, { color: 'B', name: 'B' }],
      [{ color: 'C', name: 'C', hidden: true }, { color: 'G', name: 'G', hidden: true }, { color: 'Y', name: 'Y' }, { color: 'P', name: 'P' }],
      [{ color: 'O', name: 'O', hidden: true }, { color: 'B', name: 'B', hidden: true }, { color: 'R', name: 'R' }, { color: 'O', name: 'O' }],
      [],
      [],
    ]
  },
  {
    id: 3,
    name: 'Grandmaster 9 Provette & 7 Reagenti',
    difficulty: 'Grandmaster',
    tubeCapacity: 5,
    tubes: [
      [{ color: 'R', name: 'R' }, { color: 'G', name: 'G' }, { color: 'B', name: 'B' }, { color: 'Y', name: 'Y' }, { color: 'P', name: 'P' }],
      [{ color: 'C', name: 'C' }, { color: 'O', name: 'O' }, { color: 'R', name: 'R' }, { color: 'G', name: 'G' }, { color: 'B', name: 'B' }],
      [{ color: 'Y', name: 'Y' }, { color: 'P', name: 'P' }, { color: 'C', name: 'C' }, { color: 'O', name: 'O' }, { color: 'R', name: 'R' }],
      [{ color: 'G', name: 'G' }, { color: 'B', name: 'B' }, { color: 'Y', name: 'Y' }, { color: 'P', name: 'P' }, { color: 'C', name: 'C' }],
      [{ color: 'O', name: 'O' }, { color: 'R', name: 'R' }, { color: 'G', name: 'G' }, { color: 'B', name: 'B' }, { color: 'Y', name: 'Y' }],
      [{ color: 'P', name: 'P' }, { color: 'C', name: 'C' }, { color: 'O', name: 'O' }, { color: 'R', name: 'R' }, { color: 'G', name: 'G' }],
      [{ color: 'B', name: 'B' }, { color: 'Y', name: 'Y' }, { color: 'P', name: 'P' }, { color: 'C', name: 'C' }, { color: 'O', name: 'O' }],
      [],
      [],
    ]
  }
];

export const WaterSortHardGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = SORT_LEVELS[levelIdx];

  const [tubes, setTubes] = useState<TubeLayer[][]>([]);
  const [selectedTubeIdx, setSelectedTubeIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<TubeLayer[][][]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    // Deep clone initial tubes and uncover topmost elements if hidden
    const initial = level.tubes.map(t =>
      t.map((layer, idx) => ({
        ...layer,
        hidden: idx < t.length - 1 ? layer.hidden : false, // top layer is never hidden
      }))
    );
    setTubes(initial);
    setSelectedTubeIdx(null);
    setHistory([]);
    setMoves(0);
    setElapsedSeconds(0);
    setIsWon(false);
  }, [levelIdx]);

  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  // Check if entire puzzle is solved
  const checkVictory = (currentTubes: TubeLayer[][]) => {
    return currentTubes.every(tube => {
      if (tube.length === 0) return true;
      if (tube.length !== level.tubeCapacity) return false;
      const firstColor = tube[0].color;
      return tube.every(l => l.color === firstColor && !l.hidden);
    });
  };

  const handleTubeClick = (targetIdx: number) => {
    soundFx.playClick();

    if (selectedTubeIdx === null) {
      // Must select a non-empty tube
      if (tubes[targetIdx].length > 0) {
        setSelectedTubeIdx(targetIdx);
      }
    } else if (selectedTubeIdx === targetIdx) {
      // Deselect
      setSelectedTubeIdx(null);
    } else {
      // Attempt pour from selectedTubeIdx -> targetIdx
      const sourceTube = tubes[selectedTubeIdx];
      const targetTube = tubes[targetIdx];

      if (sourceTube.length === 0) {
        setSelectedTubeIdx(null);
        return;
      }

      const sourceTop = sourceTube[sourceTube.length - 1];

      // Check pour conditions
      const canPour =
        targetTube.length < level.tubeCapacity &&
        (targetTube.length === 0 || targetTube[targetTube.length - 1].color === sourceTop.color);

      if (canPour) {
        soundFx.playBubble();
        setHistory(prev => [...prev, tubes.map(t => t.map(l => ({ ...l })))]);

        setTubes(prev => {
          const next = prev.map(t => t.map(l => ({ ...l })));
          const src = next[selectedTubeIdx];
          const dest = next[targetIdx];

          // Move all contiguous top layers of the same color that fit
          const colorToMove = src[src.length - 1].color;
          let movedCount = 0;

          while (
            src.length > 0 &&
            src[src.length - 1].color === colorToMove &&
            dest.length < level.tubeCapacity
          ) {
            const popped = src.pop()!;
            dest.push({ ...popped, hidden: false });
            movedCount++;
          }

          // Reveal new topmost in source tube if hidden
          if (src.length > 0 && src[src.length - 1].hidden) {
            src[src.length - 1].hidden = false;
          }

          // Verify Win
          if (checkVictory(next) && !isWon) {
            soundFx.playSuccess();
            setIsWon(true);
            if (levelIdx === SORT_LEVELS.length - 1) {
              onComplete(3100, 100, 'logic');
            }
          }

          return next;
        });

        setMoves(m => m + 1);
      } else {
        soundFx.playError();
      }

      setSelectedTubeIdx(null);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    soundFx.playToggle();
    const prev = history[history.length - 1];
    setTubes(prev);
    setHistory(h => h.slice(0, -1));
    setMoves(m => Math.max(0, m - 1));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const r = secs % 60;
    return `${mins}:${r < 10 ? '0' : ''}${r}`;
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-6 bg-[#FAF7F2] text-[#2C3E50] overflow-y-auto rounded-3xl border border-[#E8E2D9] shadow-sm">
      {/* Top Header */}
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
                <Beaker className="w-5 h-5 text-[#8C5D19]" /> Smistamento Chimico Reagenti
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7F3847] text-white flex items-center gap-1">
                <Flame className="w-3 h-3" /> {level.difficulty}
              </span>
            </div>
            <p className="text-xs text-[#7F8C8D]">
              Separa i composti cromatici nelle rispettive provette con strati chimici puri
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-[#7F8C8D]">Mosse • Tempo</span>
            <div className="text-sm font-mono font-bold text-[#1E4332]">
              {moves}m • {formatTime(elapsedSeconds)}
            </div>
          </div>
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F2ECE4] text-[#5C6B73] transition-colors disabled:opacity-40 shadow-sm"
            title="Annulla Mossa"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const initial = level.tubes.map(t =>
                t.map((l, idx) => ({ ...l, hidden: idx < t.length - 1 ? l.hidden : false }))
              );
              setTubes(initial);
              setHistory([]);
              setMoves(0);
              setSelectedTubeIdx(null);
            }}
            className="p-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F2ECE4] text-[#5C6B73] transition-colors shadow-sm"
            title="Ricomincia Livello"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level Selection */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl mb-6 border border-[#E8E2D9] shadow-sm">
        {SORT_LEVELS.map((lvl, idx) => (
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

      {/* Chemical Tubes Display Rack */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E8E2D9] shadow-sm flex items-center justify-center min-h-[380px] mb-4">
        <div className="flex flex-wrap items-end justify-center gap-4 md:gap-6 max-w-4xl">
          {tubes.map((tube, tubeIdx) => {
            const isSelected = selectedTubeIdx === tubeIdx;
            const isComplete =
              tube.length === level.tubeCapacity &&
              tube.every(l => l.color === tube[0].color && !l.hidden);

            return (
              <div
                key={tubeIdx}
                onClick={() => handleTubeClick(tubeIdx)}
                className={`relative flex flex-col items-center cursor-pointer transition-all ${
                  isSelected ? '-translate-y-4' : 'hover:-translate-y-1'
                }`}
              >
                {/* Tube Top Rim */}
                <div
                  className={`w-14 h-3.5 rounded-t-full border-2 border-b-0 transition-colors ${
                    isSelected
                      ? 'border-[#1E4332] bg-[#E5F2EC]'
                      : isComplete
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-[#CBD5E1] bg-slate-100'
                  }`}
                />

                {/* Glass Tube Body */}
                <div
                  className={`w-14 rounded-b-3xl border-2 border-t-0 p-1 flex flex-col-reverse justify-start overflow-hidden relative shadow-md transition-all ${
                    isSelected
                      ? 'border-[#1E4332] ring-4 ring-[#1E4332]/20 shadow-lg'
                      : isComplete
                      ? 'border-emerald-500 ring-2 ring-emerald-300'
                      : 'border-[#CBD5E1] bg-white/70 backdrop-blur-xs'
                  }`}
                  style={{
                    height: `${level.tubeCapacity * 38 + 16}px`
                  }}
                >
                  {/* Liquid Layers */}
                  {tube.map((layer, layerIdx) => {
                    const colorData = COLOR_MAP[layer.color] || { bg: '#6B7280', name: 'Reagente' };
                    return (
                      <motion.div
                        key={layerIdx}
                        layout
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        className={`w-full rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-xs select-none relative ${
                          layerIdx === 0 ? 'rounded-b-2xl' : ''
                        }`}
                        style={{
                          height: '36px',
                          backgroundColor: layer.hidden ? '#475569' : colorData.bg,
                          marginBottom: '2px'
                        }}
                      >
                        {layer.hidden ? '?' : ''}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Tube Label Index */}
                <span className="text-[10px] font-mono text-[#7F8C8D] mt-2 font-bold">
                  {tubeIdx + 1}
                </span>
              </div>
            );
          })}
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
              <h3 className="text-base font-bold">Reagenti Chimici Perfettamente Purificati!</h3>
              <p className="text-xs opacity-90">Tutte le provette riempite con monocolore omogeneo in {formatTime(elapsedSeconds)} ({moves} travasi).</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (levelIdx < SORT_LEVELS.length - 1) {
                setLevelIdx(l => l + 1);
              } else {
                onBack();
              }
            }}
            className="px-5 py-2 rounded-xl bg-[#1E4332] text-white font-bold text-xs hover:bg-[#163225] transition-all shadow-md"
          >
            {levelIdx < SORT_LEVELS.length - 1 ? 'Livello Successivo' : 'Completa Sessione'}
          </button>
        </motion.div>
      )}
    </div>
  );
};
