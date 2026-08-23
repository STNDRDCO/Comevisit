import { NextResponse } from "next/server";
import { getProjects } from "@/lib/attention-radar/projects";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    getProjects().map(({ id, name, markets, languages, topics, objective, voice, maxResults }) => ({
      id,
      name,
      markets,
      languages,
      topics,
      objective,
      voice,
      maxResults
    }))
  );
}
