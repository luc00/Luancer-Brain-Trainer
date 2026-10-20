import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n';
import { soundFx } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { lang, setLanguage, languages, t } = useLanguage();

  if (!isOpen) return null;

  const handleSelect = (code: Language) => {
    soundFx.playSuccess();
    setLanguage(code);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-sm bg-[#EBF3EE] border border-[#CBDDD2] rounded-3xl p-5 shadow-2xl text-[#122019] relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#CBDDD2]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D4E8DC] border border-[#BBD5C6] flex items-center justify-center text-[#1E4332]">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-[#122219]">
                  {t.languageSelectTitle}
                </h3>
                <span className="text-[11px] text-[#597568] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#2E7652]" />
                  {t.languageAutoDetected}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-[#D4E8DC] text-[#597568] hover:text-[#122219] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Languages Grid */}
          <div className="space-y-2 py-4">
            {languages.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#1E4332] text-white border-[#1E4332] shadow-md'
                      : 'bg-white hover:bg-[#F2F7F4] text-[#122019] border-[#CBDDD2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{item.flag}</span>
                    <div className="text-left">
                      <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-[#122019]'}`}>
                        {item.nativeName}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-[#D4E8DC]' : 'text-[#597568]'}`}>
                        {item.country} ({item.name})
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white border border-[#CBDDD2] text-xs font-semibold text-[#1E4332] hover:bg-[#F2F7F4] transition"
            >
              {t.close}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
