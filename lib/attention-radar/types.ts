export type RadarProject = {
  id: string;
  name: string;
  markets?: string[];
  languages?: string[];
  topics: string[];
  accounts?: string[];
  excludedAccounts?: string[];
  objective: string;
  voice?: string;
  maxResults?: number;
};

export type RadarOpportunity = {
  score: number;
  reason: string;
  action: "reply" | "quote" | "post" | "follow" | "watch";
  sourceUrl?: string;
  author?: string;
  sourceText?: string;
  suggestedCopy?: string;
  fingerprint: string;
};

export type RadarResult = {
  projectId: string;
  generatedAt: string;
  opportunities: RadarOpportunity[];
  rawText?: string;
};
