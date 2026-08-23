import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/attention-radar/projects";
import { runXSearch } from "@/lib/attention-radar/xai";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorized(request: NextRequest): boolean {
  const secret = process.env.ATTENTION_RADAR_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const projectId = String(body?.projectId || "che-mira");
  const project = getProject(projectId);

  if (!project) {
    return NextResponse.json({ error: "project_not_found", projectId }, { status: 404 });
  }

  try {
    const result = await runXSearch(project);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "radar_failed",
        message: error instanceof Error ? error.message : "unknown error"
      },
      { status: 500 }
    );
  }
}
