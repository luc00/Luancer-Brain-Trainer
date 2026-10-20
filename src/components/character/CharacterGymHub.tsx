import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { UserProfile, CharacterTraits } from '../../types';
import { 
  Shield, 
  Wind, 
  Sparkles, 
  Compass, 
  Flame, 
  ArrowRight, 
  HeartPulse, 
  Scale, 
  MessageSquare, 
  BookOpen, 
  Target, 
  Lightbulb,
  HeartHandshake
} from 'lucide-react';
import { CharacterDilemmaView } from './CharacterDilemmaView';
import { NeuroBreathingView } from './NeuroBreathingView';
import { MentalModelsGym } from './MentalModelsGym';
import { CommunicationGym } from './CommunicationGym';
import { RealLifeChallengesView } from './RealLifeChallengesView';
import { EveningStoicJournalView } from './EveningStoicJournalView';
import { PsychologyPillarsGym } from './PsychologyPillarsGym';
import { CharacterRadarChart } from './CharacterRadarChart';
import { recordPillarExerciseCompleted } from '../../utils/storage';

interface Props {
  profile: UserProfile;
  onUpdateTraits: (delta: Partial<CharacterTraits>, xp: number) => void;
  onRefreshProfile?: () => void;
}

export const CharacterGymHub: React.FC<Props> = ({ profile, onUpdateTraits, onRefreshProfile }) => {
  const [activeModule, setActiveModule] = useState<
    'hub' | 'pillars' | 'dilemma' | 'breathing' | 'mental-models' | 'communication' | 'real-challenges' | 'journal'
  >('hub');
  const [selectedPillarId, setSelectedPillarId] = useState<string | undefined>(undefined);

  const traits = profile.characterTraits;

  const traitList = [
    { label: 'Resilienza & Antifragilità', value: traits.resilience, color: 'from-[#8C5D19] to-[#C48C2E]', icon: Flame },
    { label: 'Autocontrollo & Disciplina', value: traits.temperance, color: 'from-[#1E4332] to-[#3B7055]', icon: Scale },
    { label: 'Lucidità & Saggezza', value: traits.wisdom, color: 'from-[#24523C] to-[#488065]', icon: Compass },
    { label: 'Coraggio & Assertività', value: traits.courage, color: 'from-[#7F3847] to-[#A8586A]', icon: Shield },
    { label: 'Padronanza Emotiva & Calma', value: traits.emotionalMastery, color: 'from-[#4D3B6A] to-[#715A98]', icon: HeartPulse },
  ];

  if (activeModule === 'pillars') {
    return (
      <PsychologyPillarsGym
        profile={profile}
        initialPillarId={selectedPillarId}
        onUpdateTraits={onUpdateTraits}
        onCompletePillarExercise={(pillarId, xp) => {
          recordPillarExerciseCompleted(pillarId, xp);
          if (onRefreshProfile) onRefreshProfile();
        }}
        onExit={() => {
          setSelectedPillarId(undefined);
          setActiveModule('hub');
        }}
      />
    );
  }

  if (activeModule === 'dilemma') {
    return (
      <CharacterDilemmaView
        onComplete={(delta, xp) => {
          onUpdateTraits(delta, xp);
          setActiveModule('hub');
        }}
        onExit={() => setActiveModule('hub')}
      />
    );
  }

  if (activeModule === 'mental-models') {
    return (
      <MentalModelsGym
        onComplete={(xp) => {
          onUpdateTraits({ wisdom: 8, temperance: 4 }, xp);
          setActiveModule('hub');
        }}
        onExit={() => setActiveModule('hub')}
      />
    );
  }

  if (activeModule === 'communication') {
    return (
      <CommunicationGym
        onComplete={(xp) => {
          onUpdateTraits({ courage: 6, emotionalMastery: 6, wisdom: 4 }, xp);
          setActiveModule('hub');
        }}
        onExit={() => setActiveModule('hub')}
      />
    );
  }

  if (activeModule === 'real-challenges') {
    return (
      <RealLifeChallengesView
        profile={profile}
        onUpdateProfile={() => {
          if (onRefreshProfile) onRefreshProfile();
        }}
        onExit={() => setActiveModule('hub')}
      />
    );
  }

  if (activeModule === 'journal') {
    return (
      <EveningStoicJournalView
        profile={profile}
        onUpdateProfile={() => {
          if (onRefreshProfile) onRefreshProfile();
        }}
        onExit={() => setActiveModule('hub')}
      />
    );
  }

  if (activeModule === 'breathing') {
    return (
      <NeuroBreathingView
        onComplete={(xp) => {
          onUpdateTraits({ emotionalMastery: 8, temperance: 6 }, xp);
          setActiveModule('hub');
        }}
        onExit={() => setActiveModule('hub')}
      />
    );
  }

  const completedChallengesCount = profile.completedChallenges?.length || 0;
  const journalEntriesCount = profile.journalEntries?.length || 0;

  return (
    <div id="character-gym-hub" className="space-y-4 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#163325] via-[#1E4332] to-[#2B5340] border border-[#3E6C55] rounded-3xl p-5 shadow-sm text-white relative overflow-hidden">
        <div className="flex items-center gap-2 text-[#F6C667] mb-1">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Crescita Umana & Virtù Pratiche</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1 font-display">Palestra della Persona</h2>
        <p className="text-xs text-[#CFE5D8] leading-relaxed">
          I veri pilastri del valore umano: forgiare disciplina, lucidità decisionale, empatia relazionale e calma interiore nella vita reale.
        </p>
      </div>

      {/* Interactive Radar Chart Visualization of Character Traits Over Time */}
      <CharacterRadarChart
        profile={profile}
        onOpenModule={(moduleKey) => {
          if (moduleKey === 'pillars') setActiveModule('pillars');
          else if (moduleKey === 'real-challenges') setActiveModule('real-challenges');
          else if (moduleKey === 'breathing') setActiveModule('breathing');
          else if (moduleKey === 'mental-models') setActiveModule('mental-models');
          else if (moduleKey === 'communication') setActiveModule('communication');
          else if (moduleKey === 'dilemma') setActiveModule('dilemma');
          else if (moduleKey === 'journal') setActiveModule('journal');
        }}
      />

      {/* Human Training Modules Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#14261D] uppercase tracking-wider">Discipline & Laboratori Umani</span>
          <span className="text-xs text-[#597568]">7 Percorsi Guidati</span>
        </div>

        {/* Master Feature Card: I 18 Pilastri della Psiche & Virtù */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveModule('pillars');
          }}
          className="p-4.5 rounded-3xl bg-gradient-to-br from-[#1B3D2D] via-[#24523C] to-[#163526] border border-[#3E6C55] text-white shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#E5F2EC]/20 border border-white/20 flex items-center justify-center text-[#F6C667] group-hover:scale-110 transition shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F6C667] text-[#332400]">
                  Nuova Accademia Completa
                </span>
                <span className="text-[10px] text-[#CFE5D8] font-mono">
                  {profile.completedPillarExercises?.length || 0}/18 completati
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#F6C667] transition mt-1">
                I 18 Pilastri della Psiche & Virtù
              </h3>
              <p className="text-xs text-[#CFE5D8] line-clamp-1">
                Percezione realistica, confini, stress, mantra, sonno, altruismo, autostima e psicologia positiva
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#1E4332] transition shrink-0 ml-2">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* 1. Sfide Quotidiane della Vita Reale */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveModule('real-challenges');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E5F2EC] border border-[#BBD5C6] flex items-center justify-center text-[#1E4332] group-hover:scale-105 transition shadow-2xs">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E5F2EC] text-[#1E4332]">
                  Altruismo & Azione Reale
                </span>
                {completedChallengesCount > 0 && (
                  <span className="text-[10px] text-[#597568] font-mono">{completedChallengesCount} completate</span>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#122219] group-hover:text-[#1E4332] transition mt-0.5">
                Sfida del Giorno & Azioni nel Mondo Reale
              </h3>
              <p className="text-xs text-[#597568] line-clamp-1">Complimento sincero, gestione dello stress, altruismo, ascolto puro e doccia fredda</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8EAFA0] group-hover:text-[#1E4332] transition" />
        </div>

        {/* 2. Modelli Mentali & Bias Cognitivi */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveModule('mental-models');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FBF2E3] border border-[#E9CE9E] flex items-center justify-center text-[#8C5D19] group-hover:scale-105 transition shadow-2xs">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FBF2E3] text-[#8C5D19]">
                Ragionamento Lucido
              </span>
              <h3 className="text-sm font-bold text-[#122219] group-hover:text-[#8C5D19] transition mt-0.5">
                Palestra dei Modelli Mentali
              </h3>
              <p className="text-xs text-[#597568] line-clamp-1">Pensiero di 2° ordine, costi sommersi, rasoio di Hanlon e bias</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8EAFA0] group-hover:text-[#8C5D19] transition" />
        </div>

        {/* 3. Comunicazione Assertiva & Ascolto Empatico */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveModule('communication');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E5F2EC] border border-[#CBDDD2] flex items-center justify-center text-[#24523C] group-hover:scale-105 transition shadow-2xs">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E5F2EC] text-[#24523C]">
                Relazioni & Confini
              </span>
              <h3 className="text-sm font-bold text-[#122219] group-hover:text-[#24523C] transition mt-0.5">
                Comunicazione Assertiva & Empatia
              </h3>
              <p className="text-xs text-[#597568] line-clamp-1">Dire di NO con rispetto, ascolto attivo e gestione dei conflitti</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8EAFA0] group-hover:text-[#24523C] transition" />
        </div>

        {/* 4. Diario Serale Stoico & Auto-Esame */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveModule('journal');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F2EEF8] border border-[#D5CBE3] flex items-center justify-center text-[#59427C] group-hover:scale-105 transition shadow-2xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#F2EEF8] text-[#59427C]">
                  Riflessione & Saggezza
                </span>
                {journalEntriesCount > 0 && (
                  <span className="text-[10px] text-[#597568] font-mono">{journalEntriesCount} scritti</span>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#122219] group-hover:text-[#59427C] transition mt-0.5">
                Diario di Auto-Esame Serale
              </h3>
              <p className="text-xs text-[#597568] line-clamp-1">La revisione stoica di Seneca e Marco Aurelio per imparare dagli errori</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8EAFA0] group-hover:text-[#59427C] transition" />
        </div>

        {/* 5. Dilemmi Stoici & Scenari Etici */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveModule('dilemma');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FBF2E3] border border-[#E9CE9E] flex items-center justify-center text-[#8C5D19] group-hover:scale-105 transition shadow-2xs">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FBF2E3] text-[#8C5D19]">
                Etica & Integrità
              </span>
              <h3 className="text-sm font-bold text-[#122219] group-hover:text-[#8C5D19] transition mt-0.5">
                Dilemmi Morali & Scenari Pratici
              </h3>
              <p className="text-xs text-[#597568] line-clamp-1">Scelte difficili, lavoro, reputazione e fedeltà ai propri valori</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8EAFA0] group-hover:text-[#8C5D19] transition" />
        </div>

        {/* 6. Biofeedback Respirazione & Coerenza */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveModule('breathing');
          }}
          className="p-4 rounded-3xl bg-white border border-[#CBDDD2] hover:border-[#52826A] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E5F2EC] border border-[#BBD5C6] flex items-center justify-center text-[#24523C] group-hover:scale-105 transition shadow-2xs">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E5F2EC] text-[#24523C]">
                Calma Fisiologica
              </span>
              <h3 className="text-sm font-bold text-[#122219] group-hover:text-[#24523C] transition mt-0.5">
                Respirazione & Coerenza Cardiaca
              </h3>
              <p className="text-xs text-[#597568] line-clamp-1">Pacer 4-7-8 e Box Breathing per azzerare l&apos;ansia e centrare la mente</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8EAFA0] group-hover:text-[#24523C] transition" />
        </div>
      </div>
    </div>
  );
};

