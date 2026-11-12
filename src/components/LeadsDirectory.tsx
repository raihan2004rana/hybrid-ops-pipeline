"use client";

import React, { useState } from "react";
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Flame,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  Eye,
  Send,
} from "lucide-react";
import { LinkedInIcon } from "@/components/LinkedInIcon";
import { Lead, OutreachStatusType } from "@/types/pipeline";
import { KanbanBoard } from "@/components/KanbanBoard";
import { soundEngine } from "@/lib/audioAlert";

interface LeadsDirectoryProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (leadId: string, newStatus: OutreachStatusType) => void;
}

type StatusFilter = "ALL" | "HOT" | "WARM";
type SortOption = "score-desc" | "score-asc" | "deal-desc" | "recent";

const LOGO_GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-fuchsia-500 to-purple-600",
];

export function LeadsDirectory({
  leads,
  onSelectLead,
  onStatusChange,
}: LeadsDirectoryProps) {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("score-desc");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLeads = leads
    .filter((lead) => {
      if (statusFilter === "HOT" && lead.score < 80) return false;
      if (statusFilter === "WARM" && (lead.score >= 80 || lead.score < 60)) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        lead.companyName.toLowerCase().includes(q) ||
        lead.location.toLowerCase().includes(q) ||
        lead.decisionMaker.name.toLowerCase().includes(q) ||
        lead.decisionMaker.title.toLowerCase().includes(q) ||
        lead.bottleneck.type.toLowerCase().includes(q) ||
        lead.bottleneck.title.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "score-desc") return b.score - a.score;
      if (sortBy === "score-asc") return a.score - b.score;
      if (sortBy === "deal-desc") return b.dealValue - a.dealValue;
      if (sortBy === "recent")
        return new Date(b.ingestedAt).getTime() - new Date(a.ingestedAt).getTime();
      return 0;
    });

  const handleQuickCopy = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playGlassClick();
    const fullPitch = `Subject: ${lead.aiPitch.subject}\n\nHi ${lead.decisionMaker.name},\n\n${lead.aiPitch.observation}\n\n${lead.aiPitch.solution}\n\n${lead.aiPitch.cta}\n\nBest regards,\n[Your Name]`;
    navigator.clipboard.writeText(fullPitch);
    setCopiedId(lead.id);
    onStatusChange(lead.id, "PITCH_COPIED");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter & Controls Toolbar */}
      <div className="p-4 rounded-2xl glass-panel border border-violet-100 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input with glowing glass border */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search company, location, decision maker, bottleneck..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm font-medium"
          />
        </div>

        {/* Right side controls: Filter, Sort & View Mode */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filters */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                setStatusFilter("ALL");
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                statusFilter === "ALL"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              All ({leads.length})
            </button>
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                setStatusFilter("HOT");
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition ${
                statusFilter === "HOT"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-rose-600"
              }`}
            >
              <Flame size={12} className={statusFilter === "HOT" ? "text-white" : "text-rose-500"} />
              Hot 80+ ({leads.filter((l) => l.score >= 80).length})
            </button>
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                setStatusFilter("WARM");
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                statusFilter === "WARM"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-emerald-700"
              }`}
            >
              Warm 60-79 ({leads.filter((l) => l.score >= 60 && l.score < 80).length})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white border border-slate-200 text-xs text-slate-800 font-bold rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-violet-500 cursor-pointer shadow-sm"
            >
              <option value="score-desc" className="bg-white text-slate-900">
                Sort: Score (High → Low)
              </option>
              <option value="score-asc" className="bg-white text-slate-900">
                Sort: Score (Low → High)
              </option>
              <option value="deal-desc" className="bg-white text-slate-900">
                Sort: Deal Value
              </option>
              <option value="recent" className="bg-white text-slate-900">
                Sort: Most Recent
              </option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* View Mode Toggle (Table / Kanban) */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                setViewMode("table");
              }}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "table"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Table View"
            >
              <TableIcon size={16} />
            </button>
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                setViewMode("kanban");
              }}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "kanban"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Kanban Board"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area: Table OR Kanban */}
      {viewMode === "kanban" ? (
        <KanbanBoard
          leads={filteredLeads}
          onSelectLead={onSelectLead}
          onStatusChange={onStatusChange}
        />
      ) : (
        /* Vibrant Interactive Glass Table */
        <div className="rounded-2xl glass-panel border border-violet-100 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-white/70 text-[11px] font-mono text-slate-600 font-black uppercase tracking-wider">
                  <th className="py-3.5 px-4">Company &amp; Location</th>
                  <th className="py-3.5 px-4">Decision Maker</th>
                  <th className="py-3.5 px-4">Technical Bottleneck</th>
                  <th className="py-3.5 px-4 text-center">Score</th>
                  <th className="py-3.5 px-4">Outreach Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-bold">
                      No prospects match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, idx) => {
                    const isHot = lead.score >= 80;
                    const isCopied = copiedId === lead.id;
                    const logoGrad = LOGO_GRADIENTS[idx % LOGO_GRADIENTS.length];

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => {
                          soundEngine.playGlassClick();
                          onSelectLead(lead);
                        }}
                        className="group hover:bg-violet-50/60 transition-colors cursor-pointer bg-white/60"
                      >
                        {/* Company & Location */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${logoGrad} text-white flex items-center justify-center shrink-0 font-black font-mono shadow-md text-xs`}
                            >
                              {lead.companyName.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-black text-slate-900 group-hover:text-violet-800 transition-colors flex items-center gap-1.5 truncate">
                                <span>{lead.companyName}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate flex items-center gap-2 mt-0.5 font-medium">
                                <span>{lead.location}</span>
                                <span>•</span>
                                <span className="text-violet-700 font-bold font-mono text-[10px]">
                                  ${lead.dealValue.toLocaleString()} deal
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Decision Maker */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={lead.decisionMaker.avatarUrl}
                              alt={lead.decisionMaker.name}
                              className="w-8 h-8 rounded-full object-cover border-2 border-violet-200 shadow-sm"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{lead.decisionMaker.name}</span>
                                <a
                                  href={lead.decisionMaker.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[#0077b5] hover:text-violet-700 transition"
                                  title="LinkedIn profile"
                                >
                                  <LinkedInIcon size={12} />
                                </a>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate font-semibold">
                                {lead.decisionMaker.title}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Technical Bottleneck */}
                        <td className="py-4 px-4 max-w-xs">
                          <div>
                            <span
                              className={`inline-block px-2 py-0.5 text-[9px] font-mono font-black rounded-md mb-1 shadow-sm ${
                                lead.bottleneck.severity === "CRITICAL"
                                  ? "bg-rose-500 text-white"
                                  : "bg-amber-400 text-amber-950"
                              }`}
                            >
                              {lead.bottleneck.severity} DEFECT
                            </span>
                            <div className="font-bold text-slate-900 truncate">
                              {lead.bottleneck.title}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5 font-mono font-semibold">
                              {lead.bottleneck.metrics.conversionDrop && (
                                <span className="text-rose-600 font-bold mr-2">
                                  {lead.bottleneck.metrics.conversionDrop} drop
                                </span>
                              )}
                              {lead.bottleneck.metrics.lostRevenueMonthly && (
                                <span className="text-emerald-700 font-bold">
                                  {lead.bottleneck.metrics.lostRevenueMonthly} at risk
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Lead Score Badge */}
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-black border shadow-sm ${
                              isHot
                                ? "bg-rose-100 text-rose-700 border-rose-300 shadow-[0_2px_8px_rgba(244,63,94,0.2)]"
                                : "bg-emerald-100 text-emerald-800 border-emerald-300"
                            }`}
                          >
                            {isHot ? (
                              <Flame size={12} className="text-rose-500" />
                            ) : (
                              <Sparkles size={12} className="text-emerald-600" />
                            )}
                            {lead.score}
                          </span>
                        </td>

                        {/* Outreach Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 text-[10px] font-mono font-black rounded-lg border shadow-sm ${
                              lead.outreachStatus === "CONTACTED"
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : lead.outreachStatus === "PITCH_COPIED"
                                ? "bg-violet-100 text-violet-800 border-violet-300"
                                : lead.outreachStatus === "CLOSED_WON"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-sky-100 text-sky-800 border-sky-300"
                            }`}
                          >
                            {lead.outreachStatus.replace(/_/g, " ")}
                          </span>
                        </td>

                        {/* Quick Actions */}
                        <td className="py-4 px-4 text-right">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* 1-Click Copy Pitch */}
                            <button
                              onClick={(e) => handleQuickCopy(lead, e)}
                              className={`p-2 rounded-xl border transition-all shadow-sm ${
                                isCopied
                                  ? "bg-emerald-600 text-white border-emerald-700"
                                  : "bg-white border-slate-200 text-slate-700 hover:text-violet-700 hover:bg-violet-50"
                              }`}
                              title="Copy AI Pitch"
                            >
                              {isCopied ? <Check size={14} /> : <Copy size={14} />}
                            </button>

                            {/* Direct Mailto */}
                            <a
                              href={`mailto:${lead.decisionMaker.email}?subject=${encodeURIComponent(
                                lead.aiPitch.subject
                              )}&body=${encodeURIComponent(
                                `Hi ${lead.decisionMaker.name},\n\n${lead.aiPitch.observation}\n\n${lead.aiPitch.solution}\n\n${lead.aiPitch.cta}\n\nBest regards,\n[Your Name]`
                              )}`}
                              onClick={() => onStatusChange(lead.id, "CONTACTED")}
                              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-violet-700 hover:bg-violet-50 transition shadow-sm"
                              title="Launch in Mail Client"
                            >
                              <Send size={14} />
                            </a>

                            {/* Inspect Drawer */}
                            <button
                              onClick={() => {
                                soundEngine.playGlassClick();
                                onSelectLead(lead);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[11px] transition shadow-md hover:from-violet-500 hover:to-indigo-500"
                            >
                              <Eye size={13} />
                              <span className="hidden sm:inline">Inspect</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
