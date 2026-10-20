import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { Play, Pause, RotateCcw, CheckCircle2, ArrowLeft, Headphones, Bell, Sparkles, Volume2, ShieldCheck, Flame } from 'lucide-react';

interface Props {
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

export const DeepWorkSession: React.FC<Props> = ({ onComplete, onExit }) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>('');
  const [soundTrack, setSoundTrack] = useState<'off' | 'alpha' | 'theta'>('alpha');
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  // Checklists
  const [checklist, setChecklist] = useState({
    phoneAway: false,
    singleTab: false,
    waterReady: false,
  });

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      soundFx.playSuccess();
      setCompletedSessions((prev) => prev + 1);
      onComplete(160);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    soundFx.playClick();
    if (!isRunning && timeLeft === 0) {
      setTimeLeft(durationMinutes * 60);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = (mins: number) => {
    soundFx.playClick();
    setIsRunning(false);
    setDurationMinutes(mins);
    setTimeLeft(mins * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100;

  return (
    <div id="deep-work-session-view" className="space-y-4 max-w-md mx-auto pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-2xl p-3.5 shadow-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-xs font-semibold text-[#3D5B4D] hover:text-[#122219] transition"
        >
          <ArrowLeft className="w-4 h-4" /> Esci
        </button>
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#1E4332]" />
          <span className="text-xs font-bold text-[#122219]">Sessione Deep Work</span>
        </div>
        <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-2 py-0.5 rounded-full border border-[#CBDDD2]">
          {completedSessions} Svolte
        </span>
      </div>

      {/* Timer Display Card */}
      <div className="bg-white border border-[#CBDDD2] rounded-3xl p-6 shadow-sm text-center space-y-4">
        {/* Preset Selector */}
        <div className="flex items-center justify-center gap-2">
          {[
            { label: '25 min (Pomodoro)', mins: 25 },
            { label: '45 min (Flow Profondo)', mins: 45 },
            { label: '15 min (Sprint)', mins: 15 },
          ].map((preset) => (
            <button
              key={preset.mins}
              onClick={() => resetTimer(preset.mins)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                durationMinutes === preset.mins
                  ? 'bg-[#1E4332] text-white font-bold shadow-xs'
                  : 'bg-[#F7FAF8] text-[#597568] border border-[#CBDDD2] hover:bg-[#EAF3EE]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Big Circular/Digital Clock Display */}
        <div className="relative py-4">
          <div className="w-48 h-48 mx-auto rounded-full bg-[#FAFDFB] border-4 border-[#CBDDD2] flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            {/* Progress Arc simulation */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-[#E5F2EC] transition-all duration-1000 -z-0"
              style={{ height: `${progressPercent}%` }}
            />
            
            <div className="relative z-10">
              <span className="text-4xl font-extrabold font-mono text-[#122219] tracking-tight">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#597568] block mt-1 tracking-wider">
                {isRunning ? 'Focus Attivo' : 'In Pausa'}
              </span>
            </div>
          </div>
        </div>

        {/* Task Input */}
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Su quale compito singolo vuoi concentrarti? (es. Scrivere relazione)"
          className="w-full p-3 rounded-2xl bg-[#FAFDFB] border border-[#CBDDD2] text-xs text-center text-[#122219] focus:outline-none focus:border-[#1E4332] placeholder-[#8EAFA0]"
        />

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={toggleTimer}
            className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 ${
              isRunning
                ? 'bg-[#8C5D19] hover:bg-[#A87224] text-white'
                : 'bg-[#1E4332] hover:bg-[#2A5741] text-white'
            }`}
          >
            {isRunning ? <><Pause className="w-4 h-4" /> Pausa</> : <><Play className="w-4 h-4 fill-white" /> Inizia Focus</>}
          </button>

          <button
            onClick={() => resetTimer(durationMinutes)}
            className="p-3.5 rounded-2xl bg-[#F7FAF8] hover:bg-[#EAF3EE] border border-[#CBDDD2] text-[#597568] hover:text-[#122219] transition cursor-pointer"
            title="Azzera Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pre-Flight Checklist */}
      <div className="bg-white border border-[#CBDDD2] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1E4332]" />
          <h3 className="text-xs font-bold text-[#122219] uppercase tracking-wider">Checklist Anti-Distrazione</h3>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { key: 'phoneAway', label: 'Smartphone in un\'altra stanza o in modalità aereo' },
            { key: 'singleTab', label: 'Una sola finestra/attività aperta (vietato il multitasking)' },
            { key: 'waterReady', label: 'Bicchiere d\'acqua o tè pronto per non alzarsi' },
          ].map((item) => {
            const isChecked = checklist[item.key as keyof typeof checklist];
            return (
              <button
                key={item.key}
                onClick={() => {
                  soundFx.playClick();
                  setChecklist({ ...checklist, [item.key]: !isChecked });
                }}
                className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                  isChecked
                    ? 'bg-[#E5F2EC] border-[#CBDDD2] text-[#122219] font-medium'
                    : 'bg-[#FAFDFB] border-[#CBDDD2] text-[#597568]'
                }`}
              >
                <span>{item.label}</span>
                <CheckCircle2 className={`w-4 h-4 ${isChecked ? 'text-[#1E4332]' : 'text-[#CBDDD2]'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
