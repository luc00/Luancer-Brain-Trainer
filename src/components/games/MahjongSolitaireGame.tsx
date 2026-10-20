import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { GameSessionResult } from '../../types';
import { ArrowLeft, RotateCcw, Shuffle, Sparkles, Trophy, Check, HelpCircle } from 'lucide-react';

interface Props {
  onComplete: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
  onExit: () => void;
}

interface MahjongTile {
  id: string;
  symbol: string;
  type: string;
  layer: number; // 0, 1, 2
  row: number;
  col: number;
  matched: boolean;
}

const SYMBOLS = [
  { symbol: '🀄', name: 'Drago Rosso', type: 'dragon' },
  { symbol: '🀅', name: 'Drago Verde', type: 'dragon' },
  { symbol: '🀆', name: 'Drago Bianco', type: 'dragon' },
  { symbol: '🎋', name: 'Bamboo 1', type: 'bamboo' },
  { symbol: '🎍', name: 'Bamboo 2', type: 'bamboo' },
  { symbol: '🌸', name: 'Fiore Pruno', type: 'flower' },
  { symbol: '💮', name: 'Fiore Loto', type: 'flower' },
  { symbol: '☯️', name: 'Equilibrio', type: 'stoic' },
  { symbol: '🏛️', name: 'Virtù', type: 'stoic' },
  { symbol: '⚡', name: 'Lucidità', type: 'stoic' },
];

export const MahjongSolitaireGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [tiles, setTiles] = useState<MahjongTile[]>([]);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [pairsFound, setPairsFound] = useState<number>(0);
  const [history, setHistory] = useState<{ id1: string; id2: string }[]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);

  // Generate solvable symmetric/pyramid layout
  const initBoard = useCallback(() => {
    // We create pairs of tiles across 3 layers
    const generated: MahjongTile[] = [];
    const totalPairs = 12; // 24 tiles total
    const chosenSymbols: typeof SYMBOLS[0][] = [];

    for (let i = 0; i < totalPairs; i++) {
      const sym = SYMBOLS[i % SYMBOLS.length];
      chosenSymbols.push(sym, sym); // Push pairs
    }

    // Shuffle symbols
    const shuffled = [...chosenSymbols].sort(() => Math.random() - 0.5);

    // Layout slots:
    // Layer 0: 4x4 grid (16 tiles)
    // Layer 1: 2x3 grid (6 tiles)
    // Layer 2: 1x2 center (2 tiles)
    let idx = 0;

    // Layer 0
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (idx < shuffled.length) {
          generated.push({
            id: `tile-0-${r}-${c}`,
            symbol: shuffled[idx].symbol,
            type: shuffled[idx].name,
            layer: 0,
            row: r,
            col: c,
            matched: false,
          });
          idx++;
        }
      }
    }

    // Layer 1
    for (let r = 1; r <= 2; r++) {
      for (let c = 0; c < 3; c++) {
        if (idx < shuffled.length) {
          generated.push({
            id: `tile-1-${r}-${c}`,
            symbol: shuffled[idx].symbol,
            type: shuffled[idx].name,
            layer: 1,
            row: r + 0.5,
            col: c + 0.5,
            matched: false,
          });
          idx++;
        }
      }
    }

    // Layer 2
    for (let c = 1; c <= 2; c++) {
      if (idx < shuffled.length) {
        generated.push({
          id: `tile-2-1-${c}`,
          symbol: shuffled[idx].symbol,
          type: shuffled[idx].name,
          layer: 2,
          row: 1.5,
          col: c,
          matched: false,
        });
        idx++;
      }
    }

    setTiles(generated);
    setSelectedTileId(null);
    setPairsFound(0);
    setHistory([]);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // Check if tile is free (no tile on top of it, and free left or right)
  const isTileFree = (tile: MahjongTile) => {
    if (tile.matched) return false;

    // Check if covered by higher layer tile
    const covered = tiles.some(
      t =>
        !t.matched &&
        t.layer > tile.layer &&
        Math.abs(t.row - tile.row) < 1 &&
        Math.abs(t.col - tile.col) < 1
    );
    if (covered) return false;

    // Check left and right blocker in same layer
    const blockedLeft = tiles.some(
      t =>
        !t.matched &&
        t.layer === tile.layer &&
        Math.abs(t.row - tile.row) < 0.5 &&
        t.col === tile.col - 1
    );
    const blockedRight = tiles.some(
      t =>
        !t.matched &&
        t.layer === tile.layer &&
        Math.abs(t.row - tile.row) < 0.5 &&
        t.col === tile.col + 1
    );

    return !(blockedLeft && blockedRight);
  };

  const handleTileClick = (tile: MahjongTile) => {
    if (!isTileFree(tile) || isWon) return;

    soundFx.playClick();

    if (!selectedTileId) {
      setSelectedTileId(tile.id);
      return;
    }

    if (selectedTileId === tile.id) {
      setSelectedTileId(null);
      return;
    }

    const firstTile = tiles.find(t => t.id === selectedTileId);
    if (!firstTile) return;

    if (firstTile.symbol === tile.symbol) {
      // Match found!
      soundFx.playSuccess();
      const updatedTiles = tiles.map(t =>
        t.id === firstTile.id || t.id === tile.id ? { ...t, matched: true } : t
      );
      setTiles(updatedTiles);
      setPairsFound(p => p + 1);
      setHistory(prev => [...prev, { id1: firstTile.id, id2: tile.id }]);
      setSelectedTileId(null);

      // Check win
      if (updatedTiles.every(t => t.matched)) {
        soundFx.playLevelUp();
        setIsWon(true);
        onComplete({
          gameId: 'mahjong-solitaire',
          gameTitle: 'Solitario Mahjong Zen',
          category: 'focus',
          score: 950,
          accuracy: 100,
          averageReactionTimeMs: 1400,
          difficultyLevel: 2,
        });
      }
    } else {
      soundFx.playError();
      setSelectedTileId(tile.id);
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || isWon) return;
    soundFx.playClick();
    const last = history[history.length - 1];
    setTiles(tiles.map(t => (t.id === last.id1 || t.id === last.id2 ? { ...t, matched: false } : t)));
    setPairsFound(p => Math.max(0, p - 1));
    setHistory(history.slice(0, -1));
    setSelectedTileId(null);
  };

  return (
    <div id="mahjong-game-view" className="space-y-4 max-w-lg mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#CBDDD2] rounded-3xl p-3.5 shadow-xs">
        <button
          onClick={() => {
            soundFx.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1E4332] hover:text-[#122219] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Reparto Memoria & Focus
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#CBDDD2] text-xs font-bold text-[#1E4332] disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Annulla
          </button>
          <button
            onClick={initBoard}
            className="p-1.5 rounded-xl bg-white border border-[#CBDDD2] hover:border-[#52826A] text-[#1E4332] cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Info */}
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="text-[#557163]">Coppie Abbinate: <strong className="text-[#122219] font-mono">{pairsFound} / 12</strong></span>
        <span className="text-[#2E7652] font-semibold">Tessere Libere evidenziate</span>
      </div>

      {/* 3D Layered Mahjong Board */}
      <div className="relative bg-[#163325] p-6 rounded-3xl border border-[#3E6C55] shadow-xl min-h-[360px] flex items-center justify-center overflow-hidden">
        <div className="relative w-[300px] h-[300px]">
          {tiles.map(tile => {
            if (tile.matched) return null;
            const isSelected = selectedTileId === tile.id;
            const free = isTileFree(tile);

            const leftPx = tile.col * 65 + tile.layer * 6;
            const topPx = tile.row * 65 - tile.layer * 6;

            return (
              <motion.button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                style={{
                  position: 'absolute',
                  left: `${leftPx}px`,
                  top: `${topPx}px`,
                  zIndex: tile.layer * 10 + Math.floor(tile.row),
                }}
                className={`w-14 h-16 rounded-xl font-bold flex flex-col items-center justify-center select-none transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#52D195] text-[#122219] -translate-y-2 shadow-2xl border-2 border-white scale-105'
                    : free
                    ? 'bg-gradient-to-b from-[#FFFDF9] to-[#EFE7D8] text-[#122219] border-2 border-[#D8C9B0] shadow-md hover:-translate-y-1'
                    : 'bg-[#C2B7A3] text-[#554C3D] opacity-60 border border-[#9E9482] shadow-xs cursor-not-allowed'
                }`}
              >
                <span className="text-2xl drop-shadow-xs">{tile.symbol}</span>
                <span className="text-[8px] font-mono text-[#557163] mt-0.5 leading-none">{tile.type.split(' ')[0]}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Victory Banner */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-3xl bg-[#163325] text-white border border-[#3E6C55] text-center space-y-3 shadow-xl"
          >
            <Trophy className="w-10 h-10 text-[#52D195] mx-auto" />
            <h3 className="text-lg font-bold">Tavolo Mahjong Completato!</h3>
            <p className="text-xs text-[#BED8CA]">Tutte le 12 coppie sono state armonizzate con successo.</p>
            <button
              onClick={initBoard}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#163325] text-xs font-bold hover:bg-[#E5F2EC] cursor-pointer"
            >
              Nuovo Schema
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
