import "server-only";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_ENGINE_URL = "http://127.0.0.1:8000";

function getEngineUrl() {
  return (process.env.PYTHON_ENGINE_URL || DEFAULT_ENGINE_URL).replace(/\/+$/, "");
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    const response = await fetch(`${getEngineUrl()}/analyze`, {
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
    return NextResponse.json(
      {
        ok: false,
        error: timedOut
          ? "Python engine request timed out after 30 seconds."
          : error?.message || "Unable to reach Python engine.",
      },
      { status: timedOut ? 504 : 502 }
    );
  }
}
