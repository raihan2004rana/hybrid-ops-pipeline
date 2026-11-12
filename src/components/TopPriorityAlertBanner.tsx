"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Volume2,
  VolumeX,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { Lead } from "@/types/pipeline";
import { soundEngine } from "@/lib/audioAlert";

interface TopPriorityAlertBannerProps {
  hotLeads: Lead[];
  onSelectLead: (lead: Lead) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function TopPriorityAlertBanner({
  hotLeads,
  onSelectLead,
  soundEnabled,
  onToggleSound,
}: TopPriorityAlertBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const ultraHotLeads = hotLeads.filter((l) => l.score >= 85);

  if (ultraHotLeads.length === 0 || isDismissed) {
    return null;
  }

  const activeLead = ultraHotLeads[currentIndex % ultraHotLeads.length];

  const handleNext = () => {
    soundEngine.playGlassClick();
    setCurrentIndex((prev) => (prev + 1) % ultraHotLeads.length);
  };

  const handlePrev = () => {
    soundEngine.playGlassClick();
    setCurrentIndex((prev) => (prev - 1 + ultraHotLeads.length) % ultraHotLeads.length);
  };

  return (
    <div className="relative z-20 w-full mb-6">
      {/* Ambient Top Glow in soft rose-fuchsia light */}
      <div className="absolute -top-10 inset-x-0 h-28 bg-gradient-to-b from-rose-400/25 via-fuchsia-400/15 to-transparent blur-2xl pointer-events-none" />

      {/* Vibrant Aurora Glass Warning Container */}
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12 }}
        className="relative overflow-hidden rounded-2xl backdrop-blur-2xl bg-gradient-to-r from-rose-100/95 via-fuchsia-50/90 to-amber-100/95 border-2 border-rose-300 shadow-[0_12px_36px_0_rgba(244,63,94,0.18),inset_0_1px_2px_rgba(255,255,255,1)] p-4"
      >
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Left: Pulsing Badge & Notification Text */}
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {/* Animated pulsating radar ping icon */}
            <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
              <span className="absolute inset-0 rounded-full bg-rose-400/40 animate-ping" />
              <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 shadow-[0_4px_16px_rgba(244,63,94,0.4)] text-white">
                <Flame size={18} className="animate-pulse" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-black tracking-widest uppercase bg-rose-500 text-white rounded-full shadow-sm">
                  🚨 HIGH-CONVERTING PROSPECT DETECTED
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-violet-100 text-violet-800 border border-violet-300 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles size={11} className="text-violet-600" />
                  SCORE {activeLead.score}/100
                </span>
                {ultraHotLeads.length > 1 && (
                  <span className="text-[10px] text-slate-600 font-mono font-bold">
                    ({(currentIndex % ultraHotLeads.length) + 1} of {ultraHotLeads.length})
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-2 text-sm md:text-base font-semibold text-slate-900 truncate">
                <span className="text-slate-950 font-black">{activeLead.companyName}</span>
                <span className="text-slate-400 font-normal hidden sm:inline">•</span>
                <span className="text-rose-700 text-xs md:text-sm font-bold truncate">
                  Needs immediate contact — {activeLead.bottleneck.type}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons & Controls */}
          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            {/* Lead switcher if multiple */}
            {ultraHotLeads.length > 1 && (
              <div className="flex items-center bg-white border border-rose-200 rounded-xl p-0.5 shadow-sm">
                <button
                  onClick={handlePrev}
                  className="p-1 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                  title="Previous Hot Lead"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                  title="Next Hot Lead"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-all shadow-sm ${
                soundEnabled
                  ? "bg-rose-500 text-white border-rose-600 shadow-[0_2px_10px_rgba(244,63,94,0.3)]"
                  : "bg-white border-slate-200 text-slate-500 hover:text-slate-900"
              }`}
              title={soundEnabled ? "Radar Audio Ping Enabled" : "Radar Audio Ping Muted"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Action CTA: Open Drawer */}
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                onSelectLead(activeLead);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-xl shadow-[0_4px_18px_rgba(244,63,94,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Initiate Outreach</span>
              <ArrowRight size={14} />
            </button>

            {/* Dismiss */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-rose-100/50 rounded-xl transition"
              title="Dismiss Alert"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
