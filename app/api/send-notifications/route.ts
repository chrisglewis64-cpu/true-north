import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

function extractBearerToken(header: string | null): string {
  if (!header?.startsWith("Bearer ")) {
    return "";
  }
  return header.slice("Bearer ".length).trim();
}

function tokensMatch(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length === 0 || expectedBuffer.length === 0) {
    return false;
  }

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

function getSupabaseFunctionsBaseUrl(): string | null {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();

  if (!url) {
    return null;
  }

  return `${url.replace(/\/$/, "")}/functions/v1`;
}

/**
 * Secure cron entry point.
 * Verifies a server-only Bearer token, then invokes the Edge Function.
 * Never exposes service-role credentials to the client.
 */
export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim() ?? "";
  const token = extractBearerToken(request.headers.get("authorization"));

  if (!cronSecret || !tokensMatch(token, cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const functionsBase = getSupabaseFunctionsBaseUrl();
  if (!functionsBase) {
    console.error("[api/send-notifications] Missing Supabase URL");
    return NextResponse.json(
      { error: "Notification service is not configured." },
      { status: 500 }
    );
  }

  try {
    const upstream = await fetch(`${functionsBase}/send-notifications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error(
        "[api/send-notifications] Edge Function failed:",
        upstream.status,
        detail
      );
      return NextResponse.json(
        { error: "Failed to send notifications." },
        { status: 502 }
      );
    }

    let payload: unknown = { ok: true };
    try {
      payload = await upstream.json();
    } catch {
      // Upstream may return an empty body; still treat as success.
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("[api/send-notifications] Invoke failed:", error);
    return NextResponse.json(
      { error: "Failed to send notifications." },
      { status: 502 }
    );
  }
}
