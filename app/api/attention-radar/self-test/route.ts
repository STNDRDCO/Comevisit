import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/attention-radar/projects";
import { runMockRadar } from "@/lib/attention-radar/mock";
import { persistenceConfigured, saveRadarResult, urgencyFor } from "@/lib/attention-radar/storage";

export const runtime = "nodejs";

function authorized(request: NextRequest): boolean {
  const secret = process.env.ATTENTION_RADAR_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const projectId = String(body?.projectId || "che-mira");
  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "project_not_found", projectId }, { status: 404 });

  const result = runMockRadar(project);
  const persistence = await saveRadarResult(result, "mock").catch((error) => ({
    persisted: false,
    newCount: 0,
    error: error instanceof Error ? error.message : "unknown error"
  }));

  return NextResponse.json({
    ok: true,
    mode: "mock",
    persistenceConfigured: persistenceConfigured(),
    persistence,
    result: {
      ...result,
      opportunities: result.opportunities.map((item) => ({ ...item, urgency: urgencyFor(item) }))
    }
  });
}
