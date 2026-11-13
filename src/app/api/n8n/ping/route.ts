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

/**
 * Server-side Netlify API route to ping n8n webhooks without browser CORS issues.
 * Sends a lightweight POST request with { ping: true } to the target n8n webhook URL.
 * If n8n returns HTTP 200 (like {"status":"ignored"}), 404, or 405, it is marked as ONLINE / CONNECTED.
 */
async function pingN8nWebhook(targetUrl: string) {
  const start = performance.now();
  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "HybridOps-CommandCenter/2.4 (Netlify-Serverless-Ping)",
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
      // Plain text response (e.g. "Workflow activated" or ignored)
    }

    // HTTP 200 (e.g. {"status":"ignored"}), HTTP 404, or HTTP 405 indicate the server is reached
    if (res.ok || res.status === 404 || res.status === 405) {
      return NextResponse.json(
        {
          success: true,
          targetUrl,
          statusCode: res.status,
          n8nStatus: "CONNECTED",
          statusMessage: "ONLINE / CONNECTED",
          message:
            res.status === 200
              ? "n8n Cloud Webhook is LIVE and actively responding (HTTP 200)."
              : `n8n Webhook server reached and responded with HTTP ${res.status}. Server is ONLINE and CONNECTED.`,
          hint:
            res.status === 404
              ? "Webhook endpoint reached! Note: If testing in n8n, click 'Listen for test event' or activate the workflow toggle."
              : undefined,
          response: json || text,
          latencyMs,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        targetUrl,
        statusCode: res.status,
        n8nStatus: "ERROR",
        statusMessage: `HTTP ${res.status}`,
        message: `n8n responded with HTTP ${res.status}`,
        response: json || text,
        latencyMs,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Connection failed";
    return NextResponse.json(
      {
        success: false,
        targetUrl,
        statusCode: 500,
        n8nStatus: "OFFLINE",
        statusMessage: "OFFLINE / UNREACHABLE",
        message: `Failed to reach n8n webhook: ${message}`,
        latencyMs: Math.round(performance.now() - start),
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetUrl = body.webhookUrl || body.url || DEFAULT_N8N_URL;
    return await pingN8nWebhook(targetUrl);
  } catch {
    return await pingN8nWebhook(DEFAULT_N8N_URL);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url") || searchParams.get("webhookUrl") || DEFAULT_N8N_URL;
  return await pingN8nWebhook(targetUrl);
}

