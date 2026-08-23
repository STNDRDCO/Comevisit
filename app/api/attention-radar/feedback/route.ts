import { NextRequest, NextResponse } from "next/server";
import { recordFeedback, setOpportunityStatus } from "@/lib/attention-radar/storage";

export const runtime = "nodejs";

function authorized(request: NextRequest): boolean {
  const secret = process.env.ATTENTION_RADAR_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const opportunityId = String(body?.opportunityId || "");
  const projectId = String(body?.projectId || "che-mira");
  const feedbackType = String(body?.feedbackType || "");
  const allowed = ["used", "ignored", "edited", "performed_well", "performed_poorly"];
  if (!opportunityId || !allowed.includes(feedbackType)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  try {
    const feedback = await recordFeedback({
      opportunityId,
      projectId,
      feedbackType: feedbackType as "used" | "ignored" | "edited" | "performed_well" | "performed_poorly",
      actionTaken: body?.actionTaken ? String(body.actionTaken) : undefined,
      finalCopy: body?.finalCopy ? String(body.finalCopy) : undefined,
      metrics: body?.metrics && typeof body.metrics === "object" ? body.metrics : undefined
    });

    if (feedbackType === "ignored") await setOpportunityStatus(opportunityId, "ignored");
    if (["used", "edited", "performed_well", "performed_poorly"].includes(feedbackType)) {
      await setOpportunityStatus(opportunityId, "acted");
    }

    return NextResponse.json({ ok: true, feedback: feedback[0] ?? null });
  } catch (error) {
    return NextResponse.json({ error: "feedback_failed", message: error instanceof Error ? error.message : "unknown error" }, { status: 500 });
  }
}
