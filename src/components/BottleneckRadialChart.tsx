"use client";

import React, { useState } from "react";
import { soundEngine } from "@/lib/audioAlert";

interface BottleneckCategory {
  id: string;
  name: string;
  percentage: number;
  color: string;
  strokeColor: string;
  impactRevenue: string;
  avgScoreImpact: string;
  sampleBottlenecks: string;
}

const CATEGORIES: BottleneckCategory[] = [
  {
    id: "mobile-ux",
    name: "Broken Mobile UX & Core Web Vitals",
    percentage: 45,
    color: "from-rose-500 to-rose-600",
    strokeColor: "#f43f5e",
    impactRevenue: "$142k/mo lost",
    avgScoreImpact: "-28 pts penalty",
    sampleBottlenecks: "Matterport 3D crashes, Safari video freezes, LCP > 5s",
  },
  {
    id: "lead-form",
    name: "Missing Lead Capture & Form Drop",
    percentage: 30,
    color: "from-amber-500 to-amber-600",
    strokeColor: "#f59e0b",
    impactRevenue: "$85k/mo lost",
    avgScoreImpact: "-34 pts penalty",
    sampleBottlenecks: "404 on tour booking, Calendly iframe locks, webhook drop",
  },
  {
    id: "dev-gap",
    name: "Dev Capacity Gap & Legacy Stack",
    percentage: 25,
    color: "from-cyan-500 to-blue-600",
    strokeColor: "#06b6d4",
    impactRevenue: "$62k/mo lost",
    avgScoreImpact: "-18 pts penalty",
    sampleBottlenecks: "Slow un-cached MLS PHP, missing Schema JSON-LD, Three.js",
  },
];

export function BottleneckRadialChart() {
  const [activeCategory, setActiveCategory] = useState<string>("mobile-ux");

  const center = 100;
  const ringWidth = 8;
  const gap = 6;

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-5 border border-pink-100 shadow-lg flex flex-col justify-between">
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-rose-400 via-amber-400 to-cyan-400" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 tracking-wide">
                Technical Bottleneck Breakdown
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-rose-100 text-rose-700 border border-rose-300 rounded-full shadow-sm">
                RADIAL SPECTRUM
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Root causes triggering high B2B deal qualification
            </p>
          </div>
        </div>

        {/* Top: Concentric Radial SVG & Summary */}
        <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
          {/* Concentric Radial Arcs SVG */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {CATEGORIES.map((cat, i) => {
                const radius = 80 - i * (ringWidth + gap);
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (cat.percentage / 100) * circumference;

                return (
                  <g key={cat.id}>
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      stroke="rgba(0,0,0,0.06)"
                      strokeWidth={ringWidth}
                      fill="none"
                    />
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      stroke={cat.strokeColor}
                      strokeWidth={ringWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-700 ease-out"
                      style={{
                        filter:
                          activeCategory === cat.id
                            ? `drop-shadow(0 2px 6px ${cat.strokeColor})`
                            : "none",
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Center HUD */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black">
                Primary Issue
              </span>
              <span className="text-2xl font-black font-mono text-slate-900">45%</span>
              <span className="text-[10px] font-bold text-rose-600">Mobile UX</span>
            </div>
          </div>

          {/* Interactive Category Cards */}
          <div className="flex-1 w-full space-y-2">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    soundEngine.playGlassClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
                    isSelected
                      ? "bg-gradient-to-r from-violet-50 to-pink-50 border-violet-400 shadow-[0_4px_16px_rgba(139,92,246,0.18)]"
                      : "bg-white/80 border-slate-200/80 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: cat.strokeColor }}
                      />
                      <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                    </div>
                    <span className="text-xs font-mono font-black text-slate-900">
                      {cat.percentage}%
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-rose-600 font-mono font-black">
                      {cat.impactRevenue}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px] font-semibold">
                      {cat.avgScoreImpact}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Category Deep Dive Note */}
      {(() => {
        const current = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
        return (
          <div className="mt-3 p-3 rounded-xl bg-white/95 border border-slate-200 text-xs shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-violet-700 font-mono mb-1 font-black">
              <span>PROVEN PITCH LEVERAGE</span>
              <span className="text-slate-500 font-semibold">Highest B2B Urgency</span>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed font-medium">
              <strong className="text-slate-900 font-bold">{current.name}:</strong> {current.sampleBottlenecks}.
              Prospects experiencing this defect score an average of 18-34 points higher in
              our pipeline.
            </p>
          </div>
        );
      })()}
    </div>
  );
}
