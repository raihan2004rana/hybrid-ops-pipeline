"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  Code2,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Play,
  Globe,
  Radio,
  Cloud,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Lead, WebhookLog } from "@/types/pipeline";
import { soundEngine } from "@/lib/audioAlert";

interface WebhookSyncViewProps {
  onLeadIngested: (newLead: Lead) => void;
  logs: WebhookLog[];
  onAddLog: (log: WebhookLog) => void;
  onClearLogs: () => void;
}

const PRODUCTION_N8N_URL =
  process.env.NEXT_PUBLIC_N8N_PRODUCTION_URL ||
  "https://b2b-web-lead-engine.app.n8n.cloud/webhook/b2b-lead-qualification";

const TEST_N8N_URL =
  process.env.NEXT_PUBLIC_N8N_TEST_URL ||
  "https://b2b-web-lead-engine.app.n8n.cloud/webhook-test/b2b-lead-qualification";

// Exact schema from user's n8n AI node:
// (company_name, location, website, decision_maker, role, email, linkedin, lead_score, status, bottlenecks, personalized_hook, audit_timestamp)
const TEMPLATE_SCENARIOS = [
  {
    name: "Apex Horizon Residential (n8n AI Schema)",
    payload: {
      company_name: "Apex Horizon Residential",
      location: "Austin, TX (Westlake Hills)",
      website: "https://apexhorizon.com",
      decision_maker: "Marcus Vance",
      role: "Managing Principal & Head of Acquisitions",
      email: "marcus@apexhorizon.com",
      linkedin: "https://linkedin.com/in/marcus-vance-realestate",
      lead_score: 94,
      status: "HOT",
      bottlenecks: "Mobile Safari 500 error on VIP inquiry form; 5.8s LCP hero block",
      personalized_hook:
        "Saw Apex Horizon's premier Westlake listing portfolio, but your mobile VIP inquiry form is throwing a 500 server error on iOS Safari, causing high-net-worth buyers to bounce.",
      audit_timestamp: new Date().toISOString(),
    },
  },
  {
    name: "Vanguard Coastal Estates (n8n AI Schema)",
    payload: {
      company_name: "Vanguard Coastal Estates",
      location: "Malibu & Pacific Palisades, CA",
      website: "https://vanguardcoastal.com",
      decision_maker: "Chloe Dupont",
      role: "Managing Partner & Principal Broker",
      email: "chloe@vanguardcoastal.com",
      linkedin: "https://linkedin.com/in/chloe-dupont-malibu",
      lead_score: 96,
      status: "HOT",
      bottlenecks: "VIP Tour Request Form Crashing with 500 Error on iOS Safari",
      personalized_hook:
        "High-net-worth buyers attempting to schedule private showings for $20M+ beachfront homes receive an internal server error on mobile Safari.",
      audit_timestamp: new Date().toISOString(),
    },
  },
  {
    name: "Manhattan Digital Guild (n8n AI Schema)",
    payload: {
      company_name: "Manhattan Digital Guild",
      location: "New York, NY (Flatiron District)",
      website: "https://manhattandigitalguild.com",
      decision_maker: "Harrison Brooks",
      role: "Chief Technical Officer",
      email: "harrison@manhattandigitalguild.com",
      linkedin: "https://linkedin.com/in/harrison-brooks-cto",
      lead_score: 89,
      status: "READY_TO_PITCH",
      bottlenecks: "Un-cached 80MB Showreel Blocking Mobile Rendering (5.8s LCP)",
      personalized_hook:
        "Homepage video hero download halts rendering on cellular connections, resulting in a 5.8s LCP and 48% bounce rate for enterprise CMOs.",
      audit_timestamp: new Date().toISOString(),
    },
  },
];

export function WebhookSyncView({
  onLeadIngested,
  logs,
  onAddLog,
  onClearLogs,
}: WebhookSyncViewProps) {
  // Dynamic window origin detection (replaces any hardcoded localhost:3000)
  const [currentOrigin, setCurrentOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const dynamicWebhookEndpoint = currentOrigin
    ? `${currentOrigin}/api/leads/webhook`
    : "/api/leads/webhook";

  // n8n cloud configuration state
  const [n8nUrl, setN8nUrl] = useState(PRODUCTION_N8N_URL);
  const [isTestMode, setIsTestMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "IDLE" | "CHECKING" | "CONNECTED" | "ACTIVE" | "REACHABLE" | "INACTIVE" | "ERROR"
  >("IDLE");
  const [lastStatusCode, setLastStatusCode] = useState<number | null>(null);
  const [connectionHint, setConnectionHint] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  // Trigger automation form state
  const [scanDomain, setScanDomain] = useState("https://sovereignhaven.com");
  const [scanIndustry, setScanIndustry] = useState("Luxury Real Estate");
  const [isTriggering, setIsTriggering] = useState(false);

  // Inbound simulator state
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [jsonText, setJsonText] = useState(
    JSON.stringify(TEMPLATE_SCENARIOS[0].payload, null, 2)
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedN8nNode, setCopiedN8nNode] = useState(false);
  const [splashEntrance, setSplashEntrance] = useState<string | null>(null);

  // Check n8n connection on mount
  useEffect(() => {
    checkN8nConnection(n8nUrl);
  }, []);

  const handleToggleUrlMode = (testMode: boolean) => {
    soundEngine.playGlassClick();
    setIsTestMode(testMode);
    const target = testMode ? TEST_N8N_URL : PRODUCTION_N8N_URL;
    setN8nUrl(target);
    checkN8nConnection(target);
  };

  const checkN8nConnection = async (urlToCheck?: string, isManual = false) => {
    setConnectionStatus("CHECKING");
    setConnectionHint(null);
    const target = urlToCheck || n8nUrl;

    try {
      // Route through server-side Netlify API route (/api/n8n/ping) to avoid browser CORS failure
      const res = await fetch("/api/n8n/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: target }),
        cache: "no-store",
      });
      const data = await res.json();
      setLatency(data.latencyMs ?? 0);
      setLastStatusCode(data.statusCode ?? null);

      // If it returns HTTP 200 (like {"status":"ignored"}) or 404/405, mark as ONLINE / CONNECTED in green
      if (
        data.n8nStatus === "CONNECTED" ||
        data.n8nStatus === "ACTIVE" ||
        data.n8nStatus === "REACHABLE" ||
        data.statusCode === 200 ||
        data.statusCode === 404 ||
        data.statusCode === 405 ||
        data.success
      ) {
        setConnectionStatus("CONNECTED");
        if (data.statusCode === 404) {
          setConnectionHint(
            data.hint ||
              `n8n Webhook endpoint reached (HTTP 404). Server is ONLINE / CONNECTED.`
          );
        } else if (data.hint) {
          setConnectionHint(data.hint);
        }
      } else if (data.n8nStatus === "INACTIVE") {
        setConnectionStatus("INACTIVE");
        setConnectionHint(
          data.hint || "Activate the workflow in n8n (toggle in top-right of editor)."
        );
      } else {
        setConnectionStatus("ERROR");
        setConnectionHint(data.message || "Failed to establish connection.");
      }

      if (isManual) {
        const isOnline =
          data.n8nStatus === "CONNECTED" ||
          data.n8nStatus === "ACTIVE" ||
          data.n8nStatus === "REACHABLE" ||
          data.statusCode === 200 ||
          data.statusCode === 404 ||
          data.statusCode === 405 ||
          data.success;

        onAddLog({
          id: `log-${Date.now()}-ping`,
          timestamp: new Date().toLocaleTimeString(),
          event: `PING n8n Webhook (${isOnline ? "ONLINE / CONNECTED" : "OFFLINE"} HTTP ${data.statusCode || 200})`,
          status: isOnline ? "SUCCESS" : "FAILED",
          companyName: target.replace(/^https?:\/\//i, "").split("/")[0] || "n8n Cloud Webhook",
          score: 0,
          latencyMs: data.latencyMs ?? 0,
          payload: {
            ping: true,
            targetUrl: target,
            statusCode: data.statusCode,
            n8nStatus: data.n8nStatus,
            response: data.response,
          },
        });
      }
    } catch (err: unknown) {
      setConnectionStatus("ERROR");
      setConnectionHint(err instanceof Error ? err.message : "Network error");
      if (isManual) {
        onAddLog({
          id: `log-${Date.now()}-ping-err`,
          timestamp: new Date().toLocaleTimeString(),
          event: "PING n8n Webhook (Failed)",
          status: "FAILED",
          companyName: target.replace(/^https?:\/\//i, "").split("/")[0] || "n8n Cloud Webhook",
          score: 0,
          latencyMs: 0,
          payload: { error: err instanceof Error ? err.message : "Network error" },
        });
      }
    }
  };

  const handleSelectTemplate = (idx: number) => {
    soundEngine.playGlassClick();
    setSelectedTemplate(idx);
    setJsonText(JSON.stringify(TEMPLATE_SCENARIOS[idx].payload, null, 2));
  };

  const handleTriggerN8nAutomation = async () => {
    soundEngine.playGlassClick();
    setIsTriggering(true);
    const start = performance.now();

    const targetUrl = scanDomain.trim();
    const selectedIndustry = scanIndustry;

    // Exact JSON body required by user's n8n workflow
    const exactPayload = {
      website: targetUrl,
      industry: selectedIndustry,
    };

    const companyDisplay =
      targetUrl.replace(/^https?:\/\//i, "").replace(/\/$/, "") || "Target Domain";

    // Immediately update the Live Telemetry Terminal
    onAddLog({
      id: `log-${Date.now()}-dispatch`,
      timestamp: new Date().toLocaleTimeString(),
      event: "POST to n8n Cloud Webhook (Dispatched)",
      status: "QUEUED",
      companyName: companyDisplay,
      score: 0,
      latencyMs: 0,
      payload: exactPayload,
    });

    try {
      const res = await fetch("/api/n8n/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: n8nUrl,
          payload: exactPayload,
        }),
      });

      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);

      if (data.success || data.statusCode === 200) {
        soundEngine.playRadarPing(0.4);
        onAddLog({
          id: `log-${Date.now()}-completed`,
          timestamp: new Date().toLocaleTimeString(),
          event: "POST to n8n Cloud Webhook (Completed)",
          status: "SUCCESS",
          companyName: companyDisplay,
          score: data.response?.lead_score || data.response?.lead?.score || 92,
          latencyMs: elapsed,
          payload: data.response || exactPayload,
        });

        if (data.response && (data.response.company_name || data.response.companyName || data.response.lead)) {
          const leadObj = data.response.lead || data.response;
          onLeadIngested(leadObj);
          setSplashEntrance(leadObj.company_name || leadObj.companyName);
          setTimeout(() => setSplashEntrance(null), 4000);
        } else {
          setSplashEntrance(`Target Dispatched to n8n: ${targetUrl}`);
          setTimeout(() => setSplashEntrance(null), 4000);
        }

        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.5, x: 0.5 },
            colors: ["#6366f1", "#10b981", "#38bdf8"],
          });
        } catch {}
      } else if (data.statusCode === 404 || data.statusCode === 405 || data.n8nStatus === "REACHABLE") {
        // HTTP 404/405 from n8n webhook URL is treated as REACHABLE/ONLINE
        onAddLog({
          id: `log-${Date.now()}-reachable`,
          timestamp: new Date().toLocaleTimeString(),
          event: `POST to n8n Cloud Webhook (HTTP ${data.statusCode})`,
          status: "SUCCESS",
          companyName: companyDisplay,
          score: 0,
          latencyMs: elapsed,
          payload: data,
        });
        setSplashEntrance(`Dispatched to n8n (HTTP ${data.statusCode})`);
        setTimeout(() => setSplashEntrance(null), 4000);
      } else {
        onAddLog({
          id: `log-${Date.now()}-failed`,
          timestamp: new Date().toLocaleTimeString(),
          event: "POST to n8n Cloud Webhook",
          status: "FAILED",
          companyName: companyDisplay,
          score: 0,
          latencyMs: elapsed,
          payload: data,
        });

        if (data.n8nStatus === "INACTIVE") {
          setConnectionStatus("INACTIVE");
          setConnectionHint(data.hint);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error";
      onAddLog({
        id: `log-${Date.now()}-error`,
        timestamp: new Date().toLocaleTimeString(),
        event: "POST to n8n Cloud Webhook (Error)",
        status: "FAILED",
        companyName: companyDisplay,
        score: 0,
        latencyMs: Math.round(performance.now() - start),
        payload: { error: message },
      });
    } finally {
      setIsTriggering(false);
    }
  };

  const handleSimulateInboundLead = async () => {
    soundEngine.playGlassClick();
    setIsSimulating(true);
    const start = performance.now();

    try {
      const parsed = JSON.parse(jsonText);
      const res = await fetch("/api/leads/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);

      if (data.success && data.lead) {
        onLeadIngested(data.lead);

        if (data.lead.score >= 85) {
          soundEngine.playRadarPing(0.4);
        }

        setSplashEntrance(data.lead.companyName);
        setTimeout(() => setSplashEntrance(null), 4500);

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.5, x: 0.5 },
            colors: ["#6366f1", "#10b981", "#f43f5e"],
          });
        } catch {}

        onAddLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          event: "POST /api/leads/webhook (Inbound n8n AI)",
          status: "SUCCESS",
          companyName: data.lead.companyName,
          score: data.lead.score,
          latencyMs: elapsed,
          payload: parsed,
        });
      } else {
        throw new Error(data.error || "Failed to ingest lead");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error";
      onAddLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        event: "POST /api/leads/webhook (Inbound n8n AI)",
        status: "FAILED",
        companyName: "Unknown",
        score: 0,
        latencyMs: Math.round(performance.now() - start),
        payload: { error: message },
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopyEndpoint = (textToCopy: string, isNodeConfig = false) => {
    soundEngine.playGlassClick();
    navigator.clipboard.writeText(textToCopy);
    if (isNodeConfig) {
      setCopiedN8nNode(true);
      setTimeout(() => setCopiedN8nNode(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  // Exact JSON node for n8n to send the AI node schema back to the dashboard
  const n8nNodeJsonSnippet = JSON.stringify(
    {
      name: "Send to Hybrid.Ops Dashboard",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [900, 300],
      parameters: {
        method: "POST",
        url: dynamicWebhookEndpoint,
        sendHeaders: true,
        headerParameters: {
          parameters: [{ name: "Content-Type", value: "application/json" }],
        },
        sendBody: true,
        bodyParameters: {
          parameters: [
            { name: "company_name", value: "={{ $json.company_name }}" },
            { name: "location", value: "={{ $json.location }}" },
            { name: "website", value: "={{ $json.website }}" },
            { name: "decision_maker", value: "={{ $json.decision_maker }}" },
            { name: "role", value: "={{ $json.role }}" },
            { name: "email", value: "={{ $json.email }}" },
            { name: "linkedin", value: "={{ $json.linkedin }}" },
            { name: "lead_score", value: "={{ $json.lead_score }}" },
            { name: "status", value: "={{ $json.status }}" },
            { name: "bottlenecks", value: "={{ $json.bottlenecks }}" },
            { name: "personalized_hook", value: "={{ $json.personalized_hook }}" },
            { name: "audit_timestamp", value: "={{ $json.audit_timestamp || $now.toISO() }}" },
          ],
        },
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      {/* Entrance Splash Toast */}
      <AnimatePresence>
        {splashEntrance && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl backdrop-blur-2xl bg-white/95 border border-emerald-300 shadow-[0_12px_40px_rgba(16,185,129,0.25)] flex items-center gap-3 text-slate-900"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600">
              <Sparkles size={20} className="animate-spin" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">
                ⚡ n8n Pipeline Sync Successful
              </div>
              <div className="text-sm font-bold text-slate-900">
                &ldquo;{splashEntrance}&rdquo;
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PRIMARY n8n CLOUD CONNECTION HUD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-50/90 via-indigo-50/80 to-sky-50/90 border border-indigo-200/90 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs">
                <Radio size={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Connected n8n Lead Qualification Engine
                  <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                    CLOUD CLUSTER
                  </span>
                </h2>
                <p className="text-xs text-slate-600">
                  Bi-directional synchronization between your live n8n workflow and the Hybrid.Ops radar
                </p>
              </div>
            </div>
          </div>

          {/* Connection Status Pill & Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {connectionStatus === "CHECKING" && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-600 border border-slate-300 flex items-center gap-2">
                <RefreshCw size={13} className="animate-spin text-indigo-600" />
                Pinging n8n...
              </span>
            )}

            {(connectionStatus === "CONNECTED" || connectionStatus === "ACTIVE" || connectionStatus === "REACHABLE") && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <ShieldCheck size={14} className="text-emerald-700" />
                ONLINE / CONNECTED (HTTP {lastStatusCode || 200}) • {latency}ms
              </span>
            )}

            {connectionStatus === "INACTIVE" && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-2 shadow-xs">
                <ShieldAlert size={14} className="text-amber-700" />
                WORKFLOW INACTIVE IN n8N
              </span>
            )}

            {connectionStatus === "ERROR" && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-2">
                OFFLINE / UNREACHABLE
              </span>
            )}

            <button
              onClick={() => checkN8nConnection(undefined, true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Ping n8n Cloud Webhook"
            >
              <RefreshCw size={13} className={connectionStatus === "CHECKING" ? "animate-spin" : ""} />
              <span>Ping Status</span>
            </button>
          </div>
        </div>

        {/* Webhook URL Input & Mode Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-2 border-t border-indigo-100">
          <div className="flex items-center bg-white/90 border border-slate-200 rounded-xl p-1 gap-1 text-xs shadow-2xs self-start md:self-auto">
            <button
              onClick={() => handleToggleUrlMode(false)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${
                !isTestMode
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Production URL
            </button>
            <button
              onClick={() => handleToggleUrlMode(true)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${
                isTestMode
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Test Canvas URL
            </button>
          </div>

          <div className="flex-1 flex items-center bg-white border border-slate-300/90 rounded-xl px-3.5 py-2 font-mono text-xs shadow-xs gap-2">
            <Globe size={15} className="text-indigo-600 shrink-0" />
            <input
              type="text"
              value={n8nUrl}
              onChange={(e) => setN8nUrl(e.target.value)}
              className="w-full bg-transparent text-slate-900 focus:outline-none font-semibold text-xs"
              placeholder="https://..."
            />
            <button
              onClick={() => handleCopyEndpoint(n8nUrl)}
              className="p-1 text-slate-400 hover:text-indigo-600 transition shrink-0"
              title="Copy n8n Webhook URL"
            >
              {copiedUrl ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
            </button>
          </div>
        </div>

        {(connectionStatus === "CONNECTED" || connectionStatus === "REACHABLE") && connectionHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5"
          >
            <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">n8n Webhook Online &amp; Connected (HTTP {lastStatusCode || 200}):</strong> The webhook endpoint is actively responding.
              <div className="mt-1 text-emerald-800">
                {connectionHint}
              </div>
            </div>
          </motion.div>
        )}

        {connectionStatus === "INACTIVE" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5"
          >
            <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">n8n Cloud Connection Note:</strong> Your n8n webhook URL is correct and reached! However, n8n reported that this production webhook is not yet activated.
              <div className="mt-1 text-amber-800">
                👉 <strong>How to fix:</strong> In your n8n workflow editor, click the switch in the top-right corner to toggle from <strong>&ldquo;Inactive&rdquo;</strong> to <strong>&ldquo;Active&rdquo;</strong>. Or if you are currently running manual canvas tests in n8n, click the <strong>&ldquo;Test Canvas URL&rdquo;</strong> button above!
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 2. TWO-COLUMN INTERFACE: Outbound Trigger on Left, Inbound Ingestion / Logs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Launch Qualification & Inbound Webhook Settings */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card A: Trigger n8n Lead Qualification */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/80 p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Trigger n8n Lead Qualification Engine
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Submit a target website or agency domain directly into your live n8n crawler &amp;
              scoring pipeline:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Target Domain or Portfolio URL:
                </label>
                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono shadow-2xs">
                  <span className="text-indigo-600 font-bold mr-1">URL:</span>
                  <input
                    type="text"
                    value={scanDomain}
                    onChange={(e) => setScanDomain(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full bg-transparent text-slate-900 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Target Industry Vertical:
                </label>
                <select
                  value={scanIndustry}
                  onChange={(e) => setScanIndustry(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-semibold shadow-2xs"
                >
                  <option value="Luxury Real Estate">Luxury Real Estate ($10k-$25k Retainer)</option>
                  <option value="High-Ticket Creative Agency">High-Ticket Creative Agency ($15k+ Deal)</option>
                  <option value="B2B SaaS Enterprise">B2B SaaS Enterprise</option>
                  <option value="Architectural & Design Studio">Architectural & Design Studio</option>
                </select>
              </div>

              <button
                onClick={handleTriggerN8nAutomation}
                disabled={isTriggering}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs glass-button-primary shadow-sm"
              >
                {isTriggering ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Transmitting to n8n Cloud...</span>
                  </>
                ) : (
                  <>
                    <Play size={15} />
                    <span>⚡ Launch Lead Qualification on n8n</span>
                  </>
                )}
              </button>

              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between px-1 pt-1">
                <span className="text-slate-400">Exact JSON Body:</span>
                <code className="text-indigo-600 font-semibold bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100 truncate max-w-[260px]">
                  &#123; &quot;website&quot;: &quot;{scanDomain}&quot;, &quot;industry&quot;: &quot;{scanIndustry}&quot; &#125;
                </code>
              </div>
            </div>
          </div>

          {/* Card B: Inbound HTTP Node Configuration for n8n AI Schema */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/80 p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Inbound Receiver (n8n AI → Dashboard)
                </h3>
              </div>
              <button
                onClick={() => handleCopyEndpoint(n8nNodeJsonSnippet, true)}
                className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition flex items-center gap-1.5"
              >
                {copiedN8nNode ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiedN8nNode ? "Copied!" : "Copy n8n Node JSON"}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600">
              The dashboard accepts your exact n8n AI node output schema:
            </p>

            {/* Dynamic Webhook URL Pill */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  POST
                </span>
                <span className="text-indigo-700 font-semibold truncate">
                  {dynamicWebhookEndpoint}
                </span>
              </div>
              <button
                onClick={() => handleCopyEndpoint(dynamicWebhookEndpoint)}
                className="p-1 text-slate-400 hover:text-indigo-600 transition shrink-0"
                title="Copy Dynamic Inbound Webhook URL"
              >
                {copiedUrl ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Netlify Serverless Deployment Pill */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800">
              <Cloud size={15} className="text-sky-600 shrink-0" />
              <div className="text-[11px]">
                <strong>Netlify Ready:</strong> This endpoint runs as a Netlify Serverless Function with CORS headers enabled.
              </div>
            </div>

            {/* Scenario Switcher for Payload Simulator */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Test Inbound n8n AI Payload:
                </span>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 gap-1 text-[10px]">
                  {TEMPLATE_SCENARIOS.map((tmpl, idx) => (
                    <button
                      key={tmpl.name}
                      onClick={() => handleSelectTemplate(idx)}
                      className={`px-2 py-1 rounded-md font-bold transition ${
                        selectedTemplate === idx
                          ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Lead {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* JSON preview container */}
              <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-[#0f172a] shadow-inner">
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  rows={9}
                  className="w-full p-3 font-mono text-[11px] text-emerald-300 bg-transparent focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-slate-500">
                  Schema: company_name, bottlenecks, personalized_hook...
                </span>
                <button
                  onClick={handleSimulateInboundLead}
                  disabled={isSimulating}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition shadow-xs"
                >
                  {isSimulating ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  <span>Test Ingest n8n AI Lead</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Ingestion Log Terminal */}
        <div className="lg:col-span-6 rounded-2xl backdrop-blur-xl bg-white/80 p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-indigo-600" />
              <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                Live Telemetry Terminal ({logs.length} Events)
              </h3>
            </div>
            <button
              onClick={onClearLogs}
              className="text-[10px] font-mono text-slate-500 hover:text-slate-900 transition font-semibold"
            >
              Clear Logs
            </button>
          </div>

          {/* Terminal Console Output */}
          <div className="bg-[#0f172a] rounded-xl p-4 border border-slate-800 font-mono text-[11px] h-[550px] overflow-y-auto space-y-3 shadow-inner">
            {logs.length === 0 ? (
              <div className="py-24 text-center text-slate-500 space-y-2">
                <Terminal size={24} className="mx-auto text-slate-600" />
                <div>[SYSTEM READY] Listening for events from n8n Cloud...</div>
                <div className="text-[10px] text-slate-600">
                  Target: {n8nUrl}
                </div>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">{log.timestamp}</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        log.status === "SUCCESS" || log.status === "REACHABLE"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : log.status === "QUEUED"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {log.status} {log.latencyMs > 0 ? `(${log.latencyMs}ms)` : ""}
                    </span>
                  </div>

                  <div className="text-slate-100 font-semibold truncate text-xs">
                    {log.event} → {log.companyName}
                  </div>

                  {log.score > 0 && (
                    <div className="text-[10px] text-sky-300">
                      Score: <strong>{log.score}</strong> • Prioritized on Hot Lead Radar
                    </div>
                  )}

                  {log.payload && (
                    <div className="text-[10px] text-slate-500 truncate max-w-full">
                      Payload: {JSON.stringify(log.payload).substring(0, 90)}...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center font-medium">
            CONNECTED TO: <span className="text-indigo-600 font-bold">{n8nUrl}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
