import { RealLifeChallenge } from '../types';

export const DAILY_REAL_LIFE_CHALLENGES: RealLifeChallenge[] = [
  // 1. Altruismo, Empatia & Gentilezza Proattiva
  {
    id: 'ch-sincere-compliment',
    title: 'Fai un Complimento Sincero e Inaspettato',
    category: 'altruism',
    description: 'Esprimi a una persona (un collega, un familiare, un collaboratore o un barista) un complimento genuino e specifico sul suo impegno, atteggiamento o carattere.',
    actionGuide: 'Evita complimenti generici o superficiali. Focalizzati su un dettaglio comportamentale autentico (es: "Ho ammirato davvero la calma e la cura con cui hai gestito quel problema stamattina").',
    difficulty: 'Facile',
    xpReward: 130,
    neuroBenefit: 'Attivazione del circuito della ricompensa mesolimbico e rilascio reciproco di ossitocina, riducendo le difese sociali.',
    traitBonus: { positivity: 5, communication: 4, selfEsteem: 3 },
    reflectionPrompt: 'A chi hai rivolto il complimento e quale reazione emotiva hai osservato?',
  },
  {
    id: 'ch-spontaneous-gratitude',
    title: 'Messaggio di Gratitudine Improvviso',
    category: 'altruism',
    description: 'Invia un messaggio o scrivi due righe a qualcuno che in passato ti ha aiutato o ispirato, spiegandogli l\'impatto concreto e duraturo che ha avuto su di te.',
    actionGuide: 'Non aspettare un compleanno o una ricorrenza. La gratitudine spontanea senza secondi fini ha un potere trasformativo per entrambe le menti.',
    difficulty: 'Facile',
    xpReward: 140,
    neuroBenefit: 'Rinforzo della corteccia prefrontale ventromediale e induzione di stati affettivi positivi duraturi.',
    traitBonus: { positivity: 6, emotionalMastery: 4, wisdom: 3 },
    reflectionPrompt: 'Come ti sei sentito dopo aver inviato il messaggio?',
  },
  {
    id: 'ch-invisible-kindness',
    title: 'Atto di Gentilezza Invisibile',
    category: 'altruism',
    description: 'Compi un\'azione di valore per qualcuno o per la comunità (es: sistema uno spazio comune, paga un caffè sospeso, raccogli rifiuti abbandonati, cedi il posto con un sorriso) senza farlo sapere a nessuno.',
    actionGuide: 'L\'essenza dell\'altruismo stoico: fare il bene per la sua intrinseca bontà, liberando la mente dal bisogno di validazione o applausi.',
    difficulty: 'Medio',
    xpReward: 150,
    neuroBenefit: 'Disattivazione della Default Mode Network associata all\'ego e aumento del benessere eudaimonico.',
    traitBonus: { positivity: 7, temperance: 5, wisdom: 4 },
    reflectionPrompt: 'Quale gesto invisibile hai compiuto oggi?',
  },
  {
    id: 'ch-pure-listening',
    title: 'Ascolto Empatico Puro (5 Minuti)',
    category: 'altruism',
    description: 'In una conversazione, ascolta l\'altra persona per almeno 5 minuti senza mai interrompere, senza controllare lo smartphone e senza offrire consigli non richiesti.',
    actionGuide: 'Offri la tua presenza totale: mantieni il contatto visivo, annuisci e chiedi semplicemente: "Cosa hai provato in quel momento?".',
    difficulty: 'Medio',
    xpReward: 140,
    neuroBenefit: 'Sincronizzazione dei neuroni specchio e rafforzamento della teoria della mente.',
    traitBonus: { communication: 6, temperance: 4, emotionalMastery: 4 },
    reflectionPrompt: 'Cosa hai notato nell\'altra persona quando ha percepito il tuo ascolto completo?',
  },
  {
    id: 'ch-active-help',
    title: 'Offri Aiuto Concreto Prima che Venga Chiesto',
    category: 'altruism',
    description: 'Individua una persona in difficoltà o sovraccarica (in casa o al lavoro) e intervieni per sollevarla da un compito pratico.',
    actionGuide: 'Non chiedere "Ti serve una mano?" (la risposta per orgoglio è spesso "no"). Agisci direttamente: "Occupati di quello, intanto penso io a questa parte".',
    difficulty: 'Medio',
    xpReward: 150,
    neuroBenefit: 'Innesco del "Helper\'s High" mediato da endorfine e dopamina endogena.',
    traitBonus: { positivity: 5, courage: 4, resilience: 3 },
    reflectionPrompt: 'In quale occasione hai prestato supporto pratico?',
  },

  // 2. Gestione dello Stress, Tono Vagale & Calma Biologica
  {
    id: 'ch-physiological-sigh',
    title: 'Protocollo "Sospiro Fisiologico" sotto Tensione',
    category: 'stress_relief',
    description: 'Durante la giornata, quando avverti un picco di pressione, urgenza o frustrazione, esegui 3 cicli di doppio inspiro nasale seguito da una lenta e completa espirazione a labbra socchiuse.',
    actionGuide: 'Inspira profondamente dal naso, aggiungi un piccolo colpo di inspiro extra per riaprire gli alveoli, poi rilascia l\'aria lentamente per 6-8 secondi svuotando i polmoni.',
    difficulty: 'Facile',
    xpReward: 120,
    neuroBenefit: 'Rapido riallineamento del nodo seno-atriale tramite il nervo vago, con abbassamento istantaneo della frequenza cardiaca.',
    traitBonus: { emotionalMastery: 6, temperance: 4, resilience: 3 },
    reflectionPrompt: 'In quale situazione stressante hai applicato il sospiro fisiologico?',
  },
  {
    id: 'ch-sensory-walk-decompression',
    title: 'Passeggiata di Decompressione Sensoriale (15 Minuti)',
    category: 'stress_relief',
    description: 'Cammina all\'aperto per 15 minuti senza smartphone, senza podcast o musica nelle cuffie, focalizzandoti solo sulla vista panoramica e sui suoni circostanti.',
    actionGuide: 'Allarga la visione periferica (visione ottica panoramica): questo stato visivo inibisce direttamente i centri di allarme dell\'amigdala.',
    difficulty: 'Facile',
    xpReward: 130,
    neuroBenefit: 'Stimolazione del flusso ottico che riduce l\'attività dell\'amigdala e abbatte il cortisolo sierico.',
    traitBonus: { emotionalMastery: 5, wisdom: 4, temperance: 4 },
    reflectionPrompt: 'Cosa hai notato nell\'ambiente circostante durante la camminata?',
  },
  {
    id: 'ch-cold-water-face-plunge',
    title: 'Reset Vago-Frenico con Acqua Fredda',
    category: 'stress_relief',
    description: 'Riempi il lavandino con acqua fredda (o bagna un asciugamano ghiacciato) e immergi o applica l\'acqua su fronte, occhi e tempie per 20-30 secondi trattenendo il respiro.',
    actionGuide: 'Rilassa la muscolatura facciale. Questo attiva il "Riflesso d\'Immersione dei Mammiferi", inducendo una bradicardia calmante istantanea.',
    difficulty: 'Medio',
    xpReward: 135,
    neuroBenefit: 'Attivazione immediata del sistema parasimpatico tramite i rami oftalmici del nervo trigemino.',
    traitBonus: { resilience: 6, emotionalMastery: 5, temperance: 3 },
    reflectionPrompt: 'Quale sensazione fisica hai provato subito dopo il reset con acqua fredda?',
  },
  {
    id: 'ch-digital-fast-dinner',
    title: 'Pasto in Piena Presenza (Zero Display)',
    category: 'stress_relief',
    description: 'Consuma il pranzo o la cena senza guardare smartphone, notifiche, video o tv, focalizzandoti sul gusto, sulla consistenza e sul ritmo di masticazione.',
    actionGuide: 'Mastica lentamente, appoggia le posate tra un boccone e l\'altro e concediti di ascoltare i segnali corporei di sazietà.',
    difficulty: 'Facile',
    xpReward: 125,
    neuroBenefit: 'Ottimizzazione dell\'asse intestino-cervello e riduzione dell\'iper-stimolazione da dopamina a basso costo.',
    traitBonus: { temperance: 6, emotionalMastery: 4, wisdom: 3 },
    reflectionPrompt: 'Come è cambiata l\'esperienza del pasto senza l\'anestesia dello schermo?',
  },
  {
    id: 'ch-pause-three-seconds',
    title: 'La Pausa Sacra dei 3 Secondi',
    category: 'stress_relief',
    description: 'Davanti a una provocazione, una notizia allarmante o una richiesta pressante, imponiti 3 secondi di silenzio totale prima di qualsiasi reazione verbale o digitale.',
    actionGuide: 'Tra lo stimolo e la risposta esiste lo spazio della tua libertà. Usa questi 3 secondi per chiedere: "Come agirebbe la mia versione migliore?".',
    difficulty: 'Medio',
    xpReward: 140,
    neuroBenefit: 'Inibizione dell\'innesco amigdaloideo a favore dell\'elaborazione prefrontale deliberata.',
    traitBonus: { temperance: 6, wisdom: 5, emotionalMastery: 5 },
    reflectionPrompt: 'Quale reazione impulsiva sei riuscito a disinnescare grazie alla pausa?',
  },

  // 3. Disciplina, Coraggio & Presenza nella Vita Quotidiana
  {
    id: 'ch-cold-shower',
    title: 'Doccia Fredda di 45 Secondi',
    category: 'discipline',
    description: 'Termina la doccia quotidiana con 45 secondi di acqua completamente fredda controllando il respiro con espirazioni lente.',
    actionGuide: 'Non iperventilare: abbassa le spalle e respira profondamente per abituare il sistema nervoso alla calma sotto shock termico.',
    difficulty: 'Medio',
    xpReward: 140,
    neuroBenefit: 'Aumento prolungato della dopamina (+250%) e potenziamento della resilienza noradrenergica.',
    traitBonus: { resilience: 7, temperance: 5, courage: 4 },
  },
  {
    id: 'ch-digital-fast-morning',
    title: 'Zero Schermi la Prima Ora del Mattino',
    category: 'discipline',
    description: 'Non toccare smartphone, social o email per i primi 60 minuti dal risveglio, proteggendo la tua attenzione.',
    actionGuide: 'Bevi acqua, apri le finestre alla luce naturale, fai stretching o leggi pagine fisiche prima di inondarti di notifiche.',
    difficulty: 'Sfidante',
    xpReward: 160,
    neuroBenefit: 'Prevenzione dei picchi precoci di cortisolo e preservazione dell\'attenzione endogena.',
    traitBonus: { temperance: 7, wisdom: 5, resilience: 4 },
  },
  {
    id: 'ch-candid-truth',
    title: 'La Conversazione Rimandata',
    category: 'courage',
    description: 'Affronta una conversazione onesta e chiarificatrice che stai rimandando per timore del disagio o del conflitto.',
    actionGuide: 'Parla con fermezza e gentilezza, esponendo i tuoi bisogni e i fatti oggettivi senza toni accusatori.',
    difficulty: 'Sfidante',
    xpReward: 180,
    neuroBenefit: 'Superamento dell\'ansia anticipatoria attraverso l\'esposizione controllata.',
    traitBonus: { courage: 8, communication: 6, emotionalMastery: 5 },
  },
  {
    id: 'ch-say-no-politely',
    title: 'Un "NO" Sereno a una Richiesta Inopportuna',
    category: 'courage',
    description: 'Rifiuta con cortesia e fermezza un impegno non allineato con le tue priorità a cui avresti detto sì solo per compiacenza.',
    actionGuide: 'Formula una risposta breve, limpida e senza giustificazioni eccessive: "Grazie per aver pensato a me, ma attualmente non posso prendermi questo impegno".',
    difficulty: 'Medio',
    xpReward: 140,
    neuroBenefit: 'Rafforzamento dell\'autoefficacia e dei confini personali sani.',
    traitBonus: { courage: 6, temperance: 5, selfEsteem: 5 },
  },
];

/**
 * Retrieves the featured Daily Challenge based on the day of the year / date string.
 * Ensures an alternating rotation between Altruism and Stress Relief / Discipline.
 */
export function getTodayFeaturedChallenge(dateStr?: string, customIndexOffset: number = 0): RealLifeChallenge {
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  // Calculate day of year
  const start = new Date(targetDate.getFullYear(), 0, 0);
  const diff = (targetDate.getTime() - start.getTime()) + ((start.getTimezoneOffset() - targetDate.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // We rotate through the whole catalog
  const safeIndex = (dayOfYear + customIndexOffset) % DAILY_REAL_LIFE_CHALLENGES.length;
  const normalizedIndex = (safeIndex + DAILY_REAL_LIFE_CHALLENGES.length) % DAILY_REAL_LIFE_CHALLENGES.length;
  return DAILY_REAL_LIFE_CHALLENGES[normalizedIndex];
}
