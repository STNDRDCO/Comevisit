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

function compactRecord(record?: Record<string, unknown>): string {
  if (!record) return "none";
  return Object.entries(record)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
    .join(" | ");
}

export async function runXSearch(project: RadarProject): Promise<RadarResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI_API_KEY is not configured");

  const maxResults = project.maxResults ?? 8;
  const now = new Date();
  const from = new Date(now.getTime() - 36 * 60 * 60 * 1000);
  const fromDate = from.toISOString().slice(0, 10);
  const toDate = now.toISOString().slice(0, 10);

  const prompt = [
    "You are a real-time social opportunity radar. Your job is to listen very broadly and intervene selectively.",
    `Project: ${project.name}`,
    `Mission: ${project.mission || project.objective}`,
    `Objective: ${project.objective}`,
    `Markets: ${(project.markets ?? []).join(", ") || "any"}`,
    `Languages: ${(project.languages ?? []).join(", ") || "any"}`,
    `Core topics: ${project.topics.join(" | ")}`,
    `Known relevant accounts: ${(project.accounts ?? []).join(", ") || "none"}`,
    `Audience archetypes: ${(project.audienceArchetypes ?? []).join(" | ") || "none"}`,
    `Signal families: ${compactRecord(project.signalFamilies)}`,
    `Positive signals: ${(project.positiveSignals ?? []).join(" | ") || "none"}`,
    `Negative signals: ${(project.negativeSignals ?? []).join(" | ") || "none"}`,
    `Action rules: ${compactRecord(project.actionRules)}`,
    `Scoring weights: ${compactRecord(project.scoringWeights)}`,
    `Guardrails: ${(project.guardrails ?? []).join(" | ") || "none"}`,
    `Voice for suggested copy: ${project.voice ?? "natural and concise"}`,
    "Search X broadly and semantically. Do not limit yourself to exact keywords; discover synonyms, adjacent conversations, accounts, products, venues, communities and emerging phrasing.",
    "Listening breadth should be high. Search across builders, businesses, venues, events, brands, creators, media, curators and ordinary users when their post creates a real attention/discovery opportunity.",
    "Prioritize posts from the last few hours and conversations that are still alive. Timeliness matters more than follower count.",
    "Look for explicit launches, announcements, openings, events, promotions, recommendations, discovery requests, cultural moments, fast-growing local chatter, attention-market experiments and connector accounts amplifying others.",
    "A good opportunity is one where the project can contribute naturally. Do not force brand mentions. Many suggested replies should be good even without naming the project.",
    "Do not fabricate metrics, people, URLs, event details, relationships, quotes or claims. Only return items you actually found with X Search.",
    `Return at most ${maxResults} items as ONLY valid JSON, no markdown. Prefer fewer strong items to filler, but search widely before deciding there are few.` ,
    "Each item must have: score (0-100), reason, action (reply|quote|post|follow|watch), sourceUrl (exact X post URL if available), author (handle), sourceText (short paraphrase, not a long quote), suggestedCopy (ready to use, concise), signalFamily, audienceArchetype, fingerprintSeed (stable string based on source URL + action).",
    "Score 90+ only for exceptional, time-sensitive, highly natural opportunities. 80+ means act soon. 65-79 means useful but non-urgent. Below 65 generally omit.",
    "For reply opportunities, optimize for being an interesting participant in the thread rather than a marketer. For quote/post opportunities, provide a distinct angle rather than a paraphrase."
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
      signalFamily: item.signalFamily ? String(item.signalFamily) : undefined,
      audienceArchetype: item.audienceArchetype ? String(item.audienceArchetype) : undefined,
      fingerprint: fingerprint(item.fingerprintSeed || item.sourceUrl || item)
    }))
    .filter((item) => item.score >= 65)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return {
    projectId: project.id,
    generatedAt: new Date().toISOString(),
    opportunities,
    rawText: opportunities.length ? undefined : rawText
  };
}
