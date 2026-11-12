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
      body: JSON.stringify({
        ping: true,
        source: "hybrid-ops-command-center",
        timestamp: new Date().toISOString(),
      }),
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

    if (res.status === 404 && text.includes("not registered")) {
      return NextResponse.json(
        {
          success: false,
          targetUrl,
          statusCode: 404,
          n8nStatus: "INACTIVE",
          message: "n8n Cloud Webhook reached, but the workflow is currently INACTIVE in n8n.",
          hint: "In your n8n workflow editor, click the toggle switch in the top-right to activate the workflow (or switch to the Test URL).",
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
    const payload = body.payload || body;

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
          message: "Payload successfully dispatched to n8n Cloud Automation.",
          response: json || text,
          latencyMs,
        },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    if (res.status === 404 && text.includes("not registered")) {
      return NextResponse.json(
        {
          success: false,
          targetUrl,
          statusCode: 404,
          n8nStatus: "INACTIVE",
          message: "n8n Webhook reached, but the workflow is INACTIVE in n8n.",
          hint: "In your n8n workflow editor, click the toggle switch in the top-right to activate the workflow (or use the test webhook URL).",
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
