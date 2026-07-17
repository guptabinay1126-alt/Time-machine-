import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Orbit, ShieldAlert, Sparkles, AlertTriangle, Compass, CheckCircle } from "lucide-react";
import ParticleBackground from "./components/ParticleBackground";
import ChronoTimeline from "./components/ChronoTimeline";
import Soundboard from "./components/Soundboard";
import QuantumDashboard from "./components/QuantumDashboard";
import WormholePortal from "./components/WormholePortal";
import HoloCall from "./components/HoloCall";
import { TravelerProfile, SimulationResult } from "./types";
import { syn } from "./utils/audio";

const connectionSteps = [
  "Scanning Timeline Coordinates...",
  "Quantum Engine Activated...",
  "Searching Historical Akashic Records...",
  "Opening Tachyon Time Portal...",
  "Spatial Resonance Anchored...",
  "Connection Established!",
];

export default function App() {
  const [selectedYear, setSelectedYear] = useState(2080);
  const [activeProfile, setActiveProfile] = useState<TravelerProfile | null>(null);
  const [activeState, setActiveState] = useState<"dashboard" | "connecting" | "incoming" | "active">("dashboard");
  const [connectionStepIndex, setConnectionStepIndex] = useState(0);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Fictional predicted global news logs depending on timelines
  const [globalPredictions] = useState([
    {
      year: 2035,
      title: "First Fusion Grid Online",
      text: "Global energy grids successfully link to the first commercially viable stellar-fusion battery in Rajasthan, India.",
    },
    {
      year: 2075,
      title: "Atmospheric Restoration",
      text: "Antarctic ozone anomalies are fully sealed using localized ozone-generator satellite fleets.",
    },
    {
      year: 2120,
      title: "Neuro-Net Launch",
      text: "The web is replaced by sub-conscious neural grids, enabling thoughts to be cataloged as digital postcards.",
    },
  ]);

  const handlePortalConnect = async (profile: TravelerProfile) => {
    setActiveProfile(profile);
    setActiveState("connecting");
    setConnectionStepIndex(0);

    // Trigger sweeping sounds representing portal acceleration
    syn.playWormholeSweep();

    // Start a visual sequence of step loading messages
    const stepInterval = setInterval(() => {
      setConnectionStepIndex((prev) => {
        if (prev < connectionSteps.length - 1) {
          // Play a technological blip chirp on each step
          syn.playGlitch();
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 1400);

    // Concurrently trigger Express + Gemini API simulation generation
    try {
      const response = await fetch("/api/time-travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          fatherName: profile.fatherName,
          dob: profile.dob,
          place: profile.place,
          mobileNumber: profile.mobileNumber,
          year: profile.year,
          timelineType: profile.year < 2026 ? "past" : "future",
        }),
      });

      if (!response.ok) {
        throw new Error("Tachyon network lag");
      }

      const result: SimulationResult = await response.json();
      setSimulationResult(result);

      // Once steps finish and data is ready, transition to incoming call ring
      setTimeout(() => {
        clearInterval(stepInterval);
        setActiveState("incoming");
        syn.playConnectionEstablished();
      }, 8400); // 1.4s * 6 steps = 8.4s
    } catch (e) {
      console.error("Temporal drift on API connection, resolving fallback:", e);
      // Wait for steps and then use local fallback
      setTimeout(() => {
        clearInterval(stepInterval);
        setActiveState("incoming");
      }, 8400);
    }
  };

  const handleAcceptCall = () => {
    setActiveState("active");
    syn.stopHum();
    // Start ambient portal loop
    syn.startHum();
  };

  const handleDisconnectCall = () => {
    setActiveState("dashboard");
    setActiveProfile(null);
    setSimulationResult(null);
    syn.stopHum();
  };

  return (
    <div className="relative min-h-screen bg-[#06060c] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Cinematic Particle Background */}
      <ParticleBackground
        speedFactor={activeState === "connecting" ? 8 : activeState === "active" ? 2.5 : 1}
        mode={activeState === "connecting" ? "vortex" : "idle"}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 flex-1 flex flex-col justify-between gap-8">
        {/* ================= HEADER SECTION ================= */}
        <header className="border-b border-cyan-500/15 pb-6 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(6,182,212,1)]" />
              <h1 className="text-3xl font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                TIMENEMY
              </h1>
              <span className="border border-cyan-500/30 bg-cyan-950/20 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
                TACTICAL CHRONO-PORTAL v1.2
              </span>
              <span className="border border-purple-500/30 bg-purple-950/20 px-2 py-0.5 rounded text-[9px] font-mono text-purple-400 uppercase tracking-widest">
                AUDIO DECK INTEGRATED
              </span>
            </div>

            {/* Premium Technological Description */}
            <h2 className="text-base font-semibold text-cyan-300/90 mt-2 font-sans tracking-wide">
              टाइम यात्रा अब आपके हाथ में — Quantum Tachyon Link Receiver
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Establishing real-time high-fidelity voice and video synchronization with targets across temporal boundaries.{" "}
              <strong className="text-purple-400 font-mono font-medium">Timenemy</strong> activates trans-dimensional micro-wormholes, locking onto the sub-atomic signature frequency of specified bio-targets in the past or future.
            </p>
          </div>

          {/* Current Time Station */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-center lg:text-right min-w-[200px] backdrop-blur-sm shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">TEMPORAL ANCHOR (PRESENT)</span>
            <span className="text-sm font-mono text-cyan-400 font-bold tracking-wider">
              {new Date().toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
        </header>

        {/* ================= MAIN INTERFACE DECK ================= */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {activeState === "dashboard" && (
              /* --- DASHBOARD VIEW --- */
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left side: Form controls */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <QuantumDashboard onConnect={handlePortalConnect} selectedYear={selectedYear} />
                  <ChronoTimeline selectedYear={selectedYear} onYearChange={setSelectedYear} />
                </div>

                {/* Right side: Portal & Sound effects board */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-slate-950/65 border border-cyan-500/25 rounded-2xl p-5 backdrop-blur-md shadow-[0_0_35px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center min-h-[360px]">
                    <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">Tachyon Singularity Core</span>
                    <WormholePortal isConnecting={false} isConnected={false} targetYear={selectedYear} />
                  </div>
                  <Soundboard />
                </div>
              </motion.div>
            )}

            {activeState === "connecting" && (
              /* --- CINEMATIC STEP-BY-STEP CONNECTING LOADING VIEW --- */
              <motion.div
                key="connecting-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-[650px] mx-auto bg-slate-950/80 border border-cyan-500/35 rounded-3xl p-8 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(6,182,212,0.25)] relative"
              >
                {/* Holographic light cone behind portal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/20 rounded-full blur-[60px] animate-pulse pointer-events-none" />

                <div className="mb-6">
                  <WormholePortal isConnecting={true} isConnected={false} targetYear={selectedYear} />
                </div>

                {/* Loading Status Deck */}
                <div className="space-y-4 max-w-md mx-auto">
                  <h3 className="text-sm font-mono tracking-widest text-cyan-400 uppercase animate-pulse">
                    Initiating Chrono-Folding Lock
                  </h3>

                  {/* Progressive loading bar */}
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 8.4, ease: "linear" }}
                    />
                  </div>

                  {/* Step status loop */}
                  <div className="h-10 flex items-center justify-center">
                    <motion.p
                      key={connectionStepIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm font-mono text-slate-200 tracking-wider font-semibold"
                    >
                      {connectionSteps[connectionStepIndex]}
                    </motion.p>
                  </div>

                  {/* Visual telemetry log rows */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-3 uppercase">
                    <span className="text-left">SINGULARITY: {Math.floor(Math.random() * 100) + 900}T-Hz</span>
                    <span className="text-right">COHERENCE: {85 + connectionStepIndex * 2}%</span>
                    <span className="text-left">GRAV-CONSTANT: G=9.81</span>
                    <span className="text-right">TARGET: YEAR {selectedYear} AD</span>
                  </div>
                </div>
              </motion.div>
            )}

            {(activeState === "incoming" || activeState === "active") && activeProfile && (
              /* --- HOLOCALL INCOMING AND ACTIVE SCREEN --- */
              <motion.div
                key="holocall-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-5xl mx-auto"
              >
                {/* Simulated connection status */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/80 mb-6 font-mono text-xs text-slate-300">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-400" />
                      <span className="font-bold">TRANS-TEMPORAL TUNNEL SECURED</span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase">
                      Portal: Lock-Year-{activeProfile.year}AD // Sector-{activeProfile.place || "Solar orbit"}
                    </span>
                  </div>
                  {simulationResult && (
                    <p className="mt-2 text-slate-400 leading-relaxed">
                      <strong className="text-purple-400">Timeline State Overview:</strong> {simulationResult.eraOverview}
                    </p>
                  )}
                </div>

                <HoloCall
                  profile={activeProfile}
                  dialogue={simulationResult?.dialogue || []}
                  onDisconnect={handleDisconnectCall}
                  isIncoming={activeState === "incoming"}
                  onAccept={handleAcceptCall}
                />

                {simulationResult && activeState === "active" && (
                  /* Target bio cards */
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
                  >
                    <div className="bg-slate-950/60 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-md">
                      <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Real-Time Target Chrono-Profile
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono">
                        {simulationResult.targetBio}
                      </p>
                    </div>

                    <div className="bg-slate-950/60 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-md">
                      <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Chrono-Prediction Vectors & Quantum Paths
                      </h4>
                      <ul className="space-y-3 font-mono text-xs text-slate-300">
                        {simulationResult.futurePredictions.map((pred, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-purple-400 text-[10px]">✦</span>
                            <span>{pred}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= ADDITIONAL SECTION: AI FUTURE GLOBAL PREDICTIONS GRID ================= */}
          {activeState === "dashboard" && (
            <section className="mt-12 border-t border-slate-900 pt-8" id="predictions-deck">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-purple-400 w-4 h-4 animate-pulse" />
                <h3 className="text-sm font-mono tracking-widest text-slate-300 uppercase">
                  Temporal Milestones & Worldline Matrix Log
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {globalPredictions.map((pred) => (
                  <div
                    key={pred.year}
                    className="bg-slate-950/45 border border-slate-900 rounded-xl p-4 hover:border-cyan-500/25 transition duration-300 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">YEAR {pred.year}</span>
                      <span className="text-[8px] font-mono border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 px-1.5 py-0.5 rounded uppercase">
                        COHERENCE LOCK
                      </span>
                    </div>
                    <h4 className="text-xs font-mono font-semibold text-slate-200 uppercase mb-1">{pred.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">{pred.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ================= DIAGNOSTICS TELEMETRY PANEL ================= */}
        {/* Replacing the entertainment disclaimer with highly futuristic diagnostic real-time feed */}
        <footer className="mt-8 border-t border-slate-900 pt-6 flex flex-col gap-4">
          <div className="bg-cyan-950/10 border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <div className="text-left font-mono text-xs">
                <p className="text-slate-200 font-bold uppercase tracking-wider">TACHYON FIELD HARMONIZER STATUS: ONLINE</p>
                <p className="text-[10px] text-slate-500 uppercase">Synchronized with core reactor sector-9. Frequency coherence matches standard universal constant.</p>
              </div>
            </div>
            
            {/* Real-time looking values */}
            <div className="flex gap-4 text-[10px] font-mono text-slate-400">
              <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-900">
                <span className="text-slate-500 block uppercase text-[8px]">PORTAL FLUX</span>
                <span className="text-cyan-400 font-bold">144.92 kEV</span>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-900">
                <span className="text-slate-500 block uppercase text-[8px]">GRAVITY CURV</span>
                <span className="text-purple-400 font-bold">8.122 / G</span>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-900">
                <span className="text-slate-500 block uppercase text-[8px]">DRIFT MATRIX</span>
                <span className="text-emerald-400 font-bold">&lt; 0.0003%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-600 gap-2">
            <span>Timenemy Quantum Portal © 2026. Powered by Google Gemini-3.5-Flash Core. All rights reserved.</span>
            <span>SECURE TRANS-CORRIDOR INTRUSION DETECTOR ACTIVE</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
