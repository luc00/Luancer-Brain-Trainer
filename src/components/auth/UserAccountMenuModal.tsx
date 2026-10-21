import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  X, 
  Compass, 
  Leaf, 
  Scale, 
  Zap, 
  LogOut, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Calendar, 
  Flame, 
  Award, 
  Activity, 
  ChevronRight,
  Shield,
  HelpCircle
} from 'lucide-react';
import { UserAccount, UserProfile, UserTrainingPace } from '../../types';
import { updateUserTrainingPace, resetCurrentUserToZero, logoutUser } from '../../utils/auth';
import { soundFx } from '../../utils/audio';

interface UserAccountMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  profile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

export const UserAccountMenuModal: React.FC<UserAccountMenuModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  profile,
  onProfileUpdated,
  onLogout,
  onOpenAuthModal,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [updatingPace, setUpdatingPace] = useState(false);

  if (!isOpen) return null;

  const currentPace: UserTrainingPace = profile.trainingPace || currentUser?.trainingPace || 'steady';

  const handlePaceChange = async (newPace: UserTrainingPace) => {
    soundFx.playClick();
    setUpdatingPace(true);
    const updated = await updateUserTrainingPace(newPace);
    setUpdatingPace(false);
    onProfileUpdated(updated);
  };

  const handleResetToZero = async () => {
    soundFx.playPowerUp();
    const zeroProfile = await resetCurrentUserToZero();
    setConfirmReset(false);
    onProfileUpdated(zeroProfile);
  };

  const handleLogoutClick = () => {
    soundFx.playClick();
    logoutUser();
    onLogout();
    onClose();
  };

  // Steps in the journey
  const JOURNEY_STEPS = [
    { level: 1, grade: 0, title: 'Punto di Partenza (Grado 0)', desc: 'Mente aperta, tabula rasa. Ogni giorno una nuova connessione.' },
    { level: 2, grade: 1, title: 'Prime Connessioni', desc: 'Consolidamento della memoria di lavoro e attenzione focalizzata.' },
    { level: 3, grade: 2, title: 'Ritmo & Abitudine', desc: 'La costanza supera lo sforzo iniziale: l\'allenamento diventa naturale.' },
    { level: 5, grade: 3, title: 'Resilienza & Antifragilità', desc: 'Flessibilità cognitiva sotto stress e lucidità emotiva stoica.' },
    { level: 7, grade: 4, title: 'Lucidità Decisionale', desc: 'Corteccia prefrontale potenziata e discernimento senza bias.' },
    { level: 10, grade: 5, title: 'Maestria Sinaptica', desc: 'Integrazione armonica tra mente logica, carattere e pace interiore.' },
  ];

  const currentLevel = profile.level || 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-[#EBF3EE] border border-[#CBDDD2] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1E4332] to-[#2B5641] text-white p-5 sm:p-6 pb-5 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#DFEDE5] hover:text-white hover:bg-white/10 transition"
              title="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-[#DFEDE5] text-[#1E4332] font-black text-xl flex items-center justify-center shadow-md border-2 border-emerald-400/30 shrink-0">
                {(currentUser?.name || profile.name || 'N').charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black truncate">
                    {currentUser?.name || profile.name || 'Neuro-Explorer'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                    Livello {profile.level}
                  </span>
                </div>
                <p className="text-emerald-100/80 text-xs truncate">
                  {currentUser?.email || (profile.isFreshStart ? 'Inizio da Zero' : 'Account Locale')}
                </p>
                <p className="text-emerald-200 text-xs font-medium mt-0.5">
                  Titolo: <span className="font-bold text-white">{profile.title}</span>
                </p>
              </div>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-800/60">
              <div className="bg-[#143224]/80 p-2 rounded-xl text-center border border-emerald-900/40">
                <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>GCI</span>
                </div>
                <div className="text-base font-black text-white mt-0.5">{profile.gci}</div>
              </div>

              <div className="bg-[#143224]/80 p-2 rounded-xl text-center border border-emerald-900/40">
                <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>Serie</span>
                </div>
                <div className="text-base font-black text-white mt-0.5">{profile.streak} gg</div>
              </div>

              <div className="bg-[#143224]/80 p-2 rounded-xl text-center border border-emerald-900/40">
                <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-indigo-300" />
                  <span>Sessioni</span>
                </div>
                <div className="text-base font-black text-white mt-0.5">{profile.completedWorkoutsCount || 0}</div>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
            
            {/* Ognuno ha il suo passo: Configurazione Ritmo */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#CBDDD2] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#122B1E]">Il Tuo Passo Personale</h3>
                    <p className="text-[11px] text-[#4F715E]">Ognuno ha il proprio ritmo: adatta l'impegno quotidiano</p>
                  </div>
                </div>
                {updatingPace && (
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                {/* Gentile */}
                <button
                  type="button"
                  onClick={() => handlePaceChange('gentle')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    currentPace === 'gentle'
                      ? 'bg-[#E3EFE7] border-[#2F654A] shadow-xs ring-1 ring-[#2F654A]'
                      : 'bg-[#F7FAF8] border-[#DCE8E0] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Leaf className="w-4 h-4 text-emerald-700" />
                    {currentPace === 'gentle' && <Check className="w-3.5 h-3.5 text-emerald-700 font-bold" />}
                  </div>
                  <div className="text-xs font-bold text-[#122B1E]">Passo Gentile</div>
                  <div className="text-[10px] text-[#486D5A] mt-0.5 leading-snug">
                    1 attività/dì (3-5 min) • Nessuna fretta
                  </div>
                </button>

                {/* Costante */}
                <button
                  type="button"
                  onClick={() => handlePaceChange('steady')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    currentPace === 'steady'
                      ? 'bg-[#E3EFE7] border-[#2F654A] shadow-xs ring-1 ring-[#2F654A]'
                      : 'bg-[#F7FAF8] border-[#DCE8E0] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Scale className="w-4 h-4 text-amber-700" />
                    {currentPace === 'steady' && <Check className="w-3.5 h-3.5 text-emerald-700 font-bold" />}
                  </div>
                  <div className="text-xs font-bold text-[#122B1E]">Passo Costante</div>
                  <div className="text-[10px] text-[#486D5A] mt-0.5 leading-snug">
                    2 attività/dì (8-10 min) • Equilibrato
                  </div>
                </button>

                {/* Intenso */}
                <button
                  type="button"
                  onClick={() => handlePaceChange('intense')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    currentPace === 'intense'
                      ? 'bg-[#E3EFE7] border-[#2F654A] shadow-xs ring-1 ring-[#2F654A]'
                      : 'bg-[#F7FAF8] border-[#DCE8E0] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Zap className="w-4 h-4 text-indigo-700" />
                    {currentPace === 'intense' && <Check className="w-3.5 h-3.5 text-emerald-700 font-bold" />}
                  </div>
                  <div className="text-xs font-bold text-[#122B1E]">Passo Intenso</div>
                  <div className="text-[10px] text-[#486D5A] mt-0.5 leading-snug">
                    3-4 attività/dì (15-20 min) • Focus
                  </div>
                </button>
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-[#F0F6F2] border border-[#CBDDD2] text-[11px] text-[#345946] italic">
                {currentPace === 'gentle' && (
                  <span>🌿 «La fretta è nemica della profondità. Un millimetro al giorno scava la roccia.»</span>
                )}
                {currentPace === 'steady' && (
                  <span>⚖️ «Gutta cavat lapidem: la goccia scava la pietra non per forza, ma cadendo con costanza.»</span>
                )}
                {currentPace === 'intense' && (
                  <span>⚡ «L\'ostacolo che incontri è la via stessa del tuo superamento.»</span>
                )}
              </div>
            </div>

            {/* Il Tuo Cammino: Mappa di Progressione */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#CBDDD2] shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-indigo-100 text-indigo-800">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#122B1E]">Il Tuo Cammino Sinaptico</h3>
                    <p className="text-[11px] text-[#4F715E]">Come progredirai nel tempo, passo dopo passo</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Fase attuale: Livello {currentLevel}
                </span>
              </div>

              <div className="space-y-2 mt-3">
                {JOURNEY_STEPS.map((step) => {
                  const isCurrent = currentLevel >= step.level && (step.level === 10 || currentLevel < (step.level + 2));
                  const isCompleted = currentLevel > step.level;

                  return (
                    <div
                      key={step.title}
                      className={`p-2.5 rounded-xl border flex items-start gap-3 transition ${
                        isCurrent
                          ? 'bg-[#EAF3EE] border-[#2F654A] shadow-xs'
                          : isCompleted
                          ? 'bg-[#F8FAF9] border-[#DCE8E0] opacity-80'
                          : 'bg-white border-[#E8ECE9] opacity-60'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-[#1E4332] text-white ring-2 ring-emerald-300'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.grade}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isCurrent ? 'text-[#122B1E]' : 'text-[#3E5649]'}`}>
                            {step.title}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-extrabold text-[#1E4332] bg-emerald-200/80 px-1.5 py-0.2 rounded">
                              Sei qui
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#4E6F5E] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Azioni Account & Reset da Zero */}
            <div className="p-4 rounded-2xl bg-[#F4F8F5] border border-[#CBDDD2] space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#355B46]">
                Gestione & Ripartenza
              </h4>

              {/* Reset to Zero Button */}
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100/70 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4 text-amber-700" />
                  <span>Ricomincia il tuo cammino da zero (Grado 0)</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-950 text-xs space-y-2">
                  <p className="font-bold">
                    Sei sicuro di voler azzerare le statistiche e ripartire dal Grado 0?
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Il tuo livello tornerà a 1 (0 XP) e la cronologia sessioni sarà azzerata, permettendoti di ricominciare con una tabula rasa pulita.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleResetToZero}
                      className="flex-1 py-1.5 rounded-lg bg-amber-800 text-white font-bold text-xs hover:bg-amber-900 transition"
                    >
                      Sì, azzera e riparti da zero
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="py-1.5 px-3 rounded-lg bg-white border border-amber-300 text-amber-900 font-medium text-xs hover:bg-amber-50 transition"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              )}

              {/* Disconnetti o Cambia Account */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#CBDDD2] bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-[#294B3C] text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Esci dall'Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#CBDDD2] bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-[#294B3C] text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <User className="w-4 h-4" />
                  <span>Cambia Utente</span>
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
