import React, { useState, useRef } from "react";
import { Upload, User, Globe, Calendar, Phone, Landmark, Orbit } from "lucide-react";
import { TravelerProfile } from "../types";
import { syn } from "../utils/audio";

interface QuantumDashboardProps {
  onConnect: (profile: TravelerProfile) => void;
  selectedYear: number;
}

export default function QuantumDashboard({ onConnect, selectedYear }: QuantumDashboardProps) {
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [place, setPlace] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Default avatars if no image uploaded
  const defaultQuantumAvatar = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80";

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotoUrl(e.target.result as string);
          syn.playConnectionEstablished();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    syn.playBeep();
    
    onConnect({
      name,
      fatherName,
      dob,
      place,
      mobileNumber,
      photoUrl: photoUrl || defaultQuantumAvatar,
      year: selectedYear,
    });
  };

  return (
    <div className="bg-slate-950/60 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.1)]" id="quantum-control-panel">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
        <Orbit className="text-cyan-400 animate-spin-slow w-5 h-5" />
        <h2 className="text-base font-mono font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase">
          Tachyon Navigation Dashboard
        </h2>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Name & Father's Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <User size={11} className="text-cyan-400" /> Target Person Name <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Sarabhai"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/80 rounded-xl px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
              id="input-name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Landmark size={11} className="text-purple-400" /> Father's Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ambalal Sarabhai"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-purple-500/80 rounded-xl px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
              id="input-father"
            />
          </div>
        </div>

        {/* Date of Birth & Place */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Calendar size={11} className="text-cyan-400" /> Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/80 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none transition duration-200 font-mono"
              id="input-dob"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Globe size={11} className="text-purple-400" /> Place of Origin
            </label>
            <input
              type="text"
              placeholder="e.g. Ahmedabad, India"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-purple-500/80 rounded-xl px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
              id="input-place"
            />
          </div>
        </div>

        {/* Mobile Frequency & Dynamic Selected Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Phone size={11} className="text-cyan-400" /> Chrono-Frequency (Mobile)
            </label>
            <input
              type="tel"
              placeholder="e.g. +91 9988776655"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/80 rounded-xl px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
              id="input-mobile"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Orbit size={11} className="text-purple-400" /> Selected Warp Year
            </label>
            <div className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-cyan-400 font-mono font-bold">
              {selectedYear} AD ({selectedYear < 2026 ? "PAST TIMELINE CORRIDOR" : selectedYear === 2026 ? "PRESENT TRANSCEIVER" : "FUTURE TIMELINE VECTOR"})
            </div>
          </div>
        </div>

        {/* Combined Drag & Drop File Upload Pattern */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            Holographic Avatar Matrix Upload
          </label>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[100px] ${
              isDragging
                ? "border-cyan-400 bg-cyan-950/25"
                : photoUrl
                ? "border-purple-500/50 bg-purple-950/10"
                : "border-slate-800 bg-slate-900/20 hover:border-cyan-500/35 hover:bg-slate-900/40"
            }`}
            id="avatar-dropzone"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            {photoUrl ? (
              <div className="flex items-center gap-3 w-full justify-center">
                <img
                  src={photoUrl}
                  alt="Quantum target preview"
                  className="w-12 h-12 rounded-lg object-cover border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <p className="text-xs font-mono text-purple-400 font-bold">Spectral Avatar Locked</p>
                  <p className="text-[9px] font-mono text-slate-500">Click or drag new file to recalibrate</p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 text-slate-500 mb-1 animate-bounce" />
                <p className="text-xs font-mono text-slate-300">Drag & drop photo here, or click to upload</p>
                <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">Supports JPG, PNG, WEBP</p>
              </>
            )}
          </div>
        </div>

        {/* Submit 3D Cyber Button */}
        <button
          type="submit"
          className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-slate-100 font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-95 transform active:scale-[0.98] transition shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-cyan-300/20 cursor-pointer text-center"
          id="connect-portal-btn"
        >
          Activate Quantum Connection Engine ✦
        </button>
      </form>
    </div>
  );
}
