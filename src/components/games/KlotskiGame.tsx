import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { CognitiveCategory } from '../../types';
import {
  ArrowLeft,
  RotateCcw,
  Undo2,
  Trophy,
  Flame,
  HelpCircle,
  Sparkles,
  Shield,
  Box,
  Crown
} from 'lucide-react';

interface Props {
  onComplete: (score: number, accuracy: number, category: CognitiveCategory) => void;
  onBack: () => void;
}

interface Piece {
  id: string;
  name: string;
  w: number; // width in cells
  h: number; // height in cells
  r: number; // row
  c: number; // col
  type: 'king' | 'vertical' | 'horizontal' | 'pawn';
  color: string;
}

// Classical Huarong Dao Setup (81 minimal steps)
const INITIAL_PIECES: Piece[] = [
  // 2x2 King / Cao Cao at top center
  { id: 'king', name: 'Sovrano 2x2', w: 2, h: 2, r: 0, c: 1, type: 'king', color: '#7F3847' },
  // Vertical 1x2 Generals
  { id: 'v1', name: 'Generale 1', w: 1, h: 2, r: 0, c: 0, type: 'vertical', color: '#1E4332' },
  { id: 'v2', name: 'Generale 2', w: 1, h: 2, r: 0, c: 3, type: 'vertical', color: '#1E4332' },
  { id: 'v3', name: 'Generale 3', w: 1, h: 2, r: 2, c: 0, type: 'vertical', color: '#1E4332' },
  { id: 'v4', name: 'Generale 4', w: 1, h: 2, r: 2, c: 3, type: 'vertical', color: '#1E4332' },
  // Horizontal 2x1 Block
  { id: 'h1', name: 'Barriera 2x1', w: 2, h: 1, r: 2, c: 1, type: 'horizontal', color: '#2C4960' },
  // 1x1 Pawns
  { id: 'p1', name: 'Pedina 1', w: 1, h: 1, r: 3, c: 1, type: 'pawn', color: '#8C5D19' },
  { id: 'p2', name: 'Pedina 2', w: 1, h: 1, r: 3, c: 2, type: 'pawn', color: '#8C5D19' },
  { id: 'p3', name: 'Pedina 3', w: 1, h: 1, r: 4, c: 0, type: 'pawn', color: '#8C5D19' },
  { id: 'p4', name: 'Pedina 4', w: 1, h: 1, r: 4, c: 3, type: 'pawn', color: '#8C5D19' },
];

export const KlotskiGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [history, setHistory] = useState<Piece[][]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  // Helper to build 4x5 occupancy map
  const getOccupancy = (currentPieces: Piece[]): (string | null)[][] => {
    const grid: (string | null)[][] = Array.from({ length: 5 }, () => Array(4).fill(null));
    currentPieces.forEach(p => {
      for (let dr = 0; dr < p.h; dr++) {
        for (let dc = 0; dc < p.w; dc++) {
          grid[p.r + dr][p.c + dc] = p.id;
        }
      }
    });
    return grid;
  };

  // Find valid move directions for a piece: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
  const getValidMoves = (piece: Piece, occupancy: (string | null)[][]): ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] => {
    const valid: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = [];

    // Check UP
    if (piece.r > 0) {
      let canUp = true;
      for (let c = 0; c < piece.w; c++) {
        if (occupancy[piece.r - 1][piece.c + c] !== null) canUp = false;
      }
      if (canUp) valid.push('UP');
    }

    // Check DOWN
    if (piece.r + piece.h < 5) {
      let canDown = true;
      for (let c = 0; c < piece.w; c++) {
        if (occupancy[piece.r + piece.h][piece.c + c] !== null) canDown = false;
      }
      if (canDown) valid.push('DOWN');
    }

    // Check LEFT
    if (piece.c > 0) {
      let canLeft = true;
      for (let r = 0; r < piece.h; r++) {
        if (occupancy[piece.r + r][piece.c - 1] !== null) canLeft = false;
      }
      if (canLeft) valid.push('LEFT');
    }

    // Check RIGHT
    if (piece.c + piece.w < 4) {
      let canRight = true;
      for (let r = 0; r < piece.h; r++) {
        if (occupancy[piece.r + r][piece.c + piece.w] !== null) canRight = false;
      }
      if (canRight) valid.push('RIGHT');
    }

    return valid;
  };

  const movePiece = (pieceId: string, dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    soundFx.playClick();
    setHistory(prev => [...prev, pieces.map(p => ({ ...p }))]);

    setPieces(prev => {
      const next = prev.map(p => {
        if (p.id === pieceId) {
          let nextR = p.r;
          let nextC = p.c;
          if (dir === 'UP') nextR--;
          if (dir === 'DOWN') nextR++;
          if (dir === 'LEFT') nextC--;
          if (dir === 'RIGHT') nextC++;
          return { ...p, r: nextR, c: nextC };
        }
        return p;
      });

      // Check win condition: King at row 3, col 1 (bottom center opening)
      const king = next.find(p => p.id === 'king')!;
      if (king.r === 3 && king.c === 1 && !isWon) {
        soundFx.playSuccess();
        setIsWon(true);
        onComplete(3500, 100, 'logic');
      }

      return next;
    });

    setMoves(m => m + 1);
  };

  const handlePieceClick = (piece: Piece) => {
    const occ = getOccupancy(pieces);
    const validMoves = getValidMoves(piece, occ);

    if (validMoves.length === 1) {
      movePiece(piece.id, validMoves[0]);
    } else if (validMoves.length > 1) {
      // If multiple moves available, prefer down or right
      movePiece(piece.id, validMoves[0]);
    } else {
      soundFx.playError();
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    soundFx.playToggle();
    const prevPieces = history[history.length - 1];
    setPieces(prevPieces);
    setHistory(h => h.slice(0, -1));
    setMoves(m => Math.max(0, m - 1));
  };

  const handleReset = () => {
    soundFx.playToggle();
    setPieces(INITIAL_PIECES);
    setHistory([]);
    setMoves(0);
    setElapsedSeconds(0);
    setIsWon(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const r = secs % 60;
    return `${mins}:${r < 10 ? '0' : ''}${r}`;
  };

  const occupancy = getOccupancy(pieces);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6 bg-[#FAF7F2] text-[#2C3E50] overflow-y-auto rounded-3xl border border-[#E8E2D9] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F2ECE4] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-[#5C6B73]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold font-serif text-[#1F2937] flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#7F3847]" /> Klotski (Fuga del Re Huarong)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7F3847] text-white flex items-center gap-1">
                <Flame className="w-3 h-3" /> Grandmaster
              </span>
            </div>
            <p className="text-xs text-[#7F8C8D]">
              Il leggendario puzzle di scorrimento: guida il blocco 2x2 verso l'apertura inferiore in minimo 81 mosse
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-[#7F8C8D]">Mosse • Tempo</span>
            <div className="text-sm font-mono font-bold text-[#1E4332]">
              {moves}m • {formatTime(elapsedSeconds)}
            </div>
          </div>
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F2ECE4] text-[#5C6B73] transition-colors disabled:opacity-40 shadow-sm"
            title="Annulla Mossa"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#F2ECE4] text-[#5C6B73] transition-colors shadow-sm"
            title="Resetta Scacchiera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Board & Guide */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-4 items-center">
        {/* Klotski Wooden Board (7 cols) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[340px] aspect-[4/5] bg-[#E8DCB8] p-3 rounded-2xl border-4 border-[#8C5D19] shadow-2xl overflow-hidden">
            {/* Grid 4x5 Guide Cells */}
            <div className="w-full h-full grid grid-cols-4 grid-rows-5 gap-1.5 relative">
              {Array.from({ length: 20 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-[#DFCFA5]/60 border border-[#CEBC8D]/80 shadow-inner"
                />
              ))}

              {/* Bottom Escape Opening Marker */}
              <div className="absolute -bottom-1 left-1/4 w-1/2 h-2 bg-[#7F3847] rounded-t-lg z-10 flex items-center justify-center">
                <span className="text-[7px] text-white font-bold tracking-widest uppercase">Uscita</span>
              </div>

              {/* Dynamic Sliding Pieces */}
              {pieces.map(piece => {
                const validMoves = getValidMoves(piece, occupancy);
                const isMovable = validMoves.length > 0;

                const leftPct = piece.c * 25;
                const topPct = piece.r * 20;
                const widthPct = piece.w * 25;
                const heightPct = piece.h * 20;

                return (
                  <motion.div
                    key={piece.id}
                    layout
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    onClick={() => handlePieceClick(piece)}
                    className={`absolute p-1 cursor-pointer select-none z-20`}
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                    }}
                  >
                    <div
                      className={`w-full h-full rounded-xl border-2 shadow-md flex flex-col items-center justify-center transition-all ${
                        piece.type === 'king'
                          ? 'bg-[#7F3847] border-[#5A2532] text-white ring-2 ring-[#7F3847]/40 font-bold'
                          : piece.type === 'vertical'
                          ? 'bg-[#1E4332] border-[#163225] text-white font-semibold'
                          : piece.type === 'horizontal'
                          ? 'bg-[#2C4960] border-[#1E3344] text-white font-semibold'
                          : 'bg-[#FBF2E3] border-[#8C5D19] text-[#8C5D19] font-bold'
                      } ${isMovable ? 'hover:brightness-110 active:scale-95' : 'opacity-90'}`}
                    >
                      {piece.type === 'king' && (
                        <>
                          <Crown className="w-6 h-6 mb-1 text-amber-300" />
                          <span className="text-xs font-serif tracking-wider">SOVRANO</span>
                        </>
                      )}
                      {piece.type === 'vertical' && (
                        <span className="text-[11px] font-mono uppercase tracking-widest rotate-90 sm:rotate-0">
                          {piece.name}
                        </span>
                      )}
                      {piece.type === 'horizontal' && (
                        <span className="text-[11px] font-mono tracking-wider">BARRIERA</span>
                      )}
                      {piece.type === 'pawn' && (
                        <span className="text-xs font-bold font-mono">●</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tactical Guidance (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1F2937]">
            <Shield className="w-5 h-5 text-[#8C5D19]" /> Tattica di Risoluzione
          </div>
          <p className="text-xs text-[#5C6B73] leading-relaxed">
            Klotski (noto in Cina come <em>Huarong Dao</em>) è uno dei più ardui problemi di pianificazione spaziale della storia:
          </p>

          <div className="space-y-2 text-xs text-[#4A5568]">
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]">
              <strong>Obiettivo:</strong> Sposta il <strong>Sovrano 2x2</strong> dalla cima fino all'apertura centrale in basso.
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]">
              <strong>Spazio Libero:</strong> Ci sono solo 2 celle vuote su 20. Ogni manovra richiede di liberare varchi ciclici con le 4 pedine e i 5 generali.
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]">
              <strong>Come muovere:</strong> Clicca semplicemente su un pezzo libero adiacente allo spazio vuoto per farlo scorrere.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FBF2E3] border border-[#E8DCB8] text-xs text-[#8C5D19]">
            🎯 <strong>Traguardo Grandmaster:</strong> Risolvi il puzzle in meno di 120 mosse!
          </div>
        </div>
      </div>

      {/* Win Modal */}
      {isWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl bg-[#E5F2EC] border-2 border-[#1E4332] text-[#1E4332] text-center shadow-xl"
        >
          <Trophy className="w-10 h-10 mx-auto mb-2" />
          <h3 className="text-lg font-bold">Il Sovrano è Fuggito con Successo!</h3>
          <p className="text-xs mb-3">
            Hai completato la configurazione leggendaria in <strong>{moves} mosse</strong> e <strong>{formatTime(elapsedSeconds)}</strong>.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-xl bg-[#1E4332] text-white font-bold text-xs hover:bg-[#163225] transition-all shadow-md"
          >
            Registra Risultato & Torna all'Hub
          </button>
        </motion.div>
      )}
    </div>
  );
};
