import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { CognitiveCategory } from '../../types';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Trophy,
  Flame,
  Search,
  Eye,
  Check,
  X,
  Lightbulb,
  BookOpen
} from 'lucide-react';

interface Props {
  onComplete: (score: number, accuracy: number, category: CognitiveCategory) => void;
  onBack: () => void;
}

interface Clue {
  id: number;
  text: string;
  category: string;
}

interface RiddleScenario {
  id: string;
  title: string;
  difficulty: 'Difficile' | 'Estremo' | 'Grandmaster';
  intro: string;
  housesCount: number;
  categories: {
    key: string;
    label: string;
    options: string[];
  }[];
  clues: Clue[];
  solution: {
    house: number;
    color: string;
    nationality: string;
    drink: string;
    cigar: string;
    pet: string;
  }[];
  finalQuestion: {
    question: string;
    targetCategory: string;
    targetValue: string;
    correctAnswer: string;
  };
}

const SCENARIOS: RiddleScenario[] = [
  {
    id: 'einstein-classic',
    title: 'L\'Enigma delle 5 Case di Albert Einstein',
    difficulty: 'Grandmaster',
    intro: 'Attribuito ad Albert Einstein, questo celebre enigma afferma che solo il 2% delle persone al mondo può risolverlo a mente. Ci sono 5 case consecutive di colori diversi, abitate da 5 persone di diverse nazionalità, con animali, bevande e abitudini differenti. Chi possiede i PESCI?',
    housesCount: 5,
    categories: [
      { key: 'color', label: 'Colore Casa', options: ['Rossa', 'Verde', 'Bianca', 'Gialla', 'Blu'] },
      { key: 'nationality', label: 'Nazionalità', options: ['Inglese', 'Svedese', 'Danese', 'Norvegese', 'Tedesco'] },
      { key: 'drink', label: 'Bevanda', options: ['Tè', 'Caffè', 'Latte', 'Birra', 'Acqua'] },
      { key: 'cigar', label: 'Fumo / Hobby', options: ['Pall Mall', 'Dunhill', 'Blend', 'Blue Master', 'Prince'] },
      { key: 'pet', label: 'Animale', options: ['Cani', 'Uccelli', 'Gatti', 'Cavalli', 'Pesci'] },
    ],
    clues: [
      { id: 1, text: 'L\'Inglese vive nella casa Rossa.', category: 'Diretto' },
      { id: 2, text: 'Lo Svedese possiede dei Cani.', category: 'Diretto' },
      { id: 3, text: 'Il Danese beve Tè.', category: 'Diretto' },
      { id: 4, text: 'La casa Verde è immediatamente a sinistra della casa Bianca.', category: 'Posizionale' },
      { id: 5, text: 'L\'abitante della casa Verde beve Caffè.', category: 'Diretto' },
      { id: 6, text: 'La persona che fuma Pall Mall alleva Uccelli.', category: 'Diretto' },
      { id: 7, text: 'L\'abitante della casa Gialla fuma Dunhill.', category: 'Diretto' },
      { id: 8, text: 'L\'abitante della casa al centro (casa 3) beve Latte.', category: 'Posizionale' },
      { id: 9, text: 'Il Norvegese vive nella prima casa (casa 1).', category: 'Posizionale' },
      { id: 10, text: 'La persona che fuma Blend vive vicino a chi possiede Gatti.', category: 'Adiacente' },
      { id: 11, text: 'La persona che possiede Cavalli vive vicino a chi fuma Dunhill.', category: 'Adiacente' },
      { id: 12, text: 'Chi fuma Blue Master beve Birra.', category: 'Diretto' },
      { id: 13, text: 'Il Tedesco fuma sigari Prince.', category: 'Diretto' },
      { id: 14, text: 'Il Norvegese vive vicino alla casa Blu.', category: 'Adiacente' },
      { id: 15, text: 'Chi fuma Blend ha un vicino che beve Acqua.', category: 'Adiacente' },
    ],
    solution: [
      { house: 1, color: 'Gialla', nationality: 'Norvegese', drink: 'Acqua', cigar: 'Dunhill', pet: 'Gatti' },
      { house: 2, color: 'Blu', nationality: 'Danese', drink: 'Tè', cigar: 'Blend', pet: 'Cavalli' },
      { house: 3, color: 'Rossa', nationality: 'Inglese', drink: 'Latte', cigar: 'Pall Mall', pet: 'Uccelli' },
      { house: 4, color: 'Verde', nationality: 'Tedesco', drink: 'Caffè', cigar: 'Prince', pet: 'Pesci' },
      { house: 5, color: 'Bianca', nationality: 'Svedese', drink: 'Birra', cigar: 'Blue Master', pet: 'Cani' },
    ],
    finalQuestion: {
      question: 'In base a tutte le deduzioni logiche incrociate, CHI POSSIEDE I PESCI?',
      targetCategory: 'pet',
      targetValue: 'Pesci',
      correctAnswer: 'Tedesco',
    },
  },
  {
    id: 'cyber-security-protocol',
    title: 'Protocollo di Sicurezza Quantistica',
    difficulty: 'Estremo',
    intro: '5 Server quantistici (Nodi da 1 a 5) sono protetti da 5 algoritmi di crittografia, supervisionati da 5 scienziati, alimentati da 5 frequenze e alloggiati in 5 strutture termiche. Deduci la matrice per sventare l\'intrusione.',
    housesCount: 5,
    categories: [
      { key: 'color', label: 'Struttura', options: ['Titanio', 'Grafene', 'Obsidiana', 'Silicio', 'Bismuto'] },
      { key: 'nationality', label: 'Architetto', options: ['Ada', 'Alan', 'Claude', 'Grace', 'Linus'] },
      { key: 'drink', label: 'Crittografia', options: ['Lattice', 'Kyber', 'Dilithium', 'Shor-Proof', 'Falcon'] },
      { key: 'cigar', label: 'Frequenza', options: ['3.2 GHz', '5.8 GHz', '9.4 GHz', '12.6 GHz', '18.0 GHz'] },
      { key: 'pet', label: 'Raffreddamento', options: ['Elio Liquido', 'Azoto', 'Criogenico', 'Plasma', 'Laser'] },
    ],
    clues: [
      { id: 1, text: 'Ada gestisce il nodo protetto in Titanio.', category: 'Diretto' },
      { id: 2, text: 'Alan utilizza l\'algoritmo Dilithium.', category: 'Diretto' },
      { id: 3, text: 'Claude opera alla frequenza 5.8 GHz.', category: 'Diretto' },
      { id: 4, text: 'La struttura in Grafene è subito a sinistra della struttura in Bismuto.', category: 'Posizionale' },
      { id: 5, text: 'Il nodo in Grafene usa l\'algoritmo Lattice.', category: 'Diretto' },
      { id: 6, text: 'Chi usa la frequenza 3.2 GHz applica raffreddamento a Elio Liquido.', category: 'Diretto' },
      { id: 7, text: 'La struttura in Obsidiana opera a 9.4 GHz.', category: 'Diretto' },
      { id: 8, text: 'Il nodo centrale 3 usa raffreddamento Criogenico.', category: 'Posizionale' },
      { id: 9, text: 'Grace supervisiona il nodo 1.', category: 'Posizionale' },
      { id: 10, text: 'Chi opera a 12.6 GHz è vicino a chi usa raffreddamento al Plasma.', category: 'Adiacente' },
      { id: 11, text: 'Chi usa raffreddamento ad Azoto è adiacente al nodo a 9.4 GHz.', category: 'Adiacente' },
      { id: 12, text: 'L\'algoritmo Kyber opera con raffreddamento Laser.', category: 'Diretto' },
      { id: 13, text: 'Linus impiega l\'algoritmo Falcon.', category: 'Diretto' },
      { id: 14, text: 'Grace è vicina al nodo in Silicio.', category: 'Adiacente' },
      { id: 15, text: 'La frequenza 12.6 GHz è vicina all\'algoritmo Shor-Proof.', category: 'Adiacente' },
    ],
    solution: [
      { house: 1, color: 'Obsidiana', nationality: 'Grace', drink: 'Shor-Proof', cigar: '9.4 GHz', pet: 'Plasma' },
      { house: 2, color: 'Silicio', nationality: 'Claude', drink: 'Dilithium', cigar: '5.8 GHz', pet: 'Azoto' },
      { house: 3, color: 'Titanio', nationality: 'Ada', drink: 'Falcon', cigar: '3.2 GHz', pet: 'Elio Liquido' },
      { house: 4, color: 'Grafene', nationality: 'Linus', drink: 'Lattice', cigar: '18.0 GHz', pet: 'Criogenico' },
      { house: 5, color: 'Bismuto', nationality: 'Alan', drink: 'Kyber', cigar: '12.6 GHz', pet: 'Laser' },
    ],
    finalQuestion: {
      question: 'Quale scienziato supervisiona il sistema a raffreddamento LASER?',
      targetCategory: 'pet',
      targetValue: 'Laser',
      correctAnswer: 'Alan',
    },
  }
];

export const EinsteinRiddleGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const scenario = SCENARIOS[selectedScenarioIndex];

  // User assignments grid: house (1..5) -> categoryKey -> selected value
  const [grid, setGrid] = useState<Record<number, Record<string, string>>>({
    1: {}, 2: {}, 3: {}, 4: {}, 5: {}
  });

  const [checkedClues, setCheckedClues] = useState<Record<number, boolean>>({});
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>(scenario.categories[0].key);
  const [selectedHouseForCell, setSelectedHouseForCell] = useState<number>(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hintCount, setHintCount] = useState(3);
  const [activeHintText, setActiveHintText] = useState<string | null>(null);

  useEffect(() => {
    // Reset state on scenario change
    setGrid({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {} });
    setCheckedClues({});
    setSelectedAnswer('');
    setShowSolutionModal(false);
    setIsCompleted(false);
    setElapsedSeconds(0);
    setHintCount(3);
    setActiveHintText(null);
  }, [selectedScenarioIndex]);

  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const handleCellSelect = (house: number, categoryKey: string, value: string) => {
    soundFx.playClick();
    setGrid(prev => {
      const houseData = { ...(prev[house] || {}) };
      if (houseData[categoryKey] === value) {
        delete houseData[categoryKey]; // Toggle off
      } else {
        // Remove value from other houses for this category
        const next = { ...prev };
        for (let h = 1; h <= scenario.housesCount; h++) {
          if (next[h] && next[h][categoryKey] === value) {
            next[h] = { ...next[h] };
            delete next[h][categoryKey];
          }
        }
        houseData[categoryKey] = value;
        return { ...next, [house]: houseData };
      }
      return { ...prev, [house]: houseData };
    });
  };

  const toggleClue = (clueId: number) => {
    soundFx.playToggle();
    setCheckedClues(prev => ({ ...prev, [clueId]: !prev[clueId] }));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleApplyHint = () => {
    if (hintCount <= 0) return;
    soundFx.playSparkle();
    setHintCount(prev => prev - 1);

    // Find an unassigned or incorrectly assigned cell
    const emptyCells: { house: number; key: string; correctVal: string }[] = [];
    scenario.solution.forEach(sol => {
      scenario.categories.forEach(cat => {
        const currentVal = grid[sol.house]?.[cat.key];
        const correctVal = (sol as any)[cat.key];
        if (currentVal !== correctVal) {
          emptyCells.push({ house: sol.house, key: cat.key, correctVal });
        }
      });
    });

    if (emptyCells.length > 0) {
      const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      handleCellSelect(target.house, target.key, target.correctVal);
      setActiveHintText(`💡 Suggerimento Deduttivo: Nel Nodo/Casa ${target.house}, l'attributo ${target.key.toUpperCase()} è "${target.correctVal}".`);
    } else {
      setActiveHintText('Tutte le celle sono già correttamente posizionate! Rispondi alla domanda finale.');
    }
  };

  const verifySolution = () => {
    if (!selectedAnswer) {
      soundFx.playError();
      alert('Seleziona prima la risposta alla domanda finale!');
      return;
    }

    const isAnswerCorrect = selectedAnswer.trim().toLowerCase() === scenario.finalQuestion.correctAnswer.trim().toLowerCase();

    // Check full grid correctness
    let correctCells = 0;
    let totalCells = scenario.housesCount * scenario.categories.length;

    scenario.solution.forEach(sol => {
      scenario.categories.forEach(cat => {
        if (grid[sol.house]?.[cat.key] === (sol as any)[cat.key]) {
          correctCells++;
        }
      });
    });

    const accuracy = Math.round((correctCells / totalCells) * 100);

    if (isAnswerCorrect) {
      soundFx.playSuccess();
      setIsCompleted(true);
      const calculatedScore = Math.max(800, 3000 - elapsedSeconds * 4 + correctCells * 80);
      onComplete(calculatedScore, Math.max(accuracy, 90), 'logic');
    } else {
      soundFx.playError();
      alert(`Risposta finale non corretta. Hai abbinato ${correctCells}/${totalCells} attributi con esattezza. Rileggi gli indizi e riprova!`);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 md:p-6 bg-[#FDFBF7] text-[#2C3E50] overflow-y-auto">
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
              <h1 className="text-xl md:text-2xl font-bold font-serif text-[#1F2937]">
                {scenario.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7F3847] text-white flex items-center gap-1">
                <Flame className="w-3 h-3" /> {scenario.difficulty}
              </span>
            </div>
            <p className="text-xs text-[#7F8C8D]">
              Deduzione pura e vincoli incrociati di 2° ordine • Nessuna ipotesi a caso richiesta
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-[#7F8C8D]">Tempo</span>
            <div className="text-sm font-mono font-bold text-[#1E4332]">{formatTime(elapsedSeconds)}</div>
          </div>
          <button
            onClick={handleApplyHint}
            disabled={hintCount <= 0}
            className="px-3 py-1.5 rounded-xl bg-[#FBF2E3] border border-[#E0D0B8] text-[#8C5D19] hover:bg-[#F5E6CC] text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Lightbulb className="w-4 h-4 text-[#8C5D19]" />
            Hint ({hintCount})
          </button>
          <button
            onClick={() => setGrid({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {} })}
            className="p-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F2ECE4] text-[#5C6B73] transition-colors shadow-sm"
            title="Resetta Griglia"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Selector & Intro */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D9] mb-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">Seleziona Enigma:</span>
            {SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioIndex(idx)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedScenarioIndex === idx
                    ? 'bg-[#1E4332] text-white shadow-sm'
                    : 'bg-[#F2ECE4] text-[#5C6B73] hover:bg-[#E5DCD0]'
                }`}
              >
                {sc.title}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs md:text-sm text-[#4A5568] leading-relaxed">
          {scenario.intro}
        </p>
        {activeHintText && (
          <div className="mt-2 p-2.5 rounded-xl bg-[#FFF9E6] border border-[#FFE082] text-xs text-[#795548] flex items-center justify-between">
            <span>{activeHintText}</span>
            <button onClick={() => setActiveHintText(null)} className="text-[#9E9E9E] hover:text-black">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Grid + Clues Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        {/* Left Column: Interactive 5 Houses Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 border border-[#E8E2D9] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#1F2937] flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#1E4332]" /> Matrice delle Case & Assegnazione
              </h2>
              <span className="text-xs text-[#7F8C8D]">Clicca per assegnare/rimuovere</span>
            </div>

            {/* Visual House Columns */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(houseNum => (
                <div
                  key={houseNum}
                  className={`flex flex-col rounded-xl border p-2 text-center transition-all ${
                    selectedHouseForCell === houseNum
                      ? 'border-[#1E4332] bg-[#F2F7F4] shadow-sm'
                      : 'border-[#E8E2D9] bg-[#FAF8F5]'
                  }`}
                  onClick={() => setSelectedHouseForCell(houseNum)}
                >
                  <div className="text-xs font-bold text-[#1E4332] mb-1">
                    Casa {houseNum}
                  </div>
                  <div className="space-y-1 text-[11px]">
                    {scenario.categories.map(cat => {
                      const val = grid[houseNum]?.[cat.key];
                      return (
                        <div
                          key={cat.key}
                          className={`truncate rounded px-1 py-0.5 text-center ${
                            val
                              ? 'bg-white border border-[#D5E5DD] font-semibold text-[#1F2937]'
                              : 'text-[#A0AEC0] border border-dashed border-[#E2E8F0]'
                          }`}
                          title={`${cat.label}: ${val || 'Vuoto'}`}
                        >
                          {val || '-'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Category Option Assigning Board */}
            <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#E8E2D9]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#2C3E50]">
                  Assegna alla <span className="text-[#1E4332] underline">Casa {selectedHouseForCell}</span>:
                </span>
                {/* Category Pills */}
                <div className="flex gap-1 overflow-x-auto pb-1">
                  {scenario.categories.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategoryTab(cat.key)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                        activeCategoryTab === cat.key
                          ? 'bg-[#1E4332] text-white shadow-xs'
                          : 'bg-white text-[#5C6B73] border border-[#E8E2D9]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options for active category */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {scenario.categories
                  .find(c => c.key === activeCategoryTab)
                  ?.options.map(option => {
                    // Check which house currently has this option
                    let assignedHouse: number | null = null;
                    for (let h = 1; h <= scenario.housesCount; h++) {
                      if (grid[h]?.[activeCategoryTab] === option) {
                        assignedHouse = h;
                        break;
                      }
                    }
                    const isAssignedHere = assignedHouse === selectedHouseForCell;

                    return (
                      <button
                        key={option}
                        onClick={() => handleCellSelect(selectedHouseForCell, activeCategoryTab, option)}
                        className={`p-2 rounded-lg text-xs font-medium border text-center transition-all flex flex-col items-center justify-center ${
                          isAssignedHere
                            ? 'bg-[#1E4332] text-white border-[#1E4332] shadow-sm'
                            : assignedHouse
                            ? 'bg-[#EAEFF0] text-[#7F8C8D] border-[#D0D9DC] opacity-75'
                            : 'bg-white text-[#2C3E50] border-[#E8E2D9] hover:border-[#1E4332]'
                        }`}
                      >
                        <span className="truncate w-full">{option}</span>
                        {assignedHouse && !isAssignedHere && (
                          <span className="text-[9px] text-[#5C6B73]">Casa {assignedHouse}</span>
                        )}
                        {isAssignedHere && (
                          <span className="text-[9px] text-[#A3E635] font-bold">Assegnato</span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Quick House Selector Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D9] mt-3">
            <span className="text-xs text-[#7F8C8D]">Seleziona Casa Attiva:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(h => (
                <button
                  key={h}
                  onClick={() => setSelectedHouseForCell(h)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    selectedHouseForCell === h
                      ? 'bg-[#1E4332] text-white'
                      : 'bg-[#F2ECE4] text-[#5C6B73] hover:bg-[#E5DCD0]'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 15 Deductive Clues with Checklist (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-[#E8E2D9] shadow-sm flex flex-col h-[460px]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-[#1F2937] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#8C5D19]" /> 15 Indizi Logici
            </h2>
            <span className="text-xs font-medium text-[#7F8C8D]">
              {Object.values(checkedClues).filter(Boolean).length}/15 Spuntati
            </span>
          </div>
          <p className="text-[11px] text-[#7F8C8D] mb-2">
            Spunta gli indizi una volta soddisfatti o considerati.
          </p>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {scenario.clues.map(clue => {
              const isChecked = !!checkedClues[clue.id];
              return (
                <div
                  key={clue.id}
                  onClick={() => toggleClue(clue.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                    isChecked
                      ? 'bg-[#F9FAF9] border-[#D5E5DD] text-[#9E9E9E] line-through'
                      : 'bg-[#FAF8F5] border-[#E8E2D9] text-[#2C3E50] hover:border-[#1E4332]'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-[#1E4332] border-[#1E4332] text-white'
                        : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold mr-1.5 text-[10px] uppercase px-1 py-0.2 rounded bg-[#F0EBE1] text-[#6B7280]">
                      #{clue.id} {clue.category}
                    </span>
                    <span>{clue.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final Question Verification Bar */}
      <div className="bg-[#FAF6F0] rounded-2xl p-4 border-2 border-[#1E4332] shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-[#8C5D19]" />
              <h3 className="text-sm md:text-base font-bold text-[#1F2937]">
                {scenario.finalQuestion.question}
              </h3>
            </div>
            <p className="text-xs text-[#5C6B73]">
              Seleziona la risposta corretta tra le opzioni dedotte per completare il protocollo Einstein.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={selectedAnswer}
              onChange={e => setSelectedAnswer(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#1E4332] shadow-sm"
            >
              <option value="">-- Seleziona Risposta --</option>
              {scenario.categories[1].options.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <button
              onClick={verifySolution}
              className="px-5 py-2 rounded-xl bg-[#1E4332] text-white font-bold text-xs hover:bg-[#163225] transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" /> Verifica Risoluzione
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E8E2D9] shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#E5F2EC] text-[#1E4332] flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#1F2937] mb-2">
                Enigma di Einstein Decifrato!
              </h3>
              <p className="text-sm text-[#4A5568] mb-4">
                Hai completato la deduzione pura in <strong className="text-[#1E4332]">{formatTime(elapsedSeconds)}</strong>.
                La tua capacità di incrocio logico a vincoli multipli è eccezionale.
              </p>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] text-xs text-[#5C6B73] mb-5 text-left">
                <strong>Verità logica confermata:</strong> Nella Casa 4 (Verde), il <strong>Tedesco</strong> beve Caffè, fuma sigari Prince e alleva i <strong>Pesci</strong>.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onBack}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E4332] text-white font-bold text-sm hover:bg-[#163225] transition-all shadow-md"
                >
                  Torna all'Hub Giochi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
