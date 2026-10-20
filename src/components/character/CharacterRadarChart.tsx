import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { UserProfile, CharacterTraits, TraitSnapshot } from '../../types';
import { 
  Flame, 
  Scale, 
  Compass, 
  Shield, 
  HeartPulse, 
  MessageSquare, 
  Sparkles, 
  Smile, 
  TrendingUp, 
  Layers, 
  Clock, 
  Info, 
  ChevronRight,
  Award,
  Activity
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  className?: string;
  onOpenModule?: (moduleKey: string) => void;
}

interface TraitConfig {
  key: keyof CharacterTraits;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  strokeColor: string;
  areaColor: string;
  neuroDescription: string;
  growthAdvice: string;
  recommendedModule: string;
}

const TRAIT_CONFIGS_5: TraitConfig[] = [
  {
    key: 'resilience',
    label: 'Resilienza & Antifragilità',
    shortLabel: 'Resilienza',
    icon: Flame,
    color: '#D97706',
    strokeColor: '#F59E0B',
    areaColor: 'rgba(245, 158, 11, 0.25)',
    neuroDescription: 'Capacità di recupero rapido del cortisolo e neuroplasticità sotto avversità.',
    growthAdvice: 'Affronta le Sfide Quotidiane della Comfort Zone per rafforzare la tolleranza al disagio.',
    recommendedModule: 'real-challenges',
  },
  {
    key: 'temperance',
    label: 'Autocontrollo & Disciplina',
    shortLabel: 'Autocontrollo',
    icon: Scale,
    color: '#059669',
    strokeColor: '#10B981',
    areaColor: 'rgba(16, 185, 129, 0.25)',
    neuroDescription: 'Controllo top-down della corteccia prefrontale dorsolaterale sugli impulsi subcorticali.',
    growthAdvice: 'Pratica la Respirazione Vago-Frenica e sessioni di Deep Work senza distrazioni.',
    recommendedModule: 'breathing',
  },
  {
    key: 'wisdom',
    label: 'Lucidità & Saggezza',
    shortLabel: 'Saggezza',
    icon: Compass,
    color: '#2563EB',
    strokeColor: '#3B82F6',
    areaColor: 'rgba(59, 130, 246, 0.25)',
    neuroDescription: 'Pensiero sistemico, modelli mentali e debiasing cognitivo nei momenti critici.',
    growthAdvice: 'Esplora i Modelli Mentali di Primo e Secondo Ordine nella Palestra Filosofica.',
    recommendedModule: 'mental-models',
  },
  {
    key: 'courage',
    label: 'Coraggio & Assertività',
    shortLabel: 'Coraggio',
    icon: Shield,
    color: '#DC2626',
    strokeColor: '#EF4444',
    areaColor: 'rgba(239, 68, 68, 0.25)',
    neuroDescription: 'Attivazione della corteccia cingolata anteriore per agire nonostante l\'allerta amigdaloidea.',
    growthAdvice: 'Mettiti alla prova con i Dilemmi Etici e l\'Assertività nei conflitti relazionali.',
    recommendedModule: 'dilemma',
  },
  {
    key: 'emotionalMastery',
    label: 'Padronanza Emotiva & Calma',
    shortLabel: 'Calma Emotiva',
    icon: HeartPulse,
    color: '#7C3AED',
    strokeColor: '#8B5CF6',
    areaColor: 'rgba(139, 92, 246, 0.25)',
    neuroDescription: 'Tono vagale elevato e modulazione dell\'amigdala attraverso l\'etichettamento affettivo.',
    growthAdvice: 'Compila il Diario Stoico Serale ed esegui il protocollo di Coerenza Cardiaca.',
    recommendedModule: 'journal',
  },
];

const TRAIT_CONFIGS_8: TraitConfig[] = [
  ...TRAIT_CONFIGS_5,
  {
    key: 'communication',
    label: 'Empatia & Comunicazione',
    shortLabel: 'Empatia',
    icon: MessageSquare,
    color: '#0891B2',
    strokeColor: '#06B6D4',
    areaColor: 'rgba(6, 182, 212, 0.25)',
    neuroDescription: 'Sintonizzazione neuroni specchio e teoria della mente nelle interazioni complesse.',
    growthAdvice: 'Allena la comunicazione non violenta e l\'ascolto attivo negli scenari dedicati.',
    recommendedModule: 'communication',
  },
  {
    key: 'selfEsteem',
    label: 'Autostima & Sicurezza',
    shortLabel: 'Autostima',
    icon: Sparkles,
    color: '#D97706',
    strokeColor: '#F59E0B',
    areaColor: 'rgba(245, 158, 11, 0.25)',
    neuroDescription: 'Sicurezza interna de-ancorata dal giudizio esterno, locus of control interno.',
    growthAdvice: 'Pratica l\'accettazione incondizionata nel Pilastro 12 dell\'Accademia.',
    recommendedModule: 'pillars',
  },
  {
    key: 'positivity',
    label: 'Psicologia Positiva & Altruismo',
    shortLabel: 'Altruismo',
    icon: Smile,
    color: '#16A34A',
    strokeColor: '#22C55E',
    areaColor: 'rgba(34, 197, 94, 0.25)',
    neuroDescription: 'Rilascio di ossitocina e rinforzo dei circuiti mesolimbici della cooperazione sociale.',
    growthAdvice: 'Completa atti di gentilezza proattiva e tieni traccia della gratitudine serale.',
    recommendedModule: 'pillars',
  },
];

export const CharacterRadarChart: React.FC<Props> = ({ profile, className = '', onOpenModule }) => {
  const [selectedTraitKey, setSelectedTraitKey] = useState<keyof CharacterTraits | null>(null);
  const [timeViewMode, setTimeViewMode] = useState<'comparison' | 'timeline'>('comparison');
  const [dimensionMode, setDimensionMode] = useState<'5' | '8'>('5');
  const [timelineIndex, setTimelineIndex] = useState<number>(0); // 0 = Oggi, 1 = 7d, 2 = 14d, 3 = baseline
  const [showBaselineOverlay, setShowBaselineOverlay] = useState<boolean>(true);

  const activeConfigs = dimensionMode === '5' ? TRAIT_CONFIGS_5 : TRAIT_CONFIGS_8;

  // History timeline extraction
  const historySnapshots: TraitSnapshot[] = useMemo(() => {
    const rawHistory = profile.traitsHistory || [];
    if (rawHistory.length >= 2) {
      return [...rawHistory].sort((a, b) => b.timestamp - a.timestamp);
    }
    // Fallback baseline history if fresh profile
    const currentTraits = profile.characterTraits;
    return [
      {
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        label: 'Stato Attuale (Oggi)',
        traits: currentTraits,
      },
      {
        date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
        timestamp: Date.now() - 86400000 * 7,
        label: '7 Giorni fa',
        traits: {
          resilience: Math.max(20, currentTraits.resilience - 6),
          temperance: Math.max(20, currentTraits.temperance - 5),
          wisdom: Math.max(20, currentTraits.wisdom - 4),
          courage: Math.max(20, currentTraits.courage - 5),
          emotionalMastery: Math.max(20, currentTraits.emotionalMastery - 5),
          communication: 62,
          selfEsteem: 64,
          mindset: 65,
          positivity: 63,
        },
      },
      {
        date: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
        timestamp: Date.now() - 86400000 * 14,
        label: '2 Settimane fa',
        traits: {
          resilience: Math.max(15, currentTraits.resilience - 11),
          temperance: Math.max(15, currentTraits.temperance - 10),
          wisdom: Math.max(15, currentTraits.wisdom - 9),
          courage: Math.max(15, currentTraits.courage - 10),
          emotionalMastery: Math.max(15, currentTraits.emotionalMastery - 11),
          communication: 56,
          selfEsteem: 58,
          mindset: 59,
          positivity: 57,
        },
      },
      {
        date: new Date(Date.now() - 86400000 * 28).toISOString().split('T')[0],
        timestamp: Date.now() - 86400000 * 28,
        label: 'Baseline Iniziale (30g fa)',
        traits: {
          resilience: Math.max(10, currentTraits.resilience - 18),
          temperance: Math.max(10, currentTraits.temperance - 16),
          wisdom: Math.max(10, currentTraits.wisdom - 15),
          courage: Math.max(10, currentTraits.courage - 17),
          emotionalMastery: Math.max(10, currentTraits.emotionalMastery - 19),
          communication: 48,
          selfEsteem: 50,
          mindset: 52,
          positivity: 50,
        },
      },
    ];
  }, [profile.traitsHistory, profile.characterTraits]);

  const currentSnapshot = historySnapshots[0] || { traits: profile.characterTraits, label: 'Oggi' };
  const baselineSnapshot = historySnapshots[historySnapshots.length - 1] || currentSnapshot;
  const activeTimelineSnapshot = historySnapshots[timelineIndex] || currentSnapshot;

  // Radar geometry calculations
  const size = 300;
  const center = size / 2;
  const radius = size * 0.38;
  const totalSides = activeConfigs.length;

  const getCoordinates = (value: number, index: number, maxRadius = radius) => {
    const angle = (Math.PI * 2 / totalSides) * index - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, value)) / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  const getPolygonPoints = (traitsData: CharacterTraits) => {
    return activeConfigs
      .map((cfg, i) => {
        const val = (traitsData[cfg.key] as number) ?? (profile.characterTraits[cfg.key] as number) ?? 60;
        const { x, y } = getCoordinates(val, i);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const currentPoints = useMemo(() => {
    const targetTraits = timeViewMode === 'timeline' ? activeTimelineSnapshot.traits : currentSnapshot.traits;
    return getPolygonPoints(targetTraits);
  }, [timeViewMode, activeTimelineSnapshot, currentSnapshot, activeConfigs]);

  const baselinePoints = useMemo(() => {
    return getPolygonPoints(baselineSnapshot.traits);
  }, [baselineSnapshot, activeConfigs]);

  // Harmony / balance score calculation
  const harmonyStats = useMemo(() => {
    const values = activeConfigs.map(c => ((profile.characterTraits[c.key] as number) ?? 60));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    // Lower standard deviation means higher harmony (0-100 scale)
    const harmonyScore = Math.max(40, Math.min(100, Math.round(100 - stdDev * 2.2)));
    
    // Overall growth from baseline
    const baselineValues = activeConfigs.map(c => ((baselineSnapshot.traits[c.key] as number) ?? 50));
    const baselineMean = baselineValues.reduce((a, b) => a + b, 0) / baselineValues.length;
    const totalGrowthDelta = Math.round(mean - baselineMean);

    // Archetype determination
    const highestTrait = [...activeConfigs].sort((a, b) => {
      const vA = (profile.characterTraits[a.key] as number) ?? 0;
      const vB = (profile.characterTraits[b.key] as number) ?? 0;
      return vB - vA;
    })[0];

    let archetype = 'Mente Armonica';
    if (highestTrait.key === 'resilience') archetype = 'Guerriero Antifragile';
    else if (highestTrait.key === 'wisdom') archetype = 'Filosofo Stratega';
    else if (highestTrait.key === 'temperance') archetype = 'Monaco della Disciplina';
    else if (highestTrait.key === 'courage') archetype = 'Leader d\'Azione';
    else if (highestTrait.key === 'emotionalMastery') archetype = 'Custode della Calma';
    else if (highestTrait.key === 'communication') archetype = 'Guida Empatica';

    return {
      mean: Math.round(mean),
      harmonyScore,
      totalGrowthDelta,
      archetype,
      highestTrait,
    };
  }, [profile.characterTraits, baselineSnapshot, activeConfigs]);

  const selectedConfig = activeConfigs.find(c => c.key === selectedTraitKey) || null;

  return (
    <div id="character-radar-chart-container" className={`bg-white border border-[#CBDDD2] rounded-3xl p-5 shadow-sm space-y-4 ${className}`}>
      
      {/* Header & Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5EFE9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#E5F2EC] text-[#1E4332]">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-[#14261D] uppercase tracking-wider font-display">
              Mappa Radiale delle Virtù & Progresso nel Tempo
            </h3>
          </div>
          <p className="text-xs text-[#597568] mt-0.5">
            Analisi poligonale multi-asse: osserva come la tua personalità si è espansa nel tempo.
          </p>
        </div>

        {/* 5 Core vs 8 Holistic Dimensions Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#EBF3EE] p-1 rounded-xl border border-[#CBDDD2]">
          <button
            onClick={() => {
              soundFx.playClick();
              setDimensionMode('5');
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              dimensionMode === '5'
                ? 'bg-[#1E4332] text-white shadow-2xs'
                : 'text-[#597568] hover:text-[#14261D]'
            }`}
          >
            5 Cardinali
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setDimensionMode('8');
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              dimensionMode === '8'
                ? 'bg-[#1E4332] text-white shadow-2xs'
                : 'text-[#597568] hover:text-[#14261D]'
            }`}
          >
            8 Olistiche
          </button>
        </div>
      </div>

      {/* Top Indicators: Archetipo & Crescita Globale */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-2xl bg-[#F6FAF7] border border-[#CBDDD2]/70">
          <span className="text-[10px] text-[#597568] uppercase font-bold tracking-wider block">Archetipo</span>
          <span className="text-xs font-bold text-[#1E4332] truncate block mt-0.5">
            {harmonyStats.archetype}
          </span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F6FAF7] border border-[#CBDDD2]/70">
          <span className="text-[10px] text-[#597568] uppercase font-bold tracking-wider block">Crescita Totale</span>
          <span className="text-xs font-bold text-emerald-600 font-mono flex items-center justify-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> +{harmonyStats.totalGrowthDelta}%
          </span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F6FAF7] border border-[#CBDDD2]/70">
          <span className="text-[10px] text-[#597568] uppercase font-bold tracking-wider block">Indice Armonia</span>
          <span className="text-xs font-bold text-[#8C5D19] font-mono block mt-0.5">
            {harmonyStats.harmonyScore}/100
          </span>
        </div>
      </div>

      {/* View Mode Bar: Confronto Sovrapposto vs Timeline Interattiva */}
      <div className="flex items-center justify-between bg-[#F4F9F6] p-1.5 rounded-2xl border border-[#CBDDD2]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              soundFx.playClick();
              setTimeViewMode('comparison');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              timeViewMode === 'comparison'
                ? 'bg-white text-[#1E4332] shadow-xs border border-[#CBDDD2]'
                : 'text-[#597568] hover:text-[#1E4332]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Confronto Sovrapposto
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setTimeViewMode('timeline');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              timeViewMode === 'timeline'
                ? 'bg-white text-[#1E4332] shadow-xs border border-[#CBDDD2]'
                : 'text-[#597568] hover:text-[#1E4332]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Timeline a Tappe
          </button>
        </div>

        {timeViewMode === 'comparison' && (
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-[#597568] cursor-pointer px-2">
            <input
              type="checkbox"
              checked={showBaselineOverlay}
              onChange={(e) => setShowBaselineOverlay(e.target.checked)}
              className="rounded text-[#1E4332] focus:ring-[#1E4332]"
            />
            <span>Mostra Baseline</span>
          </label>
        )}
      </div>

      {/* Timeline Steps (when Timeline mode active) */}
      {timeViewMode === 'timeline' && (
        <div className="space-y-1.5 bg-[#EBF3EE] p-2.5 rounded-2xl border border-[#CBDDD2]">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-[#597568] font-medium">Seleziona Tappa Temporale:</span>
            <span className="font-bold text-[#1E4332]">{activeTimelineSnapshot.label}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {historySnapshots.slice(0, 4).map((snap, idx) => (
              <button
                key={snap.date + idx}
                onClick={() => {
                  soundFx.playClick();
                  setTimelineIndex(idx);
                }}
                className={`py-1.5 px-2 rounded-xl text-center transition text-[11px] font-bold ${
                  timelineIndex === idx
                    ? 'bg-[#1E4332] text-white shadow-xs'
                    : 'bg-white text-[#597568] hover:text-[#14261D] border border-[#CBDDD2]'
                }`}
              >
                {idx === 0 ? 'Oggi' : idx === 1 ? '7g fa' : idx === 2 ? '14g fa' : 'Baseline'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SVG Spider / Radar Chart Stage */}
      <div className="relative flex justify-center items-center py-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[320px] aspect-square overflow-visible drop-shadow-xs"
        >
          <defs>
            {/* Gradient for Current Level Polygon */}
            <linearGradient id="currentPolygonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#1E4332" stopOpacity="0.40" />
            </linearGradient>

            {/* Gradient for Baseline Polygon */}
            <linearGradient id="baselinePolygonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0.12" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Concentric Radar Rings (20, 40, 60, 80, 100) */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, ringIdx) => {
            const ringPoints = activeConfigs
              .map((_, i) => {
                const { x, y } = getCoordinates(level * 100, i);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' ');
            return (
              <g key={`ring-${ringIdx}`}>
                <polygon
                  points={ringPoints}
                  fill={ringIdx % 2 === 0 ? '#F9FCFA' : '#F1F7F4'}
                  stroke="#CBDDD2"
                  strokeWidth={ringIdx === 4 ? '1.5' : '1'}
                  strokeDasharray={ringIdx === 4 ? 'none' : '2,2'}
                />
                {/* Scale Label */}
                <text
                  x={center + 3}
                  y={center - radius * level - 2}
                  fontSize="7"
                  fill="#7A9788"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {Math.round(level * 100)}%
                </text>
              </g>
            );
          })}

          {/* Radial Spokes from Center to Vertices */}
          {activeConfigs.map((cfg, i) => {
            const { x, y } = getCoordinates(100, i);
            const isSelected = selectedTraitKey === cfg.key;
            return (
              <line
                key={`spoke-${cfg.key}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={isSelected ? '#1E4332' : '#CBDDD2'}
                strokeWidth={isSelected ? '2' : '1'}
                strokeDasharray={isSelected ? 'none' : '1,2'}
              />
            );
          })}

          {/* Baseline Iniziale Polygon (When Overlay is on in comparison mode) */}
          {timeViewMode === 'comparison' && showBaselineOverlay && (
            <g>
              <polygon
                points={baselinePoints}
                fill="url(#baselinePolygonGrad)"
                stroke="#64748B"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                className="transition-all duration-700 ease-out"
              />
              {/* Baseline Vertices */}
              {activeConfigs.map((cfg, i) => {
                const val = (baselineSnapshot.traits[cfg.key] as number) ?? 50;
                const { x, y } = getCoordinates(val, i);
                return (
                  <circle
                    key={`baseline-dot-${cfg.key}`}
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill="#64748B"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          )}

          {/* Active / Current Polygon with smooth animated points */}
          <polygon
            points={currentPoints}
            fill="url(#currentPolygonGrad)"
            stroke="#10B981"
            strokeWidth="2.5"
            filter="url(#radarGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Active Trait Vertex Nodes */}
          {activeConfigs.map((cfg, i) => {
            const targetTraits = timeViewMode === 'timeline' ? activeTimelineSnapshot.traits : currentSnapshot.traits;
            const val = (targetTraits[cfg.key] as number) ?? (profile.characterTraits[cfg.key] as number) ?? 60;
            const { x, y } = getCoordinates(val, i);
            const isSelected = selectedTraitKey === cfg.key;

            return (
              <g
                key={`active-node-${cfg.key}`}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedTraitKey(selectedTraitKey === cfg.key ? null : cfg.key);
                }}
                className="cursor-pointer group"
              >
                {/* Pulsing ring on selected node */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="9"
                    fill="none"
                    stroke={cfg.strokeColor}
                    strokeWidth="1.5"
                    className="animate-ping opacity-60"
                  />
                )}
                {/* Node circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '6.5' : '4.5'}
                  fill={cfg.strokeColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all duration-200 group-hover:scale-125 shadow-sm"
                />
                {/* Mini score badge on vertex */}
                <text
                  x={x}
                  y={y - 7}
                  fontSize="8"
                  fontWeight="bold"
                  fill="#14261D"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Outer Vertex Labels with Trait Icons & Text */}
          {activeConfigs.map((cfg, i) => {
            const { x, y, angle } = getCoordinates(120, i);
            const isSelected = selectedTraitKey === cfg.key;
            
            // Optical offset calculation for text anchoring
            const isRight = Math.cos(angle) > 0.1;
            const isLeft = Math.cos(angle) < -0.1;
            const textAnchor = isRight ? 'start' : isLeft ? 'end' : 'middle';

            return (
              <g
                key={`label-${cfg.key}`}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedTraitKey(selectedTraitKey === cfg.key ? null : cfg.key);
                }}
                className="cursor-pointer group select-none"
              >
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fontSize={isSelected ? '10' : '9'}
                  fontWeight={isSelected ? '800' : '600'}
                  fill={isSelected ? '#1E4332' : '#335041'}
                  className="transition-all duration-200 group-hover:fill-[#1E4332]"
                >
                  {cfg.shortLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Legend Comparison */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-1 border-t border-[#E5EFE9]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-500 border border-emerald-600 shadow-2xs" />
          <span className="font-semibold text-[#14261D]">
            {timeViewMode === 'timeline' ? activeTimelineSnapshot.label : 'Stato Attuale (Oggi)'}
          </span>
        </div>
        {timeViewMode === 'comparison' && showBaselineOverlay && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-200 border border-dashed border-slate-500" />
            <span className="text-[#597568]">Baseline Iniziale (30g fa)</span>
          </div>
        )}
      </div>

      {/* Selected Trait Deep-Dive Card / Inspector */}
      <AnimatePresence mode="wait">
        {selectedConfig ? (
          <motion.div
            key={selectedConfig.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#F4F9F6] to-[#E9F4EE] border border-[#BBD5C6] space-y-2.5 relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: selectedConfig.color }}
                >
                  <selectedConfig.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#14261D]">{selectedConfig.label}</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-[#1E4332]">
                      Punteggio: {(profile.characterTraits[selectedConfig.key] as number) ?? 60}%
                    </span>
                    <span className="text-emerald-700 font-mono font-bold">
                      (+{Math.max(0, ((profile.characterTraits[selectedConfig.key] as number) ?? 60) - ((baselineSnapshot.traits[selectedConfig.key] as number) ?? 50))}% dalla baseline)
                    </span>
                  </div>
                </div>
              </div>

              {onOpenModule && (
                <button
                  onClick={() => {
                    soundFx.playSparkle();
                    onOpenModule(selectedConfig.recommendedModule);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#1E4332] text-white text-xs font-bold hover:bg-[#2B5340] transition flex items-center gap-1 shadow-xs active:scale-95"
                >
                  Allena <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs text-[#335041] space-y-1 bg-white/70 p-3 rounded-xl border border-[#CBDDD2]">
              <p>
                <strong className="text-[#14261D]">Basi Neuroscientifiche:</strong> {selectedConfig.neuroDescription}
              </p>
              <p>
                <strong className="text-[#14261D]">Guida di Crescita:</strong> {selectedConfig.growthAdvice}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="p-3 rounded-2xl bg-[#F6FAF7] border border-[#CBDDD2] text-center text-xs text-[#597568] flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#1E4332]" />
            <span>Tocca un vertice del radar per visualizzare dettagli neuroscientifici ed esercizi mirati.</span>
          </div>
        )}
      </AnimatePresence>

      {/* Scannable Trait Progression Grid with Bars */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-bold text-[#14261D] uppercase tracking-wider block">
          Evoluzione Dettagliata delle Singole Dimensioni
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activeConfigs.map((cfg) => {
            const currentVal = (profile.characterTraits[cfg.key] as number) ?? 60;
            const baseVal = (baselineSnapshot.traits[cfg.key] as number) ?? 50;
            const delta = currentVal - baseVal;
            const Icon = cfg.icon;

            return (
              <div
                key={`grid-trait-${cfg.key}`}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedTraitKey(selectedTraitKey === cfg.key ? null : cfg.key);
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedTraitKey === cfg.key
                    ? 'bg-[#E5F2EC] border-[#1E4332] shadow-xs'
                    : 'bg-[#F9FCFA] border-[#CBDDD2] hover:border-[#8EAD9B]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-[#243E31]">
                    <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                    {cfg.shortLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#122219]">{currentVal}%</span>
                    <span className={`text-[10px] font-mono font-bold ${delta >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {delta >= 0 ? `+${delta}%` : `${delta}%`}
                    </span>
                  </div>
                </div>

                {/* Progress bar with baseline marker */}
                <div className="relative h-2 w-full bg-[#E5EFE9] rounded-full overflow-hidden border border-[#CBDDD2]">
                  {/* Current fill */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentVal}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cfg.color }}
                  />
                  {/* Baseline pin */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-700 z-10"
                    style={{ left: `${baseVal}%` }}
                    title={`Baseline: ${baseVal}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
