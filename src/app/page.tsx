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
  ChevronDown,
  Star,
  Users,
  Target,
  Code2,
  Sliders,
  Flame,
  ExternalLink,
  Play,
  Maximize2,
  HelpCircle,
  Award,
  Compass,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import { soundEngine } from "@/lib/audioAlert";
import HybridOpsLogo from "@/components/HybridOpsLogo";

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  location: string;
  vertical: string;
  heroImage: string;
  stats: string;
  lcp: string;
  tags: string[];
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "apex-horizon",
    title: "Luxury Real Estate Dynamic CMS Portal",
    client: "Apex Horizon Residential",
    location: "Austin & Westlake Hills, TX",
    vertical: "Luxury Real Estate",
    heroImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    stats: "$2.4M Avg. Deal Size Protected",
    lcp: "0.62s Sub-Second LCP",
    tags: ["Wix Studio", "Custom Velo IDX", "VIP 3D Matterport"],
    summary:
      "Overhauled a legacy WordPress estate site into a blazing-fast Wix Studio portal with dynamic MLS collections and zero mobile Safari crashes.",
    challenge:
      "High-net-worth buyers on iOS Safari experienced 500 internal server errors when submitting private showing requests for $20M+ waterfront listings, losing an estimated $140k/month in qualified advisory fees.",
    solution:
      "Engineered a bespoke Wix Studio architecture powered by custom Velo JavaScript for frictionless VIP scheduling, edge CDN asset caching, and automated SMS dispatch directly to managing brokers.",
    results: [
      "Mobile Safari 500 form errors reduced to 0.0%",
      "0.62s LCP on 4G cellular connections",
      "+48% increase in qualified private tour inquiries in the first 30 days",
    ],
  },
  {
    id: "manhattan-digital",
    title: "Creative Agency Bandwidth & Growth Engine",
    client: "Manhattan Digital Guild",
    location: "Flatiron District, New York, NY",
    vertical: "Creative Agency",
    heroImage:
      "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=1600&q=85",
    stats: "120+ Dev Hours Saved / Mo",
    lcp: "0.58s PageSpeed 99/100",
    tags: ["White-Label Wix Studio", "Automated n8n Outbound", "Velo JS"],
    summary:
      "Functioned as senior technical growth partner, eliminating agency dev bottlenecks while deploying an automated outbound prospect qualification pipeline.",
    challenge:
      "Agency founders were drowning in custom client dev tickets while manual LinkedIn outbound prospecting yielded low reply rates and inconsistent monthly retainer pipeline.",
    solution:
      "Provided dedicated white-label Wix Studio execution bandwidth and integrated an automated n8n web crawler that scans target competitor defects and crafts personalized audit pitches.",
    results: [
      "120+ senior engineering hours saved monthly",
      "3.8x outbound pipeline velocity for $15k+ enterprise retainers",
      "4.2x client retention on retainer maintenance contracts",
    ],
  },
  {
    id: "vanguard-coastal",
    title: "High-Ticket Local Service Booking Engine",
    client: "Vanguard Coastal Estates & Architecture",
    location: "Malibu & Pacific Palisades, CA",
    vertical: "High-Ticket Local Service",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    stats: "+58% Form Completion Lift",
    lcp: "0.68s Sub-Second Load",
    tags: ["Instant Booking", "Dynamic CMS", "Local SEO Engine"],
    summary:
      "Engineered a conversion-focused architectural portal with sub-60-second lead routing and interactive architectural portfolio galleries.",
    challenge:
      "Architectural video showreels were choking cellular connections (5.8s LCP), causing affluent homeowners looking for $500k+ renovations to bounce before seeing portfolios.",
    solution:
      "Replaced uncompressed video blocks with progressive WebP hero streams and built an instant booking funnel that syncs leads directly with managing partners in real-time.",
    results: [
      "58% lift in mobile consultation bookings",
      "PageSpeed score improved from 38 to 98 on mobile devices",
      "Zero missed inquiries across California, Canada, and Australia",
    ],
  },
];

const FAQS = [
  {
    question: "How does Hybrid.Ops differ from a traditional web agency or freelancer?",
    answer:
      "Traditional agencies build static templates, hand you the keys, and disappear when mobile bugs or leaky forms appear. Hybrid.Ops combines elite Wix Studio engineering with an automated B2B lead generation engine (n8n Cloud) and ongoing technical partnership. We don't just build sites; we guarantee sub-second speed, 100% form ingestion reliability, and continuous qualified lead growth.",
  },
  {
    question: "Why do you specialize in Wix Studio and custom Velo instead of WordPress or Webflow?",
    answer:
      "Wix Studio provides agency-grade responsive breakpoints, enterprise-grade cloud hosting on global CDNs, and seamless dynamic CMS collections that founders can edit without touching code. By combining Wix Studio with custom Velo (JavaScript), we deliver custom web apps, private API integrations, and instant CRM lead routing without plugin vulnerabilities, security patches, or server maintenance overhead.",
  },
  {
    question: "How does the automated lead generation and n8n webhook engine work?",
    answer:
      "Our system continuously audits target websites in your target verticals (real estate brokers, creative agencies, local service studios). It detects technical bottlenecks (such as mobile Safari form crashes, un-cached 80MB videos, or missing Core Web Vitals) and automatically generates personalized, data-backed outreach hooks that make outreach effortlessly high-converting.",
  },
  {
    question: "What is the typical turnaround time for a custom website and funnel overhaul?",
    answer:
      "Most bespoke Wix Studio projects and funnel rebuilds launch in 2 to 3 weeks. Because we operate with a dedicated senior engineering model rather than bloated agency account management, execution is fast, communicative, and zero-friction.",
  },
  {
    question: "Do you offer white-label services for creative and digital agencies?",
    answer:
      "Yes. A significant portion of our partner roster consists of digital agencies in the US and UK who outsource their Wix Studio and Velo custom code execution to us under complete NDA, freeing up their team to focus on client strategy and creative direction.",
  },
];

export default function PublicLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);

  // Active FAQ Accordion item index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive video walkthrough chapter selector (0, 1, 2)
  const [activeVideoChapter, setActiveVideoChapter] = useState(0);

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
  const estimatedCurrentLeads = Math.max(1, Math.round(monthlyVisitors * 0.012));
  const estimatedLostLeads = Math.round(estimatedCurrentLeads * 0.45);
  const estimatedLostRevenue = estimatedLostLeads * averageDealValue;
  const projectedLiftLeads = Math.round(estimatedCurrentLeads * 1.55);
  const projectedNewRevenue =
    (projectedLiftLeads - estimatedCurrentLeads) * averageDealValue;

  const handleOpenAuditModal = (audience?: "business" | "agency" | "developer" | React.MouseEvent) => {
    soundEngine.playGlassClick();
    setSubmitSuccess(false);
    if (typeof audience === "string") {
      if (audience === "business") {
        setFormData((prev) => ({
          ...prev,
          primaryGoal: "Find Development Partner (New Build / Redesign)",
          industry: "Growing Business / Enterprise",
        }));
      } else if (audience === "agency") {
        setFormData((prev) => ({
          ...prev,
          primaryGoal: "Agency White-Label Development Partnership",
          industry: "Digital / Creative Agency",
        }));
      } else if (audience === "developer") {
        setFormData((prev) => ({
          ...prev,
          primaryGoal: "Developer Partner Network Application",
          industry: "Technical Developer / Engineer",
        }));
      }
    }
    setAuditModalOpen(true);
  };

  const handleOpenVideoModal = () => {
    soundEngine.playRadarPing(0.3);
    setVideoModalOpen(true);
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
      linkedin: `https://linkedin.com/in/${formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}`,
      lead_score: 96,
      status: "HOT",
      bottlenecks: `Inbound Teardown Request: ${formData.primaryGoal}`,
      personalized_hook: `Prospect ${formData.name} requested an executive website & lead teardown for ${formData.websiteUrl}. Primary objective: ${formData.primaryGoal}.`,
      audit_timestamp: new Date().toISOString(),
      tags: ["Inbound Homepage Audit", formData.industry, "Ready to Pitch"],
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
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#6366f1", "#10b981", "#38bdf8", "#f59e0b"],
          });
        } catch {}

        setSubmittedLeadName(formData.name);
        setSubmitSuccess(true);
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch {
      // Optimistic fallback for demonstration
      soundEngine.playRadarPing(0.4);
      setSubmittedLeadName(formData.name);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900 font-sans antialiased overflow-x-hidden">
      {/* 1. BRIGHT AIRY AURORA MESH BACKGROUND & FLOATING 3D ORBS (MATCHING DASHBOARD & MOCKUP) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Pearlescent Base Canvas */}
        <div className="absolute inset-0 bg-[#f8fafc]" />

        {/* Multi-Color Radiant Aurora Mesh */}
        <div className="absolute inset-0 caustic-backdrop-aurora opacity-75" />

        {/* Floating Warm Sunset / Peach Amber Orb (Upper Left - exactly matching reference mockup) */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-amber-300/40 via-orange-300/30 to-rose-300/20 blur-[85px]"
        />

        {/* Floating Fresh Aqua Mint / Emerald Orb (Right Center - matching reference mockup) */}
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.18, 0.92, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[35%] -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-teal-300/40 via-emerald-200/30 to-cyan-300/25 blur-[95px]"
        />

        {/* Floating Soft Pastel Lavender / Indigo Orb (Bottom Center) */}
        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.12, 0.96, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-300/35 via-violet-200/25 to-purple-200/20 blur-[100px]"
        />

        {/* Delicate floating 3D-inspired decorative crystal badges in hero */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-36 left-[8%] hidden xl:flex items-center justify-center w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_12px_30px_rgba(99,102,241,0.12)] rotate-12"
        >
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 rotate-45" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-52 right-[10%] hidden xl:flex items-center justify-center w-14 h-14 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_14px_35px_rgba(16,185,129,0.12)] -rotate-6"
        >
          <Sparkles className="text-emerald-500 w-6 h-6" />
        </motion.div>
      </div>

      {/* 2. FLOATING FROSTED GLASS NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 py-3.5 backdrop-blur-2xl bg-white/80 border-b border-white/80 shadow-[0_4px_30px_rgba(23,33,61,0.03)] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <HybridOpsLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-slate-600">
            <a href="#" className="hover:text-[#17213D] transition-colors">Home</a>
            <a href="#businesses" className="hover:text-[#17213D] transition-colors">For Businesses</a>
            <a href="#agencies" className="hover:text-[#17213D] transition-colors">For Agencies</a>
            <a href="#developers" className="hover:text-[#17213D] transition-colors">For Developers</a>
            <a href="#services" className="hover:text-[#17213D] transition-colors">Services</a>
            <a href="#portfolio" className="hover:text-[#17213D] transition-colors">Our Work</a>
          </div>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Discreet Admin Login Button */}
            <Link
              href="/dashboard"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-500 hover:text-[#8B5CF6] hover:bg-white/90 border border-slate-200/70 hover:border-purple-200 transition shadow-2xs"
              title="Protected Admin Command Center"
            >
              <Lock size={12} className="text-[#8B5CF6]" />
              <span>Admin</span>
            </Link>

            {/* Secondary CTA: Explore Partnerships */}
            <a
              href="#services"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#17213D] bg-white/80 hover:bg-white border border-slate-200/80 hover:border-purple-300 shadow-sm transition"
            >
              <span>Explore Partnerships</span>
            </a>

            {/* Primary CTA: Let's Partner */}
            <button
              onClick={handleOpenAuditModal}
              className="relative group overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#0EA5E9] hover:from-[#7C3AED] hover:to-[#0284C7] shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_25px_rgba(139,92,246,0.45)] transition-all cursor-pointer active:scale-[0.98]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              <span>Let&apos;s Partner</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100/70 transition"
              aria-label="Toggle navigation menu"
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
              className="lg:hidden px-4 pt-4 pb-6 space-y-3 border-t border-slate-200/80 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl"
            >
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-[#17213D] py-1"
              >
                Home
              </a>
              <a
                href="#businesses"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-[#17213D] py-1"
              >
                For Businesses
              </a>
              <a
                href="#agencies"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-[#17213D] py-1"
              >
                For Agencies
              </a>
              <a
                href="#developers"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-[#17213D] py-1"
              >
                For Developers
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-[#17213D] py-1"
              >
                Services
              </a>
              <a
                href="#portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-[#17213D] py-1"
              >
                Our Work
              </a>
              <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenAuditModal();
                  }}
                  className="w-full py-3 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#0EA5E9]"
                >
                  Let&apos;s Partner
                </button>
                <div className="flex items-center justify-between pt-1">
                  <a
                    href="#services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Explore Partnerships &rarr;
                  </a>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-mono font-bold text-[#8B5CF6] flex items-center gap-1"
                  >
                    <Lock size={12} />
                    <span>Admin Portal</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. HERO SECTION — CONNECTED PARTNERSHIP ECOSYSTEM (LIGHT-MODE FROSTED GLASS) */}
      <section className="relative z-10 pt-36 md:pt-44 pb-20 md:pb-28 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Trust-Oriented Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/85 border border-[#8B5CF6]/25 shadow-[0_4px_20px_rgba(139,92,246,0.08)] text-[11px] font-mono tracking-widest text-[#17213D] uppercase font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>YOUR STRATEGIC TECHNOLOGY PARTNER</span>
          </motion.div>

          {/* Headline with refined purple-to-blue gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-[#17213D]"
          >
            Your Growth. Our Technology.{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#0EA5E9] bg-clip-text text-transparent">
              One Powerful Partnership.
            </span>
          </motion.h1>

          {/* Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Hybrid-Ops connects ambitious businesses and digital agencies with skilled development partners to build, scale, and maintain exceptional digital experiences.
          </motion.p>

          {/* Dual Audience-Focused CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            {/* Primary: Find Your Development Partner */}
            <button
              onClick={handleOpenAuditModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#0EA5E9] hover:from-[#7C3AED] hover:to-[#0284C7] shadow-[0_10px_35px_rgba(139,92,246,0.35)] hover:shadow-[0_14px_45px_rgba(139,92,246,0.5)] transition-all cursor-pointer group active:scale-[0.98]"
            >
              <Sparkles size={16} className="text-[#10B981]" />
              <span>Find Your Development Partner</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary: Become a Developer Partner */}
            <button
              onClick={handleOpenAuditModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-bold text-sm text-[#17213D] bg-white/90 hover:bg-white border border-slate-200/90 hover:border-[#8B5CF6]/50 shadow-[0_6px_25px_rgba(23,33,61,0.06)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)] transition-all cursor-pointer group active:scale-[0.98]"
            >
              <Code2 size={16} className="text-[#8B5CF6]" />
              <span>Become a Developer Partner</span>
              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

          {/* Trust Stat Bar (Light-Mode Frosted Glass) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-10 border-t border-slate-200/80 text-left"
          >
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(23,33,61,0.04)]">
              <div className="text-xl md:text-2xl font-black text-[#8B5CF6] font-mono">99.8%</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Match Accuracy</div>
              <div className="text-[10px] text-slate-500 font-mono">Skill &amp; culture alignment</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(23,33,61,0.04)]">
              <div className="text-xl md:text-2xl font-black text-[#0EA5E9] font-mono">&lt; 48h</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Deployment Speed</div>
              <div className="text-[10px] text-slate-500 font-mono">Zero onboarding friction</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(23,33,61,0.04)]">
              <div className="text-xl md:text-2xl font-black text-[#10B981] font-mono">100%</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">White-Label Delivery</div>
              <div className="text-[10px] text-slate-500 font-mono">Under your agency brand</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(23,33,61,0.04)]">
              <div className="text-xl md:text-2xl font-black text-[#17213D] font-mono">Top 3%</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Vetted Standard</div>
              <div className="text-[10px] text-slate-500 font-mono">Wix Studio, Velo &amp; Next.js</div>
            </div>
          </motion.div>
        </div>

        {/* 4. HERO VISUAL CONCEPT — CONNECTED PARTNERSHIP ECOSYSTEM (LIGHT-MODE GLASS CANVAS) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-14 max-w-5xl mx-auto relative"
        >
          {/* Main Ecosystem Frosted Glass Canvas */}
          <div className="rounded-3xl backdrop-blur-2xl bg-white/80 border border-white/95 p-6 sm:p-10 shadow-[0_25px_70px_rgba(23,33,61,0.08),inset_0_1px_2px_rgba(255,255,255,1)] relative overflow-hidden min-h-[500px] md:min-h-[540px] flex flex-col justify-between">
            {/* Ambient Background Glow Orbs inside showcase */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#8B5CF6]/15 via-[#0EA5E9]/15 to-[#10B981]/15 blur-[80px] pointer-events-none" />

            {/* Subtle SVG Connection Pathways (Desktop/Tablet) */}
            <svg
              className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="lineGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="lineGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="lineGradBottom" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Path from Businesses (Top-Left) to Center Hub */}
              <path
                d="M 230 140 C 340 160, 400 230, 512 260"
                stroke="url(#lineGradLeft)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                fill="none"
                className="opacity-70 animate-pulse"
              />

              {/* Path from Agencies (Top-Right) to Center Hub */}
              <path
                d="M 790 140 C 680 160, 620 230, 512 260"
                stroke="url(#lineGradRight)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                fill="none"
                className="opacity-70 animate-pulse"
              />

              {/* Path from Developers (Bottom-Center) to Center Hub */}
              <path
                d="M 512 430 C 512 370, 512 320, 512 290"
                stroke="url(#lineGradBottom)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                fill="none"
                className="opacity-70 animate-pulse"
              />
            </svg>

            {/* Central Hybrid-Ops Identity Core (Desktop: absolute center, Mobile: top center) */}
            <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 flex flex-col items-center justify-center text-center my-6 md:my-0">
              {/* Outer Pulsing Ring */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#8B5CF6]/20 to-[#0EA5E9]/20 animate-pulse-slow blur-md" />
                <div className="relative w-28 h-28 rounded-full bg-white/95 backdrop-blur-2xl border-2 border-white shadow-[0_12px_40px_rgba(23,33,61,0.12)] flex items-center justify-center p-3">
                  <HybridOpsLogo size="md" monogramOnly={true} className="w-14 h-14" />
                </div>

                {/* Orbiting Tech Particles */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                  className="absolute w-36 h-36 rounded-full border border-dashed border-[#8B5CF6]/40 pointer-events-none"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#0EA5E9] shadow-[0_0_8px_#0EA5E9]" />
                </motion.div>
              </div>

              {/* Center Identity Labels */}
              <div className="mt-3.5 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-xs text-[11px] font-mono font-bold text-[#17213D]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  <span>HYBRID-OPS ECOSYSTEM</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Connecting Businesses • Agencies • Developers
                </div>
              </div>
            </div>

            {/* Three Connected Ecosystem Cards */}
            {/* Desktop: Absolute Triad Layout; Mobile: Stacked Vertical Grid */}
            <div className="grid grid-cols-1 md:block gap-4 relative z-20 w-full">
              {/* Card 1: Businesses (Top-Left on Desktop) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="md:absolute md:top-4 md:left-4 lg:left-6 md:w-64 lg:w-72 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/95 p-4 sm:p-5 shadow-[0_12px_35px_rgba(14,165,233,0.12)] hover:shadow-[0_16px_45px_rgba(14,165,233,0.18)] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-[#0EA5E9] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building2 size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0EA5E9] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
                    FOR BUSINESSES
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#17213D]">
                  Scale Engineering Capacity
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Direct access to vetted development partners to build bespoke web platforms, SaaS apps, and dynamic CMS collections.
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500 flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-[#10B981]" />
                    Zero Hiring Friction
                  </span>
                  <span className="font-bold text-[#0EA5E9]">Milestone Vetted</span>
                </div>
              </motion.div>

              {/* Card 2: Agencies (Top-Right on Desktop) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="md:absolute md:top-4 md:right-4 lg:right-6 md:w-64 lg:w-72 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/95 p-4 sm:p-5 shadow-[0_12px_35px_rgba(139,92,246,0.12)] hover:shadow-[0_16px_45px_rgba(139,92,246,0.18)] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Briefcase size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B5CF6] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                    FOR AGENCIES
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#17213D]">
                  White-Label Production Bandwidth
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Wix Studio &amp; Velo engineering powerhouses ready to build client projects under your agency banner with zero margin drain.
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Zap size={13} className="text-[#8B5CF6]" />
                    100% White-Label
                  </span>
                  <span className="font-bold text-[#8B5CF6]">120+ Hrs / Mo</span>
                </div>
              </motion.div>

              {/* Card 3: Developers (Bottom-Center on Desktop) */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="md:absolute md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:w-72 lg:w-80 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/95 p-4 sm:p-5 shadow-[0_12px_35px_rgba(16,185,129,0.12)] hover:shadow-[0_16px_45px_rgba(16,185,129,0.18)] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#10B981] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Code2 size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    FOR DEVELOPERS
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#17213D]">
                  High-Impact Strategic Retainers
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Join a vetted technology partner network. Work on high-value client builds with transparent milestone compensation.
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-[#10B981]" />
                    Top 3% Vetted
                  </span>
                  <span className="font-bold text-[#10B981]">Long-Term Retainers</span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Status Banner inside Hero Canvas */}
            <div className="relative z-20 mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>Ecosystem Match Engine Online</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700 font-bold">Wix Studio • Velo JS • Next.js • n8n</span>
              </div>
              <button
                onClick={handleOpenVideoModal}
                className="flex items-center gap-1.5 text-xs font-bold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors cursor-pointer"
              >
                <Play size={12} className="fill-[#8B5CF6]" />
                <span>Watch 60s Ecosystem Walkthrough</span>
              </button>
            </div>
          </div>

          {/* Floating 3D Micro-Badges around Hero */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -left-4 sm:-left-8 p-3 rounded-2xl backdrop-blur-xl bg-white/95 border border-white shadow-[0_12px_35px_rgba(139,92,246,0.15)] hidden sm:flex items-center gap-2.5 z-30"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center font-bold">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Match Accuracy</div>
              <div className="text-xs font-black text-[#17213D]">99.8% Vetted Fit</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-4 sm:-right-6 p-3 rounded-2xl backdrop-blur-xl bg-white/95 border border-white shadow-[0_12px_35px_rgba(16,185,129,0.15)] hidden sm:flex items-center gap-2.5 z-30"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold">
              <Zap size={16} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Deployment Speed</div>
              <div className="text-xs font-black text-[#17213D]">&lt; 48-Hour Matching</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. PARTNER & TECH STACK TRUST STRIP (LIGHT MONOCHROME SLATE) */}
      <section className="relative z-10 py-12 px-4 md:px-8 border-y border-slate-200/80 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-6">
            Engineered On Enterprise-Grade Modern Architecture
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-slate-500 font-mono text-xs font-bold">
            <span className="hover:text-indigo-600 transition flex items-center gap-2">
              <Code2 size={16} className="text-indigo-600" /> WIX STUDIO
            </span>
            <span className="hover:text-indigo-600 transition flex items-center gap-2">
              <Zap size={16} className="text-violet-600" /> VELO BY WIX
            </span>
            <span className="hover:text-indigo-600 transition flex items-center gap-2">
              <Cpu size={16} className="text-cyan-600" /> NEXT.JS 14
            </span>
            <span className="hover:text-indigo-600 transition flex items-center gap-2">
              <Layers size={16} className="text-emerald-600" /> n8n CLOUD
            </span>
            <span className="hover:text-indigo-600 transition flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" /> GOOGLE GEMINI AI
            </span>
            <span className="hover:text-indigo-600 transition flex items-center gap-2">
              <Globe size={16} className="text-sky-600" /> NETLIFY EDGE CDN
            </span>
          </div>
        </div>
      </section>

      {/* 6. FEATURED TRANSFORMATIONS & VISUAL PORTFOLIO (MATCHING MOCKUP "RECENT PROJECTS") */}
      <section id="portfolio" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              <Sparkles size={13} />
              <span>Proven Growth Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Recent High-Ticket Transformations
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
              Explore how we replaced clunky, leaky legacy websites with high-converting Wix Studio portals and automated outbound pipelines.
            </p>
          </div>
          <button
            onClick={handleOpenAuditModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 transition shadow-xs self-start md:self-auto cursor-pointer"
          >
            <span>Request Teardown for Your Site</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl backdrop-blur-xl bg-white/75 border border-white/90 p-5 shadow-[0_16px_40px_rgba(99,102,241,0.06)] hover:shadow-[0_24px_50px_rgba(99,102,241,0.12)] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Visual Thumbnail Image */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-slate-800 shadow-xs">
                    {project.location}
                  </div>
                  <div className="absolute bottom-3 left-3 text-xs font-bold text-white drop-shadow-md">
                    {project.stats}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-bold">
                    {project.vertical}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button: Live Preview / Case Study */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {project.lcp}
                </span>
                <button
                  onClick={() => setSelectedCaseStudy(project)}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                >
                  <span>Live Case Study</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. WHO WE HELP — THREE AUDIENCE PARTNERSHIP ECOSYSTEM (PHASE 02) */}
      <section id="verticals" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div id="businesses" className="-top-28 relative pointer-events-none" />
        <div id="agencies" className="-top-28 relative pointer-events-none" />
        <div id="developers" className="-top-28 relative pointer-events-none" />

        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/85 border border-[#8B5CF6]/20 shadow-[0_4px_20px_rgba(139,92,246,0.06)] text-[11px] font-mono tracking-widest text-[#17213D] uppercase font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
            <span>ONE ECOSYSTEM. THREE PATHS TO GROW.</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#17213D] tracking-tight leading-[1.12]">
            Built for{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] bg-clip-text text-transparent">
              Businesses.{" "}
            </span>
            <span className="bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] bg-clip-text text-transparent">
              Agencies.{" "}
            </span>
            <span className="bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">
              Developers.
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Whether you&apos;re building a business, scaling an agency, or growing your development career, Hybrid-Ops connects you with the right opportunities, people, and technology.
          </p>
        </div>

        {/* Understated Visual Connection Element (Shared Ecosystem Indicator) */}
        <div className="mb-12 max-w-3xl mx-auto hidden md:flex items-center justify-between p-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-sm text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2 text-[#8B5CF6] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <span>Businesses</span>
          </div>
          <div className="flex-1 mx-4 flex items-center justify-center gap-2 text-slate-400">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-[#8B5CF6]/30 via-[#0EA5E9]/30 to-[#10B981]/30" />
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-white/90 px-3 py-1 rounded-full border border-slate-200/80 text-slate-700 shadow-2xs flex items-center gap-1.5">
              <HybridOpsLogo monogramOnly size="sm" className="w-3.5 h-3.5 inline-block" />
              Unified Collaboration Network
            </span>
            <span className="h-[1px] flex-1 bg-gradient-to-r from-[#0EA5E9]/30 via-[#10B981]/30 to-[#10B981]/30" />
          </div>
          <div className="flex items-center gap-2 text-[#10B981] font-bold">
            <span>Developers</span>
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          </div>
        </div>

        {/* Three Distinctive Audience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {/* ======================================================== */}
          {/* CARD ONE: FOR BUSINESSES (Visual Accent: Purple)         */}
          {/* ======================================================== */}
          <div className="rounded-3xl backdrop-blur-2xl bg-white/80 border border-white/95 p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_20px_50px_rgba(23,33,61,0.06)] hover:shadow-[0_25px_60px_rgba(139,92,246,0.14)] hover:border-[#8B5CF6]/40 transition-all duration-300 group relative overflow-hidden">
            {/* Top Accent Iridescent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]" />

            <div className="space-y-5">
              {/* Card Header & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/80 text-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <Building2 size={24} />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#8B5CF6] font-bold bg-purple-50/90 px-3 py-1 rounded-full border border-purple-200/70">
                  For Businesses
                </span>
              </div>

              {/* Headline & Description */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#17213D] tracking-tight">
                  Build Smarter. Grow Faster.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Turn your business ideas into powerful digital experiences with reliable development partners and ongoing technical support.
                </p>
              </div>

              {/* Custom Interactive Visual Mockup / Interface Badge */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-purple-50/40 border border-purple-100 shadow-inner space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-500 pb-1.5 border-b border-purple-100/80">
                  <span className="text-slate-600 font-bold">● ARCHITECTURE STATUS</span>
                  <span className="text-[#8B5CF6] font-bold">100% PRODUCTION READY</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>&gt; Custom CMS Collections</span>
                  <span className="text-emerald-600 font-bold">SUB-SECOND LCP</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>&gt; Business Automation</span>
                  <span className="text-[#8B5CF6] font-bold">API INTEGRATED</span>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  Core Capabilities Delivered:
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                    <span>Custom website development</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                    <span>Wix Studio and advanced Velo solutions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                    <span>Website redesign and optimization</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                    <span>Business automation and integrations</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                    <span>Ongoing website maintenance</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA & Supporting Microcopy */}
            <div className="pt-5 border-t border-slate-100 space-y-2.5">
              <button
                onClick={() => handleOpenAuditModal("business")}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_25px_rgba(139,92,246,0.45)] transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>Find Your Development Partner</span>
                <ArrowRight size={14} />
              </button>
              <p className="text-center text-[11px] text-slate-500 font-mono">
                Let&apos;s build something that moves your business forward.
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD TWO: FOR DIGITAL AGENCIES (Visual Accent: Electric Blue) */}
          {/* ======================================================== */}
          <div className="rounded-3xl backdrop-blur-2xl bg-white/80 border border-white/95 p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_20px_50px_rgba(23,33,61,0.06)] hover:shadow-[0_25px_60px_rgba(14,165,233,0.14)] hover:border-[#0EA5E9]/40 transition-all duration-300 group relative overflow-hidden">
            {/* Top Accent Iridescent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7]" />

            <div className="space-y-5">
              {/* Card Header & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/80 text-[#0EA5E9] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <Briefcase size={24} />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#0EA5E9] font-bold bg-sky-50/90 px-3 py-1 rounded-full border border-sky-200/70">
                  For Digital Agencies
                </span>
              </div>

              {/* Headline & Description */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#17213D] tracking-tight">
                  Scale Your Agency Without Scaling Overhead.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Expand your service capabilities with dependable white-label development support and flexible technical collaboration.
                </p>
              </div>

              {/* Custom Interactive Visual Mockup / Interface Badge */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-sky-50/40 border border-sky-100 shadow-inner space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-500 pb-1.5 border-b border-sky-100/80">
                  <span className="text-slate-600 font-bold">● WHITE-LABEL BANDWIDTH</span>
                  <span className="text-[#0EA5E9] font-bold">FLEXIBLE RETRACT / EXPAND</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>&gt; Velo &amp; Custom Code</span>
                  <span className="text-[#0EA5E9] font-bold">UNDER YOUR BRAND</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>&gt; Overflow Sprint Capacity</span>
                  <span className="text-emerald-600 font-bold">ON-DEMAND QA</span>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  Partnership Advantages:
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#0EA5E9] shrink-0 mt-0.5" />
                    <span>White-label development</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#0EA5E9] shrink-0 mt-0.5" />
                    <span>Overflow project support</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#0EA5E9] shrink-0 mt-0.5" />
                    <span>Wix and custom development expertise</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#0EA5E9] shrink-0 mt-0.5" />
                    <span>Flexible collaboration</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#0EA5E9] shrink-0 mt-0.5" />
                    <span>Reliable technical execution</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA & Supporting Microcopy */}
            <div className="pt-5 border-t border-slate-100 space-y-2.5">
              <button
                onClick={() => handleOpenAuditModal("agency")}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-[#0284C7] hover:to-[#0369A1] shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.45)] transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>Explore Agency Partnerships</span>
                <ArrowRight size={14} />
              </button>
              <p className="text-center text-[11px] text-slate-500 font-mono">
                Deliver more projects without building a larger in-house team.
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD THREE: FOR DEVELOPERS (Visual Accent: Mint Green)   */}
          {/* ======================================================== */}
          <div className="rounded-3xl backdrop-blur-2xl bg-white/80 border border-white/95 p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_20px_50px_rgba(23,33,61,0.06)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.14)] hover:border-[#10B981]/40 transition-all duration-300 group relative overflow-hidden md:col-span-2 lg:col-span-1">
            {/* Top Accent Iridescent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#10B981] to-[#059669]" />

            <div className="space-y-5">
              {/* Card Header & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[#10B981] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <Code2 size={24} />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#10B981] font-bold bg-emerald-50/90 px-3 py-1 rounded-full border border-emerald-200/70">
                  For Developers
                </span>
              </div>

              {/* Headline & Description */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#17213D] tracking-tight">
                  Your Skills. More Opportunities.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Connect with businesses and agencies looking for skilled development professionals and meaningful long-term collaborations.
                </p>
              </div>

              {/* Custom Interactive Visual Mockup / Interface Badge */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 border border-emerald-100 shadow-inner space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-500 pb-1.5 border-b border-emerald-100/80">
                  <span className="text-slate-600 font-bold">● TALENT NETWORK</span>
                  <span className="text-[#10B981] font-bold">VETTED PEER COMMUNITY</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>&gt; Modern Stack Focus</span>
                  <span className="text-slate-900 font-bold">WIX STUDIO • VELO • NEXT</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>&gt; Client Engagements</span>
                  <span className="text-[#10B981] font-bold">DIRECT COLLABORATION</span>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  Partner Opportunities:
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#10B981] shrink-0 mt-0.5" />
                    <span>Relevant project opportunities</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#10B981] shrink-0 mt-0.5" />
                    <span>Professional collaboration</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#10B981] shrink-0 mt-0.5" />
                    <span>Work with agencies and businesses</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#10B981] shrink-0 mt-0.5" />
                    <span>Showcase your technical expertise</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#10B981] shrink-0 mt-0.5" />
                    <span>Build long-term partnerships</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA & Supporting Microcopy */}
            <div className="pt-5 border-t border-slate-100 space-y-2.5">
              <button
                onClick={() => handleOpenAuditModal("developer")}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.45)] transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>Become a Developer Partner</span>
                <ArrowRight size={14} />
              </button>
              <p className="text-center text-[11px] text-slate-500 font-mono">
                Bring your skills into a network built around collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHAT WE DELIVER — ARCHITECTURAL TIERED BENTO (TOP PANORAMIC 12-COL + BOTTOM 2 BALANCED 6-COL) */}
      <section id="services" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div id="developers" className="-top-28 relative pointer-events-none" />
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
            Full-Stack Agency Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Everything You Need To Scale Revenue, Without In-House Overhead
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Three unified pillars that turn slow, fragmented web properties into automated growth systems.
          </p>
        </div>

        {/* Distinct Layout: 1 Panoramic Flagship Card on Top + 2 Dual Balanced Cards Below */}
        <div className="space-y-6">
          {/* Top Flagship Card (Pillar 01: High-Converting Website Engineering) */}
          <div className="p-6 sm:p-8 md:p-10 rounded-3xl backdrop-blur-xl bg-white/80 border border-white/95 shadow-[0_20px_50px_rgba(99,102,241,0.08)] hover:shadow-[0_25px_60px_rgba(99,102,241,0.12)] hover:border-indigo-300 transition-all duration-300 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column Content */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-mono font-bold text-lg">
                    01
                  </div>
                  <div className="text-xs font-mono text-indigo-700 font-bold uppercase tracking-wider bg-indigo-50/80 px-3 py-1 rounded-full border border-indigo-200/60">
                    Flagship Web Architecture
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    High-Converting Website Engineering
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Bespoke Wix Studio builds, pixel-perfect responsive layouts, custom Velo JavaScript logic, and dynamic CMS collections. You get full control to edit text and listings while we guarantee sub-second speed on all devices.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Dynamic CMS Collections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Sub-second Edge CDN Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Custom Velo Calculators &amp; Filters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Mobile Safari 60fps Smoothness</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-slate-600">
                  <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    Wix Studio
                  </span>
                  <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    Velo JS
                  </span>
                  <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    Next.js CDN
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 font-bold flex items-center gap-1">
                    <Zap size={12} className="fill-emerald-600" />
                    LCP &lt; 0.8s
                  </span>
                </div>
              </div>

              {/* Right Column Visual / Browser Preview */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-900 group/mockup">
                  {/* Mockup Top Window Bar */}
                  <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      https://studio.hybrid-ops.com
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      LIVE 60FPS
                    </span>
                  </div>

                  {/* High-Res Visual */}
                  <div className="relative h-64 sm:h-72">
                    <img
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                      alt="High-Converting Website Engineering Workspace"
                      className="w-full h-full object-cover group-hover/mockup:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Floating Badges */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-white/80 shadow-lg flex items-center gap-1.5">
                      <Sparkles size={13} className="text-indigo-600" />
                      <span>Pixel-Perfect Responsive Engine</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md text-emerald-400 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 shadow-lg">
                      +45% Conversion Lift
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Dual Balanced Cards (Pillars 02 & 03) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 02: Automated Lead Generation Pipelines */}
            <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/80 border border-white/95 shadow-[0_16px_40px_rgba(139,92,246,0.06)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.12)] hover:border-violet-300 transition-all duration-300 flex flex-col justify-between space-y-6 group">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 text-violet-700 flex items-center justify-center font-mono font-bold text-lg">
                    02
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
                    Outbound &amp; Inbound Ingestion
                  </span>
                </div>

                {/* Card Visual Banner */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner group/subimg">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                    alt="Automated Lead Generation Pipelines & n8n Telemetry"
                    className="w-full h-full object-cover group-hover/subimg:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 bg-violet-950/80 backdrop-blur-md text-violet-200 text-[11px] font-mono px-2.5 py-1 rounded-md border border-violet-400/30 flex items-center gap-1.5">
                    <Cpu size={12} className="text-violet-400" />
                    <span>n8n Cloud Webhook Engine Active</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Automated Lead Generation Pipelines
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Automated crawlers powered by n8n that identify website performance bottlenecks across target accounts, locate decision-makers, and formulate high-converting personalized pitches.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-violet-600 shrink-0" />
                    <span>Target account crawling &amp; bottleneck detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-violet-600 shrink-0" />
                    <span>Decision-maker discovery &amp; personalized pitches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-violet-600 shrink-0" />
                    <span>Instant sync to Hot Lead Radar &amp; Outreach Studio</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Pipeline Engine</span>
                <span className="text-violet-700 font-bold bg-violet-50 px-2.5 py-1 rounded">
                  1,200+ Qualified / Mo
                </span>
              </div>
            </div>

            {/* Pillar 03: Dedicated Technical Growth Partner ("Extra Hand") */}
            <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/80 border border-white/95 shadow-[0_16px_40px_rgba(16,185,129,0.06)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between space-y-6 group">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-mono font-bold text-lg">
                    03
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Senior Engineering Wingman
                  </span>
                </div>

                {/* Card Visual Banner */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner group/subimg">
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                    alt="Dedicated Technical Growth Partner Hands-on Execution"
                    className="w-full h-full object-cover group-hover/subimg:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-[11px] font-mono px-2.5 py-1 rounded-md border border-emerald-400/30 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span>Dedicated Slack &amp; WhatsApp Channel</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Dedicated Growth Partner (&ldquo;Extra Hand&rdquo;)
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Never worry about broken mobile layouts, slow image loading, or leaky forms again. We function as your senior technical wingman, continuously optimizing funnels and implementing custom features.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>Continuous QA, Lighthouse audits &amp; speed fixes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>A/B funnel split tests &amp; conversion tuning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>White-label agency execution under your brand</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Service SLA</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded">
                  &lt; 2-Hour SLA Resolution
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHY PARTNER WITH US (SIDE-BY-SIDE VALUE COMPARISON) */}
      <section id="comparison" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-700">
            The Hybrid Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Traditional Agencies vs. Hybrid.Ops Architecture
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            See the tangible business differences between legacy web shops and our automated growth infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Column A: Traditional Web Agencies */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-100/70 border border-slate-200/90 space-y-5">
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">
                LEGACY APPROACH
              </div>
              <h3 className="text-xl font-bold text-slate-800">Traditional Web Agencies</h3>
            </div>
            <ul className="space-y-4 text-xs text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-sm shrink-0">✕</span>
                <span><strong>Slow LCP (5.8s+):</strong> Heavy bloated themes that cause mobile visitors to bounce immediately.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-sm shrink-0">✕</span>
                <span><strong>Leaky Inquiries:</strong> Unmonitored forms silently crash on iOS Safari, losing high-value buyers.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-sm shrink-0">✕</span>
                <span><strong>Manual Prospecting:</strong> Hours wasted on cold LinkedIn searching with generic copy templates.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-sm shrink-0">✕</span>
                <span><strong>Zero Ongoing Accountability:</strong> Project ends when site launches; maintenance is your headache.</span>
              </li>
            </ul>
          </div>

          {/* Column B: Hybrid.Ops Growth Architecture */}
          <div className="p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/90 border border-indigo-200 shadow-[0_20px_50px_rgba(99,102,241,0.12)] space-y-5 relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
              Recommended
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-indigo-700 uppercase tracking-widest font-bold">
                NEXT-GEN PIPELINE
              </div>
              <h3 className="text-xl font-bold text-slate-900">Hybrid.Ops Growth Architecture</h3>
            </div>
            <ul className="space-y-4 text-xs text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Sub-Second CDN (0.6s):</strong> Bespoke Wix Studio engineering delivers instantaneous mobile page renders.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>100% Ingestion Telemetry:</strong> Every inbound inquiry is tracked, validated, and pushed directly to CRM in real-time.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Autonomous n8n Lead Engine:</strong> Continuous competitor audits pinpoint target clients with pre-written customized pitches.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Embedded Senior Technical Partner:</strong> Ongoing QA, speed tuning, and execution bandwidth for as long as you scale.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 10. INTERACTIVE REVENUE LEAK & ROI SIMULATOR (FROSTED GLASS) */}
      <section id="calculator" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
            Interactive Growth Simulator
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Calculate How Much Revenue Your Current Website is Leaking
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Adjust the sliders below to see how optimizing mobile speed and automated lead capture impacts your bottom line.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl backdrop-blur-2xl bg-white/80 border border-white/95 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(99,102,241,0.08)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Sliders on Left */}
            <div className="md:col-span-7 space-y-6">
              {/* Slider 1: Monthly Visitors */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-700 font-bold uppercase tracking-wider">
                    Monthly Website Visitors:
                  </span>
                  <span className="text-indigo-700 font-bold text-sm bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
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
                  className="w-full accent-indigo-600 bg-slate-200 h-2.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1,000</span>
                  <span>25,000</span>
                  <span>50,000+</span>
                </div>
              </div>

              {/* Slider 2: Average Deal Value */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-700 font-bold uppercase tracking-wider">
                    Average Client Deal / Retainer Value:
                  </span>
                  <span className="text-emerald-700 font-bold text-sm bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
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
                  className="w-full accent-emerald-600 bg-slate-200 h-2.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>$2,000</span>
                  <span>$25,000</span>
                  <span>$50,000+</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Conversion Benchmark:</div>
                <p className="text-[11px] leading-relaxed">
                  Based on industry research across luxury real estate and high-ticket B2B services: mobile latency over 3 seconds reduces form completions by up to 45%.
                </p>
              </div>
            </div>

            {/* Computed Numbers on Right */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-white border border-indigo-200 shadow-sm space-y-5 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500" />
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-rose-600 font-bold">
                  Estimated Monthly Revenue Leaked
                </div>
                <div className="text-3xl font-black text-rose-600 font-mono">
                  -${estimatedLostRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  (~{estimatedLostLeads} qualified prospects lost to mobile latency)
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold">
                  Projected Revenue With Hybrid.Ops
                </div>
                <div className="text-3xl font-black text-emerald-600 font-mono">
                  +${projectedNewRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  (Estimated annual lift: +${(projectedNewRevenue * 12).toLocaleString()})
                </div>
              </div>

              <button
                onClick={handleOpenAuditModal}
                className="w-full py-3 rounded-xl font-bold text-xs text-white glass-button-primary shadow-sm cursor-pointer"
              >
                Plug This Leak — Claim Free Teardown
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FREQUENTLY ASKED QUESTIONS (INTERACTIVE ACCORDION) */}
      <section id="faq" className="relative z-10 py-24 px-4 md:px-8 max-w-4xl mx-auto border-t border-slate-200/80">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            <HelpCircle size={13} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about our web engineering, n8n automations, and growth partner retainers.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl backdrop-blur-xl bg-white/80 border border-white/90 shadow-[0_4px_20px_rgba(99,102,241,0.04)] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-indigo-600 bg-indigo-50" : ""
                    }`}
                  >
                    <ChevronDown size={14} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. INTERACTIVE FREE AUDIT & LEAD INTAKE SECTION (CONNECTED TO /api/leads/webhook) */}
      <section id="audit" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto rounded-3xl backdrop-blur-2xl bg-white/85 border border-white/95 p-6 sm:p-8 md:p-12 shadow-[0_20px_60px_rgba(99,102,241,0.08)] relative overflow-hidden">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-700">
              <Sparkles size={13} />
              <span>100% FREE • ZERO OBLIGATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Get Your Custom Website &amp; Funnel Teardown
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              We&apos;ll audit your website speed, mobile form friction, and competitor search rankings, then show you exactly where you&apos;re leaving revenue on the table.
            </p>
          </div>

          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 max-w-lg mx-auto shadow-sm"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
                <Check size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  Audit Request Ingested Successfully!
                </h3>
                <p className="text-xs text-slate-600">
                  Thank you, <strong>{submittedLeadName}</strong>. Your website and funnel teardown has been queued into our live pipeline. Our engineering team will review your URL within 24 hours.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-emerald-800 bg-emerald-100/80 p-2.5 rounded-xl border border-emerald-200">
                ⚡ Prioritized on Hot Lead Radar • Telemetry Event Dispatched
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleAuditSubmit} className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marcus Vance"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                    Business Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@agency.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                    Website or Portfolio URL:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                    Target Vertical / Industry:
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-2xs font-semibold"
                  >
                    <option value="Luxury Real Estate">Luxury Real Estate</option>
                    <option value="Creative Agency">Creative &amp; Digital Agency</option>
                    <option value="High-Ticket Local Service">High-Ticket Local Service</option>
                    <option value="B2B SaaS Studio">B2B SaaS Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                  Primary Objective:
                </label>
                <select
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-2xs font-semibold"
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
                className="w-full mt-2 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-sm text-white glass-button-primary shadow-[0_8px_30px_rgba(99,102,241,0.35)] transition cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Domain &amp; Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} className="text-emerald-200" />
                    <span>Claim Free Website &amp; Funnel Teardown</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] font-mono text-slate-500 pt-2">
                🔒 Direct encrypted dispatch to Hybrid.Ops Ingestion Engine (/api/leads/webhook)
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 13. MINIMAL EXECUTIVE FOOTER (LIGHT MODE) */}
      <footer className="relative z-10 border-t border-slate-200/90 bg-white/70 backdrop-blur-xl py-12 px-4 md:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <HybridOpsLogo size="sm" />
              <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                v2.5
              </span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Strategic Technology &amp; Development Partnerships for Businesses and Digital Agencies.
            </p>
          </div>

          {/* Regional coverage */}
          <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
            <Globe size={13} className="text-indigo-600" />
            <span>Serving: United States • Canada • United Kingdom • Australia</span>
          </div>

          {/* Quick Links & Admin */}
          <div className="flex items-center gap-5 text-slate-600 font-medium">
            <a href="#services" className="hover:text-indigo-600 transition">Services</a>
            <a href="#portfolio" className="hover:text-indigo-600 transition">Portfolio</a>
            <a href="#calculator" className="hover:text-indigo-600 transition">ROI</a>
            <Link
              href="/dashboard"
              className="text-indigo-700 hover:text-indigo-900 flex items-center gap-1 font-mono font-bold bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg"
            >
              <Lock size={11} />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200/60 text-center text-slate-500 text-[10px] font-mono">
          &copy; {new Date().getFullYear()} HYBRID.OPS. All rights reserved. High-Converting Agency &amp; Growth Operations Infrastructure.
        </div>
      </footer>

      {/* 14. MODAL: INTERACTIVE VIDEO SHOWREEL / WALKTHROUGH */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl rounded-3xl bg-white border border-white shadow-2xl p-6 sm:p-8 space-y-5"
            >
              <button
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                  SYSTEM WALKTHROUGH (60 SECONDS)
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  How Hybrid.Ops Engineers 24/7 Acquisition
                </h3>
              </div>

              {/* Video Showcase Player Simulation */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
                <Image
                  src={
                    activeVideoChapter === 0
                      ? "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85"
                      : activeVideoChapter === 1
                      ? "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85"
                      : "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=1200&q=85"
                  }
                  alt="System Walkthrough Demo"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Simulated Play overlay badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-emerald-300 border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CHAPTER {activeVideoChapter + 1} OF 3</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-sm font-bold">
                    {activeVideoChapter === 0 && "Sub-Second Edge CDN & Mobile Safari 500 Defect Elimination"}
                    {activeVideoChapter === 1 && "Autonomous n8n Crawler & Website Competitor Defect Scans"}
                    {activeVideoChapter === 2 && "Real-Time Hot Radar Ingestion & AI 1-Click Outreach Studio"}
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                    {activeVideoChapter === 0 && "Eliminating LCP bottlenecks to convert high-net-worth mobile inquiries."}
                    {activeVideoChapter === 1 && "Autonomous agents qualifying decision-makers and scoring intent."}
                    {activeVideoChapter === 2 && "Connecting inbound website teardown requests to closed deals."}
                  </div>
                </div>
              </div>

              {/* Chapter Tabs */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  "1. Speed Architecture",
                  "2. n8n Crawlers",
                  "3. Pipeline Radar",
                ].map((chap, idx) => (
                  <button
                    key={chap}
                    onClick={() => setActiveVideoChapter(idx)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                      activeVideoChapter === idx
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {chap}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 15. MODAL: DETAILED CASE STUDY SHOWCASE */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-white shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition z-20"
              >
                <X size={18} />
              </button>

              {/* Case Study Header Image */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <Image
                  src={selectedCaseStudy.heroImage}
                  alt={selectedCaseStudy.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    {selectedCaseStudy.vertical} • {selectedCaseStudy.location}
                  </div>
                  <h3 className="text-xl font-bold mt-0.5">{selectedCaseStudy.client}</h3>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs font-mono font-bold">
                  <span className="text-indigo-800">{selectedCaseStudy.stats}</span>
                  <span className="text-emerald-700 text-right">{selectedCaseStudy.lcp}</span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900">The Problem &amp; Bottlenecks:</h4>
                  <p className="leading-relaxed text-slate-600">{selectedCaseStudy.challenge}</p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900">The Hybrid.Ops Solution:</h4>
                  <p className="leading-relaxed text-slate-600">{selectedCaseStudy.solution}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">Tangible Business Outcomes:</h4>
                  <ul className="space-y-1.5">
                    {selectedCaseStudy.results.map((res) => (
                      <li key={res} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCaseStudy(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedCaseStudy(null);
                    handleOpenAuditModal();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white glass-button-primary shadow-xs cursor-pointer"
                >
                  Request Similar Transformation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 16. MODAL: AUDIT REQUEST POPUP */}
      <AnimatePresence>
        {auditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-3xl bg-white border border-white shadow-2xl p-6 sm:p-8 space-y-5"
            >
              <button
                onClick={() => setAuditModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>

              <div className="space-y-1 pr-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  FREE COMPREHENSIVE TEARDOWN
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Request Your Website &amp; Funnel Audit
                </h3>
                <p className="text-xs text-slate-600">
                  Receive a detailed breakdown of your site&apos;s mobile friction, speed defects, and outbound acquisition potential.
                </p>
              </div>

              {submitSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Audit Ingested!</h4>
                  <p className="text-xs text-slate-600">
                    Thank you, <strong>{submittedLeadName}</strong>. Our team has received your request and will reach out with your custom teardown.
                  </p>
                  <button
                    onClick={() => setAuditModalOpen(false)}
                    className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAuditSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-700">
                      Your Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Marcus Vance"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-700">
                      Work Email:
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="marcus@domain.com"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-700">
                      Website / Agency URL:
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="https://company.com"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-700">
                      Primary Goal:
                    </label>
                    <select
                      value={formData.primaryGoal}
                      onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
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
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white glass-button-primary shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Teardown Request...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={14} className="text-emerald-200" />
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
