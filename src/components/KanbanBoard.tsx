"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Lead, OutreachStatusType } from "@/types/pipeline";
import { soundEngine } from "@/lib/audioAlert";

interface KanbanBoardProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (leadId: string, newStatus: OutreachStatusType) => void;
}

const COLUMNS: { id: OutreachStatusType; title: string; color: string; dot: string; bg: string }[] = [
  { id: "READY_TO_PITCH", title: "1. Ready to Pitch", color: "text-sky-700", dot: "bg-sky-500", bg: "bg-sky-50 border-sky-200" },
  { id: "PITCH_COPIED", title: "2. Pitch Prepared", color: "text-violet-700", dot: "bg-violet-500", bg: "bg-violet-50 border-violet-200" },
  { id: "CONTACTED", title: "3. Outreach Sent", color: "text-amber-700", dot: "bg-amber-500", bg: "bg-amber-50 border-amber-200" },
  { id: "MEETING_BOOKED", title: "4. Meeting Booked", color: "text-emerald-700", dot: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
  { id: "CLOSED_WON", title: "5. Closed / Retainer", color: "text-rose-700", dot: "bg-rose-500", bg: "bg-rose-50 border-rose-200" },
];

export function KanbanBoard({ leads, onSelectLead, onStatusChange }: KanbanBoardProps) {
  const getNextStatus = (current: OutreachStatusType): OutreachStatusType | null => {
    const sequence: OutreachStatusType[] = [
      "READY_TO_PITCH",
      "PITCH_COPIED",
      "CONTACTED",
      "MEETING_BOOKED",
      "CLOSED_WON",
    ];
    const idx = sequence.indexOf(current);
    return idx < sequence.length - 1 ? sequence[idx + 1] : null;
  };

  const getPrevStatus = (current: OutreachStatusType): OutreachStatusType | null => {
    const sequence: OutreachStatusType[] = [
      "READY_TO_PITCH",
      "PITCH_COPIED",
      "CONTACTED",
      "MEETING_BOOKED",
      "CLOSED_WON",
    ];
    const idx = sequence.indexOf(current);
    return idx > 0 ? sequence[idx - 1] : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const columnLeads = leads.filter((l) => l.outreachStatus === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col min-w-[260px] rounded-2xl backdrop-blur-xl bg-white/70 p-3.5 border border-slate-200/90 shadow-[0_8px_30px_rgba(15,23,42,0.03)]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot} shadow-xs`} />
                <h4 className="text-xs font-bold text-slate-800 tracking-wide">
                  {col.title}
                </h4>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border ${col.bg} ${col.color}`}>
                {columnLeads.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[680px]">
              {columnLeads.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-white/40">
                  <p className="text-[11px] text-slate-400 font-medium">No leads in stage</p>
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const nextStatus = getNextStatus(lead.outreachStatus);
                  const prevStatus = getPrevStatus(lead.outreachStatus);

                  return (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="group relative p-3.5 rounded-xl backdrop-blur-xl bg-white/95 border border-slate-200/90 hover:border-indigo-400 hover:shadow-[0_12px_28px_rgba(99,102,241,0.14)] transition-all cursor-pointer shadow-xs"
                      onClick={() => {
                        soundEngine.playGlassClick();
                        onSelectLead(lead);
                      }}
                    >
                      {/* Top bar: Score badge and deal value */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-md border flex items-center gap-1 ${
                            lead.score >= 80
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {lead.score >= 80 ? (
                            <Flame size={10} className="text-rose-500" />
                          ) : (
                            <Sparkles size={10} className="text-emerald-500" />
                          )}
                          SCORE {lead.score}
                        </span>

                        <span className="text-[11px] font-mono text-emerald-600 font-bold">
                          ${lead.dealValue.toLocaleString()}
                        </span>
                      </div>

                      {/* Company Name */}
                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {lead.companyName}
                      </h5>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                        {lead.location}
                      </p>

                      {/* Bottleneck pill */}
                      <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] text-slate-700 line-clamp-2">
                        <span className="text-rose-600 font-bold">Defect: </span>
                        {lead.bottleneck.type}
                      </div>

                      {/* Decision maker snippet & Navigation controls */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={lead.decisionMaker.avatarUrl}
                            alt={lead.decisionMaker.name}
                            className="w-5 h-5 rounded-full object-cover border border-slate-200 shadow-xs"
                          />
                          <span className="text-[10px] text-slate-700 truncate max-w-[90px] font-semibold">
                            {lead.decisionMaker.name.split(" ")[0]}
                          </span>
                        </div>

                        {/* Pipeline Stage Advance Buttons */}
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {prevStatus && (
                            <button
                              onClick={() => {
                                soundEngine.playGlassClick();
                                onStatusChange(lead.id, prevStatus);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition"
                              title="Move back"
                            >
                              <ArrowLeft size={11} />
                            </button>
                          )}
                          {nextStatus && (
                            <button
                              onClick={() => {
                                soundEngine.playGlassClick();
                                onStatusChange(lead.id, nextStatus);
                              }}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                              title="Advance stage"
                            >
                              <ArrowRight size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
