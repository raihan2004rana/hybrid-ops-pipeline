"use client";

import React from "react";
import { motion } from "framer-motion";

export function BackgroundWaterCaustics() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Luminous Pearl Base */}
      <div className="absolute inset-0 bg-[#f8fafc]" />

      {/* Radiant Multi-Color Aurora Caustic Backdrop */}
      <div className="absolute inset-0 caustic-backdrop-aurora opacity-90" />

      {/* Floating Fluid Blobs with Rich Vibrant Colors */}
      {/* 1. Fuchsia & Sunset Coral */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.2, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 -left-32 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-rose-400/35 via-fuchsia-400/25 to-pink-300/15 blur-[100px]"
      />

      {/* 2. Royal Violet & Electric Indigo */}
      <motion.div
        animate={{
          x: [0, -70, 60, 0],
          y: [0, 70, -40, 0],
          scale: [1, 1.18, 0.92, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -right-40 w-[680px] h-[680px] rounded-full bg-gradient-to-bl from-purple-500/30 via-indigo-400/25 to-violet-300/15 blur-[110px]"
      />

      {/* 3. Electric Cyan & Radiant Aqua Turquoise */}
      <motion.div
        animate={{
          x: [0, 60, -50, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-40 left-1/4 w-[740px] h-[740px] rounded-full bg-gradient-to-tr from-cyan-400/35 via-teal-300/25 to-sky-300/20 blur-[115px]"
      />

      {/* 4. Warm Sunset Amber & Golden Honey */}
      <motion.div
        animate={{
          opacity: [0.25, 0.45, 0.25],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-10 right-1/4 w-[450px] h-[350px] rounded-full bg-gradient-to-br from-amber-400/25 via-orange-300/20 to-transparent blur-[90px]"
      />

      {/* Subtle Micro-Grid */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.8) 1.2px, transparent 1.2px)`,
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}
