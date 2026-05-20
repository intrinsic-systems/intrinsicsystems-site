export type CapabilityWeight = "low" | "medium" | "high" | "critical";

export type QuestionType =
  | "core"
  | "probe"
  | "validation"
  | "evidence"
  | "benchmark";

export type TriggerCondition =
  | "low_score"
  | "medium_score"
  | "unclear_accountability"
  | "high_risk_capability"
  | "high_score_no_evidence"
  | "low_confidence"
  | "conflicting_responses"
  | "critical_domain"
  | "low-score"
  | "missing-evidence"
  | "low-confidence";

export type TriggerType = TriggerCondition;

export type CoreAnswer = {
  questionId: string;
  response: string;
  score?: number;
  confidence?: ConfidenceLevel;
  evidence?: EvidenceItem[];
  probeResponses?: ProbeQuestion[];
};

export type EvidenceStrength = "weak" | "partial" | "strong";

export type ConfidenceLevel = "low" | "medium" | "high";

export type ConfidenceImpact = "reduce" | "neutral" | "increase";

export type CoreQuestion = {
  id: string;
  text: string;

  type?: QuestionType;

  guidance?: string;
  helpText?: string;

  weight?: number;

  tags?: string[];
};

export type ProbeQuestion = {
  id: string;
  text: string;
  trigger?: TriggerCondition[];
  confidenceImpact?: ConfidenceImpact;
};

export type EvidenceItem = {
  id: string;
  label: string;
  type?: string;
  strength?: EvidenceStrength;
  provided?: boolean;
  required?: boolean;
  note?: string;
};

export type AdaptiveRules = {
  enabled: boolean;
  trigger?: TriggerCondition[];
  minimumConfidence?: number;
  maxProbeQuestions?: number;
};

export type BenchmarkReference = {
  sector?: string;
  region?: string;
  assetClass?: string;
  targetPct?: number;
  benchmarkPct?: number;
};

export type AiModelHooks = {
  summarise?: boolean;
  detectConflicts?: boolean;
  recommendEvidence?: boolean;
  generateImprovementActions?: boolean;
};

export type CoreCapability = {
  id: string;
  label: string;
  name?: string;
  description?: string;

  domainId?: string;
  elementId?: string;

  weight: CapabilityWeight;
  trigger?: TriggerCondition[];
  triggers?: TriggerCondition[];

  coreQuestions: CoreQuestion[];
  questions?: CoreQuestion[];

  probes?: ProbeQuestion[];
  evidence?: Array<string | EvidenceItem>;

  confidence?: {
    defaultLevel?: ConfidenceLevel;
    evidenceRequired?: boolean;
    minimumEvidenceStrength?: EvidenceStrength;
  };

  adaptive?: AdaptiveRules;
  benchmark?: BenchmarkReference;
  ai?: AiModelHooks;

  dependencies?: string[];
  tags?: string[];
};

export type CoreElement = {
  id: string;
  label: string;
  description?: string;
  capabilities: CoreCapability[];
};

export type CoreDomain = {
  id: string;
  label: string;
  description?: string;
  elements: CoreElement[];
};

export type CoreCapabilityModel = CoreDomain;