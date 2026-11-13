import { NextResponse } from "next/server";
import { Lead, N8nAILeadPayload, OutreachStatusType, SeverityType } from "@/types/pipeline";

export const dynamic = "force-dynamic";

// In-memory buffer for real-time webhooks during session
const webhookEvents: Array<{
  id: string;
  timestamp: string;
  lead: Lead;
}> = [];

// CORS pre-flight support for external webhook callers
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, User-Agent",
    },
  });
}

export async function GET(request: Request) {
  const origin = request.headers.get("host")
    ? `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`
    : "";

  return NextResponse.json(
    {
      status: "ONLINE",
      protocol: "HYBRID.OPS v2.4 WEBHOOK RECEIVER",
      endpoint: "/api/leads/webhook",
      serverUrl: origin,
      acceptedMethod: "POST",
      format: "application/json",
      description: "Accepts incoming B2B agency and real estate leads from n8n AI Lead Qualification workflows and public website audit inquiries.",
      schema: {
        n8nAIFormat: {
          company_name: "Apex Horizon Residential",
          location: "Austin, TX (Westlake)",
          website: "https://apexhorizon.com",
          decision_maker: "Marcus Vance",
          role: "Managing Principal & Head of Acquisitions",
          email: "marcus@apexhorizon.com",
          linkedin: "https://linkedin.com/in/marcus-vance-realestate",
          lead_score: 94,
          status: "HOT",
          bottlenecks: "Mobile Safari 500 error on VIP inquiry form; 5.8s LCP hero block",
          personalized_hook: "Saw Apex Horizon's premier Westlake listing portfolio, but your mobile VIP inquiry form is throwing a 500 server error on iOS Safari.",
          audit_timestamp: new Date().toISOString(),
        },
      },
      recentEventsCount: webhookEvents.length,
      recentLeads: webhookEvents.slice(0, 25).map((e) => e.lead),
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body: N8nAILeadPayload = await request.json();

    // 1. Resolve Company Name (support n8n AI snake_case, camelCase, or derive from website/domain)
    let companyName = body.company_name || body.companyName;
    if (!companyName && body.website) {
      try {
        const rawDomain = body.website
          .replace(/^https?:\/\//i, "")
          .replace(/^www\./i, "")
          .split(/[\/?#]/)[0]
          .split(".")[0];
        if (rawDomain && rawDomain.length > 1) {
          companyName = rawDomain.charAt(0).toUpperCase() + rawDomain.slice(1).replace(/[-_]/g, " ");
        }
      } catch {
        // fallback
      }
    }
    if (!companyName && (body.decision_maker || body.decisionMaker?.name)) {
      companyName = `${body.decision_maker || body.decisionMaker?.name}'s Brand`;
    }

    if (!companyName) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required company identifier. Provide 'company_name', 'companyName', or 'website'.",
        },
        {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // 2. Resolve Website
    const cleanDomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const websiteUrl =
      body.website ||
      body.websiteUrl ||
      `https://${cleanDomain}.com`;

    // 3. Resolve Location & Industry
    const location = body.location || "United States (Metro)";
    const industry =
      body.industry ||
      (companyName.toLowerCase().includes("estate") ||
      companyName.toLowerCase().includes("haven") ||
      companyName.toLowerCase().includes("crest") ||
      location.toLowerCase().includes("ca") ||
      location.toLowerCase().includes("fl") ||
      location.toLowerCase().includes("tx")
        ? "Luxury Real Estate"
        : "Creative Agency");

    // 4. Resolve Decision Maker
    const dmName =
      body.decision_maker ||
      body.decisionMaker?.name ||
      "Managing Director";
    const dmRole =
      body.role ||
      body.decisionMaker?.title ||
      "Managing Partner & Principal";
    const dmEmail =
      body.email ||
      body.decisionMaker?.email ||
      `contact@${cleanDomain}.com`;
    const dmLinkedin =
      body.linkedin ||
      body.decisionMaker?.linkedin ||
      `https://linkedin.com/in/${dmName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const dmPhone =
      body.decisionMaker?.phone ||
      "+1 (555) 234-8900";

    const avatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    ];
    const dmAvatar =
      body.decisionMaker?.avatarUrl ||
      avatars[Math.floor(Math.random() * avatars.length)];

    // 5. Resolve Lead Score
    const rawScore = body.lead_score ?? body.score;
    let score = 88;
    if (typeof rawScore === "number") {
      score = Math.max(0, Math.min(100, Math.round(rawScore)));
    } else if (typeof rawScore === "string") {
      const parsed = parseInt(rawScore, 10);
      if (!isNaN(parsed)) score = Math.max(0, Math.min(100, parsed));
    } else {
      score = Math.floor(Math.random() * 16) + 84; // default high score 84-99
    }

    // 6. Resolve Status
    let outreachStatus: OutreachStatusType = "READY_TO_PITCH";
    const rawStatus = (body.status || "").toUpperCase();
    if (rawStatus === "CONTACTED") outreachStatus = "CONTACTED";
    else if (rawStatus === "MEETING_BOOKED" || rawStatus === "MEETING") outreachStatus = "MEETING_BOOKED";
    else if (rawStatus === "CLOSED_WON" || rawStatus === "CLOSED") outreachStatus = "CLOSED_WON";
    else if (rawStatus === "PITCH_COPIED") outreachStatus = "PITCH_COPIED";
    else outreachStatus = "READY_TO_PITCH";

    // 7. Resolve Bottlenecks & Defects
    let bottleneckTitle = "Mobile Core Web Vitals & Form Conversion Drop";
    let bottleneckDesc = "Mobile viewport friction detected, resulting in an estimated 45%+ qualified prospect inquiry loss.";
    let bottleneckType = "Mobile Conversion Latency";
    let severity: SeverityType = score >= 85 ? "CRITICAL" : "HIGH";

    if (typeof body.bottlenecks === "string") {
      bottleneckTitle = body.bottlenecks;
      bottleneckDesc = `Identified technical bottleneck: ${body.bottlenecks}`;
      bottleneckType = body.bottlenecks.split(";")[0].split(",")[0].trim();
    } else if (Array.isArray(body.bottlenecks) && body.bottlenecks.length > 0) {
      bottleneckTitle = body.bottlenecks.join("; ");
      bottleneckDesc = `Identified defects: ${body.bottlenecks.join(", ")}`;
      bottleneckType = String(body.bottlenecks[0]);
    } else if (body.bottleneck && typeof body.bottleneck === "object") {
      bottleneckTitle = body.bottleneck.title || bottleneckTitle;
      bottleneckDesc = body.bottleneck.description || bottleneckDesc;
      bottleneckType = body.bottleneck.type || bottleneckType;
      if (body.bottleneck.severity) severity = body.bottleneck.severity;
    }

    // 8. Resolve Personalized Hook & AI Pitch
    const personalizedHook =
      body.personalized_hook ||
      `Ran diagnostics on ${websiteUrl} and identified that high-ticket prospects on mobile devices are encountering ${bottleneckType.toLowerCase()}, hurting direct inquiry rates.`;

    const aiPitch = {
      subject: `Technical diagnostic for ${companyName}'s mobile conversion funnel`,
      observation: personalizedHook,
      solution: `We deploy an edge-rendered hydration layer that resolves mobile latency and stops VIP inquiry loss in under 48 hours without rebuilding your site.`,
      cta: `Can I send over the 60-second Loom recording showing the exact mobile fix?`,
    };

    // 9. Resolve Deal Value & Timestamp
    const dealValue =
      body.dealValue ||
      (score >= 90 ? 15000 : score >= 80 ? 12000 : 8500);

    const auditTimestamp =
      body.audit_timestamp ||
      new Date().toISOString();

    // 10. Construct Normalized Lead Object
    const newLead: Lead = {
      id: `lead-n8n-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      companyName,
      location,
      industry,
      dealValue,
      decisionMaker: {
        name: dmName,
        title: dmRole,
        email: dmEmail,
        phone: dmPhone,
        linkedin: dmLinkedin,
        avatarUrl: dmAvatar,
      },
      bottleneck: {
        type: bottleneckType,
        severity,
        title: bottleneckTitle,
        description: bottleneckDesc,
        metrics: {
          pageSpeedMobile:
            body.bottleneck?.metrics?.pageSpeedMobile ||
            Math.floor(Math.random() * 20) + 28,
          conversionDrop:
            body.bottleneck?.metrics?.conversionDrop ||
            `-${Math.floor(Math.random() * 30) + 35}%`,
          lostRevenueMonthly:
            body.bottleneck?.metrics?.lostRevenueMonthly ||
            `$${Math.floor(Math.random() * 70) + 60},000`,
          lcp:
            body.bottleneck?.metrics?.lcp ||
            `${(Math.random() * 2 + 4.5).toFixed(1)}s`,
        },
      },
      score,
      outreachStatus,
      websiteUrl,
      websiteSnapshotTitle: `${companyName} — Operations & Digital Footprint`,
      aiPitch,
      personalizedHook,
      auditTimestamp,
      ingestedAt: auditTimestamp,
      tags: body.tags || [
        "n8n AI Qualified",
        score >= 85 ? "Hot Target" : "Qualified Lead",
        industry,
      ],
    };

    webhookEvents.unshift({
      id: newLead.id,
      timestamp: new Date().toISOString(),
      lead: newLead,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Lead "${newLead.companyName}" ingested and prioritized on the Hot Radar.`,
        score: newLead.score,
        lead: newLead,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return NextResponse.json(
      { success: false, error: message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
