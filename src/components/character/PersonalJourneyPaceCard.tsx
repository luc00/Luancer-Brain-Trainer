import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Leaf, 
  Scale, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Target,
  Sliders,
  Flame,
  UserCheck
} from 'lucide-react';
import { UserProfile, UserTrainingPace } from '../../types';
import { soundFx } from '../../utils/audio';

interface PersonalJourneyPaceCardProps {
  profile: UserProfile;
  onOpenAccountMenu: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const PersonalJourneyPaceCard: React.FC<PersonalJourneyPaceCardProps> = ({
  profile,
  onOpenAccountMenu,
  onOpenAuth,
  isLoggedIn,
}) => {
  const pace: UserTrainingPace = profile.trainingPace || 'steady';
  const completedToday = (profile.lastTrainedDate === new Date().toISOString().split('T')[0] && (profile.completedWorkoutsCount || 0) > 0) ? 1 : 0;
  
  const dailyTarget = pace === 'gentle' ? 1 : pace === 'steady' ? 2 : 3;
  const isTargetMet = completedToday >= dailyTarget;
  const isBrandNew = (profile.completedWorkoutsCount || 0) === 0;

  const getPaceDetails = () => {
    switch (pace) {
      case 'gentle':
        return {
          icon: Leaf,
          label: 'Passo Gentile',
          color: 'text-emerald-700 bg-emerald-100/80 border-emerald-300',
          badge: '🌿 1 micro-attività/dì',
          motto: '«Nessuna fretta. La costanza quotidiana plasma la mente senza sforzo eccessivo.»',
        };
      case 'intense':
        return {
          icon: Zap,
          label: 'Passo Intenso',
          color: 'text-indigo-800 bg-indigo-100/80 border-indigo-300',
          badge: '⚡ 3 attività/dì',
          motto: '«L\'ostacolo è il nostro maestro. Focus prefrontale spinto al massimo.»',
        };
      case 'steady':
      default:
        return {
          icon: Scale,
          label: 'Passo Costante',
          color: 'text-amber-800 bg-amber-100/80 border-amber-300',
          badge: '⚖️ 2 attività/dì',
          motto: '«Gutta cavat lapidem: un ritmo solido ed equilibrato batte l\'intensità passeggera.»',
        };
    }
  };

  const paceDetails = getPaceDetails();
  const IconComponent = paceDetails.icon;

  return (
    <div className="rounded-3xl bg-[#DFEDE5] border border-[#CBDDD2] p-4 sm:p-5 shadow-xs relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#2F654A]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white text-[#1E4332] shadow-2xs border border-[#CBDDD2]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#122B1E]">
              {isBrandNew ? 'Partenza da Zero (Grado 0)' : 'Il Tuo Passo • Ognuno ha il suo ritmo'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border flex items-center gap-1 ${paceDetails.color}`}>
            <IconComponent className="w-3 h-3" />
            <span>{paceDetails.label}</span>
          </span>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              if (isLoggedIn) {
                onOpenAccountMenu();
              } else {
                onOpenAuth();
              }
            }}
            className="p-1 px-2.5 rounded-full bg-white hover:bg-[#F2FAF5] border border-[#CBDDD2] text-[#2F654A] hover:text-[#183626] text-[11px] font-bold flex items-center gap-1 transition shadow-2xs"
            title="Modifica il tuo passo"
          >
            <Sliders className="w-3 h-3" />
            <span>Regola Passo</span>
          </button>
        </div>
      </div>

      {/* Brand New User Callout */}
      {isBrandNew ? (
        <div className="bg-white/80 rounded-2xl p-3.5 border border-[#CBDDD2] backdrop-blur-xs space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#122B1E]">
                Benvenuto alla tua partenza sinaptica!
              </h4>
              <p className="text-[11px] sm:text-xs text-[#3E5F4C] mt-0.5 leading-relaxed">
                Tutti i punteggi partono da zero (350 pt di calibrazione iniziale, 0 XP, 0 sessioni). Non conta da dove parti, conta il passo di ogni singolo giorno.
              </p>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-[#294B3C] font-semibold border-t border-[#E1ECE5]">
            <span className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Primo obiettivo di oggi: Completa 1 micro-sfida</span>
            </span>
            <span className="text-emerald-700 font-extrabold">0 / 1 Fatto</span>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 rounded-2xl p-3.5 border border-[#CBDDD2] backdrop-blur-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#2F654A]" />
              <span className="text-xs font-bold text-[#122B1E]">
                Obiettivo Odierno al Tuo Passo ({paceDetails.badge})
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#2F654A]">
              {completedToday} di {dailyTarget} completati
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-[#D4E6DC] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (completedToday / dailyTarget) * 100)}%` }}
              className="h-full bg-gradient-to-r from-[#2F654A] to-[#55B785] rounded-full"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#446853]">
            <span className="italic line-clamp-1">{paceDetails.motto}</span>
            {isTargetMet ? (
              <span className="shrink-0 text-emerald-700 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Passo di oggi onorato!
              </span>
            ) : (
              <span className="shrink-0 font-bold text-[#1E3E2E]">In corso</span>
            )}
          </div>
        </div>
      )}

      {/* Login / Sync Reminder if guest */}
      {!isLoggedIn && (
        <div className="mt-3 pt-2.5 border-t border-[#CBDDD2] flex items-center justify-between gap-2 text-xs">
          <span className="text-[#3F634F] text-[11px] flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#2F654A]" />
            <span>Vuoi salvare i progressi con il tuo account?</span>
          </span>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onOpenAuth();
            }}
            className="px-3 py-1 rounded-xl bg-[#1E4332] hover:bg-[#153424] text-white text-[11px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
          >
            <span>Accedi o Registrati</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
