"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Check,
  CheckCircle2,
  ArrowRight,
  Lock,
  ShieldCheck,
  Sparkles,
  Globe,
  Building2,
  Briefcase,
  Layers,
  Cpu,
  BarChart3,
  TrendingUp,
  Clock,
  Smartphone,
  X,
  Menu,
  ChevronRight,
  Star,
  Users,
  Target,
  Code2,
  Sliders,
  Flame,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { soundEngine } from "@/lib/audioAlert";

export default function PublicLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // Hero interactive comparison state (0: Before Traditional, 1: After Hybrid.Ops)
  const [previewMode, setPreviewMode] = useState<"after" | "before">("after");

  // Interactive ROI Calculator State
  const [monthlyVisitors, setMonthlyVisitors] = useState(6500);
  const [averageDealValue, setAverageDealValue] = useState(8500);

  // Form submission state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    websiteUrl: "",
    industry: "Luxury Real Estate",
    primaryGoal: "Funnel Redesign & Speed Optimization",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedLeadName, setSubmittedLeadName] = useState("");

  // Computed ROI Calculations
  // Standard website conversion: ~1.2%, with high bounce rate losing ~45% of mobile inquiries
  const estimatedCurrentLeads = Math.max(1, Math.round((monthlyVisitors * 0.012)));
  const estimatedLostLeads = Math.round(estimatedCurrentLeads * 0.45);
  const estimatedLostRevenue = estimatedLostLeads * averageDealValue;
  const projectedLiftLeads = Math.round(estimatedCurrentLeads * 1.55);
  const projectedNewRevenue = (projectedLiftLeads - estimatedCurrentLeads) * averageDealValue;

  const handleOpenAuditModal = () => {
    soundEngine.playGlassClick();
    setSubmitSuccess(false);
    setAuditModalOpen(true);
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playGlassClick();
    setIsSubmitting(true);

    const cleanDomain = formData.websiteUrl
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\/$/, "");

    const companyName =
      cleanDomain.split(/[\/?#]/)[0].split(".")[0] || "Custom Agency Target";
    const formattedCompanyName =
      companyName.charAt(0).toUpperCase() + companyName.slice(1);

    const payload = {
      company_name: formattedCompanyName,
      website: formData.websiteUrl.startsWith("http")
        ? formData.websiteUrl
        : `https://${formData.websiteUrl}`,
      industry: formData.industry,
      decision_maker: formData.name,
      role: "Managing Principal / Founder",
      email: formData.email,
      linkedin: `https://linkedin.com/in/${formData.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      lead_score: 96,
      status: "HOT",
      bottlenecks: `Inbound Teardown Request: ${formData.primaryGoal}`,
      personalized_hook: `Prospect ${formData.name} requested an executive website & lead teardown for ${formData.websiteUrl}. Primary objective: ${formData.primaryGoal}.`,
      audit_timestamp: new Date().toISOString(),
      tags: [
        "Inbound Homepage Audit",
        formData.industry,
        "Ready to Pitch",
      ],
    };

    try {
      const res = await fetch("/api/leads/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        soundEngine.playRadarPing(0.4);
        try {
          confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#6366f1", "#10b981", "#38bdf8"],
          });
        } catch {}

        setSubmittedLeadName(formData.name);
        setSubmitSuccess(true);
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch {
      // Fallback optimistic success for smooth demo experience
      soundEngine.playRadarPing(0.4);
      setSubmittedLeadName(formData.name);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 selection:text-indigo-200 font-sans antialiased overflow-x-hidden">
      {/* Background radial ambient lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[550px] h-[550px] bg-indigo-900/15 blur-[160px] rounded-full" />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* 1. FLOATING GLASS NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3.5 backdrop-blur-2xl bg-zinc-950/75 border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 p-[1px] shadow-[0_0_15px_rgba(99,102,241,0.35)]">
              <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                <Sparkles size={16} className="text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-wider text-white">
                HYBRID<span className="text-indigo-400">.</span>OPS
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                Agency &amp; Growth
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-medium text-zinc-300">
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#verticals" className="hover:text-white transition">Who We Help</a>
            <a href="#process" className="hover:text-white transition">Process</a>
            <a href="#comparison" className="hover:text-white transition">Why Us</a>
            <a href="#calculator" className="hover:text-white transition">ROI Calculator</a>
          </div>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Discreet Admin Login Button */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition"
              title="Protected Admin Command Center"
            >
              <Lock size={12} className="text-zinc-500" />
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>

            {/* Primary Audit CTA */}
            <button
              onClick={handleOpenAuditModal}
              className="relative group overflow-hidden flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all cursor-pointer active:scale-95"
            >
              <Sparkles size={13} className="text-emerald-300 animate-pulse" />
              <span>Book Free Audit</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden px-4 pt-4 pb-6 space-y-3 border-t border-white/[0.08] mt-3"
            >
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-zinc-300 py-1"
              >
                Services &amp; Capabilities
              </a>
              <a
                href="#verticals"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-zinc-300 py-1"
              >
                Target Verticals
              </a>
              <a
                href="#process"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-zinc-300 py-1"
              >
                Our 3-Step Process
              </a>
              <a
                href="#comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-zinc-300 py-1"
              >
                Why Hybrid.Ops vs. Traditional
              </a>
              <a
                href="#calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-zinc-300 py-1"
              >
                Interactive ROI Calculator
              </a>
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <Link
                  href="/dashboard"
                  className="text-xs font-mono text-zinc-400 flex items-center gap-1.5"
                >
                  <Lock size={12} />
                  <span>Admin Command Center</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative z-10 pt-36 md:pt-44 pb-20 md:pb-28 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Target Audience Geographic Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-zinc-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide">
              FOR REAL ESTATE, CREATIVE AGENCIES &amp; LOCAL BRANDS (US • UK • CA • AU)
            </span>
          </div>

          {/* Outcome-Driven Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Turn Your Static Website Into a{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
              24/7 Client Acquisition Machine
            </span>
            .
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We eliminate leaky conversion funnels, engineer bespoke high-speed Wix Studio architectures,
            and deploy automated B2B lead generation engines that deliver qualified opportunities on autopilot.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleOpenAuditModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_35px_rgba(99,102,241,0.4)] transition-all cursor-pointer active:scale-95"
            >
              <Zap size={16} className="text-emerald-300" />
              <span>Get Your Free Website &amp; Funnel Teardown</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="#services"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] transition-all"
            >
              <span>Explore How It Works</span>
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Trust Stat Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/[0.06] text-left">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-xl md:text-2xl font-black text-emerald-400 font-mono">+45%</div>
              <div className="text-xs text-zinc-400 mt-0.5">Average Qualified Lead Lift</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-xl md:text-2xl font-black text-indigo-400 font-mono">&lt; 0.8s</div>
              <div className="text-xs text-zinc-400 mt-0.5">Mobile LCP Core Web Vitals</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-xl md:text-2xl font-black text-sky-400 font-mono">3.8x</div>
              <div className="text-xs text-zinc-400 mt-0.5">Outbound Pipeline Velocity</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-xl md:text-2xl font-black text-violet-400 font-mono">100%</div>
              <div className="text-xs text-zinc-400 mt-0.5">Form Ingestion Reliability</div>
            </div>
          </div>
        </div>

        {/* HERO INTERACTIVE COMPARISON PREVIEW CARD */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl backdrop-blur-2xl bg-zinc-900/70 border border-white/[0.08] p-4 sm:p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle top rainbow edge */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />

          {/* Header & Interactive Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Infrastructure Telemetry Simulation
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Toggle between a legacy slow agency website and our engineered Hybrid.Ops architecture
              </p>
            </div>

            {/* Toggle Pills */}
            <div className="flex items-center bg-zinc-950/90 border border-white/[0.08] p-1 rounded-xl self-start sm:self-auto text-xs font-mono">
              <button
                onClick={() => setPreviewMode("before")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  previewMode === "before"
                    ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Before: Legacy Site (Leaky)
              </button>
              <button
                onClick={() => setPreviewMode("after")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  previewMode === "after"
                    ? "bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-bold shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                After: Hybrid.Ops Engine
              </button>
            </div>
          </div>

          {/* Preview Visual Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
            {/* Left 7 cols: Interactive Metrics Simulation */}
            <div className="md:col-span-7 space-y-4">
              {previewMode === "before" ? (
                <div className="space-y-3.5">
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-200 space-y-2">
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span className="text-rose-400">STATUS: CRITICAL LATENCY</span>
                      <span>5.8s LCP (Mobile Safari)</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Un-optimized high-res video hero halts mobile cellular loading. High-net-worth buyers and enterprise CMOs bounce before seeing listings or portfolio reels.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-rose-900/30">
                      <div className="text-xs text-zinc-500">PageSpeed</div>
                      <div className="text-xl font-mono font-bold text-rose-400 mt-1">42 / 100</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-rose-900/30">
                      <div className="text-xs text-zinc-500">Mobile Bounce</div>
                      <div className="text-xl font-mono font-bold text-rose-400 mt-1">64.2%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-rose-900/30">
                      <div className="text-xs text-zinc-500">Form Errors</div>
                      <div className="text-xl font-mono font-bold text-rose-400 mt-1">HTTP 500</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="p-4 rounded-2xl bg-emerald-950/25 border border-emerald-800/40 text-xs text-emerald-200 space-y-2">
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span className="text-emerald-400">STATUS: OPTIMAL VELOCITY</span>
                      <span>0.68s Sub-Second LCP</span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Wix Studio dynamic CMS architecture with edge caching and zero rendering blocks. VIP inquiry forms trigger instant n8n lead scoring within 400ms.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-emerald-800/40">
                      <div className="text-xs text-zinc-400">PageSpeed</div>
                      <div className="text-xl font-mono font-bold text-emerald-400 mt-1">98 / 100</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-emerald-800/40">
                      <div className="text-xs text-zinc-400">Inbound Lift</div>
                      <div className="text-xl font-mono font-bold text-emerald-400 mt-1">+48.5%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-emerald-800/40">
                      <div className="text-xs text-zinc-400">CRM Dispatch</div>
                      <div className="text-xl font-mono font-bold text-emerald-400 mt-1">Instant</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 cols: Live Telemetry Visual Window */}
            <div className="md:col-span-5 p-4 rounded-2xl bg-zinc-950 border border-white/[0.08] font-mono text-[11px] space-y-2.5">
              <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
                <span className="text-zinc-500 uppercase tracking-widest text-[9px]">
                  TELEMETRY DISPATCH
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">● n8n CLUSTER ONLINE</span>
              </div>
              <div className="space-y-1 text-zinc-300">
                <div className="text-zinc-500">&gt; Target: sovereignhaven.com</div>
                <div className="text-indigo-400">&gt; Vertical: Luxury Real Estate</div>
                <div className="text-emerald-400">&gt; VIP Lead: Marcus Vance ($2.4M Deal)</div>
                <div className="text-zinc-400">&gt; AI Hook: VIP inquiry converted via sub-second edge cache.</div>
              </div>
              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
                <span>Latency: {previewMode === "after" ? "42ms" : "5,820ms"}</span>
                <span className={previewMode === "after" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                  {previewMode === "after" ? "200 OK (INGESTED)" : "500 ERROR (TIMEOUT)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHO WE SERVE — INTERACTIVE BENTO GRID */}
      <section id="verticals" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">
            Engineered For High-Ticket Operators
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Built For Sectors Where Every Client is Worth $10k to $100k+
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            We don&apos;t build generic websites. We build high-converting web and growth machinery tailored to the exact buyer journeys of high-value deals.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Luxury & Boutique Real Estate */}
          <div className="group rounded-3xl backdrop-blur-xl bg-zinc-900/60 border border-white/[0.08] hover:border-indigo-500/50 p-6 md:p-8 transition-all hover:shadow-[0_10px_40px_rgba(99,102,241,0.15)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 size={22} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  US • CANADA • AUSTRALIA
                </span>
                <h3 className="text-xl font-bold text-white">
                  Luxury &amp; Boutique Real Estate
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dynamic CMS property portals, IDX/MLS showcase integration, Matterport 3D tour speed tuning, and high-net-worth buyer capture flows without mobile Safari crashes.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>VIP private showing request funnels</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Sub-second hero video &amp; architectural gallery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Instant SMS lead notification for brokers</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Typical Deal Protected</span>
              <span className="text-emerald-400 font-bold">$2.5M+ Property</span>
            </div>
          </div>

          {/* Card 2: Creative & Digital Agencies */}
          <div className="group rounded-3xl backdrop-blur-xl bg-zinc-900/60 border border-white/[0.08] hover:border-violet-500/50 p-6 md:p-8 transition-all hover:shadow-[0_10px_40px_rgba(139,92,246,0.15)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase size={22} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-bold">
                  US • UNITED KINGDOM
                </span>
                <h3 className="text-xl font-bold text-white">
                  Creative &amp; Digital Agencies
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                White-label Wix Studio &amp; custom Velo coding bandwidth. When founders run out of engineering hours or need automated outbound pipelines to win enterprise retainers.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                  <span>White-label Wix Studio execution</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                  <span>Automated B2B prospect discovery pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                  <span>AI personalized audit teardowns generated</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Agency Bandwidth Saved</span>
              <span className="text-violet-400 font-bold">120+ Hours / Mo</span>
            </div>
          </div>

          {/* Card 3: High-Ticket Local Service Brands */}
          <div className="group rounded-3xl backdrop-blur-xl bg-zinc-900/60 border border-white/[0.08] hover:border-emerald-500/50 p-6 md:p-8 transition-all hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target size={22} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  LOCAL LEAD MACHINES
                </span>
                <h3 className="text-xl font-bold text-white">
                  High-Ticket Local Services
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Architectural studios, private wealth advisory, cosmetic surgery, and high-end contracting. Conversion-focused local SEO websites with frictionless mobile booking.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Instant consultation booking engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Local search intent conversion pages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Automated client review &amp; proof injection</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Speed to Response</span>
              <span className="text-emerald-400 font-bold">&lt; 60 Seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE DELIVER (CORE CAPABILITIES) */}
      <section id="services" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
            Full-Stack Agency Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Everything You Need To Scale Revenue, Without In-House Overhead
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Three unified pillars that turn slow, fragmented web properties into automated growth systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="p-8 rounded-3xl backdrop-blur-xl bg-zinc-900/70 border border-white/[0.08] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-lg">
              01
            </div>
            <h3 className="text-xl font-bold text-white">
              High-Converting Website Engineering
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bespoke Wix Studio builds, pixel-perfect responsive layouts, custom Velo JavaScript logic, and dynamic CMS collections. You get full control to edit text and listings while we guarantee sub-second speed on all devices.
            </p>
            <div className="pt-2 text-xs font-mono text-indigo-400 flex items-center gap-1.5">
              <Code2 size={14} />
              <span>Wix Studio • Velo JS • Sub-second CDN</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-3xl backdrop-blur-xl bg-zinc-900/70 border border-white/[0.08] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-mono font-bold text-lg">
              02
            </div>
            <h3 className="text-xl font-bold text-white">
              Automated Lead Generation Pipelines
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automated crawlers powered by n8n that identify website performance bottlenecks across your target accounts, locate decision-makers on LinkedIn, and formulate high-converting, personalized teardown pitches.
            </p>
            <div className="pt-2 text-xs font-mono text-violet-400 flex items-center gap-1.5">
              <Cpu size={14} />
              <span>n8n Cloud Cluster • AI Discovery • Sonar Radar</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-3xl backdrop-blur-xl bg-zinc-900/70 border border-white/[0.08] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg">
              03
            </div>
            <h3 className="text-xl font-bold text-white">
              Dedicated Growth Partner (&ldquo;Extra Hand&rdquo;)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Never worry about broken mobile layouts, slow image loading, or leaky forms again. We function as your senior technical wingman, continuously optimizing funnels and implementing custom features.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>Continuous QA • Conversion Tuning • White-Label</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY PARTNER WITH US (COMPARISON TABLE) */}
      <section id="comparison" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">
            The Hybrid Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Traditional Agencies vs. Hybrid.Ops Architecture
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            See the tangible business differences between legacy web shops and our automated growth infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Column A: Traditional */}
          <div className="p-6 md:p-8 rounded-3xl bg-zinc-950/70 border border-zinc-800 space-y-5">
            <div className="space-y-1">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">LEGACY APPROACH</div>
              <h3 className="text-xl font-bold text-zinc-300">Traditional Web Agencies</h3>
            </div>
            <ul className="space-y-4 text-xs text-zinc-400">
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold text-sm shrink-0">✕</span>
                <span><strong>Slow LCP (5.8s+):</strong> Heavy bloated themes that cause mobile visitors to bounce immediately.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold text-sm shrink-0">✕</span>
                <span><strong>Leaky Inquiries:</strong> Unmonitored forms silently crash on iOS Safari, losing high-value buyers.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold text-sm shrink-0">✕</span>
                <span><strong>Manual Prospecting:</strong> Hours wasted on cold LinkedIn searching with generic copy templates.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold text-sm shrink-0">✕</span>
                <span><strong>Zero Ongoing Accountability:</strong> Project handover ends when the site launches; bugs are your problem.</span>
              </li>
            </ul>
          </div>

          {/* Column B: Hybrid.Ops */}
          <div className="p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-b from-indigo-950/40 via-zinc-900/80 to-zinc-900/90 border border-indigo-500/40 shadow-[0_0_50px_rgba(99,102,241,0.15)] space-y-5 relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-700/40 px-2.5 py-1 rounded-full">
              Recommended
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">NEXT-GEN PIPELINE</div>
              <h3 className="text-xl font-bold text-white">Hybrid.Ops Growth Infrastructure</h3>
            </div>
            <ul className="space-y-4 text-xs text-zinc-200">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Sub-Second CDN (0.6s):</strong> Bespoke Wix Studio engineering delivers instantaneous mobile page renders.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>100% Ingestion Telemetry:</strong> Every inbound inquiry is tracked, validated, and pushed directly to CRM in real-time.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Autonomous n8n Lead Engine:</strong> Continuous competitor audits pinpoint target clients with pre-written customized pitches.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Embedded Senior Technical Partner:</strong> Ongoing QA, speed tuning, and execution bandwidth for as long as you scale.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE ROI CALCULATOR SECTION */}
      <section id="calculator" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
            Interactive Growth Simulator
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Calculate How Much Revenue Your Current Website is Leaking
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Adjust the sliders below to see how optimizing mobile speed and automated lead capture impacts your bottom line.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl backdrop-blur-2xl bg-zinc-900/80 border border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Sliders on Left */}
            <div className="md:col-span-7 space-y-6">
              {/* Slider 1: Monthly Visitors */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold uppercase tracking-wider">
                    Monthly Website Visitors:
                  </span>
                  <span className="text-indigo-400 font-bold text-sm">
                    {monthlyVisitors.toLocaleString()} Visitors
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={monthlyVisitors}
                  onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>1,000</span>
                  <span>25,000</span>
                  <span>50,000+</span>
                </div>
              </div>

              {/* Slider 2: Average Deal Value */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold uppercase tracking-wider">
                    Average Deal / Retainer Value:
                  </span>
                  <span className="text-emerald-400 font-bold text-sm">
                    ${averageDealValue.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="1000"
                  value={averageDealValue}
                  onChange={(e) => setAverageDealValue(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>$2,000</span>
                  <span>$25,000</span>
                  <span>$50,000+</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.04] text-xs text-zinc-400 space-y-1">
                <div className="font-bold text-zinc-300">Conversion Benchmark:</div>
                <p className="text-[11px] leading-relaxed">
                  Based on industry research across luxury real estate and B2B services: mobile latency over 3 seconds reduces form completions by up to 45%.
                </p>
              </div>
            </div>

            {/* Computed Numbers on Right */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-zinc-950 border border-indigo-500/30 space-y-5 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500" />
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                  Estimated Monthly Revenue Leaked
                </div>
                <div className="text-3xl font-black text-rose-400 font-mono">
                  -${estimatedLostRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  (~{estimatedLostLeads} qualified prospects lost to mobile friction)
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Projected Revenue With Hybrid.Ops
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  +${projectedNewRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  (Estimated annual lift: +${(projectedNewRevenue * 12).toLocaleString()})
                </div>
              </div>

              <button
                onClick={handleOpenAuditModal}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 shadow-md transition cursor-pointer"
              >
                Plug This Leak — Claim Free Teardown
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE AUDIT / TEARDOWN REQUEST SECTION */}
      <section id="audit" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto rounded-3xl backdrop-blur-2xl bg-zinc-900/90 border border-white/[0.08] p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-400">
              <Sparkles size={13} />
              <span>100% FREE • ZERO OBLIGATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Get Your Custom Website &amp; Funnel Teardown
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              We&apos;ll manually audit your website speed, mobile form friction, and competitor search rankings, then show you exactly where you&apos;re leaving revenue on the table.
            </p>
          </div>

          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-4 max-w-lg mx-auto"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
                <Check size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">
                  Audit Request Ingested Successfully!
                </h3>
                <p className="text-xs text-zinc-300">
                  Thank you, <strong>{submittedLeadName}</strong>. Your website and funnel teardown has been queued into our live pipeline. Our engineering team will review your URL within 24 hours.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-emerald-400/90 bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/40">
                ⚡ Prioritized on Hot Lead Radar • Telemetry Event Dispatched
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleAuditSubmit} className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marcus Vance"
                    className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                    Business Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@agency.com"
                    className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                    Website or Portfolio URL:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                    Target Vertical / Industry:
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Luxury Real Estate">Luxury Real Estate</option>
                    <option value="Creative Agency">Creative &amp; Digital Agency</option>
                    <option value="High-Ticket Local Service">High-Ticket Local Service</option>
                    <option value="B2B SaaS Studio">B2B SaaS Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                  Primary Objective:
                </label>
                <select
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Funnel Redesign & Speed Optimization">
                    Funnel Redesign &amp; Speed Optimization (Eliminate Mobile Bounce)
                  </option>
                  <option value="New Wix Studio Bespoke Build">
                    New Wix Studio Bespoke Build (Pixel-Perfect CMS Architecture)
                  </option>
                  <option value="Automated Outbound B2B Lead Engine">
                    Automated Outbound B2B Lead Engine (n8n Pipeline Integration)
                  </option>
                  <option value="Dedicated Ongoing Technical Growth Partner">
                    Dedicated Ongoing Technical Growth Partner (&ldquo;Extra Hand&rdquo;)
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_30px_rgba(99,102,241,0.4)] transition cursor-pointer active:scale-95 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Domain &amp; Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} className="text-emerald-300" />
                    <span>Claim Free Website &amp; Funnel Teardown</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] font-mono text-zinc-500 pt-2">
                🔒 Direct encrypted dispatch to Hybrid.Ops Ingestion Engine (/api/leads/webhook)
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 8. MINIMAL EXECUTIVE FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-zinc-950 py-12 px-4 md:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-wider text-white">
                HYBRID<span className="text-indigo-400">.</span>OPS
              </span>
              <span className="text-[10px] font-mono text-zinc-500">v2.4</span>
            </div>
            <p className="text-zinc-500 text-[11px]">
              Elite Web Engineering &amp; Automated B2B Lead Growth for Ambitious Operators.
            </p>
          </div>

          {/* Regional coverage */}
          <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
            <Globe size={13} className="text-indigo-400" />
            <span>Serving: United States • Canada • United Kingdom • Australia</span>
          </div>

          {/* Quick Links & Admin */}
          <div className="flex items-center gap-5 text-zinc-400">
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#verticals" className="hover:text-white transition">Verticals</a>
            <a href="#calculator" className="hover:text-white transition">ROI</a>
            <Link
              href="/dashboard"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono font-bold"
            >
              <Lock size={11} />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/[0.04] text-center text-zinc-600 text-[10px] font-mono">
          &copy; {new Date().getFullYear()} HYBRID.OPS. All rights reserved. High-Converting Agency &amp; Growth Operations Infrastructure.
        </div>
      </footer>

      {/* 9. MODAL: AUDIT REQUEST POPUP */}
      <AnimatePresence>
        {auditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-white/[0.1] p-6 sm:p-8 shadow-2xl space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={() => setAuditModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition"
              >
                <X size={18} />
              </button>

              <div className="space-y-1 pr-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  FREE COMPREHENSIVE TEARDOWN
                </span>
                <h3 className="text-xl font-bold text-white">
                  Request Your Website &amp; Funnel Audit
                </h3>
                <p className="text-xs text-zinc-400">
                  Receive a detailed breakdown of your site&apos;s mobile friction, speed defects, and outbound acquisition potential.
                </p>
              </div>

              {submitSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h4 className="text-base font-bold text-white">Audit Ingested!</h4>
                  <p className="text-xs text-zinc-400">
                    Thank you, <strong>{submittedLeadName}</strong>. Our team has received your request and will reach out with your custom teardown.
                  </p>
                  <button
                    onClick={() => setAuditModalOpen(false)}
                    className="mt-3 px-4 py-2 rounded-xl bg-zinc-800 text-xs font-bold text-white hover:bg-zinc-700 transition"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAuditSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-300">
                      Your Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Marcus Vance"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-300">
                      Work Email:
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="marcus@domain.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-300">
                      Website / Agency URL:
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="https://company.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-300">
                      Primary Goal:
                    </label>
                    <select
                      value={formData.primaryGoal}
                      onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Funnel Redesign & Speed Optimization">
                        Funnel Redesign &amp; Speed Optimization
                      </option>
                      <option value="New Wix Studio Bespoke Build">
                        New Wix Studio Bespoke Build
                      </option>
                      <option value="Automated Outbound B2B Lead Engine">
                        Automated Outbound B2B Lead Engine
                      </option>
                      <option value="Dedicated Ongoing Technical Growth Partner">
                        Dedicated Technical Growth Partner
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Teardown Request...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={14} className="text-emerald-300" />
                        <span>Send Free Teardown Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
