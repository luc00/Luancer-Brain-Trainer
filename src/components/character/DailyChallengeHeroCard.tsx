import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { UserProfile, RealLifeChallenge } from '../../types';
import { getTodayFeaturedChallenge, DAILY_REAL_LIFE_CHALLENGES } from '../../data/dailyChallengesData';
import { toggleChallenge } from '../../utils/storage';
import { 
  HeartHandshake, 
  HeartPulse, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  RotateCw, 
  ArrowRight, 
  Smile, 
  ShieldCheck, 
  Brain, 
  Award,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Clock
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdateProfile: () => void;
  onViewAllChallenges?: () => void;
  className?: string;
}

export const DailyChallengeHeroCard: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onViewAllChallenges,
  className = '',
}) => {
  const [offset, setOffset] = useState<number>(0);
  const [showReflectionInput, setShowReflectionInput] = useState<boolean>(false);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [savedReflection, setSavedReflection] = useState<boolean>(false);
  const [showNeuroDetails, setShowNeuroDetails] = useState<boolean>(false);

  const todayChallenge: RealLifeChallenge = getTodayFeaturedChallenge(undefined, offset);
  const completedIds = profile.completedChallenges || [];
  const isCompleted = completedIds.includes(todayChallenge.id);

  const handleCompleteChallenge = () => {
    soundFx.playSuccess();
    toggleChallenge(todayChallenge.id, todayChallenge.xpReward, todayChallenge.traitBonus);
    onUpdateProfile();
  };

  const handleShuffleChallenge = () => {
    soundFx.playClick();
    setOffset((prev) => prev + 1);
    setShowReflectionInput(false);
    setSavedReflection(false);
  };

  // Category visual mapping
  const getCategoryInfo = (cat: RealLifeChallenge['category']) => {
    switch (cat) {
      case 'altruism':
        return {
          label: 'Altruismo & Connessione Umana',
          badgeBg: 'bg-[#FDF2F4] text-[#9E2A2B] border-[#F8CCD1]',
          icon: HeartHandshake,
          accentColor: '#9E2A2B',
          glowGradient: 'from-[#FDF2F4] to-[#FBF0EE]',
        };
      case 'stress_relief':
        return {
          label: 'Gestione Stress & Calma Biologica',
          badgeBg: 'bg-[#EBF7F2] text-[#1E6B47] border-[#BCE5D3]',
          icon: HeartPulse,
          accentColor: '#1E6B47',
          glowGradient: 'from-[#EBF7F2] to-[#E5F3EB]',
        };
      case 'discipline':
        return {
          label: 'Disciplina & Tempra',
          badgeBg: 'bg-[#FBF4EB] text-[#8C5D19] border-[#EED7B8]',
          icon: Flame,
          accentColor: '#8C5D19',
          glowGradient: 'from-[#FBF4EB] to-[#F7ECE0]',
        };
      case 'courage':
        return {
          label: 'Coraggio & Assertività',
          badgeBg: 'bg-[#F5EFFB] text-[#6D28D9] border-[#DFCCF8]',
          icon: ShieldCheck,
          accentColor: '#6D28D9',
          glowGradient: 'from-[#F5EFFB] to-[#EFE7F8]',
        };
      default:
        return {
          label: 'Presenza & Crescita',
          badgeBg: 'bg-[#EBF2FA] text-[#1D4ED8] border-[#BED6F8]',
          icon: Sparkles,
          accentColor: '#1D4ED8',
          glowGradient: 'from-[#EBF2FA] to-[#E2EDF9]',
        };
    }
  };

  const catInfo = getCategoryInfo(todayChallenge.category);
  const CategoryIcon = catInfo.icon;

  return (
    <div
      id="daily-challenge-hero-card"
      className={`relative bg-white border border-[#CBDDD2] rounded-3xl p-5 shadow-sm overflow-hidden transition-all ${className}`}
    >
      {/* Decorative Glow */}
      <div 
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ backgroundColor: catInfo.accentColor }}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E5F2EC] text-[#1E4332] flex items-center justify-center font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#1E4332]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#1E4332] uppercase tracking-wider font-display">
                Sfida del Giorno nella Vita Reale
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-[#597568]">Metti in pratica le virtù fuori dallo schermo</span>
          </div>
        </div>

        {/* Change / Next Challenge Button */}
        <button
          onClick={handleShuffleChallenge}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#446253] hover:text-[#14261D] bg-[#F2F7F4] hover:bg-[#E5F0EA] border border-[#CBDDD2] rounded-xl transition active:scale-95 cursor-pointer shadow-2xs"
          title="Mostra un'altra sfida per oggi"
        >
          <RotateCw className="w-3 h-3" />
          <span className="hidden sm:inline">Cambia</span>
        </button>
      </div>

      {/* Main Challenge Content Box */}
      <div className="space-y-3 relative z-10">
        {/* Category & XP Badge row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${catInfo.badgeBg} shadow-2xs`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            {catInfo.label}
          </span>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-2.5 py-0.5 rounded-full border border-[#CBDDD2]">
              +{todayChallenge.xpReward} XP
            </span>
            <span className="text-[10px] font-semibold text-[#597568] uppercase bg-slate-100 px-2 py-0.5 rounded-md">
              {todayChallenge.difficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-base sm:text-lg font-bold ${isCompleted ? 'text-[#1E4332] line-through decoration-[#52826A]' : 'text-[#122219]'}`}>
          {todayChallenge.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#355243] leading-relaxed">
          {todayChallenge.description}
        </p>

        {/* Action Guide Box */}
        <div className="bg-[#F8FAF9] border border-[#CBDDD2] rounded-2xl p-3.5 text-xs text-[#244133] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#14261D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E4332]" />
            Istruzione Pratica:
          </div>
          <p className="pl-3 text-xs leading-relaxed text-[#3C584A]">
            {todayChallenge.actionGuide}
          </p>
        </div>

        {/* Neurobiology / Psychological Benefit Toggle */}
        {todayChallenge.neuroBenefit && (
          <div>
            <button
              onClick={() => {
                soundFx.playClick();
                setShowNeuroDetails(!showNeuroDetails);
              }}
              className="text-[11px] font-semibold text-[#285A42] hover:text-[#14261D] flex items-center gap-1 transition cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5 text-[#1E4332]" />
              <span>{showNeuroDetails ? 'Nascondi basi neuroscientifiche' : 'Perché funziona nel cervello? (Neurobiologia)'}</span>
              {showNeuroDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <AnimatePresence>
              {showNeuroDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1.5 p-3 rounded-xl bg-[#E8F4EE] border border-[#BBD5C6] text-xs text-[#1E4332] leading-relaxed"
                >
                  <strong className="block mb-0.5 text-[#14261D]">Meccanismo Fisiologico:</strong>
                  {todayChallenge.neuroBenefit}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Completion Section */}
        <div className="pt-2 border-t border-[#E5EFE9] space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Main Action Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCompleteChallenge}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                isCompleted
                  ? 'bg-[#E5F2EC] text-[#1E4332] border border-[#A6CCB7] hover:bg-[#D7EADE]'
                  : 'bg-[#1E4332] text-white hover:bg-[#2A5842] active:bg-[#142F23] shadow-md'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Completata con Successo! (Tocca per annullare)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Ho Compiuto l&apos;Azione (+{todayChallenge.xpReward} XP)</span>
                </>
              )}
            </motion.button>

            {/* View All Challenges Link */}
            {onViewAllChallenges && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onViewAllChallenges();
                }}
                className="px-3.5 py-2.5 text-xs font-semibold text-[#446253] hover:text-[#14261D] bg-[#F7FAF8] hover:bg-[#EBF3EE] border border-[#CBDDD2] rounded-2xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Tutte le {DAILY_REAL_LIFE_CHALLENGES.length} Sfide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Optional Reflection Input for Deep Growth */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-[#F4F9F6] border border-[#CBDDD2] rounded-2xl space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#14261D] flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-[#1E4332]" />
                  {todayChallenge.reflectionPrompt || 'Come ti sei sentito dopo questa azione?'}
                </span>
                {!showReflectionInput && !savedReflection && (
                  <button
                    onClick={() => setShowReflectionInput(true)}
                    className="text-[11px] font-bold text-[#1E4332] hover:underline"
                  >
                    + Aggiungi nota
                  </button>
                )}
              </div>

              {showReflectionInput && !savedReflection && (
                <div className="space-y-2 pt-1">
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Es: Ho notato un sorriso sincero... mi ha fatto sentire più connesso e sereno..."
                    rows={2}
                    className="w-full p-2.5 text-xs bg-white border border-[#CBDDD2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1E4332] text-[#14261D]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowReflectionInput(false)}
                      className="px-2.5 py-1 text-[11px] text-[#597568] hover:text-[#14261D]"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={() => {
                        soundFx.playSparkle();
                        setSavedReflection(true);
                      }}
                      className="px-3 py-1 text-[11px] font-bold bg-[#1E4332] text-white rounded-lg hover:bg-[#2B5340]"
                    >
                      Salva Riflessione
                    </button>
                  </div>
                </div>
              )}

              {savedReflection && (
                <div className="p-2 bg-white rounded-xl border border-[#CBDDD2] text-[11px] text-[#1E4332] italic">
                  &ldquo;{reflectionText || 'Azione integrata nel diario di crescita.'}&rdquo;
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
