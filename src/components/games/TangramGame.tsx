import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, RotateCw, Trophy, Sparkles, Check } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface TangramPiece {
  id: string;
  name: string;
  color: string;
  rotation: number; // 0, 45, 90, 135, 180, 225, 270, 315
  targetRot: number;
  shape: 'large-tri-1' | 'large-tri-2' | 'med-tri' | 'small-tri-1' | 'small-tri-2' | 'square' | 'parallelogram';
}

const INITIAL_PIECES: TangramPiece[] = [
  { id: 'p1', name: 'Triangolo Grande 1', color: 'bg-[#52D195]', rotation: 45, targetRot: 0, shape: 'large-tri-1' },
  { id: 'p2', name: 'Triangolo Grande 2', color: 'bg-[#2E7652]', rotation: 90, targetRot: 180, shape: 'large-tri-2' },
  { id: 'p3', name: 'Triangolo Medio', color: 'bg-[#D4A325]', rotation: 135, targetRot: 90, shape: 'med-tri' },
  { id: 'p4', name: 'Triangolo Piccolo 1', color: 'bg-[#2D6A8E]', rotation: 0, targetRot: 270, shape: 'small-tri-1' },
  { id: 'p5', name: 'Triangolo Piccolo 2', color: 'bg-[#8F4882]', rotation: 180, targetRot: 90, shape: 'small-tri-2' },
  { id: 'p6', name: 'Quadrato Centrale', color: 'bg-[#C84630]', rotation: 45, targetRot: 0, shape: 'square' },
  { id: 'p7', name: 'Parallelogramma', color: 'bg-[#E78B38]', rotation: 90, targetRot: 0, shape: 'parallelogram' },
];

export const TangramGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [pieces, setPieces] = useState<TangramPiece[]>(INITIAL_PIECES);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);

  const rotateSelectedPiece = (dir: 'cw' | 'ccw') => {
    if (!selectedPieceId || isWon) return;
    soundFx.playClick();

    const updated = pieces.map(p => {
      if (p.id === selectedPieceId) {
        const delta = dir === 'cw' ? 45 : -45;
        const newRot = (p.rotation + delta + 360) % 360;
        return { ...p, rotation: newRot };
      }
      return p;
    });

    setPieces(updated);

    // Check match with target angles
    const allAligned = updated.every(p => p.rotation % 180 === p.targetRot % 180);
    if (allAligned) {
      soundFx.playLevelUp();
      setIsWon(true);
      onComplete({
        gameId: 'tangram-geometry',
        gameTitle: 'Tangram Geometria Spaziale',
        category: 'logic',
        score: 900,
        accuracy: 100,
        averageReactionTimeMs: 2200,
        difficultyLevel: 2,
      });
    }
  };

  const resetTangram = () => {
    soundFx.playClick();
    setPieces(INITIAL_PIECES);
    setSelectedPieceId(null);
    setIsWon(false);
  };

  return (
    <div id="tangram-game-view" className="space-y-4 max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Spaziale
        </button>

        <button
          onClick={resetTangram}
          className="p-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Target Silhouette Card */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#CBDDD2] shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#557163] block">Figura Bersaglio</span>
          <h4 className="text-sm font-black text-[#122219]">Il Cigno in Volo</h4>
        </div>
        <div className="text-xs font-mono font-bold text-[#2E7652] bg-[#E5F2EC] px-3 py-1 rounded-full">
          7 Tasselli
        </div>
      </div>

      {/* Tangram Play Arena */}
      <div className="bg-[#122219] p-4 rounded-3xl shadow-xl min-h-[300px] flex items-center justify-center relative overflow-hidden">
        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
          {pieces.map(piece => {
            const isSelected = selectedPieceId === piece.id;
            return (
              <button
                key={piece.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedPieceId(piece.id);
                }}
                className={`h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                  piece.color
                } ${isSelected ? 'ring-4 ring-white scale-105 shadow-xl' : 'hover:scale-98 opacity-90'}`}
                style={{ transform: `rotate(${piece.rotation}deg)` }}
              >
                <span className="text-[10px] font-black text-white drop-shadow-md">
                  {piece.name.split(' ')[0]}
                </span>
                <span className="text-[8px] font-mono text-white/80">{piece.rotation}°</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => rotateSelectedPiece('ccw')}
          disabled={!selectedPieceId || isWon}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-[#CBDDD2] text-[#1E4332] font-bold text-xs hover:bg-[#E5F2EC] disabled:opacity-40 shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Ruota -45°
        </button>
        <button
          onClick={() => rotateSelectedPiece('cw')}
          disabled={!selectedPieceId || isWon}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1E4332] text-white font-bold text-xs hover:bg-[#2A5741] disabled:opacity-40 shadow-xs cursor-pointer"
        >
          <RotateCw className="w-4 h-4" /> Ruota +45°
        </button>
      </div>

      {/* Victory Modal */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
          >
            <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
            <h3 className="text-lg font-bold">Figura Tangram Armonizzata!</h3>
            <p className="text-xs text-[#BED8CA]">Tutti i 7 tasselli geometrici sono orientati correttamente.</p>
            <button
              onClick={resetTangram}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Riprova
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
