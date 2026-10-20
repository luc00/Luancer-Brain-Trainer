import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { RealLifeChallenge, UserProfile } from '../../types';
import { toggleChallenge } from '../../utils/storage';
import { DAILY_REAL_LIFE_CHALLENGES } from '../../data/dailyChallengesData';
import { DailyChallengeHeroCard } from './DailyChallengeHeroCard';
import { 
  Flame, 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  Target, 
  Award, 
  Sparkles, 
  HeartHandshake, 
  HeartPulse, 
  ShieldCheck, 
  Brain,
  MessageSquare,
  Sparkle
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdateProfile: () => void;
  onExit: () => void;
}

type FilterCategory = 'all' | 'altruism' | 'stress_relief' | 'discipline' | 'courage' | 'communication';

export const RealLifeChallengesView: React.FC<Props> = ({ profile, onUpdateProfile, onExit }) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [expandedNeuroId, setExpandedNeuroId] = useState<string | null>(null);

  const completedIds = profile.completedChallenges || [];

  const handleToggle = (ch: RealLifeChallenge) => {
    soundFx.playSuccess();
    toggleChallenge(ch.id, ch.xpReward, ch.traitBonus);
    onUpdateProfile();
  };

  const filtered = selectedFilter === 'all' 
    ? DAILY_REAL_LIFE_CHALLENGES 
    : DAILY_REAL_LIFE_CHALLENGES.filter((c) => c.category === selectedFilter);

  const completedCount = completedIds.length;

  const getCategoryBadge = (cat: RealLifeChallenge['category']) => {
    switch (cat) {
      case 'altruism':
        return { label: 'Altruismo', bg: 'bg-[#FDF2F4] text-[#9E2A2B] border-[#F8CCD1]', icon: HeartHandshake };
      case 'stress_relief':
        return { label: 'Anti-Stress', bg: 'bg-[#EBF7F2] text-[#1E6B47] border-[#BCE5D3]', icon: HeartPulse };
      case 'discipline':
        return { label: 'Disciplina', bg: 'bg-[#FBF4EB] text-[#8C5D19] border-[#EED7B8]', icon: Flame };
      case 'courage':
        return { label: 'Coraggio', bg: 'bg-[#F5EFFB] text-[#6D28D9] border-[#DFCCF8]', icon: ShieldCheck };
      case 'communication':
        return { label: 'Relazioni', bg: 'bg-[#EBF2FA] text-[#1D4ED8] border-[#BED6F8]', icon: MessageSquare };
      default:
        return { label: 'Presenza', bg: 'bg-[#E5F2EC] text-[#24523C] border-[#BBD5C6]', icon: Sparkles };
    }
  };

  return (
    <div id="real-life-challenges-view" className="space-y-4 max-w-lg mx-auto pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-2xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1 text-xs font-semibold text-[#3D5B4D] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Esci
        </button>
        <div className="flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#1E4332]" />
          <span className="text-xs font-bold text-[#122219]">Sfide nel Mondo Reale</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-2.5 py-0.5 rounded-full border border-[#CBDDD2]">
          <Award className="w-3.5 h-3.5" /> {completedCount} / {DAILY_REAL_LIFE_CHALLENGES.length}
        </div>
      </div>

      {/* Featured Sfida del Giorno (Hero Card) */}
      <DailyChallengeHeroCard
        profile={profile}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Category Filter Navigation */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-[#14261D] uppercase tracking-wider block px-1">
          Esplora l&apos;Archivio delle Azioni Etiche & Psicologiche
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Tutte le Sfide' },
            { id: 'altruism', label: 'Altruismo & Cura' },
            { id: 'stress_relief', label: 'Gestione Stress' },
            { id: 'discipline', label: 'Disciplina' },
            { id: 'courage', label: 'Coraggio & Limiti' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedFilter(f.id as FilterCategory);
              }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                selectedFilter === f.id
                  ? 'bg-[#1E4332] text-white font-bold shadow-xs'
                  : 'bg-white text-[#4D6C5D] border border-[#CBDDD2] hover:bg-[#EAF3EE]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {filtered.map((ch) => {
          const isDone = completedIds.includes(ch.id);
          const badge = getCategoryBadge(ch.category);
          const BadgeIcon = badge.icon;
          const isNeuroOpen = expandedNeuroId === ch.id;

          return (
            <motion.div
              key={ch.id}
              layout
              className={`p-4 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-[#F2F8F4] border-[#8CB99F] shadow-xs'
                  : 'bg-white border-[#CBDDD2] hover:border-[#52826A] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badge.bg}`}>
                      <BadgeIcon className="w-3 h-3" />
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-[#7A998C] font-mono">
                      {ch.difficulty}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold ${isDone ? 'text-[#1E4332] line-through decoration-[#52826A]' : 'text-[#122219]'}`}>
                    {ch.title}
                  </h3>

                  <p className="text-xs text-[#446253] leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#CBDDD2]/80 text-[11px] text-[#2A4B3C] leading-snug">
                    <strong className="text-[#193829] block mb-0.5">Istruzione Pratica:</strong>
                    {ch.actionGuide}
                  </div>

                  {/* Neurobiological Insight Toggle */}
                  {ch.neuroBenefit && (
                    <div className="pt-1">
                      <button
                        onClick={() => setExpandedNeuroId(isNeuroOpen ? null : ch.id)}
                        className="text-[10px] text-[#24523C] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Brain className="w-3 h-3 text-[#1E4332]" />
                        {isNeuroOpen ? 'Nascondi beneficio cerebrale' : 'Mostra beneficio cerebrale'}
                      </button>
                      {isNeuroOpen && (
                        <div className="mt-1 p-2 bg-[#EAF4EF] border border-[#CBDDD2] rounded-lg text-[11px] text-[#1E4332]">
                          {ch.neuroBenefit}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Check Action Button */}
                <button
                  onClick={() => handleToggle(ch)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shrink-0 mt-1 cursor-pointer ${
                    isDone
                      ? 'bg-[#1E4332] text-white shadow-xs'
                      : 'bg-[#FAFDFB] border-2 border-[#CBDDD2] text-[#8EAFA0] hover:border-[#1E4332] hover:text-[#1E4332]'
                  }`}
                  title={isDone ? 'Completata (Tocca per annullare)' : 'Segna come completata'}
                >
                  {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6 text-slate-300 hover:text-[#1E4332]" />}
                </button>
              </div>

              {/* Reward & Status Footer */}
              <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#CBDDD2]/60 text-[11px]">
                <span className="text-[#597568] font-medium">Ricompensa Carattere</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#1E4332]">+{ch.xpReward} XP</span>
                  {isDone && (
                    <span className="text-emerald-700 font-bold text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md">
                      Completata
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
