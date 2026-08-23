import { NextRequest, NextResponse } from "next/server";
import { listInbox, setOpportunityStatus, urgencyFor } from "@/lib/attention-radar/storage";

export const runtime = "nodejs";

function authorized(request: NextRequest): boolean {
  const secret = process.env.ATTENTION_RADAR_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const projectId = request.nextUrl.searchParams.get("projectId") || "che-mira";
  const limit = Number(request.nextUrl.searchParams.get("limit") || 25);
  try {
    const rows = await listInbox(projectId, limit);
    return NextResponse.json({
      projectId,
      count: rows.length,
      opportunities: rows.map((row: any) => ({
        ...row,
        urgency: urgencyFor({ score: Number(row.score) } as any)
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: "inbox_failed", message: error instanceof Error ? error.message : "unknown error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const id = String(body?.id || "");
  const status = String(body?.status || "");
  if (!id || !["new", "seen", "acted", "ignored"].includes(status)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  try {
    const rows = await setOpportunityStatus(id, status as "new" | "seen" | "acted" | "ignored");
    return NextResponse.json({ ok: true, opportunity: rows[0] ?? null });
  } catch (error) {
    return NextResponse.json({ error: "status_update_failed", message: error instanceof Error ? error.message : "unknown error" }, { status: 500 });
  }
}
