import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Globe, Clock } from "lucide-react";

interface WormholePortalProps {
  isConnecting: boolean;
  isConnected: boolean;
  targetYear: number;
}

export default function WormholePortal({ isConnecting, isConnected, targetYear }: WormholePortalProps) {
  const [systemTime, setSystemTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setSystemTime(
        d.toLocaleTimeString("en-US", { hour12: false }) +
        "." +
        String(d.getMilliseconds()).padStart(3, "0")
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 45);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[380px] mx-auto flex items-center justify-center p-4 select-none" id="wormhole-portal-container">
      {/* Outer Glow Halo Ring */}
      <div
        className={`absolute inset-0 rounded-full blur-[35px] opacity-40 transition-all duration-1000 ${
          isConnecting
            ? "bg-cyan-500 scale-110 animate-pulse"
            : isConnected
            ? "bg-purple-500 scale-105"
            : "bg-blue-500/50 scale-95"
        }`}
      />

      {/* Futuristic Orbit Rings */}
      <svg className="absolute w-full h-full animate-spin-slow pointer-events-none" viewBox="0 0 100 100">
        {/* Ring 1 - Outer Cyber Grid */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="url(#blue-cyan-gradient)"
          strokeWidth="0.5"
          strokeDasharray="4 8 1 2"
          className="opacity-60"
        />
        {/* Ring 2 - Mid Ring with tachyon segments */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="url(#purple-magenta-gradient)"
          strokeWidth="0.8"
          strokeDasharray="20 4 5 1"
          className="opacity-70 animate-reverse-spin"
          style={{ transformOrigin: "center", animationDuration: "12s" }}
        />
        {/* Ring 3 - Inner lock ring */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="0.3"
          strokeDasharray="1 3"
          className="opacity-40 animate-spin-fast"
          style={{ transformOrigin: "center", animationDuration: "5s" }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="blue-cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="purple-magenta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Realistic Rotating Earth / Quantum Core Sphere */}
      <div
        className={`relative w-[60%] aspect-square rounded-full flex items-center justify-center transition-all duration-1000 overflow-hidden ${
          isConnecting
            ? "border-[3px] border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.8)] scale-110"
            : isConnected
            ? "border-[2px] border-purple-500 shadow-[0_0_35px_rgba(168,85,247,0.6)]"
            : "border border-blue-500/45 bg-slate-950/80 shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]"
        }`}
        id="quantum-portal-core"
      >
        {/* Earth Image / Holo globe layer */}
        <div className="absolute inset-0 flex items-center justify-center opacity-75">
          <Globe
            className={`w-[75%] h-[75%] text-cyan-400/80 transition-all duration-[20000ms] ${
              isConnecting
                ? "animate-spin-fast text-cyan-300"
                : isConnected
                ? "animate-spin-slow text-purple-400"
                : "animate-spin-slow"
            }`}
            strokeWidth={1}
          />
        </div>

        {/* Warp tunnel speed lines effect overlay */}
        {isConnecting && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,182,212,0.15)_60%,rgba(6,182,212,0.6)_100%)] animate-pulse" />
        )}
        
        {/* Central Core Hologram Glow */}
        <div
          className={`absolute w-6 h-6 rounded-full blur-[5px] transition-all duration-500 ${
            isConnecting ? "bg-white scale-150 animate-ping" : isConnected ? "bg-purple-300" : "bg-cyan-500/50"
          }`}
        />
      </div>

      {/* Cybernetic Digital HUD overlay around the wormhole */}
      <div className="absolute top-0 left-0 text-[10px] font-mono text-cyan-500/80 bg-slate-950/70 border border-cyan-500/20 px-2 py-0.5 rounded backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.1)]">
        SYS.TCH: LIVE
      </div>

      <div className="absolute bottom-0 right-0 text-[10px] font-mono text-purple-500/80 bg-slate-950/70 border border-purple-500/20 px-2 py-0.5 rounded backdrop-blur-sm shadow-[0_0_10px_rgba(168,85,247,0.1)] flex items-center gap-1">
        <Clock size={10} className="text-purple-400" />
        <span>{systemTime}</span>
      </div>

      {/* Spatial Coords Indicator */}
      <div className="absolute bottom-0 left-0 text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none text-left">
        LAT: 28.6139° N <br />
        LON: 77.2090° E <br />
        GRID: {isConnecting ? "SINGULARITY_WARP" : isConnected ? "TCH_PORTAL_LOCK" : "STABLE_PREHorizon"}
      </div>

      {/* Temporal Year Display */}
      <div className="absolute top-0 right-0 text-right">
        <span className="text-[9px] font-mono text-slate-500 block uppercase">TARGET RANGE</span>
        <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
          {isConnected || isConnecting ? `${targetYear} AD` : "2026 NOW"}
        </span>
      </div>
    </div>
  );
}
