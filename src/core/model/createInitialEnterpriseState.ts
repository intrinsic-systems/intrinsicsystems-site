import { CORE_CAPABILITIES } from "./capabilities";
import type { EnterpriseResponseState } from "./coreResponseState";

export function createInitialEnterpriseState(): EnterpriseResponseState {
  return {
    enterpriseScore: 0,
    enterpriseConfidence: 0,

    capabilities: CORE_CAPABILITIES.map((capability) => ({
      capabilityId: capability.id,
      coreAnswers: [],
      probesTriggered: [],
      evidenceSubmitted: (capability.evidence ?? [])
        .filter((item) => typeof item !== "string")
        .map((item) => ({
          ...item,
          provided: item.provided ?? false,
        })),

      score: 0,
      confidence: "low",
      triggers: [],
    })),
  };
}