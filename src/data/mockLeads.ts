import { Lead } from "@/types/pipeline";

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-sov-01",
    companyName: "Sovereign Haven Luxury Estates",
    location: "Aspen, CO & Palm Beach, FL",
    industry: "Luxury Real Estate",
    dealValue: 14500,
    decisionMaker: {
      name: "Julian Vance",
      title: "Managing Partner & Chief Investment Officer",
      email: "julian.vance@sovereignhaven.com",
      phone: "+1 (970) 544-8920",
      linkedin: "https://linkedin.com/in/julian-vance-sovereign",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    },
    bottleneck: {
      type: "Broken Mobile 3D Matterport Viewer & Form 404",
      severity: "CRITICAL",
      title: "Mobile 3D Tour Engine Crashing on iOS Safari",
      description:
        "The flagship $28M Aspen Snowmass listing crashes Safari on iPhone 14/15 during 3D WebGL tour initialization. VIP mobile buyers clicking 'Schedule Private Showing' are redirected to an unrouted 404 handler, directly shedding high-net-worth inquiries.",
      metrics: {
        pageSpeedMobile: 34,
        conversionDrop: "-58.4%",
        lostRevenueMonthly: "$142,000",
        lcp: "5.8s",
      },
    },
    score: 96,
    outreachStatus: "READY_TO_PITCH",
    websiteUrl: "https://sovereignhaven.com",
    websiteSnapshotTitle: "Sovereign Haven — Ultra-Prime Global Architectural Real Estate",
    aiPitch: {
      subject: "Quick fix for the Aspen Snowmass 3D tour crash on mobile Safari",
      observation:
        "Julian, was reviewing Sovereign Haven's premier $28M Aspen listing on mobile Safari and noticed the 3D Matterport canvas fails with a WebGL memory overflow, and clicking 'Schedule Private Showing' throws a 404.",
      solution:
        "We've engineered a lightweight watery-glass CDN viewer with progressive WebGL fallbacks that loads sub-second on iOS and instantly routes private VIP tour requests to your partner desk.",
      cta: "Can I send over a 60-second video teardown showing the exact 3-line fix for your engineering team?",
    },
    ingestedAt: "2026-11-12T08:30:00Z",
    tags: ["High-Net-Worth", "Matterport 3D", "Critical Form 404", "Aspen Brokerage"],
  },
  {
    id: "lead-lum-02",
    companyName: "Luminary Media Group",
    location: "New York, NY (SoHo & Madison Ave)",
    industry: "Creative Agency",
    dealValue: 9800,
    decisionMaker: {
      name: "Elena Rostova",
      title: "VP of Growth & Client Operations",
      email: "e.rostova@luminarymedia.nyc",
      phone: "+1 (212) 880-3419",
      linkedin: "https://linkedin.com/in/elena-rostova-growth",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    },
    bottleneck: {
      type: "Broken Webhook Ingestion & 5.4s LCP",
      severity: "CRITICAL",
      title: "Enterprise RFP Submissions Silently Failing to Sync",
      description:
        "Form submission on '/enterprise-rfp' produces a 200 OK on client-side but the webhook to HubSpot/Slack drops 4 out of 10 requests due to unhandled JSON truncation. Meanwhile, 42MB uncompressed client showreel video throttles LCP to 5.4s.",
      metrics: {
        pageSpeedMobile: 38,
        conversionDrop: "-41.2%",
        lostRevenueMonthly: "$85,000",
        lcp: "5.4s",
      },
    },
    score: 91,
    outreachStatus: "READY_TO_PITCH",
    websiteUrl: "https://luminarymedia.nyc",
    websiteSnapshotTitle: "Luminary Media — Performance Creative & Brand Systems for Tier-1 Brands",
    aiPitch: {
      subject: "Uncaught webhook payload drops on Luminary's Enterprise RFP form",
      observation:
        "Elena, your agency work is sublime, but we ran automated health probes on your '/enterprise-rfp' endpoint and found 40% of form submissions fail downstream webhook delivery without throwing user errors.",
      solution:
        "We can deploy a zero-latency fault-tolerant Edge proxy that caches, retries, and streams CMO inbound requests directly to your pipeline without dropping a single enterprise deal.",
      cta: "Open to a quick screen share tomorrow morning to verify the endpoint logs together?",
    },
    ingestedAt: "2026-11-12T09:15:00Z",
    tags: ["RFP Pipeline", "HubSpot Webhook", "LCP Bottleneck", "Madison Ave Agency"],
  },
  {
    id: "lead-apex-03",
    companyName: "Apex Horizon Residential",
    location: "Beverly Hills & Newport Beach, CA",
    industry: "Luxury Real Estate",
    dealValue: 12000,
    decisionMaker: {
      name: "Marcus Sterling",
      title: "Founder & Principal Broker",
      email: "marcus@apexhorizonrealty.com",
      phone: "+1 (310) 792-8001",
      linkedin: "https://linkedin.com/in/marcus-sterling-realty",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    },
    bottleneck: {
      type: "MLS IDX Feed Latency & Missing Retargeting",
      severity: "HIGH",
      title: "18-Second MLS Cache Stalls & Missing VIP Conversion Pixel",
      description:
        "Property catalog loads live MLS data via un-cached PHP queries taking up to 18 seconds on cellular networks. Zero Meta/LinkedIn conversion pixels installed on $15M+ Bel Air listings, leaving 90% of paid ad traffic untracked.",
      metrics: {
        pageSpeedMobile: 42,
        conversionDrop: "-64.0%",
        lostRevenueMonthly: "$110,000",
        lcp: "6.2s",
      },
    },
    score: 88,
    outreachStatus: "READY_TO_PITCH",
    websiteUrl: "https://apexhorizonrealty.com",
    websiteSnapshotTitle: "Apex Horizon — Beverly Hills & Newport Beach Ultra-Luxury Mansions",
    aiPitch: {
      subject: "Beverly Hills listing speed on mobile + missing VIP conversion pixel",
      observation:
        "Marcus, your portfolio of Bel Air & Newport estates is world-class, but the mobile MLS sync is clocking 6+ second load times and there's no retargeting pixel tracking visitors on the $18M Carolwood estate.",
      solution:
        "We specialize in edge-cached Next.js IDX architectures that render listings in 250ms and capture high-intent buyers with privacy-first cookieless lead tracking.",
      cta: "Would you have 5 minutes this Thursday for a brief benchmark against The Agency & Compass?",
    },
    ingestedAt: "2026-11-12T10:00:00Z",
    tags: ["Beverly Hills", "MLS Lag", "Retargeting Gap", "Bel Air Estates"],
  },
  {
    id: "lead-vvg-04",
    companyName: "Vanguard Velocity Creative",
    location: "Austin, TX & Denver, CO",
    industry: "Creative Agency",
    dealValue: 8500,
    decisionMaker: {
      name: "Sarah Chen-Morales",
      title: "Head of Digital Architecture",
      email: "sarah.chen@vanguardvelocity.io",
      phone: "+1 (512) 991-6302",
      linkedin: "https://linkedin.com/in/sarah-chen-morales",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
    },
    bottleneck: {
      type: "Calendly Embed Freeze & Mobile CTA Drop",
      severity: "HIGH",
      title: "Interactive Scheduler Iframe Freezing on Mobile Viewport",
      description:
        "Third-party scheduling iframe traps mobile scroll gestures and triggers an un-dismissable backdrop mask on Chromium mobile. Over 45% of potential clients bounce immediately upon attempting to book a discovery call.",
      metrics: {
        pageSpeedMobile: 51,
        conversionDrop: "-38.2%",
        lostRevenueMonthly: "$45,000",
        lcp: "3.9s",
      },
    },
    score: 84,
    outreachStatus: "READY_TO_PITCH",
    websiteUrl: "https://vanguardvelocity.io",
    websiteSnapshotTitle: "Vanguard Velocity — Full-Funnel Product Design & Brand Acceleration",
    aiPitch: {
      subject: "Fixing the mobile iframe freeze on Vanguard's 'Book Strategy Session' modal",
      observation:
        "Sarah, was testing the booking workflow on vanguardvelocity.io on mobile and the embedded scheduler locks up touchscreen scrolling on Android & iOS, blocking appointment confirmation.",
      solution:
        "We can replace the heavy third-party embed with a native liquid-glass booking drawer that syncs directly to your team's Google Workspace in under 300ms.",
      cta: "Happy to shoot over the interactive preview link if you'd like to test drive it?",
    },
    ingestedAt: "2026-11-12T10:45:00Z",
    tags: ["Austin Creative", "Calendly Freeze", "Iframe Conflict", "High-growth"],
  },
  {
    id: "lead-obs-05",
    companyName: "Obsidian Crest Capital & Realty",
    location: "Miami, FL (Brickell & Star Island)",
    industry: "Luxury Real Estate",
    dealValue: 11000,
    decisionMaker: {
      name: "Rafael De Luca",
      title: "Senior Director of Acquisitions & Capital",
      email: "rdeluca@obsidiancrestcapital.com",
      phone: "+1 (305) 412-9988",
      linkedin: "https://linkedin.com/in/rafael-deluca-capital",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    },
    bottleneck: {
      type: "Missing Schema Markup & 4K Video Stutter",
      severity: "MEDIUM",
      title: "Unoptimized 4K Background Video Crashing Low-Bandwidth Devices",
      description:
        "Homepage video element lacks `playsinline` and responsive bitrate fallbacks. Absence of RealEstateAgent JSON-LD schema causes loss of rich Google SERP snippet rankings for Star Island and Venetian Islands luxury keywords.",
      metrics: {
        pageSpeedMobile: 47,
        conversionDrop: "-32.5%",
        lostRevenueMonthly: "$62,000",
        lcp: "4.6s",
      },
    },
    score: 79,
    outreachStatus: "READY_TO_PITCH",
    websiteUrl: "https://obsidiancrestcapital.com",
    websiteSnapshotTitle: "Obsidian Crest — Miami Waterfront Trophy Assets & Private Capital",
    aiPitch: {
      subject: "Miami waterfront search rankings + 4K video mobile optimization",
      observation:
        "Rafael, Obsidian Crest's Star Island portfolio looks magnificent, but the lack of structured RealEstateAgent schema is costing you first-page Google luxury snippets against Douglas Elliman and ONE Sotheby's.",
      solution:
        "We can inject automated Google Knowledge Graph schema and adaptive HLS video streaming that cuts initial data payload by 82% without losing crisp 4K fidelity.",
      cta: "Could I send you our 1-page Miami luxury brokerage speed & SEO audit?",
    },
    ingestedAt: "2026-11-12T11:20:00Z",
    tags: ["Miami Waterfront", "Schema Markup", "Video Compression", "Star Island"],
  },
  {
    id: "lead-aeth-06",
    companyName: "Aetherius Brand Partners",
    location: "San Francisco, CA & London, UK",
    industry: "Creative Agency",
    dealValue: 7200,
    decisionMaker: {
      name: "Vivienne Moreau",
      title: "Partner & Creative Technologist",
      email: "v.moreau@aetheriusbrands.com",
      phone: "+1 (415) 309-8821",
      linkedin: "https://linkedin.com/in/vivienne-moreau-design",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
    },
    bottleneck: {
      type: "Heavy WebGL Overheating Mobile Devices",
      severity: "MEDIUM",
      title: "Uncapped 60FPS Three.js Scene Draining Mobile Battery & Throttling",
      description:
        "The 3D interactive hero canvas lacks adaptive GPU device tiering. It forces 8x MSAA anti-aliasing on mobile chips, causing immediate thermal throttling, dropping frame rates to 14 FPS, and causing 52% of visitors to abandon the contact page.",
      metrics: {
        pageSpeedMobile: 56,
        conversionDrop: "-29.0%",
        lostRevenueMonthly: "$38,000",
        lcp: "4.1s",
      },
    },
    score: 74,
    outreachStatus: "READY_TO_PITCH",
    websiteUrl: "https://aetheriusbrands.com",
    websiteSnapshotTitle: "Aetherius — Modern Identity & Web Experiences for Venture-Backed Brands",
    aiPitch: {
      subject: "Adaptive GPU tiering fix for Aetherius's Three.js hero animation",
      observation:
        "Vivienne, the WebGL art direction on aetheriusbrands.com is sensational, but uncapped mobile draw calls cause noticeable thermal stutter and battery drain on iPhone and Pixel devices.",
      solution:
        "We built a lightweight WebGL performance limiter that dynamically scales shader complexity to guarantee 60fps on mobile without degrading desktop aesthetics.",
      cta: "Would you be interested in the GitHub gist or a quick 2-minute loom?",
    },
    ingestedAt: "2026-11-12T11:55:00Z",
    tags: ["Three.js WebGL", "GPU Throttling", "San Francisco", "Venture Brands"],
  },
];

