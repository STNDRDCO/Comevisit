import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/attention-radar/projects";
import { runXSearch } from "@/lib/attention-radar/xai";

export const runtime = "nodejs";
export const maxDuration = 60;

const TOKEN = "F4Q2bX035qcLEqMVu68zeDo8m5o3xvwx";

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("token") !== TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const project = getProject("che-mira");
  if (!project) return NextResponse.json({ error: "project_not_found" }, { status: 404 });
  try {
    const result = await runXSearch(project);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "radar_failed", message: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}
