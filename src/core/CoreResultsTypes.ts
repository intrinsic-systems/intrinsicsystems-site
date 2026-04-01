export type CoreQuestionResult = {
  id: string;
  text: string;
  score: number; // 0–5 scale
  confidence?: number; // 0–1
};

export type CoreCapabilityResult = {
  id: string;
  name: string;
  domain: string;
  group?: string;
  description?: string;
  score: number; // 0–5 scale
  confidence?: number; // 0–1
  questions: CoreQuestionResult[];
};

export type CoreDomainScore = {
  current: number; // 0–5 scale
  benchmark?: number;
  target?: number;
  variance?: number;
  confidence?: number; // 0–1
};

export type CoreResults = {
  maturityPct: number; // 0–100
  confidencePct: number; // 0–100
  confidence?: number; // optional 0–1 convenience form
  capabilities: CoreCapabilityResult[];
  domainScores: Record<string, CoreDomainScore>;
};