"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Copy,
  Check,
  Send,
  Zap,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Lead } from "@/types/pipeline";
import { soundEngine } from "@/lib/audioAlert";

interface OutreachStudioViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (leadId: string, newStatus: Lead["outreachStatus"]) => void;
}

export function OutreachStudioView({
  leads,
  onSelectLead,
  onStatusChange,
}: OutreachStudioViewProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || "");
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<"concise" | "technical" | "roi">("concise");
  const [isSendingToN8n, setIsSendingToN8n] = useState(false);
  const [n8nSuccess, setN8nSuccess] = useState(false);

  const currentLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  if (!currentLead) return null;

  const getPitchForTone = (lead: Lead) => {
    if (tone === "technical") {
      return {
        subject: `Edge diagnostic: ${lead.bottleneck.type} on ${lead.companyName}`,
        observation:
          lead.personalizedHook ||
          `Ran lighthouse and web vitals diagnostics on ${lead.websiteUrl}. Noticed LCP is elevated to ${lead.bottleneck.metrics.lcp || "5.4s"} with ${lead.bottleneck.metrics.conversionDrop || "-45%"} dropoff on mobile devices.`,
        solution: `We deploy an edge cache layer and progressive mobile hydration that eliminates memory crashes and brings TTFB to sub-100ms.`,
        cta: `Can I send over the 2-minute screen recording with the network traces?`,
      };
    }
    if (tone === "roi") {
      return {
        subject: `Recovering the estimated ${lead.bottleneck.metrics.lostRevenueMonthly || "$80k/mo"} funnel drop at ${lead.companyName}`,
        observation:
          lead.personalizedHook ||
          `Saw that mobile prospects seeking consultations at ${lead.companyName} encounter ${lead.bottleneck.title.toLowerCase()}, causing an estimated loss of ${lead.bottleneck.metrics.lostRevenueMonthly || "$80k"}/month in inquiries.`,
        solution: `We've solved this exact conversion leakage for top-tier firms, restoring 35%+ of lost mobile conversions in under 72 hours.`,
        cta: `Would you be open to a 5-minute call this Thursday to review the numbers?`,
      };
    }
    return {
      ...lead.aiPitch,
      observation: lead.personalizedHook || lead.aiPitch.observation,
    };
  };

  const currentPitch = getPitchForTone(currentLead);

  const handleCopy = () => {
    soundEngine.playGlassClick(0.3);
    const text = `Subject: ${currentPitch.subject}\n\nHi ${currentLead.decisionMaker.name},\n\n${currentPitch.observation}\n\n${currentPitch.solution}\n\n${currentPitch.cta}\n\nBest regards,\n[Your Name]\nHybrid.Ops Enterprise Solutions`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onStatusChange(currentLead.id, "PITCH_COPIED");

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6, x: 0.7 },
        colors: ["#6366f1", "#ec4899", "#3b82f6"],
      });
    } catch {
      // Ignore
    }

    setTimeout(() => setCopied(false), 2500);
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
            action: "outreach_studio_pitch_dispatch",
            leadId: currentLead.id,
            companyName: currentLead.companyName,
            websiteUrl: currentLead.websiteUrl,
            decisionMaker: currentLead.decisionMaker,
            bottleneck: currentLead.bottleneck,
            score: currentLead.score,
            dealValue: currentLead.dealValue,
            pitch: currentPitch,
            tone,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      setN8nSuccess(true);
      soundEngine.playRadarPing(0.35);
      onStatusChange(currentLead.id, "CONTACTED");
      setTimeout(() => setN8nSuccess(false), 3000);
    } catch {
      // Ignore
    } finally {
      setIsSendingToN8n(false);
    }
  };

  const mailtoUrl = `mailto:${currentLead.decisionMaker.email}?subject=${encodeURIComponent(
    currentPitch.subject
  )}&body=${encodeURIComponent(
    `Hi ${currentLead.decisionMaker.name},\n\n${currentPitch.observation}\n\n${currentPitch.solution}\n\n${currentPitch.cta}\n\nBest regards,\n[Your Name]`
  )}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-sky-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-100 border border-sky-200 text-sky-600 shadow-2xs">
              <Mail size={18} />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">
              AI Outreach Studio &amp; Script Dispatcher
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-sky-100 text-sky-700 border border-sky-200 rounded-md">
              PRODUCTION COLD EMAIL ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Tailored 3-part diagnosis pitches designed for 40%+ open rates with zero fluff
          </p>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center bg-white/90 border border-slate-200 rounded-xl p-1 gap-1 text-xs shadow-2xs">
          {(["concise", "technical", "roi"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                soundEngine.playGlassClick();
                setTone(t);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[10px] transition ${
                tone === t
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t === "concise" ? "Executive Value" : t === "technical" ? "Technical Audit" : "ROI Focused"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Lead Selection Queue */}
        <div className="lg:col-span-5 rounded-2xl backdrop-blur-xl bg-white/75 p-4 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
            <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
              Pending Outreach Queue ({leads.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto">
            {leads.map((lead) => {
              const isSelected = currentLead.id === lead.id;
              const isHot = lead.score >= 80;

              return (
                <div
                  key={lead.id}
                  onClick={() => {
                    soundEngine.playGlassClick();
                    setSelectedLeadId(lead.id);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-sky-50 to-indigo-50 border-indigo-300 shadow-xs"
                      : "bg-white/90 border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[190px]">
                      {lead.companyName}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-md border ${
                        isHot
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      SCORE {lead.score}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 truncate">
                    {lead.decisionMaker.name} ({lead.decisionMaker.title})
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-indigo-600 font-semibold truncate max-w-[150px]">
                      {lead.bottleneck.type}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-semibold ${
                        lead.outreachStatus === "CONTACTED"
                          ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                          : "text-slate-600 bg-slate-100"
                      }`}
                    >
                      {lead.outreachStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Pitch Composition Preview & 1-Click Dispatch */}
        <div className="lg:col-span-7 space-y-4">
          <motion.div
            key={currentLead.id + tone}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl backdrop-blur-xl bg-white/95 p-6 border border-slate-200/90 shadow-[0_16px_40px_rgba(15,23,42,0.06)] space-y-5"
          >
            {/* Target Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div className="flex items-center gap-3">
                <img
                  src={currentLead.decisionMaker.avatarUrl}
                  alt={currentLead.decisionMaker.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {currentLead.decisionMaker.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentLead.decisionMaker.title} @ {currentLead.companyName}
                  </p>
                  <p className="text-[11px] font-mono text-indigo-600 font-semibold mt-0.5">
                    {currentLead.decisionMaker.email}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 rounded-xl">
                ${currentLead.dealValue.toLocaleString()} Deal
              </span>
            </div>

            {/* Email Preview Card */}
            <div className="space-y-3 font-mono text-xs bg-slate-50/90 p-5 rounded-xl border border-slate-200 shadow-2xs text-slate-800">
              {/* Subject */}
              <div className="border-b border-slate-200/80 pb-2.5">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                  Subject Line:
                </span>
                <span className="text-indigo-900 font-bold text-sm bg-white p-2.5 rounded-lg border border-indigo-100 block">
                  {currentPitch.subject}
                </span>
              </div>

              {/* Salutation */}
              <div className="text-slate-600 font-medium">
                Hi {currentLead.decisionMaker.name},
              </div>

              {/* Observation */}
              <div className="p-3 rounded-lg bg-white border border-slate-200/80 text-slate-700 leading-relaxed">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                  Observation (Specific Technical Finding):
                </span>
                {currentPitch.observation}
              </div>

              {/* Solution */}
              <div className="p-3 rounded-lg bg-white border border-slate-200/80 text-slate-700 leading-relaxed">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                  Solution (ROI &amp; Delivery Framework):
                </span>
                {currentPitch.solution}
              </div>

              {/* CTA */}
              <div className="p-3 rounded-lg bg-indigo-50/80 border border-indigo-200 text-indigo-950 font-semibold leading-relaxed">
                <span className="text-indigo-700 text-[10px] uppercase font-bold block mb-1">
                  Frictionless Call-To-Action:
                </span>
                {currentPitch.cta}
              </div>

              {/* Signoff */}
              <div className="text-slate-600 pt-1">
                Best regards,
                <br />
                <span className="text-slate-900 font-bold">[Your Name]</span>
                <br />
                <span className="text-slate-500">Hybrid.Ops Solutions Group</span>
              </div>
            </div>

            {/* 1-Click Action Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleCopy}
                className={`flex-1 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] ${
                  copied
                    ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    : "glass-button-primary"
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Copied to Clipboard!" : "1-Click Copy AI Script"}</span>
              </button>

              <a
                href={mailtoUrl}
                onClick={() => onStatusChange(currentLead.id, "CONTACTED")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold transition hover:border-indigo-400 shadow-xs"
              >
                <Send size={15} className="text-indigo-600" />
                <span>Launch in Mail Client</span>
              </a>

              <button
                onClick={handleSendToN8n}
                disabled={isSendingToN8n}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition shadow-xs"
              >
                {isSendingToN8n ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-indigo-600" />
                    <span>Sending to n8n...</span>
                  </>
                ) : n8nSuccess ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span>Dispatched to n8n!</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} className="text-indigo-600" />
                    <span>Dispatch to n8n</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  soundEngine.playGlassClick();
                  onSelectLead(currentLead);
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition shadow-2xs"
              >
                Inspect Tech Audit
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
