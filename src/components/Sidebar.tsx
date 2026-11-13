"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Radar,
  FolderKanban,
  Mail,
  Zap,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Volume2,
  VolumeX,
  LogOut,
  Globe,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { soundEngine } from "@/lib/audioAlert";

export type NavTabId =
  | "overview"
  | "radar"
  | "leads"
  | "outreach"
  | "webhook"
  | "settings";

interface SidebarProps {
  currentTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  hotLeadsCount: number;
  totalLeadsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout?: () => void;
}

export function Sidebar({
  currentTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  hotLeadsCount,
  soundEnabled,
  onToggleSound,
  onLogout,
}: SidebarProps) {
  const navItems = [
    {
      id: "overview" as NavTabId,
      label: "Executive Overview",
      icon: BarChart3,
      badge: null,
      description: "Live metrics & charts",
    },
    {
      id: "radar" as NavTabId,
      label: "Hot Lead Radar",
      icon: Radar,
      badge: `${hotLeadsCount} HOT`,
      badgeColor: "bg-rose-100 text-rose-700 border-rose-300 font-bold",
      description: "Priority queue & sonar",
    },
    {
      id: "leads" as NavTabId,
      label: "Leads Directory",
      icon: FolderKanban,
      badge: null,
      description: "Table & Kanban pipeline",
    },
    {
      id: "outreach" as NavTabId,
      label: "Outreach Studio",
      icon: Mail,
      badge: "AI Ready",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-300 font-bold",
      description: "Pitches & 1-click email",
    },
    {
      id: "webhook" as NavTabId,
      label: "n8n Webhook Sync",
      icon: Zap,
      badge: "LIVE",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
      description: "Payload debugger & sync",
    },
    {
      id: "settings" as NavTabId,
      label: "Settings & Scoring",
      icon: Sliders,
      badge: null,
      description: "Weights & multipliers",
    },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 76 : 268,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="relative z-30 flex flex-col h-screen border-r border-slate-200/80 backdrop-blur-2xl bg-white/85 shadow-[4px_0_30px_rgba(99,102,241,0.06)] select-none shrink-0"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/70 h-20 bg-white/40">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Animated Colorful Rainbow Holographic Emblem */}
          <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-2xl border-2 border-violet-400/60 shadow-[0_0_18px_rgba(139,92,246,0.35)] bg-gradient-to-tr from-rose-400/30 via-violet-400/20 to-cyan-400/30"
            />
            <div className="relative w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-[0_0_12px_rgba(236,72,153,0.5)] rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col whitespace-nowrap overflow-hidden"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-black tracking-wider text-base bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                    HYBRID.OPS
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-violet-700 font-mono tracking-wider font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  PIPELINE COMMAND v2.4
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all shadow-sm"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playGlassClick();
                onTabChange(item.id);
              }}
              title={isCollapsed ? item.label : undefined}
              className={`relative flex items-center w-full rounded-xl transition-all duration-200 group ${
                isCollapsed ? "justify-center p-3" : "px-3.5 py-2.5 gap-3"
              } ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-[0_4px_18px_rgba(99,102,241,0.35)] font-bold"
                  : "text-slate-700 hover:text-violet-700 hover:bg-violet-50/80 border border-transparent hover:border-violet-100"
              }`}
            >
              {/* Icon */}
              <div
                className={`relative flex items-center justify-center shrink-0 transition-transform ${
                  isActive ? "text-white scale-110" : "text-slate-600 group-hover:text-violet-600 group-hover:scale-105"
                }`}
              >
                <Icon size={18} />
              </div>

              {/* Text label and optional badge */}
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 overflow-hidden">
                  <div className="text-left truncate">
                    <div
                      className={`text-xs tracking-wide truncate ${
                        isActive ? "text-white font-bold" : "text-slate-800 font-semibold group-hover:text-violet-800"
                      }`}
                    >
                      {item.label}
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-md border tracking-wider shrink-0 shadow-sm ${
                        item.badgeColor || "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status & Audio / Protocol Box */}
      <div className="p-3 border-t border-slate-200/70 space-y-2 bg-white/60">
        {/* Audio Ping quick toggle */}
        <button
          onClick={onToggleSound}
          className={`w-full flex items-center rounded-xl p-2 transition-all shadow-sm ${
            isCollapsed ? "justify-center" : "justify-between"
          } ${
            soundEnabled
              ? "bg-violet-100 border border-violet-300 text-violet-800 font-bold"
              : "bg-white border border-slate-200 text-slate-500"
          }`}
          title={soundEnabled ? "Audio Radar Sonar: Active" : "Audio Radar Sonar: Muted"}
        >
          <div className="flex items-center gap-2">
            {soundEnabled ? <Volume2 size={15} className="text-violet-600" /> : <VolumeX size={15} />}
            {!isCollapsed && (
              <span className="text-[11px]">
                {soundEnabled ? "Sonar Audio: ON" : "Sonar Audio: MUTED"}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <span
              className={`w-2 h-2 rounded-full ${
                soundEnabled ? "bg-violet-500 animate-ping" : "bg-slate-400"
              }`}
            />
          )}
        </button>

        {/* System Protocol Health Pill */}
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl backdrop-blur-md bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 mb-1">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck size={12} className="text-emerald-600" />
                n8n CLOUD ENGINE
              </span>
              <span className="text-emerald-700 font-bold">CONNECTED</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-500 w-full animate-pulse" />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500 font-mono font-medium">
              <span className="truncate max-w-[190px]" title="https://b2b-web-lead-engine.app.n8n.cloud">
                b2b-web-lead-engine.app.n8n.cloud
              </span>
            </div>
          </div>
        )}

        {/* Public Site & Admin Logout Action Buttons */}
        <div className="pt-1 border-t border-slate-200/60 space-y-1">
          <Link
            href="/"
            className={`w-full flex items-center rounded-xl p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all text-xs font-semibold ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
            title="Return to Public Agency Website"
          >
            <div className="flex items-center gap-2">
              <Globe size={15} />
              {!isCollapsed && <span>Public Website</span>}
            </div>
            {!isCollapsed && <ExternalLink size={12} className="text-slate-400" />}
          </Link>

          {onLogout && (
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                onLogout();
              }}
              className={`w-full flex items-center rounded-xl p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 transition-all text-xs font-semibold cursor-pointer ${
                isCollapsed ? "justify-center" : "justify-between"
              }`}
              title="Logout from Admin Command Center"
            >
              <div className="flex items-center gap-2">
                <LogOut size={15} />
                {!isCollapsed && <span>Sign Out</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-500 bg-rose-100/80 px-1.5 py-0.5 rounded">
                  Lock
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
