import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../../utils/audio';
import { UserProfile, GameSessionResult, CognitiveCategory } from '../../types';
import {
  Brain,
  Zap,
  Grid3X3,
  Calculator,
  Target,
  Sparkles,
  Play,
  Award,
  ChevronRight,
  Search,
  Filter,
  Layers,
  Box,
  Compass,
  Lock,
  Globe,
  Feather,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

import { DualNBackGame } from './DualNBackGame';
import { StroopGame } from './StroopGame';
import { MatrixMemoryGame } from './MatrixMemoryGame';
import { SpeedMathLogicGame } from './SpeedMathLogicGame';
import { FlankerFocusGame } from './FlankerFocusGame';
import { AIPuzzleGame } from './AIPuzzleGame';
import { SudokuAIGame } from './SudokuAIGame';
import { Game2048 } from './Game2048';
import { BloxorzGame } from './BloxorzGame';
import { WordleGame } from './WordleGame';
import { WordWipeGame } from './WordWipeGame';
import { GoogleFeudGame } from './GoogleFeudGame';
import { HangmanGame } from './HangmanGame';
import { MemoColorGame } from './MemoColorGame';
import { MahjongSolitaireGame } from './MahjongSolitaireGame';
import { MinesweeperGame } from './MinesweeperGame';
import { KakuroGame } from './KakuroGame';
import { TowerOfHanoiGame } from './TowerOfHanoiGame';
import { NonogramGame } from './NonogramGame';
import { TangramGame } from './TangramGame';
import { UnblockMeGame } from './UnblockMeGame';
import { GeoGuessrGame } from './GeoGuessrGame';
import { MastermindGame } from './MastermindGame';
import { TrickyPuzzlesGame } from './TrickyPuzzlesGame';
import { EinsteinRiddleGame } from './EinsteinRiddleGame';
import { LaserRefractionGame } from './LaserRefractionGame';
import { HashiBridgesGame } from './HashiBridgesGame';
import { KlotskiGame } from './KlotskiGame';
import { WaterSortHardGame } from './WaterSortHardGame';
import { CryptarithmGame } from './CryptarithmGame';
import { LightsOutGame } from './LightsOutGame';
import { INNOVATIVE_GAMES_CATALOG, GameCatalogItem } from './AllGamesCatalogData';

interface Props {
  profile: UserProfile;
  onRecordSession: (result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>) => void;
}

export type ActiveGame =
  | 'none'
  | 'einstein-riddle'
  | 'laser-optics'
  | 'hashi-bridges'
  | 'klotski-huarong'
  | 'water-sort-hard'
  | 'cryptarithm-math'
  | 'lights-out-matrix'
  | 'sudoku-ai'
  | 'game-2048'
  | 'bloxorz-3d'
  | 'wordle-italian'
  | 'wordwipe-grid'
  | 'google-feud'
  | 'hangman-philosophy'
  | 'memocolor'
  | 'mahjong-solitaire'
  | 'minesweeper-logic'
  | 'kakuro-math'
  | 'tower-of-hanoi'
  | 'nonogram-picross'
  | 'tangram-geometry'
  | 'unblock-me'
  | 'geoguessr-mind'
  | 'mastermind-code'
  | 'tricky-puzzles'
  | 'dual-n-back'
  | 'stroop'
  | 'matrix'
  | 'math'
  | 'flanker'
  | 'ai-puzzle';

export const BrainGamesHub: React.FC<Props> = ({ profile, onRecordSession }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');
  const [selectedDepartment, setSelectedDepartment] = useState<'all' | CognitiveCategory | 'catalog'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'grandmaster' | 'advanced' | 'standard'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const playableGames = [
    // Top-Tier Grandmaster & Extreme Difficulty Games
    {
      id: 'einstein-riddle' as ActiveGame,
      title: 'L\'Enigma delle 5 Case di Einstein',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Deduzione Pura a Vincoli',
      desc: 'Il leggendario enigma delle 5 case con 15 vincoli incrociati e deduzione senza ipotesi a caso.',
      icon: Sparkles,
      badgeColor: 'bg-[#7F3847] text-white',
      score: profile.scores.logic,
      difficultyTier: 'grandmaster' as const,
      difficultyLabel: 'Grandmaster',
      flames: 5,
    },
    {
      id: 'laser-optics' as ActiveGame,
      title: 'Quantum Laser Labyrinth',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Fisica Ottica & Vettori',
      desc: 'Rifrazione ottica 2D con specchi a 45°, sdoppiatori e prismi su matrici fino a 8x8.',
      icon: Zap,
      badgeColor: 'bg-[#0F172A] text-[#38BDF8] border border-[#38BDF8]/40',
      score: profile.scores.logic,
      difficultyTier: 'grandmaster' as const,
      difficultyLabel: 'Grandmaster',
      flames: 5,
    },
    {
      id: 'hashi-bridges' as ActiveGame,
      title: 'Hashiwokakero (Ponti di Hashi)',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Topologia & Teoria dei Grafi',
      desc: 'Collega tutte le isole con ponti singoli e doppi formando una rete continua e unificata.',
      icon: Layers,
      badgeColor: 'bg-[#7F3847] text-white',
      score: profile.scores.logic,
      difficultyTier: 'grandmaster' as const,
      difficultyLabel: 'Grandmaster',
      flames: 5,
    },
    {
      id: 'klotski-huarong' as ActiveGame,
      title: 'Klotski: Fuga del Re Huarong Dao',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Pianificazione Spaziale',
      desc: 'Guida il blocco 2x2 verso l\'apertura in minimo 81 mosse attraverso uno spazio con solo 2 celle libere.',
      icon: Box,
      badgeColor: 'bg-[#7F3847] text-white',
      score: profile.scores.logic,
      difficultyTier: 'grandmaster' as const,
      difficultyLabel: 'Grandmaster',
      flames: 5,
    },
    {
      id: 'water-sort-hard' as ActiveGame,
      title: 'Smistamento Chimico & Strati Oscurati',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Processi Algoritmici',
      desc: 'Fino a 9 provette e 5 livelli con strati incogniti da purificare senza bloccare i flussi chimici.',
      icon: Layers,
      badgeColor: 'bg-[#8C5D19] text-white',
      score: profile.scores.logic,
      difficultyTier: 'grandmaster' as const,
      difficultyLabel: 'Estremo',
      flames: 4,
    },
    {
      id: 'cryptarithm-math' as ActiveGame,
      title: 'Criptoaritmetica Neurale & Equazioni',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Aritmetica Simbolica',
      desc: 'Mappa ogni lettera a una cifra unica (0-9) per verificare equazioni complesse (SEND+MORE=MONEY).',
      icon: Calculator,
      badgeColor: 'bg-[#2C4960] text-white',
      score: profile.scores.logic,
      difficultyTier: 'grandmaster' as const,
      difficultyLabel: 'Estremo',
      flames: 4,
    },
    {
      id: 'lights-out-matrix' as ActiveGame,
      title: 'Lights Out: Matrice a Parità Inversa GF(2)',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Algebra Lineare & Parità',
      desc: 'Spegni tutti i nodi quantistici gestendo le inversioni incrociate e le matrici a 3 fasi energetiche.',
      icon: Zap,
      badgeColor: 'bg-[#0F172A] text-[#38BDF8] border border-[#38BDF8]/40',
      score: profile.scores.logic,
      difficultyTier: 'grandmaster' as const,
      difficultyLabel: 'Estremo',
      flames: 4,
    },
    // Standard & Intermediate Games
    {
      id: 'sudoku-ai' as ActiveGame,
      title: 'Sudoku Neurale con AI',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Logica & Deduzione',
      desc: 'Generazione continua di griglie con calcolo automatico dei conflitti e suggerimenti logici.',
      icon: Grid3X3,
      badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
      score: profile.scores.logic,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
    {
      id: 'game-2048' as ActiveGame,
      title: '2048 Matrice di Potenze',
      category: 'speed' as CognitiveCategory,
      categoryLabel: 'Strategia & Pianificazione',
      desc: 'Combina i tasselli numerici prevedendo le traiettorie su griglia 4x4.',
      icon: Zap,
      badgeColor: 'bg-[#FBF2E3] text-[#8C5D19]',
      score: profile.scores.speed,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'bloxorz-3d' as ActiveGame,
      title: 'Bloxorz 3D Spaziale',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Rotazione 3D',
      desc: 'Fai rotolare il prisma rettangolare sul piano sospeso senza farlo cadere.',
      icon: Box,
      badgeColor: 'bg-[#E8F0F7] text-[#2C4960]',
      score: profile.scores.logic,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
    {
      id: 'wordle-italian' as ActiveGame,
      title: 'Wordle Filosofico',
      category: 'language' as CognitiveCategory,
      categoryLabel: 'Linguistica & Vocabolario',
      desc: 'Indovina il lemma segreto di 5 lettere in 6 tentativi con suggerimenti semantici.',
      icon: Sparkles,
      badgeColor: 'bg-[#F2EEF8] text-[#4D3B6A]',
      score: profile.scores.language,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'wordwipe-grid' as ActiveGame,
      title: 'WordWipe Matrice',
      category: 'language' as CognitiveCategory,
      categoryLabel: 'Velocità Lessicale',
      desc: 'Traccia percorsi continui di lettere per pulire la matrice e far collassare le colonne.',
      icon: Layers,
      badgeColor: 'bg-[#F2EEF8] text-[#4D3B6A]',
      score: profile.scores.language,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
    {
      id: 'google-feud' as ActiveGame,
      title: 'Google Feud Psicologia',
      category: 'language' as CognitiveCategory,
      categoryLabel: 'Psicologia Collettiva',
      desc: 'Indovina le ricerche web più frequenti deducendo il comportamento della massa.',
      icon: Search,
      badgeColor: 'bg-[#FBF2E3] text-[#8C5D19]',
      score: profile.scores.language,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'hangman-philosophy' as ActiveGame,
      title: 'L\'Impiccato Filosofico',
      category: 'language' as CognitiveCategory,
      categoryLabel: 'Cultura & Stoicismo',
      desc: 'Decifra concetti stoici e neuroscientifici minimizzando gli errori di deduzione.',
      icon: Compass,
      badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
      score: profile.scores.language,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Base',
      flames: 1,
    },
    {
      id: 'memocolor' as ActiveGame,
      title: 'MemoColor Sequencer',
      category: 'memory' as CognitiveCategory,
      categoryLabel: 'Memoria di Lavoro',
      desc: 'Ripeti sequenze luminose e frequenze audio crescenti senza esitazioni.',
      icon: Brain,
      badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
      score: profile.scores.memory,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'mahjong-solitaire' as ActiveGame,
      title: 'Solitario Mahjong Zen',
      category: 'focus' as CognitiveCategory,
      categoryLabel: 'Focus & Scansione Visiva',
      desc: 'Abbina coppie di tessere libere su molteplici strati tridimensionali.',
      icon: Feather,
      badgeColor: 'bg-[#FBECEF] text-[#7F3847]',
      score: profile.scores.focus,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'minesweeper-logic' as ActiveGame,
      title: 'Campo Minato Neurale',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Logica Probabilistica',
      desc: 'Bonifica il campo attraverso la deduzione numerica e il piazzamento strategico delle bandiere.',
      icon: Target,
      badgeColor: 'bg-[#E8F0F7] text-[#2C4960]',
      score: profile.scores.logic,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
    {
      id: 'kakuro-math' as ActiveGame,
      title: 'Kakuro Somme Incrociate',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Aritmetica & Logica',
      desc: 'Risolvi il cruciverba matematico con somme uniche per ogni riga e colonna.',
      icon: Calculator,
      badgeColor: 'bg-[#E8F0F7] text-[#2C4960]',
      score: profile.scores.logic,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
    {
      id: 'tower-of-hanoi' as ActiveGame,
      title: 'Torre di Hanoi Ricorsiva',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Algoritmi Ricorsivi',
      desc: 'Trasferisci tutti i dischi rispettando l\'ordine gerarchico nel minor numero di mosse.',
      icon: Layers,
      badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
      score: profile.scores.logic,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'nonogram-picross' as ActiveGame,
      title: 'Nonogram Pixel Logic',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Logica Visiva',
      desc: 'Svela figure e simboli nascosti decodificando gli indizi numerici su righe e colonne.',
      icon: Grid3X3,
      badgeColor: 'bg-[#E8F0F7] text-[#2C4960]',
      score: profile.scores.logic,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
    {
      id: 'tangram-geometry' as ActiveGame,
      title: 'Tangram Geometria Spaziale',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Sintesi Geometrica',
      desc: 'Ruota e disponi i 7 poligoni per completare le sagome geometriche bersaglio.',
      icon: ShapesIcon,
      badgeColor: 'bg-[#FBF2E3] text-[#8C5D19]',
      score: profile.scores.logic,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'unblock-me' as ActiveGame,
      title: 'Unblock Me Logica',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Ottimizzazione Spaziale',
      desc: 'Fai scivolare i blocchi di legno per aprire una via di fuga al blocco rosso.',
      icon: Box,
      badgeColor: 'bg-[#FBF2E3] text-[#8C5D19]',
      score: profile.scores.logic,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'geoguessr-mind' as ActiveGame,
      title: 'GeoGuessr & Cultura',
      category: 'language' as CognitiveCategory,
      categoryLabel: 'Geografia & Deductio',
      desc: 'Identifica meraviglie del mondo e civiltà analizzando indizi progressivi.',
      icon: Globe,
      badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
      score: profile.scores.language,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'mastermind-code' as ActiveGame,
      title: 'Mastermind Decifra Codice',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Crittografia & Deduzione',
      desc: 'Indovina il codice cromatico segreto a 4 posizioni in 8 tentativi.',
      icon: Lock,
      badgeColor: 'bg-[#E8F0F7] text-[#2C4960]',
      score: profile.scores.logic,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
    {
      id: 'tricky-puzzles' as ActiveGame,
      title: 'Enigmi Laterali & Tricky Puzzles',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Pensiero Laterale',
      desc: 'Supera le trappole mentali e i bias cognitivi con il pensiero di secondo ordine.',
      icon: Sparkles,
      badgeColor: 'bg-[#F2EEF8] text-[#4D3B6A]',
      score: profile.scores.logic,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
    {
      id: 'dual-n-back' as ActiveGame,
      title: 'Dual N-Back Neurale',
      category: 'memory' as CognitiveCategory,
      categoryLabel: 'Memoria di Lavoro',
      desc: 'Sincronizza posizione visiva e lettera audio. Standard neuroscientifico.',
      icon: Brain,
      badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
      score: profile.scores.memory,
      difficultyTier: 'grandmaster' as const,
      difficultyLabel: 'Estremo',
      flames: 4,
    },
    {
      id: 'stroop' as ActiveGame,
      title: 'Stroop Neuro-Cromatico',
      category: 'speed' as CognitiveCategory,
      categoryLabel: 'Velocità & Inibizione',
      desc: 'Inibizione dell\'impulso di lettura automatica e riflessi in millisecondi.',
      icon: Zap,
      badgeColor: 'bg-[#FBF2E3] text-[#8C5D19]',
      score: profile.scores.speed,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
    {
      id: 'matrix' as ActiveGame,
      title: 'Matrice Sequenziale',
      category: 'memory' as CognitiveCategory,
      categoryLabel: 'Memoria Visuo-Spaziale',
      desc: 'Memorizza pattern di nodi sinaptici in ordine diretto o inverso.',
      icon: Grid3X3,
      badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
      score: profile.scores.memory,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'math' as ActiveGame,
      title: 'Calcolo & Logica Fluida',
      category: 'logic' as CognitiveCategory,
      categoryLabel: 'Problem Solving',
      desc: 'Sequenze aritmetiche, equazioni e deduzione logica rapida.',
      icon: Calculator,
      badgeColor: 'bg-[#E8F0F7] text-[#2C4960]',
      score: profile.scores.logic,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
    {
      id: 'flanker' as ActiveGame,
      title: 'Filtro Inibitorio Flanker',
      category: 'focus' as CognitiveCategory,
      categoryLabel: 'Attenzione Selettiva',
      desc: 'Focalizzati sulla freccia bersaglio sopprimendo i distrattori conflittuali.',
      icon: Target,
      badgeColor: 'bg-[#FBECEF] text-[#7F3847]',
      score: profile.scores.focus,
      difficultyTier: 'standard' as const,
      difficultyLabel: 'Intermedio',
      flames: 2,
    },
    {
      id: 'ai-puzzle' as ActiveGame,
      title: 'Enigma Adattivo AI',
      category: 'language' as CognitiveCategory,
      categoryLabel: 'Linguaggio & Deduzione',
      desc: 'Enigmi generati in tempo reale dall\'IA neurale basati sul tuo livello.',
      icon: Sparkles,
      badgeColor: 'bg-[#F2EEF8] text-[#4D3B6A]',
      score: profile.scores.language,
      difficultyTier: 'advanced' as const,
      difficultyLabel: 'Avanzato',
      flames: 3,
    },
  ];

  // Component Router
  if (activeGame === 'einstein-riddle') {
    return (
      <EinsteinRiddleGame
        onComplete={(score, acc, cat) => {
          onRecordSession({
            gameTitle: 'Enigma di Einstein',
            category: cat,
            score,
            accuracy: acc,
            metrics: { logicLevel: 'Grandmaster' },
          });
          setActiveGame('none');
        }}
        onBack={() => setActiveGame('none')}
      />
    );
  }
  if (activeGame === 'laser-optics') {
    return (
      <LaserRefractionGame
        onComplete={(score, acc, cat) => {
          onRecordSession({
            gameTitle: 'Laser Quantum Labyrinth',
            category: cat,
            score,
            accuracy: acc,
            metrics: { opticsRank: 'Master' },
          });
          setActiveGame('none');
        }}
        onBack={() => setActiveGame('none')}
      />
    );
  }
  if (activeGame === 'hashi-bridges') {
    return (
      <HashiBridgesGame
        onComplete={(score, acc, cat) => {
          onRecordSession({
            gameTitle: 'Hashiwokakero',
            category: cat,
            score,
            accuracy: acc,
            metrics: { topology: 'Completed' },
          });
          setActiveGame('none');
        }}
        onBack={() => setActiveGame('none')}
      />
    );
  }
  if (activeGame === 'klotski-huarong') {
    return (
      <KlotskiGame
        onComplete={(score, acc, cat) => {
          onRecordSession({
            gameTitle: 'Klotski Huarong Dao',
            category: cat,
            score,
            accuracy: acc,
            metrics: { movesRank: 'Optimal' },
          });
          setActiveGame('none');
        }}
        onBack={() => setActiveGame('none')}
      />
    );
  }
  if (activeGame === 'water-sort-hard') {
    return (
      <WaterSortHardGame
        onComplete={(score, acc, cat) => {
          onRecordSession({
            gameTitle: 'Smistamento Chimico Hard',
            category: cat,
            score,
            accuracy: acc,
            metrics: { purity: '100%' },
          });
          setActiveGame('none');
        }}
        onBack={() => setActiveGame('none')}
      />
    );
  }
  if (activeGame === 'cryptarithm-math') {
    return (
      <CryptarithmGame
        onComplete={(score, acc, cat) => {
          onRecordSession({
            gameTitle: 'Criptoaritmetica Neurale',
            category: cat,
            score,
            accuracy: acc,
            metrics: { arithmetic: 'Verified' },
          });
          setActiveGame('none');
        }}
        onBack={() => setActiveGame('none')}
      />
    );
  }
  if (activeGame === 'lights-out-matrix') {
    return (
      <LightsOutGame
        onComplete={(score, acc, cat) => {
          onRecordSession({
            gameTitle: 'Lights Out Matrice',
            category: cat,
            score,
            accuracy: acc,
            metrics: { parity: 'Zeroed' },
          });
          setActiveGame('none');
        }}
        onBack={() => setActiveGame('none')}
      />
    );
  }
  if (activeGame === 'sudoku-ai') {
    return <SudokuAIGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'game-2048') {
    return <Game2048 onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'bloxorz-3d') {
    return <BloxorzGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'wordle-italian') {
    return <WordleGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'wordwipe-grid') {
    return <WordWipeGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'google-feud') {
    return <GoogleFeudGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'hangman-philosophy') {
    return <HangmanGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'memocolor') {
    return <MemoColorGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'mahjong-solitaire') {
    return <MahjongSolitaireGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'minesweeper-logic') {
    return <MinesweeperGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'kakuro-math') {
    return <KakuroGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'tower-of-hanoi') {
    return <TowerOfHanoiGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'nonogram-picross') {
    return <NonogramGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'tangram-geometry') {
    return <TangramGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'unblock-me') {
    return <UnblockMeGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'geoguessr-mind') {
    return <GeoGuessrGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'mastermind-code') {
    return <MastermindGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'tricky-puzzles') {
    return <TrickyPuzzlesGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'dual-n-back') {
    return <DualNBackGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'stroop') {
    return <StroopGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'matrix') {
    return <MatrixMemoryGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'math') {
    return <SpeedMathLogicGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'flanker') {
    return <FlankerFocusGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'ai-puzzle') {
    return <AIPuzzleGame onComplete={(r) => { onRecordSession(r); setActiveGame('none'); }} onExit={() => setActiveGame('none')} />;
  }

  // Filtered games
  const filteredPlayableGames = playableGames.filter((g) => {
    const matchesDept = selectedDepartment === 'all' || g.category === selectedDepartment;
    const matchesDifficulty =
      difficultyFilter === 'all' ||
      (difficultyFilter === 'grandmaster' && (g.difficultyTier === 'grandmaster' || g.flames >= 4)) ||
      (difficultyFilter === 'advanced' && g.difficultyTier === 'advanced') ||
      (difficultyFilter === 'standard' && g.difficultyTier === 'standard');

    const matchesSearch =
      searchQuery.trim() === '' ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesDifficulty && matchesSearch;
  });

  const filteredCatalog = INNOVATIVE_GAMES_CATALOG.filter((item) => {
    const matchesDept = selectedDepartment === 'all' || selectedDepartment === 'catalog' || item.category === selectedDepartment;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetSkill.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div id="brain-games-hub" className="space-y-4 pb-20">
      {/* Header with Title & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#122219]">Reparto Giochi & Sviluppo Neurale</h2>
          <p className="text-xs text-[#597568]">100+ discipline cognitive e giochi di logica per l'espansione personale</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#1B432E] bg-[#D8EADB] border border-[#B7D4C3] px-3 py-1 rounded-full shadow-xs">
            31 Giochi Giocabili Subito
          </span>
        </div>
      </div>

      {/* Search and Department Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A988B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca tra Einstein, Laser, Hashi, Klotski, Sudoku, 2048, Bloxorz, Wordle..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#CBDDD2] text-xs sm:text-sm text-[#122219] placeholder-[#7A988B] focus:outline-none focus:border-[#2E7652] shadow-2xs transition"
          />
        </div>

        {/* Department Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'Tutti i Reparti' },
            { id: 'logic', label: 'Logica & Deduzione' },
            { id: 'memory', label: 'Memoria' },
            { id: 'focus', label: 'Focus & Inibizione' },
            { id: 'language', label: 'Linguistica' },
            { id: 'speed', label: 'Velocità & Calcolo' },
            { id: 'catalog', label: 'Enciclopedia 100+ Giochi' },
          ].map((dept) => {
            const isSelected = selectedDepartment === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedDepartment(dept.id as any);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E4332] text-white shadow-xs'
                    : 'bg-white border border-[#CBDDD2] text-[#557163] hover:bg-[#F2F7F4]'
                }`}
              >
                {dept.label}
              </button>
            );
          })}
        </div>

        {/* Difficulty Tier Filter Bar */}
        {selectedDepartment !== 'catalog' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-0.5">
            <span className="text-[11px] font-bold text-[#7A988B] uppercase tracking-wider pl-1 mr-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#C93B2B]" /> Difficoltà:
            </span>
            {[
              { id: 'all', label: 'Tutti i Livelli' },
              { id: 'grandmaster', label: '🔥 Grandmaster & Estremi (I Più Difficili)' },
              { id: 'advanced', label: '⚡ Avanzato' },
              { id: 'standard', label: '🧠 Intermedio / Base' },
            ].map((diff) => {
              const isSelected = difficultyFilter === diff.id;
              return (
                <button
                  key={diff.id}
                  onClick={() => {
                    soundFx.playClick();
                    setDifficultyFilter(diff.id as any);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? diff.id === 'grandmaster'
                        ? 'bg-[#7F3847] text-white shadow-xs'
                        : 'bg-[#2E7652] text-white shadow-xs'
                      : 'bg-[#F2F7F4] border border-[#CBDDD2] text-[#557163] hover:bg-[#E5F2EC]'
                  }`}
                >
                  {diff.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mode 1: Standard Playable Grid */}
      {selectedDepartment !== 'catalog' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#557163] px-1">
            <span>Disponibili per l'allenamento ({filteredPlayableGames.length})</span>
            <span className="text-[#2E7652] font-semibold">Tocca per avviare</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPlayableGames.map((g) => {
              const Icon = g.icon;
              const isGrandmaster = g.difficultyTier === 'grandmaster';
              return (
                <motion.div
                  key={g.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveGame(g.id);
                  }}
                  className={`p-3.5 rounded-2xl bg-white border ${
                    isGrandmaster
                      ? 'border-[#C93B2B]/40 hover:border-[#C93B2B] bg-gradient-to-br from-white via-white to-[#FDF4F5]'
                      : 'border-[#CBDDD2] hover:border-[#4E8067]'
                  } shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${
                        isGrandmaster ? 'bg-[#FBECEF] border border-[#E8CE9E]' : 'bg-[#E5F2EC] border border-[#CBDDD2]'
                      } flex items-center justify-center text-[#1E4332] group-hover:scale-105 transition shadow-2xs`}>
                        <Icon className={`w-5 h-5 ${isGrandmaster ? 'text-[#7F3847]' : 'text-[#1E4332]'}`} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/* Difficulty Flame Badge */}
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isGrandmaster
                            ? 'bg-[#7F3847] text-white shadow-2xs'
                            : g.difficultyTier === 'advanced'
                            ? 'bg-[#E8F0F7] text-[#2C4960]'
                            : 'bg-[#F2F7F4] text-[#557163]'
                        }`}>
                          {Array.from({ length: g.flames || 2 }).map((_, fi) => (
                            <span key={fi}>🔥</span>
                          ))}
                          <span>{g.difficultyLabel || 'Normale'}</span>
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${g.badgeColor}`}>
                          {g.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-black text-[#122219] group-hover:text-[#204A35] transition flex items-center gap-1.5">
                      {g.title}
                      {isGrandmaster && (
                        <span className="text-[9px] bg-[#C93B2B] text-white px-1.5 py-0.2 rounded font-black tracking-wider">
                          HARD
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#597568] leading-snug mt-1 line-clamp-2">
                      {g.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#F0F5F2]">
                    <div className={`flex items-center gap-1 text-[11px] font-bold ${
                      isGrandmaster ? 'text-[#C93B2B]' : 'text-[#2E7652]'
                    }`}>
                      <Play className="w-3 h-3 fill-current" /> {isGrandmaster ? 'Sfida Estrema' : 'Gioca'}
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#7A988B] block uppercase">Punteggio GCI</span>
                      <span className="text-xs font-mono font-bold text-[#122219]">{g.score}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: 100+ Innovative Games Library Catalog */}
      {(selectedDepartment === 'catalog' || selectedDepartment === 'all') && (
        <div className="pt-4 border-t border-[#CBDDD2] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#122219] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#D4A325]" /> Enciclopedia di 100+ Giochi Innovativi
              </h3>
              <p className="text-xs text-[#597568]">Compendio completo per l'eccellenza e lo sviluppo personale</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#8C5D19] bg-[#FBF2E3] border border-[#E8CE9E] px-2.5 py-0.5 rounded-full">
              {filteredCatalog.length} Giochi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.isPlayableDirectly && item.gameIdKey) {
                    soundFx.playClick();
                    setActiveGame(item.gameIdKey as ActiveGame);
                  }
                }}
                className={`p-3.5 rounded-2xl bg-white border border-[#CBDDD2] shadow-2xs flex flex-col justify-between transition ${
                  item.isPlayableDirectly ? 'hover:border-[#2E7652] cursor-pointer hover:shadow-xs' : 'opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-[#557163] bg-[#F2F7F4] px-2 py-0.5 rounded-md border border-[#CBDDD2]">
                      {item.departmentName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.difficulty === 'Base'
                          ? 'bg-[#E5F2EC] text-[#1E4332]'
                          : item.difficulty === 'Intermedio'
                          ? 'bg-[#FBF2E3] text-[#8C5D19]'
                          : item.difficulty === 'Avanzato'
                          ? 'bg-[#E8F0F7] text-[#2C4960]'
                          : 'bg-[#FBECEF] text-[#7F3847]'
                      }`}
                    >
                      {item.difficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#122219]">{item.title}</h4>
                  <p className="text-xs text-[#557163] leading-relaxed mt-1">{item.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#F2F7F4] flex items-center justify-between text-[11px]">
                  <span className="text-[#2E7652] font-semibold">★ {item.targetSkill}</span>
                  {item.isPlayableDirectly ? (
                    <span className="text-xs font-bold text-[#1E4332] bg-[#E5F2EC] px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> Gioca
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#7A988B] font-mono">Protocollo Teorico</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon for Shapes
function ShapesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.3 10a.7.7 0 0 1-.626-.379L5.055 4.38A.7.7 0 0 1 5.68 3.4h5.64a.7.7 0 0 1 .625.98l-2.618 5.24A.7.7 0 0 1 8.3 10Z" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <circle cx="17.5" cy="17.5" r="3.5" />
      <path d="m3 20 4.5-9" />
    </svg>
  );
}
