import crypto from "node:crypto";
import type { RadarOpportunity, RadarProject, RadarResult } from "./types";

const XAI_RESPONSES_URL = "https://api.x.ai/v1/responses";

function extractOutputText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  const chunks: string[] = [];
  for (const item of payload?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("\n").trim();
}

function parseJsonArray(text: string): any[] {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.opportunities)) return parsed.opportunities;
  return [];
}

function fingerprint(value: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 20);
}

export async function runXSearch(project: RadarProject): Promise<RadarResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI_API_KEY is not configured");

  const maxResults = project.maxResults ?? 8;
  const today = new Date();
  const from = new Date(today.getTime() - 36 * 60 * 60 * 1000);
  const fromDate = from.toISOString().slice(0, 10);
  const toDate = today.toISOString().slice(0, 10);

  const prompt = [
    "You are an opportunity radar for a project trying to earn attention on X without spamming.",
    `Project: ${project.name}`,
    `Objective: ${project.objective}`,
    `Markets: ${(project.markets ?? []).join(", ") || "any"}`,
    `Languages: ${(project.languages ?? []).join(", ") || "any"}`,
    `Topics/signals: ${project.topics.join(" | ")}`,
    `Known relevant accounts: ${(project.accounts ?? []).join(", ") || "none"}`,
    `Voice for suggested copy: ${project.voice ?? "natural and concise"}`,
    "Search X broadly and semantically, not only exact keywords. Prioritize posts from the last hours that are active, specific, and actionable.",
    "Look for launches, fast-growing conversations, builders, founders, creators, businesses, venues, events, or people whose post creates a natural opening to reply, quote, follow, or riff with a new post.",
    "Do not fabricate metrics, people, URLs, or quotes. Only return items you actually found with X Search.",
    `Return at most ${maxResults} items as ONLY valid JSON, no markdown.`,
    "Each item must have: score (0-100), reason, action (reply|quote|post|follow|watch), sourceUrl (exact X post URL if available), author (handle), sourceText (short paraphrase, not a long quote), suggestedCopy (ready to use, concise), fingerprintSeed (stable string based on source URL + action).",
    "Score 80+ only for genuinely timely opportunities. Prefer fewer strong items over filler."
  ].join("\n");

  const response = await fetch(XAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.ATTENTION_RADAR_MODEL || "grok-4.6",
      input: [{ role: "user", content: prompt }],
      tools: [
        {
          type: "x_search",
          from_date: fromDate,
          to_date: toDate,
          ...(project.excludedAccounts?.length
            ? { excluded_x_handles: project.excludedAccounts }
            : {})
        }
      ]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`xAI error ${response.status}: ${body.slice(0, 800)}`);
  }

  const payload = await response.json();
  const rawText = extractOutputText(payload);
  let rawItems: any[] = [];
  try {
    rawItems = parseJsonArray(rawText);
  } catch {
    rawItems = [];
  }

  const opportunities: RadarOpportunity[] = rawItems
    .filter((item) => item && typeof item === "object")
    .slice(0, maxResults)
    .map((item) => ({
      score: Math.max(0, Math.min(100, Number(item.score) || 0)),
      reason: String(item.reason || ""),
      action: ["reply", "quote", "post", "follow", "watch"].includes(item.action)
        ? item.action
        : "watch",
      sourceUrl: item.sourceUrl ? String(item.sourceUrl) : undefined,
      author: item.author ? String(item.author) : undefined,
      sourceText: item.sourceText ? String(item.sourceText) : undefined,
      suggestedCopy: item.suggestedCopy ? String(item.suggestedCopy) : undefined,
      fingerprint: fingerprint(item.fingerprintSeed || item.sourceUrl || item)
    }));

  return {
    projectId: project.id,
    generatedAt: new Date().toISOString(),
    opportunities,
    rawText: opportunities.length ? undefined : rawText
  };
}
