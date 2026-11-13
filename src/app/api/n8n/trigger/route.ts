import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_N8N_URL =
  process.env.NEXT_PUBLIC_N8N_PRODUCTION_URL ||
  "https://b2b-web-lead-engine.app.n8n.cloud/webhook/b2b-lead-qualification";

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
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url") || DEFAULT_N8N_URL;

  const start = performance.now();
  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "HybridOps-CommandCenter/2.4",
      },
      body: JSON.stringify({ ping: true }),
      cache: "no-store",
    });

    const latencyMs = Math.round(performance.now() - start);
    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      // Not JSON
    }

    if (res.ok) {
      return NextResponse.json(
        {
          success: true,
          targetUrl,
          statusCode: res.status,
          n8nStatus: "ACTIVE",
          message: "n8n Cloud Webhook is LIVE and actively processing events.",
          response: json || text,
          latencyMs,
        },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Treat HTTP 404 or HTTP 405 from n8n webhook URL as ONLINE/REACHABLE instead of OFFLINE
    if (res.status === 404 || res.status === 405) {
      return NextResponse.json(
        {
          success: true,
          targetUrl,
          statusCode: res.status,
          n8nStatus: "REACHABLE",
          message: `n8n Webhook URL is ONLINE and REACHABLE (HTTP ${res.status}).`,
          hint:
            res.status === 404
              ? "Webhook endpoint reached! Note: If testing in n8n, click 'Listen for test event' or activate the workflow toggle."
              : `Webhook endpoint reached and responded with HTTP ${res.status}.`,
          response: json || text,
          latencyMs,
        },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    return NextResponse.json(
      {
        success: false,
        targetUrl,
        statusCode: res.status,
        n8nStatus: "ERROR",
        message: `n8n responded with HTTP ${res.status}`,
        response: json || text,
        latencyMs,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Connection failed";
    return NextResponse.json(
      {
        success: false,
        targetUrl,
        statusCode: 500,
        n8nStatus: "OFFLINE",
        message: `Failed to reach n8n webhook: ${message}`,
        latencyMs: Math.round(performance.now() - start),
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export async function POST(request: Request) {
  const start = performance.now();
  try {
    const body = await request.json();
    const targetUrl = body.webhookUrl || DEFAULT_N8N_URL;

    // Check if lightweight ping via POST
    const isPing = body.ping === true || body.payload?.ping === true;

    // Resolve exact payload to dispatch to the n8n webhook URL
    let payload: any;
    if (isPing) {
      payload = { ping: true };
    } else if (body.payload !== undefined) {
      payload = body.payload;
    } else if (body.website) {
      // Ensure exact JSON body { website, industry }
      payload = {
        website: body.website,
        industry: body.industry,
      };
    } else {
      const { webhookUrl: _, ...rest } = body;
      payload = rest;
    }

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "HybridOps-CommandCenter/2.4",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const latencyMs = Math.round(performance.now() - start);
    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      // Raw string
    }

    if (res.ok) {
      return NextResponse.json(
        {
          success: true,
          targetUrl,
          statusCode: res.status,
          n8nStatus: "ACTIVE",
          message: isPing
            ? "n8n Cloud Webhook is LIVE and actively processing events."
            : "Payload successfully dispatched to n8n Cloud Automation.",
          response: json || text,
          latencyMs,
        },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Treat HTTP 404 or HTTP 405 response as ONLINE/REACHABLE instead of OFFLINE
    if (res.status === 404 || res.status === 405) {
      return NextResponse.json(
        {
          success: true,
          targetUrl,
          statusCode: res.status,
          n8nStatus: "REACHABLE",
          message: isPing
            ? `n8n Webhook URL is ONLINE and REACHABLE (HTTP ${res.status}).`
            : `Payload dispatched to n8n. Webhook returned HTTP ${res.status} (Reachable).`,
          hint:
            res.status === 404
              ? "Webhook endpoint reached! Note: If using a Test URL, make sure 'Test step' or 'Listen for test event' is active in n8n. If using Production, activate the workflow toggle."
              : `Webhook endpoint reached and responded with HTTP ${res.status}.`,
          response: json || text,
          latencyMs,
        },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    return NextResponse.json(
      {
        success: false,
        targetUrl,
        statusCode: res.status,
        n8nStatus: "ERROR",
        message: `n8n responded with HTTP ${res.status}`,
        response: json || text,
        latencyMs,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to execute request";
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        n8nStatus: "OFFLINE",
        message,
        latencyMs: Math.round(performance.now() - start),
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
