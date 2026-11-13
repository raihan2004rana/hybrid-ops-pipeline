"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Volume2,
  VolumeX,
  Flame,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Lead, WebhookLog, ScoringConfig, OutreachStatusType } from "@/types/pipeline";
import { INITIAL_LEADS } from "@/data/mockLeads";
import { soundEngine } from "@/lib/audioAlert";
import { BackgroundWaterCaustics } from "@/components/BackgroundWaterCaustics";
import { Sidebar, NavTabId } from "@/components/Sidebar";
import { TopPriorityAlertBanner } from "@/components/TopPriorityAlertBanner";
import { HeroMetrics } from "@/components/HeroMetrics";
import { PipelineHealthChart } from "@/components/PipelineHealthChart";
import { BottleneckRadialChart } from "@/components/BottleneckRadialChart";
import { LeadsDirectory } from "@/components/LeadsDirectory";
import { HotRadarView } from "@/components/HotRadarView";
import { OutreachStudioView } from "@/components/OutreachStudioView";
import { WebhookSyncView } from "@/components/WebhookSyncView";
import { SettingsConfigView } from "@/components/SettingsConfigView";
import { ProspectDrawer } from "@/components/ProspectDrawer";

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [currentTab, setCurrentTab] = useState<NavTabId>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Scoring configuration
  const [scoringConfig, setScoringConfig] = useState<ScoringConfig>({
    bottleneckWeight: 40,
    dealSizeWeight: 25,
    decisionMakerWeight: 20,
    speedMultiplier: 1.2,
    dealValueDefault: 1000,
  });

  // Telemetry logs for n8n Webhook Sync
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([
    {
      id: "log-init-1",
      timestamp: "11:20:04 AM",
      event: "POST /api/leads/webhook",
      status: "SUCCESS",
      companyName: "Sovereign Haven Luxury Estates",
      score: 96,
      latencyMs: 14,
      payload: { source: "n8n_crawler_matterport_v3" },
    },
    {
      id: "log-init-2",
      timestamp: "10:45:19 AM",
      event: "POST /api/leads/webhook",
      status: "SUCCESS",
      companyName: "Luminary Media Group",
      score: 91,
      latencyMs: 18,
      payload: { source: "n8n_rfp_probe" },
    },
    {
      id: "log-init-3",
      timestamp: "10:00:12 AM",
      event: "POST /api/leads/webhook",
      status: "SUCCESS",
      companyName: "Apex Horizon Residential",
      score: 88,
      latencyMs: 12,
      payload: { source: "n8n_idx_speed_test" },
    },
  ]);

  // Synchronize sound engine state
  useEffect(() => {
    soundEngine.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Sound ping on initial load when high-priority leads exist
  useEffect(() => {
    const timer = setTimeout(() => {
      if (soundEnabled) {
        soundEngine.playRadarPing(0.2);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [soundEnabled]);

  // Poll for inbound leads from public landing page or n8n webhooks
  useEffect(() => {
    const syncInboundLeads = async () => {
      try {
        const res = await fetch("/api/leads/webhook", { cache: "no-store" });
        const data = await res.json();
        if (data.recentLeads && Array.isArray(data.recentLeads) && data.recentLeads.length > 0) {
          setLeads((prev) => {
            const existingIds = new Set(prev.map((l) => l.id));
            const newOnes = data.recentLeads.filter((l: Lead) => !existingIds.has(l.id));
            if (newOnes.length > 0) {
              if (soundEnabled) {
                soundEngine.playRadarPing(0.35);
              }
              return [...newOnes, ...prev];
            }
            return prev;
          });
        }
      } catch {
        // Quiet fallback
      }
    };

    syncInboundLeads();
    const interval = setInterval(syncInboundLeads, 8000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundEngine.setMuted(!newState);
    if (newState) {
      soundEngine.playRadarPing(0.25);
    }
  };

  const handleOpenLeadDrawer = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const handleCloseLeadDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleLeadStatusChange = (leadId: string, newStatus: OutreachStatusType) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, outreachStatus: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, outreachStatus: newStatus } : null));
    }
  };

  const handleNewLeadIngested = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleAddLog = (log: WebhookLog) => {
    setWebhookLogs((prev) => [log, ...prev]);
  };

  const handleClearLogs = () => {
    setWebhookLogs([]);
  };

  const handleResetScoring = () => {
    setScoringConfig({
      bottleneckWeight: 40,
      dealSizeWeight: 25,
      decisionMakerWeight: 20,
      speedMultiplier: 1.2,
      dealValueDefault: 1000,
    });
  };

  const hotLeads = leads.filter((l) => l.score >= 80);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 flex overflow-hidden">
      {/* 1. Luminous Aurora Liquid Glass Caustics Background */}
      <BackgroundWaterCaustics />

      {/* 2. Left Collapsible Modern Glass Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        hotLeadsCount={hotLeads.length}
        totalLeadsCount={leads.length}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onLogout={onLogout}
      />

      {/* 3. Main Command Center Content View */}
      <main className="relative z-10 flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Floating Luminous Glass Top Bar */}
        <header className="sticky top-0 z-30 px-6 py-4 backdrop-blur-2xl bg-white/80 border-b border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              {currentTab === "overview" && "Executive Overview"}
              {currentTab === "radar" && "Hot Lead Radar"}
              {currentTab === "leads" && "Leads Central Directory"}
              {currentTab === "outreach" && "AI Outreach Studio"}
              {currentTab === "webhook" && "n8n Cloud Webhook Engine"}
              {currentTab === "settings" && "Algorithm Scoring Config"}
            </h1>
            <span className="hidden md:inline-block text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              SESSION: ADMIN COMMANDER
            </span>
          </div>

          {/* Top Right Quick Controls */}
          <div className="flex items-center gap-2.5">
            {/* Direct Link to Public Site */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition"
              title="Return to Public Agency Landing Page"
            >
              <ExternalLink size={13} className="text-slate-500" />
              <span>Public Site</span>
            </Link>

            {/* Quick Sound Toggle Button */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition shadow-xs ${
                soundEnabled
                  ? "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100"
                  : "bg-white border-slate-200 text-slate-500 hover:text-slate-900"
              }`}
              title={soundEnabled ? "Mute audio sonars" : "Enable radar audio cues"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Top Priority Hot Radar Counter Pill */}
            <button
              onClick={() => setCurrentTab("radar")}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-violet-500/10 border border-rose-300 text-rose-800 text-xs font-bold shadow-xs hover:border-rose-400 transition"
            >
              <Flame size={15} className="text-rose-600 animate-pulse" />
              <span>{hotLeads.length} Hot Targets</span>
            </button>

            {/* Admin Logout Button */}
            {onLogout && (
              <button
                onClick={() => {
                  soundEngine.playGlassClick();
                  onLogout();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition shadow-xs cursor-pointer"
                title="Lock Command Center & Sign Out"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Inner Tab Content */}
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Global Top Priority Hot Lead Alert Banner */}
          {hotLeads.length > 0 && currentTab !== "radar" && (
            <TopPriorityAlertBanner
              hotLeads={hotLeads}
              onSelectLead={handleOpenLeadDrawer}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          <AnimatePresence mode="wait">
            {currentTab === "overview" && (
              <motion.div
                key="tab-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. Hero Summary Metric KPIs */}
                <HeroMetrics leads={leads} dealMultiplier={scoringConfig.dealValueDefault} />

                {/* 2. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div className="lg:col-span-8">
                    <PipelineHealthChart />
                  </div>
                  <div className="lg:col-span-4">
                    <BottleneckRadialChart />
                  </div>
                </div>

                {/* 3. Quick Table of Inbound Leads */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
                        Recent Ingested Agency Prospects
                      </h3>
                      <p className="text-xs text-slate-600">
                        Top scored targets qualified by automated website analysis and inbound inquiries
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentTab("leads")}
                      className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1"
                    >
                      <span>View All Leads ({leads.length})</span>
                      <span>→</span>
                    </button>
                  </div>

                  <div className="rounded-2xl backdrop-blur-xl bg-white/80 border border-slate-200/90 overflow-hidden shadow-xs">
                    <div className="divide-y divide-slate-100">
                      {leads.slice(0, 5).map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => handleOpenLeadDrawer(lead)}
                          className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer gap-4"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {lead.companyName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-2">
                                <span>{lead.companyName}</span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {lead.industry}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {lead.decisionMaker.name} • {lead.decisionMaker.title}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                              ${lead.dealValue.toLocaleString()}
                            </span>
                            <span
                              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                lead.score >= 85
                                  ? "bg-rose-100 text-rose-800 border border-rose-300"
                                  : "bg-sky-100 text-sky-800 border border-sky-300"
                              }`}
                            >
                              Score {lead.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentTab === "radar" && (
              <motion.div
                key="tab-radar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <HotRadarView
                  leads={leads}
                  onSelectLead={handleOpenLeadDrawer}
                  soundEnabled={soundEnabled}
                  onToggleSound={handleToggleSound}
                />
              </motion.div>
            )}

            {currentTab === "leads" && (
              <motion.div
                key="tab-leads"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <LeadsDirectory
                  leads={leads}
                  onSelectLead={handleOpenLeadDrawer}
                  onStatusChange={handleLeadStatusChange}
                />
              </motion.div>
            )}

            {currentTab === "outreach" && (
              <motion.div
                key="tab-outreach"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <OutreachStudioView
                  leads={leads}
                  onSelectLead={handleOpenLeadDrawer}
                  onStatusChange={handleLeadStatusChange}
                />
              </motion.div>
            )}

            {currentTab === "webhook" && (
              <motion.div
                key="tab-webhook"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <WebhookSyncView
                  onLeadIngested={handleNewLeadIngested}
                  logs={webhookLogs}
                  onAddLog={handleAddLog}
                  onClearLogs={handleClearLogs}
                />
              </motion.div>
            )}

            {currentTab === "settings" && (
              <motion.div
                key="tab-settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SettingsConfigView
                  config={scoringConfig}
                  onChangeConfig={(cfg) => setScoringConfig(cfg)}
                  onResetDefaults={handleResetScoring}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 4. Slide-in Liquid Drawer (Detailed Prospect Modal) */}
      <ProspectDrawer
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={handleCloseLeadDrawer}
        onStatusChange={handleLeadStatusChange}
      />
    </div>
  );
}
