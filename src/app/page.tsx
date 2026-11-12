"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Volume2,
  VolumeX,
  Flame,
} from "lucide-react";
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

export default function PipelineCommandCenter() {
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
              {currentTab === "outreach" && "Outreach Studio"}
              {currentTab === "webhook" && "n8n Webhook Sync"}
              {currentTab === "settings" && "Scoring & Valuation Config"}
            </h1>

            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md">
              HYBRID PIPELINE v2.4
            </span>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Webhook Trigger Shortcut */}
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                setCurrentTab("webhook");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <Zap size={14} className="text-indigo-600" />
              <span className="hidden sm:inline">n8n Cloud Engine</span>
            </button>

            {/* Radar Shortcut Pill */}
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                setCurrentTab("radar");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200 text-rose-700 text-xs font-semibold transition shadow-xs"
            >
              <Flame size={14} className="text-rose-600" />
              <span>{hotLeads.length} Hot Targets</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition shadow-xs ${
                soundEnabled
                  ? "bg-violet-50 border-violet-200 text-violet-700"
                  : "bg-slate-100 border-slate-200 text-slate-400"
              }`}
              title={soundEnabled ? "Mute Radar Sonar Audio" : "Enable Radar Sonar Audio"}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
          </div>
        </header>

        {/* Interior Page Content */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Priority Alert Banner (Score >= 85) */}
          <TopPriorityAlertBanner
            hotLeads={leads}
            onSelectLead={handleOpenLeadDrawer}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />

          {/* Active Tab View */}
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
                {/* 4 Hero Metric Cards */}
                <HeroMetrics
                  leads={leads}
                  dealMultiplier={scoringConfig.dealValueDefault}
                />

                {/* Data Visualizations: Spline Area Chart + Bottleneck Radial Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div className="lg:col-span-7">
                    <PipelineHealthChart />
                  </div>
                  <div className="lg:col-span-5">
                    <BottleneckRadialChart />
                  </div>
                </div>

                {/* Leads Directory (Table & Kanban) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 tracking-wide">
                        Active Lead Directory &amp; Priority Tiers
                      </h3>
                      <p className="text-xs text-slate-500">
                        Interactive glass table with quick pitch generation and mail client triggers
                      </p>
                    </div>
                  </div>

                  <LeadsDirectory
                    leads={leads}
                    onSelectLead={handleOpenLeadDrawer}
                    onStatusChange={handleLeadStatusChange}
                  />
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
