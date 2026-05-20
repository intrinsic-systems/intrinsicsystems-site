export type CapabilityWeight = "low" | "medium" | "high";

export type ConfidenceLevel = "low" | "medium" | "high";

export type ConfidenceImpact =
  | "reduce"
  | "neutral"
  | "increase";

export type EvidenceStrength =
  | "weak"
  | "partial"
  | "strong";

export type TriggerType =
  | "low-score"
  | "high-risk"
  | "low-confidence"
  | "missing-evidence"
  | "conflicting-response";

export type EvidenceItem = {
  id: string;
  type: string;
  label: string;
  provided: boolean;
  strength?: EvidenceStrength;
  note?: string;
};

export type ProbeQuestion = {
  id: string;
  text: string;
  impact?: ConfidenceImpact;
};

export type CoreQuestion = {
  id: string;
  text: string;
  capabilityId: string;
  weight?: CapabilityWeight;
  probes?: ProbeQuestion[];
  evidence?: EvidenceItem[];
  triggerRules?: TriggerType[];
};

export type CoreAnswer = {
  questionId: string;
  label: string;
  score: number;

  confidence?: ConfidenceLevel;

  evidence?: EvidenceItem[];

  probeResponses?: {
    probeId: string;
    response: string;
    impact?: ConfidenceImpact;
  }[];

  note?: string;

  updatedAt?: string;
};