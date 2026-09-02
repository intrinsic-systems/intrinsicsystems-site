import { applyRuntimeMutation } from "./runtimeEngine";
import {
  addControlConditionToClaims,
  requestEvidenceForClaim,
  submitEvidenceForWorkItem,
  synchroniseClaimsWithRuntime,
} from "./runtimeClaimOrchestration";
import { createEmptyRuntimeClaimStore } from "./runtimeClaimStore";

import type {
  EnterpriseRuntimeState,
  RuntimeAnswerMutation,
} from "./runtimeEngine";
import type {
  ClaimEvidenceLink,
  RuntimeClaimStore,
  RuntimeEvidenceRecord,
} from "./claimEvidenceTypes";

export const FOUNDER_ASSESSMENT_SCENARIO_ID =
  "northstar-handover-2026";
export const FOUNDER_ASSESSMENT_STORAGE_KEY =
  "oasis.runtime.claim-evidence.assessment.v1";

export const founderAssessmentScenario = {
  organisation: "Northstar Regional Utilities",
  situation:
    "A regional electricity utility is transferring a newly upgraded substation into operations while introducing a new asset-management platform and revised governance model.",
  assessmentInputs: [
    { capabilityId: "gov-role-clarity", answerId: "northstar-role-clarity", score: 58, confidence: 0.62, hasEvidence: true },
    { capabilityId: "gov-decision-rights", answerId: "northstar-decision-rights", score: 84, confidence: 0.9, hasEvidence: true },
    { capabilityId: "gov-escalation-governance", answerId: "northstar-escalation", score: 46, confidence: 0.42, hasEvidence: false },
    { capabilityId: "risk-ownership", answerId: "northstar-risk-ownership", score: 31, confidence: 0.28, hasEvidence: false },
    { capabilityId: "lifecycle-planning", answerId: "northstar-lifecycle", score: 79, confidence: 0.88, hasEvidence: true },
    { capabilityId: "info-asset-information-strategy", answerId: "northstar-information", score: 76, confidence: 0.86, hasEvidence: true },
  ] satisfies RuntimeAnswerMutation[],
} as const;

function buildAssessmentRuntime(): EnterpriseRuntimeState {
  return founderAssessmentScenario.assessmentInputs.reduce(
    (runtime, mutation) => applyRuntimeMutation(runtime, mutation),
    { capabilities: {}, enterpriseScore: 0, triggers: [] } as EnterpriseRuntimeState,
  );
}

export function buildFounderIntegratedAssessmentScenario(): {
  runtime: EnterpriseRuntimeState;
  store: RuntimeClaimStore;
} {
  const baseTime = "2026-09-02T02:00:00.000Z";
  const runtime = buildAssessmentRuntime();
  let store = synchroniseClaimsWithRuntime(
    createEmptyRuntimeClaimStore(baseTime),
    runtime.capabilities,
    baseTime,
  );

  store = addControlConditionToClaims(store, ["claim-gov-role-clarity"], "contested", "2026-09-02T02:01:00.000Z");
  store = addControlConditionToClaims(store, ["claim-lifecycle-planning"], "stale", "2026-09-02T02:02:00.000Z");
  store = addControlConditionToClaims(store, ["claim-info-asset-information-strategy"], "material-change", "2026-09-02T02:03:00.000Z");

  const evidenceRecords: RuntimeEvidenceRecord[] = [
    {
      id: "evidence-northstar-operating-model",
      title: "Approved operating model and RACI",
      evidenceType: "Governance record",
      source: "Northstar Executive Governance Committee",
      reference: "NSU-GOV-RACI-2026-04",
      verificationStatus: "verified",
      collectedAt: "2026-08-10T00:00:00.000Z",
      reviewedAt: "2026-08-12T00:00:00.000Z",
      reviewDueAt: "2027-08-12T00:00:00.000Z",
      authorityNotes: "Approved, but project and operations teams interpret one role boundary differently.",
    },
    {
      id: "evidence-northstar-condition-report",
      title: "Substation condition and lifecycle report",
      evidenceType: "Engineering assurance record",
      source: "Northstar Asset Engineering",
      reference: "NSU-SUB17-CONDITION-2024",
      verificationStatus: "expired",
      collectedAt: "2024-06-15T00:00:00.000Z",
      reviewedAt: "2024-06-20T00:00:00.000Z",
      reviewDueAt: "2025-06-20T00:00:00.000Z",
      authorityNotes: "Previously authoritative, but predates the upgrade and current handover condition.",
    },
    {
      id: "evidence-northstar-information-policy",
      title: "Asset information governance policy",
      evidenceType: "Policy",
      source: "Northstar Information Governance",
      reference: "NSU-INFO-POL-009",
      verificationStatus: "verified",
      collectedAt: "2026-03-01T00:00:00.000Z",
      reviewedAt: "2026-03-05T00:00:00.000Z",
      reviewDueAt: "2027-03-05T00:00:00.000Z",
      authorityNotes: "Policy is current, but the new EAM platform changes data ownership and control points.",
    },
  ];

  const links: ClaimEvidenceLink[] = [
    { id: "link-operating-model-role", claimId: "claim-gov-role-clarity", evidenceId: "evidence-northstar-operating-model", relationship: "supports", materiality: "decisive", condition: "contested", linkedAt: "2026-09-02T02:04:00.000Z" },
    { id: "link-operating-model-decisions", claimId: "claim-gov-decision-rights", evidenceId: "evidence-northstar-operating-model", relationship: "supports", materiality: "material", condition: "current", linkedAt: "2026-09-02T02:04:00.000Z" },
    { id: "link-condition-lifecycle", claimId: "claim-lifecycle-planning", evidenceId: "evidence-northstar-condition-report", relationship: "supports", materiality: "decisive", condition: "stale", linkedAt: "2026-09-02T02:04:00.000Z" },
    { id: "link-information-policy", claimId: "claim-info-asset-information-strategy", evidenceId: "evidence-northstar-information-policy", relationship: "supports", materiality: "material", condition: "current", linkedAt: "2026-09-02T02:04:00.000Z" },
  ];

  store = { ...store, evidenceRecords, links, lastSavedAt: "2026-09-02T02:04:00.000Z" };

  [
    "claim-gov-role-clarity",
    "claim-gov-escalation-governance",
    "claim-risk-ownership",
    "claim-lifecycle-planning",
    "claim-info-asset-information-strategy",
  ].forEach((claimId, index) => {
    store = requestEvidenceForClaim(store, claimId, `2026-09-02T02:1${index}:00.000Z`);
  });

  const riskWorkItem = store.workItems.find((item) => item.claimId === "claim-risk-ownership");
  if (riskWorkItem) {
    store = submitEvidenceForWorkItem(
      store,
      riskWorkItem.id,
      {
        title: "Draft operational risk ownership register",
        evidenceType: "Risk register extract",
        source: "Northstar Operations Readiness Team",
        reference: "NSU-RISK-DRAFT-17",
        authorityNotes: "Named owners are proposed but acceptance has not yet been verified.",
      },
      "2026-09-02T02:20:00.000Z",
    );
  }

  return { runtime, store };
}
