import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of Gemini client
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiEnabled: Boolean(process.env.GEMINI_API_KEY) });
});

// 1. AI Neuro-Coach Chat & Mentorship
app.post("/api/ai/coach", async (req, res) => {
  try {
    const { message, history = [], userStats = {} } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        reply: `[Modalità Offline] Ottimo impegno! Basandomi sul tuo punteggio GCI di ${userStats.gci || 650}, ti consiglio di concentrarti oggi sulla memoria di lavoro (N-Back) e 5 minuti di respirazione di coerenza cardiaca per ridurre il cortisolo e amplificare la neuroplasticità.`,
      });
    }

    const systemInstruction = `Sei Luancer Mentor, una guida personale per la crescita umana, lo sviluppo della persona e il potenziamento della mente. 
Il tuo approccio è caldo, saggio, pragmatico, fondato sulla psicologia comportamentale, la chiarezza mentale e lo stoicismo pratico (Seneca, Marco Aurelio, Epitteto).
Non usare gergo artificiale, robotico o cliché fantascientifici. Parla all'utente come un mentore esperto e fidato che aiuta una persona reale nella sua vita quotidiana:
- Come costruire disciplina e sconfiggere la procrastinazione senza burnout
- Come gestire l'ansia, la reattività emotiva e i conflitti relazionali con calma e assertività
- Come migliorare la memoria, il focus profondo e le abitudini quotidiane
- Come prendere decisioni lucide evitando i bias cognitivi
- Come essere una persona migliore, più integra, resiliente e presente.

Dati attuali dell'utente:
- Indice di Crescita (GCI): ${userStats.gci || "650"}
- Punti di forza: ${userStats.strongSkills?.join(", ") || "In fase di sviluppo"}
- Punteggio Virtù & Carattere: ${userStats.characterScore || "75/100"}
- Serie di giorni attivi: ${userStats.streak || 1} giorni.

Rispondi sempre in italiano, con empatia, consigli concreti e applicabili subito nella giornata. Mantieni le risposte concise (100-180 parole).`;

    const contents = [
      ...history.map((h: { role: string; text: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      { role: "user", parts: [{ text: message || "Come posso migliorare la mia concentrazione oggi?" }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("AI Coach Error:", error);
    res.status(500).json({
      error: "Errore durante la comunicazione con il Neuro-Coach.",
      reply: "Si è verificato un ritardo sinaptico nel server. Continua il tuo allenamento quotidiano con determinazione e concentrazione!",
    });
  }
});

// 2. Generate Dynamic Character Dilemmas (Stoic & Moral Resilience Scenarios)
app.post("/api/ai/generate-character-dilemma", async (req, res) => {
  try {
    const { category = "resilience", difficulty = "medium" } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      // Fallback curated dilemma
      return res.json({
        dilemma: {
          id: `dil-${Date.now()}`,
          title: "Il Progetto Rifiutato e la Pressione del Team",
          context: "Dopo 3 settimane di lavoro intenso, il tuo responsabile scarta bruscamente la tua proposta durante una riunione aperta, attribuendo l'errore alla tua 'mancanza di visione'. Il tuo team ti guarda in attesa di una reazione immediata.",
          virtueFocus: "Autocontrollo & Dignità Stoica",
          options: [
            {
              id: "opt_1",
              text: "Ascolta con calma, ringrazia per il feedback critico e chiedi 3 punti specifici su cui costruire la versione 2.0.",
              traitScore: { resilience: 90, temperance: 95, courage: 80, wisdom: 90 },
              virtue: "Trascendenza dell'Ego & Lucidità",
              feedback: "Eccellente applicazione della dicotomia del controllo: trasformi un affronto in un'opportunità di crescita razionale senza farti sopraffare dalle emozioni reattive."
            },
            {
              id: "opt_2",
              text: "Difendi con fermezza e dati alla mano ogni scelta del progetto davanti a tutti, smontando l'obiezione punto per punto.",
              traitScore: { resilience: 75, temperance: 50, courage: 90, wisdom: 65 },
              virtue: "Coraggio Assertivo ma a Rischio Escalation",
              feedback: "Dimostri coraggio e padronanza tecnica, ma rischi di innescare una dinamica di potere distruttiva per il gruppo."
            },
            {
              id: "opt_3",
              text: "Accetti in silenzio durante il meeting, ma chiedi un colloquio privato 'one-to-one' per chiarire i fatti a mente fredda.",
              traitScore: { resilience: 80, temperance: 85, courage: 75, wisdom: 85 },
              virtue: "Prudenza Strategica",
              feedback: "Ottima gestione dei tempi e degli spazi relazionali; preservi l'armonia pubblica proteggendo la tua dignità."
            },
            {
              id: "opt_4",
              text: "Ti sfoghi subito dopo con i colleghi per consolidare alleanze contro la decisione del responsabile.",
              traitScore: { resilience: 30, temperance: 20, courage: 30, wisdom: 25 },
              virtue: "Reattività Emotiva Disfunzionale",
              feedback: "Cedere al risentimento e al pettegolezzo indebolisce il tuo carattere e alimenta tossicità nell'ambiente."
            }
          ]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Genera un dilemma di allenamento del carattere e della resilienza psicologica di livello ${difficulty}, focalizzato su ${category} (es. pressione etica, gestione del fallimento, autocontrollo contro tentazioni o provocazioni, leadership empatica). 
Restituisci un JSON rigoroso in lingua italiana con titolo, contesto realistico ed emozionante, virtù allenata, e 4 opzioni di risposta con punteggi e feedback filosofico/psicologico.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            context: { type: Type.STRING },
            virtueFocus: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  traitScore: {
                    type: Type.OBJECT,
                    properties: {
                      resilience: { type: Type.NUMBER },
                      temperance: { type: Type.NUMBER },
                      courage: { type: Type.NUMBER },
                      wisdom: { type: Type.NUMBER }
                    },
                    required: ["resilience", "temperance", "courage", "wisdom"]
                  },
                  virtue: { type: Type.STRING },
                  feedback: { type: Type.STRING }
                },
                required: ["id", "text", "traitScore", "virtue", "feedback"]
              }
            }
          },
          required: ["id", "title", "context", "virtueFocus", "options"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ dilemma: parsed });
  } catch (error) {
    console.error("Dilemma Generation Error:", error);
    res.status(500).json({ error: "Errore generazione dilemma" });
  }
});

// 3. Cognitive Reframing Assistant (Stoic & CBT Reframing of Stressful Thoughts)
app.post("/api/ai/reframe-thought", async (req, res) => {
  try {
    const { negativeThought, situation } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        reframing: {
          distortion: "Catastrofizzazione e Personalizzazione",
          stoicLens: "Ciò che non dipende da me non merita la perdita della mia serenità interiore. L'ostacolo è la via.",
          reframedPerspective: "Questo contrattempo è un test per testare la mia flessibilità mentale. Non definisce il mio valore, ma mi allena a trovare soluzioni creative.",
          actionStep: "Focalizzati esclusivamente sulla prossima azione concreta di 5 minuti che è sotto il tuo controllo diretto."
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `L'utente ha condiviso questo pensiero stressante / credenza limitante: "${negativeThought}". Situazione: "${situation || "Generale"}".
Esegui un re-framing cognitivo combinando la Terapia Cognitivo-Comportamentale (CBT) e la Filosofia Stoica/Antifragilità.
Restituisci un JSON con la distorsione cognitiva individuata, la lente stoica/filosofica, la prospettiva trasformata e un'azione pratica immediata. Tutto in italiano.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            distortion: { type: Type.STRING, description: "Tipo di distorsione cognitiva (es. Bianco o Nero, Catastrofizzazione)" },
            stoicLens: { type: Type.STRING, description: "Principio stoico applicabile (Marco Aurelio, Epitteto, Seneca)" },
            reframedPerspective: { type: Type.STRING, description: "Pensiero riformulato potenziante e costruttivo" },
            actionStep: { type: Type.STRING, description: "Micro-azione di 2 minuti per agire subito" }
          },
          required: ["distortion", "stoicLens", "reframedPerspective", "actionStep"]
        }
      }
    });

    res.json({ reframing: JSON.parse(response.text || "{}") });
  } catch (error) {
    console.error("Reframe error:", error);
    res.status(500).json({ error: "Errore durante il reframing" });
  }
});

// 4. Generate AI Adaptive Logic / Verbal / Pattern Puzzles
app.post("/api/ai/generate-puzzle", async (req, res) => {
  try {
    const { type = "logic", level = 3 } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        puzzle: {
          question: "Completa la sequenza logica neurale: 3, 7, 15, 31, ... Qual è il numero successivo?",
          options: ["63", "62", "48", "64"],
          correctAnswer: "63",
          explanation: "La regola è (n * 2) + 1. Quindi (31 * 2) + 1 = 63.",
          category: "Logica Sequenziale",
          difficulty: level
        }
      });
    }

    const prompt = `Genera un puzzle cognitivo innovativo e stimolante di tipo "${type}" (può essere: logic, verbal_chain, deductive_reasoning, lateral_thinking) con livello di difficoltà ${level} su 10.
La domanda deve essere in italiano, chiara, stimolante, con 4 opzioni di risposta distinte e spiegazione logica passo-passo.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.NUMBER }
          },
          required: ["question", "options", "correctAnswer", "explanation", "category", "difficulty"]
        }
      }
    });

    res.json({ puzzle: JSON.parse(response.text || "{}") });
  } catch (error) {
    console.error("Puzzle generation error:", error);
    res.status(500).json({ error: "Errore generazione puzzle" });
  }
});

// 5. Generate Comprehensive Neuro-Cognitive Diagnostic Report
app.post("/api/ai/analyze-report", async (req, res) => {
  try {
    const { sessionData, profile } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        report: {
          archetype: "Architetto Strategico",
          summary: "Eccellente controllo esecutivo e tempo di reazione superiore alla media. La memoria di lavoro beneficia di sessioni brevi ad alta intensità.",
          topCognitivePower: "Velocità di Inibizione e Reazione Neurale",
          growthOpportunity: "Potenziare la tenuta della memoria visuo-spaziale sotto affaticamento",
          characterTrait: "Alta Resilienza e Compostezza nei Dilemmi",
          brainAgeEstimate: 24,
          dailyPrescription: "1x Dual N-Back 3-Back, 1x Stroop Cromatico, 3 min Respirazione 4-7-8."
        }
      });
    }

    const prompt = `Analizza le seguenti metriche cognitive e di carattere dell'utente per generare un Report Neuro-Cognitivo professionale e personalizzato:
Dati sessioni recenti: ${JSON.stringify(sessionData)}
Profilo: ${JSON.stringify(profile)}

Genera una diagnosi in italiano che definisca l'Archetipo Cognitivo (es: Architetto Strategico, Esploratore Intuitivo, Sentinella Focalizzata), una sintesi clinico-scientifica incoraggiante, punti di forza, opportunità di neuroplasticità, stima dell'età cerebrale funzionale (Brain Age) e una prescrizione di allenamento per le prossime 24 ore.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            summary: { type: Type.STRING },
            topCognitivePower: { type: Type.STRING },
            growthOpportunity: { type: Type.STRING },
            characterTrait: { type: Type.STRING },
            brainAgeEstimate: { type: Type.NUMBER },
            dailyPrescription: { type: Type.STRING }
          },
          required: ["archetype", "summary", "topCognitivePower", "growthOpportunity", "characterTrait", "brainAgeEstimate", "dailyPrescription"]
        }
      }
    });

    res.json({ report: JSON.parse(response.text || "{}") });
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({ error: "Errore generazione report" });
  }
});

// Vite Middleware integration for dev and static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Synapse AI server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
