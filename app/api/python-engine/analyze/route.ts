import "server-only";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_ENGINE_URL = "http://127.0.0.1:8000";

function getEngineUrl() {
  return (process.env.PYTHON_ENGINE_URL || DEFAULT_ENGINE_URL).replace(/\/+$/, "");
}

function isLocalhostUrl(url: string) {
  return /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?($|\/)/i.test(url);
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const engineUrl = getEngineUrl();

    if (process.env.VERCEL && !process.env.PYTHON_ENGINE_URL) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "PYTHON_ENGINE_URL is not set on Vercel. Deploy the Python engine to a public URL, then set PYTHON_ENGINE_URL in the trader project environment variables.",
        },
        { status: 500 }
      );
    }

    if (process.env.VERCEL && isLocalhostUrl(engineUrl)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "PYTHON_ENGINE_URL points to localhost, which Vercel cannot reach from production. Use the public HTTPS URL of the deployed Python engine.",
        },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    const response = await fetch(`${engineUrl}/analyze`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const text = await response.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { error: text || "Python engine returned a non-JSON response." };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: typeof json === "object" && json && "error" in json ? String((json as any).error) : "Python engine request failed.",
          status: response.status,
          details: json,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true, engineUrlConfigured: Boolean(process.env.PYTHON_ENGINE_URL), result: json });
  } catch (error: any) {
    const timedOut = error?.name === "AbortError";
    const engineUrl = getEngineUrl();
    return NextResponse.json(
      {
        ok: false,
        error: timedOut
          ? "Python engine request timed out after 30 seconds."
          : `Unable to reach Python engine at ${engineUrl}. ${error?.message || "Network request failed."}`,
      },
      { status: timedOut ? 504 : 502 }
    );
  }
}
