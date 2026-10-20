import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Activity, 
  RotateCw, 
  Check, 
  X, 
  Zap, 
  ChevronLeft, 
  Volume2, 
  Award,
  CircleDot,
  Flame,
  Brain,
  Shield,
  Clock
} from 'lucide-react';
import { watchBridge, WatchState } from '../../utils/watchBridge';
import { soundFx } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';
import { UserProfile } from '../../types';

interface Props {
  profile: UserProfile;
  onAwardXP: (xp: number, summary: string) => void;
  onClose?: () => void;
}

type WatchView = 'watchface' | 'menu' | 'stroop' | 'nback' | 'breathe' | 'math' | 'mantra' | 'results';

export const AppleWatchPlayDevice: React.FC<Props> = ({ profile, onAwardXP, onClose }) => {
  const { t } = useLanguage();
  const [watchState, setWatchState] = useState<WatchState>(watchBridge.getState());
  const [currentView, setCurrentView] = useState<WatchView>('watchface');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [lastEarnedXP, setLastEarnedXP] = useState<number>(0);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameFeedback, setGameFeedback] = useState<string>('');

  // Clock time update
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to watch telemetry
  useEffect(() => {
    const unsub = watchBridge.subscribe((state) => {
      setWatchState(state);
    });
    return () => unsub();
  }, []);

  // --- STROOP MICRO GAME STATE ---
  const [stroopTimer, setStroopTimer] = useState<number>(20);
  const [stroopWord, setStroopWord] = useState<{ text: string; color: string; isMatch: boolean }>({
    text: 'VERDE',
    color: '#22c55e',
    isMatch: true,
  });
  const [stroopStreak, setStroopStreak] = useState<number>(0);
  const stroopIntervalRef = useRef<any>(null);

  const generateStroopPrompt = () => {
    const words = [
      { it: 'ROSSO', en: 'RED', color: '#ef4444' },
      { it: 'BLU', en: 'BLUE', color: '#3b82f6' },
      { it: 'VERDE', en: 'GREEN', color: '#22c55e' },
      { it: 'GIALLO', en: 'YELLOW', color: '#eab308' },
    ];
    const textObj = words[Math.floor(Math.random() * words.length)];
    const isMatch = Math.random() > 0.5;
    let colorObj = textObj;
    if (!isMatch) {
      const others = words.filter((w) => w.color !== textObj.color);
      colorObj = others[Math.floor(Math.random() * others.length)];
    }
    setStroopWord({
      text: textObj.it,
      color: colorObj.color,
      isMatch,
    });
  };

  const startStroopGame = () => {
    setCurrentView('stroop');
    setGameScore(0);
    setStroopStreak(0);
    setStroopTimer(20);
    generateStroopPrompt();
    soundFx.playClick();
    watchBridge.hapticFeedback('tap');

    if (stroopIntervalRef.current) clearInterval(stroopIntervalRef.current);
    stroopIntervalRef.current = setInterval(() => {
      setStroopTimer((prev) => {
        if (prev <= 1) {
          clearInterval(stroopIntervalRef.current);
          finishGame('Stroop Watch Reflex', 90);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStroopAnswer = (userSaysMatch: boolean) => {
    const correct = userSaysMatch === stroopWord.isMatch;
    if (correct) {
      soundFx.playSuccess();
      watchBridge.hapticFeedback('tap');
      setGameScore((s) => s + 10);
      setStroopStreak((st) => st + 1);
    } else {
      soundFx.playError();
      watchBridge.hapticFeedback('warning');
      setStroopStreak(0);
    }
    generateStroopPrompt();
  };

  // --- FLASH MATH GAME STATE ---
  const [mathTimer, setMathTimer] = useState<number>(20);
  const [mathEquation, setMathEquation] = useState<{ q: string; ans: number; options: number[] }>({
    q: '7 + 8',
    ans: 15,
    options: [14, 15, 16],
  });
  const mathIntervalRef = useRef<any>(null);

  const generateMathPrompt = () => {
    const a = Math.floor(Math.random() * 12) + 3;
    const b = Math.floor(Math.random() * 12) + 2;
    const isAdd = Math.random() > 0.4;
    const ans = isAdd ? a + b : Math.max(a, b) - Math.min(a, b);
    const q = isAdd ? `${a} + ${b}` : `${Math.max(a, b)} - ${Math.min(a, b)}`;

    const offset1 = Math.random() > 0.5 ? 1 : -1;
    const offset2 = Math.random() > 0.5 ? 2 : -2;
    const opts = Array.from(new Set([ans, ans + offset1, ans + offset2])).slice(0, 3);
    while (opts.length < 3) {
      opts.push(ans + opts.length + 1);
    }
    opts.sort(() => Math.random() - 0.5);

    setMathEquation({ q, ans, options: opts });
  };

  const startMathGame = () => {
    setCurrentView('math');
    setGameScore(0);
    setMathTimer(20);
    generateMathPrompt();
    soundFx.playClick();
    watchBridge.hapticFeedback('tap');

    if (mathIntervalRef.current) clearInterval(mathIntervalRef.current);
    mathIntervalRef.current = setInterval(() => {
      setMathTimer((prev) => {
        if (prev <= 1) {
          clearInterval(mathIntervalRef.current);
          finishGame('Flash Math Watch', 80);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleMathAnswer = (chosen: number) => {
    if (chosen === mathEquation.ans) {
      soundFx.playSuccess();
      watchBridge.hapticFeedback('tap');
      setGameScore((s) => s + 15);
    } else {
      soundFx.playError();
      watchBridge.hapticFeedback('warning');
    }
    generateMathPrompt();
  };

  // --- BREATHING COHERENCE STATE ---
  const [breathePhase, setBreathePhase] = useState<'Inhala' | 'Trattieni' | 'Espira'>('Inhala');
  const [breatheSeconds, setBreatheSeconds] = useState<number>(30);
  const breatheIntervalRef = useRef<any>(null);

  const startBreatheSession = () => {
    setCurrentView('breathe');
    setBreatheSeconds(30);
    setBreathePhase('Inhala');
    soundFx.playChime();
    watchBridge.hapticFeedback('breathe');

    let step = 0;
    if (breatheIntervalRef.current) clearInterval(breatheIntervalRef.current);

    breatheIntervalRef.current = setInterval(() => {
      step++;
      const mod = step % 12;
      if (mod < 4) {
        setBreathePhase('Inhala');
      } else if (mod < 8) {
        setBreathePhase('Trattieni');
      } else {
        setBreathePhase('Espira');
      }

      if (step % 4 === 0) {
        watchBridge.hapticFeedback('breathe');
      }

      setBreatheSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(breatheIntervalRef.current);
          finishGame('Coerenza Cardiaca Watch', 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // --- MICRO DUAL N-BACK STATE ---
  const [nbackGridActive, setNbackGridActive] = useState<number | null>(null);
  const [nbackHistory, setNbackHistory] = useState<number[]>([]);
  const [nbackScore, setNbackScore] = useState<number>(0);
  const [nbackRounds, setNbackRounds] = useState<number>(8);
  const nbackTimerRef = useRef<any>(null);

  const startNbackGame = () => {
    setCurrentView('nback');
    setNbackScore(0);
    setNbackRounds(8);
    setNbackHistory([]);
    soundFx.playClick();
    watchBridge.hapticFeedback('tap');
    triggerNextNbackStep([]);
  };

  const triggerNextNbackStep = (history: number[]) => {
    const nextPos = Math.floor(Math.random() * 4);
    setNbackGridActive(nextPos);
    soundFx.playFrequency(440 + nextPos * 110, 0.15);
    watchBridge.hapticFeedback('tap');

    const updated = [...history, nextPos];
    setNbackHistory(updated);

    if (nbackTimerRef.current) clearTimeout(nbackTimerRef.current);
    nbackTimerRef.current = setTimeout(() => {
      setNbackGridActive(null);
    }, 1200);
  };

  const handleNbackMatch = () => {
    if (nbackHistory.length >= 2) {
      const current = nbackHistory[nbackHistory.length - 1];
      const previous = nbackHistory[nbackHistory.length - 2];
      if (current === previous) {
        soundFx.playSuccess();
        watchBridge.hapticFeedback('success');
        setNbackScore((s) => s + 25);
      } else {
        soundFx.playError();
        watchBridge.hapticFeedback('warning');
      }
    }
  };

  const finishGame = (title: string, xpBase: number) => {
    const totalXP = xpBase + Math.floor(gameScore * 1.5);
    setLastEarnedXP(totalXP);
    setGameFeedback(`Ottima sessione al polso! +${totalXP} XP sincronizzati.`);
    setCurrentView('results');
    soundFx.playLevelUp();
    watchBridge.hapticFeedback('success');
    onAwardXP(totalXP, title);
  };

  // Digital crown click handler
  const handleDigitalCrown = () => {
    soundFx.playClick();
    watchBridge.hapticFeedback('tap');
    if (currentView === 'watchface') {
      setCurrentView('menu');
    } else if (currentView === 'menu') {
      setCurrentView('watchface');
    } else {
      // Return to menu from games
      if (stroopIntervalRef.current) clearInterval(stroopIntervalRef.current);
      if (mathIntervalRef.current) clearInterval(mathIntervalRef.current);
      if (breatheIntervalRef.current) clearInterval(breatheIntervalRef.current);
      if (nbackTimerRef.current) clearTimeout(nbackTimerRef.current);
      setCurrentView('menu');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 relative">
      {/* Physical Apple Watch Ultra / Series 9 Housing Frame */}
      <div className="relative w-[310px] h-[390px] bg-gradient-to-b from-[#2A2D30] via-[#1E2023] to-[#121416] rounded-[52px] p-4.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.8)] border-4 border-[#3A3F45] flex items-center justify-center select-none">
        
        {/* Physical Digital Crown on the Right */}
        <div
          onClick={handleDigitalCrown}
          className="absolute -right-3.5 top-20 w-4 h-14 bg-gradient-to-r from-[#202224] via-[#4A4E53] to-[#2B2E32] rounded-r-md border border-neutral-600 shadow-md cursor-pointer hover:brightness-125 active:scale-95 transition-all flex flex-col justify-around py-1.5 items-center z-20 group"
          title={t.watchCrownRotate}
        >
          <div className="w-1.5 h-0.5 bg-neutral-400 group-hover:bg-amber-400 rounded-full" />
          <div className="w-1.5 h-0.5 bg-neutral-400 group-hover:bg-amber-400 rounded-full" />
          <div className="w-1.5 h-0.5 bg-neutral-400 group-hover:bg-amber-400 rounded-full" />
          <div className="w-1.5 h-0.5 bg-neutral-400 group-hover:bg-amber-400 rounded-full" />
        </div>

        {/* Physical Side Button */}
        <div
          onClick={handleDigitalCrown}
          className="absolute -right-2 bottom-24 w-2.5 h-11 bg-neutral-700 rounded-r-sm border border-neutral-600 cursor-pointer active:brightness-75 z-20"
        />

        {/* Left Orange Action Button (Apple Watch Ultra Style) */}
        <div
          onClick={() => {
            soundFx.playClick();
            watchBridge.hapticFeedback('tap');
            startBreatheSession();
          }}
          className="absolute -left-2 top-24 w-2.5 h-12 bg-amber-600 hover:bg-amber-500 rounded-l-sm border border-amber-700 cursor-pointer active:brightness-90 z-20"
          title="Tasto Azione Rapida: Respiro"
        />

        {/* Retina OLED Screen Display Area */}
        <div className="w-full h-full bg-black rounded-[38px] overflow-hidden relative flex flex-col text-white border border-neutral-900 shadow-inner font-sans">
          
          {/* Top Status Bar (Time, Heart Rate, GCI) */}
          <div className="h-6 px-4 flex items-center justify-between text-[11px] font-semibold text-neutral-300 z-20 pt-1 shrink-0">
            <span className="font-mono">{currentTime}</span>
            <div className="flex items-center gap-1.5 text-rose-400">
              <Heart className="w-3 h-3 fill-rose-500 animate-pulse" />
              <span className="font-mono text-[10px]">{watchState.biometrics.heartRate}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold font-mono">
              ⚡{profile?.gci ?? 720}
            </span>
          </div>

          {/* SCREEN CONTENT ROUTER */}
          <div className="flex-1 px-3 py-1 flex flex-col overflow-y-auto relative">
            <AnimatePresence mode="wait">
              
              {/* VIEW 1: WATCH FACE (HOME) */}
              {currentView === 'watchface' && (
                <motion.div
                  key="watchface"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col justify-between items-center text-center py-2"
                >
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#52826A] block">
                      LUANCER COMPANION
                    </span>
                    <div className="text-3xl font-extrabold tracking-tight font-mono text-white mt-0.5">
                      {currentTime}
                    </div>
                  </div>

                  {/* Circular Complications Ring */}
                  <div className="grid grid-cols-2 gap-2 w-full px-2 my-1">
                    <div 
                      onClick={() => setCurrentView('breathe')}
                      className="p-2 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col items-center cursor-pointer hover:border-emerald-500 transition active:scale-95"
                    >
                      <Activity className="w-4 h-4 text-emerald-400 mb-0.5" />
                      <span className="text-[9px] text-neutral-400">HRV {watchState.biometrics.hrv}ms</span>
                      <span className="text-[10px] font-bold text-white">Respiro</span>
                    </div>

                    <div 
                      onClick={() => setCurrentView('menu')}
                      className="p-2 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col items-center cursor-pointer hover:border-amber-500 transition active:scale-95"
                    >
                      <Brain className="w-4 h-4 text-amber-400 mb-0.5" />
                      <span className="text-[9px] text-neutral-400">Palestra</span>
                      <span className="text-[10px] font-bold text-white">Micro-Giochi</span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      watchBridge.hapticFeedback('tap');
                      setCurrentView('menu');
                    }}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#24523C] to-[#3B7258] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Gioca al Polso</span>
                  </button>
                </motion.div>
              )}

              {/* VIEW 2: WATCH MICRO-GAMES MENU */}
              {currentView === 'menu' && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col space-y-1.5 py-1"
                >
                  <div className="flex items-center justify-between pb-1">
                    <button
                      onClick={() => setCurrentView('watchface')}
                      className="text-neutral-400 hover:text-white p-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-bold text-neutral-300 uppercase">Micro-Giochi</span>
                    <div className="w-4" />
                  </div>

                  {/* Game 1: Stroop Reflex */}
                  <button
                    onClick={startStroopGame}
                    className="w-full p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 flex items-center gap-2 text-left transition active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate">Stroop Reflex</span>
                      <span className="text-[9px] text-neutral-400 block truncate">Riflessi colore al polso</span>
                    </div>
                  </button>

                  {/* Game 2: Flash Math */}
                  <button
                    onClick={startMathGame}
                    className="w-full p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 flex items-center gap-2 text-left transition active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate">Flash Math Watch</span>
                      <span className="text-[9px] text-neutral-400 block truncate">Calcolo mentale rapido</span>
                    </div>
                  </button>

                  {/* Game 3: Cardiac Coherence */}
                  <button
                    onClick={startBreatheSession}
                    className="w-full p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-sky-500/50 flex items-center gap-2 text-left transition active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate">Coerenza Cardiaca</span>
                      <span className="text-[9px] text-neutral-400 block truncate">Respiro aptico 30s</span>
                    </div>
                  </button>

                  {/* Game 4: Micro Dual N-Back */}
                  <button
                    onClick={startNbackGame}
                    className="w-full p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-purple-500/50 flex items-center gap-2 text-left transition active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                      <Brain className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate">Micro N-Back (4-Pod)</span>
                      <span className="text-[9px] text-neutral-400 block truncate">Memoria di lavoro</span>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* GAME VIEW: STROOP REFLEX */}
              {currentView === 'stroop' && (
                <motion.div
                  key="stroop-game"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex-1 flex flex-col justify-between items-center py-1"
                >
                  <div className="w-full flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="font-mono">⏳ {stroopTimer}s</span>
                    <span className="font-bold text-emerald-400 font-mono">Punti: {gameScore}</span>
                  </div>

                  {/* Stimulus word */}
                  <div className="my-auto text-center">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-1">
                      Il Colore Corrisponde?
                    </span>
                    <div
                      className="text-2xl font-black tracking-wider transition-all"
                      style={{ color: stroopWord.color }}
                    >
                      {stroopWord.text}
                    </div>
                    {stroopStreak > 1 && (
                      <span className="text-[9px] text-amber-400 font-bold block mt-1">
                        🔥 Streak x{stroopStreak}
                      </span>
                    )}
                  </div>

                  {/* 2 Big Touch Buttons for Watch */}
                  <div className="grid grid-cols-2 gap-2 w-full pb-1">
                    <button
                      onClick={() => handleStroopAnswer(false)}
                      className="py-3 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-bold active:scale-90 transition flex items-center justify-center gap-1"
                    >
                      <X className="w-4 h-4 text-rose-400" />
                      <span>NO</span>
                    </button>
                    <button
                      onClick={() => handleStroopAnswer(true)}
                      className="py-3 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs font-bold active:scale-90 transition flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>SÌ</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* GAME VIEW: FLASH MATH */}
              {currentView === 'math' && (
                <motion.div
                  key="math-game"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex-1 flex flex-col justify-between items-center py-1"
                >
                  <div className="w-full flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="font-mono">⏳ {mathTimer}s</span>
                    <span className="font-bold text-amber-400 font-mono">Punti: {gameScore}</span>
                  </div>

                  <div className="my-auto text-center">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-1">
                      Risolvi al Volo
                    </span>
                    <div className="text-3xl font-black text-white tracking-wider font-mono">
                      {mathEquation.q} = ?
                    </div>
                  </div>

                  {/* 3 Answer Choice Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 w-full pb-1">
                    {mathEquation.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleMathAnswer(opt)}
                        className="py-3 rounded-2xl bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-amber-300 text-sm font-bold font-mono active:scale-90 transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* GAME VIEW: CARDIAC COHERENCE */}
              {currentView === 'breathe' && (
                <motion.div
                  key="breathe-game"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex-1 flex flex-col justify-between items-center py-1 text-center"
                >
                  <div className="w-full flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="font-mono">⏳ {breatheSeconds}s</span>
                    <span className="text-rose-400 font-mono flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-rose-500 animate-pulse" />
                      {watchState.biometrics.heartRate} BPM
                    </span>
                  </div>

                  {/* Pulsing Breathing Circle */}
                  <div className="relative my-auto flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: breathePhase === 'Inhala' ? [1, 1.45] : breathePhase === 'Espira' ? [1.45, 1] : 1.45,
                      }}
                      transition={{ duration: 4, ease: 'easeInOut' }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-sky-500/30 border-2 border-emerald-400/80 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                    >
                      <span className="text-xs font-bold text-white tracking-wide">
                        {breathePhase}
                      </span>
                    </motion.div>
                  </div>

                  <span className="text-[9px] text-neutral-400 pb-1">
                    Sincronizza il battito con il ritmo aptico
                  </span>
                </motion.div>
              )}

              {/* GAME VIEW: MICRO DUAL N-BACK */}
              {currentView === 'nback' && (
                <motion.div
                  key="nback-game"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex-1 flex flex-col justify-between items-center py-1"
                >
                  <div className="w-full flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="font-mono">N-Back (1-Back)</span>
                    <span className="font-bold text-purple-400 font-mono">Punti: {nbackScore}</span>
                  </div>

                  {/* 2x2 Watch Quadrant Grid */}
                  <div className="grid grid-cols-2 gap-2 w-32 h-32 my-auto">
                    {[0, 1, 2, 3].map((pos) => {
                      const isActive = nbackGridActive === pos;
                      return (
                        <div
                          key={pos}
                          className={`rounded-2xl border transition-all flex items-center justify-center ${
                            isActive
                              ? 'bg-purple-500 border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.8)] scale-105'
                              : 'bg-neutral-900 border-neutral-800'
                          }`}
                        >
                          {isActive && <CircleDot className="w-5 h-5 text-white animate-ping" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full grid grid-cols-2 gap-2 pb-1">
                    <button
                      onClick={() => triggerNextNbackStep(nbackHistory)}
                      className="py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-[10px] font-bold text-neutral-300 active:scale-95"
                    >
                      Prossimo
                    </button>
                    <button
                      onClick={handleNbackMatch}
                      className="py-2.5 rounded-xl bg-purple-900 border border-purple-600 text-[10px] font-bold text-purple-200 active:scale-95"
                    >
                      ⚡ CORRISPONDE
                    </button>
                  </div>
                </motion.div>
              )}

              {/* VIEW: RESULTS & SYNC */}
              {currentView === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex-1 flex flex-col justify-between items-center text-center py-2"
                >
                  <div className="pt-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto mb-1">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      SESSIONE COMPLETATA
                    </span>
                    <div className="text-xl font-extrabold text-white mt-0.5">
                      +{lastEarnedXP} XP
                    </div>
                  </div>

                  <p className="text-[10px] text-neutral-300 px-2 line-clamp-2">
                    {gameFeedback}
                  </p>

                  <button
                    onClick={() => setCurrentView('menu')}
                    className="w-full py-2 rounded-full bg-neutral-900 border border-neutral-700 hover:border-emerald-500 text-white text-xs font-bold active:scale-95 transition"
                  >
                    Torna al Menu
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Bottom Watch Bezel Indicator */}
          <div className="h-2 w-full flex items-center justify-center shrink-0 pb-1">
            <div className="w-8 h-1 bg-neutral-800 rounded-full" />
          </div>
        </div>
      </div>

      {/* Control Tips below watch */}
      <div className="mt-3 text-center text-xs text-[#597568] flex items-center gap-3">
        <span className="flex items-center gap-1">
          <RotateCw className="w-3.5 h-3.5 text-[#24523C]" />
          Tocca la <strong>Digital Crown</strong> a destra per uscire/menu
        </span>
      </div>
    </div>
  );
};
