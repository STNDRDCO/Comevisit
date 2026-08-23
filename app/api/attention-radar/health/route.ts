import { NextResponse } from "next/server";
import { getProjects } from "@/lib/attention-radar/projects";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "attention-radar",
    xaiConfigured: Boolean(process.env.XAI_API_KEY),
    projects: getProjects().map((p) => ({ id: p.id, name: p.name }))
  });
}
