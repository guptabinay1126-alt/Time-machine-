import React from "react";
import { motion } from "motion/react";
import { TimelineEvent } from "../types";
import { syn } from "../utils/audio";

interface ChronoTimelineProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 1900,
    title: "Tesla Magnets Active",
    description: "Nikola Tesla initializes Wardenclyffe Tower, launching early electromagnetic tachyon waves.",
    type: "past",
  },
  {
    year: 1943,
    title: "Philadelphia Echoes",
    description: "Classified military tests register temporary optical distortion and quantum drift in naval vessel fields.",
    type: "past",
  },
  {
    year: 1969,
    title: "Lunar Tachyon Core",
    description: "Apollo astronauts place retroreflectors, unwittingly establishing a permanent timeline anchor.",
    type: "past",
  },
  {
    year: 1999,
    title: "Digital Singularity Buffer",
    description: "The global network expands, synchronizing carbon minds to the first early digital cyber-grid.",
    type: "past",
  },
  {
    year: 2026,
    title: "Timenemy Activation",
    description: "The primary Quantum portal simulator is made public to coordinate simulated communication with distant timelines.",
    type: "future", // Border line
  },
  {
    year: 2050,
    title: "Ares Sub-Space Colony",
    description: "First atmospheric bubble dome completed on Mars, linked via tachyon quantum radio.",
    type: "future",
  },
  {
    year: 2100,
    title: "Bio-Net & Longevity V1",
    description: "Nanite cell repair extends life cycles indefinitely; human-machine neural interfaces become universal.",
    type: "future",
  },
  {
    year: 2150,
    title: "Interstellar Warp Fleet",
    description: "Tachyon-shielded research cruisers depart Earth to map gravitational rifts in the Kepler sector.",
    type: "future",
  },
  {
    year: 2200,
    title: "Sol Dyson Sphere Swarm",
    description: "Sol star surrounded by stellar energy-capturing orbital grids. Portal matrix fully operational.",
    type: "future",
  },
];

export default function ChronoTimeline({ selectedYear, onYearChange }: ChronoTimelineProps) {
  // Find closest event to show as an active milestone highlight
  const activeEvent = timelineEvents.reduce((prev, curr) => {
    return Math.abs(curr.year - selectedYear) < Math.abs(prev.year - selectedYear) ? curr : prev;
  });

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onYearChange(val);
    if (val % 10 === 0) {
      syn.playBeep();
    }
  };

  const selectMilestone = (year: number) => {
    onYearChange(year);
    syn.playConnectionEstablished();
  };

  return (
    <div className="w-full bg-slate-950/65 border border-cyan-500/25 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.15)]" id="chrono-timeline">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-sm font-mono tracking-widest text-cyan-400 uppercase">Interactive Timeline Slider</h3>
        </div>
        <div className="text-right">
          <span className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 tracking-widest animate-pulse">
            YEAR: {selectedYear}
          </span>
          <p className="text-[10px] font-mono text-slate-400 uppercase">
            {selectedYear < 2026 ? "✦ Past Historical Corridor" : selectedYear === 2026 ? "✦ Present Horizon Point" : "✦ Future Quantum Vector"}
          </p>
        </div>
      </div>

      {/* Slider Range */}
      <div className="relative mb-8 mt-2">
        <input
          type="range"
          min="1900"
          max="2200"
          value={selectedYear}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-800"
        />
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-mono text-slate-500">
          <span>1900 AD</span>
          <span>1950</span>
          <span>2000</span>
          <span className="text-cyan-400 font-bold">2026 (NOW)</span>
          <span>2100</span>
          <span>2150</span>
          <span>2200 AD</span>
        </div>
      </div>

      {/* Interactive Milestones Dots */}
      <div className="grid grid-cols-9 gap-1 pt-3 mb-6 border-t border-slate-900">
        {timelineEvents.map((ev) => {
          const isSelected = selectedYear === ev.year;
          const isPast = ev.year < 2026;
          return (
            <button
              key={ev.year}
              onClick={() => selectMilestone(ev.year)}
              className="flex flex-col items-center group transition focus:outline-none"
              id={`timeline-btn-${ev.year}`}
            >
              <div
                className={`w-3 h-3 rounded-full mb-1 transition-all duration-300 ${
                  isSelected
                    ? "bg-cyan-400 scale-125 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                    : "bg-slate-800 group-hover:bg-cyan-500/60"
                }`}
              />
              <span
                className={`text-[9px] font-mono transition-colors ${
                  isSelected ? "text-cyan-400 font-bold" : "text-slate-500 group-hover:text-slate-300"
                }`}
              >
                {ev.year}
              </span>
            </button>
          );
        })}
      </div>

      {/* Event Details Panel */}
      <motion.div
        key={activeEvent.year}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/80 flex items-start gap-4"
      >
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono text-sm font-bold border ${
              activeEvent.type === "past"
                ? "bg-purple-950/30 border-purple-500/40 text-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.15)]"
                : "bg-cyan-950/30 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            }`}
          >
            {activeEvent.year}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-mono font-bold text-slate-200 tracking-wider flex items-center gap-2">
            {activeEvent.title}
            <span
              className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                activeEvent.type === "past"
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                  : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
              }`}
            >
              {activeEvent.type}
            </span>
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{activeEvent.description}</p>
        </div>
      </motion.div>
    </div>
  );
}
