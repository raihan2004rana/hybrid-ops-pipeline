"use client";

import React from "react";
import Image from "next/image";

interface HybridOpsLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  monogramOnly?: boolean;
}

export default function HybridOpsLogo({
  className = "",
  size = "md",
  showTagline = false,
  monogramOnly = false,
}: HybridOpsLogoProps) {
  // Height map for responsive rendering
  const heightMap = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  };

  const height = heightMap[size] || 36;
  // Aspect ratio of the original 1024x344 logo is ~2.977:1
  const width = Math.round(height * 2.977);

  if (monogramOnly) {
    // Pure SVG Monogram replicating the official H with 3D purple-to-blue swirl & mint accent
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: height, height }}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="hLeftLeg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
            <linearGradient id="hRightLeg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="hOrbit" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="45%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Left Vertical Pillar of H */}
          <rect x="22" y="16" width="22" height="88" rx="11" fill="url(#hLeftLeg)" />

          {/* Right Vertical Pillar of H */}
          <rect x="76" y="16" width="22" height="88" rx="11" fill="url(#hRightLeg)" />

          {/* Dynamic Swirling 3D Orbit connecting the pillars */}
          <path
            d="M 12 76 C 8 50, 48 32, 80 50 C 102 62, 108 84, 96 94 C 84 104, 52 100, 36 82"
            stroke="url(#hOrbit)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />

          {/* Mint Innovation Sparkle Dot */}
          <circle cx="100" cy="40" r="7" fill="#10B981" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col justify-center ${className}`}>
      <div className="flex items-center gap-2">
        <Image
          src="/images/hybrid-ops-logo.png"
          alt="Hybrid-Ops"
          width={width}
          height={height}
          priority
          className="h-auto object-contain"
          style={{ maxHeight: height }}
        />
      </div>
      {showTagline && (
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold mt-0.5">
          Technology &amp; Development Partnerships
        </span>
      )}
    </div>
  );
}

