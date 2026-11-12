"use client";

import React, { useState } from "react";
import { soundEngine } from "@/lib/audioAlert";

type TimeRange = "7d" | "30d" | "all";

interface DataPoint {
  label: string;
  ingested: number;
  qualified: number;
  contacted: number;
}

const DATA_SETS: Record<TimeRange, DataPoint[]> = {
  "7d": [
    { label: "Mon", ingested: 32, qualified: 18, contacted: 14 },
    { label: "Tue", ingested: 48, qualified: 29, contacted: 22 },
    { label: "Wed", ingested: 42, qualified: 25, contacted: 20 },
    { label: "Thu", ingested: 65, qualified: 41, contacted: 36 },
    { label: "Fri", ingested: 58, qualified: 36, contacted: 30 },
    { label: "Sat", ingested: 38, qualified: 22, contacted: 18 },
    { label: "Sun", ingested: 52, qualified: 34, contacted: 28 },
  ],
  "30d": [
    { label: "W1", ingested: 240, qualified: 145, contacted: 118 },
    { label: "W2", ingested: 310, qualified: 192, contacted: 164 },
    { label: "W3", ingested: 280, qualified: 174, contacted: 152 },
    { label: "W4", ingested: 390, qualified: 248, contacted: 215 },
  ],
  all: [
    { label: "Jun", ingested: 680, qualified: 410, contacted: 340 },
    { label: "Jul", ingested: 890, qualified: 540, contacted: 480 },
    { label: "Aug", ingested: 1040, qualified: 670, contacted: 590 },
    { label: "Sep", ingested: 1220, qualified: 790, contacted: 710 },
    { label: "Oct", ingested: 1410, qualified: 920, contacted: 830 },
    { label: "Nov", ingested: 1482, qualified: 965, contacted: 874 },
  ],
};

export function PipelineHealthChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = DATA_SETS[timeRange];
  const maxIngested = Math.max(...data.map((d) => d.ingested)) * 1.15;

  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingBottom = 30;
  const paddingTop = 20;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => height - paddingBottom - (val / maxIngested) * chartHeight;

  const buildPath = (key: "ingested" | "qualified" | "contacted") => {
    return data.reduce((acc, point, i) => {
      const x = getX(i);
      const y = getY(point[key]);
      if (i === 0) return `M ${x} ${y}`;
      const prevX = getX(i - 1);
      const prevY = getY(data[i - 1][key]);
      const cpX1 = prevX + (x - prevX) / 2;
      const cpX2 = prevX + (x - prevX) / 2;
      return `${acc} C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
    }, "");
  };

  const buildAreaPath = (key: "ingested" | "qualified" | "contacted") => {
    const linePath = buildPath(key);
    const lastX = getX(data.length - 1);
    const firstX = getX(0);
    const bottomY = height - paddingBottom;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-5 border border-indigo-100 shadow-lg">
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-400" />

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 tracking-wide">
              Pipeline Velocity &amp; Conversion Health
            </h3>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-violet-100 text-violet-800 border border-violet-300 rounded-full shadow-sm">
              SPLINE FLOW
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Real-time telemetry: Ingested vs. Qualified vs. Outreach Contacted
          </p>
        </div>

        {/* Time range selector pills */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
          {(["7d", "30d", "all"] as TimeRange[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundEngine.playGlassClick();
                setTimeRange(tab);
                setHoveredIndex(null);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeRange === tab
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:text-violet-700"
              }`}
            >
              {tab === "7d" ? "7 Days" : tab === "30d" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Hovered Values Display */}
      <div className="flex items-center justify-between mb-2 text-xs flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
            <span className="text-slate-600 font-semibold">Ingested:</span>
            <span className="font-mono font-black text-pink-600">{activePoint.ingested}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shadow-[0_0_8px_#8b5cf6]" />
            <span className="text-slate-600 font-semibold">Qualified:</span>
            <span className="font-mono font-black text-violet-700">{activePoint.qualified}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-600 font-semibold">Contacted:</span>
            <span className="font-mono font-black text-emerald-700">{activePoint.contacted}</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500 font-semibold">
          Selected: <span className="text-violet-700 font-black">{activePoint.label}</span>
        </div>
      </div>

      {/* Interactive Vibrant SVG Canvas Chart */}
      <div className="relative w-full h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ingestedAreaRainbow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="qualifiedAreaRainbow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="contactedAreaRainbow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - paddingBottom - ratio * chartHeight;
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(99,102,241,0.08)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fills */}
          <path d={buildAreaPath("ingested")} fill="url(#ingestedAreaRainbow)" />
          <path d={buildAreaPath("qualified")} fill="url(#qualifiedAreaRainbow)" />
          <path d={buildAreaPath("contacted")} fill="url(#contactedAreaRainbow)" />

          {/* Spline Lines */}
          <path
            d={buildPath("ingested")}
            fill="none"
            stroke="#ec4899"
            strokeWidth="3"
            strokeLinecap="round"
            className="filter drop-shadow-[0_2px_6px_rgba(236,72,153,0.35)]"
          />
          <path
            d={buildPath("qualified")}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="filter drop-shadow-[0_2px_6px_rgba(139,92,246,0.35)]"
          />
          <path
            d={buildPath("contacted")}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="filter drop-shadow-[0_2px_6px_rgba(16,185,129,0.35)]"
          />

          {/* Interactive Data Nodes */}
          {data.map((d, i) => {
            const x = getX(i);
            const yIngested = getY(d.ingested);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={height - paddingBottom}
                    stroke="rgba(139, 92, 246, 0.4)"
                    strokeDasharray="2 2"
                  />
                )}

                <circle
                  cx={x}
                  cy={yIngested}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  className="transition-all shadow-md"
                />

                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[10px] font-mono select-none ${
                    isHovered ? "fill-violet-700 font-black" : "fill-slate-500 font-semibold"
                  }`}
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {data.map((_, i) => {
            const colWidth = chartWidth / data.length;
            const x = getX(i) - colWidth / 2;
            return (
              <rect
                key={i}
                x={x}
                y={0}
                width={colWidth}
                height={height}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => {
                  soundEngine.playGlassClick(0.05);
                  setHoveredIndex(i);
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Footer KPI bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Conv. Probability
          </span>
          <span className="font-mono font-black text-emerald-700 text-sm">38.4%</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Speed-To-Outreach
          </span>
          <span className="font-mono font-black text-violet-700 text-sm">4.2h avg</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Lead Qualification
          </span>
          <span className="font-mono font-black text-fuchsia-700 text-sm">65.2% Tier 1</span>
        </div>
      </div>
    </div>
  );
}
