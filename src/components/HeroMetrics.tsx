"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Flame,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Lead } from "@/types/pipeline";

interface HeroMetricsProps {
  leads: Lead[];
  dealMultiplier: number;
}

export function HeroMetrics({ leads, dealMultiplier }: HeroMetricsProps) {
  const hotLeads = leads.filter((l) => l.score >= 80);
  const totalLeadsCount = 1480 + leads.length;
  const avgScore =
    leads.length > 0
      ? (leads.reduce((acc, curr) => acc + curr.score, 0) / leads.length).toFixed(1)
      : "84.5";

  const pipelineValue = totalLeadsCount * dealMultiplier;
  const highTicketActiveSum = leads.reduce((acc, curr) => acc + curr.dealValue, 0);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = Math.min(100, Math.max(0, parseFloat(avgScore)));
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Scanned Prospects — Royal Violet & Fuchsia */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative overflow-hidden rounded-2xl glass-panel p-5 border border-violet-200/80 hover:border-violet-400 hover:shadow-[0_12px_36px_0_rgba(139,92,246,0.2)] transition-all group"
      >
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-md group-hover:scale-105 transition-transform">
              <Users size={18} />
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total Scanned
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full shadow-sm">
            <ArrowUpRight size={12} />
            +18.4%
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tight text-slate-900 font-mono">
            {totalLeadsCount.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 font-medium">prospects</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1.5 text-violet-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            n8n Stream Active
          </span>
          <span className="font-mono text-slate-500 font-bold">24/7 Live</span>
        </div>
      </motion.div>

      {/* 2. 🔥 Hot Priority Leads (Score 80+) — Sunset Coral & Crimson Pulse */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative overflow-hidden rounded-2xl glass-panel p-5 border border-rose-200/90 hover:border-rose-400 hover:shadow-[0_12px_36px_0_rgba(244,63,94,0.22)] transition-all group"
      >
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* Pulsating colorful radar pulse ring */}
            <div className="relative flex items-center justify-center w-9 h-9">
              <span className="absolute inset-0 rounded-full border-2 border-rose-400/60 animate-ping" />
              <span className="absolute -inset-1 rounded-full border border-pink-400/40 animate-pulse" />
              <div className="relative p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-md group-hover:scale-105 transition-transform">
                <Flame size={18} />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Hot Priority Leads
            </span>
          </div>

          <span className="flex items-center gap-1 text-[11px] font-mono font-black text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full shadow-sm animate-pulse">
            SCORE 80+
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tight text-slate-900 font-mono">
            {hotLeads.length}
          </span>
          <span className="text-xs text-rose-600 font-bold">Immediate Targets</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
          <span className="text-rose-600 font-bold">Radar Sonar Primed</span>
          <span className="font-mono text-violet-700 font-black">42.8% Conv Rate</span>
        </div>
      </motion.div>

      {/* 3. Average Lead Quality Score — Vibrant Cyan & Emerald Rainbow Gauge */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative overflow-hidden rounded-2xl glass-panel p-5 border border-cyan-200/80 hover:border-cyan-400 hover:shadow-[0_12px_36px_0_rgba(6,182,212,0.2)] transition-all group"
      >
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white shadow-md group-hover:scale-105 transition-transform">
              <Activity size={18} />
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Avg Quality Score
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-100 border border-cyan-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles size={11} className="text-cyan-600" />
            TIER 1
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight text-slate-900 font-mono">
                {avgScore}
              </span>
              <span className="text-sm font-bold text-cyan-600">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">High Conversion Fit</p>
          </div>

          {/* Animated Multi-Color SVG Radial Gauge */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-slate-200/80"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="url(#gaugeRainbowGradient)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{
                  transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              <defs>
                <linearGradient id="gaugeRainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="35%" stopColor="#3b82f6" />
                  <stop offset="70%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-xs font-mono font-black text-slate-900">
              {Math.round(scorePercent)}%
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span className="text-slate-500 font-medium">Benchmark</span>
          <span className="font-mono text-cyan-700 font-bold">&gt; 80.0 Benchmark</span>
        </div>
      </motion.div>

      {/* 4. Estimated Pipeline Value — Electric Blue & Golden Emerald */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative overflow-hidden rounded-2xl glass-panel p-5 border border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_12px_36px_0_rgba(16,185,129,0.2)] transition-all group"
      >
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md group-hover:scale-105 transition-transform">
              <DollarSign size={18} />
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Est. Pipeline Value
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <TrendingUp size={11} />
            +$240k ARR
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black tracking-tight text-emerald-700 font-mono">
            ${(pipelineValue / 1000).toFixed(0)}k
          </span>
          <span className="text-xs text-slate-500 font-medium">
            (@ ${dealMultiplier.toLocaleString()}/deal)
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
          <span className="text-slate-500">High-Ticket Batch Sum</span>
          <span className="font-mono text-emerald-700 font-black">
            ${highTicketActiveSum.toLocaleString()}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
