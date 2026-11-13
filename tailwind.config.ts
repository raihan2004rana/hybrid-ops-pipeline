import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          navy: "#17213D",
          purple: "#8B5CF6",
          blue: "#0EA5E9",
          mint: "#10B981",
          lavender: "#F5F0FF",
          cyan: "#ECF8FF",
        },
        ocean: {
          950: "#020712",
          900: "#051124",
          850: "#081b36",
          800: "#0b2649",
          700: "#133a6b",
          600: "#1c5294",
        },
        aqua: {
          DEFAULT: "#00f0ff",
          400: "#22d3ee",
          500: "#06b6d4",
          glow: "rgba(0, 240, 255, 0.35)",
        },
      },
      backgroundImage: {
        "water-caustic":
          "radial-gradient(ellipse at top, rgba(6, 182, 212, 0.15), transparent 70%), radial-gradient(ellipse at bottom, rgba(14, 165, 233, 0.1), transparent 70%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
        "glass-specular":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.0) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radarSweep 3s linear infinite",
        "float-slow": "floatBlob 18s ease-in-out infinite alternate",
        "float-reverse": "floatBlobReverse 22s ease-in-out infinite alternate",
        "ripple": "ripple 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite",
      },
      keyframes: {
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        floatBlob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(60px, -40px) scale(1.15)" },
          "100%": { transform: "translate(-30px, 30px) scale(0.95)" },
        },
        floatBlobReverse: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-50px, 50px) scale(1.1)" },
          "100%": { transform: "translate(40px, -30px) scale(0.9)" },
        },
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      boxShadow: {
        "water-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
        "water-glass-glow": "0 8px 32px 0 rgba(0, 0, 0, 0.45), 0 0 25px rgba(0, 240, 255, 0.2)",
        "radar-glow": "0 0 40px rgba(244, 63, 94, 0.45), 0 0 80px rgba(6, 182, 212, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
