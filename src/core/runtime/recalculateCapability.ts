import type {
  CapabilityRuntimeState,
  RuntimeAnswerMutation,
} from "./runtimeEngine";
import { buildRuntimeConfidenceArchitecture } from "./runtimeConfidenceArchitecture";

export function recalculateCapability(
  capability: CapabilityRuntimeState,
  mutation: RuntimeAnswerMutation,
): CapabilityRuntimeState {
  const evidenceCoverage =
    mutation.hasEvidence ? 100 : 25;
  const controlConditions =
    mutation.controlConditions ??
    capability.confidenceArchitecture.controlConditions;

  return {
    ...capability,

    score: mutation.score,

    confidence: mutation.confidence,

    confidenceArchitecture: buildRuntimeConfidenceArchitecture({
      confidence: mutation.confidence,
      evidenceCoverage,
      hasEvidence: mutation.hasEvidence,
      controlConditions,
    }),

    hasEvidence: mutation.hasEvidence,

    evidenceCoverage,
  };
}
