export type RadarAction = "reply" | "quote" | "post" | "follow" | "watch";

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
  mission?: string;
  audienceArchetypes?: string[];
  signalFamilies?: Record<string, string[]>;
  actionRules?: Record<string, string>;
  scoringWeights?: Record<string, number>;
  positiveSignals?: string[];
  negativeSignals?: string[];
  guardrails?: string[];
};

export type RadarOpportunity = {
  score: number;
  reason: string;
  action: RadarAction;
  sourceUrl?: string;
  author?: string;
  sourceText?: string;
  suggestedCopy?: string;
  fingerprint: string;
  signalFamily?: string;
  audienceArchetype?: string;
};

export type RadarResult = {
  projectId: string;
  generatedAt: string;
  opportunities: RadarOpportunity[];
  rawText?: string;
};
