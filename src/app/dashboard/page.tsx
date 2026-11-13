"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { AdminDashboard } from "@/components/AdminDashboard";
import { soundEngine } from "@/lib/audioAlert";

const AUTH_KEY = "hybrid_ops_admin_auth";
const DEFAULT_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "hybrid2026";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check stored authentication session on mount
  useEffect(() => {
    try {
      const localAuth = localStorage.getItem(AUTH_KEY);
      const sessionAuth = sessionStorage.getItem(AUTH_KEY);
      if (localAuth === "true" || sessionAuth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playGlassClick();
    setIsSubmitting(true);
    setErrorMessage(null);

    const entered = passwordInput.trim();
    // Support default password, env password, and friendly demo pass
    const isValid =
      entered === DEFAULT_PASS ||
      entered === "hybrid2026" ||
      entered === "admin" ||
      (process.env.NEXT_PUBLIC_ADMIN_PASSWORD && entered === process.env.NEXT_PUBLIC_ADMIN_PASSWORD);

    setTimeout(() => {
      if (isValid) {
        soundEngine.playRadarPing(0.3);
        if (rememberMe) {
          localStorage.setItem(AUTH_KEY, "true");
        } else {
          sessionStorage.setItem(AUTH_KEY, "true");
        }
        setIsAuthenticated(true);
      } else {
        setErrorMessage("Invalid administrative passkey. Please check credentials and try again.");
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(AUTH_KEY);
    } catch {}
    setIsAuthenticated(false);
    setPasswordInput("");
    setErrorMessage(null);
  };

  // 1. Initial Loading State
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  // 2. Authenticated State: Render Complete Hybrid.Ops Command Center
  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // 3. Unauthenticated State: Sleek Luxury Obsidian Auth Gate
  return (
    <div className="relative min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-indigo-900/10 blur-[90px] rounded-full" />
      </div>

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Return to Public Site Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft size={14} />
            <span>Return to Public Website</span>
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/90 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            System Live
          </span>
        </div>

        {/* Login Container Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl backdrop-blur-2xl bg-zinc-900/80 border border-white/[0.08] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden"
        >
          {/* Subtle top glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-500 text-white shadow-[0_0_24px_rgba(99,102,241,0.4)] mb-1">
              <Lock size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              <span>HYBRID.OPS</span>
              <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">
                ADMIN
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Pipeline Command Center &amp; Ingestion Engine. Please enter your administrator key to proceed.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                Security Passkey:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator passkey..."
                  required
                  autoFocus
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5"
                >
                  <ShieldAlert size={15} className="text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900"
                />
                <span>Remember session for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:via-indigo-500 hover:to-sky-400 shadow-[0_6px_25px_rgba(99,102,241,0.35)] transition-all cursor-pointer active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <>
                  <span>Unlock Command Center</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Passkey Helper Info */}
          <div className="pt-2 border-t border-zinc-800/80 text-center">
            <p className="text-[11px] font-mono text-zinc-500">
              Demo passkey: <code className="text-indigo-400 font-semibold bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-800/40">hybrid2026</code>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

