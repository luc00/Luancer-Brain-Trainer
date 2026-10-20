export type CognitiveCategory = 
  | 'memory'
  | 'speed'
  | 'logic'
  | 'focus'
  | 'language'
  | 'character'
  | 'resilience';

export interface CognitiveScores {
  memory: number;      // 0 - 1000
  speed: number;       // 0 - 1000
  logic: number;       // 0 - 1000
  focus: number;       // 0 - 1000
  language: number;    // 0 - 1000
  character: number;   // 0 - 1000
}

export interface CharacterTraits {
  resilience: number;       // Resilienza allo stress / Antifragilità
  temperance: number;       // Autocontrollo / Disciplina degli impulsi
  wisdom: number;           // Lucidità e Discernimento decisionale
  courage: number;          // Coraggio e Assertività etica
  emotionalMastery: number; // Padronanza emotiva & Calma
  communication?: number;   // Ascolto attivo & Empatia
  selfEsteem?: number;      // Autostima incondizionata & Sicurezza
  mindset?: number;         // Modo di pensare, Mantra & Umiltà
  positivity?: number;      // Psicologia positiva & Altruismo
}

export type PillarCategory = 
  | 'mindset-awareness'   // Percezione realistica, Consapevolezza, Umiltà, Modo di pensare & Mantra, Conoscenza, Creatività
  | 'emotion-stress-sleep'// Gestione stress, Sonno, Sicurezza interiore, Autoregolazione
  | 'identity-confidence' // Confidenza, Autostima, Responsabilità, Motivazione
  | 'social-relationships';// Confini sani, Cura dei legami, Altruismo, Senso di appartenenza, Psicologia positiva

export interface PsychologyPillar {
  id: string;
  title: string;
  shortDefinition: string;
  category: PillarCategory;
  categoryLabel: string;
  iconName: string;
  badgeColor: string;
  themeColor: string;
  neuroscientificCore: string;
  practicalBenefit: string;
  exercise: {
    name: string;
    instructions: string;
    steps: {
      stepNumber: number;
      title: string;
      description: string;
      promptQuestion?: string;
      interactiveType: 'selection' | 'slider' | 'reflection' | 'scenario' | 'action-commit' | 'timer-breath' | 'association';
      options?: { id: string; label: string; explanation: string; score: number }[];
      placeholder?: string;
      suggestedItems?: string[];
      minSlider?: number;
      maxSlider?: number;
      sliderLabel?: string;
    }[];
    practicalCommitment: string;
    mantraOrTakeaway: string;
  };
  keyTakeaways: string[];
}

export interface GameSessionResult {
  id: string;
  gameId: string;
  gameTitle: string;
  category: CognitiveCategory;
  score: number;
  accuracy: number; // percentage 0-100
  averageReactionTimeMs: number;
  difficultyLevel: number;
  timestamp: number;
  gciDelta: number;
  xpEarned: number;
}

export interface RealLifeChallenge {
  id: string;
  title: string;
  category: 'altruism' | 'stress_relief' | 'discipline' | 'courage' | 'mindfulness' | 'communication';
  description: string;
  actionGuide: string;
  difficulty: 'Facile' | 'Medio' | 'Sfidante';
  xpReward: number;
  neuroBenefit?: string;
  traitBonus?: Partial<CharacterTraits>;
  reflectionPrompt?: string;
  completed?: boolean;
  completedAt?: string;
  userNote?: string;
}

export interface MentalModelLesson {
  id: string;
  name: string;
  category: 'Decisioni' | 'Ragionamento' | 'Produttività' | 'Psicologia';
  summary: string;
  deepDive: string;
  realWorldExample: string;
  quiz: {
    scenario: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CommunicationScenario {
  id: string;
  title: string;
  context: string;
  trigger: string;
  options: {
    id: string;
    text: string;
    style: 'Reattivo / Aggressivo' | 'Passivo / Evitante' | 'Assertivo & Empatico';
    score: number;
    feedback: string;
    psychologicalInsight: string;
  }[];
}

export interface StoicJournalEntry {
  id: string;
  date: string;
  triumph: string;      // Cosa ho gestito con virtù/disciplina oggi?
  slip: string;         // Dove sono stato impulsivo o distratto?
  gratitude: string;    // Per cosa provo sincera gratitudine?
  tomorrowFocus: string;// Quale intenzione guiderà il mio domani?
  timestamp: number;
}

export interface TraitSnapshot {
  date: string;
  timestamp: number;
  traits: CharacterTraits;
  label?: string;
}

export interface MLReceptivityWindow {
  hour: number;
  probability: number; // 0 to 100
  label: string;
  circadianPhase: 'cortisol_boost' | 'peak_focus' | 'post_lunch_dip' | 'dopamine_recovery' | 'stoic_winddown' | 'rest';
  recommendedMicroType: 'stroop_blitz' | 'memory_matrix' | 'speed_math' | 'vagal_sigh' | 'altruism_kindness' | 'stoic_pause';
  reasoning: string;
  intensity: 'light' | 'moderate' | 'high';
  isHistoricalPeak?: boolean;
}

export interface MicroWorkoutPlan {
  id: string;
  title: string;
  type: 'cognitive' | 'character' | 'vagal_reset';
  targetSkill: string;
  durationSeconds: number;
  description: string;
  actionGuide: string;
  xpReward: number;
  neuroBenefit: string;
  category: 'speed' | 'focus' | 'memory' | 'logic' | 'character' | 'resilience';
  traitBonus?: Partial<CharacterTraits>;
}

export interface ReminderMLSettings {
  notificationsEnabled: boolean;
  autoSmartScheduling: boolean;
  dailyFrequency: 1 | 2 | 3 | 4;
  quietHoursStart: number; // e.g. 22
  quietHoursEnd: number;   // e.g. 7
  userChronotype: 'morning_lark' | 'intermediate' | 'night_owl' | 'auto_detected';
  lastNotifiedTimestamp?: number;
  completedMicroWorkoutsCount: number;
}

export interface UserProfile {
  name: string;
  title: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  gci: number; // Global Cognitive Index (200 - 1000)
  brainAge: number;
  streak: number;
  lastTrainedDate: string;
  scores: CognitiveScores;
  characterTraits: CharacterTraits;
  completedWorkoutsCount: number;
  sessionsHistory: GameSessionResult[];
  unlockedBadges: string[];
  journalEntries?: StoicJournalEntry[];
  completedChallenges?: string[];
  completedPillarExercises?: string[];
  savedMantra?: string;
  sleepHygieneScore?: number;
  traitsHistory?: TraitSnapshot[];
  reminderSettings?: ReminderMLSettings;
}

export interface CharacterDilemmaOption {
  id: string;
  text: string;
  traitScore: {
    resilience: number;
    temperance: number;
    courage: number;
    wisdom: number;
  };
  virtue: string;
  feedback: string;
}

export interface CharacterDilemma {
  id: string;
  title: string;
  context: string;
  virtueFocus: string;
  options: CharacterDilemmaOption[];
}

export interface CognitiveReframing {
  distortion: string;
  stoicLens: string;
  reframedPerspective: string;
  actionStep: string;
}

export interface AIPuzzle {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
  difficulty: number;
}

export interface NeuroDiagnosticReport {
  archetype: string;
  summary: string;
  topCognitivePower: string;
  growthOpportunity: string;
  characterTrait: string;
  brainAgeEstimate: number;
  dailyPrescription: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type BinauralFrequency = 'off' | 'alpha' | 'theta' | 'gamma';

export type ActiveTab = 'workout' | 'games' | 'character' | 'coach' | 'analytics';

