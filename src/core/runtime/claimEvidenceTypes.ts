import type {
  RuntimeConfidenceArchitecture,
  RuntimeNextAction,
} from "./runtimeConfidenceArchitecture";

export const RUNTIME_CLAIM_SCHEMA_VERSION = 1;
export const RUNTIME_CLAIM_POLICY_VERSION = "runtime-confidence-v1";

export type ClaimDecisionSnapshot = RuntimeConfidenceArchitecture & {
  id: string;
  claimId: string;
  reason: string;
  evidenceIds: string[];
  recordedAt: string;
  previousSnapshotId?: string;
  schemaVersion: number;
  policyVersion: string;
};

export type RuntimeClaim = {
  id: string;
  capabilityId: string;
  statement: string;
  applicability: string;
  assuranceSignificance: "standard" | "material" | "critical";
  currentDecisionId: string;
  decisionHistory: ClaimDecisionSnapshot[];
  createdAt: string;
  updatedAt: string;
};

export type EvidenceVerificationStatus =
  | "submitted"
  | "verified"
  | "rejected"
  | "expired";

export type RuntimeEvidenceRecord = {
  id: string;
  title: string;
  evidenceType: string;
  source: string;
  reference: string;
  verificationStatus: EvidenceVerificationStatus;
  collectedAt: string;
  reviewedAt?: string;
  reviewDueAt?: string;
  authorityNotes: string;
};

export type ClaimEvidenceLink = {
  id: string;
  claimId: string;
  evidenceId: string;
  relationship: "supports" | "challenges";
  materiality: "supporting" | "material" | "decisive";
  condition: "current" | "contested" | "stale" | "superseded";
  linkedAt: string;
};

export type EvidenceWorkStatus =
  | "requested"
  | "in-progress"
  | "submitted"
  | "verified"
  | "rejected"
  | "expired";

export type EvidenceWorkItem = {
  id: string;
  claimId: string;
  title: string;
  reason: string;
  owner: string;
  status: EvidenceWorkStatus;
  requestedForAction: RuntimeNextAction;
  dueAt?: string;
  evidenceId?: string;
  createdAt: string;
  updatedAt: string;
};

export type RuntimeAuditEvent = {
  id: string;
  entityType: "claim" | "evidence" | "work-item" | "store";
  entityId: string;
  action: string;
  summary: string;
  previousValue?: string;
  nextValue?: string;
  recordedAt: string;
};

export type RuntimeClaimStore = {
  schemaVersion: number;
  claims: RuntimeClaim[];
  evidenceRecords: RuntimeEvidenceRecord[];
  links: ClaimEvidenceLink[];
  workItems: EvidenceWorkItem[];
  auditEvents: RuntimeAuditEvent[];
  lastSavedAt: string;
  recoveryNotice?: string;
};

export type RuntimeClaimRepository = {
  load(): RuntimeClaimStore;
  save(store: RuntimeClaimStore): void;
};
