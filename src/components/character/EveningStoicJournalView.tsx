import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { StoicJournalEntry, UserProfile } from '../../types';
import { saveJournalEntry } from '../../utils/storage';
import { BookOpen, CheckCircle2, ArrowLeft, Save, Sparkles, Calendar, History, Trophy, AlertCircle, Heart } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdateProfile: () => void;
  onExit: () => void;
}

export const EveningStoicJournalView: React.FC<Props> = ({ profile, onUpdateProfile, onExit }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const existingToday = profile.journalEntries?.find((e) => e.date === todayStr);

  const [triumph, setTriumph] = useState(existingToday?.triumph || '');
  const [slip, setSlip] = useState(existingToday?.slip || '');
  const [gratitude, setGratitude] = useState(existingToday?.gratitude || '');
  const [tomorrowFocus, setTomorrowFocus] = useState(existingToday?.tomorrowFocus || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!triumph.trim() && !slip.trim() && !gratitude.trim() && !tomorrowFocus.trim()) return;

    soundFx.playSuccess();
    saveJournalEntry({
      date: todayStr,
      triumph: triumph.trim(),
      slip: slip.trim(),
      gratitude: gratitude.trim(),
      tomorrowFocus: tomorrowFocus.trim(),
    });

    onUpdateProfile();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const historyEntries = profile.journalEntries || [];

  return (
    <div id="evening-stoic-journal-view" className="space-y-4 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-2xl p-3.5 shadow-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-xs font-semibold text-[#3D5B4D] hover:text-[#122219] transition"
        >
          <ArrowLeft className="w-4 h-4" /> Esci
        </button>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#1E4332]" />
          <span className="text-xs font-bold text-[#122219]">Diario di Auto-Esame</span>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1 text-xs font-semibold text-[#1E4332] bg-[#E5F2EC] px-2.5 py-1 rounded-full border border-[#CBDDD2]"
        >
          <History className="w-3.5 h-3.5" /> {showHistory ? 'Oggi' : 'Archivio'}
        </button>
      </div>

      {showHistory ? (
        /* History Archive */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-[#122219] uppercase tracking-wider">Le Tue Riflessioni Passate</h3>
            <span className="text-xs text-[#597568]">{historyEntries.length} registrazioni</span>
          </div>

          {historyEntries.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#CBDDD2] rounded-3xl space-y-2">
              <BookOpen className="w-8 h-8 text-[#8EAFA0] mx-auto opacity-50" />
              <p className="text-xs text-[#597568]">Nessuna voce salvata finora. Completa la tua prima revisione di oggi!</p>
            </div>
          ) : (
            historyEntries.map((item) => (
              <div key={item.id} className="bg-white border border-[#CBDDD2] rounded-3xl p-4.5 shadow-xs space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#CBDDD2]/60">
                  <span className="font-bold text-[#122219] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1E4332]" /> {item.date}
                  </span>
                  <span className="text-[10px] text-[#597568] bg-[#F7FAF8] px-2 py-0.5 rounded-full border border-[#CBDDD2]">Completato</span>
                </div>

                {item.triumph && (
                  <div>
                    <span className="text-[10px] font-bold text-[#1E4332] uppercase block">Vittoria / Disciplina:</span>
                    <p className="text-[#2B4E3E] mt-0.5">{item.triumph}</p>
                  </div>
                )}

                {item.slip && (
                  <div>
                    <span className="text-[10px] font-bold text-[#8C5D19] uppercase block">Momento di Debolezza:</span>
                    <p className="text-[#544026] mt-0.5">{item.slip}</p>
                  </div>
                )}

                {item.gratitude && (
                  <div>
                    <span className="text-[10px] font-bold text-[#7F3847] uppercase block">Gratitudine:</span>
                    <p className="text-[#5E2734] mt-0.5">{item.gratitude}</p>
                  </div>
                )}

                {item.tomorrowFocus && (
                  <div>
                    <span className="text-[10px] font-bold text-[#4D3B6A] uppercase block">Intenzione Domani:</span>
                    <p className="text-[#3A2954] mt-0.5">{item.tomorrowFocus}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Journal Input Form */
        <form onSubmit={handleSave} className="space-y-4">
          {/* Intro Card */}
          <div className="bg-gradient-to-br from-[#163325] via-[#1E4332] to-[#2B5340] border border-[#3E6C55] rounded-3xl p-5 shadow-sm text-white space-y-1.5">
            <div className="flex items-center gap-2 text-[#F6C667]">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Tradizione Filosofica Stoica</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">L&apos;Esame di Coscienza Serale</h2>
            <p className="text-xs text-[#CFE5D8] leading-relaxed">
              &ldquo;Quando la luce è spenta e tutto è in silenzio, esamino l&apos;intera mia giornata e ripasso ciò che ho fatto e detto, senza nascondermi nulla.&rdquo; — Seneca
            </p>
          </div>

          {/* Question 1: Triumph */}
          <div className="bg-white border border-[#CBDDD2] rounded-3xl p-4.5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#1E4332]">
              <Trophy className="w-4 h-4" />
              <label htmlFor="triumph-input" className="text-xs font-bold text-[#122219]">
                1. Dove ho agito con saggezza o disciplina oggi?
              </label>
            </div>
            <textarea
              id="triumph-input"
              rows={2}
              value={triumph}
              onChange={(e) => setTriumph(e.target.value)}
              placeholder="Es. Ho mantenuto la calma in una discussione, ho fatto la sessione di studio senza distrazioni..."
              className="w-full p-3 rounded-2xl bg-[#FAFDFB] border border-[#CBDDD2] text-xs text-[#122219] focus:outline-none focus:border-[#1E4332] placeholder-[#8EAFA0] resize-none"
            />
          </div>

          {/* Question 2: Slip */}
          <div className="bg-white border border-[#CBDDD2] rounded-3xl p-4.5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#8C5D19]">
              <AlertCircle className="w-4 h-4" />
              <label htmlFor="slip-input" className="text-xs font-bold text-[#122219]">
                2. Dove sono stato impulsivo, pigro o reattivo?
              </label>
            </div>
            <textarea
              id="slip-input"
              rows={2}
              value={slip}
              onChange={(e) => setSlip(e.target.value)}
              placeholder="Es. Ho ceduto allo scroll compulsivo per 30 min, ho risposto male per stanchezza..."
              className="w-full p-3 rounded-2xl bg-[#FAFDFB] border border-[#CBDDD2] text-xs text-[#122219] focus:outline-none focus:border-[#8C5D19] placeholder-[#8EAFA0] resize-none"
            />
          </div>

          {/* Question 3: Gratitude */}
          <div className="bg-white border border-[#CBDDD2] rounded-3xl p-4.5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#7F3847]">
              <Heart className="w-4 h-4" />
              <label htmlFor="gratitude-input" className="text-xs font-bold text-[#122219]">
                3. Per cosa provo sincera gratitudine oggi?
              </label>
            </div>
            <textarea
              id="gratitude-input"
              rows={2}
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Es. Il supporto di un amico, un buon pasto caldo, il tempo per leggere..."
              className="w-full p-3 rounded-2xl bg-[#FAFDFB] border border-[#CBDDD2] text-xs text-[#122219] focus:outline-none focus:border-[#7F3847] placeholder-[#8EAFA0] resize-none"
            />
          </div>

          {/* Question 4: Tomorrow Focus */}
          <div className="bg-white border border-[#CBDDD2] rounded-3xl p-4.5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#4D3B6A]">
              <Sparkles className="w-4 h-4" />
              <label htmlFor="tomorrow-input" className="text-xs font-bold text-[#122219]">
                4. Quale intenzione o virtù guiderà il mio domani?
              </label>
            </div>
            <textarea
              id="tomorrow-input"
              rows={2}
              value={tomorrowFocus}
              onChange={(e) => setTomorrowFocus(e.target.value)}
              placeholder="Es. Completare il compito più difficile entro le 11:00 con presenza totale..."
              className="w-full p-3 rounded-2xl bg-[#FAFDFB] border border-[#CBDDD2] text-xs text-[#122219] focus:outline-none focus:border-[#4D3B6A] placeholder-[#8EAFA0] resize-none"
            />
          </div>

          {/* Save Action */}
          <div className="space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#1E4332] hover:bg-[#2A5741] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98"
            >
              <Save className="w-4 h-4" /> Salva Riflessione Serale (+150 XP & Saggezza)
            </button>

            <AnimatePresence>
              {savedSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-xl bg-[#E5F2EC] border border-[#CBDDD2] text-center text-xs font-bold text-[#1E4332] flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Riflessione salvata con successo nel tuo percorso personale!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      )}
    </div>
  );
};
