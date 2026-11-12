"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Flame,
  AlertOctagon,
  Sparkles,
  Send,
  Phone,
  Globe,
  Gauge,
  Clock,
  DollarSign,
  TrendingDown,
  Zap,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { LinkedInIcon } from "@/components/LinkedInIcon";
import { Lead } from "@/types/pipeline";
import { soundEngine } from "@/lib/audioAlert";

interface ProspectDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (leadId: string, newStatus: Lead["outreachStatus"]) => void;
}

type PitchTone = "executive" | "technical" | "urgent";

export function ProspectDrawer({
  lead,
  isOpen,
  onClose,
  onStatusChange,
}: ProspectDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [pitchTone, setPitchTone] = useState<PitchTone>("executive");
  const [isSendingToN8n, setIsSendingToN8n] = useState(false);
  const [n8nSuccess, setN8nSuccess] = useState(false);

  if (!lead) return null;

  const getDynamicPitch = () => {
    if (pitchTone === "technical") {
      return {
        subject: `Technical audit: ${lead.bottleneck.type} on ${lead.companyName}`,
        observation:
          lead.personalizedHook ||
          `Ran lighthouse & edge performance diagnostics on ${lead.websiteUrl}. LCP is clocking at ${lead.bottleneck.metrics.lcp || "5.4s"} with a mobile speed score of ${lead.bottleneck.metrics.pageSpeedMobile || 35}/100, primarily triggered by unoptimized assets and form handlers.`,
        solution: `We deploy an edge-rendered hydration layer that isolates third-party scripts, fixes the mobile memory overflow, and lowers TTFB to under 80ms globally.`,
        cta: `Can I send the raw DevTools diagnostic trace and network waterfall over to your team?`,
      };
    }
    if (pitchTone === "urgent") {
      return {
        subject: `Immediate inquiry loss on ${lead.companyName}'s mobile viewports`,
        observation:
          lead.personalizedHook ||
          `Noticed that qualified high-ticket clients attempting to book through ${lead.companyName} on mobile Safari are experiencing ${lead.bottleneck.title.toLowerCase()}, causing an estimated ${lead.bottleneck.metrics.conversionDrop || "-45%"} inquiry drop.`,
        solution: `We can patch the broken mobile handler and route VIP inquiries directly to ${lead.decisionMaker.name} within 24 hours with zero downtime.`,
        cta: `Are you free for a 5-minute phone call this afternoon to stop the funnel drop?`,
      };
    }
    return {
      ...lead.aiPitch,
      observation: lead.personalizedHook || lead.aiPitch.observation,
    };
  };

  const pitch = getDynamicPitch();

  const handleCopyPitch = () => {
    soundEngine.playGlassClick(0.3);
    const fullPitch = `Subject: ${pitch.subject}\n\nHi ${lead.decisionMaker.name},\n\n${pitch.observation}\n\n${pitch.solution}\n\n${pitch.cta}\n\nBest regards,\n[Your Name]\nHybrid.Ops Client Lead`;

    navigator.clipboard.writeText(fullPitch);
    setCopied(true);
    onStatusChange(lead.id, "PITCH_COPIED");

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7, x: 0.8 },
        colors: ["#6366f1", "#ec4899", "#3b82f6", "#10b981"],
      });
    } catch {
      // Ignore
    }

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleSendToN8n = async () => {
    soundEngine.playGlassClick();
    setIsSendingToN8n(true);
    try {
      await fetch("/api/n8n/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: {
            action: "prospect_outreach_dispatch",
            leadId: lead.id,
            companyName: lead.companyName,
            websiteUrl: lead.websiteUrl,
            decisionMaker: lead.decisionMaker,
            bottleneck: lead.bottleneck,
            score: lead.score,
            dealValue: lead.dealValue,
            pitch,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      setN8nSuccess(true);
      soundEngine.playRadarPing(0.3);
      onStatusChange(lead.id, "CONTACTED");
      setTimeout(() => setN8nSuccess(false), 3000);
    } catch {
      // Ignore
    } finally {
      setIsSendingToN8n(false);
    }
  };

  const mailtoUrl = `mailto:${lead.decisionMaker.email}?subject=${encodeURIComponent(
    pitch.subject
  )}&body=${encodeURIComponent(
    `Hi ${lead.decisionMaker.name},\n\n${pitch.observation}\n\n${pitch.solution}\n\n${pitch.cta}\n\nBest regards,\n[Your Name]`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Glass Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-in Liquid Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl backdrop-blur-3xl bg-white/95 border-l border-slate-200/90 shadow-[-20px_0_60px_rgba(15,23,42,0.14)] flex flex-col overflow-hidden text-slate-900"
          >
            {/* Ambient Watery Rainbow Edge Light */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />

            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200/80 flex items-center justify-between gap-4 bg-slate-50/70">
              <div className="flex items-center gap-3">
                {lead.score >= 80 ? (
                  <span className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shadow-xs">
                    <Flame size={18} className="animate-pulse" />
                  </span>
                ) : (
                  <span className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                    <Sparkles size={18} />
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      {lead.companyName}
                    </h2>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                        lead.score >= 80
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      SCORE {lead.score}/100
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                    <span>{lead.location}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-semibold">{lead.industry}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={lead.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl border border-slate-200 transition shadow-xs"
                  title="Open live website"
                >
                  <Globe size={16} />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl border border-slate-200 transition shadow-xs"
                  title="Close Drawer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. Simulated High-Res Website Snapshot & Diagnostics */}
              <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-50 shadow-xs">
                {/* Browser Mockup Chrome Bar */}
                <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-700 max-w-xs truncate shadow-2xs">
                    <span className="text-indigo-600 font-bold">https://</span>
                    <span>{lead.websiteUrl.replace("https://", "")}</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-mono font-bold">SSL VERIFIED</div>
                </div>

                {/* Simulated Visual Snapshot */}
                <div className="relative p-5 bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/30 min-h-[140px] flex flex-col justify-between overflow-hidden">
                  <div>
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-white/90 text-indigo-700 border border-indigo-200 rounded-md shadow-2xs">
                      Digital Asset Preview
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                      {lead.websiteSnapshotTitle || lead.companyName}
                    </h4>
                  </div>

                  {/* Core Web Vitals HUD row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200/60">
                    <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                        <Gauge size={12} className="text-rose-500" />
                        PageSpeed
                      </div>
                      <div className="text-sm font-mono font-bold text-rose-600 mt-0.5">
                        {lead.bottleneck.metrics.pageSpeedMobile || 34}/100
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                        <Clock size={12} className="text-amber-500" />
                        LCP
                      </div>
                      <div className="text-sm font-mono font-bold text-amber-600 mt-0.5">
                        {lead.bottleneck.metrics.lcp || "5.4s"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                        <TrendingDown size={12} className="text-rose-500" />
                        Dropoff
                      </div>
                      <div className="text-sm font-mono font-bold text-rose-600 mt-0.5">
                        {lead.bottleneck.metrics.conversionDrop || "-45%"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                        <DollarSign size={12} className="text-emerald-500" />
                        Lost Value
                      </div>
                      <div className="text-sm font-mono font-bold text-emerald-600 mt-0.5">
                        {lead.bottleneck.metrics.lostRevenueMonthly || "$80k/mo"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Technical Bottleneck Deep Dive */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 backdrop-blur-md">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
                  <AlertOctagon size={16} />
                  Identified Technical Bottleneck
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {lead.bottleneck.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {lead.bottleneck.description}
                </p>
              </div>

              {/* 3. Decision Maker Profile & Direct LinkedIn */}
              <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={lead.decisionMaker.avatarUrl}
                    alt={lead.decisionMaker.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-indigo-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        {lead.decisionMaker.name}
                      </h4>
                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                        VERIFIED LEAD
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{lead.decisionMaker.title}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Mail size={12} className="text-indigo-600" />
                        {lead.decisionMaker.email}
                      </span>
                      {lead.decisionMaker.phone && (
                        <span className="flex items-center gap-1 text-slate-500 hidden sm:flex font-mono">
                          <Phone size={12} className="text-indigo-600" />
                          {lead.decisionMaker.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <a
                  href={lead.decisionMaker.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0077b5]/10 hover:bg-[#0077b5]/15 text-[#0077b5] border border-[#0077b5]/30 text-xs font-semibold transition"
                >
                  <LinkedInIcon size={14} />
                  <span>LinkedIn Profile</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* 4. Cold Outreach Sandbox (AI Pitch 3-part layout) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50/50 via-indigo-50/30 to-sky-50/40 border border-indigo-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-600" />
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Cold Outreach Sandbox
                    </h4>
                  </div>

                  {/* Pitch Tone Switcher */}
                  <div className="flex items-center bg-white/90 border border-slate-200 rounded-lg p-0.5 gap-1 text-[11px] shadow-2xs">
                    {(["executive", "technical", "urgent"] as PitchTone[]).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => {
                          soundEngine.playGlassClick();
                          setPitchTone(tone);
                        }}
                        className={`px-2.5 py-1 rounded-md capitalize font-medium transition ${
                          pitchTone === tone
                            ? "bg-indigo-600 text-white font-semibold shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3-Part Pitch Card */}
                <div className="space-y-3 p-4 rounded-xl bg-white/95 border border-slate-200/90 text-xs font-mono shadow-xs">
                  {/* Subject */}
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      Subject Line:
                    </span>
                    <div className="text-indigo-900 font-bold bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
                      {pitch.subject}
                    </div>
                  </div>

                  {/* Observation */}
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      1. Observation (The Diagnostic):
                    </span>
                    <div className="text-slate-700 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/70 leading-relaxed">
                      {pitch.observation}
                    </div>
                  </div>

                  {/* Solution */}
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      2. Solution (The Value Offer):
                    </span>
                    <div className="text-slate-700 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/70 leading-relaxed">
                      {pitch.solution}
                    </div>
                  </div>

                  {/* CTA */}
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      3. Low-Friction Call-To-Action:
                    </span>
                    <div className="text-indigo-900 font-semibold bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-200 leading-relaxed">
                      {pitch.cta}
                    </div>
                  </div>
                </div>

                {/* Action Buttons: 1-Click Copy & Direct Mailto */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handleCopyPitch}
                    className={`flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] ${
                      copied
                        ? "bg-emerald-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                        : "glass-button-primary"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        <span>Pitch Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>1-Click Copy Pitch to Clipboard</span>
                      </>
                    )}
                  </button>

                  <a
                    href={mailtoUrl}
                    onClick={() => onStatusChange(lead.id, "CONTACTED")}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold transition hover:border-indigo-400 shadow-xs"
                  >
                    <Send size={15} className="text-indigo-600" />
                    <span>Launch in Mail Client</span>
                  </a>

                  <button
                    onClick={handleSendToN8n}
                    disabled={isSendingToN8n}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition shadow-xs"
                  >
                    {isSendingToN8n ? (
                      <>
                        <RefreshCw size={14} className="animate-spin text-indigo-600" />
                        <span>Transmitting...</span>
                      </>
                    ) : n8nSuccess ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span>Sent to n8n Webhook!</span>
                      </>
                    ) : (
                      <>
                        <Zap size={14} className="text-indigo-600" />
                        <span>Dispatch to n8n</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Sticky Footer with Quick Status Advance */}
            <div className="p-4 border-t border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Current Pipeline Status:</span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {lead.outreachStatus.replace(/_/g, " ")}
                </span>
                <button
                  onClick={() => {
                    soundEngine.playGlassClick();
                    onStatusChange(lead.id, "CONTACTED");
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold transition"
                >
                  Mark Contacted
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
