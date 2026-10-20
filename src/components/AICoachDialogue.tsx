import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../utils/audio';
import { UserProfile, ChatMessage } from '../types';
import { Sparkles, Send, Loader2, User, Compass, HeartHandshake, ShieldCheck, Flame } from 'lucide-react';

interface Props {
  profile: UserProfile;
}

const QUICK_PROMPTS = [
  "Come stabilire confini sani senza sensi di colpa?",
  "Come sviluppare una percezione realistica di me stesso?",
  "Protocollo scientifico per gestire lo stress e ricaricarmi",
  "Genera un mantra personalizzato per la mia mente",
  "Come ottimizzare il ritmo circadiano e il sonno profondo?",
  "Come praticare altruismo e uscire dall'iper-focalizzazione su di me?",
  "Esercizio per rafforzare l'autostima incondizionata"
];

export const AICoachDialogue: React.FC<Props> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-coach',
      role: 'model',
      text: `Benvenuto, ${profile.name}. Sono il tuo Mentore Luancer per la crescita personale e l'autodisciplina. Quale sfida, abitudine o decisione vorresti affrontare oggi insieme per agire con maggiore lucidità e calma?`,
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend = input) => {
    if (!textToSend.trim() || loading) return;

    soundFx.playClick();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = newMessages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          userStats: {
            gci: profile.gci,
            strongSkills: ['Disciplina e costanza', 'Riflessione stoica'],
            weakSkills: ['Gestione distrazioni digitali'],
            characterScore: `${profile.scores.character}/1000`,
            streak: profile.streak,
          },
        }),
      });

      const data = await res.json();
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || "Prendi un respiro profondo e concentrati solo sul prossimo singolo passo che è sotto il tuo diretto controllo.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botReply]);
      soundFx.playSuccess();
    } catch {
      const fallbackReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: `Ottima riflessione. La saggezza pratica ci insegna a separare ciò che dipende da noi da ciò che è fuori dal nostro controllo. Inizia con una singola micro-azione concreta adesso.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-coach-dialogue-view" className="flex flex-col h-[calc(100vh-190px)] max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white border border-[#CBDDD2] rounded-3xl p-3.5 flex items-center justify-between mb-3 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1E4332] flex items-center justify-center text-white font-bold shadow-xs">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#122219] flex items-center gap-1.5 font-display">
              Luancer Mentore Personale
            </h3>
            <span className="text-[10px] text-[#2D734C] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D734C]"></span> Guida per la Crescita Umana
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#557163] block">Virtù & Carattere</span>
          <span className="text-xs font-mono font-bold text-[#1F4E37] bg-[#E5F2EC] px-2.5 py-0.5 rounded-full border border-[#CBDDD2]">
            {profile.scores.character} pt
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2 scrollbar-thin">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-[#E5F2EC] border border-[#CBDDD2] flex items-center justify-center text-[#24523C] shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[84%] rounded-3xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-[#1E4332] text-white font-medium rounded-tr-none'
                    : 'bg-white border border-[#CBDDD2] text-[#122219] rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-[#D6E7DC] border border-[#CBDDD2] flex items-center justify-center text-[#1E4332] shrink-0 mt-0.5 font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 items-center text-[#557163] text-xs py-2">
            <div className="w-7 h-7 rounded-lg bg-[#E5F2EC] border border-[#CBDDD2] flex items-center justify-center text-[#24523C]">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>Il Mentore sta riflettendo sul tuo percorso...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="py-2 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-[#EAF3EE] border border-[#CBDDD2] hover:border-[#52826A] text-[11px] text-[#2A4B3C] font-medium transition shrink-0 shadow-2xs cursor-pointer active:scale-95"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="pt-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chiedi un consiglio su una situazione reale, abitudine o emozione..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white border border-[#CBDDD2] focus:border-[#2E5C45] text-[#122219] placeholder-[#79988B] text-xs sm:text-sm focus:outline-none transition shadow-2xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-11 w-11 rounded-2xl bg-[#1E4332] hover:bg-[#2B5742] disabled:opacity-40 text-white flex items-center justify-center font-bold shadow-sm transition active:scale-95 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
