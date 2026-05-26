import type { EnterpriseRuntimeState } from "./runtimeEngine";
import type { RuntimeQuestion } from "./questionRoutingTypes";

export function buildQuestionQueue(
  runtime: EnterpriseRuntimeState,
): RuntimeQuestion[] {
  return Object.values(runtime.capabilities)
    .flatMap((capability): RuntimeQuestion[] => {
      const questions: RuntimeQuestion[] = [];

      if (capability.score < 40) {
        questions.push({
          id: `${capability.capabilityId}-low-score`,
          capabilityId: capability.capabilityId,
          priority: 90,
          reason: "low-score",
          question:
            "What is the primary constraint preventing this capability from operating effectively?",
        });
      }

      if (capability.confidence < 0.45) {
        questions.push({
          id: `${capability.capabilityId}-low-confidence`,
          capabilityId: capability.capabilityId,
          priority: 70,
          reason: "low-confidence",
          question:
            "What evidence or operational signal would increase confidence in this capability assessment?",
        });
      }

      if (capability.evidenceCoverage < 50) {
        questions.push({
          id: `${capability.capabilityId}-evidence-gap`,
          capabilityId: capability.capabilityId,
          priority: 80,
          reason: "evidence-gap",
          question:
            "Can current evidence be provided to validate this capability response?",
        });
      }

      if (capability.triggers.includes("dependency-pressure")) {
        questions.push({
          id: `${capability.capabilityId}-dependency-risk`,
          capabilityId: capability.capabilityId,
          priority: 85,
          reason: "dependency-risk",
          question:
            "Which upstream dependency is currently placing the greatest strain on this capability?",
        });
      }

      return questions;
    })
    .sort((a, b) => b.priority - a.priority);
}