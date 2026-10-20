import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { UserProfile, CharacterTraits, PsychologyPillar, PillarCategory } from '../../types';
import { PSYCHOLOGY_PILLARS_DATA } from '../../data/psychologyPillarsData';
import {
  Eye,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Flame,
  Compass,
  Brain,
  HeartHandshake,
  Gift,
  Anchor,
  Globe,
  Crown,
  BookOpen,
  Lightbulb,
  Moon,
  Target,
  Zap,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Search,
  Award,
  RotateCcw,
  Sliders,
  Play,
  Pause,
  Clock,
  Shield,
  Layers,
  ChevronRight,
  BookmarkCheck
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  initialPillarId?: string;
  onUpdateTraits: (delta: Partial<CharacterTraits>, xp: number) => void;
  onCompletePillarExercise?: (pillarId: string, xp: number) => void;
  onExit: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Eye,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Flame,
  Compass,
  Brain,
  HeartHandshake,
  Gift,
  Anchor,
  Globe,
  Crown,
  BookOpen,
  Lightbulb,
  Moon,
  Target,
  Zap,
};

export const PsychologyPillarsGym: React.FC<Props> = ({
  profile,
  initialPillarId,
  onUpdateTraits,
  onCompletePillarExercise,
  onExit,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<PsychologyPillar | null>(() => {
    if (initialPillarId) {
      return PSYCHOLOGY_PILLARS_DATA.find((p) => p.id === initialPillarId) || null;
    }
    return null;
  });

  const [activeCategory, setActiveCategory] = useState<PillarCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Exercise Execution State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepSelections, setStepSelections] = useState<Record<number, string>>({});
  const [stepSliders, setStepSliders] = useState<Record<number, number>>({ 1: 7, 2: 7, 3: 7 });
  const [stepReflections, setStepReflections] = useState<Record<number, string>>({});
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(15);
  const [isExerciseCompleted, setIsExerciseCompleted] = useState<boolean>(false);
  const [earnedXP, setEarnedXP] = useState<number>(0);

  // Breathing & Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      soundFx.playSuccess();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const categories: { id: PillarCategory | 'all'; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'Tutti i 18 Pilastri', icon: Layers },
    { id: 'mindset-awareness', label: 'Mente & Consapevolezza', icon: Brain },
    { id: 'emotion-stress-sleep', label: 'Emozioni, Stress & Sonno', icon: HeartPulse },
    { id: 'identity-confidence', label: 'Identità & Autostima', icon: Flame },
    { id: 'social-relationships', label: 'Relazioni & Altruismo', icon: HeartHandshake },
  ];

  const filteredPillars = PSYCHOLOGY_PILLARS_DATA.filter((pillar) => {
    const matchesCat = activeCategory === 'all' || pillar.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      pillar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pillar.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pillar.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const completedPillarsList = profile.completedPillarExercises || [];

  const handleStartExercise = (pillar: PsychologyPillar) => {
    soundFx.playClick();
    setSelectedPillar(pillar);
    setCurrentStepIndex(0);
    setStepSelections({});
    setStepSliders({ 1: 7, 2: 7, 3: 7 });
    setStepReflections({});
    setIsExerciseCompleted(false);
    setTimerSecondsLeft(15);
    setIsTimerRunning(false);
    setEarnedXP(0);
  };

  const handleFinishStep = () => {
    if (!selectedPillar) return;
    soundFx.playToggle();
    const totalSteps = selectedPillar.exercise.steps.length;
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Complete exercise
      const baseXP = 160;
      setEarnedXP(baseXP);
      setIsExerciseCompleted(true);
      soundFx.playSuccess();

      // Trait reward based on category
      let deltaTraits: Partial<CharacterTraits> = {};
      if (selectedPillar.category === 'mindset-awareness') {
        deltaTraits = { wisdom: 5, temperance: 3, resilience: 3 };
      } else if (selectedPillar.category === 'emotion-stress-sleep') {
        deltaTraits = { emotionalMastery: 6, temperance: 4, resilience: 4 };
      } else if (selectedPillar.category === 'identity-confidence') {
        deltaTraits = { courage: 6, resilience: 5, wisdom: 3 };
      } else if (selectedPillar.category === 'social-relationships') {
        deltaTraits = { emotionalMastery: 5, courage: 4, wisdom: 4 };
      }

      onUpdateTraits(deltaTraits, baseXP);
      if (onCompletePillarExercise) {
        onCompletePillarExercise(selectedPillar.id, baseXP);
      }
    }
  };

  // If a pillar exercise is being played
  if (selectedPillar) {
    const IconComponent = ICON_MAP[selectedPillar.iconName] || Brain;
    const currentStep = selectedPillar.exercise.steps[currentStepIndex];
    const totalSteps = selectedPillar.exercise.steps.length;
    const isCompletedAlready = completedPillarsList.includes(selectedPillar.id);

    return (
      <div id="pillar-exercise-runner" className="space-y-4 pb-20">
        {/* Top Bar with Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedPillar(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBDDD2] text-xs font-bold text-[#14261D] hover:bg-[#F2F7F4] transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Torna ai 18 Pilastri
          </button>
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${selectedPillar.badgeColor}`}>
            {selectedPillar.categoryLabel}
          </span>
        </div>

        {/* Pillar Header Card */}
        <div className="p-4.5 rounded-3xl bg-white border border-[#CBDDD2] shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedPillar.badgeColor} shadow-xs shrink-0`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#8C5D19] bg-[#FBF2E3] px-2 py-0.5 rounded border border-[#E9CE9E]">
                  Pilastro Fondamentale
                </span>
                {isCompletedAlready && (
                  <span className="text-[10px] font-bold text-[#1E4332] bg-[#E5F2EC] px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#1E4332]" /> Completato
                  </span>
                )}
              </div>
              <h2 className="text-base font-black text-[#122219] mt-1">{selectedPillar.title}</h2>
              <p className="text-xs text-[#597568] mt-0.5 leading-snug">{selectedPillar.shortDefinition}</p>
            </div>
          </div>

          {/* Neuroscientific Base Pill */}
          <div className="mt-3 p-2.5 rounded-xl bg-[#F4F9F6] border border-[#D5E6DC] text-xs text-[#244234] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#2E7652] shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              <strong className="text-[#122219]">Meccanismo Neurale:</strong> {selectedPillar.neuroscientificCore}
            </span>
          </div>
        </div>

        {!isExerciseCompleted ? (
          /* Active Step Box */
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="p-5 rounded-3xl bg-white border border-[#BBD5C6] shadow-sm space-y-4"
          >
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between text-xs font-bold text-[#557163]">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#2E7652]" /> Fase {currentStepIndex + 1} di {totalSteps}
              </span>
              <span className="font-mono text-[#1E4332]">
                {Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%
              </span>
            </div>

            <div className="h-1.5 w-full bg-[#E5EFE9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2E7652] transition-all duration-300 rounded-full"
                style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>

            {/* Step Title & Prompt */}
            <div>
              <h3 className="text-sm font-black text-[#122219]">{currentStep.title}</h3>
              <p className="text-xs text-[#597568] mt-1 leading-relaxed">{currentStep.description}</p>
            </div>

            {/* Dynamic Interactive Step Content */}
            <div className="pt-2">
              {/* Type 1: Options Selection or Scenario */}
              {(currentStep.interactiveType === 'selection' || currentStep.interactiveType === 'scenario' || currentStep.interactiveType === 'action-commit') && currentStep.options && (
                <div className="space-y-2">
                  {currentStep.options.map((opt) => {
                    const isSelected = stepSelections[currentStepIndex] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          soundFx.playClick();
                          setStepSelections((prev) => ({ ...prev, [currentStepIndex]: opt.id }));
                        }}
                        className={`p-3 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#E5F2EC] border-[#2E7652] shadow-xs'
                            : 'bg-[#F9FCFA] border-[#CBDDD2] hover:border-[#8EAFA0]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#122219]' : 'text-[#243E31]'}`}>
                            {opt.label}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'border-[#2E7652] bg-[#2E7652] text-white' : 'border-[#CBDDD2] bg-white'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </div>
                        {isSelected && opt.explanation && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-[11px] text-[#24523C] font-medium mt-2 pt-2 border-t border-[#CBDDD2]/60"
                          >
                            💡 {opt.explanation}
                          </motion.p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Type 2: Slider */}
              {currentStep.interactiveType === 'slider' && (
                <div className="space-y-3 bg-[#F4F9F6] p-4 rounded-2xl border border-[#D5E6DC]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#14261D]">{currentStep.sliderLabel || 'Valutazione'}</span>
                    <span className="text-base font-mono font-black text-[#2E7652] bg-white px-2.5 py-0.5 rounded-lg border border-[#CBDDD2]">
                      {stepSliders[currentStepIndex] || 7} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={currentStep.minSlider || 1}
                    max={currentStep.maxSlider || 10}
                    value={stepSliders[currentStepIndex] || 7}
                    onChange={(e) => {
                      soundFx.playToggle();
                      setStepSliders((prev) => ({ ...prev, [currentStepIndex]: parseInt(e.target.value) }));
                    }}
                    className="w-full h-2 bg-[#CBDDD2] rounded-lg appearance-none cursor-pointer accent-[#2E7652]"
                  />
                  <div className="flex justify-between text-[10px] text-[#597568] font-medium">
                    <span>1 (Basso/Critico)</span>
                    <span>5 (Medio)</span>
                    <span>10 (Massimo/Eccellente)</span>
                  </div>
                </div>
              )}

              {/* Type 3: Reflection / Association Free Text */}
              {(currentStep.interactiveType === 'reflection' || currentStep.interactiveType === 'association') && (
                <div className="space-y-2.5">
                  <textarea
                    rows={3}
                    value={stepReflections[currentStepIndex] || ''}
                    onChange={(e) => setStepReflections((prev) => ({ ...prev, [currentStepIndex]: e.target.value }))}
                    placeholder={currentStep.placeholder || 'Scrivi la tua riflessione sincera qui...'}
                    className="w-full p-3 rounded-2xl bg-[#F9FCFA] border border-[#CBDDD2] text-xs text-[#122219] placeholder-[#7A988B] focus:outline-none focus:border-[#2E7652] focus:bg-white shadow-2xs transition"
                  />
                  {currentStep.suggestedItems && currentStep.suggestedItems.length > 0 && (
                    <div className="space-y-1 bg-[#F4F9F6] p-3 rounded-xl border border-[#D5E6DC]">
                      <span className="text-[10px] font-bold text-[#2E7652] uppercase tracking-wider block">
                        Spunti di Guida Neurale:
                      </span>
                      {currentStep.suggestedItems.map((item, idx) => (
                        <div key={idx} className="text-[11px] text-[#416252] flex items-start gap-1.5">
                          <span className="text-[#2E7652]">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Type 4: Timer & Somatic Breath */}
              {currentStep.interactiveType === 'timer-breath' && (
                <div className="flex flex-col items-center justify-center p-6 bg-[#F4F9F6] rounded-2xl border border-[#D5E6DC] space-y-4 text-center">
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: isTimerRunning ? [1, 1.25, 1.25, 1] : 1,
                        opacity: isTimerRunning ? [0.6, 1, 1, 0.6] : 0.8,
                      }}
                      transition={{
                        duration: 6,
                        repeat: isTimerRunning ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                      className="w-24 h-24 rounded-full bg-[#D8EADB] border-2 border-[#2E7652] flex flex-col items-center justify-center shadow-xs"
                    >
                      <Clock className="w-5 h-5 text-[#2E7652] mb-1" />
                      <span className="text-xl font-mono font-black text-[#122219]">{timerSecondsLeft}s</span>
                    </motion.div>
                  </div>

                  <p className="text-xs font-bold text-[#24523C] max-w-xs">{currentStep.placeholder}</p>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      if (timerSecondsLeft === 0) setTimerSecondsLeft(15);
                      setIsTimerRunning(!isTimerRunning);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer ${
                      isTimerRunning ? 'bg-[#7F3847] text-white' : 'bg-[#2E7652] text-white'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isTimerRunning ? 'Pausa Timer' : timerSecondsLeft === 0 ? 'Ripeti Pratica' : 'Avvia Pratica (15s)'}
                  </button>
                </div>
              )}
            </div>

            {/* Next / Complete Step Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleFinishStep}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2E7652] hover:bg-[#1E4332] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-98"
              >
                <span>{currentStepIndex < totalSteps - 1 ? 'Prosegui alla Prossima Fase' : 'Completa Esercizio del Pilastro'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Completion & Reward Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-white border border-[#BBD5C6] shadow-md space-y-4 text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-[#E5F2EC] border border-[#BBD5C6] flex items-center justify-center text-[#2E7652] mx-auto shadow-xs">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#8C5D19] uppercase tracking-wider bg-[#FBF2E3] px-2.5 py-0.5 rounded-full border border-[#E9CE9E]">
                Virtù Consolidata
              </span>
              <h3 className="text-lg font-black text-[#122219] mt-1.5">Pilastro Integrato con Successo!</h3>
              <p className="text-xs text-[#597568] mt-1 max-w-sm mx-auto">
                Hai completato l&apos;allenamento pratico per <strong>{selectedPillar.title}</strong>.
              </p>
            </div>

            {/* XP and Trait Badge */}
            <div className="flex items-center justify-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#FBF2E3] border border-[#E9CE9E] text-xs font-mono font-bold text-[#8C5D19]">
                +{earnedXP} XP Crescita
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-[#E5F2EC] border border-[#BBD5C6] text-xs font-mono font-bold text-[#1E4332]">
                +Carattere & Virtù
              </div>
            </div>

            {/* Mantra of the Pillar */}
            <div className="p-4 rounded-2xl bg-[#F4F9F6] border border-[#D5E6DC] text-left space-y-1.5">
              <span className="text-[10px] font-bold text-[#2E7652] uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Mantra di Integrazione Quotidiana
              </span>
              <p className="text-xs font-bold text-[#122219] italic leading-relaxed">
                &ldquo;{selectedPillar.exercise.mantraOrTakeaway}&rdquo;
              </p>
            </div>

            {/* Practical Daily Commitment */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9EE] border border-[#E8CE9E] text-left">
              <span className="text-[10px] font-bold text-[#8C5D19] uppercase tracking-wider block">
                🎯 Impegno Pratico per Oggi:
              </span>
              <p className="text-xs text-[#523A10] mt-1 leading-snug">
                {selectedPillar.exercise.practicalCommitment}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  handleStartExercise(selectedPillar);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#F2F7F4] border border-[#CBDDD2] text-xs font-bold text-[#456353] hover:bg-[#E5F2EC] transition cursor-pointer"
              >
                Ripeti Esercizio
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setSelectedPillar(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#2E7652] hover:bg-[#1E4332] text-white text-xs font-black transition cursor-pointer shadow-xs"
              >
                Torna a Tutti i Pilastri
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Master Hub Catalog View (18 Pillars)
  return (
    <div id="psychology-pillars-gym" className="space-y-4 pb-20">
      {/* Top Navigation & Exit */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBDDD2] text-xs font-bold text-[#14261D] hover:bg-[#F2F7F4] transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Torna alla Palestra
        </button>
        <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#D8EADB] border border-[#BBD5C6] px-2.5 py-1 rounded-full shadow-2xs">
          {completedPillarsList.length}/18 Pilastri Allenati
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#163325] via-[#1E4332] to-[#2B5340] text-white border border-[#3E6C55] shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 text-[#F6C667] mb-1">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Accademia Psicologica & Virtù Umane</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1 font-display">I 18 Pilastri della Psiche</h2>
        <p className="text-xs text-[#CFE5D8] leading-relaxed">
          Allenamento neuro-psicologico guidato: percezione realistica, confini, gestione stress, intelligenza emotiva, mantra, sonno, altruismo, creatività e psicologia positiva.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A988B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cerca tra percezione realistica, confini, stress, mantra, sonno, altruismo..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#CBDDD2] text-xs sm:text-sm text-[#122219] placeholder-[#7A988B] focus:outline-none focus:border-[#2E7652] shadow-2xs transition"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#1E4332] text-white shadow-xs'
                  : 'bg-white border border-[#CBDDD2] text-[#456353] hover:bg-[#F2F7F4]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 18 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredPillars.map((pillar) => {
          const IconComponent = ICON_MAP[pillar.iconName] || Brain;
          const isCompleted = completedPillarsList.includes(pillar.id);

          return (
            <motion.div
              key={pillar.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleStartExercise(pillar)}
              className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#4E8067] shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`w-11 h-11 rounded-2xl ${pillar.badgeColor} border border-[#CBDDD2] flex items-center justify-center group-hover:scale-105 transition shadow-2xs`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-[#1E4332] bg-[#E5F2EC] px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#1E4332]" /> Fatto
                      </span>
                    )}
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${pillar.badgeColor}`}>
                      {pillar.categoryLabel}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-black text-[#122219] group-hover:text-[#1E4332] transition">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#597568] leading-snug mt-1 line-clamp-2">
                  {pillar.shortDefinition}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#F0F5F2]">
                <span className="text-[11px] font-bold text-[#2E7652] flex items-center gap-1 group-hover:translate-x-0.5 transition">
                  Avvia Esercizio Pratico <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] font-mono text-[#8C5D19] bg-[#FBF2E3] px-2 py-0.5 rounded">
                  +160 XP
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
