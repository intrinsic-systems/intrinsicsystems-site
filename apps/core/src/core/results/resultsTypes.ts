export type DomainKey =
  | "strategy"
  | "governance"
  | "lifecycle"
  | "risk"
  | "information"
  | "performance"
  | "other";

export type DomainScore = {
  domain: DomainKey;
  label: string;
  answered: number;
  total: number;
  completionPct: number;     // 0–100
  maturityScore: number | null; // 0–100
  confidenceScore: number | null; // 0–100
};

export type RiskSignal =
  | { kind: "LOW_COMPLETION"; message: string }
  | { kind: "DOMAIN_IMBALANCE"; message: string }
  | { kind: "LOW_CONFIDENCE"; domain?: DomainKey; message: string };

export type ResultsSummary = {
  enterpriseMaturity: number | null;   // 0–100
  enterpriseConfidence: number | null; // 0–100
  answersCount: number;
  totalQuestions: number;
  completionPct: number;
  strongestDomain?: DomainScore;
  weakestDomain?: DomainScore;
  domainScores: DomainScore[];
  signals: RiskSignal[];
};

export type QuestionIndexItem = {
  code: string;
  domain: DomainKey;
  weight: number; // default 1
};