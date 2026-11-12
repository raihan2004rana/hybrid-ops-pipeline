"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Radar as RadarIcon,
  Flame,
  Volume2,
  VolumeX,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Lead } from "@/types/pipeline";
import { soundEngine } from "@/lib/audioAlert";

interface HotRadarViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function HotRadarView({
  leads,
  onSelectLead,
  soundEnabled,
  onToggleSound,
}: HotRadarViewProps) {
  const hotLeads = leads.filter((l) => l.score >= 80).sort((a, b) => b.score - a.score);
  const [activeBlip, setActiveBlip] = useState<Lead | null>(hotLeads[0] || null);

  const triggerSonarSweep = () => {
    soundEngine.playRadarPing(0.35);
  };

  const getCoordinates = (score: number, index: number, total: number) => {
    const normalized = Math.max(0, Math.min(1, (100 - score) / 20));
    const r = 45 + normalized * 115;
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = 200 + r * Math.cos(angle);
    const y = 200 + r * Math.sin(angle);
    return { x, y, r };
  };

  return (
    <div className="space-y-6">
      {/* Top HUD Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50/90 via-pink-50/80 to-purple-50/90 border border-rose-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 shadow-2xs">
              <RadarIcon size={18} className="animate-spin" style={{ animationDuration: "12s" }} />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">
              Priority Hot Lead Radar &amp; Telemetry
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-rose-100 text-rose-700 border border-rose-300 rounded-full animate-pulse">
              {hotLeads.length} TARGETS LOCKED
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Real-time acoustic sonar surveillance tracking leads with score &ge; 80
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerSonarSweep}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition shadow-xs"
          >
            <Volume2 size={15} className="text-indigo-600" />
            <span>Ping Sonar</span>
          </button>

          <button
            onClick={onToggleSound}
            className={`p-2.5 rounded-xl border transition shadow-xs ${
              soundEnabled
                ? "bg-rose-100 border-rose-300 text-rose-700"
                : "bg-white border-slate-200 text-slate-400"
            }`}
            title={soundEnabled ? "Audio Sonar Active" : "Audio Sonar Muted"}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>
      </div>

      {/* Main Grid: Polar Sonar Radar on Left, Priority Queue on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Radar HUD Canvas */}
        <div className="lg:col-span-7 rounded-2xl backdrop-blur-xl bg-white/75 p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.05)] flex flex-col items-center justify-center relative overflow-hidden min-h-[480px]">
          {/* Sonar Canvas Container */}
          <div className="relative w-[400px] h-[400px] flex items-center justify-center">
            {/* Concentric Sonar Range Circles */}
            {[50, 90, 130, 170].map((radius, idx) => (
              <div
                key={radius}
                className="absolute rounded-full border border-indigo-300/40"
                style={{
                  width: radius * 2,
                  height: radius * 2,
                }}
              >
                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-indigo-600 font-bold select-none">
                  {idx === 0 ? "95+" : idx === 1 ? "90+" : idx === 2 ? "85+" : "80+"}
                </span>
              </div>
            ))}

            {/* Radar Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-indigo-200/50 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-indigo-200/50 pointer-events-none" />

            {/* Bullseye glowing center */}
            <div className="absolute w-5 h-5 rounded-full bg-violet-100 border border-violet-400 shadow-[0_0_15px_#8b5cf6] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
            </div>

            {/* Rotating Sonar Beam Sweep */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="w-full h-full animate-radar-sweep origin-center bg-[conic-gradient(from_0deg,transparent_0deg,transparent_310deg,rgba(99,102,241,0.22)_360deg)]" />
            </div>

            {/* Radar Target Blips */}
            {hotLeads.map((lead, i) => {
              const { x, y } = getCoordinates(lead.score, i, hotLeads.length);
              const isSelected = activeBlip?.id === lead.id;

              return (
                <div
                  key={lead.id}
                  style={{
                    left: x - 12,
                    top: y - 12,
                  }}
                  className="absolute z-20 cursor-pointer"
                  onClick={() => {
                    soundEngine.playRadarPing(0.2);
                    setActiveBlip(lead);
                  }}
                >
                  <span className="absolute -inset-2 rounded-full border border-rose-400/50 animate-ping pointer-events-none" />

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-xs ${
                      isSelected
                        ? "bg-rose-500 text-white scale-125 shadow-[0_0_20px_#f43f5e] ring-2 ring-indigo-500"
                        : "bg-rose-600 text-white hover:scale-110 shadow-[0_0_10px_#f43f5e]"
                    }`}
                  >
                    <Flame size={12} className="animate-pulse" />
                  </div>

                  <div className="absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-2 py-1 rounded-md border border-slate-200 text-[10px] text-slate-800 font-mono pointer-events-none shadow-md font-semibold">
                    {lead.companyName.split(" ")[0]} ({lead.score})
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] font-mono text-indigo-700 font-semibold">
              POLAR RANGE: PROSPECTS POSITIONED BY CONVERSION SCORE &amp; PIPELINE PROXIMITY
            </span>
          </div>
        </div>

        {/* Selected Prospect Focus Card & Priority Queue */}
        <div className="lg:col-span-5 space-y-4">
          {activeBlip ? (
            <motion.div
              key={activeBlip.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl backdrop-blur-xl bg-white/90 border border-rose-200 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-full flex items-center gap-1.5">
                  <Flame size={12} className="animate-pulse text-rose-500" />
                  RADAR LOCKED • SCORE {activeBlip.score}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  ${activeBlip.dealValue.toLocaleString()} Deal Value
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{activeBlip.companyName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeBlip.location} • {activeBlip.industry}
                </p>
              </div>

              {/* Identified Defect */}
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                <div className="text-[10px] font-mono font-bold text-rose-700 uppercase">
                  High Impact Bottleneck:
                </div>
                <div className="text-xs text-slate-800 font-bold mt-0.5">
                  {activeBlip.bottleneck.title}
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>PageSpeed: <strong className="text-rose-600">{activeBlip.bottleneck.metrics.pageSpeedMobile}/100</strong></span>
                  <span className="text-emerald-600 font-bold">
                    {activeBlip.bottleneck.metrics.lostRevenueMonthly} lost
                  </span>
                </div>
              </div>

              {/* Decision Maker */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <img
                  src={activeBlip.decisionMaker.avatarUrl}
                  alt={activeBlip.decisionMaker.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {activeBlip.decisionMaker.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {activeBlip.decisionMaker.title}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    soundEngine.playGlassClick();
                    onSelectLead(activeBlip);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs glass-button-primary"
                >
                  <span>Launch Cold Outreach Drawer</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ) : null}

          {/* Priority Queue List */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/75 p-4 border border-slate-200/80 shadow-xs space-y-2">
            <h4 className="text-xs font-bold font-mono text-slate-600 uppercase tracking-wider mb-2">
              Hot Priority Queue ({hotLeads.length})
            </h4>

            <div className="space-y-2">
              {hotLeads.map((lead) => {
                const isSelected = activeBlip?.id === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => {
                      soundEngine.playGlassClick();
                      setActiveBlip(lead);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-300 shadow-xs"
                        : "bg-white/90 border-slate-200/80 hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {lead.companyName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {lead.bottleneck.type}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-full">
                        {lead.score}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.playGlassClick();
                          onSelectLead(lead);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg transition"
                        title="Open drawer"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
