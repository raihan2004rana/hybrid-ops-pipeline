export type IndustryType =
  | "Luxury Real Estate"
  | "Creative Agency"
  | "B2B SaaS Studio"
  | "Fintech & Advisory";

export type SeverityType = "CRITICAL" | "HIGH" | "MEDIUM";

export type OutreachStatusType =
  | "READY_TO_PITCH"
  | "PITCH_COPIED"
  | "CONTACTED"
  | "MEETING_BOOKED"
  | "CLOSED_WON";

export interface DecisionMaker {
  name: string;
  title: string;
  email: string;
  phone?: string;
  linkedin: string;
  avatarUrl: string;
}

export interface TechnicalBottleneck {
  type: string;
  severity: SeverityType;
  title: string;
  description: string;
  metrics: {
    pageSpeedMobile?: number;
    conversionDrop?: string;
    lostRevenueMonthly?: string;
    lcp?: string;
  };
}

export interface AIPitch {
  subject: string;
  observation: string;
  solution: string;
  cta: string;
}

export interface Lead {
  id: string;
  companyName: string;
  location: string;
  industry: IndustryType;
  dealValue: number;
  decisionMaker: DecisionMaker;
  bottleneck: TechnicalBottleneck;
  score: number; // 0-100
  outreachStatus: OutreachStatusType;
  websiteUrl: string;
  websiteSnapshotTitle?: string;
  aiPitch: AIPitch;
  personalizedHook?: string; // Direct from n8n AI node: personalized_hook
  auditTimestamp?: string;   // Direct from n8n AI node: audit_timestamp
  ingestedAt: string;
  tags: string[];
}

/**
 * Exact schema from n8n AI Node:
 * {
 *   company_name, location, website, decision_maker, role, email,
 *   linkedin, lead_score, status, bottlenecks, personalized_hook, audit_timestamp
 * }
 */
export interface N8nAILeadPayload {
  // 1. Exact snake_case schema from n8n AI Node
  company_name?: string;
  location?: string;
  website?: string;
  decision_maker?: string;
  role?: string;
  email?: string;
  linkedin?: string;
  lead_score?: number | string;
  status?: string;
  bottlenecks?:
    | string
    | string[]
    | {
        type?: string;
        title?: string;
        description?: string;
        severity?: SeverityType;
        metrics?: {
          pageSpeedMobile?: number;
          conversionDrop?: string;
          lostRevenueMonthly?: string;
          lcp?: string;
        };
      };
  personalized_hook?: string;
  audit_timestamp?: string;

  // 2. Backward-compatible camelCase equivalents
  companyName?: string;
  websiteUrl?: string;
  dealValue?: number;
  industry?: IndustryType;
  decisionMaker?: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    avatarUrl?: string;
  };
  bottleneck?: {
    type?: string;
    severity?: SeverityType;
    title?: string;
    description?: string;
    metrics?: {
      pageSpeedMobile?: number;
      conversionDrop?: string;
      lostRevenueMonthly?: string;
      lcp?: string;
    };
  };
  score?: number | string;
  tags?: string[];
}

export type WebhookPayload = N8nAILeadPayload;

export interface WebhookLog {
  id: string;
  timestamp: string;
  event: string;
  status: "SUCCESS" | "FAILED" | "QUEUED";
  companyName: string;
  score: number;
  latencyMs: number;
  payload: Record<string, unknown>;
}

export interface ScoringConfig {
  bottleneckWeight: number; // e.g. 40%
  dealSizeWeight: number;   // e.g. 25%
  decisionMakerWeight: number; // e.g. 20%
  speedMultiplier: number;
  dealValueDefault: number; // default $1,000 / deal
}
