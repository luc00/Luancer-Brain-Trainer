import { PsychologyPillar } from '../types';

export const PSYCHOLOGY_PILLARS_DATA: PsychologyPillar[] = [
  // 1. Percezione Realistica
  {
    id: 'realistic-perception',
    title: 'Percezione Realistica & Accettazione di Sé',
    shortDefinition: 'Avere una visione chiara e oggettiva della realtà e di sé stessi, accettando pregi e difetti senza distorsioni.',
    category: 'mindset-awareness',
    categoryLabel: 'Mente & Consapevolezza',
    iconName: 'Eye',
    badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
    themeColor: '#1E4332',
    neuroscientificCore: 'Attivazione della Corteccia Prefrontale Dorsolaterale (DLPFC) per disinnescare i filtri emotivi dell\'amigdala e neutralizzare i bias di conferma.',
    practicalBenefit: 'Elimina l\'ansia da perfezionismo e l\'autocommiserazione, ancorando le decisioni su dati di fatto inconfutabili.',
    keyTakeaways: [
      'Accettare la realtà com\'è non significa rassegnarsi, ma è il prerequisito per cambiarla.',
      'Riconoscere i propri limiti ti protegge dall\'errore di giudizio e ti permette di valorizzare i tuoi veri punti di forza.',
      'Le distorsioni cognitive (tutto o niente, catastrofizzazione) si dissolvono quando separi le interpretazioni emotive dai fatti tangibili.'
    ],
    exercise: {
      name: 'Test di Realtà & Mappatura dei Pregi e Difetti',
      instructions: 'Esamina una situazione critica o un giudizio su te stesso, separando le etichette emotive dai fatti oggettivi verificabili.',
      steps: [
        {
          stepNumber: 1,
          title: 'Scansione della Distorsione Cognitiva',
          description: 'Quale tendenza percettiva ti capita più spesso di adottare sotto pressione?',
          interactiveType: 'selection',
          options: [
            { id: 'all-none', label: 'Pensiero Bianco/Nero (Se non è perfetto, è un fallimento)', explanation: 'Tende a ignorare le sfumature intermedie e i progressi reali.', score: 85 },
            { id: 'catastrophizing', label: 'Catastrofizzazione (Anticipare il peggior scenario possibile)', explanation: 'Attiva inutilmente l\'amigdala su eventi improbabili.', score: 90 },
            { id: 'mind-reading', label: 'Lettura del pensiero altrui (Dare per scontato il giudizio negativo degli altri)', explanation: 'Proietta insicurezze interne sull\'ambiente esterno.', score: 90 },
            { id: 'discounting-positive', label: 'Svalutazione del positivo (Minimizzare i propri successi)', explanation: 'Attribuisce i successi solo al caso anziché alla competenza.', score: 85 },
          ]
        },
        {
          stepNumber: 2,
          title: 'Bilanciamento Oggettivo di Pregi e Limiti',
          description: 'Indica il tuo livello di serenità e trasparenza nell\'ammettere apertamente a te stesso sia i tuoi talenti che i tuoi punti deboli.',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Livello di Accettazione Radicale (1 = Negazione/Fuga, 10 = Totale Lucidità e Pace)'
        },
        {
          stepNumber: 3,
          title: 'Riflessione & Reality Check',
          description: 'Identifica una credenza su di te o su una situazione recente e riformulala solo sulla base di fatti misurabili.',
          interactiveType: 'reflection',
          placeholder: 'Esempio: Pensavo "Non sono capace di parlare in pubblico", ma i fatti oggettivi dicono: "Ho fatto una presentazione con 2 momenti di esitazione e risposte corrette alle domande"...',
          suggestedItems: [
            'Distingui sempre: "Ciò che è accaduto" vs "La storia drammatica che la mente si è raccontata".',
            'I difetti non definiscono la tua identità, sono semplicemente aree su cui allocare risorse o chiedere supporto.'
          ]
        }
      ],
      practicalCommitment: 'Oggi, ogni volta che percepisci una forte reazione emotiva, fermati 10 secondi e chiediti: "Cosa c\'è di oggettivamente vero in questa scena e cosa è solo una mia supposizione?".',
      mantraOrTakeaway: 'Vedo le cose esattamente come sono, né peggiori né migliori. Conosco le mie forze e abbraccio i miei limiti con serenità.'
    }
  },

  // 2. Confini Sani
  {
    id: 'healthy-boundaries',
    title: 'Confini Sani & Rispetto dello Spazio Personale',
    shortDefinition: 'Saper stabilire limiti personali chiari, proteggendo il proprio tempo e la propria energia e rispettando lo spazio altrui.',
    category: 'social-relationships',
    categoryLabel: 'Relazioni & Altruismo',
    iconName: 'ShieldCheck',
    badgeColor: 'bg-[#FBECEF] text-[#7F3847]',
    themeColor: '#7F3847',
    neuroscientificCore: 'Attivazione del circuito dell\'insula anteriore per percepire i segnali enterocettivi di violazione dello spazio e assertività prefrontale.',
    practicalBenefit: 'Previene il burnout relazionale, azzera il risentimento e aumenta la qualità del rispetto reciproco nei rapporti interpersonali.',
    keyTakeaways: [
      'Un confine chiaro non è una punizione per l\'altro, è un manuale di istruzioni su come amarti e rispettarti.',
      'Dire "Sì" a qualcun altro quando dentro senti "No" equivale a tradire te stesso.',
      'I confini sani proteggono la relazione: senza confini si genera rancore silenzioso e frustrazione accumulata.'
    ],
    exercise: {
      name: 'Simulatore di Assertività & Tracciamento Confini',
      instructions: 'Affronta uno scenario di invasione del tuo spazio e scegli la risposta che preserva la tua integrità con eleganza e fermezza.',
      steps: [
        {
          stepNumber: 1,
          title: 'Scenario: Richiesta Invasiva dell\'Ultimo Minuto',
          description: 'Un collega o conoscente ti chiede di svolgere un compito pesante fuori orario per colpa della sua disorganizzazione, facendoti sentire in colpa.',
          interactiveType: 'scenario',
          options: [
            { id: 'submissive', label: 'Accetti subito scusandoti per non poter fare di più (Passivo/Compiacente)', explanation: 'Compromette la tua serata e alimenta la dipendenza della persona da te.', score: 30 },
            { id: 'aggressive', label: 'Ti arrabbi e lo aggredisci verbalmente per la sua disorganizzazione (Reattivo)', explanation: 'Danneggia la relazione e distoglie l\'attenzione dal confine reale.', score: 50 },
            { id: 'assertive-clear', label: 'Rifiuti con calma e chiarezza: "Capisco l\'urgenza, ma stasera non sono disponibile. Possiamo vederlo domani mattina alle 9." (Assertivo)', explanation: 'Imposta il confine con fermezza, dignità e rispetto reciproco.', score: 100 },
          ]
        },
        {
          stepNumber: 2,
          title: 'Verifica del Tuo Perimetro Personale',
          description: 'In quale area della tua vita senti che i tuoi confini sono più permeabili o violati?',
          interactiveType: 'selection',
          options: [
            { id: 'time', label: 'Tempo & Disponibilità (Dire di no a impegni superflui)', explanation: 'Necessita di proteggere blocchi di tempo non negoziabili.', score: 90 },
            { id: 'emotional', label: 'Energia Emotiva (Farsi carico del malumore altrui)', explanation: 'Necessita di differenziazione tra empatia ed assorbimento tossico.', score: 90 },
            { id: 'work', label: 'Lavoro vs Vita Privata (Reperibilità costante)', explanation: 'Necessita di regole digitali chiare (spegnimento notifiche serali).', score: 90 },
            { id: 'opinions', label: 'Spazio Decisionale (Lasciarsi influenzare dai consigli non richiesti)', explanation: 'Necessita di riaffermare la propria autonomia di scelta.', score: 85 }
          ]
        },
        {
          stepNumber: 3,
          title: 'Dichiarazione di Confine Non-Negoziabile',
          description: 'Scrivi un "NO" elegante ma irremovibile per una situazione che stai tollerando a tuo discapito.',
          interactiveType: 'reflection',
          placeholder: 'Esempio: "Ti ringrazio per aver pensato a me, ma attualmente ho già pianificato le mie priorità e devo declinare con serenità."',
          suggestedItems: [
            'Non servono giustificazioni eccessive: "No" è una frase completa.',
            'Mantieni un tono calmo, voce ferma e postura eretta.'
          ]
        }
      ],
      practicalCommitment: 'Oggi stabilisci un confine chiaro su una richiesta che non risuona con le tue priorità, senza scuse prolungate o sensi di colpa.',
      mantraOrTakeaway: 'I miei confini sono sacri. Dico NO con grazia e SÌ con totale integrità.'
    }
  },

  // 3. Gestione dello Stress
  {
    id: 'stress-management',
    title: 'Gestione dello Stress & Solitudine Rigenerante',
    shortDefinition: 'Saper mantenere la calma e trovare momenti di distacco o solitudine fertile e ricarica senza avvilirsi.',
    category: 'emotion-stress-sleep',
    categoryLabel: 'Emozioni & Stress',
    iconName: 'HeartPulse',
    badgeColor: 'bg-[#E5F2EC] text-[#24523C]',
    themeColor: '#24523C',
    neuroscientificCore: 'Stimolazione del Tono Vagale Ventrale e down-regulation dell\'Asse Ipotalamo-Ipofisi-Surrene (HPA) con riduzione del cortisolo ematico.',
    practicalBenefit: 'Trasforma la tensione acuta in energia focalizzata e trasforma la solitudine da vuoto a sorgente di chiarezza interiore.',
    keyTakeaways: [
      'La solitudine non è isolamento: è il santuario in cui la mente riordina le memorie e ricarica le riserve attentive.',
      'Lo stress fisiologico si azzera attraverso il corpo prima che attraverso i pensieri razionali.',
      'Saper staccare senza sensi di colpa è la condizione fondamentale per un\'alta efficacia a lungo termine.'
    ],
    exercise: {
      name: 'Protocollo di Decompressione & Ricarica Solitaria',
      instructions: 'Applica la tecnica del sospiro fisiologico e dell\'ancoraggio corporeo per interrompere il loop di iper-arousal.',
      steps: [
        {
          stepNumber: 1,
          title: 'Sospiro Fisiologico a Doppia Inspirazione',
          description: 'Esegui 3 cicli: Due inspirazioni nasali rapide consecutive seguite da una lunga e lenta espirazione a bocca aperta.',
          interactiveType: 'timer-breath',
          placeholder: 'Respira profondamente... Espira lentamente rilasciando le spalle.'
        },
        {
          stepNumber: 2,
          title: 'Distacco Fertile vs Isolamento Passivo',
          description: 'Qual è il tuo modo preferito per godere di 15-20 minuti di solitudine rigenerante senza schermi?',
          interactiveType: 'selection',
          options: [
            { id: 'walk', label: 'Camminata silenziosa nella natura o all\'aperto senza cuffie', explanation: 'Attiva il flusso ottico laterale riducendo l\'ansia.', score: 95 },
            { id: 'silence', label: 'Siediti in silenzio con tè/tisana osservando il respiro', explanation: 'Ristabilisce la coerenza del Default Mode Network.', score: 90 },
            { id: 'journal', label: 'Scrittura libera di sfogo su carta per svuotare il buffer cognitivo', explanation: 'Esternalizza i pensieri circolari riducendo il carico di lavoro della memoria.', score: 95 },
            { id: 'stretch', label: 'Stretching profondo o rilascio miofasciale del collo e mandibola', explanation: 'Scioglie i blocchi somatomotori di stress accumulato.', score: 90 }
          ]
        },
        {
          stepNumber: 3,
          title: 'Valutazione della Tensione Somatica',
          description: 'Registra il livello di rilascio muscolare e centratura dopo il protocollo.',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Sensazione di Calma e Presenza (1 = Tensione elevata, 10 = Spazio e Calma Profonda)'
        }
      ],
      practicalCommitment: 'Oggi ritagliati uno spazio sacro di 15 minuti di solitudine rigenerante assoluta: niente telefono, niente notifiche, solo presenza pura.',
      mantraOrTakeaway: 'Nel silenzio e nella quiete ritrovo il mio centro. Nessuna tempesta esterna può turbare la mia calma interiore.'
    }
  },

  // 4. Consapevolezza (Intelligenza Emotiva & Empatia)
  {
    id: 'awareness-empathy',
    title: 'Consapevolezza & Intelligenza Emotiva',
    shortDefinition: 'Sviluppare intelligenza emotiva profonda ed empatia genuina verso il prossimo senza perdere se stessi.',
    category: 'mindset-awareness',
    categoryLabel: 'Mente & Consapevolezza',
    iconName: 'Sparkles',
    badgeColor: 'bg-[#F2EEF8] text-[#4D3B6A]',
    themeColor: '#4D3B6A',
    neuroscientificCore: 'Sincronizzazione dei Neuroni a Specchio premotori e attivazione della Giunzione Temporo-Parietale (TPJ) per la teoria della mente.',
    practicalBenefit: 'Permette di leggere oltre le parole, comprendere i bisogni profondi altrui e costruire ponti di fiducia indistruttibili.',
    keyTakeaways: [
      'Empatia non significa essere d\'accordo su tutto, ma comprendere lo stato emotivo dell\'altro prima di giudicarlo.',
      'La granularità emotiva (saper dare un nome preciso a ciò che provi) è il primo superpotere di auto-regolazione.',
      'L\'ascolto autentico non è preparare la propria risposta mentre l\'altro parla, ma accogliere l\'altro con attenzione totale.'
    ],
    exercise: {
      name: 'Mappatore di Granularità Emotiva & Decodifica Empatica',
      instructions: 'Identifica la sfumatura esatta dell\'emozione in una situazione complessa e pratica l\'ascolto empatico.',
      steps: [
        {
          stepNumber: 1,
          title: 'Decodifica della Granularità Emotiva',
          description: 'Spesso diciamo "Sono stressato" o "Sono arrabbiato", ma qual è l\'emozione esatta sotto la superficie?',
          interactiveType: 'selection',
          options: [
            { id: 'vulnerable', label: 'Vulnerabilità / Paura di essere giudicato o non riconosciuto', explanation: 'Richiede autocompassione e sicurezza interiore.', score: 95 },
            { id: 'overwhelmed', label: 'Sovraccarico sensoriale / Eccesso di stimoli simultanei', explanation: 'Richiede pause sensoriali e semplificazione delle priorità.', score: 90 },
            { id: 'disappointed', label: 'Delusione da aspettative non comunicate chiaramente', explanation: 'Richiede allineamento trasparente degli accordi.', score: 95 },
            { id: 'lonely', label: 'Bisogno di connessione autentica e comprensione profonda', explanation: 'Richiede espressione sincera dei propri sentimenti.', score: 90 }
          ]
        },
        {
          stepNumber: 2,
          title: 'Simulazione di Risposta Empatica',
          description: 'Un amico o familiare ti esprime frustrazione per una sua difficoltà. Come rispondi con empatia di 2° livello?',
          interactiveType: 'scenario',
          options: [
            { id: 'fix-it', label: '"Dovresti fare così e così, è semplicissimo!" (Fixer / Consigliere non richiesto)', explanation: 'Svaluta l\'esperienza emotiva dell\'altro e impone una soluzione frettolosa.', score: 40 },
            { id: 'minimize', label: '"Dai non è niente, c\'è chi sta peggio nel mondo!" (Invalidazione emotiva)', explanation: 'Aumenta il senso di solitudine e chiusura della persona.', score: 20 },
            { id: 'mirror-empathy', label: '"Vedo quanto questa situazione sia faticosa per te. Sono qui per ascoltarti: dimmi di più." (Accoglienza pura)', explanation: 'Crea uno spazio sicuro che permette all\'altro di elaborare e sentirsi accolto.', score: 100 }
          ]
        },
        {
          stepNumber: 3,
          title: 'Intenzione di Ascolto Consapevole',
          description: 'Quale persona nella tua cerchia beneficerà oggi di una conversazione in cui ascolterai senza interrompere?',
          interactiveType: 'reflection',
          placeholder: 'Scrivi il nome della persona e l\'attenzione che intendi dedicarle...',
          suggestedItems: [
            'Fai domande aperte che partano con "Come ti senti riguardo a..." o "Cosa ti è stato più difficile in questo?".',
            'Sospendi il bisogno di dare ragione o torto.'
          ]
        }
      ],
      practicalCommitment: 'Oggi dedica ad almeno una persona 5 minuti di ascolto totale, con lo sguardo negli occhi e senza toccare lo smartphone.',
      mantraOrTakeaway: 'Ascolto con il cuore e vedo con chiarezza. L\'empatia è il ponte che trasforma le relazioni in legami autentici.'
    }
  },

  // 5. Confidenza con Se Stessi
  {
    id: 'self-confidence',
    title: 'Confidenza con Se Stessi & Auto-Efficacia',
    shortDefinition: 'Sviluppare auto-efficacia radicata, sicurezza interiore e fiducia autentica nelle proprie capacità di superare gli ostacoli.',
    category: 'identity-confidence',
    categoryLabel: 'Identità & Autostima',
    iconName: 'Flame',
    badgeColor: 'bg-[#FBF2E3] text-[#8C5D19]',
    themeColor: '#8C5D19',
    neuroscientificCore: 'Rinforzo del circuito della dopamina striatale mediante l\'archiviazione di micro-vittorie e consolidamento dell\'auto-efficacia di Bandura.',
    practicalBenefit: 'Cancella la paralisi da insicurezza, sconfigge la sindrome dell\'impostore e permette di agire anche in presenza di incertezza.',
    keyTakeaways: [
      'La vera fiducia non è la certezza che tutto andrà bene: è la convinzione che saprai cavartela qualunque cosa accada.',
      'La confidenza non precede l\'azione, ne è il risultato: agisci prima e la sicurezza seguirà.',
      'L\'auto-efficacia si costruisce su una banca di prove reali, mantenendo le promesse che fai a te stesso.'
    ],
    exercise: {
      name: 'Archivio delle Prove di Auto-Efficacia & Azione Coraggiosa',
      instructions: 'Estrai le prove storiche della tua capacità di superare sfide complesse e definisci un\'azione coraggiosa immediata.',
      steps: [
        {
          stepNumber: 1,
          title: 'Richiamo di una Vittoria Complessa del Passato',
          description: 'Pensa a un momento difficile della tua vita che all\'inizio sembrava insormontabile ma che sei riuscito ad attraversare con dignità e successo.',
          interactiveType: 'reflection',
          placeholder: 'Descrivi la sfida, le risorse che hai mobilitato e come ne sei uscito più forte...',
          suggestedItems: [
            'Riconosci la tua tenacia, la tua creatività e la capacità di adattamento dimostrata.',
            'Se ci sei riuscito allora, hai già nel tuo DNA le risorse per la sfida odierna.'
          ]
        },
        {
          stepNumber: 2,
          title: 'Dichiarazione della Micro-Promessa Personale',
          description: 'Quale impegno preciso prendi oggi verso te stesso che manterrai al 100% per rafforzare la tua auto-stima operativa?',
          interactiveType: 'action-commit',
          options: [
            { id: 'difficult-task', label: 'Completare l\'attività che sto rimandando da giorni come prima cosa', explanation: 'Rilascia un massiccio burst di dopamina ed efficacia.', score: 100 },
            { id: 'posture', label: 'Mantenere una postura aperta ed eretta e voce chiara per l\'intera giornata', explanation: 'Invia segnali propriocettivi di sicurezza al tronco encefalico.', score: 90 },
            { id: 'speak-up', label: 'Esprimere la mia opinione in una riunione o conversazione senza esitare', explanation: 'Disinnesca la paura dell\'esposizione sociale.', score: 95 }
          ]
        },
        {
          stepNumber: 3,
          title: 'Scala di Solidità Interiore',
          description: 'Valuta la tua fiducia nel fronteggiare gli imprevisti di questa settimana.',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Livello di Fiducia nelle Tue Risorse (1 = Dubbioso, 10 = Incrollabilmente Fiducioso)'
        }
      ],
      practicalCommitment: 'Oggi compi una singola azione che ti intimidisce leggermente entro i primi 5 minuti in cui ci pensi, senza permettere alla mente di negoziare.',
      mantraOrTakeaway: 'Ho superato ogni giorno difficile della mia vita fino ad oggi. Mi fido delle mie capacità e delle mie risorse.'
    }
  },

  // 6. Umiltà
  {
    id: 'humility',
    title: 'Umiltà Intellettuale & Disinnesco dell\'Ego',
    shortDefinition: 'Riconoscere i propri limiti, apertura ad imparare da chiunque e dagli errori, senza difese dell\'ego.',
    category: 'mindset-awareness',
    categoryLabel: 'Mente & Consapevolezza',
    iconName: 'Compass',
    badgeColor: 'bg-[#E8F0F7] text-[#2C4960]',
    themeColor: '#2C4960',
    neuroscientificCore: 'Inibizione delle risposte di minaccia sociale dell\'amigdala durante il feedback negativo e potenziamento della flessibilità cognitiva fronto-striatale.',
    practicalBenefit: 'Rende l\'apprendimento 10 volte più rapido, elimina la suscettibilità alle critiche e rende autenticamente autorevoli senza arroganza.',
    keyTakeaways: [
      'L\'umiltà non è pensare meno di sé stessi, è pensare a sé stessi meno spesso.',
      'Chi crede di sapere tutto ha smesso di crescere; chi accoglie di non sapere è allievo dell\'universo.',
      'Ammettere un errore tempestivamente è un segno di suprema forza e intelligenza, non di debolezza.'
    ],
    exercise: {
      name: 'Disinnesco dell\'Ego & Laboratorio di Revisione degli Errori',
      instructions: 'Esamina una situazione in cui hai avuto torto o un feedback critico ricevuto, trasformandolo in trampolino di saggezza.',
      steps: [
        {
          stepNumber: 1,
          title: 'Reazione Istintiva di Fronte al Disaccordo',
          description: 'Cosa accade dentro di te quando qualcuno contesta un\'idea in cui credevi fermamente?',
          interactiveType: 'selection',
          options: [
            { id: 'defensive', label: 'Difesa immediata / Bisogno di dimostrare di avere ragione a tutti i costi', explanation: 'Segno che l\'identità è fusa con l\'opinione personale.', score: 40 },
            { id: 'shut-down', label: 'Chiusura e risentimento muto', explanation: 'Blocca l\'arricchimento e l\'aggiornamento dei propri modelli mentali.', score: 50 },
            { id: 'curious-inquiry', label: 'Curiosità: "Che prospettiva interessante, cosa vede l\'altro che a me sta sfuggendo?"', explanation: 'Massimo livello di umiltà intellettuale e pensiero scientifico.', score: 100 }
          ]
        },
        {
          stepNumber: 2,
          title: 'L\'Esercizio del "Non So"',
          description: 'Quale argomento complesso ammetti con serenità di non conoscere a fondo e su cui desideri imparare da altri?',
          interactiveType: 'reflection',
          placeholder: 'Esempio: "Riconosco che non conosco a fondo le dinamiche di... e voglio ascoltare chi ha più esperienza senza giudicare."',
          suggestedItems: [
            'Ogni persona che incontri sa qualcosa che tu non sai: trovala e impara da lei.',
            'L\'errore non è una macchia, è solo un dato empirico aggiornato.'
          ]
        },
        {
          stepNumber: 3,
          title: 'Verifica del Rasoio dell\'Umiltà',
          description: 'Quanto ti senti libero dal bisogno di impressionare gli altri per sentirti valido?',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Libertà dall\'Approvazione e dall\'Ego (1 = Molto condizionato, 10 = Totalmente Libero)'
        }
      ],
      practicalCommitment: 'Oggi in una conversazione dì con naturalezza e sorriso: "Non lo so con certezza, spiegami meglio il tuo punto di vista".',
      mantraOrTakeaway: 'Rimango allievo per tutta la vita. Più imparo, più riconosco la vastità di ciò che posso ancora comprendere.'
    }
  },

  // 7. Mantra & Modo di Pensare
  {
    id: 'mindset-mantra',
    title: 'Mantra & Ristrutturazione del Modo di Pensare',
    shortDefinition: 'Ristrutturazione cognitiva profonda, dialoghi interiori potenzianti e mantra basati su neuroscienze e neuroplasticità.',
    category: 'mindset-awareness',
    categoryLabel: 'Mente & Consapevolezza',
    iconName: 'Brain',
    badgeColor: 'bg-[#F2EEF8] text-[#59427C]',
    themeColor: '#59427C',
    neuroscientificCore: 'Rimodellamento sinaptico hebbiano (neurons that fire together wire together) mediante ripetizione ritmica e priming cognitivo positivo.',
    practicalBenefit: 'Sostituisce il chiacchiericcio mentale autosabotante con frasi di ancoraggio chiare che guidano le decisioni sotto stress.',
    keyTakeaways: [
      'Il tuo cervello crede a ciò che gli ripeti con frequenza e carica emotiva coerente.',
      'Un vero mantra non è una formula magica, ma una direttiva neuro-linguistica per richiamare il tuo stato di picco.',
      'Sostituisci il "Perché capita sempre a me?" con "Cosa posso forgiare e imparare attraverso questa sfida?".'
    ],
    exercise: {
      name: 'Generatore di Mantra Neuro-Potenzianti & Priming Mentale',
      instructions: 'Seleziona o componi il tuo mantra operativo per forgiare il tuo modo di pensare nelle prossime 24 ore.',
      steps: [
        {
          stepNumber: 1,
          title: 'Scelta dell\'Ancoraggio Filosofico & Neuro-Funzionale',
          description: 'Quale principio di mindset desideri imprimere nella tua memoria di lavoro?',
          interactiveType: 'selection',
          options: [
            { id: 'stoic-fire', label: '"L\'ostacolo è la via: ciò che ostacola l\'azione fa progredire l\'azione" (Marco Aurelio)', explanation: 'Riformulazione di ogni problema in carburante per la virtù.', score: 100 },
            { id: 'presence-calm', label: '"Qui e ora ho tutto ciò che serve per governare questo momento presente"', explanation: 'Spegnimento dell\'ansia anticipatoria sul futuro.', score: 95 },
            { id: 'unshakable', label: '"Posso controllare solo i miei sforzi, non l\'esito: agisco con massima eccellenza"', explanation: 'Dicotomia del controllo stoica per la massima pace interiore.', score: 100 },
            { id: 'growth-spark', label: '"Non sono ancora perfetto in questo, ma sto migliorando ad ogni tentativo"', explanation: 'Mindset di crescita (Growth Mindset) di Carol Dweck.', score: 95 }
          ]
        },
        {
          stepNumber: 2,
          title: 'Integrazione Somatica del Mantra',
          description: 'Ripeti mentalmente o a voce bassa il mantra per 3 volte durante un respiro lento e profondo.',
          interactiveType: 'timer-breath',
          placeholder: 'Inspira luce e chiarezza... Espira ripetendo il mantra nella mente.'
        },
        {
          stepNumber: 3,
          title: 'Il Tuo Mantra Personale Su Misura',
          description: 'Personalizza la tua formula di mindset con parole che accendono la tua energia più autentica.',
          interactiveType: 'reflection',
          placeholder: 'Scrivi qui la tua frase di ancoraggio personalizzata...',
          suggestedItems: [
            'Usa formule al presente ("Io sono", "Io scelgo", "Io governo").',
            'Mantieni la frase breve, incisiva e priva di negazioni ("non cadere" diventa "stai saldo").'
          ]
        }
      ],
      practicalCommitment: 'Imposta una sveglia silenziosa a metà giornata per richiamare il tuo mantra e resettare lo stato mentale.',
      mantraOrTakeaway: 'I miei pensieri creano la mia realtà. Scelgo pensieri di forza, lucidità, pace e coraggio.'
    }
  },

  // 8. Cura dei Legami
  {
    id: 'nurturing-bonds',
    title: 'Cura dei Legami & Salute Relazionale',
    shortDefinition: 'Investire in relazioni sociali positive, costruttive e profonde che nutrono reciprocamente la salute e la gioia di vivere.',
    category: 'social-relationships',
    categoryLabel: 'Relazioni & Altruismo',
    iconName: 'HeartHandshake',
    badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
    themeColor: '#1E4332',
    neuroscientificCore: 'Rilascio sistemico di ossitocina e riduzione dell\'infiammazione sistemica (Harvard Study of Adult Development: le buone relazioni sono il fattore #1 di longevità).',
    practicalBenefit: 'Protegge il cervello dall\'invecchiamento precoce, abbassa la pressione sanguigna e moltiplica i momenti di gioia condivisa.',
    keyTakeaways: [
      'La qualità della tua vita è determinata dalla qualità dei tuoi legami più intimi.',
      'Le relazioni non si mantengono da sole: richiedono investimenti intenzionali di tempo, presenza e gratitudine.',
      'Festeggia attivamente le vittorie altrui (Active-Constructive Responding) per moltiplicare la fiducia reciproca.'
    ],
    exercise: {
      name: 'Costruttore di Relazioni Nutrienti & Risposta Attiva',
      instructions: 'Applica il modello della Risposta Attivo-Costruttiva e invia un gesto di cura autentica a un legame chiave.',
      steps: [
        {
          stepNumber: 1,
          title: 'Le 4 Modalità di Risposta alle Buone Notizie Altrui',
          description: 'Un amico condivide un suo grande successo. Quale risposta genera un legame incrollabile?',
          interactiveType: 'scenario',
          options: [
            { id: 'passive-destructive', label: 'Ignorare la notizia e cambiare argomento parlando di te (Passivo-Distruttivo)', explanation: 'Uccide l\'entusiasmo dell\'altro e mostra egocentrismo.', score: 10 },
            { id: 'active-destructive', label: 'Trovare subito i rischi o il lato negativo del suo successo (Attivo-Distruttivo)', explanation: 'Inietta veleno e ansia nel momento di gioia dell\'altro.', score: 20 },
            { id: 'passive-constructive', label: '"Ah bene, congratulazioni." con tono distratto (Passivo-Costruttivo)', explanation: 'Tiepido e impersonale, non crea connessione reale.', score: 50 },
            { id: 'active-constructive', label: '"Che traguardo straordinario! Raccontami tutto: come ti sei sentito quando è successo?" (Attivo-Costruttivo)', explanation: 'Amplifica la gioia, rilascia ossitocina e consolida l\'intimità fraterna.', score: 100 }
          ]
        },
        {
          stepNumber: 2,
          title: 'Il Gesto di Cura Relazionale Inatteso',
          description: 'A quale persona cara puoi inviare oggi un messaggio di stima, gratitudine o vicinanza spontanea?',
          interactiveType: 'reflection',
          placeholder: 'Esempio: "Ciao Marco, stavo ripensando a quanto mi hai supportato in... e volevo solo dirti quanto apprezzo la tua amicizia sincera."',
          suggestedItems: [
            'Esprimi ciò che ammiri nel suo carattere, non solo nei suoi risultati.',
            'La vulnerabilità autentica invita l\'altro a fare altrettanto.'
          ]
        },
        {
          stepNumber: 3,
          title: 'Audit del Tuo Ecosistema Sociale',
          description: 'Quanto ti senti circondato da persone che ti elevano ed ispirano verso la versione migliore di te stesso?',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Qualità Nutriente delle Relazioni (1 = Tossiche/Spente, 10 = Ispiranti, Calde ed Elevanti)'
        }
      ],
      practicalCommitment: 'Oggi invia un messaggio vocale o fai una chiamata di 3 minuti a una persona a cui tieni, solo per farle sapere quanto è importante per te.',
      mantraOrTakeaway: 'Nutro i miei legami con presenza e dedizione. La ricchezza più grande risiede nelle anime che camminano al mio fianco.'
    }
  },

  // 9. Altruismo
  {
    id: 'altruism-decentering',
    title: 'Altruismo & De-Centramento dal Sé',
    shortDefinition: 'Saper offrire supporto tangibile agli altri uscendo dalla visione troppo accentrata su di sé e sui propri problemi.',
    category: 'social-relationships',
    categoryLabel: 'Relazioni & Altruismo',
    iconName: 'Gift',
    badgeColor: 'bg-[#FBF2E3] text-[#8C5D19]',
    themeColor: '#8C5D19',
    neuroscientificCore: 'Disattivazione del Default Mode Network (DMN) iperattivo legato all\'ansia egoriferita e rilascio di endorfine ("Helper\'s High").',
    practicalBenefit: 'Ridimensiona all\'istante i tuoi problemi personali, generando un profondo senso di utilità, scopo e gioia contagiosa.',
    keyTakeaways: [
      'Il modo più rapido per uscire dalla sofferenza egocentrica è rendersi utili a qualcuno che ha bisogno.',
      'L\'altruismo autentico non si aspetta applausi o ricompense: trova la sua ricompensa nell\'atto stesso del dono.',
      'Un piccolo gesto disinteressato innesca un effetto domino a cascata che trasforma l\'atmosfera dell\'intera comunità.'
    ],
    exercise: {
      name: 'Generatore di Azioni Prosociali & Effetto Ripple',
      instructions: 'Pianifica ed esegui un atto di gentilezza o supporto disinteressato senza rivelare che è un esercizio.',
      steps: [
        {
          stepNumber: 1,
          title: 'Scelta del Gesto Prosociale di Oggi',
          description: 'In che modo puoi alleggerire la giornata o portare valore a qualcuno oggi?',
          interactiveType: 'selection',
          options: [
            { id: 'unsolicited-help', label: 'Offrire un aiuto pratico o un favore a un collega/vicino in difficoltà', explanation: 'Risolve un problema reale e dimostra attenzione concreta.', score: 100 },
            { id: 'anonymous-kindness', label: 'Un gesto gentile anonimo (es. lasciare un caffè pagato, un biglietto incoraggiante)', explanation: 'Puro de-centramento senza ricerca di riconoscimento.', score: 100 },
            { id: 'mentor', label: 'Condividere una conoscenza o una risorsa utile con chi sta muovendo i primi passi', explanation: 'Moltiplica le opportunità e fa crescere chi ti circonda.', score: 95 },
            { id: 'genuine-compliment', label: 'Fare un complimento sincero e profondo a chi svolge un lavoro invisibile', explanation: 'Dona dignità e luce a chi spesso viene dato per scontato.', score: 90 }
          ]
        },
        {
          stepNumber: 2,
          title: 'L\'Effetto Ripple (Onda di Risonanza)',
          description: 'Come immagini che il tuo gesto di supporto possa influenzare a catena le persone che quella persona incontrerà?',
          interactiveType: 'reflection',
          placeholder: 'Descrivi la reazione a catena che una singola scintilla di gentilezza può innescare...',
          suggestedItems: [
            'Chi riceve gentilezza inaspettata è 3 volte più propenso ad essere gentile con qualcun altro.',
            'L\'altruismo dissolve la solitudine collettiva.'
          ]
        },
        {
          stepNumber: 3,
          title: 'Verifica del Distacco dall\'Ego',
          description: 'Valuta la purezza del tuo dono: sei pronto a compierlo anche se nessuno dovesse ringraziarti pubblicamente?',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Disinteresse del Gesto (1 = Cerco approvazione, 10 = Puro Amore e Dono Disinteressato)'
        }
      ],
      practicalCommitment: 'Oggi compi un gesto utile per qualcuno senza che la persona te lo abbia chiesto e senza pretendere nulla in cambio.',
      mantraOrTakeaway: 'Esco dal mio piccolo io per servire il grande Noi. Quando illumino il cammino altrui, la mia strada si rischiara.'
    }
  },

  // 10. Sicurezza Interiore
  {
    id: 'inner-security',
    title: 'Sicurezza Interiore & Radicamento Nervoso',
    shortDefinition: 'Consolidare il senso di sicurezza interna, regolando il sistema nervoso autonomo contro l\'ipervigilanza e la paura.',
    category: 'emotion-stress-sleep',
    categoryLabel: 'Emozioni & Stress',
    iconName: 'Anchor',
    badgeColor: 'bg-[#E8F0F7] text-[#2C4960]',
    themeColor: '#2C4960',
    neuroscientificCore: 'Teoria Polivagale di Porges: attivazione del circuito vagale ventrale di ingaggio sociale e sicurezza biologica.',
    practicalBenefit: 'Estingue lo stato di allerta costante, donando una stabilità viscerale che non dipende dall\'instabilità del mondo esterno.',
    keyTakeaways: [
      'La sicurezza non è l\'assenza di pericoli nel mondo, ma la presenza di connessione e radicamento dentro di te.',
      'Il tuo corpo impara la sicurezza attraverso il rilascio della muscolatura profonda e il ritmo del respiro.',
      'Tu sei la tua casa sicura: non puoi essere sradicato quando le tue radici affondano nella tua integrità.'
    ],
    exercise: {
      name: 'Ancoraggio della Base Sicura Somatica',
      instructions: 'Radica il corpo e stabilizza la mente percependo il contatto con il terreno e rilasciando la morsa difensiva.',
      steps: [
        {
          stepNumber: 1,
          title: 'Grounding Fisico dei 5 Sensi (5-4-3-2-1)',
          description: 'Identifica: 3 cose solide che vedi attorno a te, 2 superfici a contatto con il tuo corpo, 1 suono lontano.',
          interactiveType: 'reflection',
          placeholder: 'Scrivi gli elementi percepiti nel qui e ora...',
          suggestedItems: [
            'Senti il peso dei piedi sul pavimento e la gravità che ti sostiene senza sforzo.',
            'L\'ambiente presente è sicuro: il pericolo esiste solo nei pensieri astratti del futuro.'
          ]
        },
        {
          stepNumber: 2,
          title: 'Rilascio dell\'Armatura Muscolare',
          description: 'Rilascia consapevolmente: 1. La fronte, 2. La mandibola e la lingua, 3. Il ventre e i glutei.',
          interactiveType: 'timer-breath',
          placeholder: 'Rilascia il ventre... Lascia che il respiro scenda morbido fino al bacino.'
        },
        {
          stepNumber: 3,
          title: 'Termometro della Sicurezza Viscerale',
          description: 'Come percepisci il tuo livello di sicurezza e radicamento interiore adesso?',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Senso di Sicurezza Interiore (1 = Ansioso/Ipervigile, 10 = Radicato, Protetto e Saldo)'
        }
      ],
      practicalCommitment: 'Ogni volta che avverti tensione improvvisa, appoggia entrambe le piante dei piedi a terra, tocca il tuo petto e dì: "Sono al sicuro qui ed ora".',
      mantraOrTakeaway: 'Sono radicato come una quercia secolare. Le intemperie passano, il mio centro rimane intatto e sicuro.'
    }
  },

  // 11. Senso di Appartenenza
  {
    id: 'sense-of-belonging',
    title: 'Senso di Appartenenza & Umanità Condivisa',
    shortDefinition: 'Sentirsi parte integrante del tessuto umano e universale, superando l\'isolamento esistenziale e la sensazione di esclusione.',
    category: 'social-relationships',
    categoryLabel: 'Relazioni & Altruismo',
    iconName: 'Globe',
    badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
    themeColor: '#1E4332',
    neuroscientificCore: 'Riconoscimento della Common Humanity (Kristin Neff): riduce il senso di vergogna e alienazione attivando l\'empatia globale.',
    practicalBenefit: 'Dissolve la credenza distorta di essere "gli unici a soffrire o sbagliare", aprendo alla fratellanza e alla serenità collettiva.',
    keyTakeaways: [
      'Tutti gli esseri umani condividono le stesse paure fondamentali, gli stessi desideri di pace e lo stesso bisogno di essere visti.',
      'L\'appartenenza autentica non richiede di conformarsi o fingere: comincia quando mostri la tua verità senza maschere.',
      'Non sei un\'isola sperduta: sei un\'onda inseparabile dal vasto oceano dell\'esperienza umana.'
    ],
    exercise: {
      name: 'Ponte di Umanità Condivisa & Riconoscimento Reciproco',
      instructions: 'Riconosci l\'umanità universale anche in chi ti sembra distante o diverso da te.',
      steps: [
        {
          stepNumber: 1,
          title: 'Pratica "Proprio come me"',
          description: 'Pensa a una persona con cui hai avuto un attrito o che ti risulta difficile. Ripeti mentalmente:',
          interactiveType: 'selection',
          options: [
            { id: 'just-like-me-peace', label: '"Proprio come me, questa persona desidera essere felice e libera dalla sofferenza"', explanation: 'Smonta la demonizzazione dell\'altro e crea uno spazio di compassione.', score: 100 },
            { id: 'just-like-me-mistakes', label: '"Proprio come me, questa persona a volte sbaglia, si sente insicura o sopraffatta"', explanation: 'Riconosce la fragilità umana condivisa.', score: 100 },
            { id: 'just-like-me-love', label: '"Proprio come me, questa persona cerca amore, rispetto e comprensione"', explanation: 'Connette ai bisogni universali del cuore umano.', score: 95 }
          ]
        },
        {
          stepNumber: 2,
          title: 'Mappa dei Tuoi Gruppi di Appartenenza',
          description: 'Quale comunità, cerchia di amici, progetto o causa ti fa sentire profondamente parte di un tutto più grande?',
          interactiveType: 'reflection',
          placeholder: 'Descrivi la tua comunità di cuore o quella che intendi creare/frequentare...',
          suggestedItems: [
            'L\'appartenenza si nutre di valori condivisi, non di omologazione esteriore.',
            'Crea tu lo spazio accogliente che vorresti trovare nel mondo.'
          ]
        },
        {
          stepNumber: 3,
          title: 'Grado di Connessione con il Mondo',
          description: 'Quanto ti senti connesso e partecipe rispetto all\'intera comunità umana?',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Senso di Appartenenza (1 = Alienato/Estraneo, 10 = Profondamente Connesso e Accolto)'
        }
      ],
      practicalCommitment: 'Oggi guarda negli occhi uno sconosciuto (il barista, un passante) e auguragli mentalmente silenziosa salute e felicità autentica.',
      mantraOrTakeaway: 'Appartengo alla grande famiglia umana. Le mie gioie e le mie fatiche sono le stesse di milioni di cuori che battono con me.'
    }
  },

  // 12. Autostima Incondizionata
  {
    id: 'unconditional-self-esteem',
    title: 'Autostima Incondizionata & Dignità di Sé',
    shortDefinition: 'Valore intrinseco e rispetto di sé indipendente dalla performance esteriore, dai risultati contingenti o dall\'approvazione altrui.',
    category: 'identity-confidence',
    categoryLabel: 'Identità & Autostima',
    iconName: 'Crown',
    badgeColor: 'bg-[#FBECEF] text-[#7F3847]',
    themeColor: '#7F3847',
    neuroscientificCore: 'Consolidamento della corteccia prefrontale mediale ventrale (VMPFC) per un senso di sé stabile non reattivo agli stimoli di validazione sociale.',
    practicalBenefit: 'Elimina l\'ansia da prestazione, guarisce il perfezionismo tossico e rende la propria dignità inviolabile.',
    keyTakeaways: [
      'Il tuo valore come essere umano è un dato di fatto immutabile: non aumenta con un successo né diminuisce con un errore.',
      'L\'autostima non è arroganza (credersi superiore agli altri), ma la serena certezza di meritare rispetto e felicità.',
      'Sii il tuo alleato più fedele, specialmente nei momenti in cui le cose non vanno come speravi.'
    ],
    exercise: {
      name: 'I 6 Pilastri dell\'Autostima (Nathaniel Branden)',
      instructions: 'Esamina e potenzia il tuo pilastro di rispetto interiore attraverso una presa di posizione autentica.',
      steps: [
        {
          stepNumber: 1,
          title: 'Scelta del Pilastro di Rinforzo',
          description: 'Quale dei pilastri dell\'autostima necessita di maggior nutrimento oggi?',
          interactiveType: 'selection',
          options: [
            { id: 'conscious-living', label: 'Vivere Consapevolmente (Non chiudere gli occhi di fronte alla verità)', explanation: 'Affrontare i fatti senza fuggire nelle distrazioni.', score: 95 },
            { id: 'self-acceptance', label: 'Accettazione di Sé (Smettere di essere in guerra con le proprie imperfezioni)', explanation: 'Abbracciare la propria totalità senza giudizio distruttivo.', score: 100 },
            { id: 'self-assertiveness', label: 'Auto-Assertività (Onorare i propri bisogni e valori in pubblico)', explanation: 'Non svendersi per compiacere chi ci circonda.', score: 95 },
            { id: 'personal-integrity', label: 'Integrità Personale (Allineare ciò che pensi, dici e fai)', explanation: 'La coerenza morale genera rispetto profondo di sé.', score: 100 }
          ]
        },
        {
          stepNumber: 2,
          title: 'Disconnessione del Valore dalla Performance',
          description: 'Separa un recente insuccesso o errore pratico dal tuo valore di persona.',
          interactiveType: 'reflection',
          placeholder: 'Esempio: "Il mio progetto non ha ottenuto il risultato sperato, ma questo dimostra solo che il metodo va perfezionato, non che io non valga nulla."',
          suggestedItems: [
            'Tu non sei il tuo lavoro, non sei i tuoi voti, non sei il tuo conto in banca.',
            'Tu sei l\'essere cosciente che sperimenta, impara e evolve continuamente.'
          ]
        },
        {
          stepNumber: 3,
          title: 'Indice di Dignità e Amore per Sé Stessi',
          description: 'Quanto ti tratti con la stessa gentilezza e rispetto che riserveresti al tuo miglior amico?',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Autostima Incondizionata (1 = Giudicante/Critico, 10 = Incondizionatamente Accogliente)'
        }
      ],
      practicalCommitment: 'Oggi, davanti allo specchio prima di uscire, guardati negli occhi per 10 secondi e dì a te stesso: "Ti rispetto, ti apprezzo e sono dalla tua parte".',
      mantraOrTakeaway: 'Il mio valore è incondizionato e sacro. Non ho bisogno di dimostrare nulla per meritare amore, dignità e felicità.'
    }
  },

  // 13. Conoscenza & Apprendimento Continuo
  {
    id: 'epistemic-knowledge',
    title: 'Conoscenza & Apprendimento Continuo',
    shortDefinition: 'Curiosità intellettuale insaziabile, pensiero critico e metodo socratico per ampliare costantemente i propri orizzonti.',
    category: 'mindset-awareness',
    categoryLabel: 'Mente & Consapevolezza',
    iconName: 'BookOpen',
    badgeColor: 'bg-[#FBF2E3] text-[#8C5D19]',
    themeColor: '#8C5D19',
    neuroscientificCore: 'Neurogenesi dell\'Ippocampo e potenziamento sinaptico a lungo termine (LTP) attraverso la curiosità attiva e la sintesi dei concetti.',
    practicalBenefit: 'Mantiene il cervello giovane, previene la rigidità mentale e fornisce strumenti di problem solving di livello superiore.',
    keyTakeaways: [
      'Imparare non è immagazzinare nozioni passive, ma creare modelli mentali capaci di prevedere e comprendere il mondo.',
      'La tecnica di Feynman: non hai capito davvero qualcosa finché non sei in grado di spiegarla con parole semplici a un bambino.',
      'Leggi per sfidare le tue certezze, non per confermare ciò che credevi già.'
    ],
    exercise: {
      name: 'Metodo Feynman & Sintesi dei Principi Primi',
      instructions: 'Prendi un concetto complesso che hai appreso di recente e distillalo nei suoi elementi essenziali.',
      steps: [
        {
          stepNumber: 1,
          title: 'Selezione del Concetto Chiave da Assimilare',
          description: 'Quale principio scientifico, filosofico o pratico desideri padroneggiare oggi?',
          interactiveType: 'selection',
          options: [
            { id: 'neuroplasticity', label: 'Neuroplasticità: Come il cervello si ricabla attraverso l\'attenzione focalizzata', explanation: 'Il principio base dell\'evoluzione mentale per tutta la vita.', score: 95 },
            { id: 'first-principles', label: 'Ragionamento dai Principi Primi: Scomporre un problema alla sua verità fondamentale', explanation: 'Il metodo di Aristotele e dei grandi innovatori per creare soluzioni originali.', score: 100 },
            { id: 'entropy-systems', label: 'Legge dell\'Entropia: Senza energia immessa, ogni sistema va verso il disordine', explanation: 'Spiega perché le abitudini e le relazioni richiedono cura costante.', score: 95 },
            { id: 'pareto-power', label: 'Legge di Pareto (80/20): Il 20% delle cause genera l\'80% degli effetti', explanation: 'L\'essenza della concentrazione strategica delle proprie energie.', score: 90 }
          ]
        },
        {
          stepNumber: 2,
          title: 'Spiegazione Semplificata (Feynman Test)',
          description: 'Spiega questo principio in massimo 3 frasi cristalline, senza usare gergo complicato.',
          interactiveType: 'reflection',
          placeholder: 'Scrivi la tua spiegazione ultra-chiara qui...',
          suggestedItems: [
            'Se trovi un punto in cui usi paroloni complessi, lì si nasconde un\'incertezza: semplifica ulteriormente.',
            'Usa una metafora visiva tratta dal mondo reale.'
          ]
        },
        {
          stepNumber: 3,
          title: 'Applicazione Pratica Immediata',
          description: 'In quale decisione concreta della tua vita di oggi applicherai questa conoscenza?',
          interactiveType: 'reflection',
          placeholder: 'Descrivi come questo sapere guida un tuo comportamento reale...',
          suggestedItems: [
            'La conoscenza senza applicazione è solo decorazione; applicata diventa vera saggezza.'
          ]
        }
      ],
      practicalCommitment: 'Oggi dedica 20 minuti alla lettura profonda di un libro o saggio di alto valore, escludendo qualsiasi notifica o distrazione.',
      mantraOrTakeaway: 'La mia mente è un laboratorio vivo di continua scoperta. Ogni giorno espando i miei orizzonti con curiosità e discernimento.'
    }
  },

  // 14. Creatività Senza Frontiere
  {
    id: 'limitless-creativity',
    title: 'Creatività Senza Frontiere & Pensiero Divergente',
    shortDefinition: 'Pensiero laterale libero da schemi convenzionali, combinatoria concettuale inaspettata e de-fissazione cognitiva.',
    category: 'mindset-awareness',
    categoryLabel: 'Mente & Consapevolezza',
    iconName: 'Lightbulb',
    badgeColor: 'bg-[#F2EEF8] text-[#4D3B6A]',
    themeColor: '#4D3B6A',
    neuroscientificCore: 'Accoppiamento armonico tra Executive Control Network (ECN) e Default Mode Network (DMN) con aumento delle onde Alfa parieto-occipitali.',
    practicalBenefit: 'Sblocca soluzioni geniali e inedite a problemi apparentemente insolubili, moltiplicando l\'innovazione e la vitalità personale.',
    keyTakeaways: [
      'La creatività non è un dono mistico per pochi eletti: è la capacità di connettere due idee che prima non erano mai state unite.',
      'Per avere una buona idea, devi prima avere il coraggio di generare 20 idee assurde senza censurarti.',
      'Sospendi il giudizio durante la fase divergente: la critica precoce uccide l\'innovazione sul nascere.'
    ],
    exercise: {
      name: 'Pensiero Laterale & Combinatoria Insolita a 3 Elementi',
      instructions: 'Rompi la fissità funzionale e genera una soluzione divergente combinando elementi apparentemente incompatibili.',
      steps: [
        {
          stepNumber: 1,
          title: 'Rottura della Fissità Funzionale',
          description: 'Prendi un oggetto comune (es. una graffetta, un mattone, una tazza). Quanti utilizzi alternativi intelligenti riesci a trovare in 60 secondi?',
          interactiveType: 'association',
          placeholder: 'Elenca 5 usi alternativi insoliti dell\'oggetto...',
          suggestedItems: [
            'Non porti limiti di scala, contesto o fisica convenzionale.',
            'Più l\'associazione è inusuale, più nuove connessioni neurali vengono attivate.'
          ]
        },
        {
          stepNumber: 2,
          title: 'Il Problema Invertito (Pensiero alla Rovescia)',
          description: 'Prendi un tuo obiettivo attuale e chiediti: "Cosa dovrei fare se volessi ottenere il disastro totale e il fallimento garantito?".',
          interactiveType: 'reflection',
          placeholder: 'Elenca le azioni peggiori possibili, poi invertile per trovare la soluzione geniale...',
          suggestedItems: [
            'L\'inversione evidenzia i punti ciechi invisibili al pensiero lineare classico.',
            'Spesso la creatività consiste semplicemente nell\'eliminare gli ostacoli nascosti.'
          ]
        },
        {
          stepNumber: 3,
          title: 'Indice di Libertà Creativa',
          description: 'Quanto ti concedi di esplorare idee non convenzionali senza la paura del ridicolo o del giudizio?',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Audacia Creativa (1 = Rigido/Conservativo, 10 = Visionario e Senza Frontiere)'
        }
      ],
      practicalCommitment: 'Oggi fai una cosa quotidiana in un modo completamente diverso dal solito (cambia percorso per andare al lavoro, scrivi con la mano non dominante, cambia routine).',
      mantraOrTakeaway: 'La mia mente non ha confini. Unisco l\'inaspettato per creare bellezza, originalità e nuove possibilità.'
    }
  },

  // 15. Il Sonno & Igiene Circadiana
  {
    id: 'circadian-sleep',
    title: 'Il Sonno & Igiene del Ritmo Circadiano',
    shortDefinition: 'Architettura del riposo notturno, pulizia glinfatica del cervello e protocolli scientifici per il sonno profondo e REM.',
    category: 'emotion-stress-sleep',
    categoryLabel: 'Emozioni & Stress',
    iconName: 'Moon',
    badgeColor: 'bg-[#E8F0F7] text-[#2C4960]',
    themeColor: '#2C4960',
    neuroscientificCore: 'Attivazione del Sistema Glinfatico notturno per lo smaltimento della beta-amiloide e consolidamento delle memorie nell\'onda lenta NREM 3/4.',
    practicalBenefit: 'Ripristina la plasticità neurale al 100%, ottimizza la regolazione emotiva, la sintesi proteica e la lucidità del giorno dopo.',
    keyTakeaways: [
      'Il sonno non è tempo perso: è il momento in cui il cervello fa la manutenzione straordinaria e si rigenera biologicamente.',
      'La luce naturale del mattino fissa il timer circadiano per il rilascio puntuale di melatonina 14 ore dopo.',
      'La temperatura corporea deve scendere di circa 1°C per avviare il sonno profondo: stanza fresca (18-19°C) e buio totale.'
    ],
    exercise: {
      name: 'Protocollo di Decompressione Pre-Sonno a 4 Fasi',
      instructions: 'Attiva la cascata parasimpatica per facilitare l\'addormentamento profondo entro 15 minuti.',
      steps: [
        {
          stepNumber: 1,
          title: 'Audit della Routine Serale Digitale',
          description: 'Quale abitudine circadiana applicherai stasera per proteggere il tuo cervello dalla luce blu?',
          interactiveType: 'selection',
          options: [
            { id: 'screen-curfew', label: 'Coprifuoco schermi 60 minuti prima di dormire (sostituisci con libro o audio)', explanation: 'Impedisce il blocco della secrezione di melatonina pineale.', score: 100 },
            { id: 'warm-shower', label: 'Doccia tiepida 90 minuti prima di coricarsi per favorire la vasodilatazione periferica', explanation: 'Facilita il calo della temperatura corporea centrale.', score: 95 },
            { id: 'brain-dump', label: 'Scrittura del To-Do List di domani su carta per azzerare l\'effetto Zeigarnik', explanation: 'Libera la memoria di lavoro dalle preoccupazioni in sospeso.', score: 95 },
            { id: 'magnesium-herbal', label: 'Tisana rilassante con camomilla/passiflora in ambiente con luce calda e soffusa', explanation: 'Stimola i recettori GABAergici favorendo la calma somatica.', score: 90 }
          ]
        },
        {
          stepNumber: 2,
          title: 'Respirazione 4-7-8 per l\'Addormentamento',
          description: 'Esegui 4 cicli di respirazione: Inspira 4 sec dal naso, trattieni 7 sec, espira 8 sec dalla bocca.',
          interactiveType: 'timer-breath',
          placeholder: 'Trattieni... Espira lentamente rilasciando ogni muscolo del corpo.'
        },
        {
          stepNumber: 3,
          title: 'Impegno per il Tuo Santuario del Sonno',
          description: 'Verifica che la tua camera da letto sia buia, fresca (18-19°C) e silenziosa.',
          interactiveType: 'action-commit',
          options: [
            { id: 'dark-cool', label: 'Buio totale (tende oscuranti o mascherina) e smartphone fuori dalla camera', explanation: 'Il gold standard scientifico per un sonno indisturbato.', score: 100 },
            { id: 'consistent-wake', label: 'Sveglia alla stessa ora domani mattina, seguita da 5-10 min di luce naturale', explanation: 'Sincronizza l\'orologio maestro nel nucleo soprachiasmatico (SCN).', score: 100 }
          ]
        }
      ],
      practicalCommitment: 'Stasera spegni ogni display 45 minuti prima di coricarti e dedica quel tempo alla lettura cartacea o al rilassamento consapevole.',
      mantraOrTakeaway: 'Il mio sonno è sacro e ristoratore. Affido la notte alla rigenerazione per risvegliarmi pieno di energia e vitalità.'
    }
  },

  // 16. Responsabilità Personale (Locus di Controllo Interno)
  {
    id: 'radical-responsibility',
    title: 'Responsabilità Personale & Locus Interno',
    shortDefinition: 'Ownership totale della propria vita, trasformazione della reattività passiva in proattività e abbandono di ogni scusa.',
    category: 'identity-confidence',
    categoryLabel: 'Identità & Autostima',
    iconName: 'Target',
    badgeColor: 'bg-[#E5F2EC] text-[#1E4332]',
    themeColor: '#1E4332',
    neuroscientificCore: 'Shift neurale dall\'impotenza appresa (learned helplessness) dell\'amigdala alla padronanza attiva mediata dalla corteccia cingolata anteriore (ACC).',
    practicalBenefit: 'Elimina per sempre il senso di vittimismo e frustrazione, restituendoti il timone completo del tuo destino.',
    keyTakeaways: [
      'Non puoi sempre scegliere cosa ti accade, ma puoi sempre scegliere al 100% come rispondere (Formula E + R = O: Evento + Risposta = Risultato).',
      'La lamentela è una dichiarazione di impotenza: sostituiscila con una richiesta chiara o un\'azione correttiva immediata.',
      'Prendersi la responsabilità dei propri problemi non significa incolparsi, ma assumere il potere di risolverli.'
    ],
    exercise: {
      name: 'Laboratorio di Ownership Radicale 100% (No Excuses)',
      instructions: 'Prendi una situazione frustrante della tua vita e trasforma ogni alibi in una leva di azione diretta.',
      steps: [
        {
          stepNumber: 1,
          title: 'Individuazione dell\'Area di Frustrazione',
          description: 'In quale ambito ti capita più spesso di attribuire la colpa alle circostanze o ad altri?',
          interactiveType: 'selection',
          options: [
            { id: 'time-schedule', label: '"Non ho abbastanza tempo" (Gestione delle priorità e dei confini)', explanation: 'Il tempo non si trova: si decide dove allocarlo.', score: 95 },
            { id: 'people-actions', label: '"Gli altri non capiscono o non collaborano" (Comunicazione e leadership personale)', explanation: 'Spetta a te comunicare con chiarezza e guidare con l\'esempio.', score: 100 },
            { id: 'energy-burnout', label: '"Sono troppo stanco per agire" (Gestione del riposo e delle abitudini)', explanation: 'L\'energia si crea attraverso l\'azione e il rispetto del corpo.', score: 95 },
            { id: 'market-luck', label: '"Le circostanze esterne sono avverse" (Adattabilità e creatività)', explanation: 'La resilienza trova varchi dove gli altri vedono solo muri.', score: 100 }
          ]
        },
        {
          stepNumber: 2,
          title: 'Riconversione da Reattivo a Proattivo',
          description: 'Riformula la situazione passando dal linguaggio della vittima ("Sono costretto a...") a quello dell\'agente sovrano ("Io scelgo di...").',
          interactiveType: 'reflection',
          placeholder: 'Esempio: Da "Quel cliente mi fa impazzire" a "Scelgo di stabilire un protocollo di comunicazione più chiaro ed efficiente con quel cliente."',
          suggestedItems: [
            'Cosa c\'è sotto il mio diretto controllo adesso?',
            'Quale passo posso compiere oggi stesso senza aspettare il permesso di nessuno?'
          ]
        },
        {
          stepNumber: 3,
          title: 'Indice di Locus di Controllo Interno',
          description: 'Quanto senti che il tuo futuro dipende dalle tue scelte piuttosto che dalla fortuna o dagli altri?',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Locus di Controllo Interno (1 = Vittima degli eventi, 10 = Autore Sovrano della Mia Vita)'
        }
      ],
      practicalCommitment: 'Oggi imponiti un digiuno assoluto da lamentele e scuse: se qualcosa non va, o agisci per migliorarla o accettala con totale serenità.',
      mantraOrTakeaway: 'Io sono il capitano della mia anima e il maestro del mio destino. Rispondo di ogni mia scelta con piena responsabilità.'
    }
  },

  // 17. Motivazione Intrinseca
  {
    id: 'intrinsic-motivation',
    title: 'Motivazione Intrinseca & Allineamento di Scopo',
    shortDefinition: 'Chiarezza dello scopo profondo, autodeterminazione (autonomia, competenza, scopo) e superamento definitivo della procrastinazione.',
    category: 'identity-confidence',
    categoryLabel: 'Identità & Autostima',
    iconName: 'Zap',
    badgeColor: 'bg-[#FBF2E3] text-[#8C5D19]',
    themeColor: '#8C5D19',
    neuroscientificCore: 'Ottimizzazione del rilascio tonico e fasico di Dopamina lungo la via mesolimbica grazie alla chiarezza del "Perché" (Simon Sinek) e all\'autonomia di Ryan & Deci.',
    practicalBenefit: 'Rende l\'impegno leggero e spontaneo, azzera la necessità di forzature estenuanti e alimenta una disciplina fluida e duratura.',
    keyTakeaways: [
      'La motivazione estrinseca (ricompense o punizioni esterne) svanisce presto; la motivazione intrinseca (amore per l\'arte e per lo scopo) è inesauribile.',
      'Non aspettare di avere voglia per agire: fai i primi 2 minuti dell\'azione e la motivazione si accenderà spontaneamente.',
      'Connetti ogni piccolo compito noioso alla grande visione di chi stai diventando.'
    ],
    exercise: {
      name: 'La Bussola dell\'Autodeterminazione & La Regola dei 2 Minuti',
      instructions: 'Allinea i tuoi compiti odierni con i tuoi 3 bisogni psicologici primari: Autonomia, Competenza e Scopo.',
      steps: [
        {
          stepNumber: 1,
          title: 'Il Tuo "Perché" Profondo',
          description: 'Quale valore fondamentale guida i tuoi sforzi attuali e dà significato a ciò che fai?',
          interactiveType: 'selection',
          options: [
            { id: 'excellence-mastery', label: 'Maestria & Crescita (Voglio diventare il migliore in ciò che amo fare)', explanation: 'Soddisfa il bisogno innato di Competenza.', score: 100 },
            { id: 'freedom-autonomy', label: 'Libertà & Indipendenza (Voglio costruire una vita governata dalle mie scelte)', explanation: 'Soddisfa il bisogno fondamentale di Autonomia.', score: 100 },
            { id: 'impact-service', label: 'Impatto & Servizio (Voglio migliorare tangibilmente la vita di altre persone)', explanation: 'Soddisfa il bisogno supremo di Significato e Scopo.', score: 100 },
            { id: 'family-protection', label: 'Amore & Cura della Famiglia (Voglio proteggere e far fiorire i miei cari)', explanation: 'Radice motivazionale indistruttibile.', score: 95 }
          ]
        },
        {
          stepNumber: 2,
          title: 'Attivazione della Regola dei 2 Minuti',
          description: 'Prendi il compito che stai rimandando e riducilo a un\'azione microscopica che richiede meno di 120 secondi.',
          interactiveType: 'reflection',
          placeholder: 'Esempio: Invece di "Scrivere la relazione da 20 pagine", la micro-azione è "Aprire il documento Word e scrivere il titolo del paragrafo 1."',
          suggestedItems: [
            'L\'attrito iniziale è l\'unico vero nemico: una volta avviato il movimento, l\'inerzia ti porterà avanti con facilità.',
            'Celebra il semplice inizio dell\'azione.'
          ]
        },
        {
          stepNumber: 3,
          title: 'Livello di Entusiasmo Intrinseco',
          description: 'Quanto ti senti allineato con le cose che stai facendo nella tua quotidianità?',
          interactiveType: 'slider',
          minSlider: 1,
          maxSlider: 10,
          sliderLabel: 'Allineamento Motivazionale (1 = Senso di dovere pesante, 10 = Pura Passione e Scopo Chiaro)'
        }
      ],
      practicalCommitment: 'Oggi avvia per soli 2 minuti quell\'attività che stai procrastinando, senza pretendere di finirla, solo per assaporare l\'inizio.',
      mantraOrTakeaway: 'Agisco con passione e scopo. La mia motivazione nasce dal cuore della mia missione e alimenta ogni mio passo.'
    }
  },

  // 18. Psicologia Positiva (Modello PERMA)
  {
    id: 'positive-psychology',
    title: 'Psicologia Positiva & Modello PERMA',
    shortDefinition: 'Fioritura umana (Flourishing), Savoring (assaporamento), gratitudine attiva e coltivazione sistematica delle virtù cardinali.',
    category: 'social-relationships',
    categoryLabel: 'Relazioni & Altruismo',
    iconName: 'Sparkles',
    badgeColor: 'bg-[#FBECEF] text-[#7F3847]',
    themeColor: '#7F3847',
    neuroscientificCore: 'Broaden-and-Build Theory (Barbara Fredrickson): le emozioni positive ampliano il repertorio cognitivo ed espandono le risorse psicologiche durature.',
    practicalBenefit: 'Innalza il set-point della felicità di base, crea risonanza positiva nell\'ambiente ed esalta i punti di forza caratteriali.',
    keyTakeaways: [
      'La felicità non è l\'assenza di problemi, ma la presenza attiva di significato, connessione e gratitudine.',
      'Savoring: fermarsi ad assaporare un momento bello per almeno 15 secondi permette al cervello di codificarlo nella memoria a lungo termine.',
      'Le 5 dimensioni del Modello PERMA di Seligman: Positive Emotions, Engagement, Relationships, Meaning, Accomplishment.'
    ],
    exercise: {
      name: 'Palestra della Fioritura Umana & Esercizio delle 3 Cose Belle',
      instructions: 'Attiva la scansione dei punti di forza e assapora i doni autentici della tua vita quotidiana.',
      steps: [
        {
          stepNumber: 1,
          title: 'Scansione delle 3 Cose Belle di Oggi',
          description: 'Identifica 3 eventi positivi o momenti di grazia accaduti nelle ultime 24 ore e il motivo per cui sono avvenuti.',
          interactiveType: 'reflection',
          placeholder: '1. Un bel caffè al sole... 2. Una conversazione sincera con... 3. Aver risolto un problema...',
          suggestedItems: [
            'Cerca anche nelle cose piccolissime: il profumo dell\'aria, un sorriso, una musica che ti ha emozionato.',
            'Chiediti: "Quale mio contributo ha reso possibile o mi ha permesso di accogliere questa bellezza?".'
          ]
        },
        {
          stepNumber: 2,
          title: 'Il Savoring Somatico (Assaporamento a 15 Secondi)',
          description: 'Richiama alla mente il più bello dei tre momenti e rivivilo con tutti i sensi per 15 secondi, permettendo al petto di scaldarsi.',
          interactiveType: 'timer-breath',
          placeholder: 'Assapora la gioia... Senti la gratitudine irradiarsi in ogni cellula del tuo corpo.'
        },
        {
          stepNumber: 3,
          title: 'Espressione del Tuo Punto di Forza Caratteriale',
          description: 'Quale virtù cardinale intendi esprimere oggi con rinnovato splendore?',
          interactiveType: 'selection',
          options: [
            { id: 'gratitude-active', label: 'Gratitudine Attiva (Ringraziare esplicitamente chi mi ha aiutato)', explanation: 'Aumenta del 25% il benessere soggettivo duraturo.', score: 100 },
            { id: 'kindness-generosity', label: 'Gentilezza e Generosità di Spirito', explanation: 'Genera calore e risonanza affettiva.', score: 100 },
            { id: 'curiosity-zest', label: 'Vitalità & Curiosità Esuberante per la Vita (Zest)', explanation: 'Inietta entusiasmo in ogni interazione.', score: 95 },
            { id: 'hope-optimism', label: 'Speranza e Ottimismo Realistico per il Futuro', explanation: 'Costruisce resilienza attiva di fronte alle sfide.', score: 95 }
          ]
        }
      ],
      practicalCommitment: 'Oggi prima di andare a dormire, rivivi i 3 momenti più belli della giornata e addormentati ringraziando per essere vivo.',
      mantraOrTakeaway: 'Celebro la bellezza della vita in ogni istante. La mia gratitudine trasforma ciò che ho in abbondanza inestimabile.'
    }
  }
];
