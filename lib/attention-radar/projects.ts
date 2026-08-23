import type { RadarProject } from "./types";

const defaults: RadarProject[] = [
  {
    id: "che-mira",
    name: "Che Mira",
    markets: ["Argentina", "Buenos Aires"],
    languages: ["es", "en"],
    topics: [
      "rankings pagos",
      "paid rankings",
      "Outbid.lol",
      "Lugarcito.online",
      "Subite.pro",
      "argentino.dev",
      "vibe coding",
      "meme apps",
      "attention markets",
      "AI builders Argentina",
      "startups Argentina",
      "Buenos Aires restaurants",
      "Buenos Aires bars",
      "Buenos Aires events",
      "Buenos Aires venues",
      "paid placement",
      "local discovery"
    ],
    accounts: ["agustinhooks_", "Cypher1984"],
    objective: "Find fresh conversations where the project can earn attention through useful, witty participation rather than spam.",
    voice: "lowercase, sharp, playful, Argentine, non-corporate, concise",
    maxResults: 8
  }
];

export function getProjects(): RadarProject[] {
  const raw = process.env.ATTENTION_RADAR_PROJECTS_JSON;
  if (!raw) return defaults;

  try {
    const parsed = JSON.parse(raw) as RadarProject[];
    return Array.isArray(parsed) && parsed.length ? parsed : defaults;
  } catch {
    return defaults;
  }
}

export function getProject(id: string): RadarProject | undefined {
  return getProjects().find((project) => project.id === id);
}
