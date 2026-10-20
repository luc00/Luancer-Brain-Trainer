import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { UserProfile, CharacterTraits } from '../../types';
import { saveJournalEntry } from '../../utils/storage';
import {
  Clock,
  Heart,
  Wind,
  Shield,
  Calculator,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
  Maximize2,
  X,
  Volume2,
  VolumeX,
  Plus,
  Flame,
  Award,
  Zap,
  Check
} from 'lucide-react';

export interface CognitiveFocusWidgetConfig {
  id: 'deep_work_timer' | 'gratitude_checkin' | 'box_breathing' | 'dopamine_shield' | 'speed_math_burst';
  title: string;
  shortTitle: string;
  description: string;
  neuroBenefit: string;
  category: 'focus' | 'mindfulness' | 'virtue' | 'clarity';
  enabled: boolean;
  xpReward: number;
  iconName: string;
}

const DEFAULT_WIDGET_CONFIGS: CognitiveFocusWidgetConfig[] = [
  {
    id: 'deep_work_timer',
    title: 'Deep Work Sprint Timer',
    shortTitle: 'Timer Deep Work',
    description: 'Sprint di concentrazione profonda da 15, 25 o 45 min senza distrazioni.',
    neuroBenefit: 'Potenzia la mielinizzazione dei circuiti attentivi e la resistenza al multitasking.',
    category: 'focus',
    enabled: true,
    xpReward: 160,
    iconName: 'Clock',
  },
  {
    id: 'gratitude_checkin',
    title: 'Gratitude & Stoic Check-in',
    shortTitle: 'Check-in Gratitudine',
    description: 'Annota 3 ragioni di sincera riconoscenza per calibrare la prospettiva mentale.',
    neuroBenefit: 'Aumenta il rilascio di serotonina e dopamina, riducendo il cortisolo serale.',
    category: 'virtue',
    enabled: true,
    xpReward: 100,
    iconName: 'Heart',
  },
  {
    id: 'box_breathing',
    title: 'Box Breathing 4-4-4-4',
    shortTitle: 'Reset Vago (Respiro)',
    description: '1 minuto di respirazione quadrata per stabilizzare la frequenza cardiaca.',
    neuroBenefit: 'Stimola il nervo vago e riequilibra istantaneamente il sistema parasimpatico.',
    category: 'mindfulness',
    enabled: true,
    xpReward: 70,
    iconName: 'Wind',
  },
  {
    id: 'dopamine_shield',
    title: 'Dopamine Shield & Focus Lock',
    shortTitle: 'Scudo Anti-Distrazione',
    description: 'Blocco psicologico contro i social network e switch continuo di notifiche.',
    neuroBenefit: 'Preserva i recettori D2 della dopamina e allunga la soglia di concentrazione.',
    category: 'focus',
    enabled: false,
    xpReward: 80,
    iconName: 'Shield',
  },
  {
    id: 'speed_math_burst',
    title: 'Speed Math Prefrontale Flash',
    shortTitle: 'Micro-Sprint Calcolo',
    description: '60 secondi di calcolo mentale rapido per risvegliare il solco intraparietale.',
    neuroBenefit: 'Innesca il reclutamento prefrontale dorsolaterale prima del lavoro impegnativo.',
    category: 'clarity',
    enabled: false,
    xpReward: 60,
    iconName: 'Calculator',
  },
];

const STORAGE_KEY = 'luancer_cognitive_focus_widgets_v1';
const SHIELD_STORAGE_KEY = 'luancer_dopamine_shield_state';

interface Props {
  profile: UserProfile;
  onUpdateTraits: (delta: Partial<CharacterTraits>, xp: number) => void;
  onRefreshProfile?: () => void;
  onLaunchFullDeepWork?: () => void;
  onLaunchFullJournal?: () => void;
  onLaunchFullBreathing?: () => void;
}

export const CognitiveFocusWidgets: React.FC<Props> = ({
  profile,
  onUpdateTraits,
  onRefreshProfile,
  onLaunchFullDeepWork,
  onLaunchFullJournal,
  onLaunchFullBreathing,
}) => {
  // Widget customization state
  const [configs, setConfigs] = useState<CognitiveFocusWidgetConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all keys exist
        return DEFAULT_WIDGET_CONFIGS.map((def) => {
          const match = parsed.find((p: CognitiveFocusWidgetConfig) => p.id === def.id);
          return match ? { ...def, enabled: match.enabled } : def;
        });
      }
    } catch {}
    return DEFAULT_WIDGET_CONFIGS;
  });

  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'focus' | 'virtue' | 'mindfulness'>('all');

  const saveConfigs = (newConfigs: CognitiveFocusWidgetConfig[]) => {
    setConfigs(newConfigs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfigs));
    } catch {}
  };

  const toggleWidgetEnabled = (id: string) => {
    soundFx.playToggle();
    const updated = configs.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
    saveConfigs(updated);
  };

  const resetConfigsToDefault = () => {
    soundFx.playClick();
    saveConfigs(DEFAULT_WIDGET_CONFIGS);
  };

  // -------------------------------------------------------------
  // WIDGET 1: DEEP WORK TIMER STATE
  // -------------------------------------------------------------
  const [dwDuration, setDwDuration] = useState<number>(25); // minutes
  const [dwTimeLeft, setDwTimeLeft] = useState<number>(25 * 60);
  const [dwIsRunning, setDwIsRunning] = useState<boolean>(false);
  const [dwTask, setDwTask] = useState<string>('');
  const [dwSoundActive, setDwSoundActive] = useState<boolean>(false);
  const [dwCompletedCount, setDwCompletedCount] = useState<number>(0);
  const [dwCelebration, setDwCelebration] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (dwIsRunning && dwTimeLeft > 0) {
      interval = setInterval(() => {
        setDwTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (dwTimeLeft === 0 && dwIsRunning) {
      setDwIsRunning(false);
      soundFx.playSuccess();
      setDwCelebration(true);
      setDwCompletedCount((c) => c + 1);
      onUpdateTraits({ temperance: 5, emotionalMastery: 3 }, 160);
      if (dwSoundActive) {
        soundFx.stopBinaural();
        setDwSoundActive(false);
      }
      setTimeout(() => setDwCelebration(false), 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dwIsRunning, dwTimeLeft, dwSoundActive, onUpdateTraits]);

  const toggleDwTimer = () => {
    soundFx.playClick();
    if (!dwIsRunning && dwTimeLeft === 0) {
      setDwTimeLeft(dwDuration * 60);
    }
    const nextRunning = !dwIsRunning;
    setDwIsRunning(nextRunning);
    if (dwSoundActive) {
      if (nextRunning) {
        soundFx.startBinaural('alpha');
      } else {
        soundFx.stopBinaural();
      }
    }
  };

  const setDwPreset = (mins: number) => {
    soundFx.playClick();
    setDwIsRunning(false);
    if (dwSoundActive) {
      soundFx.stopBinaural();
      setDwSoundActive(false);
    }
    setDwDuration(mins);
    setDwTimeLeft(mins * 60);
  };

  const toggleDwSound = () => {
    soundFx.playClick();
    const nextState = !dwSoundActive;
    setDwSoundActive(nextState);
    if (nextState && dwIsRunning) {
      soundFx.startBinaural('alpha');
    } else {
      soundFx.stopBinaural();
    }
  };

  // -------------------------------------------------------------
  // WIDGET 2: GRATITUDE CHECK-IN STATE
  // -------------------------------------------------------------
  const todayStr = new Date().toISOString().split('T')[0];
  const existingTodayJournal = profile.journalEntries?.find((e) => e.date === todayStr);

  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [gratitudeSaved, setGratitudeSaved] = useState(false);
  const [isEditingGratitude, setIsEditingGratitude] = useState(false);

  // Initialize from today's journal if available
  useEffect(() => {
    if (existingTodayJournal?.gratitude) {
      const parts = existingTodayJournal.gratitude.split('\n• ').map((s) => s.replace(/^• /, '').trim());
      if (parts[0]) setGratitude1(parts[0]);
      if (parts[1]) setGratitude2(parts[1]);
      if (parts[2]) setGratitude3(parts[2]);
    }
  }, [existingTodayJournal]);

  const handleSaveGratitude = () => {
    const items = [gratitude1.trim(), gratitude2.trim(), gratitude3.trim()].filter(Boolean);
    if (items.length === 0) return;

    soundFx.playSuccess();
    const formatted = items.map((it) => `• ${it}`).join('\n');

    saveJournalEntry({
      date: todayStr,
      gratitude: formatted,
      triumph: existingTodayJournal?.triumph || '',
      slip: existingTodayJournal?.slip || '',
      tomorrowFocus: existingTodayJournal?.tomorrowFocus || '',
    });

    onUpdateTraits({ wisdom: 4, temperance: 3, emotionalMastery: 3 }, 100);
    if (onRefreshProfile) onRefreshProfile();
    setGratitudeSaved(true);
    setIsEditingGratitude(false);
    setTimeout(() => setGratitudeSaved(false), 4000);
  };

  // -------------------------------------------------------------
  // WIDGET 3: BOX BREATHING 4-4-4-4 STATE
  // -------------------------------------------------------------
  const [isBreathingRunning, setIsBreathingRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inspira' | 'trattieni1' | 'espira' | 'trattieni2'>('inspira');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [breathCycleCount, setBreathCycleCount] = useState(0);
  const [breathCompleted, setBreathCompleted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isBreathingRunning) {
      timer = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev > 1) {
            return prev - 1;
          }
          // Transition to next phase
          setBreathPhase((currPhase) => {
            if (currPhase === 'inspira') return 'trattieni1';
            if (currPhase === 'trattieni1') return 'espira';
            if (currPhase === 'espira') return 'trattieni2';
            // completed a full 16s cycle
            setBreathCycleCount((c) => {
              const next = c + 1;
              if (next >= 3) {
                // Completed 3 cycles (~48s to 1 min)
                soundFx.playPowerUp();
                setBreathCompleted(true);
                onUpdateTraits({ emotionalMastery: 6, temperance: 4 }, 70);
              }
              return next;
            });
            return 'inspira';
          });
          return 4;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathingRunning, onUpdateTraits]);

  const toggleBreathing = () => {
    soundFx.playClick();
    if (!isBreathingRunning) {
      setBreathSeconds(4);
      setBreathPhase('inspira');
    }
    setIsBreathingRunning(!isBreathingRunning);
  };

  // -------------------------------------------------------------
  // WIDGET 4: DOPAMINE SHIELD STATE
  // -------------------------------------------------------------
  const [shieldActive, setShieldActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SHIELD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          return true;
        }
      }
    } catch {}
    return false;
  });

  const [shieldMinutesLeft, setShieldMinutesLeft] = useState<number>(120);

  useEffect(() => {
    const updateShieldTimer = () => {
      try {
        const saved = localStorage.getItem(SHIELD_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.expiresAt) {
            const diffMs = parsed.expiresAt - Date.now();
            if (diffMs > 0) {
              setShieldMinutesLeft(Math.ceil(diffMs / 60000));
              setShieldActive(true);
              return;
            }
          }
        }
      } catch {}
      setShieldActive(false);
    };

    updateShieldTimer();
    const interval = setInterval(updateShieldTimer, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleShield = () => {
    soundFx.playClick();
    if (shieldActive) {
      localStorage.removeItem(SHIELD_STORAGE_KEY);
      setShieldActive(false);
    } else {
      const expiresAt = Date.now() + 120 * 60 * 1000; // 2 hours
      localStorage.setItem(SHIELD_STORAGE_KEY, JSON.stringify({ active: true, expiresAt }));
      setShieldActive(true);
      setShieldMinutesLeft(120);
      soundFx.playPowerUp();
      onUpdateTraits({ temperance: 6, resilience: 4 }, 80);
    }
  };

  // -------------------------------------------------------------
  // WIDGET 5: SPEED MATH BURST STATE
  // -------------------------------------------------------------
  const [mathActive, setMathActive] = useState(false);
  const [mathQuestion, setMathQuestion] = useState<{ text: string; answer: number; options: number[] }>({
    text: '17 + 24',
    answer: 41,
    options: [39, 41, 43, 38],
  });
  const [mathScore, setMathScore] = useState(0);
  const [mathTimeLeft, setMathTimeLeft] = useState(30);
  const [mathFinished, setMathFinished] = useState(false);

  const generateMathQuestion = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0, b = 0, ans = 0;
    if (op === '+') {
      a = Math.floor(Math.random() * 45) + 12;
      b = Math.floor(Math.random() * 45) + 11;
      ans = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 60) + 30;
      b = Math.floor(Math.random() * 28) + 9;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 11) + 3;
      b = Math.floor(Math.random() * 12) + 4;
      ans = a * b;
    }
    const options = [ans];
    while (options.length < 4) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 6) + 1);
      const wrong = ans + delta;
      if (wrong > 0 && !options.includes(wrong)) {
        options.push(wrong);
      }
    }
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    setMathQuestion({ text: `${a} ${op === '*' ? '×' : op} ${b}`, answer: ans, options });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (mathActive && mathTimeLeft > 0) {
      interval = setInterval(() => {
        setMathTimeLeft((t) => t - 1);
      }, 1000);
    } else if (mathActive && mathTimeLeft === 0) {
      setMathActive(false);
      setMathFinished(true);
      soundFx.playSuccess();
      onUpdateTraits({ wisdom: 4, resilience: 3 }, 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mathActive, mathTimeLeft, onUpdateTraits]);

  const startMath = () => {
    soundFx.playClick();
    setMathScore(0);
    setMathTimeLeft(30);
    setMathFinished(false);
    generateMathQuestion();
    setMathActive(true);
  };

  const answerMath = (opt: number) => {
    if (opt === mathQuestion.answer) {
      soundFx.playSparkle();
      setMathScore((s) => s + 10);
      generateMathQuestion();
    } else {
      soundFx.playClick();
    }
  };

  // Filter widgets by active enabled config
  const enabledConfigs = configs.filter((c) => c.enabled);
  const activeCount = enabledConfigs.length;

  return (
    <section aria-label="Cognitive Focus Widgets" className="space-y-3 pt-1">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E6F2EB] border border-[#BBD5C6] flex items-center justify-center text-[#1E4332] shadow-2xs">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#14261D] uppercase tracking-wider flex items-center gap-1.5">
              <span>Focus Cognitivo & Mini-Sfide</span>
              <span className="text-[10px] bg-[#D6EADB] text-[#1E4332] font-mono px-2 py-0.5 rounded-full font-bold border border-[#BEDBC6]">
                {activeCount} Attivi
              </span>
            </h3>
            <p className="text-xs text-[#557163]">Personalizza i blocchi di attenzione profonda e virtù</p>
          </div>
        </div>

        {/* Customization Toggle Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            setCustomizeModalOpen(true);
          }}
          className="p-2 px-3 rounded-2xl bg-white border border-[#CBDDD2] hover:border-[#4B7C64] hover:bg-[#F2F7F4] text-[#224735] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95"
          title="Personalizza mini-sfide e attiva o disattiva widget"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#376850]" />
          <span className="hidden sm:inline">Personalizza</span>
        </button>
      </div>

      {/* When no widgets are enabled */}
      {activeCount === 0 && (
        <div className="p-6 rounded-3xl bg-white border border-dashed border-[#B8D3C3] text-center space-y-2">
          <Sparkles className="w-8 h-8 text-[#588C72] mx-auto opacity-70" />
          <h4 className="text-sm font-bold text-[#14261D]">Nessun Widget di Focus Attivo</h4>
          <p className="text-xs text-[#557163] max-w-sm mx-auto">
            Personalizza la tua routine attivando il Deep Work Timer, il Check-in di Gratitudine o il Box Breathing.
          </p>
          <button
            onClick={() => {
              soundFx.playClick();
              setCustomizeModalOpen(true);
            }}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E4332] text-white text-xs font-bold hover:bg-[#163325] transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Scegli Mini-Sfide</span>
          </button>
        </div>
      )}

      {/* Render Active Widgets Grid */}
      <div className="space-y-3">
        {/* ======================================================== */}
        {/* 1. DEEP WORK TIMER WIDGET */}
        {/* ======================================================== */}
        {configs.find((c) => c.id === 'deep_work_timer')?.enabled && (
          <div className="rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] p-4.5 shadow-sm transition-all relative overflow-hidden group">
            {/* Top Banner & Title */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F3ED] border border-[#BFD8C9] flex items-center justify-center text-[#1E4332] shadow-2xs">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#1E4332] uppercase tracking-wider">Focus & Flow</span>
                    {dwCompletedCount > 0 && (
                      <span className="text-[10px] text-[#246344] bg-[#E3F2E9] px-1.5 py-0.2 rounded font-mono font-bold">
                        {dwCompletedCount} {dwCompletedCount === 1 ? 'sprint' : 'sprint'} oggi
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#122219]">Deep Work Sprint Timer</h4>
                </div>
              </div>

              {/* Action Buttons: Full Screen & Ambient Sound */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleDwSound}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    dwSoundActive
                      ? 'bg-[#1E4332] text-[#F3E7C9] border-[#1E4332]'
                      : 'bg-[#F2F7F4] border-[#D1E2D7] text-[#426855] hover:bg-[#E3EEE7]'
                  }`}
                  title={dwSoundActive ? 'Onde Alfa Attive (10Hz)' : 'Attiva Onde Alfa di sottofondo'}
                >
                  {dwSoundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {onLaunchFullDeepWork && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onLaunchFullDeepWork();
                    }}
                    className="p-1.5 rounded-lg bg-[#F2F7F4] border border-[#D1E2D7] text-[#426855] hover:bg-[#E3EEE7] transition"
                    title="Apri Deep Work a schermo intero"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Task input */}
            <div className="mb-3">
              <input
                type="text"
                value={dwTask}
                onChange={(e) => setDwTask(e.target.value)}
                placeholder="Qual è il tuo unico obiettivo per questo blocco?"
                className="w-full text-xs px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E3DB] focus:bg-white focus:border-[#2F6B4C] focus:outline-none transition placeholder:text-[#8AA497] text-[#14261D]"
              />
            </div>

            {/* Timer Core Display & Controls */}
            <div className="flex items-center justify-between bg-[#F2F8F4] border border-[#CDE0D4] rounded-2xl p-3.5">
              {/* Presets */}
              <div className="flex items-center gap-1">
                {[15, 25, 45].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDwPreset(mins)}
                    disabled={dwIsRunning}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition font-mono ${
                      dwDuration === mins
                        ? 'bg-[#1E4332] text-white shadow-2xs'
                        : 'bg-white/80 text-[#3F6854] hover:bg-white border border-[#CBDDD2]'
                    } ${dwIsRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              {/* Digital Clock */}
              <div className="text-center font-mono">
                <span className="text-2xl font-black text-[#132A1E] tracking-tight">
                  {String(Math.floor(dwTimeLeft / 60)).padStart(2, '0')}:
                  {String(dwTimeLeft % 60).padStart(2, '0')}
                </span>
                <span className="block text-[9px] font-bold text-[#5B7B6C] uppercase tracking-wider">
                  {dwIsRunning ? 'Concentrazione Attiva' : 'In Pausa'}
                </span>
              </div>

              {/* Start / Pause / Reset Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleDwTimer}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 ${
                    dwIsRunning
                      ? 'bg-[#C75A48] hover:bg-[#B34B3A] text-white'
                      : 'bg-[#1E4332] hover:bg-[#163325] text-white'
                  }`}
                >
                  {dwIsRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pausa</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      <span>Avvia</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setDwPreset(dwDuration)}
                  className="p-2 rounded-xl bg-white hover:bg-[#E8F0EB] text-[#557163] border border-[#CBDDD2] transition shadow-2xs"
                  title="Resetta timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Celebration popup */}
            <AnimatePresence>
              {dwCelebration && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2.5 p-2.5 rounded-xl bg-[#E2F7EB] border border-[#8CDDB2] flex items-center justify-between text-xs text-[#13442A]"
                >
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#208451]" />
                    <span>Sprint Completato! +160 XP & Tempra potenziata</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#F6C667]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. GRATITUDE CHECK-IN WIDGET */}
        {/* ======================================================== */}
        {configs.find((c) => c.id === 'gratitude_checkin')?.enabled && (
          <div className="rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] p-4.5 shadow-sm transition-all relative overflow-hidden group">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FDF0EE] border border-[#F4CCC4] flex items-center justify-center text-[#B83E28] shadow-2xs">
                  <Heart className="w-4.5 h-4.5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#A83722] uppercase tracking-wider">Virtù & Stoicismo</span>
                    {existingTodayJournal?.gratitude && !isEditingGratitude && (
                      <span className="text-[10px] text-[#246344] bg-[#E3F2E9] px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#2A8255]" /> Completato Oggi
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#122219]">Gratitude & Stoic Check-in</h4>
                </div>
              </div>

              {onLaunchFullJournal && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onLaunchFullJournal();
                  }}
                  className="text-xs font-semibold text-[#517664] hover:text-[#183627] flex items-center gap-1"
                >
                  <span>Diario</span>
                </button>
              )}
            </div>

            {/* If completed today and not in edit mode */}
            {existingTodayJournal?.gratitude && !isEditingGratitude ? (
              <div className="space-y-2.5 bg-[#FAFDFB] border border-[#D5E6DC] rounded-2xl p-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#4B735F] uppercase tracking-wider block">
                    La tua Riconoscenza di Oggi:
                  </span>
                  <div className="text-xs text-[#162D22] whitespace-pre-line leading-relaxed font-medium bg-white p-2.5 rounded-xl border border-[#E1ECE5]">
                    {existingTodayJournal.gratitude}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E1ECE5]">
                  <p className="text-[11px] italic text-[#638575]">
                    &ldquo;Niente è così onorevole come un cuore riconoscente.&rdquo; — Seneca
                  </p>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsEditingGratitude(true);
                    }}
                    className="text-xs font-bold text-[#1F4E37] hover:underline"
                  >
                    Modifica
                  </button>
                </div>
              </div>
            ) : (
              /* Input Form for Gratitude */
              <div className="space-y-2.5">
                <p className="text-xs text-[#527061] font-medium">
                  Identifica tre cose autentiche per cui provi vera riconoscenza adesso:
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F2F7F4] border border-[#CBDDD2] text-[10px] font-bold text-[#355E49] flex items-center justify-center shrink-0">
                      1
                    </span>
                    <input
                      type="text"
                      value={gratitude1}
                      onChange={(e) => setGratitude1(e.target.value)}
                      placeholder="Una persona, un gesto o una relazione preziosa..."
                      className="flex-1 text-xs px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E3DB] focus:bg-white focus:border-[#2F6B4C] focus:outline-none transition placeholder:text-[#8AA497] text-[#14261D]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F2F7F4] border border-[#CBDDD2] text-[10px] font-bold text-[#355E49] flex items-center justify-center shrink-0">
                      2
                    </span>
                    <input
                      type="text"
                      value={gratitude2}
                      onChange={(e) => setGratitude2(e.target.value)}
                      placeholder="Un privilegio quotidiano (salute, acqua, calma, libertà)..."
                      className="flex-1 text-xs px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E3DB] focus:bg-white focus:border-[#2F6B4C] focus:outline-none transition placeholder:text-[#8AA497] text-[#14261D]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F2F7F4] border border-[#CBDDD2] text-[10px] font-bold text-[#355E49] flex items-center justify-center shrink-0">
                      3
                    </span>
                    <input
                      type="text"
                      value={gratitude3}
                      onChange={(e) => setGratitude3(e.target.value)}
                      placeholder="Un ostacolo superato o una lezione che ti ha reso forte..."
                      className="flex-1 text-xs px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E3DB] focus:bg-white focus:border-[#2F6B4C] focus:outline-none transition placeholder:text-[#8AA497] text-[#14261D]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#557765] font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#F6C667]" /> +100 XP Saggezza & Virtù
                  </span>

                  <button
                    onClick={handleSaveGratitude}
                    disabled={!gratitude1.trim() && !gratitude2.trim() && !gratitude3.trim()}
                    className="px-4 py-2 rounded-xl bg-[#1E4332] hover:bg-[#163325] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Registra Gratitudine</span>
                  </button>
                </div>
              </div>
            )}

            {/* Gratitude Saved Alert */}
            <AnimatePresence>
              {gratitudeSaved && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2.5 p-2.5 rounded-xl bg-[#E2F7EB] border border-[#8CDDB2] flex items-center justify-between text-xs text-[#13442A]"
                >
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#208451]" />
                    <span>Riconoscenza salvata nel Diario Stoico! +100 XP</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#F6C667]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. BOX BREATHING 4-4-4-4 WIDGET */}
        {/* ======================================================== */}
        {configs.find((c) => c.id === 'box_breathing')?.enabled && (
          <div className="rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] p-4.5 shadow-sm transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E5F5F7] border border-[#BDE4EA] flex items-center justify-center text-[#1E6773] shadow-2xs">
                  <Wind className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#1E6773] uppercase tracking-wider">
                      Respiro & Nervo Vago
                    </span>
                    {breathCycleCount > 0 && (
                      <span className="text-[10px] text-[#1E6773] bg-[#E5F5F7] px-1.5 py-0.2 rounded font-mono font-bold">
                        {breathCycleCount} cicli completati
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#122219]">Box Breathing 4-4-4-4</h4>
                </div>
              </div>

              {onLaunchFullBreathing && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onLaunchFullBreathing();
                  }}
                  className="p-1.5 rounded-lg bg-[#F2F7F4] border border-[#D1E2D7] text-[#426855] hover:bg-[#E3EEE7] transition"
                  title="Apri respirazione neuroscientifica completa"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Interactive Breathing Sphere & Controls */}
            <div className="bg-gradient-to-r from-[#F0F8F6] to-[#E8F4F1] border border-[#CBE2DC] rounded-2xl p-4 flex items-center justify-between gap-4">
              {/* Animated Pacer Visual */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale:
                      breathPhase === 'inspira'
                        ? 1.25
                        : breathPhase === 'trattieni1'
                        ? 1.25
                        : breathPhase === 'espira'
                        ? 0.85
                        : 0.85,
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#45A78B] to-[#246A57] opacity-80 flex items-center justify-center text-white shadow-sm"
                >
                  <span className="font-mono text-base font-bold">{isBreathingRunning ? breathSeconds : '4s'}</span>
                </motion.div>
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#57AA92]/40 pointer-events-none" />
              </div>

              {/* Instructions & Phase Details */}
              <div className="flex-1">
                <span className="text-xs font-bold text-[#122F24] block uppercase tracking-wide">
                  {isBreathingRunning
                    ? breathPhase === 'inspira'
                      ? '1. Inspira dal naso (4s)'
                      : breathPhase === 'trattieni1'
                      ? '2. Trattieni a pieni polmoni (4s)'
                      : breathPhase === 'espira'
                      ? '3. Espira lentamente dalla bocca (4s)'
                      : '4. Trattieni a polmoni vuoti (4s)'
                    : '1 minuto di reset vagale rapido'}
                </span>
                <p className="text-[11px] text-[#4F7363] mt-0.5">
                  Calma la frequenza cardiaca e riattiva il controllo prefrontale sulle emozioni.
                </p>
              </div>

              {/* Start / Pause Button */}
              <div>
                <button
                  onClick={toggleBreathing}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 ${
                    isBreathingRunning
                      ? 'bg-[#4B6B5D] hover:bg-[#3D574B] text-white'
                      : 'bg-[#1E4332] hover:bg-[#163325] text-white'
                  }`}
                >
                  {isBreathingRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      <span>Respira</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {breathCompleted && (
              <div className="mt-2 text-center text-xs font-bold text-[#1C5E3D] bg-[#E3F5EC] p-1.5 rounded-xl border border-[#99DEBA]">
                ✨ Coerenza cardiaca raggiunta (+70 XP Maestro Emotivo)
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. DOPAMINE SHIELD WIDGET */}
        {/* ======================================================== */}
        {configs.find((c) => c.id === 'dopamine_shield')?.enabled && (
          <div className="rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] p-4.5 shadow-sm transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs transition ${
                    shieldActive
                      ? 'bg-[#1E4332] text-[#F3E7C9] border border-[#1E4332]'
                      : 'bg-[#F4F4F6] text-[#474F59] border border-[#D5D8DC]'
                  }`}
                >
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#3B4D43] uppercase tracking-wider">
                      Resistenza Digitale
                    </span>
                    {shieldActive && (
                      <span className="text-[10px] text-[#1E4332] bg-[#E3F2E9] px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                        Attivo • {shieldMinutesLeft} min rimanenti
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#122219]">Dopamine Shield & Focus Lock</h4>
                </div>
              </div>

              <button
                onClick={toggleShield}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 ${
                  shieldActive
                    ? 'bg-[#D24B38] hover:bg-[#B83E2D] text-white'
                    : 'bg-[#1E4332] hover:bg-[#163325] text-white'
                }`}
              >
                {shieldActive ? 'Disattiva' : 'Attiva 2 Ore'}
              </button>
            </div>

            <p className="text-xs text-[#527061] mt-1">
              {shieldActive
                ? 'Scudo attivo: silenzia notifiche, mantieni il telefono fuori dal campo visivo e concentra le energie su un singolo compito alla volta.'
                : 'Attiva il blocco di 2 ore: zero notifiche, zero feed social e protezione dei tuoi recettori della dopamina (+80 XP).'}
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. SPEED MATH BURST WIDGET */}
        {/* ======================================================== */}
        {configs.find((c) => c.id === 'speed_math_burst')?.enabled && (
          <div className="rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] p-4.5 shadow-sm transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F0EEF8] border border-[#D5CBE3] flex items-center justify-center text-[#553C79] shadow-2xs">
                  <Calculator className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#553C79] uppercase tracking-wider">
                    Attivazione Prefrontale
                  </span>
                  <h4 className="text-sm font-bold text-[#122219]">Speed Math Prefrontale Flash</h4>
                </div>
              </div>

              {mathActive ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#8C5D19] bg-[#FBF2E3] px-2 py-0.5 rounded-full border border-[#E9CE9E]">
                    {mathTimeLeft}s
                  </span>
                  <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E3F2E9] px-2 py-0.5 rounded-full border border-[#BBD5C6]">
                    {mathScore} pt
                  </span>
                </div>
              ) : (
                <button
                  onClick={startMath}
                  className="px-3 py-1.5 rounded-xl bg-[#1E4332] hover:bg-[#163325] text-white text-xs font-bold transition shadow-xs"
                >
                  {mathFinished ? 'Rigioca' : 'Inizia (30s)'}
                </button>
              )}
            </div>

            {mathActive ? (
              <div className="bg-[#F6F5FB] border border-[#DDD8EC] rounded-2xl p-3 text-center space-y-2.5">
                <div className="text-2xl font-black font-mono text-[#251A38] tracking-wider">
                  {mathQuestion.text} = ?
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {mathQuestion.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => answerMath(opt)}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-[#EAE5F7] border border-[#CEC4E2] text-sm font-bold font-mono text-[#2D2144] shadow-2xs transition active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#597568]">
                {mathFinished
                  ? `Sprint terminato con ${mathScore} punti! La tua corteccia prefrontale è ora attiva e reattiva (+60 XP).`
                  : 'Risolvi quanti più calcoli a mente possibili in 30 secondi per stimolare il reclutamento neuronale rapido.'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* PERSONALIZATION / CUSTOMIZATION MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {customizeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-[#EBF3EE] rounded-3xl border border-[#CBDDD2] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 md:p-5 border-b border-[#CBDDD2] bg-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F3ED] border border-[#BFD8C9] flex items-center justify-center text-[#1E4332]">
                    <SlidersHorizontal className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-[#122219]">Personalizza Mini-Sfide</h3>
                    <p className="text-xs text-[#527061]">
                      Attiva o disattiva i widget in base alle tue esigenze di oggi
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCustomizeModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#E8F0EB] text-[#557163] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: List of Widgets with Toggles */}
              <div className="p-4 md:p-5 space-y-3 overflow-y-auto flex-1">
                {configs.map((widget) => {
                  return (
                    <div
                      key={widget.id}
                      onClick={() => toggleWidgetEnabled(widget.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        widget.enabled
                          ? 'bg-white border-[#52826A] shadow-xs'
                          : 'bg-white/60 border-[#D2E0D7] opacity-80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            widget.enabled
                              ? 'bg-[#E6F2EB] text-[#1E4332] border border-[#BBD5C6]'
                              : 'bg-[#F2F4F3] text-[#788880] border border-[#DCE2DF]'
                          }`}
                        >
                          {widget.id === 'deep_work_timer' && <Clock className="w-4.5 h-4.5" />}
                          {widget.id === 'gratitude_checkin' && <Heart className="w-4.5 h-4.5" />}
                          {widget.id === 'box_breathing' && <Wind className="w-4.5 h-4.5" />}
                          {widget.id === 'dopamine_shield' && <Shield className="w-4.5 h-4.5" />}
                          {widget.id === 'speed_math_burst' && <Calculator className="w-4.5 h-4.5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs md:text-sm font-bold text-[#13251C]">{widget.title}</h4>
                            <span className="text-[10px] font-mono font-bold text-[#276445] bg-[#E3F2E9] px-1.5 rounded">
                              +{widget.xpReward} XP
                            </span>
                          </div>
                          <p className="text-xs text-[#527061] mt-0.5">{widget.description}</p>
                          <span className="text-[11px] text-[#296849] font-medium block mt-1">
                            🧠 {widget.neuroBenefit}
                          </span>
                        </div>
                      </div>

                      {/* Custom Toggle Switch */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWidgetEnabled(widget.id);
                        }}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                          widget.enabled ? 'bg-[#1E4332]' : 'bg-[#CBDDD2]'
                        }`}
                      >
                        <motion.div
                          animate={{ x: widget.enabled ? 20 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="w-4 h-4 rounded-full bg-white shadow-md"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-white border-t border-[#CBDDD2] flex items-center justify-between">
                <button
                  onClick={resetConfigsToDefault}
                  className="text-xs font-semibold text-[#557163] hover:text-[#183627] underline"
                >
                  Ripristina Predefiniti
                </button>

                <button
                  onClick={() => setCustomizeModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#1E4332] hover:bg-[#163325] text-white text-xs font-bold transition shadow-xs"
                >
                  Salva Personalizzazione
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
