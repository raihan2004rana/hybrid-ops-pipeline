"use client";

import React from "react";
import { Sliders, RotateCcw, DollarSign } from "lucide-react";
import { ScoringConfig } from "@/types/pipeline";
import { soundEngine } from "@/lib/audioAlert";

interface SettingsConfigViewProps {
  config: ScoringConfig;
  onChangeConfig: (newConfig: ScoringConfig) => void;
  onResetDefaults: () => void;
}

export function SettingsConfigView({
  config,
  onChangeConfig,
  onResetDefaults,
}: SettingsConfigViewProps) {
  const updateField = (field: keyof ScoringConfig, val: number) => {
    soundEngine.playGlassClick(0.1);
    onChangeConfig({
      ...config,
      [field]: val,
    });
  };

  const applyPreset = (preset: "luxury" | "volume" | "technical") => {
    soundEngine.playGlassClick(0.2);
    if (preset === "luxury") {
      onChangeConfig({
        bottleneckWeight: 35,
        dealSizeWeight: 45,
        decisionMakerWeight: 20,
        speedMultiplier: 1.5,
        dealValueDefault: 2500,
      });
    } else if (preset === "volume") {
      onChangeConfig({
        bottleneckWeight: 30,
        dealSizeWeight: 20,
        decisionMakerWeight: 30,
        speedMultiplier: 1.2,
        dealValueDefault: 1000,
      });
    } else {
      onChangeConfig({
        bottleneckWeight: 60,
        dealSizeWeight: 15,
        decisionMakerWeight: 15,
        speedMultiplier: 1.8,
        dealValueDefault: 1500,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-sky-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-600 shadow-2xs">
              <Sliders size={18} />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">
              Lead Scoring Configuration &amp; Valuation Model
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md">
              REAL-TIME MATRIX
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Configure algorithmic scoring weights that calculate hot lead radar alerts &amp;
            pipeline values
          </p>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition shadow-xs"
        >
          <RotateCcw size={14} />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Preset Profiles */}
      <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/80 border border-slate-200/90 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
          Scoring Presets:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => applyPreset("luxury")}
            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-xs font-bold text-sky-800 border border-sky-200 transition shadow-2xs"
          >
            Luxury Real Estate ($2,500/deal)
          </button>
          <button
            onClick={() => applyPreset("volume")}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-200 transition shadow-2xs"
          >
            High Volume Agency ($1,000/deal)
          </button>
          <button
            onClick={() => applyPreset("technical")}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-800 border border-rose-200 transition shadow-2xs"
          >
            Technical Defect Heavy
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deal Valuation Multiplier */}
        <div className="p-5 rounded-2xl backdrop-blur-xl bg-emerald-50/30 border border-emerald-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-600" />
              Default Pipeline Deal Value ($/Deal)
            </span>
            <span className="text-base font-mono font-black text-emerald-600">
              ${config.dealValueDefault.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Standard baseline valuation applied across total scanned prospects (Default: $1,000/deal).
          </p>
          <input
            type="range"
            min={250}
            max={5000}
            step={250}
            value={config.dealValueDefault}
            onChange={(e) => updateField("dealValueDefault", Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 font-semibold">
            <span>$250</span>
            <span className="text-emerald-700 font-bold">$1,000 (Default)</span>
            <span>$5,000</span>
          </div>
        </div>

        {/* Bottleneck Severity Weight */}
        <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/80 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Bottleneck Severity Weight
            </span>
            <span className="text-sm font-mono font-bold text-indigo-600">
              {config.bottleneckWeight}%
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Influence of identified Core Web Vitals defects and broken form flows.
          </p>
          <input
            type="range"
            min={10}
            max={70}
            value={config.bottleneckWeight}
            onChange={(e) => updateField("bottleneckWeight", Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 font-semibold">
            <span>10% Low</span>
            <span>40% Balanced</span>
            <span>70% Critical</span>
          </div>
        </div>

        {/* Deal Size Weight */}
        <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/80 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Estimated Deal Size Weight
            </span>
            <span className="text-sm font-mono font-bold text-indigo-600">
              {config.dealSizeWeight}%
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Weight applied to prospective deal size, company revenue, and market tier.
          </p>
          <input
            type="range"
            min={10}
            max={60}
            value={config.dealSizeWeight}
            onChange={(e) => updateField("dealSizeWeight", Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 font-semibold">
            <span>10%</span>
            <span>25% Balanced</span>
            <span>60% High-Ticket</span>
          </div>
        </div>

        {/* Decision Maker Seniority Weight */}
        <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/80 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Decision Maker Seniority Weight
            </span>
            <span className="text-sm font-mono font-bold text-indigo-600">
              {config.decisionMakerWeight}%
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Priority boost for Founder, Managing Partner, VP Growth, or Chief Officers.
          </p>
          <input
            type="range"
            min={10}
            max={50}
            value={config.decisionMakerWeight}
            onChange={(e) => updateField("decisionMakerWeight", Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 font-semibold">
            <span>10%</span>
            <span>20% Balanced</span>
            <span>50% Strict C-Suite</span>
          </div>
        </div>
      </div>
    </div>
  );
}
