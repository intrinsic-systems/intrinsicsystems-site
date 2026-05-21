import type {
  CoreAnswer,
  EvidenceItem,
  ProbeQuestion,
  TriggerCondition,
  ConfidenceLevel,
} from "./coreModel";

export type CapabilityResponseState = {
  capabilityId: string;

  coreAnswers: CoreAnswer[];
  probesTriggered: ProbeQuestion[];
  evidenceSubmitted: EvidenceItem[];

  score: number;
  confidence: ConfidenceLevel;
  triggers: TriggerCondition[];
};

export type EnterpriseResponseState = {
  capabilities: CapabilityResponseState[];

  enterpriseScore?: number;
  enterpriseConfidence?: number;
};