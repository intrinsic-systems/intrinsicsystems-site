import type {
  CapabilityRuntimeState,
  RuntimeAnswerMutation,
} from "./runtimeEngine";

export function recalculateCapability(
  capability: CapabilityRuntimeState,
  mutation: RuntimeAnswerMutation,
): CapabilityRuntimeState {
  const evidenceCoverage =
    mutation.hasEvidence ? 100 : 25;

  return {
    ...capability,

    score: mutation.score,

    confidence: mutation.confidence,

    hasEvidence: mutation.hasEvidence,

    evidenceCoverage,
  };
}