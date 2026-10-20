export type Language = 'it' | 'en' | 'es' | 'fr' | 'de' | 'pt';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  country: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', country: 'Italia' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', country: 'United States / UK' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', country: 'España / Latam' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', country: 'France' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', country: 'Deutschland' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', country: 'Brasil / Portugal' },
];

export const translations = {
  it: {
    // Header & Navigation
    appName: 'Luancer',
    tagline: 'Neuro-Palestra Cognitiva & Carattere',
    tabToday: 'Oggi',
    tabGames: 'Giochi',
    tabCharacter: 'Carattere',
    tabCoach: 'Coach IA',
    tabAnalytics: 'Report',
    binauralTooltip: 'Onde Cerebrali Binaurali Luancer',
    soundMuteTooltip: 'Silenzia Suoni',
    soundUnmuteTooltip: 'Riattiva Suoni',
    watchTooltip: 'Connetti Smart Watch / Apple Watch',
    languageTooltip: 'Cambia Lingua',

    // Smartwatch Hub
    watchHeader: 'Apple Watch & Smartwatch',
    watchSubheader: 'Sincronizzazione biometria, battito cardiaco e modalità di gioco al polso',
    watchConnected: 'Connesso',
    watchDisconnected: 'Disconnesso',
    watchPairDevice: 'Associa Apple Watch / WearOS',
    watchConnecting: 'Ricerca e sincronizzazione in corso...',
    watchDisconnect: 'Disconnetti Dispositivo',
    watchHeartRate: 'Battito Cardiaco',
    watchHRV: 'Variabilità HRV',
    watchStress: 'Livello Stress',
    watchSteps: 'Passi Oggi',
    watchPlayOnWrist: 'Gioca Direttamente su Apple Watch',
    watchWristSimulation: 'Simulatore Polso WatchOS / WearOS',
    watchLaunchMicroGame: 'Avvia Micro-Gioco al Polso',
    watchHapticActive: 'Feedback Aptico Attivo',
    watchSelectGame: 'Seleziona Micro-Gioco per Smartwatch',
    watchSyncXP: 'XP Sincronizzati sul Profilo',
    watchCrownRotate: 'Ruota Digital Crown',
    watchStandaloneUrl: 'Apri Standalone per Browser Watch',
    watchCopyLink: 'Copia Link Standalone',
    watchLinkCopied: 'Link copiato per Apple Watch!',
    watchClose: 'Chiudi',

    // Micro Games on Watch
    watchGameStroopTitle: 'Stroop Reflex Micro',
    watchGameStroopDesc: 'Riconosci la corrispondenza colore-parola al polso',
    watchGameNbackTitle: 'Micro Dual N-Back',
    watchGameNbackDesc: 'Memoria di lavoro istantanea a 4 quadranti',
    watchGameBreatheTitle: 'Coerenza Cardiaca & Battito',
    watchGameBreatheDesc: 'Respiro guidato con vibrazioni aptiche sincronizzate',
    watchGameMathTitle: 'Calcolo Lampo Watch',
    watchGameMathDesc: 'Equazioni mentali rapide sul quadrante',
    watchGameMantraTitle: 'Mantra & Check-in Polso',
    watchGameMantraDesc: 'Micro-ancoraggio quotidiano sul quadrante',

    // Daily Workout
    workoutTitle: 'Allenamento Cognitivo Quotidiano',
    workoutStreak: 'giorni consecutivi',
    startWorkout: 'Avvia Sessione di Oggi',
    dailyGCI: 'Indice GCI',
    quickSummary: 'Sintesi Neuro-Funzionale',
    pillarsQuickCardTitle: '18 Pilastri della Psiche',
    pillarsQuickCardSub: 'Confini, stress, sonno & virtù umane',

    // Character Gym & 18 Pillars
    pillarsHeader: 'I 18 Pilastri della Psiche & Virtù',
    pillarsSubheader: 'Allenamento neuro-psicologico guidato: percezione realistica, confini, stress, intelligenza emotiva, mantra, sonno, altruismo e psicologia positiva.',
    pillarFilterAll: 'Tutti i 18 Pilastri',
    pillarFilterMind: 'Mente & Consapevolezza',
    pillarFilterStress: 'Emozioni, Stress & Sonno',
    pillarFilterIdentity: 'Identità & Autostima',
    pillarFilterSocial: 'Relazioni & Altruismo',
    startPillarExercise: 'Avvia Esercizio Pratico',
    pillarIntegratedSuccess: 'Pilastro Integrato con Successo!',
    pillarMantraLabel: 'Mantra di Integrazione Quotidiana',
    pillarActionCommitment: 'Impegno Pratico per Oggi',
    repeatExercise: 'Ripeti Esercizio',
    backToAllPillars: 'Torna a Tutti i Pilastri',

    // Languages
    languageSelectTitle: 'Seleziona la tua Lingua',
    languageAutoDetected: 'Lingua Rilevata dal Paese / Browser',
    languageConfirm: 'Applica Lingua',

    // Common
    completed: 'Completato',
    inProgress: 'In corso',
    xpGrowth: 'XP Crescita',
    level: 'Livello',
    score: 'Punteggio',
    highScore: 'Record Personale',
    back: 'Indietro',
    continue: 'Prosegui',
    close: 'Chiudi',
  },
  en: {
    // Header & Navigation
    appName: 'Luancer',
    tagline: 'Neuro-Cognitive & Character Gym',
    tabToday: 'Today',
    tabGames: 'Games',
    tabCharacter: 'Character',
    tabCoach: 'AI Coach',
    tabAnalytics: 'Reports',
    binauralTooltip: 'Luancer Binaural Brainwaves',
    soundMuteTooltip: 'Mute Sounds',
    soundUnmuteTooltip: 'Unmute Sounds',
    watchTooltip: 'Connect Smartwatch / Apple Watch',
    languageTooltip: 'Change Language',

    // Smartwatch Hub
    watchHeader: 'Apple Watch & Smartwatch',
    watchSubheader: 'Biometric telemetry sync, heart rate monitoring, and on-wrist gaming',
    watchConnected: 'Connected',
    watchDisconnected: 'Disconnected',
    watchPairDevice: 'Pair Apple Watch / WearOS',
    watchConnecting: 'Searching and syncing wearable...',
    watchDisconnect: 'Disconnect Device',
    watchHeartRate: 'Heart Rate',
    watchHRV: 'HRV Variability',
    watchStress: 'Stress Level',
    watchSteps: 'Steps Today',
    watchPlayOnWrist: 'Play Directly on Apple Watch',
    watchWristSimulation: 'WatchOS / WearOS Wrist Simulator',
    watchLaunchMicroGame: 'Launch On-Wrist Micro Game',
    watchHapticActive: 'Haptic Engine Active',
    watchSelectGame: 'Select Smartwatch Micro-Game',
    watchSyncXP: 'XP Synced to Profile',
    watchCrownRotate: 'Rotate Digital Crown',
    watchStandaloneUrl: 'Open Standalone for Watch Browser',
    watchCopyLink: 'Copy Standalone Link',
    watchLinkCopied: 'Link copied for Apple Watch!',
    watchClose: 'Close',

    // Micro Games on Watch
    watchGameStroopTitle: 'Stroop Reflex Micro',
    watchGameStroopDesc: 'Color-word reflex recognition on your wrist',
    watchGameNbackTitle: 'Micro Dual N-Back',
    watchGameNbackDesc: 'Instant 4-quadrant spatial working memory',
    watchGameBreatheTitle: 'Cardiac Coherence & Pulse',
    watchGameBreatheDesc: 'Guided breathing synced with haptic pulses',
    watchGameMathTitle: 'Watch Flash Math',
    watchGameMathDesc: 'Rapid mental arithmetic right on the watch dial',
    watchGameMantraTitle: 'Mantra & Wrist Check-in',
    watchGameMantraDesc: 'Daily grounding micro-checkin and power mantra',

    // Daily Workout
    workoutTitle: 'Daily Cognitive Workout',
    workoutStreak: 'day streak',
    startWorkout: 'Start Today\'s Session',
    dailyGCI: 'GCI Index',
    quickSummary: 'Neuro-Functional Summary',
    pillarsQuickCardTitle: '18 Psychology Pillars',
    pillarsQuickCardSub: 'Boundaries, stress, sleep & human virtues',

    // Character Gym & 18 Pillars
    pillarsHeader: 'The 18 Pillars of Psyche & Virtue',
    pillarsSubheader: 'Guided neuro-psychological training: realistic perception, boundaries, stress, emotional intelligence, mantras, sleep, altruism, and positive psychology.',
    pillarFilterAll: 'All 18 Pillars',
    pillarFilterMind: 'Mind & Awareness',
    pillarFilterStress: 'Emotions, Stress & Sleep',
    pillarFilterIdentity: 'Identity & Self-Esteem',
    pillarFilterSocial: 'Relationships & Altruism',
    startPillarExercise: 'Start Practical Exercise',
    pillarIntegratedSuccess: 'Pillar Successfully Integrated!',
    pillarMantraLabel: 'Daily Integration Mantra',
    pillarActionCommitment: 'Practical Commitment for Today',
    repeatExercise: 'Repeat Exercise',
    backToAllPillars: 'Back to All Pillars',

    // Languages
    languageSelectTitle: 'Select Your Language',
    languageAutoDetected: 'Auto-detected from Country / Browser',
    languageConfirm: 'Apply Language',

    // Common
    completed: 'Completed',
    inProgress: 'In Progress',
    xpGrowth: 'XP Growth',
    level: 'Level',
    score: 'Score',
    highScore: 'Personal Best',
    back: 'Back',
    continue: 'Continue',
    close: 'Close',
  },
  es: {
    // Header & Navigation
    appName: 'Luancer',
    tagline: 'Neuro-Gimnasio Cognitivo y de Carácter',
    tabToday: 'Hoy',
    tabGames: 'Juegos',
    tabCharacter: 'Carácter',
    tabCoach: 'Coach IA',
    tabAnalytics: 'Informes',
    binauralTooltip: 'Ondas Cerebrales Binaurales Luancer',
    soundMuteTooltip: 'Silenciar Sonidos',
    soundUnmuteTooltip: 'Reactivar Sonidos',
    watchTooltip: 'Conectar Smartwatch / Apple Watch',
    languageTooltip: 'Cambiar Idioma',

    // Smartwatch Hub
    watchHeader: 'Apple Watch y Smartwatch',
    watchSubheader: 'Sincronización de biometría, pulso cardíaco y modo de juego en la muñeca',
    watchConnected: 'Conectado',
    watchDisconnected: 'Desconectado',
    watchPairDevice: 'Vincular Apple Watch / WearOS',
    watchConnecting: 'Buscando y sincronizando dispositivo...',
    watchDisconnect: 'Desconectar Dispositivo',
    watchHeartRate: 'Frecuencia Cardíaca',
    watchHRV: 'Variabilidad VFC',
    watchStress: 'Nivel de Estrés',
    watchSteps: 'Pasos Hoy',
    watchPlayOnWrist: 'Jugar Directamente en Apple Watch',
    watchWristSimulation: 'Simulador de Muñeca WatchOS / WearOS',
    watchLaunchMicroGame: 'Iniciar Micro-Juego en la Muñeca',
    watchHapticActive: 'Motor Háptico Activo',
    watchSelectGame: 'Seleccionar Micro-Juego para Smartwatch',
    watchSyncXP: 'XP Sincronizados con el Perfil',
    watchCrownRotate: 'Girar Corona Digital',
    watchStandaloneUrl: 'Abrir Independiente para Navegador de Reloj',
    watchCopyLink: 'Copiar Enlace Independiente',
    watchLinkCopied: '¡Enlace copiado para Apple Watch!',
    watchClose: 'Cerrar',

    // Micro Games on Watch
    watchGameStroopTitle: 'Stroop Reflex Micro',
    watchGameStroopDesc: 'Reconocimiento de color-palabra en la muñeca',
    watchGameNbackTitle: 'Micro Dual N-Back',
    watchGameNbackDesc: 'Memoria de trabajo espacial en 4 cuadrantes',
    watchGameBreatheTitle: 'Coherencia Cardíaca y Pulso',
    watchGameBreatheDesc: 'Respiración guiada sincronizada con pulsos hápticos',
    watchGameMathTitle: 'Cálculo Relámpago Reloj',
    watchGameMathDesc: 'Operaciones aritméticas rápidas en la pantalla',
    watchGameMantraTitle: 'Mantra y Chequeo en Muñeca',
    watchGameMantraDesc: 'Anclaje diario y mantra de poder en el reloj',

    // Daily Workout
    workoutTitle: 'Entrenamiento Cognitivo Diario',
    workoutStreak: 'días seguidos',
    startWorkout: 'Iniciar Sesión de Hoy',
    dailyGCI: 'Índice GCI',
    quickSummary: 'Resumen Neuro-Funcional',
    pillarsQuickCardTitle: '18 Pilares de la Psique',
    pillarsQuickCardSub: 'Límites, estrés, sueño y virtudes humanas',

    // Character Gym & 18 Pillars
    pillarsHeader: 'Los 18 Pilares de la Psique y la Virtud',
    pillarsSubheader: 'Entrenamiento neuro-psicológico guiado: percepción realista, límites sanos, estrés, inteligencia emocional, mantras, sueño, altruismo y psicología positiva.',
    pillarFilterAll: 'Los 18 Pilares',
    pillarFilterMind: 'Mente y Conciencia',
    pillarFilterStress: 'Emociones, Estrés y Sueño',
    pillarFilterIdentity: 'Identidad y Autoestima',
    pillarFilterSocial: 'Relaciones y Altruismo',
    startPillarExercise: 'Iniciar Ejercicio Práctico',
    pillarIntegratedSuccess: '¡Pilar Integrado con Éxito!',
    pillarMantraLabel: 'Mantra de Integración Diaria',
    pillarActionCommitment: 'Compromiso Práctico para Hoy',
    repeatExercise: 'Repetir Ejercicio',
    backToAllPillars: 'Volver a Todos los Pilares',

    // Languages
    languageSelectTitle: 'Selecciona tu Idioma',
    languageAutoDetected: 'Idioma detectado por País / Navegador',
    languageConfirm: 'Aplicar Idioma',

    // Common
    completed: 'Completado',
    inProgress: 'En curso',
    xpGrowth: 'XP Crecimiento',
    level: 'Nivel',
    score: 'Puntuación',
    highScore: 'Récord Personal',
    back: 'Atrás',
    continue: 'Continuar',
    close: 'Cerrar',
  },
  fr: {
    // Header & Navigation
    appName: 'Luancer',
    tagline: 'Neuro-Gymnastique Cognitive & Caractère',
    tabToday: 'Aujourd\'hui',
    tabGames: 'Jeux',
    tabCharacter: 'Caractère',
    tabCoach: 'Coach IA',
    tabAnalytics: 'Rapports',
    binauralTooltip: 'Ondes Cérébrales Binaurales Luancer',
    soundMuteTooltip: 'Couper les sons',
    soundUnmuteTooltip: 'Activer les sons',
    watchTooltip: 'Connecter Smartwatch / Apple Watch',
    languageTooltip: 'Changer de Langue',

    // Smartwatch Hub
    watchHeader: 'Apple Watch & Montre Connectée',
    watchSubheader: 'Synchronisation biométrique, rythme cardiaque et jeu au poignet',
    watchConnected: 'Connecté',
    watchDisconnected: 'Déconnecté',
    watchPairDevice: 'Associer Apple Watch / WearOS',
    watchConnecting: 'Recherche et synchronisation en cours...',
    watchDisconnect: 'Déconnecter l\'Appareil',
    watchHeartRate: 'Fréquence Cardiaque',
    watchHRV: 'Variabilité VRC',
    watchStress: 'Niveau de Stress',
    watchSteps: 'Pas Aujourd\'hui',
    watchPlayOnWrist: 'Jouer Directement sur Apple Watch',
    watchWristSimulation: 'Simulateur Poignet WatchOS / WearOS',
    watchLaunchMicroGame: 'Lancer le Micro-Jeu au Poignet',
    watchHapticActive: 'Moteur Haptique Actif',
    watchSelectGame: 'Sélectionner un Micro-Jeu pour Montre',
    watchSyncXP: 'XP Synchronisés sur le Profil',
    watchCrownRotate: 'Tourner la Digital Crown',
    watchStandaloneUrl: 'Ouvrir Standalone pour Navigateur Montre',
    watchCopyLink: 'Copier le Lien Standalone',
    watchLinkCopied: 'Lien copié pour Apple Watch !',
    watchClose: 'Fermer',

    // Micro Games on Watch
    watchGameStroopTitle: 'Stroop Reflex Micro',
    watchGameStroopDesc: 'Reconnaissance réflexe couleur-mot au poignet',
    watchGameNbackTitle: 'Micro Dual N-Back',
    watchGameNbackDesc: 'Mémoire de travail spatiale à 4 quadrants',
    watchGameBreatheTitle: 'Cohérence Cardiaque & Pouls',
    watchGameBreatheDesc: 'Respiration guidée avec vibrations haptiques',
    watchGameMathTitle: 'Calcul Éclair Montre',
    watchGameMathDesc: 'Calculs mentaux rapides sur le cadran',
    watchGameMantraTitle: 'Mantra & Check-in Poignet',
    watchGameMantraDesc: 'Ancrage quotidien et mantra de force au poignet',

    // Daily Workout
    workoutTitle: 'Entraînement Cognitif Quotidien',
    workoutStreak: 'jours consécutifs',
    startWorkout: 'Démarrer la Session du Jour',
    dailyGCI: 'Indice GCI',
    quickSummary: 'Synthèse Neuro-Fonctionnelle',
    pillarsQuickCardTitle: '18 Piliers de la Psyché',
    pillarsQuickCardSub: 'Limites, stress, sommeil & vertus humaines',

    // Character Gym & 18 Pillars
    pillarsHeader: 'Les 18 Piliers de la Psyché & de la Vertu',
    pillarsSubheader: 'Entraînement neuro-psychologique guidé : perception réaliste, limites saines, gestion du stress, intelligence émotionnelle, mantras, sommeil, altruisme et psychologie positive.',
    pillarFilterAll: 'Tous les 18 Piliers',
    pillarFilterMind: 'Esprit & Conscience',
    pillarFilterStress: 'Émotions, Stress & Sommeil',
    pillarFilterIdentity: 'Identité & Estime de Soi',
    pillarFilterSocial: 'Relations & Altruisme',
    startPillarExercise: 'Démarrer l\'Exercice Pratique',
    pillarIntegratedSuccess: 'Pilier Intégré avec Succès !',
    pillarMantraLabel: 'Mantra d\'Intégration Quotidienne',
    pillarActionCommitment: 'Engagement Pratique pour Aujourd\'hui',
    repeatExercise: 'Répéter l\'Exercice',
    backToAllPillars: 'Retour à Tous les Piliers',

    // Languages
    languageSelectTitle: 'Sélectionnez votre Langue',
    languageAutoDetected: 'Langue Détectée selon Pays / Navigateur',
    languageConfirm: 'Appliquer la Langue',

    // Common
    completed: 'Terminé',
    inProgress: 'En cours',
    xpGrowth: 'XP Croissance',
    level: 'Niveau',
    score: 'Score',
    highScore: 'Record Personnel',
    back: 'Retour',
    continue: 'Continuer',
    close: 'Fermer',
  },
  de: {
    // Header & Navigation
    appName: 'Luancer',
    tagline: 'Neuro-Kognitives & Charakter-Gymnasium',
    tabToday: 'Heute',
    tabGames: 'Spiele',
    tabCharacter: 'Charakter',
    tabCoach: 'KI-Coach',
    tabAnalytics: 'Berichte',
    binauralTooltip: 'Luancer Binaurale Gehirnwellen',
    soundMuteTooltip: 'Töne stummschalten',
    soundUnmuteTooltip: 'Töne aktivieren',
    watchTooltip: 'Smartwatch / Apple Watch verbinden',
    languageTooltip: 'Sprache ändern',

    // Smartwatch Hub
    watchHeader: 'Apple Watch & Smartwatch',
    watchSubheader: 'Biometrie-Synchronisation, Herzfrequenz und Handgelenk-Spiele',
    watchConnected: 'Verbunden',
    watchDisconnected: 'Getrennt',
    watchPairDevice: 'Apple Watch / WearOS koppeln',
    watchConnecting: 'Suche und Synchronisierung läuft...',
    watchDisconnect: 'Gerät trennen',
    watchHeartRate: 'Herzfrequenz',
    watchHRV: 'HRV-Variabilität',
    watchStress: 'Stress-Level',
    watchSteps: 'Schritte Heute',
    watchPlayOnWrist: 'Direkt auf der Apple Watch spielen',
    watchWristSimulation: 'WatchOS / WearOS Handgelenk-Simulator',
    watchLaunchMicroGame: 'Mikro-Spiel am Handgelenk starten',
    watchHapticActive: 'Haptisches Feedback aktiv',
    watchSelectGame: 'Smartwatch-Mikrospiel wählen',
    watchSyncXP: 'XP mit Profil synchronisiert',
    watchCrownRotate: 'Digital Crown drehen',
    watchStandaloneUrl: 'Eigenständige Uhr-Browser-Version',
    watchCopyLink: 'Link kopieren',
    watchLinkCopied: 'Link für Apple Watch kopiert!',
    watchClose: 'Schließen',

    // Micro Games on Watch
    watchGameStroopTitle: 'Stroop Reflex Mikro',
    watchGameStroopDesc: 'Farb-Wort-Reflexerkennung am Handgelenk',
    watchGameNbackTitle: 'Mikro Dual N-Back',
    watchGameNbackDesc: 'Sofortiges 4-Quadranten-Arbeitsgedächtnis',
    watchGameBreatheTitle: 'Herzkohärenz & Puls',
    watchGameBreatheDesc: 'Geführte Atmung synchronisiert mit Haptik-Impulsen',
    watchGameMathTitle: 'Blitzrechnen Watch',
    watchGameMathDesc: 'Schnelle Kopfrechenaufgaben auf dem Zifferblatt',
    watchGameMantraTitle: 'Mantra & Check-in am Handgelenk',
    watchGameMantraDesc: 'Tägliche Verankerung und Kraft-Mantra',

    // Daily Workout
    workoutTitle: 'Tägliches Kognitives Training',
    workoutStreak: 'Tage in Folge',
    startWorkout: 'Heutige Session starten',
    dailyGCI: 'GCI-Index',
    quickSummary: 'Neuro-Funktionale Übersicht',
    pillarsQuickCardTitle: '18 Säulen der Psyche',
    pillarsQuickCardSub: 'Grenzen, Stress, Schlaf & menschliche Tugenden',

    // Character Gym & 18 Pillars
    pillarsHeader: 'Die 18 Säulen der Psyche & Tugend',
    pillarsSubheader: 'Geführtes neuro-psychologisches Training: Realistische Wahrnehmung, Grenzen, Stressbewältigung, emotionale Intelligenz, Mantras, Schlaf, Altruismus und positive Psychologie.',
    pillarFilterAll: 'Alle 18 Säulen',
    pillarFilterMind: 'Geist & Achtsamkeit',
    pillarFilterStress: 'Emotionen, Stress & Schlaf',
    pillarFilterIdentity: 'Identität & Selbstwert',
    pillarFilterSocial: 'Beziehungen & Altruismus',
    startPillarExercise: 'Praktische Übung starten',
    pillarIntegratedSuccess: 'Säule erfolgreich integriert!',
    pillarMantraLabel: 'Tägliches Integrations-Mantra',
    pillarActionCommitment: 'Praktische Verpflichtung für Heute',
    repeatExercise: 'Übung wiederholen',
    backToAllPillars: 'Zurück zu allen Säulen',

    // Languages
    languageSelectTitle: 'Wählen Sie Ihre Sprache',
    languageAutoDetected: 'Automatisch nach Land / Browser erkannt',
    languageConfirm: 'Sprache anwenden',

    // Common
    completed: 'Abgeschlossen',
    inProgress: 'In Bearbeitung',
    xpGrowth: 'XP Zuwachs',
    level: 'Stufe',
    score: 'Punktzahl',
    highScore: 'Persönliche Bestleistung',
    back: 'Zurück',
    continue: 'Weiter',
    close: 'Schließen',
  },
  pt: {
    // Header & Navigation
    appName: 'Luancer',
    tagline: 'Neuro-Ginásio Cognitivo e de Caráter',
    tabToday: 'Hoje',
    tabGames: 'Jogos',
    tabCharacter: 'Caráter',
    tabCoach: 'Treinador IA',
    tabAnalytics: 'Relatórios',
    binauralTooltip: 'Ondas Cerebrais Binaurais Luancer',
    soundMuteTooltip: 'Silenciar Sons',
    soundUnmuteTooltip: 'Reativar Sons',
    watchTooltip: 'Conectar Smartwatch / Apple Watch',
    languageTooltip: 'Mudar Idioma',

    // Smartwatch Hub
    watchHeader: 'Apple Watch e Smartwatch',
    watchSubheader: 'Sincronização de biometria, frequência cardíaca e jogos no pulso',
    watchConnected: 'Conectado',
    watchDisconnected: 'Desconectado',
    watchPairDevice: 'Emparelhar Apple Watch / WearOS',
    watchConnecting: 'Procurando e sincronizando wearable...',
    watchDisconnect: 'Desconectar Dispositivo',
    watchHeartRate: 'Frequência Cardíaca',
    watchHRV: 'Variabilidade VFC',
    watchStress: 'Nível de Estresse',
    watchSteps: 'Passos Hoje',
    watchPlayOnWrist: 'Jogar Diretamente no Apple Watch',
    watchWristSimulation: 'Simulador de Pulso WatchOS / WearOS',
    watchLaunchMicroGame: 'Iniciar Micro-Jogo no Pulso',
    watchHapticActive: 'Motor Háptico Ativo',
    watchSelectGame: 'Selecionar Micro-Jogo para Smartwatch',
    watchSyncXP: 'XP Sincronizados com o Perfil',
    watchCrownRotate: 'Girar Coroa Digital',
    watchStandaloneUrl: 'Abrir Versão Independente para Relógio',
    watchCopyLink: 'Copiar Link Independente',
    watchLinkCopied: 'Link copiado para Apple Watch!',
    watchClose: 'Fechar',

    // Micro Games on Watch
    watchGameStroopTitle: 'Stroop Reflex Micro',
    watchGameStroopDesc: 'Reconhecimento de cor-palavra no pulso',
    watchGameNbackTitle: 'Micro Dual N-Back',
    watchGameNbackDesc: 'Memória de trabalho espacial em 4 quadrantes',
    watchGameBreatheTitle: 'Coerência Cardíaca e Pulso',
    watchGameBreatheDesc: 'Respiração guiada sincronizada com pulsos hápticos',
    watchGameMathTitle: 'Cálculo Relâmpago Watch',
    watchGameMathDesc: 'Contas mentais rápidas no mostrador',
    watchGameMantraTitle: 'Mantra e Check-in no Pulso',
    watchGameMantraDesc: 'Ancoragem diária e mantra de força no relógio',

    // Daily Workout
    workoutTitle: 'Treino Cognitivo Diário',
    workoutStreak: 'dias seguidos',
    startWorkout: 'Iniciar Sessão de Hoje',
    dailyGCI: 'Índice GCI',
    quickSummary: 'Resumo Neuro-Funcional',
    pillarsQuickCardTitle: '18 Pilares da Psique',
    pillarsQuickCardSub: 'Limites, estresse, sono e virtudes humanas',

    // Character Gym & 18 Pillars
    pillarsHeader: 'Os 18 Pilares da Psique e da Virtude',
    pillarsSubheader: 'Treinamento neuro-psicológico guiado: percepção realista, limites saudáveis, gestão do estresse, inteligência emocional, mantras, sono, altruísmo e psicologia positiva.',
    pillarFilterAll: 'Todos os 18 Pilares',
    pillarFilterMind: 'Mente e Consciência',
    pillarFilterStress: 'Emoções, Estresse e Sono',
    pillarFilterIdentity: 'Identidade e Autoestima',
    pillarFilterSocial: 'Relações e Altruísmo',
    startPillarExercise: 'Iniciar Exercício Prático',
    pillarIntegratedSuccess: 'Pilar Integrado com Sucesso!',
    pillarMantraLabel: 'Mantra de Integração Diária',
    pillarActionCommitment: 'Compromisso Prático para Hoje',
    repeatExercise: 'Repetir Exercício',
    backToAllPillars: 'Voltar a Todos os Pilares',

    // Languages
    languageSelectTitle: 'Selecione o seu Idioma',
    languageAutoDetected: 'Idioma detectado por País / Navegador',
    languageConfirm: 'Aplicar Idioma',

    // Common
    completed: 'Concluído',
    inProgress: 'Em andamento',
    xpGrowth: 'XP Crescimento',
    level: 'Nível',
    score: 'Pontuação',
    highScore: 'Recorde Pessoal',
    back: 'Voltar',
    continue: 'Continuar',
    close: 'Fechar',
  },
};

const LANGUAGE_STORAGE_KEY = 'luancer_user_language_v1';

export function detectUserLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (saved && ['it', 'en', 'es', 'fr', 'de', 'pt'].includes(saved)) {
      return saved;
    }
    
    // Detect from browser navigator.language / country
    const browserLang = (navigator.language || (navigator as any).userLanguage || 'it').toLowerCase();
    
    if (browserLang.startsWith('it')) return 'it';
    if (browserLang.startsWith('en')) return 'en';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('de')) return 'de';
    if (browserLang.startsWith('pt')) return 'pt';
    
    // Default to Italian
    return 'it';
  } catch {
    return 'it';
  }
}

export function saveUserLanguage(lang: Language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {}
}
