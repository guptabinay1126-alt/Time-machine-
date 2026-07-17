import { useState } from "react";
import { Volume2, VolumeX, Radio, Zap, RefreshCw, PhoneIncoming, AlertOctagon } from "lucide-react";
import { syn } from "../utils/audio";

export default function Soundboard() {
  const [isMuted, setIsMuted] = useState(syn.getMute());
  const [isHumming, setIsHumming] = useState(false);

  const handleMuteToggle = () => {
    const nextMute = syn.toggleMute();
    setIsMuted(nextMute);
    if (nextMute) {
      setIsHumming(false);
    }
  };

  const handleHumToggle = () => {
    if (isMuted) return;
    if (isHumming) {
      syn.stopHum();
      setIsHumming(false);
    } else {
      syn.startHum();
      setIsHumming(true);
    }
  };

  const triggerSfx = (type: "beep" | "glitch" | "sweep" | "portal" | "ring" | "established") => {
    switch (type) {
      case "beep":
        syn.playBeep();
        break;
      case "glitch":
        syn.playGlitch();
        break;
      case "sweep":
        syn.playWormholeSweep();
        break;
      case "portal":
        syn.playPortalOpen();
        break;
      case "ring":
        syn.playCallRing();
        break;
      case "established":
        syn.playConnectionEstablished();
        break;
    }
  };

  return (
    <div className="bg-slate-950/65 border border-purple-500/25 rounded-2xl p-5 backdrop-blur-md shadow-[0_0_30px_rgba(139,92,246,0.15)]" id="soundboard-matrix">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <h3 className="text-sm font-mono tracking-widest text-purple-400 uppercase">Quantum Sound Deck</h3>
        </div>
        <button
          onClick={handleMuteToggle}
          className={`p-1.5 rounded-lg border transition ${
            isMuted
              ? "bg-red-950/40 border-red-500/40 text-red-400"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
          title={isMuted ? "Unmute All Sounds" : "Mute All Sounds"}
          id="sound-mute-btn"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Ambient Hum Toggle */}
        <button
          onClick={handleHumToggle}
          disabled={isMuted}
          className={`flex items-center justify-between px-4 py-3 rounded-xl border font-mono text-xs transition relative overflow-hidden ${
            isMuted
              ? "bg-slate-950/20 border-slate-900 text-slate-600 cursor-not-allowed"
              : isHumming
              ? "bg-purple-950/30 border-purple-500/80 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-purple-500/50 hover:text-white"
          }`}
          id="toggle-hum-btn"
        >
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isHumming ? "animate-spin text-purple-400" : ""}`} />
            <span>Tachyon Hum</span>
          </div>
          <span className={`text-[10px] uppercase ${isHumming ? "text-purple-400 animate-pulse" : "text-slate-500"}`}>
            {isHumming ? "ACTIVE" : "OFFLINE"}
          </span>
        </button>

        {/* Glitch Static Sfx */}
        <button
          onClick={() => triggerSfx("glitch")}
          disabled={isMuted}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/50 font-mono text-xs text-slate-400 hover:border-slate-700 hover:text-white transition disabled:opacity-40"
          id="sfx-glitch-btn"
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Tachyon Static</span>
        </button>
      </div>

      {/* Grid of micro-soundboards */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => triggerSfx("beep")}
          disabled={isMuted}
          className="py-2.5 rounded-lg border border-slate-900 bg-slate-950/40 font-mono text-[10px] text-slate-400 hover:border-slate-800 hover:text-white transition disabled:opacity-30"
          title="Navigation blip chirp"
          id="sfx-blip-btn"
        >
          BLIP
        </button>
        <button
          onClick={() => triggerSfx("sweep")}
          disabled={isMuted}
          className="py-2.5 rounded-lg border border-slate-900 bg-slate-950/40 font-mono text-[10px] text-slate-400 hover:border-slate-800 hover:text-white transition disabled:opacity-30"
          title="Wormhole acceleration sweep"
          id="sfx-sweep-btn"
        >
          SWEEP
        </button>
        <button
          onClick={() => triggerSfx("portal")}
          disabled={isMuted}
          className="py-2.5 rounded-lg border border-slate-900 bg-slate-950/40 font-mono text-[10px] text-slate-400 hover:border-slate-800 hover:text-white transition disabled:opacity-30"
          title="Tachyon portal discharge pulse"
          id="sfx-portal-btn"
        >
          PORTAL
        </button>
        <button
          onClick={() => triggerSfx("ring")}
          disabled={isMuted}
          className="py-2.5 rounded-lg border border-slate-900 bg-slate-950/40 font-mono text-[10px] text-slate-400 hover:border-slate-800 hover:text-white transition disabled:opacity-30"
          title="Holographic phone ring"
          id="sfx-ring-btn"
        >
          RING
        </button>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 justify-center">
        <AlertOctagon size={11} className="text-purple-500/60" />
        <span>Audio synthesized in real-time via Web Audio Oscillators</span>
      </div>
    </div>
  );
}
