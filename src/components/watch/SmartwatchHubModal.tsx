import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Watch, 
  Heart, 
  Activity, 
  Zap, 
  Bluetooth, 
  Check, 
  X, 
  Smartphone, 
  Sparkles, 
  Flame, 
  ExternalLink,
  Copy,
  CheckCheck,
  Vibrate,
  Shield,
  RotateCcw
} from 'lucide-react';
import { watchBridge, WatchState, WatchDeviceType } from '../../utils/watchBridge';
import { AppleWatchPlayDevice } from './AppleWatchPlayDevice';
import { useLanguage } from '../../context/LanguageContext';
import { soundFx } from '../../utils/audio';
import { UserProfile } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onAwardXP: (xp: number, summary: string) => void;
}

export const SmartwatchHubModal: React.FC<Props> = ({ isOpen, onClose, profile, onAwardXP }) => {
  const { t } = useLanguage();
  const [watchState, setWatchState] = useState<WatchState>(watchBridge.getState());
  const [activeSubTab, setActiveSubTab] = useState<'play' | 'telemetry' | 'devices'>('play');
  const [selectedDeviceType, setSelectedDeviceType] = useState<WatchDeviceType>('apple-watch');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    const unsub = watchBridge.subscribe((state) => {
      setWatchState(state);
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleConnect = async (type: WatchDeviceType) => {
    soundFx.playClick();
    setSelectedDeviceType(type);
    await watchBridge.connectWatch(type);
    soundFx.playSuccess();
  };

  const handleDisconnect = () => {
    soundFx.playClick();
    watchBridge.disconnectWatch();
  };

  const handleTestHaptic = () => {
    soundFx.playClick();
    watchBridge.hapticFeedback('success');
  };

  const handleCopyStandaloneLink = () => {
    soundFx.playClick();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-[#EBF3EE] border border-[#CBDDD2] rounded-3xl p-4 sm:p-5 shadow-2xl text-[#122019] relative max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#CBDDD2] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#1E4332] text-[#F6C667] flex items-center justify-center shadow-xs">
                <Watch className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-display text-[#122219]">
                    {t.watchHeader}
                  </h3>
                  {watchState.isConnected ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4E8DC] text-[#1E4332] flex items-center gap-1 border border-[#BBD5C6]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t.watchConnected}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-600">
                      {t.watchDisconnected}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#597568] line-clamp-1">
                  {watchState.deviceName}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-[#D4E8DC] text-[#597568] hover:text-[#122219] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#D8E8DF] p-1 rounded-2xl my-3 shrink-0">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveSubTab('play');
              }}
              className={`py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                activeSubTab === 'play'
                  ? 'bg-white text-[#1E4332] shadow-xs'
                  : 'text-[#597568] hover:text-[#122219]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Gioca al Polso</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveSubTab('telemetry');
              }}
              className={`py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                activeSubTab === 'telemetry'
                  ? 'bg-white text-[#1E4332] shadow-xs'
                  : 'text-[#597568] hover:text-[#122219]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-rose-500" />
              <span>Biometria</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveSubTab('devices');
              }}
              className={`py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                activeSubTab === 'devices'
                  ? 'bg-white text-[#1E4332] shadow-xs'
                  : 'text-[#597568] hover:text-[#122219]'
              }`}
            >
              <Bluetooth className="w-3.5 h-3.5 text-sky-500" />
              <span>Dispositivi</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto pr-1">
            
            {/* SUBTAB 1: ON-WRIST PLAY MODE */}
            {activeSubTab === 'play' && (
              <div className="space-y-3 pb-2">
                <div className="bg-[#D4E8DC]/60 border border-[#BBD5C6] rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1E4332]" />
                    <span className="text-xs font-bold text-[#122219]">
                      Micro-Giochi Ottimizzati per Apple Watch
                    </span>
                  </div>
                  <button
                    onClick={handleTestHaptic}
                    className="text-[11px] font-bold text-[#1E4332] bg-white px-2 py-1 rounded-lg border border-[#CBDDD2] flex items-center gap-1 hover:bg-[#F0F6F2] active:scale-95 transition"
                    title="Test Vibrazione Aptica"
                  >
                    <Vibrate className="w-3 h-3" />
                    <span>Test Aptico</span>
                  </button>
                </div>

                {/* The Interactive Apple Watch Device Frame */}
                <AppleWatchPlayDevice
                  profile={profile}
                  onAwardXP={onAwardXP}
                  onClose={onClose}
                />
              </div>
            )}

            {/* SUBTAB 2: TELEMETRY & SENSORS */}
            {activeSubTab === 'telemetry' && (
              <div className="space-y-3 pb-2">
                {/* 4 Biometric Metric Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Heart Rate */}
                  <div className="bg-white border border-[#CBDDD2] rounded-2xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-rose-500 mb-1">
                      <span className="text-xs font-semibold text-[#597568]">Battito Cardiaco</span>
                      <Heart className="w-4 h-4 fill-rose-500 animate-pulse" />
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#122219]">
                      {watchState.biometrics.heartRate} <span className="text-xs font-sans font-normal text-[#597568]">BPM</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium">Zona a riposo ottimale</span>
                  </div>

                  {/* HRV */}
                  <div className="bg-white border border-[#CBDDD2] rounded-2xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-emerald-600 mb-1">
                      <span className="text-xs font-semibold text-[#597568]">Variabilità HRV</span>
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#122219]">
                      {watchState.biometrics.hrv} <span className="text-xs font-sans font-normal text-[#597568]">ms</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium">Alta resilienza vagale</span>
                  </div>

                  {/* Stress */}
                  <div className="bg-white border border-[#CBDDD2] rounded-2xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-amber-500 mb-1">
                      <span className="text-xs font-semibold text-[#597568]">Livello Stress</span>
                      <Flame className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#122219]">
                      {watchState.biometrics.stressLevel} <span className="text-xs font-sans font-normal text-[#597568]">/100</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium">Calma & Focus</span>
                  </div>

                  {/* Steps / Calories */}
                  <div className="bg-white border border-[#CBDDD2] rounded-2xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-sky-600 mb-1">
                      <span className="text-xs font-semibold text-[#597568]">Passi & Attività</span>
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#122219]">
                      {watchState.biometrics.stepsToday} <span className="text-xs font-sans font-normal text-[#597568]">passi</span>
                    </div>
                    <span className="text-[10px] text-[#597568]">~{watchState.biometrics.activeCalories} kcal attive</span>
                  </div>
                </div>

                {/* Sincronizzazione con Indice GCI */}
                <div className="bg-white border border-[#CBDDD2] rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-[#122219] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#1E4332]" />
                    <span>Integrazione Neuro-Somatica Luancer</span>
                  </h4>
                  <p className="text-xs text-[#597568] leading-relaxed">
                    I dati del sensore ottico dell'orologio calibrano in tempo reale la difficoltà dei test cognitivi e suggeriscono sessioni di respirazione quando lo stress supera la soglia di guardia.
                  </p>
                </div>
              </div>
            )}

            {/* SUBTAB 3: DEVICE PAIRING & STANDALONE WATCH APP */}
            {activeSubTab === 'devices' && (
              <div className="space-y-3 pb-2">
                <div className="bg-white border border-[#CBDDD2] rounded-2xl p-4 space-y-3 shadow-xs">
                  <span className="text-xs font-bold text-[#122219] block">Seleziona e Associa il tuo Orologio</span>
                  
                  {/* Device list */}
                  <div className="space-y-2">
                    {[
                      { id: 'apple-watch', name: 'Apple Watch Ultra / Series (watchOS)', icon: '⌚' },
                      { id: 'galaxy-watch', name: 'Samsung Galaxy Watch (WearOS)', icon: '💫' },
                      { id: 'pixel-watch', name: 'Google Pixel Watch (WearOS)', icon: '⭕' },
                      { id: 'garmin', name: 'Garmin Connect IQ & Forerunner', icon: '🏃' },
                      { id: 'generic-ble', name: 'Fascia Cardio Bluetooth BLE Standard', icon: '📡' },
                    ].map((dev) => {
                      const isConnectedThis = watchState.isConnected && watchState.deviceType === dev.id;
                      return (
                        <div
                          key={dev.id}
                          className={`p-3 rounded-xl border flex items-center justify-between transition ${
                            isConnectedThis
                              ? 'bg-[#E5F2EC] border-[#BBD5C6]'
                              : 'bg-[#F7FAF8] border-[#CBDDD2] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{dev.icon}</span>
                            <div>
                              <span className="text-xs font-bold text-[#122219] block">{dev.name}</span>
                              <span className="text-[10px] text-[#597568]">
                                {isConnectedThis ? 'Attualmente Associato e Attivo' : 'Pronto per l\'associazione'}
                              </span>
                            </div>
                          </div>

                          {isConnectedThis ? (
                            <button
                              onClick={handleDisconnect}
                              className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition"
                            >
                              Disconnetti
                            </button>
                          ) : (
                            <button
                              onClick={() => handleConnect(dev.id as WatchDeviceType)}
                              disabled={watchState.isPairing}
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#1E4332] hover:bg-[#2A5E46] rounded-lg transition active:scale-95 disabled:opacity-50"
                            >
                              {watchState.isPairing ? 'Connessione...' : 'Associa'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Standalone Apple Watch Browser Link */}
                <div className="bg-white border border-[#CBDDD2] rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#122219]">App Web Standalone per Watch</span>
                    <Smartphone className="w-4 h-4 text-[#1E4332]" />
                  </div>
                  <p className="text-xs text-[#597568]">
                    Puoi aprire Luancer direttamente dal browser del tuo Apple Watch o salvarlo sul quadrante per allenarti in mobilità senza telefono.
                  </p>
                  <button
                    onClick={handleCopyStandaloneLink}
                    className="w-full py-2 rounded-xl bg-[#E5F2EC] hover:bg-[#D4E8DC] border border-[#BBD5C6] text-xs font-bold text-[#1E4332] transition flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCheck className="w-4 h-4 text-emerald-600" />
                        <span>{t.watchLinkCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{t.watchCopyLink}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-[#CBDDD2] flex items-center justify-between shrink-0">
            <span className="text-[11px] text-[#597568]">
              {t.watchSyncXP}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#1E4332] text-white text-xs font-bold hover:bg-[#2A5E46] transition active:scale-95"
            >
              {t.close}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
