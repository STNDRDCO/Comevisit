import crypto from "node:crypto";
import type { RadarOpportunity, RadarProject, RadarResult } from "./types";

function fp(seed: string) {
  return crypto.createHash("sha256").update(seed).digest("hex").slice(0, 20);
}

export function runMockRadar(project: RadarProject): RadarResult {
  const samples: RadarOpportunity[] = [
    {
      score: 96,
      reason: "Fresh local launch in the paid-ranking/attention wave with a natural builder-to-builder reply opening.",
      action: "reply",
      sourceUrl: "https://x.com/mock_builder/status/1001",
      author: "mock_builder",
      sourceText: "launched a paid visibility ranking for Argentine projects",
      suggestedCopy: "cada día aparece una mutación nueva de esto. banco fuerte que internet argentina se haya puesto a experimentar así.",
      fingerprint: fp("https://x.com/mock_builder/status/1001|reply"),
      signalFamily: "attention_wave",
      audienceArchetype: "people building paid rankings, directories, discovery products or attention experiments"
    },
    {
      score: 89,
      reason: "A Buenos Aires venue announced a one-night-only event, creating timely supply of attention and relationship value.",
      action: "reply",
      sourceUrl: "https://x.com/mock_venue/status/1002",
      author: "mock_venue",
      sourceText: "announced a one-night-only pop-up tonight in Palermo",
      suggestedCopy: "ojo acá entonces. estos son los planes que desaparecen si te enterás mañana.",
      fingerprint: fp("https://x.com/mock_venue/status/1002|reply"),
      signalFamily: "events_now",
      audienceArchetype: "event organizers, promoters, ticketing platforms, clubs and cultural venues"
    },
    {
      score: 84,
      reason: "Explicit local discovery demand: a user is actively asking what to do tonight in Buenos Aires.",
      action: "reply",
      sourceUrl: "https://x.com/mock_user/status/1003",
      author: "mock_user",
      sourceText: "asked for something interesting to do tonight in Buenos Aires",
      suggestedCopy: "esa pregunta es básicamente nuestra obsesión. qué merece atención hoy, no la semana que viene.",
      fingerprint: fp("https://x.com/mock_user/status/1003|reply"),
      signalFamily: "explicit_discovery_intent",
      audienceArchetype: "people publicly asking what to do, where to eat, where to go or what is happening"
    },
    {
      score: 72,
      reason: "Relevant curator account, but the current post has no strong opening. Better to watch than force a reply.",
      action: "watch",
      sourceUrl: "https://x.com/mock_curator/status/1004",
      author: "mock_curator",
      sourceText: "shared a weekly roundup of Buenos Aires openings",
      suggestedCopy: undefined,
      fingerprint: fp("https://x.com/mock_curator/status/1004|watch"),
      signalFamily: "curator_hubs",
      audienceArchetype: "accounts that repeatedly amplify other local products, places or events"
    }
  ];

  return {
    projectId: project.id,
    generatedAt: new Date().toISOString(),
    opportunities: samples.slice(0, project.maxResults ?? 8)
  };
}
