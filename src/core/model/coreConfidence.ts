import type {
  ConfidenceLevel,
  CoreAnswer,
} from "./coreModel";

export function computeConfidence(
  answer: CoreAnswer
): ConfidenceLevel {
  const evidenceCount = answer.evidence?.length ?? 0;
  const probeCount = answer.probeResponses?.length ?? 0;

  if (evidenceCount >= 3 && probeCount >= 2) {
    return "high";
  }

  if (evidenceCount >= 1 || probeCount >= 1) {
    return "medium";
  }

  return "low";
}