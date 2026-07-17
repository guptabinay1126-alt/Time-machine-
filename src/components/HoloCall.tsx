import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, PhoneOff, Wifi, Video, ShieldAlert, Cpu, Layers } from "lucide-react";
import { DialogueLine, TravelerProfile } from "../types";
import { syn } from "../utils/audio";

interface HoloCallProps {
  profile: TravelerProfile;
  dialogue: DialogueLine[];
  onDisconnect: () => void;
  isIncoming: boolean;
  onAccept: () => void;
}

export default function HoloCall({ profile, dialogue, onDisconnect, isIncoming, onAccept }: HoloCallProps) {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [displayedDialogue, setDisplayedDialogue] = useState<DialogueLine[]>([]);
  const [countdown, setCountdown] = useState(90); // 1:30 portal stability countdown
  const [equalizerHeights, setEqualizerHeights] = useState<number[]>(Array(12).fill(10));
  const [glitchActive, setGlitchActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Play incoming ringtone loop when incoming
  useEffect(() => {
    if (isIncoming) {
      syn.playCallRing();
      const ringInterval = setInterval(() => {
        syn.playCallRing();
      }, 2000);
      return () => clearInterval(ringInterval);
    }
  }, [isIncoming]);

  // Handle active conversation timeline pacing
  useEffect(() => {
    if (!isIncoming && dialogue.length > 0) {
      // Start with the first line
      setDisplayedDialogue([dialogue[0]]);
      setCurrentDialogueIndex(0);

      const interval = setInterval(() => {
        setCurrentDialogueIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < dialogue.length) {
            // Trigger static glitch sfx on new speaker
            syn.playGlitch();
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 200);

            setDisplayedDialogue((prev) => [...prev, dialogue[nextIndex]]);
            return nextIndex;
          } else {
            clearInterval(interval);
            return prevIndex;
          }
        });
      }, 4000); // Progress dialogue every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isIncoming, dialogue]);

  // Auto scroll dialogue chat feed
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedDialogue]);

  // Audio Equalizer effect
  useEffect(() => {
    if (!isIncoming) {
      const eqInterval = setInterval(() => {
        setEqualizerHeights(
          Array(12)
            .fill(0)
            .map(() => Math.floor(Math.random() * 45) + 5)
        );
      }, 100);
      return () => clearInterval(eqInterval);
    }
  }, [isIncoming]);

  // Portal Collapse Countdown Timer
  useEffect(() => {
    if (!isIncoming) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onDisconnect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isIncoming, onDisconnect]);

  // Formatting countdown
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  const activeSpeaker = displayedDialogue[displayedDialogue.length - 1];

  return (
    <div className="w-full" id="holo-call-interface">
      <AnimatePresence mode="wait">
        {isIncoming ? (
          /* ================= INCOMING CALL VIEW ================= */
          <motion.div
            key="incoming-call"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-slate-950/85 border border-cyan-500/40 rounded-2xl p-6 backdrop-blur-xl text-center max-w-[450px] mx-auto shadow-[0_0_50px_rgba(6,182,212,0.3)]"
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-40" />
              <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-pulse" />
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 bg-cyan-500 text-slate-950 p-1.5 rounded-full shadow-lg">
                <Video size={14} className="animate-pulse" />
              </div>
            </div>

            <span className="text-[10px] font-mono tracking-widest text-cyan-400 animate-pulse block uppercase mb-1">
              INCOMING TACHYON FREQUENCY
            </span>
            <h3 className="text-xl font-mono font-bold text-slate-100 tracking-wider">
              {profile.name}
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase">
              Year: {profile.year} AD ✦ Sector: {profile.place || "Earth Orbit"}
            </p>

            <div className="mt-6 flex justify-center gap-6">
              {/* Reject button */}
              <button
                onClick={() => {
                  syn.playBeep();
                  onDisconnect();
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-950/30 border border-red-500/50 hover:bg-red-900/40 text-red-400 rounded-xl font-mono text-xs uppercase tracking-wider transition transform active:scale-95 cursor-pointer"
                id="reject-call-btn"
              >
                <PhoneOff size={14} />
                <span>Abort Lock</span>
              </button>

              {/* Accept button */}
              <button
                onClick={() => {
                  syn.playConnectionEstablished();
                  onAccept();
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-950/40 border border-emerald-500/70 hover:bg-emerald-900/50 text-emerald-300 rounded-xl font-mono text-xs uppercase tracking-wider transition transform active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                id="accept-call-btn"
              >
                <Phone size={14} className="animate-bounce" />
                <span>Accept Link</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* ================= ACTIVE HUD TRANSMISSION VIEW ================= */
          <motion.div
            key="active-call"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Hologram Video Box Panel (Left on large screens, span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-[4/3] bg-slate-950/90 border border-purple-500/40 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(168,85,247,0.25)]">
                {/* Hologram static scan lines overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10" />

                {/* Glitch Overlay effect */}
                {glitchActive && (
                  <div className="absolute inset-0 bg-purple-500/20 mix-blend-color-dodge z-10 animate-pulse pointer-events-none" />
                )}

                {/* Dynamic Radar grid scanning line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400/70 shadow-[0_0_10px_#06b6d4] animate-scan z-10 pointer-events-none" />

                {/* Hologram video picture */}
                <div className="w-full h-full relative">
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className={`w-full h-full object-cover grayscale opacity-80 mix-blend-screen transition-all ${
                      glitchActive ? "skew-x-6 scale-110 filter hue-rotate-90" : ""
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {/* Glowing blue-purple hologram filter mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/50 via-cyan-950/20 to-transparent pointer-events-none" />
                </div>

                {/* Secure watermark label */}
                <div className="absolute top-3 left-3 bg-slate-950/70 border border-purple-500/25 px-2 py-0.5 rounded text-[9px] font-mono text-purple-400 flex items-center gap-1">
                  <Wifi size={10} className="text-purple-400 animate-pulse" />
                  <span>SECURE_LINK: MATCH_99X</span>
                </div>

                {/* Portal Countdown HUD */}
                <div className="absolute top-3 right-3 bg-red-950/50 border border-red-500/40 px-2.5 py-0.5 rounded text-[9px] font-mono text-red-400 flex items-center gap-1.5 animate-pulse">
                  <ShieldAlert size={10} />
                  <span>COLLAPSE: {formatTime(countdown)}</span>
                </div>

                {/* Video Bottom overlay with voice equalizer bands */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div className="text-left font-mono text-[9px] text-cyan-400/80 bg-slate-950/80 p-1.5 rounded border border-cyan-500/10">
                    <p>FREQ: 981.3 T-Hz</p>
                    <p>LAG: ~0.043s Tachyon</p>
                  </div>

                  {/* Equalizer Visualizer Bars */}
                  <div className="flex gap-0.5 items-end h-8 bg-slate-950/60 px-2 py-1 rounded border border-purple-500/15">
                    {equalizerHeights.map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-cyan-400 rounded-t"
                        style={{ height: `${h}%`, transition: "height 0.1s ease" }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Subtitles box below the hologram */}
              <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-3 font-mono text-center">
                <span className="text-[9px] uppercase tracking-wider text-cyan-400 block mb-1">
                  {activeSpeaker?.sender === profile.name ? "🟢 ACTIVE TRANSMISSION" : "SYSTEM MESSAGE"}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{activeSpeaker?.text || "Synchronizing quantum transceiver nodes..."}"
                </p>
              </div>
            </div>

            {/* Conversation Dialog Feed Panel (Right, span 7) */}
            <div className="lg:col-span-7 flex flex-col bg-slate-950/65 border border-cyan-500/25 rounded-2xl p-5 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.15)] h-[380px]">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                  <span className="text-xs font-mono tracking-wider text-cyan-400 uppercase">Trans-Temporal Voice Feed</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">YEAR {profile.year}</span>
              </div>

              {/* Scrolling chat feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {displayedDialogue.map((chat, idx) => {
                  const isTarget = chat.sender === profile.name;
                  const isSystem = chat.sender === "System";
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        isSystem ? "items-center text-center" : isTarget ? "items-start" : "items-end"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs font-mono leading-relaxed ${
                          isSystem
                            ? "bg-slate-900/60 border border-slate-800 text-purple-400 text-[10px] uppercase tracking-wider"
                            : isTarget
                            ? "bg-cyan-950/30 border border-cyan-500/20 text-cyan-200 rounded-tl-none"
                            : "bg-purple-950/30 border border-purple-500/20 text-purple-200 rounded-tr-none"
                        }`}
                      >
                        {!isSystem && (
                          <span className={`block font-bold text-[9px] mb-1 ${isTarget ? "text-cyan-400" : "text-purple-400"}`}>
                            {chat.sender}
                          </span>
                        )}
                        <p>{chat.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Disconnect Action Row */}
              <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
                  <Layers size={12} className="text-purple-400 animate-pulse" />
                  <span>Timeline Lock Stabilized</span>
                </div>

                <button
                  onClick={() => {
                    syn.playBeep();
                    onDisconnect();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-950/40 border border-red-500/40 hover:bg-red-900/40 hover:text-white text-red-400 rounded-xl font-mono text-xs uppercase tracking-wider transition transform active:scale-95 cursor-pointer"
                  id="disconnect-active-btn"
                >
                  <PhoneOff size={12} />
                  <span>Collapse Portal</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
