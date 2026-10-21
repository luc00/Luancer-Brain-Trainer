import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Leaf, 
  Scale, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { registerUser, loginUser } from '../../utils/auth';
import { UserAccount, UserProfile, UserTrainingPace } from '../../types';
import { soundFx } from '../../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount, profile: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [trainingPace, setTrainingPace] = useState<UserTrainingPace>('steady');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Inserisci un indirizzo email valido.');
      soundFx.playError();
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('La password deve avere almeno 6 caratteri.');
      soundFx.playError();
      return;
    }

    setLoading(true);

    if (mode === 'register') {
      const res = await registerUser({
        email,
        password,
        name: name.trim() || email.split('@')[0],
        trainingPace,
      });

      setLoading(false);
      if (res.success && res.user && res.profile) {
        soundFx.playSuccess();
        setSuccessMessage('Account creato con successo! Inizi dal Grado 0: benvenuto nel tuo percorso.');
        setTimeout(() => {
          onAuthSuccess(res.user!, res.profile!);
          onClose();
        }, 1100);
      } else {
        soundFx.playError();
        setErrorMessage(res.error || 'Impossibile completare la registrazione.');
      }
    } else {
      const res = await loginUser({ email, password });
      setLoading(false);
      if (res.success && res.user && res.profile) {
        soundFx.playSuccess();
        setSuccessMessage(`Bentornato, ${res.user.name}! Accesso eseguito.`);
        setTimeout(() => {
          onAuthSuccess(res.user!, res.profile!);
          onClose();
        }, 900);
      } else {
        soundFx.playError();
        setErrorMessage(res.error || 'Credenziali non valide o utente non trovato.');
      }
    }
  };

  const handleQuickDemo = async () => {
    soundFx.playClick();
    setEmail('allievo.demo@luancer.it');
    setPassword('mente123');
    setName('Marco');
    setMode('register');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#EBF3EE] border border-[#CBDDD2] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
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

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Accesso Personale • Il Tuo Ritmo</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {mode === 'register' ? 'Inizia il tuo cammino da zero' : 'Accedi alla tua palestra mentale'}
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
              {mode === 'register'
                ? 'Nessun confronto con gli altri: si parte dal Grado 0 e si migliora piano piano, ognuno al proprio passo.'
                : 'Ritrova i tuoi progressi cognitivi, i pilastri della psiche e la tua crescita quotidiana.'}
            </p>

            {/* Mode Switch Tabs */}
            <div className="flex items-center bg-[#143224]/80 p-1 rounded-2xl mt-4 border border-emerald-900/40">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-white text-[#122B1E] shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Accedi</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-white text-[#122B1E] shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Nuovo Account (Da Zero)</span>
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#1E3E2E] mb-1.5">
                    Come vuoi essere chiamato? (Nome o Soprannome)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#527863] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="es. Leonardo, Elena o Viandante"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBDDD2] rounded-2xl text-sm text-[#122B1E] placeholder:text-[#88A394] focus:outline-none focus:border-[#2F654A] focus:ring-2 focus:ring-[#2F654A]/15 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1E3E2E] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#527863] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="la-tua-email@esempio.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBDDD2] rounded-2xl text-sm text-[#122B1E] placeholder:text-[#88A394] focus:outline-none focus:border-[#2F654A] focus:ring-2 focus:ring-[#2F654A]/15 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3E2E] mb-1.5">
                  Password (minimo 6 caratteri)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#527863] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#CBDDD2] rounded-2xl text-sm text-[#122B1E] placeholder:text-[#88A394] focus:outline-none focus:border-[#2F654A] focus:ring-2 focus:ring-[#2F654A]/15 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#527863] hover:text-[#122B1E] p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Scegli il tuo ritmo personale (ognuno ha il suo passo) */}
              {mode === 'register' && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1E3E2E] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#2F654A]" />
                      <span>Scegli il tuo passo iniziale:</span>
                    </span>
                    <span className="text-[11px] text-[#527863] italic">modificabile in qualunque momento</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {/* Passo Gentile */}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setTrainingPace('gentle');
                      }}
                      className={`text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                        trainingPace === 'gentle'
                          ? 'bg-[#E3EFE7] border-[#2F654A] shadow-xs ring-1 ring-[#2F654A]'
                          : 'bg-white border-[#CBDDD2] hover:border-[#8EAD9B]'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 mt-0.5">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#122B1E]">Passo Gentile (Dolce & Serena Crescita)</span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">3-5 min/giorno</span>
                        </div>
                        <p className="text-[11px] text-[#476755] mt-0.5 leading-snug">
                          1 micro-esercizio o meditazione al giorno. Zero fretta, ideale per costruire costanza senza ansia da prestazione.
                        </p>
                      </div>
                    </button>

                    {/* Passo Costante */}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setTrainingPace('steady');
                      }}
                      className={`text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                        trainingPace === 'steady'
                          ? 'bg-[#E3EFE7] border-[#2F654A] shadow-xs ring-1 ring-[#2F654A]'
                          : 'bg-white border-[#CBDDD2] hover:border-[#8EAD9B]'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-700 mt-0.5">
                        <Scale className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#122B1E]">Passo Costante (Consigliato • Equilibrato)</span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">8-10 min/giorno</span>
                        </div>
                        <p className="text-[11px] text-[#476755] mt-0.5 leading-snug">
                          2 micro-attività al giorno (es. 1 gioco cognitivo + 1 riflessione di carattere). Il classico ritmo stoico progressivo.
                        </p>
                      </div>
                    </button>

                    {/* Passo Intenso */}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setTrainingPace('intense');
                      }}
                      className={`text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                        trainingPace === 'intense'
                          ? 'bg-[#E3EFE7] border-[#2F654A] shadow-xs ring-1 ring-[#2F654A]'
                          : 'bg-white border-[#CBDDD2] hover:border-[#8EAD9B]'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 mt-0.5">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#122B1E]">Passo Intenso (Sfida & Focus Pieno)</span>
                          <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full">15-20 min/giorno</span>
                        </div>
                        <p className="text-[11px] text-[#476755] mt-0.5 leading-snug">
                          3-4 attività al giorno. Per chi vuole un salto rapido di memoria di lavoro e padronanza emotiva.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Rassicurazione etica e filosofica */}
              <div className="p-3 rounded-2xl bg-[#DFEDE5]/60 border border-[#CBDDD2] text-[11px] text-[#345946] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2F654A] shrink-0" />
                <span>
                  I tuoi dati rimangono riservati e sincronizzati. Nessun giudizio: ogni giorno è un'opportunità di miglioramento gentile.
                </span>
              </div>

              {/* Pulsante Invio */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#1E4332] to-[#2B5641] hover:from-[#173527] hover:to-[#224534] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'register' ? 'Crea Account & Inizia da Zero' : 'Accedi al Profilo'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Pre-fill */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-xs text-[#406852] hover:text-[#183626] font-semibold underline underline-offset-2 transition"
              >
                Vuoi provare subito? Compila con account dimostrativo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
