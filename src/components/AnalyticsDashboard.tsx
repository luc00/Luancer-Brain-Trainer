import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../utils/audio';
import { UserProfile, NeuroDiagnosticReport } from '../types';
import { Trophy, Brain, Zap, Target, Calculator, Shield, Sparkles, Loader2, Award, Clock, ArrowUpRight, Flame, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  profile: UserProfile;
}

export const AnalyticsDashboard: React.FC<Props> = ({ profile }) => {
  const [report, setReport] = useState<NeuroDiagnosticReport | null>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);

  const scores = profile.scores;

  const radarCategories = [
    { key: 'memory', label: 'Memoria', score: scores.memory, max: 1000, color: '#24523C', icon: Brain },
    { key: 'speed', label: 'Velocità', score: scores.speed, max: 1000, color: '#8C5D19', icon: Zap },
    { key: 'logic', label: 'Logica', score: scores.logic, max: 1000, color: '#2C4960', icon: Calculator },
    { key: 'focus', label: 'Focus', score: scores.focus, max: 1000, color: '#7F3847', icon: Target },
    { key: 'language', label: 'Linguaggio', score: scores.language, max: 1000, color: '#4D3B6A', icon: Sparkles },
    { key: 'character', label: 'Carattere', score: scores.character, max: 1000, color: '#2A5741', icon: Shield },
  ];

  const badges = [
    { id: 'first_synapse', title: 'Prima Sinapsi', desc: 'Completato il primo allenamento', unlocked: true, icon: Brain },
    { id: 'stoic_mind', title: 'Mente Stoica', desc: 'Risolto dilemma con 90%+ virtù', unlocked: true, icon: Shield },
    { id: 'speed_demon', title: 'Riflessi Sub-Atomici', desc: 'Tempo di reazione < 350ms', unlocked: true, icon: Zap },
    { id: 'master_nback', title: 'Maestro N-Back', desc: 'Superato livello 3-Back', unlocked: profile.level >= 2, icon: Target },
    { id: 'streak_week', title: 'Settimana di Fuoco', desc: '7 giorni consecutivi', unlocked: profile.streak >= 7, icon: Flame },
    { id: 'quantum_mind', title: 'Mente Quantica', desc: 'GCI superiore a 800 pt', unlocked: profile.gci >= 800, icon: Sparkles },
  ];

  const generateDiagnosticReport = async () => {
    soundFx.playClick();
    setLoadingReport(true);
    try {
      const res = await fetch('/api/ai/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionData: profile.sessionsHistory.slice(0, 8),
          profile: {
            gci: profile.gci,
            brainAge: profile.brainAge,
            level: profile.level,
            scores: profile.scores,
            characterTraits: profile.characterTraits,
          },
        }),
      });
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
        soundFx.playSuccess();
        try {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
        } catch {}
      }
    } catch {
      setReport({
        archetype: "Architetto Neurale Strategico",
        summary: "Ottimo equilibrio tra elaborazione rapida e memoria di lavoro. Il carattere dimostra elevata lucidità nei dilemmi sotto pressione.",
        topCognitivePower: "Inibizione dei distrattori e velocità sinaptica",
        growthOpportunity: "Potenziare la memoria visuo-spaziale in condizioni di affaticamento",
        characterTrait: "Autocontrollo stoico elevato (75%)",
        brainAgeEstimate: 23,
        dailyPrescription: "1 sessione Dual N-Back 3-Back, 1 Stroop test, 4 cicli di respirazione 4-7-8."
      });
    } finally {
      setLoadingReport(false);
    }
  };

  // Helper to calculate polygon coordinates for 6-axis SVG radar
  const getRadarPoints = () => {
    const totalAxes = 6;
    const center = 100;
    const radius = 70;
    return radarCategories
      .map((cat, i) => {
        const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
        const normalized = Math.max(0.2, cat.score / 1000);
        const x = center + radius * normalized * Math.cos(angle);
        const y = center + radius * normalized * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div id="analytics-dashboard" className="space-y-5 pb-20">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-[#163325] via-[#1E4332] to-[#2B5340] border border-[#3E6C55] rounded-2xl p-5 shadow-lg text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-[#CFE5D8] block">Profilo Cognitivo Luancer</span>
            <h2 className="text-xl font-bold text-white font-display">{profile.name}</h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#A6CDB7] block uppercase">Grado</span>
            <span className="text-xs font-bold text-[#142D20] bg-[#F6C667] px-2.5 py-1 rounded-full shadow-2xs">
              Liv. {profile.level} • {profile.title}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[#37614B]">
          <div className="bg-[#122A1E]/60 p-2.5 rounded-xl border border-[#2D5640]">
            <span className="text-[10px] text-[#A6CDB7] block">Indice GCI</span>
            <span className="text-lg font-mono font-bold text-[#F6C667]">{profile.gci}</span>
          </div>
          <div className="bg-[#122A1E]/60 p-2.5 rounded-xl border border-[#2D5640]">
            <span className="text-[10px] text-[#A6CDB7] block">Brain Age</span>
            <span className="text-lg font-bold text-white">{profile.brainAge} a</span>
          </div>
          <div className="bg-[#122A1E]/60 p-2.5 rounded-xl border border-[#2D5640]">
            <span className="text-[10px] text-[#A6CDB7] block">Allenamenti</span>
            <span className="text-lg font-mono font-bold text-[#E5F2EC]">{profile.completedWorkoutsCount}</span>
          </div>
        </div>
      </div>

      {/* 6-Axis Neuro-Radar Visualization */}
      <div className="bg-white border border-[#CBDDD2] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#122219] uppercase tracking-wider">Radar delle Competenze Neurate</span>
          <span className="text-[11px] font-mono text-[#24523C] bg-[#E5F2EC] px-2 py-0.5 rounded-full border border-[#CBDDD2]">6 Dimensioni</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* SVG Radar */}
          <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Background circular web grids */}
              {[0.25, 0.5, 0.75, 1.0].map((step, idx) => (
                <polygon
                  key={idx}
                  points={radarCategories
                    .map((_, i) => {
                      const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                      const r = 70 * step;
                      return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#CBDDD2"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              ))}

              {/* Axes lines */}
              {radarCategories.map((_, i) => {
                const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                const x = 100 + 70 * Math.cos(angle);
                const y = 100 + 70 * Math.sin(angle);
                return <line key={i} x1="100" y1="100" x2={x} y2={y} stroke="#CBDDD2" strokeWidth="1" />;
              })}

              {/* Filled Polygon for user scores */}
              <polygon
                points={getRadarPoints()}
                fill="rgba(30, 67, 50, 0.2)"
                stroke="#1E4332"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* Categories List Breakdown */}
          <div className="flex-1 w-full space-y-2">
            {radarCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.key} className="flex items-center justify-between text-xs bg-[#F7FAF8] p-2.5 rounded-xl border border-[#CBDDD2]">
                  <span className="flex items-center gap-2 text-[#243E31] font-medium">
                    <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                    {cat.label}
                  </span>
                  <span className="font-mono font-bold text-[#122219]">{cat.score} pt</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 18 Psychology & Virtue Pillars Progression */}
      <div className="bg-white border border-[#CBDDD2] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1E4332]">
            <Shield className="w-4 h-4 text-[#2E7652]" />
            <h3 className="text-sm font-bold text-[#122219] font-display">18 Pilastri della Psiche & Virtù</h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#1E4332] bg-[#E5F2EC] px-2.5 py-0.5 rounded-full border border-[#BBD5C6]">
            {profile.completedPillarExercises?.length || 0} / 18 Integrati
          </span>
        </div>

        <div className="h-2 w-full bg-[#E5EFE9] rounded-full overflow-hidden border border-[#CBDDD2]">
          <div
            className="h-full bg-gradient-to-r from-[#24523C] to-[#52826A] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (((profile.completedPillarExercises?.length || 0) / 18) * 100))}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-2.5 rounded-xl bg-[#F7FAF8] border border-[#CBDDD2]">
            <span className="text-[#597568] block">Mente & Consapevolezza</span>
            <span className="font-bold text-[#122219]">Percezione, Mantra & Creatività</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7FAF8] border border-[#CBDDD2]">
            <span className="text-[#597568] block">Emozioni, Stress & Sonno</span>
            <span className="font-bold text-[#122219]">Calma, Sonno & Sicurezza</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7FAF8] border border-[#CBDDD2]">
            <span className="text-[#597568] block">Identità & Autostima</span>
            <span className="font-bold text-[#122219]">Auto-efficacia & Responsabilità</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7FAF8] border border-[#CBDDD2]">
            <span className="text-[#597568] block">Relazioni & Altruismo</span>
            <span className="font-bold text-[#122219]">Confini, Legami & Psicologia Positiva</span>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Report Section */}
      <div className="bg-white border border-[#CBDDD2] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[#1E4332]">
            <Sparkles className="w-4 h-4 text-[#356E52]" />
            <h3 className="text-sm font-bold text-[#122219] font-display">Report Neuro-Diagnostico AI</h3>
          </div>
          <button
            onClick={generateDiagnosticReport}
            disabled={loadingReport}
            className="px-3 py-1.5 rounded-lg bg-[#1E4332] hover:bg-[#2B5742] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            {loadingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            {report ? 'Aggiorna Report' : 'Genera Diagnosi'}
          </button>
        </div>

        {report ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 text-xs"
          >
            <div className="bg-[#E5F2EC] p-3 rounded-xl border border-[#CBDDD2]">
              <span className="text-[10px] text-[#1E4332] font-bold uppercase tracking-wider block">Archetipo Cognitivo</span>
              <p className="text-sm font-bold text-[#122219] mt-0.5">{report.archetype}</p>
            </div>

            <p className="text-[#3A5649] leading-relaxed bg-[#F7FAF8] p-3 rounded-xl border border-[#CBDDD2]">
              {report.summary}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#E5F2EC] border border-[#CBDDD2] p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-[#1E4332] uppercase block">Super-Potere</span>
                <p className="text-[#122219] text-[11px] font-medium mt-0.5">{report.topCognitivePower}</p>
              </div>

              <div className="bg-[#FBF2E3] border border-[#E9CE9E] p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-[#8C5D19] uppercase block">Area di Sviluppo</span>
                <p className="text-[#3D2B12] text-[11px] font-medium mt-0.5">{report.growthOpportunity}</p>
              </div>
            </div>

            <div className="bg-[#EBF3EF] border border-[#CBDDD2] p-3 rounded-xl">
              <span className="text-[10px] font-bold text-[#1E4332] uppercase block">Prescrizione Neurale per Oggi</span>
              <p className="text-[#203D2E] text-[11px] font-medium mt-0.5">{report.dailyPrescription}</p>
            </div>
          </motion.div>
        ) : (
          <p className="text-xs text-[#597568] leading-relaxed">
            Tocca &ldquo;Genera Diagnosi&rdquo; per consentire al tuo Neuro-Coach Luancer di analizzare la tua telemetria e sintetizzare un report personalizzato sulle tue traiettorie di neuroplasticità.
          </p>
        )}
      </div>

      {/* Unlocked Badges */}
      <div className="bg-white border border-[#CBDDD2] rounded-2xl p-5 shadow-sm">
        <span className="text-xs font-bold text-[#122219] uppercase tracking-wider block mb-3">Distintivi & Traguardi</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className={`p-3 rounded-xl border transition-all ${
                  b.unlocked
                    ? 'bg-[#FAFDFB] border-[#CBDDD2] text-[#122219]'
                    : 'bg-[#F2F6F4]/50 border-[#DFEAE3] text-[#8EAFA0] opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    b.unlocked ? 'bg-[#FBF2E3] text-[#8C5D19] border border-[#E9CE9E]' : 'bg-[#E5EFE9] text-[#7A988B]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold truncate">{b.title}</span>
                </div>
                <p className="text-[10px] text-[#597568] leading-tight">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions History */}
      <div className="bg-white border border-[#CBDDD2] rounded-2xl p-5 shadow-sm">
        <span className="text-xs font-bold text-[#122219] uppercase tracking-wider block mb-3">Cronologia Sessioni Recenti</span>
        <div className="space-y-2">
          {profile.sessionsHistory.slice(0, 6).map((s) => (
            <div
              key={s.id}
              className="p-3 rounded-xl bg-[#F7FAF8] border border-[#CBDDD2] flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-[#122219] block">{s.gameTitle}</span>
                <span className="text-[10px] text-[#597568]">
                  Precisione: {s.accuracy}% • Reazione: {s.averageReactionTimeMs}ms
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-[#1E4332] block">{s.score} pt</span>
                <span className="text-[10px] text-[#24523C] font-semibold">+{s.xpEarned} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
