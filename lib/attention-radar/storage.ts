import type { RadarOpportunity, RadarResult } from "./types";

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

async function rest(path: string, init: RequestInit = {}) {
  const cfg = config();
  if (!cfg) throw new Error("Supabase persistence is not configured");
  const headers = new Headers(init.headers);
  headers.set("apikey", cfg.key);
  headers.set("Authorization", `Bearer ${cfg.key}`);
  headers.set("Content-Type", "application/json");
  return fetch(`${cfg.url}/rest/v1/${path}`, { ...init, headers });
}

export function persistenceConfigured(): boolean {
  return Boolean(config());
}

export async function saveRadarResult(result: RadarResult, source = "xai") {
  if (!persistenceConfigured()) return { persisted: false, newCount: 0 };

  const runStart = await rest("attention_radar_runs", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      project_id: result.projectId,
      source,
      status: "running",
      discovered_count: result.opportunities.length
    })
  });
  if (!runStart.ok) throw new Error(`Could not create radar run: ${await runStart.text()}`);
  const [run] = await runStart.json();

  let newCount = 0;
  try {
    for (const opportunity of result.opportunities) {
      const existingRes = await rest(
        `attention_radar_opportunities?project_id=eq.${encodeURIComponent(result.projectId)}&fingerprint=eq.${encodeURIComponent(opportunity.fingerprint)}&select=id,status`,
        { method: "GET" }
      );
      if (!existingRes.ok) throw new Error(await existingRes.text());
      const existing = await existingRes.json();

      const row = {
        project_id: result.projectId,
        fingerprint: opportunity.fingerprint,
        source_url: opportunity.sourceUrl ?? null,
        author: opportunity.author ?? null,
        source_text: opportunity.sourceText ?? null,
        signal_family: opportunity.signalFamily ?? null,
        audience_archetype: opportunity.audienceArchetype ?? null,
        score: opportunity.score,
        reason: opportunity.reason,
        action: opportunity.action,
        suggested_copy: opportunity.suggestedCopy ?? null,
        last_seen_at: new Date().toISOString()
      };

      if (existing.length) {
        const updateRes = await rest(
          `attention_radar_opportunities?id=eq.${encodeURIComponent(existing[0].id)}`,
          { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row) }
        );
        if (!updateRes.ok) throw new Error(await updateRes.text());
      } else {
        const insertRes = await rest("attention_radar_opportunities", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ ...row, status: "new" })
        });
        if (!insertRes.ok) throw new Error(await insertRes.text());
        newCount += 1;
      }
    }

    await rest(`attention_radar_runs?id=eq.${encodeURIComponent(run.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        status: "ok",
        finished_at: new Date().toISOString(),
        new_count: newCount
      })
    });
    return { persisted: true, newCount, runId: run.id };
  } catch (error) {
    await rest(`attention_radar_runs?id=eq.${encodeURIComponent(run.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        status: "error",
        finished_at: new Date().toISOString(),
        error: error instanceof Error ? error.message.slice(0, 1000) : "unknown error"
      })
    }).catch(() => undefined);
    throw error;
  }
}

export async function listInbox(projectId: string, limit = 25) {
  if (!persistenceConfigured()) return [];
  const res = await rest(
    `attention_radar_opportunities?project_id=eq.${encodeURIComponent(projectId)}&status=in.(new,seen)&order=score.desc,last_seen_at.desc&limit=${Math.max(1, Math.min(limit, 100))}`,
    { method: "GET" }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function setOpportunityStatus(id: string, status: "new" | "seen" | "acted" | "ignored") {
  if (!persistenceConfigured()) throw new Error("Supabase persistence is not configured");
  const body: Record<string, unknown> = { status };
  if (status === "acted") body.acted_at = new Date().toISOString();
  const res = await rest(`attention_radar_opportunities?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function recordFeedback(input: {
  opportunityId: string;
  projectId: string;
  feedbackType: "used" | "ignored" | "edited" | "performed_well" | "performed_poorly";
  actionTaken?: string;
  finalCopy?: string;
  metrics?: Record<string, unknown>;
}) {
  if (!persistenceConfigured()) throw new Error("Supabase persistence is not configured");
  const res = await rest("attention_radar_feedback", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      opportunity_id: input.opportunityId,
      project_id: input.projectId,
      feedback_type: input.feedbackType,
      action_taken: input.actionTaken ?? null,
      final_copy: input.finalCopy ?? null,
      metrics: input.metrics ?? {}
    })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function urgencyFor(opportunity: RadarOpportunity): "now" | "today" | "watch" {
  if (opportunity.score >= 90) return "now";
  if (opportunity.score >= 78) return "today";
  return "watch";
}
