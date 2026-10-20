import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { loadProfile, recordGameSession, updateCharacterTraits } from './utils/storage';
import { soundFx } from './utils/audio';
import { watchBridge, WatchState } from './utils/watchBridge';
import { UserProfile, ActiveTab, GameSessionResult, CharacterTraits } from './types';
import { DailyWorkout } from './components/DailyWorkout';
import { BrainGamesHub } from './components/games/BrainGamesHub';
import { CharacterGymHub } from './components/character/CharacterGymHub';
import { AICoachDialogue } from './components/AICoachDialogue';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { BinauralModal } from './components/BinauralModal';
import { LanguageModal } from './components/LanguageModal';
import { SmartwatchHubModal } from './components/watch/SmartwatchHubModal';
import { LuancerLogo } from './components/LuancerLogo';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { 
  Flame, 
  Brain, 
  Shield, 
  Sparkles, 
  BarChart3, 
  Headphones, 
  Volume2, 
  VolumeX, 
  Zap, 
  Activity,
  Watch,
  Globe
} from 'lucide-react';

import { SmartNudgeBanner } from './components/SmartNudgeBanner';
import { SmartReminderMLModal } from './components/SmartReminderMLModal';
import { smartNotificationEngine } from './utils/smartNotificationEngine';
import { MicroWorkoutPlan } from './types';

function AppContent() {
  const { t, currentLanguageOption } = useLanguage();
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [activeTab, setActiveTab] = useState<ActiveTab>('workout');
  const [binauralOpen, setBinauralOpen] = useState<boolean>(false);
  const [languageOpen, setLanguageOpen] = useState<boolean>(false);
  const [watchOpen, setWatchOpen] = useState<boolean>(false);
  const [reminderModalOpen, setReminderModalOpen] = useState<boolean>(false);
  const [activeNudge, setActiveNudge] = useState<{
    plan: MicroWorkoutPlan;
    receptivityScore: number;
    reason: string;
    isTest?: boolean;
  } | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [watchState, setWatchState] = useState<WatchState>(watchBridge.getState());

  useEffect(() => {
    // Initial profile load
    const loaded = loadProfile();
    setProfile(loaded);

    // Watch telemetry subscription
    const unsubWatch = watchBridge.subscribe((state) => {
      setWatchState(state);
    });

    // Subscribe to ML Smart Notification Engine
    const unsubNudge = smartNotificationEngine.subscribe((nudge) => {
      setActiveNudge(nudge);
    });

    // Schedule next smart reminder
    smartNotificationEngine.scheduleNextSmartReminder(loaded);

    return () => {
      unsubWatch();
      unsubNudge();
    };
  }, []);

  const handleRecordSession = (sessionData: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => {
    const updated = recordGameSession(sessionData);
    setProfile(updated);
  };

  const handleUpdateTraits = (delta: Partial<CharacterTraits>, xp: number) => {
    const updated = updateCharacterTraits(delta, xp);
    setProfile(updated);
  };

  const handleAwardWatchXP = (xp: number, summary: string) => {
    const updated = updateCharacterTraits(
      { temperance: 3, resilience: 3, emotionalMastery: 3, wisdom: 2 },
      xp
    );
    setProfile(updated);
  };

  const handleTabChange = (tab: ActiveTab) => {
    soundFx.playClick();
    setActiveTab(tab);
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    soundFx.setMuted(nextMuted);
  };

  const handleLaunchMicroWorkout = (plan: MicroWorkoutPlan) => {
    soundFx.playPowerUp();
    setActiveTab('workout');
  };

  return (
    <div id="luancer-app" className="min-h-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(140,195,165,0.22),rgba(229,239,233,1))] text-[#122019] flex flex-col items-center selection:bg-[#34654D] selection:text-white font-sans antialiased">
      {/* ML Smart Nudge Notification Floating Banner */}
      <SmartNudgeBanner
        nudge={activeNudge}
        onLaunch={handleLaunchMicroWorkout}
        onDismiss={() => setActiveNudge(null)}
      />

      {/* Main Responsive Shell Wrapper */}
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl min-h-screen flex flex-col bg-[#EBF3EE] shadow-2xl relative border-x border-[#CBDDD2] md:my-3 md:rounded-3xl md:overflow-hidden md:border">
        
        {/* Top App Bar with Luancer Logo at the top-left */}
        <header className="sticky top-0 z-40 bg-[#E8F1EC]/94 backdrop-blur-xl border-b border-[#CBDDD2] px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
          {/* Zone 1: Luancer Brand Wordmark / Emblem (in cima a sinistra) */}
          <div className="flex items-center">
            <button
              onClick={() => handleTabChange('workout')}
              className="text-left focus:outline-none transition active:scale-98"
              title="Luancer Brain Trainer - Home"
            >
              <LuancerLogo variant="header" showTagline={true} />
            </button>
          </div>

          {/* Zone 2: Desktop / Tablet Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#DCEAE1] p-1 rounded-2xl border border-[#C6DCCE]">
            <button
              onClick={() => handleTabChange('workout')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'workout'
                  ? 'bg-white text-[#122B1E] shadow-xs'
                  : 'text-[#4A6D5B] hover:text-[#183627] hover:bg-white/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t.tabToday}</span>
            </button>

            <button
              onClick={() => handleTabChange('games')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'games'
                  ? 'bg-white text-[#122B1E] shadow-xs'
                  : 'text-[#4A6D5B] hover:text-[#183627] hover:bg-white/50'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{t.tabGames}</span>
            </button>

            <button
              onClick={() => handleTabChange('character')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'character'
                  ? 'bg-[#FBEED7] text-[#784E1A] shadow-xs'
                  : 'text-[#4A6D5B] hover:text-[#183627] hover:bg-white/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.tabCharacter}</span>
            </button>

            <button
              onClick={() => handleTabChange('coach')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'coach'
                  ? 'bg-white text-[#122B1E] shadow-xs'
                  : 'text-[#4A6D5B] hover:text-[#183627] hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.tabCoach}</span>
            </button>

            <button
              onClick={() => handleTabChange('analytics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-white text-[#122B1E] shadow-xs'
                  : 'text-[#4A6D5B] hover:text-[#183627] hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.tabAnalytics}</span>
            </button>
          </nav>

          {/* Zone 3: Utility Controls & Audio / Wearables */}
          <div className="flex items-center gap-1.5">
            {/* Smart Watch Companion Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setWatchOpen(true);
              }}
              className={`p-1.5 px-2.5 rounded-xl border flex items-center gap-1.5 shadow-2xs transition active:scale-95 ${
                watchState.isConnected
                  ? 'bg-[#1E4332] text-[#F6C667] border-[#1E4332]'
                  : 'bg-white/90 hover:bg-white border-[#CBDDD2] text-[#294B3C]'
              }`}
              title={t.watchTooltip}
            >
              <Watch className="w-4 h-4" />
              {watchState.isConnected ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <span className="text-[11px] font-bold hidden sm:inline">Watch</span>
              )}
            </button>

            {/* Binaural Beats Frequency Drawer */}
            <button
              onClick={() => setBinauralOpen(true)}
              className="p-2 rounded-xl bg-white/90 hover:bg-white border border-[#CBDDD2] text-[#294B3C] hover:text-[#183226] shadow-2xs transition active:scale-95"
              title={t.binauralTooltip}
            >
              <Headphones className="w-4 h-4" />
            </button>

            {/* Sound Mute / Unmute */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-white/90 hover:bg-white border border-[#CBDDD2] text-[#557163] hover:text-[#122019] shadow-2xs transition active:scale-95"
              title={muted ? t.soundUnmuteTooltip : t.soundMuteTooltip}
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => {
                soundFx.playClick();
                setLanguageOpen(true);
              }}
              className="p-1.5 px-2 rounded-xl bg-white/90 hover:bg-white border border-[#CBDDD2] text-[#294B3C] hover:text-[#183226] shadow-2xs transition active:scale-95 flex items-center gap-1"
              title={t.languageTooltip}
            >
              <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
              <span className="text-[10px] font-bold uppercase">{currentLanguageOption.code}</span>
            </button>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 p-3.5 md:p-6 pb-24 md:pb-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'workout' && (
                <DailyWorkout
                  profile={profile}
                  onRecordSession={handleRecordSession}
                  onUpdateTraits={handleUpdateTraits}
                  onNavigateTab={handleTabChange}
                  onRefreshProfile={() => setProfile(loadProfile())}
                  onOpenReminderSettings={() => setReminderModalOpen(true)}
                  onLaunchMicroWorkout={handleLaunchMicroWorkout}
                />
              )}

              {activeTab === 'games' && (
                <BrainGamesHub
                  profile={profile}
                  onRecordSession={handleRecordSession}
                />
              )}

              {activeTab === 'character' && (
                <CharacterGymHub
                  profile={profile}
                  onUpdateTraits={handleUpdateTraits}
                  onRefreshProfile={() => setProfile(loadProfile())}
                />
              )}

              {activeTab === 'coach' && (
                <AICoachDialogue profile={profile} />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsDashboard profile={profile} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile-Only Bottom Floating Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/92 backdrop-blur-xl border-t border-[#CBDDD2] px-2.5 py-1.5 shadow-lg">
          <div className="grid grid-cols-5 gap-1">
            {/* Tab 1: Workout */}
            <button
              onClick={() => handleTabChange('workout')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                activeTab === 'workout'
                  ? 'text-[#153424] bg-[#D4E8DC] font-bold shadow-xs'
                  : 'text-[#5C786A] hover:text-[#182C22] hover:bg-[#F0F6F2]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 font-medium">{t.tabToday}</span>
            </button>

            {/* Tab 2: Cognitive Games */}
            <button
              onClick={() => handleTabChange('games')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                activeTab === 'games'
                  ? 'text-[#153424] bg-[#D4E8DC] font-bold shadow-xs'
                  : 'text-[#5C786A] hover:text-[#182C22] hover:bg-[#F0F6F2]'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 font-medium">{t.tabGames}</span>
            </button>

            {/* Tab 3: Character Gym */}
            <button
              onClick={() => handleTabChange('character')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                activeTab === 'character'
                  ? 'text-[#784E1A] bg-[#FBEED7] font-bold shadow-xs'
                  : 'text-[#5C786A] hover:text-[#182C22] hover:bg-[#F0F6F2]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 font-medium">{t.tabCharacter}</span>
            </button>

            {/* Tab 4: AI Coach */}
            <button
              onClick={() => handleTabChange('coach')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                activeTab === 'coach'
                  ? 'text-[#1F4E38] bg-[#D7EBDD] font-bold shadow-xs'
                  : 'text-[#5C786A] hover:text-[#182C22] hover:bg-[#F0F6F2]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 font-medium">{t.tabCoach}</span>
            </button>

            {/* Tab 5: Analytics */}
            <button
              onClick={() => handleTabChange('analytics')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'text-[#153424] bg-[#D4E8DC] font-bold shadow-xs'
                  : 'text-[#5C786A] hover:text-[#182C22] hover:bg-[#F0F6F2]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 font-medium">{t.tabAnalytics}</span>
            </button>
          </div>
        </nav>

        {/* Machine Learning Smart Reminder Settings Modal */}
        <SmartReminderMLModal
          isOpen={reminderModalOpen}
          onClose={() => setReminderModalOpen(false)}
          profile={profile}
          onLaunchMicroWorkout={handleLaunchMicroWorkout}
          onRefreshProfile={() => setProfile(loadProfile())}
        />

        {/* Binaural Frequency Beats Drawer */}
        <BinauralModal
          isOpen={binauralOpen}
          onClose={() => setBinauralOpen(false)}
        />

        {/* Language Selection Modal */}
        <LanguageModal
          isOpen={languageOpen}
          onClose={() => setLanguageOpen(false)}
        />

        {/* Apple Watch & Smartwatch Companion Hub */}
        <SmartwatchHubModal
          isOpen={watchOpen}
          onClose={() => setWatchOpen(false)}
          profile={profile}
          onAwardXP={handleAwardWatchXP}
        />
      </div>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
