import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../utils/audio';
import { UserProfile, GameSessionResult, CharacterTraits, ActiveTab } from '../types';
import { 
  Brain, 
  Zap, 
  Shield, 
  Flame, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Compass, 
  HeartPulse, 
  Trophy,
  Target,
  BookOpen,
  Calendar,
  Clock,
  Circle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { DualNBackGame } from './games/DualNBackGame';
import { StroopGame } from './games/StroopGame';
import { CharacterDilemmaView } from './character/CharacterDilemmaView';
import { NeuroBreathingView } from './character/NeuroBreathingView';
import { DeepWorkSession } from './character/DeepWorkSession';
import { RealLifeChallengesView } from './character/RealLifeChallengesView';
import { EveningStoicJournalView } from './character/EveningStoicJournalView';
import { DailyChallengeHeroCard } from './character/DailyChallengeHeroCard';
import { CognitiveFocusWidgets } from './character/CognitiveFocusWidgets';
import { PersonalJourneyPaceCard } from './character/PersonalJourneyPaceCard';
import { MLReceptivityCard } from './MLReceptivityCard';
import { MicroWorkoutPlan } from '../types';

interface Props {
  profile: UserProfile;
  onRecordSession: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onUpdateTraits: (delta: Partial<CharacterTraits>, xp: number) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onRefreshProfile?: () => void;
  onOpenReminderSettings?: () => void;
  onLaunchMicroWorkout?: (plan: MicroWorkoutPlan) => void;
  onOpenAccountMenu?: () => void;
  onOpenAuth?: () => void;
  isLoggedIn?: boolean;
}

export const DailyWorkout: React.FC<Props> = ({
  profile,
  onRecordSession,
  onUpdateTraits,
  onNavigateTab,
  onRefreshProfile,
  onOpenReminderSettings,
  onLaunchMicroWorkout,
  onOpenAccountMenu = () => {},
  onOpenAuth = () => {},
  isLoggedIn = false,
}) => {
  const [activeView, setActiveView] = useState<
    'none' | 'dual-n-back' | 'stroop' | 'dilemma' | 'breathing' | 'deep-work' | 'challenges' | 'journal'
  >('none');
  const [completedRoutine, setCompletedRoutine] = useState<string[]>(['deep-focus']);

  const toggleRoutine = (key: string) => {
    if (!completedRoutine.includes(key)) {
      setCompletedRoutine([...completedRoutine, key]);
    }
  };

  if (activeView === 'deep-work') {
    return (
      <DeepWorkSession
        onComplete={(xp) => {
          onUpdateTraits({ temperance: 6, emotionalMastery: 4 }, xp);
          toggleRoutine('deep-focus');
          setActiveView('none');
        }}
        onExit={() => setActiveView('none')}
      />
    );
  }

  if (activeView === 'dual-n-back') {
    return (
      <DualNBackGame
        onComplete={(res) => {
          onRecordSession(res);
          toggleRoutine('cognitive');
          setActiveView('none');
        }}
        onExit={() => setActiveView('none')}
      />
    );
  }

  if (activeView === 'stroop') {
    return (
      <StroopGame
        onComplete={(res) => {
          onRecordSession(res);
          toggleRoutine('speed');
          setActiveView('none');
        }}
        onExit={() => setActiveView('none')}
      />
    );
  }

  if (activeView === 'dilemma') {
    return (
      <CharacterDilemmaView
        onComplete={(delta, xp) => {
          onUpdateTraits(delta, xp);
          toggleRoutine('character');
          setActiveView('none');
        }}
        onExit={() => setActiveView('none')}
      />
    );
  }

  if (activeView === 'breathing') {
    return (
      <NeuroBreathingView
        onComplete={(xp) => {
          onUpdateTraits({ emotionalMastery: 8 }, xp);
          toggleRoutine('breathing');
          setActiveView('none');
        }}
        onExit={() => setActiveView('none')}
      />
    );
  }

  if (activeView === 'challenges') {
    return (
      <RealLifeChallengesView
        profile={profile}
        onUpdateProfile={() => {
          if (onRefreshProfile) onRefreshProfile();
        }}
        onExit={() => setActiveView('none')}
      />
    );
  }

  if (activeView === 'journal') {
    return (
      <EveningStoicJournalView
        profile={profile}
        onUpdateProfile={() => {
          if (onRefreshProfile) onRefreshProfile();
          toggleRoutine('journal');
        }}
        onExit={() => setActiveView('none')}
      />
    );
  }

  const handleLaunchMicro = (plan: MicroWorkoutPlan) => {
    soundFx.playPowerUp();
    if (plan.id === 'stroop_blitz') {
      setActiveView('stroop');
    } else if (plan.id === 'vagal_sigh') {
      setActiveView('breathing');
    } else if (plan.id === 'altruism_kindness') {
      setActiveView('challenges');
    } else if (plan.id === 'stoic_contemplation') {
      setActiveView('dilemma');
    } else {
      setActiveView('stroop');
    }
    if (onLaunchMicroWorkout) {
      onLaunchMicroWorkout(plan);
    }
  };

  const todayChallengesCount = profile.completedChallenges?.length || 0;
  const todayJournal = profile.journalEntries?.find(e => e.date === new Date().toISOString().split('T')[0]);

  return (
    <div id="daily-workout-view" className="space-y-4 pb-20">
      {/* Hero: Human Growth & Discipline Status */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#163325] via-[#1E4332] to-[#2B5340] border border-[#3E6C55] p-5 shadow-sm text-white overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-[#578E72]/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#52D195] animate-ping"></span>
            <span className="text-[11px] font-bold text-[#D0EADB] uppercase tracking-wider">
              Piano di Crescita Quotidiano
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F6C667]/20 border border-[#F6C667]/40 px-2.5 py-1 rounded-full text-[#FDE4A9] text-xs font-bold font-mono shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-[#F6C667] text-[#F6C667]" /> {profile.streak} Giorni di Costanza
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <span className="text-xs text-[#BED8CA] block mb-0.5 font-medium">Indice di Sviluppo Umano (GCI)</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">{profile.gci}</span>
              <span className="text-xs text-[#8EC4A8] font-bold">/ 1000</span>
            </div>
            <span className="text-[10px] text-[#A6E8C6] font-semibold flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3" /> Costruzione abitudini attiva
            </span>
          </div>

          <div className="bg-[#0F261B]/60 border border-[#2B5540] rounded-2xl p-3 flex flex-col justify-center text-center backdrop-blur-xs">
            <span className="text-[10px] text-[#A5C8B7] uppercase tracking-wider block font-medium">Punteggio Virtù & Tempra</span>
            <span className="text-2xl font-black text-[#6FE2A8] my-0.5">{profile.scores.character} pt</span>
            <span className="text-[9px] text-[#8EAFA0]">carattere & disciplina</span>
          </div>
        </div>

        {/* XP Progress to Next Level */}
        <div className="mt-3.5 pt-3 border-t border-[#2D5540]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#D3E8DC] font-medium">Livello {profile.level}: <strong className="text-[#7CEAB3]">{profile.title}</strong></span>
            <span className="text-[#A5C9B7] font-mono">{profile.xp} / {profile.xpToNextLevel} XP</span>
          </div>
          <div className="h-2 w-full bg-[#0E2319] rounded-full overflow-hidden border border-[#2A523E]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (profile.xp / profile.xpToNextLevel) * 100)}%` }}
              className="h-full bg-gradient-to-r from-[#4EAA7E] to-[#6EE2A8] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Il Tuo Passo & Partenza da Zero • Ognuno ha il suo ritmo */}
      <PersonalJourneyPaceCard
        profile={profile}
        onOpenAccountMenu={onOpenAccountMenu}
        onOpenAuth={onOpenAuth}
        isLoggedIn={isLoggedIn}
      />

      {/* Real-time ML Circadian Receptivity Engine */}
      <MLReceptivityCard
        profile={profile}
        onOpenSettings={() => {
          if (onOpenReminderSettings) onOpenReminderSettings();
        }}
        onLaunchMicroWorkout={handleLaunchMicro}
      />

      {/* Featured Sfida del Giorno: Altruismo & Gestione dello Stress */}
      <DailyChallengeHeroCard
        profile={profile}
        onUpdateProfile={() => {
          if (onRefreshProfile) onRefreshProfile();
          toggleRoutine('challenges');
        }}
        onViewAllChallenges={() => setActiveView('challenges')}
      />

      {/* Interactive Cognitive Focus Widgets (Personalizzabili & Toggleabili) */}
      <CognitiveFocusWidgets
        profile={profile}
        onUpdateTraits={onUpdateTraits}
        onRefreshProfile={onRefreshProfile}
        onLaunchFullDeepWork={() => setActiveView('deep-work')}
        onLaunchFullJournal={() => setActiveView('journal')}
        onLaunchFullBreathing={() => setActiveView('breathing')}
      />

      {/* Routine Quotidiana Umana */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-bold text-[#14261D] uppercase tracking-wider">I 4 Pilastri di Oggi</h3>
            <span className="text-xs text-[#557163]">Focus, Mente, Sfida Reale e Riflessione Serale</span>
          </div>
          <span className="text-xs font-mono font-bold text-[#1F4E37] bg-[#D4E8DC] border border-[#B3D1C0] px-2.5 py-1 rounded-full shadow-xs">
            {completedRoutine.length} / 4
          </span>
        </div>

        {/* 1. Deep Work Sprint (Focus & Disciplina) */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveView('deep-work');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E5F2EC] border border-[#BBD5C6] flex items-center justify-center text-[#1E4332] group-hover:scale-105 transition shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#1E4332] uppercase tracking-wider">1. Focus & Flow</span>
                {completedRoutine.includes('deep-focus') && <CheckCircle2 className="w-3.5 h-3.5 text-[#2A8255]" />}
              </div>
              <h4 className="text-sm font-bold text-[#122219]">Sessione Deep Work & Timer</h4>
              <p className="text-xs text-[#597568]">25 o 45 min di concentrazione senza distrazioni</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full bg-[#E5F2EC] text-[#224E39] flex items-center justify-center group-hover:bg-[#1E4332] group-hover:text-white transition shadow-xs">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>

        {/* 2. Sfida Reale del Giorno (Comfort Zone) */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveView('challenges');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FBF2E3] border border-[#E9CE9E] flex items-center justify-center text-[#8C5D19] group-hover:scale-105 transition shadow-2xs">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#8C5D19] uppercase tracking-wider">2. Vita Reale</span>
                {todayChallengesCount > 0 && <span className="text-[10px] text-[#8C5D19] font-mono">({todayChallengesCount} completate)</span>}
              </div>
              <h4 className="text-sm font-bold text-[#122219]">Micro-Sfida nel Mondo Reale</h4>
              <p className="text-xs text-[#597568]">Doccia fredda, zero schermi al risveglio, ascolto attivo</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8EAFA0] group-hover:text-[#8C5D19] transition" />
        </div>

        {/* 3. Allenamento Cognitivo (Memoria di Lavoro) */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveView('dual-n-back');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F2EB] border border-[#BBD5C6] flex items-center justify-center text-[#26533D] group-hover:scale-105 transition shadow-2xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#2C6249] uppercase tracking-wider">3. Lucidità Mentale</span>
                {completedRoutine.includes('cognitive') && <CheckCircle2 className="w-3.5 h-3.5 text-[#2A8255]" />}
              </div>
              <h4 className="text-sm font-bold text-[#122219]">Dual N-Back Neuro-Scientifico</h4>
              <p className="text-xs text-[#597568]">Espande la memoria di lavoro e la capacità di calcolo</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full bg-[#E5F2EC] text-[#224E39] flex items-center justify-center group-hover:bg-[#1E4332] group-hover:text-white transition shadow-xs">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>

        {/* 4. Diario Serale Stoico & Auto-Esame */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveView('journal');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F2EEF8] border border-[#D5CBE3] flex items-center justify-center text-[#59427C] group-hover:scale-105 transition shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#59427C] uppercase tracking-wider">4. Revisione Serale</span>
                {todayJournal && <CheckCircle2 className="w-3.5 h-3.5 text-[#2A8255]" />}
              </div>
              <h4 className="text-sm font-bold text-[#122219]">Diario di Auto-Esame (Seneca)</h4>
              <p className="text-xs text-[#597568]">Vittorie di oggi, dove hai ceduto e gratitudine</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8EAFA0] group-hover:text-[#59427C] transition" />
        </div>
      </div>

      {/* Quick Access to Coach & Persona Hub */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => {
            soundFx.playClick();
            onNavigateTab('character');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-left transition-all shadow-sm hover:shadow-md group active:scale-[0.98] cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#E8F2EC] border border-[#BBD5C6] flex items-center justify-center text-[#234E3A] mb-2 group-hover:scale-105 transition">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#122219] block">18 Pilastri della Psiche</span>
          <span className="text-[11px] text-[#597568]">Confini, stress, sonno & virtù</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            onNavigateTab('coach');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-left transition-all shadow-sm hover:shadow-md group active:scale-[0.98] cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FBF2E3] border border-[#E9CE9E] flex items-center justify-center text-[#8C5D19] mb-2 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#122219] block">Mentore Personale</span>
          <span className="text-[11px] text-[#597568]">Guida & Consiglio</span>
        </button>
      </div>
    </div>
  );
};

