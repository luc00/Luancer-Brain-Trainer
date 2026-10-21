import { UserProfile, GameSessionResult, CognitiveCategory, CharacterTraits, ReminderMLSettings, MicroWorkoutPlan, UserTrainingPace } from '../types';

const STORAGE_KEY = 'synapse_ai_user_profile_v1';

export const DEFAULT_REMINDER_SETTINGS: ReminderMLSettings = {
  notificationsEnabled: true,
  autoSmartScheduling: true,
  dailyFrequency: 3,
  quietHoursStart: 22,
  quietHoursEnd: 7,
  userChronotype: 'auto_detected',
  completedMicroWorkoutsCount: 2,
};

const INITIAL_PROFILE: UserProfile = {
  name: 'Neuro-Explorer',
  title: 'Iniziato Sinaptico',
  level: 1,
  xp: 120,
  xpToNextLevel: 500,
  gci: 620, // Global Cognitive Index (200 - 1000)
  brainAge: 27,
  streak: 3,
  lastTrainedDate: new Date().toISOString().split('T')[0],
  scores: {
    memory: 640,
    speed: 610,
    logic: 630,
    focus: 590,
    language: 620,
    character: 680,
  },
  characterTraits: {
    resilience: 70,
    temperance: 65,
    wisdom: 72,
    courage: 68,
    emotionalMastery: 74,
  },
  completedWorkoutsCount: 4,
  sessionsHistory: [
    {
      id: 'init-1',
      gameId: 'dual-n-back',
      gameTitle: 'Quantum Dual N-Back',
      category: 'memory',
      score: 720,
      accuracy: 85,
      averageReactionTimeMs: 420,
      difficultyLevel: 2,
      timestamp: Date.now() - 86400000 * 2,
      gciDelta: +12,
      xpEarned: 150,
    },
    {
      id: 'init-2',
      gameId: 'stroop-clash',
      gameTitle: 'Stroop Neuro-Cromatico',
      category: 'speed',
      score: 680,
      accuracy: 92,
      averageReactionTimeMs: 310,
      difficultyLevel: 3,
      timestamp: Date.now() - 86400000,
      gciDelta: +15,
      xpEarned: 160,
    },
    {
      id: 'init-3',
      gameId: 'stoic-dilemma',
      gameTitle: 'Dilemma Stoico: Pressione del Team',
      category: 'character',
      score: 850,
      accuracy: 100,
      averageReactionTimeMs: 1200,
      difficultyLevel: 2,
      timestamp: Date.now() - 3600000 * 5,
      gciDelta: +18,
      xpEarned: 200,
    }
  ],
  unlockedBadges: ['first_synapse', 'stoic_mind', 'speed_demon'],
  traitsHistory: [
    {
      date: new Date(Date.now() - 86400000 * 28).toISOString().split('T')[0],
      timestamp: Date.now() - 86400000 * 28,
      label: 'Baseline Iniziale (30g fa)',
      traits: {
        resilience: 52,
        temperance: 48,
        wisdom: 56,
        courage: 50,
        emotionalMastery: 54,
        communication: 48,
        selfEsteem: 50,
        mindset: 55,
        positivity: 52,
      },
    },
    {
      date: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
      timestamp: Date.now() - 86400000 * 14,
      label: '2 Settimane fa',
      traits: {
        resilience: 60,
        temperance: 55,
        wisdom: 64,
        courage: 58,
        emotionalMastery: 63,
        communication: 57,
        selfEsteem: 59,
        mindset: 62,
        positivity: 60,
      },
    },
    {
      date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
      timestamp: Date.now() - 86400000 * 7,
      label: '7 Giorni fa',
      traits: {
        resilience: 65,
        temperance: 60,
        wisdom: 68,
        courage: 64,
        emotionalMastery: 70,
        communication: 64,
        selfEsteem: 66,
        mindset: 68,
        positivity: 67,
      },
    },
    {
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      label: 'Stato Attuale (Oggi)',
      traits: {
        resilience: 70,
        temperance: 65,
        wisdom: 72,
        courage: 68,
        emotionalMastery: 74,
        communication: 69,
        selfEsteem: 71,
        mindset: 73,
        positivity: 70,
      },
    },
  ],
  reminderSettings: DEFAULT_REMINDER_SETTINGS,
};

export const LEVEL_TITLES = [
  'Principiante Consapevole',    // Lvl 1
  'Praticante di Focus',         // Lvl 2
  'Costruttore di Abitudini',    // Lvl 3
  'Stratega della Mente',        // Lvl 4
  'Mente Resiliente',            // Lvl 5
  'Maestro dell\'Autocontrollo',  // Lvl 6
  'Pensatore Lucido',            // Lvl 7
  'Filosofo Pratico',            // Lvl 8
  'Saggio Antifragile',          // Lvl 9
  'Maestro della Crescita Umana',// Lvl 10+
];

export function updateReminderSettings(settings: Partial<ReminderMLSettings>): UserProfile {
  const profile = getProfile();
  const updatedSettings: ReminderMLSettings = {
    ...(profile.reminderSettings || DEFAULT_REMINDER_SETTINGS),
    ...settings,
  };
  const finalProfile: UserProfile = {
    ...profile,
    reminderSettings: updatedSettings,
  };
  saveProfile(finalProfile);
  return finalProfile;
}

export function recordMicroWorkoutCompletion(plan: MicroWorkoutPlan): UserProfile {
  const profile = getProfile();
  const currentSettings = profile.reminderSettings || DEFAULT_REMINDER_SETTINGS;
  const count = (currentSettings.completedMicroWorkoutsCount || 0) + 1;

  // Add micro-workout result to sessionsHistory for ML learning
  const newSession: GameSessionResult = {
    id: `micro-${Date.now()}`,
    gameId: plan.id,
    gameTitle: `Micro-Workout: ${plan.title}`,
    category: plan.category,
    score: 850,
    accuracy: 95,
    averageReactionTimeMs: 380,
    difficultyLevel: 2,
    timestamp: Date.now(),
    gciDelta: +5,
    xpEarned: plan.xpReward,
  };

  const traitsDelta = plan.traitBonus || { temperance: 3, resilience: 3, emotionalMastery: 3 };
  const updatedTraitsProfile = updateCharacterTraits(traitsDelta, plan.xpReward);

  const finalProfile: UserProfile = {
    ...updatedTraitsProfile,
    sessionsHistory: [newSession, ...updatedTraitsProfile.sessionsHistory.slice(0, 49)],
    reminderSettings: {
      ...currentSettings,
      completedMicroWorkoutsCount: count,
      lastNotifiedTimestamp: Date.now(),
    },
  };

  saveProfile(finalProfile);
  return finalProfile;
}

export function saveJournalEntry(entry: Omit<import('../types').StoicJournalEntry, 'id' | 'timestamp'>): UserProfile {
  const profile = getProfile();
  const newEntry: import('../types').StoicJournalEntry = {
    ...entry,
    id: `jrnl-${Date.now()}`,
    timestamp: Date.now(),
  };

  const existingEntries = profile.journalEntries || [];
  const updatedEntries = [newEntry, ...existingEntries.filter(e => e.date !== entry.date)];

  // Reward 150 XP for daily self-examination journal
  const updated = updateCharacterTraits({ wisdom: 3, temperance: 3, emotionalMastery: 2 }, 150);
  const finalProfile: UserProfile = {
    ...updated,
    journalEntries: updatedEntries,
  };
  saveProfile(finalProfile);
  return finalProfile;
}

export function toggleChallenge(
  challengeId: string, 
  xpReward: number, 
  traitBonus?: Partial<CharacterTraits>
): UserProfile {
  const profile = getProfile();
  const existing = profile.completedChallenges || [];
  const isCompleted = existing.includes(challengeId);

  let updatedList: string[];
  let xpDelta = 0;
  if (isCompleted) {
    updatedList = existing.filter(id => id !== challengeId);
  } else {
    updatedList = [...existing, challengeId];
    xpDelta = xpReward;
  }

  const traitsDelta = traitBonus || { courage: 3, temperance: 3, resilience: 2, positivity: 2 };

  const updated = xpDelta > 0 
    ? updateCharacterTraits(traitsDelta, xpDelta)
    : profile;

  const finalProfile: UserProfile = {
    ...updated,
    completedChallenges: updatedList,
  };
  saveProfile(finalProfile);
  return finalProfile;
}


export function recordPillarExerciseCompleted(pillarId: string, xpReward: number = 160): UserProfile {
  const profile = getProfile();
  const existing = profile.completedPillarExercises || [];
  const updatedList = existing.includes(pillarId) ? existing : [...existing, pillarId];

  const updated = updateCharacterTraits(
    { wisdom: 4, resilience: 3, emotionalMastery: 3, courage: 3 },
    xpReward
  );

  const finalProfile: UserProfile = {
    ...updated,
    completedPillarExercises: updatedList,
  };
  saveProfile(finalProfile);
  return finalProfile;
}

export function createZeroProfile(
  name: string,
  email: string = '',
  pace: UserTrainingPace = 'steady'
): UserProfile {
  const today = new Date().toISOString().split('T')[0];
  const zeroScores = {
    memory: 350,
    speed: 350,
    logic: 350,
    focus: 350,
    language: 350,
    character: 350,
  };
  const zeroTraits: CharacterTraits = {
    resilience: 30,
    temperance: 30,
    wisdom: 30,
    courage: 30,
    emotionalMastery: 30,
    communication: 30,
    selfEsteem: 30,
    mindset: 30,
    positivity: 30,
  };

  return {
    name: name.trim() || 'Nuovo Iniziato',
    email: email.toLowerCase().trim(),
    title: 'Principiante Consapevole (Grado 0)',
    level: 1,
    xp: 0,
    xpToNextLevel: 250,
    gci: 350,
    brainAge: 30,
    streak: 0,
    lastTrainedDate: '',
    scores: zeroScores,
    characterTraits: zeroTraits,
    completedWorkoutsCount: 0,
    sessionsHistory: [],
    unlockedBadges: [],
    journalEntries: [],
    completedChallenges: [],
    completedPillarExercises: [],
    traitsHistory: [
      {
        date: today,
        timestamp: Date.now(),
        label: 'Punto di Partenza (Grado 0)',
        traits: zeroTraits,
      },
    ],
    reminderSettings: {
      ...DEFAULT_REMINDER_SETTINGS,
      dailyFrequency: pace === 'gentle' ? 1 : pace === 'steady' ? 2 : 4,
      completedMicroWorkoutsCount: 0,
    },
    trainingPace: pace,
    isFreshStart: true,
    accountCreatedAt: Date.now(),
  };
}

export function setActiveProfile(profile: UserProfile): void {
  saveProfile(profile);
}

export function setUserPace(pace: UserTrainingPace): UserProfile {
  const profile = getProfile();
  const updated: UserProfile = {
    ...profile,
    trainingPace: pace,
    reminderSettings: {
      ...(profile.reminderSettings || DEFAULT_REMINDER_SETTINGS),
      dailyFrequency: pace === 'gentle' ? 1 : pace === 'steady' ? 2 : 4,
    },
  };
  saveProfile(updated);
  return updated;
}

export function getProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProfile(INITIAL_PROFILE);
      return INITIAL_PROFILE;
    }
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    
    // If it's a fresh zero-start account, preserve its zero-state completely
    if (parsed.isFreshStart) {
      const mergedZero: UserProfile = {
        name: parsed.name || 'Nuovo Iniziato',
        email: parsed.email || '',
        title: parsed.title || 'Principiante Consapevole (Grado 0)',
        level: parsed.level ?? 1,
        xp: parsed.xp ?? 0,
        xpToNextLevel: parsed.xpToNextLevel ?? 250,
        gci: parsed.gci ?? 350,
        brainAge: parsed.brainAge ?? 30,
        streak: parsed.streak ?? 0,
        lastTrainedDate: parsed.lastTrainedDate ?? '',
        scores: parsed.scores || {
          memory: 350,
          speed: 350,
          logic: 350,
          focus: 350,
          language: 350,
          character: 350,
        },
        characterTraits: parsed.characterTraits || {
          resilience: 30,
          temperance: 30,
          wisdom: 30,
          courage: 30,
          emotionalMastery: 30,
          communication: 30,
          selfEsteem: 30,
          mindset: 30,
          positivity: 30,
        },
        completedWorkoutsCount: parsed.completedWorkoutsCount ?? 0,
        sessionsHistory: Array.isArray(parsed.sessionsHistory) ? parsed.sessionsHistory : [],
        unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
        completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
        journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries : [],
        completedPillarExercises: Array.isArray(parsed.completedPillarExercises) ? parsed.completedPillarExercises : [],
        traitsHistory: Array.isArray(parsed.traitsHistory) ? parsed.traitsHistory : [],
        reminderSettings: {
          ...DEFAULT_REMINDER_SETTINGS,
          ...(parsed.reminderSettings || {}),
        },
        trainingPace: parsed.trainingPace || 'steady',
        isFreshStart: true,
        accountCreatedAt: parsed.accountCreatedAt,
        accountId: parsed.accountId,
        id: parsed.id,
      };
      return checkDailyStreak(mergedZero);
    }

    const merged: UserProfile = {
      ...INITIAL_PROFILE,
      ...parsed,
      characterTraits: {
        ...INITIAL_PROFILE.characterTraits,
        ...(parsed.characterTraits || {}),
      },
      scores: {
        ...INITIAL_PROFILE.scores,
        ...(parsed.scores || {}),
      },
      sessionsHistory: Array.isArray(parsed.sessionsHistory) ? parsed.sessionsHistory : INITIAL_PROFILE.sessionsHistory,
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : INITIAL_PROFILE.unlockedBadges,
      completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
      journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries : [],
      completedPillarExercises: Array.isArray(parsed.completedPillarExercises) ? parsed.completedPillarExercises : [],
      traitsHistory: Array.isArray(parsed.traitsHistory) && parsed.traitsHistory.length > 0 ? parsed.traitsHistory : INITIAL_PROFILE.traitsHistory,
      reminderSettings: {
        ...DEFAULT_REMINDER_SETTINGS,
        ...(parsed.reminderSettings || {}),
      },
      trainingPace: parsed.trainingPace || 'steady',
    };
    return checkDailyStreak(merged);
  } catch {
    return INITIAL_PROFILE;
  }
}

export const loadProfile = getProfile;

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage:', e);
  }
}

function checkDailyStreak(profile: UserProfile): UserProfile {
  // If the user has never trained yet or has 0 streak, don't invent a streak
  if (profile.streak === 0 || !profile.lastTrainedDate) {
    return profile;
  }

  const today = new Date().toISOString().split('T')[0];
  if (profile.lastTrainedDate === today) {
    return profile;
  }

  const lastDate = new Date(profile.lastTrainedDate);
  const currentDate = new Date(today);
  const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    // Consecutive day! (streak preserved until training or kept)
    return profile;
  } else if (diffDays > 1) {
    // Missed a day
    const updated = { ...profile, streak: 1 };
    saveProfile(updated);
    return updated;
  }
  return profile;
}

export function recordSession(result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>): {
  profile: UserProfile;
  gciDelta: number;
  xpEarned: number;
  leveledUp: boolean;
} {
  const profile = getProfile();
  const today = new Date().toISOString().split('T')[0];

  // Calculate XP based on score and accuracy
  const baseXP = Math.round((result.score / 10) + (result.accuracy * 0.8));
  const xpEarned = Math.max(50, Math.min(300, baseXP));

  // Calculate GCI delta based on performance vs current category score
  const currentCatScore = profile.scores[result.category];
  const performanceIndex = (result.score * 0.6) + (result.accuracy * 4);
  let gciDelta = Math.round((performanceIndex - currentCatScore) * 0.08);
  if (gciDelta === 0) gciDelta = 3; // encourage progress

  // Update Category Score
  const newCatScore = Math.max(200, Math.min(999, Math.round(currentCatScore + gciDelta)));
  const updatedScores = {
    ...profile.scores,
    [result.category]: newCatScore,
  };

  // Recalculate GCI (Global Cognitive Index)
  const scoreValues = Object.values(updatedScores);
  const newGci = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);

  // Recalculate Brain Age (baseline 30 -> lowers with high GCI & high speed)
  const speedBonus = result.averageReactionTimeMs > 0 ? Math.max(0, (500 - result.averageReactionTimeMs) / 50) : 0;
  const rawBrainAge = 35 - ((newGci - 500) / 30) - speedBonus;
  const brainAge = Math.max(18, Math.min(65, Math.round(rawBrainAge)));

  // XP & Level calculations
  let newXp = profile.xp + xpEarned;
  let newLevel = profile.level;
  let xpNeeded = profile.xpToNextLevel;
  let leveledUp = false;

  while (newXp >= xpNeeded) {
    newXp -= xpNeeded;
    newLevel += 1;
    xpNeeded = Math.round(xpNeeded * 1.3);
    leveledUp = true;
  }

  // Update Streak
  let newStreak = (profile.streak || 0);
  if (profile.lastTrainedDate !== today) {
    newStreak += 1;
  }

  const sessionEntry: GameSessionResult = {
    ...result,
    id: `sess-${Date.now()}`,
    timestamp: Date.now(),
    gciDelta,
    xpEarned,
  };

  // Badges: unlock first_synapse on first session
  const unlockedBadges = [...(profile.unlockedBadges || [])];
  if (!unlockedBadges.includes('first_synapse')) {
    unlockedBadges.push('first_synapse');
  }

  // Title based on level
  const titleIndex = Math.min(LEVEL_TITLES.length - 1, Math.max(0, newLevel - 1));
  const newTitle = LEVEL_TITLES[titleIndex];

  const updatedProfile: UserProfile = {
    ...profile,
    level: newLevel,
    title: newTitle,
    xp: newXp,
    xpToNextLevel: xpNeeded,
    gci: newGci,
    brainAge,
    streak: newStreak,
    lastTrainedDate: today,
    scores: updatedScores,
    unlockedBadges,
    completedWorkoutsCount: (profile.completedWorkoutsCount || 0) + 1,
    sessionsHistory: [sessionEntry, ...profile.sessionsHistory.slice(0, 49)],
  };

  saveProfile(updatedProfile);

  return {
    profile: updatedProfile,
    gciDelta,
    xpEarned,
    leveledUp,
  };
}

export function recordGameSession(result: Omit<GameSessionResult, 'id' | 'timestamp' | 'gciDelta' | 'xpEarned'>): UserProfile {
  const res = recordSession(result);
  return res.profile;
}

export function updateCharacterTraits(delta: Partial<CharacterTraits>, xpBonus = 120): UserProfile {
  const profile = getProfile();
  const updatedTraits: CharacterTraits = {
    resilience: Math.min(100, Math.max(10, profile.characterTraits.resilience + (delta.resilience || 0))),
    temperance: Math.min(100, Math.max(10, profile.characterTraits.temperance + (delta.temperance || 0))),
    wisdom: Math.min(100, Math.max(10, profile.characterTraits.wisdom + (delta.wisdom || 0))),
    courage: Math.min(100, Math.max(10, profile.characterTraits.courage + (delta.courage || 0))),
    emotionalMastery: Math.min(100, Math.max(10, profile.characterTraits.emotionalMastery + (delta.emotionalMastery || 0))),
  };

  const traitValues = Object.values(updatedTraits);
  const avgTraitScore = (traitValues.reduce((a, b) => a + b, 0) / traitValues.length) * 10;
  
  const updatedScores = {
    ...profile.scores,
    character: Math.round(avgTraitScore),
  };

  let newXp = profile.xp + xpBonus;
  let newLevel = profile.level;
  let xpNeeded = profile.xpToNextLevel;

  while (newXp >= xpNeeded) {
    newXp -= xpNeeded;
    newLevel += 1;
    xpNeeded = Math.round(xpNeeded * 1.3);
  }

  const titleIndex = Math.min(LEVEL_TITLES.length - 1, Math.max(0, newLevel - 1));
  const newTitle = LEVEL_TITLES[titleIndex];

  const todayStr = new Date().toISOString().split('T')[0];
  const existingHistory = profile.traitsHistory || [
    {
      date: new Date(Date.now() - 86400000 * 28).toISOString().split('T')[0],
      timestamp: Date.now() - 86400000 * 28,
      label: 'Baseline Iniziale (30g fa)',
      traits: {
        resilience: 52,
        temperance: 48,
        wisdom: 56,
        courage: 50,
        emotionalMastery: 54,
        communication: 48,
        selfEsteem: 50,
        mindset: 55,
        positivity: 52,
      },
    },
    {
      date: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
      timestamp: Date.now() - 86400000 * 14,
      label: '2 Settimane fa',
      traits: {
        resilience: 60,
        temperance: 55,
        wisdom: 64,
        courage: 58,
        emotionalMastery: 63,
        communication: 57,
        selfEsteem: 59,
        mindset: 62,
        positivity: 60,
      },
    },
    {
      date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
      timestamp: Date.now() - 86400000 * 7,
      label: '7 Giorni fa',
      traits: {
        resilience: 65,
        temperance: 60,
        wisdom: 68,
        courage: 64,
        emotionalMastery: 70,
        communication: 64,
        selfEsteem: 66,
        mindset: 68,
        positivity: 67,
      },
    },
  ];

  const todaySnapshotIndex = existingHistory.findIndex(h => h.date === todayStr);
  let updatedHistory = [...existingHistory];
  if (todaySnapshotIndex >= 0) {
    updatedHistory[todaySnapshotIndex] = {
      ...updatedHistory[todaySnapshotIndex],
      traits: updatedTraits,
      timestamp: Date.now(),
    };
  } else {
    updatedHistory.push({
      date: todayStr,
      timestamp: Date.now(),
      label: 'Stato Attuale (Oggi)',
      traits: updatedTraits,
    });
  }

  const updatedProfile: UserProfile = {
    ...profile,
    level: newLevel,
    title: newTitle,
    xp: newXp,
    xpToNextLevel: xpNeeded,
    characterTraits: updatedTraits,
    scores: updatedScores,
    traitsHistory: updatedHistory,
  };

  saveProfile(updatedProfile);
  return updatedProfile;
}
