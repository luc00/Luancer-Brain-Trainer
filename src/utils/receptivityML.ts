import { UserProfile, MLReceptivityWindow, MicroWorkoutPlan, CharacterTraits } from '../types';
import { WatchState } from './watchBridge';

export const MICRO_WORKOUT_CATALOG: Record<string, MicroWorkoutPlan> = {
  stroop_blitz: {
    id: 'stroop_blitz',
    title: 'Stroop Inibizione Sub-Atomica (60s)',
    type: 'cognitive',
    category: 'speed',
    targetSkill: 'Inibizione Esecutiva & Velocità Neurale',
    durationSeconds: 60,
    description: '10 prove ad alta velocità per disinnescare la reattività automatica del cervello e potenziare la corteccia cingolata anteriore.',
    actionGuide: 'Tocca il COLORE dell\'inchiostro con cui è scritta la parola, ignorando il significato letterale del testo.',
    xpReward: 120,
    neuroBenefit: 'Attivazione selettiva della corteccia prefrontale dorsolaterale e potenziamento dell\'attenzione focalizzata.',
    traitBonus: { temperance: 3, resilience: 2, emotionalMastery: 2 },
  },
  speed_math: {
    id: 'speed_math',
    title: 'Sprint Aritmetico Sinaptico (60s)',
    type: 'cognitive',
    category: 'logic',
    targetSkill: 'Calcolo Rapido & Memoria di Lavoro',
    durationSeconds: 60,
    description: 'Risolvi 6 calcoli mentali a tempo per accelerare la connettività parieto-frontale e risvegliare la lucidità logica.',
    actionGuide: 'Calcola a mente il risultato e seleziona rapidamente l\'opzione esatta prima che scada il tempo.',
    xpReward: 125,
    neuroBenefit: 'Aumento del flusso sanguigno cerebrale nel lobulo parietale inferiore e riscaldamento sinaptico rapido.',
    traitBonus: { wisdom: 3, temperance: 2, resilience: 2 },
  },
  memory_matrix: {
    id: 'memory_matrix',
    title: 'Flash Matrix Visuo-Spaziale (60s)',
    type: 'cognitive',
    category: 'memory',
    targetSkill: 'Memoria Iconica & Ricordo Visuo-Spaziale',
    durationSeconds: 60,
    description: 'Memorizza la disposizione delle celle illuminate in una griglia 4x4 e riproducila dopo che svanisce.',
    actionGuide: 'Fissa la matrice per 1.5 secondi, memorizza il pattern geometrico e tocca le celle corrispondenti.',
    xpReward: 120,
    neuroBenefit: 'Stimolazione del circuito ippocampale CA1/CA3 e potenziamento dell\'interfaccia visuo-spaziale.',
    traitBonus: { wisdom: 3, resilience: 2, selfEsteem: 2 },
  },
  vagal_sigh: {
    id: 'vagal_sigh',
    title: 'Reset Vago-Frenico & Sospiro Fisiologico (60s)',
    type: 'vagal_reset',
    category: 'resilience',
    targetSkill: 'Regolazione Parasimpatica & Calma Istantanea',
    durationSeconds: 60,
    description: '3 cicli guidati di doppio inspiro nasale seguito da espirazione prolungata per azzerare l\'ansia e la tachicardia.',
    actionGuide: 'Doppio inspiro profondo dal naso (uno lungo + un colpo finale per riaprire gli alveoli), poi espira lentamente dalla bocca.',
    xpReward: 110,
    neuroBenefit: 'Attivazione immediata del nervo vago e drenaggio della CO2 alveolare, riducendo l\'iper-reattività dell\'amigdala.',
    traitBonus: { emotionalMastery: 4, temperance: 3, resilience: 3 },
  },
  altruism_kindness: {
    id: 'altruism_kindness',
    title: 'Micro-Azione Altruistica Lampo (60s)',
    type: 'character',
    category: 'character',
    targetSkill: 'Empatia Proattiva & Connessione Sociale',
    durationSeconds: 60,
    description: 'Invia subito un messaggio autentico di ringraziamento o fai un complimento spontaneo a una persona vicina.',
    actionGuide: 'Apri la chat o parla a chi hai vicino: esprimi un apprezzamento genuino per una qualità concreta che stimi.',
    xpReward: 130,
    neuroBenefit: 'Cascata di ossitocina ed endorfine ("Helper\'s High"), con abbattimento del cortisolo e rafforzamento dei legami.',
    traitBonus: { positivity: 5, communication: 4, selfEsteem: 3 },
  },
  stoic_pause: {
    id: 'stoic_pause',
    title: 'La Pausa di Seneca & Dicotomia del Controllo (60s)',
    type: 'character',
    category: 'character',
    targetSkill: 'Autocontrollo & Riformulazione Filosofica',
    durationSeconds: 60,
    description: 'Identifica una tensione attuale della tua giornata e separala in: ciò che dipende da te vs ciò che non puoi controllare.',
    actionGuide: 'Respira con calma, focalizza la tua energia unicamente sulla tua prossima mossa virtuosa e lascia andare il resto.',
    xpReward: 115,
    neuroBenefit: 'Inibizione del sequestro amigdaloideo a favore dell\'elaborazione razionale della corteccia orbito-frontale.',
    traitBonus: { wisdom: 4, temperance: 4, emotionalMastery: 3 },
  },
};

/**
 * 24h Human Chronobiology Baseline Curve (Receptivity probability 0-100%).
 * Grounded in circadian rhythm studies on cortisol, body temperature, and executive function.
 */
const CIRCADIAN_BASELINES: Record<number, {
  prob: number;
  label: string;
  phase: MLReceptivityWindow['circadianPhase'];
  recommended: MLReceptivityWindow['recommendedMicroType'];
  reasoning: string;
  intensity: MLReceptivityWindow['intensity'];
}> = {
  0: { prob: 8, label: 'Riposo Profondo & Onde Delta', phase: 'rest', recommended: 'vagal_sigh', reasoning: 'Fase di consolidamento sonno profondo e drenaggio glinfatico.', intensity: 'light' },
  1: { prob: 5, label: 'Sonno NREM & Recupero Immunitario', phase: 'rest', recommended: 'vagal_sigh', reasoning: 'Minimo biologico di temperatura corporea e cortisolo.', intensity: 'light' },
  2: { prob: 5, label: 'Picco Melatonina & Sonno Profondo', phase: 'rest', recommended: 'vagal_sigh', reasoning: 'Rigenerazione cellulare cerebrale.', intensity: 'light' },
  3: { prob: 6, label: 'Fase REM & Sintesi Mnemonica', phase: 'rest', recommended: 'vagal_sigh', reasoning: 'Consolidamento della memoria emotiva e procedurale.', intensity: 'light' },
  4: { prob: 8, label: 'Transizione Notturna Terminale', phase: 'rest', recommended: 'vagal_sigh', reasoning: 'Attività metabolica a basso consumo.', intensity: 'light' },
  5: { prob: 18, label: 'Pre-Risveglio & Inizio Secrezione Cortisolo', phase: 'rest', recommended: 'vagal_sigh', reasoning: 'Graduale innalzamento della pressione sanguigna.', intensity: 'light' },
  6: { prob: 45, label: 'Risveglio & Attivazione Sensoriale', phase: 'cortisol_boost', recommended: 'vagal_sigh', reasoning: 'Risposta di risveglio del cortisolo (CAR): ottima per respirazione ossigenante.', intensity: 'light' },
  7: { prob: 68, label: 'Priming Mattutino & Luce Naturale', phase: 'cortisol_boost', recommended: 'speed_math', reasoning: 'Aumento della temperatura corporea e sincronizzazione dei ritmi circadiani.', intensity: 'moderate' },
  8: { prob: 80, label: 'Ascesa dell\'Attenzione Focalizzata', phase: 'peak_focus', recommended: 'stroop_blitz', reasoning: 'Livelli ottimali di dopamina e noradrenalina per task esecutivi.', intensity: 'high' },
  9: { prob: 94, label: 'Finestra d\'Oro di Massima Lucidità Mattutina', phase: 'peak_focus', recommended: 'stroop_blitz', reasoning: 'Picco di reattività della corteccia prefrontale dorsolaterale e memoria di lavoro.', intensity: 'high' },
  10: { prob: 96, label: 'Picco Esecutivo & Deep Cognition', phase: 'peak_focus', recommended: 'speed_math', reasoning: 'Massima capacità computazionale cerebrale della giornata.', intensity: 'high' },
  11: { prob: 91, label: 'Consolidamento Focus Prima di Pranzo', phase: 'peak_focus', recommended: 'memory_matrix', reasoning: 'Elevata coordinazione neurale prima della pausa calorica.', intensity: 'high' },
  12: { prob: 72, label: 'Transizione Meridiana & Idratazione', phase: 'post_lunch_dip', recommended: 'altruism_kindness', reasoning: 'Inizio della digestione e apertura all\'empatia relazionale.', intensity: 'moderate' },
  13: { prob: 55, label: 'Fase Post-Prandiale & Accumulo Adenosina', phase: 'post_lunch_dip', recommended: 'vagal_sigh', reasoning: 'Fisiologico calo della vigilanza: ideale per reset vagale senza sovraccaricare la mente.', intensity: 'light' },
  14: { prob: 52, label: 'Dip Circadiano Pomeridiano', phase: 'post_lunch_dip', recommended: 'stoic_pause', reasoning: 'Minimo di focus esecutivo: ideale per micro-pausa stoica o camminata.', intensity: 'light' },
  15: { prob: 74, label: 'Risveglio Energetico Pomeridiano', phase: 'dopamine_recovery', recommended: 'stroop_blitz', reasoning: 'Ripresa del tono simpatico e della reattività neurale.', intensity: 'moderate' },
  16: { prob: 88, label: 'Secondo Picco di Vigilanza & Problem Solving', phase: 'dopamine_recovery', recommended: 'memory_matrix', reasoning: 'Picco di temperatura corporea e velocità nei compiti logico-spaziali.', intensity: 'high' },
  17: { prob: 92, label: 'Finestra di Lucidità Tardo-Pomeridiana', phase: 'dopamine_recovery', recommended: 'speed_math', reasoning: 'Forte prontezza cognitiva e refrattarietà alle distrazioni.', intensity: 'high' },
  18: { prob: 82, label: 'Chiusura Operativa & Transizione Personale', phase: 'dopamine_recovery', recommended: 'altruism_kindness', reasoning: 'Transizione tra lavoro e vita personale: momento propizio per la connessione umana.', intensity: 'moderate' },
  19: { prob: 70, label: 'Decelerazione Serale & Connessione', phase: 'stoic_winddown', recommended: 'altruism_kindness', reasoning: 'Apertura emotiva, cena e socialità empatica.', intensity: 'moderate' },
  20: { prob: 75, label: 'Riflessione Filosofica & Gratitudine', phase: 'stoic_winddown', recommended: 'stoic_pause', reasoning: 'Ottima ricettività per il bilancio della giornata e diario stoico.', intensity: 'light' },
  21: { prob: 65, label: 'Decompressione Digitale & Calma Notturna', phase: 'stoic_winddown', recommended: 'vagal_sigh', reasoning: 'Inizio secrezione melatonina: proteggere la mente da stimoli intensi.', intensity: 'light' },
  22: { prob: 40, label: 'Preparazione al Sonno & Spegnimento Schermi', phase: 'stoic_winddown', recommended: 'vagal_sigh', reasoning: 'Rilassamento muscolare progressivo e respirazione lenta.', intensity: 'light' },
  23: { prob: 20, label: 'Ingresso nel Sonno & Rilascio Melatonina', phase: 'rest', recommended: 'vagal_sigh', reasoning: 'Transizione verso il ciclo di sonno notturno.', intensity: 'light' },
};

/**
 * Extracts historical training patterns from user's sessions history.
 */
function extractUserTemporalFeatures(profile: UserProfile): {
  hourlyCounts: number[];
  hourlyAccuracy: number[];
  hourlyReactionScores: number[];
  totalSamples: number;
} {
  const hourlyCounts = new Array(24).fill(0);
  const hourlyAccuracySums = new Array(24).fill(0);
  const hourlyReactionSums = new Array(24).fill(0);

  const history = profile.sessionsHistory || [];
  history.forEach((s) => {
    if (!s.timestamp) return;
    const date = new Date(s.timestamp);
    const hour = date.getHours();
    hourlyCounts[hour] += 1;
    hourlyAccuracySums[hour] += s.accuracy || 80;
    hourlyReactionSums[hour] += Math.max(0, 1000 - (s.averageReactionTimeMs || 500));
  });

  const hourlyAccuracy = hourlyCounts.map((count, h) => (count > 0 ? hourlyAccuracySums[h] / count : 80));
  const hourlyReactionScores = hourlyCounts.map((count, h) => (count > 0 ? hourlyReactionSums[h] / count : 500));

  return {
    hourlyCounts,
    hourlyAccuracy,
    hourlyReactionScores,
    totalSamples: history.length,
  };
}

/**
 * Machine Learning Predictor:
 * Generates 24-hour predictive receptivity curve using a weighted Bayesian ensemble
 * of circadian biology, user behavioral logs, and real-time smartwatch telemetry.
 */
export function predict24hReceptivityCurve(profile: UserProfile, watchState?: WatchState): MLReceptivityWindow[] {
  const { hourlyCounts, hourlyAccuracy, totalSamples } = extractUserTemporalFeatures(profile);
  const maxCount = Math.max(...hourlyCounts, 1);

  // Weight for user empirical history vs circadian prior
  // More historical sessions -> higher weight on user-specific empirical distribution
  const userWeight = Math.min(0.65, 0.2 + (totalSamples * 0.04));
  const circadianWeight = 1 - userWeight;

  return Array.from({ length: 24 }, (_, hour) => {
    const base = CIRCADIAN_BASELINES[hour] || CIRCADIAN_BASELINES[10];
    const userEmpiricalScore = maxCount > 0 ? (hourlyCounts[hour] / maxCount) * 100 : 50;
    const accuracyBonus = ((hourlyAccuracy[hour] - 70) / 30) * 10; // -10 to +10

    // Ensemble calculation
    let rawProb = (base.prob * circadianWeight) + (userEmpiricalScore * userWeight) + accuracyBonus;

    // Apply Smartwatch Biometrics adjustments if available
    if (watchState?.isConnected && watchState.biometrics) {
      if (watchState.biometrics.stressLevel > 65) {
        // High stress: boost receptivity for calm / vagal exercises
        if (base.phase === 'post_lunch_dip' || base.phase === 'stoic_winddown') {
          rawProb += 12;
        }
      } else if (watchState.biometrics.hrv > 50 && base.phase === 'peak_focus') {
        // High HRV & focus window: high cognitive readiness
        rawProb += 8;
      }
    }

    // Normalized bounds
    const probability = Math.round(Math.min(99, Math.max(5, rawProb)));
    const isHistoricalPeak = hourlyCounts[hour] >= Math.max(2, maxCount * 0.7);

    return {
      hour,
      probability,
      label: base.label,
      circadianPhase: base.phase,
      recommendedMicroType: base.recommended,
      reasoning: base.reasoning,
      intensity: base.intensity,
      isHistoricalPeak,
    };
  });
}

/**
 * Predicts the optimal next reminder time and recommended micro-workout.
 */
export function getOptimalNextReminder(profile: UserProfile, watchState?: WatchState): {
  nextWindow: MLReceptivityWindow;
  date: Date;
  microWorkout: MicroWorkoutPlan;
  confidence: number;
} {
  const curve = predict24hReceptivityCurve(profile, watchState);
  const now = new Date();
  const currentHour = now.getHours();

  const settings = profile.reminderSettings;
  const quietStart = settings?.quietHoursStart ?? 22;
  const quietEnd = settings?.quietHoursEnd ?? 7;

  // Filter windows in future for today, or tomorrow morning
  let bestWindow: MLReceptivityWindow | null = null;
  let targetHour = currentHour + 1;
  let isTomorrow = false;

  // Search forward in the next 18 hours
  let maxScore = -1;
  for (let step = 1; step <= 24; step++) {
    const candidateHour = (currentHour + step) % 24;
    const isQuiet = quietStart > quietEnd 
      ? candidateHour >= quietStart || candidateHour < quietEnd
      : candidateHour >= quietStart && candidateHour < quietEnd;

    if (isQuiet) continue;

    const window = curve[candidateHour];
    if (window.probability > maxScore) {
      maxScore = window.probability;
      bestWindow = window;
      targetHour = candidateHour;
      isTomorrow = currentHour + step >= 24;
    }
  }

  if (!bestWindow) {
    bestWindow = curve[10]; // Fallback to 10 AM
    targetHour = 10;
    isTomorrow = currentHour >= 10;
  }

  const reminderDate = new Date();
  if (isTomorrow) {
    reminderDate.setDate(reminderDate.getDate() + 1);
  }
  reminderDate.setHours(targetHour, 15, 0, 0);

  const microWorkout = MICRO_WORKOUT_CATALOG[bestWindow.recommendedMicroType] || MICRO_WORKOUT_CATALOG.stroop_blitz;
  const confidence = Math.min(96, Math.max(65, Math.round(bestWindow.probability * 0.95)));

  return {
    nextWindow: bestWindow,
    date: reminderDate,
    microWorkout,
    confidence,
  };
}

/**
 * Evaluates real-time receptivity at the current moment.
 */
export function getCurrentReceptivityAnalysis(profile: UserProfile, watchState?: WatchState): {
  currentScore: number;
  isOptimalNow: boolean;
  window: MLReceptivityWindow;
  microWorkout: MicroWorkoutPlan;
  actionMessage: string;
} {
  const curve = predict24hReceptivityCurve(profile, watchState);
  const now = new Date();
  const currentHour = now.getHours();
  const window = curve[currentHour] || curve[10];

  const currentScore = window.probability;
  const isOptimalNow = currentScore >= 75;

  const microWorkout = MICRO_WORKOUT_CATALOG[window.recommendedMicroType] || MICRO_WORKOUT_CATALOG.stroop_blitz;

  let actionMessage = '';
  if (currentScore >= 88) {
    actionMessage = 'Massimo Picco Neurale: Finestra d\'oro per micro-stimolazione ad alto rendimento!';
  } else if (currentScore >= 75) {
    actionMessage = 'Ottima Ricettività: La mente è pronta per un micro-sprint di 60 secondi.';
  } else if (currentScore >= 50) {
    actionMessage = 'Fase di Mantenimento: Ideale per un reset vagale o un atto di gentilezza.';
  } else {
    actionMessage = 'Fase di Recupero/Riposo: Proteggi il tuo sonno e la calma biologica.';
  }

  return {
    currentScore,
    isOptimalNow,
    window,
    microWorkout,
    actionMessage,
  };
}

/**
 * Detects the user's circadian chronotype based on historical engagement patterns.
 */
export function detectUserChronotype(profile: UserProfile): {
  chronotype: 'Allodola Mattutina' | 'Cronotipo Intermedio' | 'Gufo Creativo';
  peakHour: string;
  confidence: number;
  explanation: string;
  recommendedTime: string;
} {
  const { hourlyCounts, totalSamples } = extractUserTemporalFeatures(profile);

  let morningSum = 0; // 06:00 - 12:00
  let afternoonSum = 0; // 12:00 - 18:00
  let eveningSum = 0; // 18:00 - 24:00

  hourlyCounts.forEach((count, h) => {
    if (h >= 6 && h < 12) morningSum += count;
    else if (h >= 12 && h < 18) afternoonSum += count;
    else if (h >= 18 && h <= 23) eveningSum += count;
  });

  const maxHourlyCount = Math.max(...hourlyCounts);
  const peakHourNum = hourlyCounts.indexOf(maxHourlyCount) !== -1 ? hourlyCounts.indexOf(maxHourlyCount) : 10;
  const peakHourFormatted = `${peakHourNum.toString().padStart(2, '0')}:00`;

  let chronotype: 'Allodola Mattutina' | 'Cronotipo Intermedio' | 'Gufo Creativo' = 'Cronotipo Intermedio';
  let explanation = '';
  let recommendedTime = '09:30 - 11:30 & 16:30';

  if (morningSum > afternoonSum && morningSum > eveningSum) {
    chronotype = 'Allodola Mattutina';
    explanation = 'Il tuo sistema nervoso raggiunge il massimo rendimento esecutivo nelle prime 4 ore dopo il risveglio.';
    recommendedTime = '08:30 - 10:45';
  } else if (eveningSum > morningSum && eveningSum > afternoonSum) {
    chronotype = 'Gufo Creativo';
    explanation = 'I tuoi circuiti dopaminergici e di concentrazione profonda si accendono nel tardo pomeriggio e sera.';
    recommendedTime = '17:00 - 20:30';
  } else {
    chronotype = 'Cronotipo Intermedio';
    explanation = 'Curva bifasica classica con picco esecutivo alle 10:00 e secondo risveglio cognitivo alle 17:00.';
    recommendedTime = '10:00 - 11:30 & 16:30 - 18:00';
  }

  const confidence = Math.min(94, Math.max(70, 70 + totalSamples * 3));

  return {
    chronotype,
    peakHour: peakHourFormatted,
    confidence,
    explanation,
    recommendedTime,
  };
}

export function getMicroWorkoutById(id: string): MicroWorkoutPlan {
  return MICRO_WORKOUT_CATALOG[id] || MICRO_WORKOUT_CATALOG.stroop_blitz;
}
