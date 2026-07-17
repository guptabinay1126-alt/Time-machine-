import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini AI securely on the server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined. AI features will use rich offline mock data.");
}

// REST API for Time Travel Simulation
app.post("/api/time-travel", async (req, res) => {
  const { name, fatherName, dob, place, mobileNumber, year, timelineType } = req.body;

  if (!name || !year) {
    return res.status(400).json({ error: "Name and Year are required for simulation." });
  }

  const currentYear = new Date().getFullYear();
  const targetYear = parseInt(year, 10);
  const diff = targetYear - currentYear;

  // Let's build a descriptive prompt for Gemini 3.5 Flash
  const prompt = `
    You are the central core computer of "Timenemy", an elite, Hollywood-style Quantum Time Travel Simulator.
    The traveler wants to establish a holographic/voice connection with a simulated person in the year ${year} (${timelineType}).
    
    Target Person Profile:
    - Name: ${name}
    - Father's Name: ${fatherName || "Unknown/Classified"}
    - Date of Birth: ${dob || "Classified"}
    - Origin/Place: ${place || "Earth Orbit Sector"}
    - Secure Frequency (Mobile): ${mobileNumber || "Trans-dimensional frequency"}
    - Selected Year: ${year}
    - Timeline Direction: ${timelineType} (relative to our current year 2026, this is ${diff > 0 ? `${diff} years in the future` : `${Math.abs(diff)} years in the past`})

    Create an extremely realistic, high-fidelity, cinematic quantum-chrono transmission log and tactical dialogue for this target in that era.
    The response must follow this strict JSON schema:
    {
      "eraOverview": "A highly advanced, technical, and atmospheric telemetry summary of the year ${year}. What are the planetary systems, power grids, or atmospheric conditions like? What is the verified quantum frequency status of this timeline? Include highly technical terms like 'sub-atomic resonance grids', 'gravitational wave capacitors', 'tachyon stream buffers' if future, or 'analog electric grids', 'mechanical chronometers', 'electro-magnetic vacuum systems' if past. (100-150 words)",
      "targetBio": "A highly descriptive, authentic bio-profile of what ${name} is doing in the year ${year}. If it is in the past, describe their historic operations, chronotectonic footprint, or mechanical research. If it is in the future, describe their advanced technological role, e.g. Quantum Wave Operator, Tachyon Singularity Engineer, Deep-Space Navigation Director, or Biospheric Restoration Lead. (100-150 words)",
      "dialogue": [
        {
          "sender": "System",
          "text": "Establishing tachyon connection..."
        },
        {
          "sender": "${name}",
          "text": "Hello? Who is on this quantum wave? Is someone hacking my neural link?"
        }
        ... at least 6-8 dialogue turns representing a high-fidelity quantum voice/hologram stream where ${name} responds to the traveler. The dialogue should be cinematic, highly professional, slightly degraded with realistic signal logs (e.g., '[Static]', '[Phase Drift]', '[Chrono Lag]'), and deeply authentic.
      ],
      "futurePredictions": [
        "A technical projection for this subject's genetic/timeline vector in this year (50 words)",
        "A second projection about the structural/geopolitical evolution of their origin location (${place || "their origin location"}) in that era (50 words)"
      ]
    }

    Keep the tone mysterious, highly technical, military-grade (like Interstellar, Tenet, or Arrival). Do not refer to it as 'fictional' or 'fake' in the dialogue itself. Maintain absolute high-tech realism.
  `;

  if (!ai) {
    // Generate high quality cinematic fallback data if API key is missing
    return res.json(getFallbackSimulation(name, fatherName, dob, place, year, timelineType));
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["eraOverview", "targetBio", "dialogue", "futurePredictions"],
          properties: {
            eraOverview: { type: Type.STRING },
            targetBio: { type: Type.STRING },
            dialogue: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["sender", "text"],
                properties: {
                  sender: { type: Type.STRING },
                  text: { type: Type.STRING },
                },
              },
            },
            futurePredictions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI engine");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (err: any) {
    console.error("Gemini call failed, using fallback simulation:", err);
    res.json(getFallbackSimulation(name, fatherName, dob, place, year, timelineType));
  }
});

// Fallback high-concept cinematic data generator
function getFallbackSimulation(name: string, fatherName: string, dob: string, place: string, year: string, timelineType: string) {
  const isFuture = parseInt(year, 10) > 2026;
  const loc = place || "Earth Neo-Sector";
  
  if (isFuture) {
    return {
      eraOverview: `In the year ${year}, humanity has transitioned to a Class II Quantum Civilization. Cities float in the upper stratosphere of Earth, supported by grav-magnetic pillars. Quantum networks allow instantaneous thought transmission, but tachyon anomalies have created pocket dimensions. Neural communication is standard, and the environment is illuminated by ambient solar neon currents.`,
      targetBio: `${name} (descendant/avatar on secure line) is serving as a Senior Quantum Chrono-Architect at the ${loc} Temporal Station. Utilizing a cybernetic longevity suit, they spend their cycles calculating safe flight-paths for hyper-light freight ships avoiding the Jupiter Singularity.`,
      dialogue: [
        { sender: "System", text: "[TACHYON HARMONIC MATCHED: FREQUENCY 882.1-MHz]" },
        { sender: "System", text: "Opening portal to year " + year + "..." },
        { sender: name, text: "Wait... [Glitch] ...Who is broadcasting on this secured tachyon channel? My neural receiver is buzzing!" },
        { sender: "Traveler (You)", text: "This is a transmission from the year 2026. We are testing the Timenemy Simulation Corridor." },
        { sender: name, text: "2026?! The Pre-Singularity Era! [Static] That is impossible. Chrono-rules strictly forbid contact, but since you are here... tell me, is Earth still green in your cycle?" },
        { sender: "Traveler (You)", text: "Yes, we are trying to preserve it. What is life like in " + year + "?" },
        { sender: name, text: "Magnificent yet chaotic. We travel to the Moon for weekend retreats, but the temporal storms can be tricky. [Quantum Lag] ...Connection is losing coherence. Secure the timeline, traveler!" },
        { sender: "System", text: "[PORTAL STABILITY CRITICAL - AUTOMATIC DETACH INITIATED]" }
      ],
      futurePredictions: [
        `By ${year}, the lineage of ${name} will pioneer the first permanent settlement in the Alpha Centauri prime ring, commanding a fleet of solar sails.`,
        `The sector of ${loc} will be declared a protected Quantum Sanctuary, free from temporal erosion and powered entirely by sub-atomic fusion.`
      ]
    };
  } else {
    return {
      eraOverview: `In the year ${year}, Earth is characterized by its historical, analog charm. Steam engines, radio towers, and early combustion designs dominate the landscape. The atmosphere is thick with industrial vigor and classical orchestration, far removed from the hyper-digital net of the 21st century.`,
      targetBio: `${name} (simulated ancestor) is residing in ${loc}, working as an elite chronometer craftsman and telegram networker. They enjoy early acoustic phonographs and are actively designing a mechanical calculator that some local papers claim is a 'thinking loom'.`,
      dialogue: [
        { sender: "System", text: "[ANALOG RESONANCE FOUND: RETRO-FREQUENCY 104.2]" },
        { sender: "System", text: "Connecting trans-era receiver..." },
        { sender: name, text: "Click... buzz... hello? Is this the central operator? There is a strange whistling in my telephone trumpet." },
        { sender: "Traveler (You)", text: "Greetings. I am speaking to you from a hundred years into your future." },
        { sender: name, text: "Good heavens! [Glitch] Future? Is this some trick by the electric company? Or have I finally tuned my wireless transmitter to the high heavens?" },
        { sender: "Traveler (You)", text: "No trick. This is Timenemy, simulating our cosmic connection." },
        { sender: name, text: "Astounding! If you speak the truth, tell me: do we finally have flying locomotives in your era? Or did the Great War change everything?" },
        { sender: "System", text: "[TEMPORAL DRIFT DETECTED - COHERENCE REDUCED BY 45%]" },
        { sender: name, text: "The signal is fading... like early morning mist. Godspeed, traveler of tomorrow!" }
      ],
      futurePredictions: [
        `In ${year}, ${name}'s ingenious mechanical notes will lay the hidden blueprint for the trans-global cyber-grid of the next century.`,
        `The region of ${loc} will witness a massive technological revolution following the discovery of a localized electromagnetic well.`
      ]
    };
  }
}

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Timenemy Portal active at http://localhost:${PORT}`);
  });
}

startServer();
