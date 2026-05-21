import type {
  EvidenceItem,
  ConfidenceLevel,
  TriggerCondition,
} from "./coreModel";

import type {
  EnterpriseResponseState,
} from "./coreResponseState";

import { determineTriggers } from "./coreTriggers";

function calculateConfidence(
  evidence: EvidenceItem[]
): ConfidenceLevel {
  const providedCount = evidence.filter(
    (item) => item.provided
  ).length;

  if (providedCount >= 2) {
    return "high";
  }

  if (providedCount === 1) {
    return "medium";
  }

  return "low";
}

export function applyEvidence(
  state: EnterpriseResponseState,
  capabilityId: string,
  evidenceId: string
): EnterpriseResponseState {
  return {
    ...state,

    capabilities: state.capabilities.map((capability) => {
      if (capability.capabilityId !== capabilityId) {
        return capability;
      }

      const updatedEvidence = capability.evidenceSubmitted.map(
        (item) =>
          item.id === evidenceId
            ? {
                ...item,
                provided: true,
              }
            : item
      );

      const confidence = calculateConfidence(
        updatedEvidence
      );

      const triggers = determineTriggers({
        questionId: "evidence-runtime",
        response: "evidence-update",
        score: capability.score,
        confidence,
        evidence: updatedEvidence,
      });

      return {
        ...capability,
        evidenceSubmitted: updatedEvidence,
        confidence,
        triggers,
      };
    }),
  };
}