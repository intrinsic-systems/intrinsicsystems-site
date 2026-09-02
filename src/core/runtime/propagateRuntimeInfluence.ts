import { propagateInfluence } from "./propagateInfluence";
import { buildRuntimeConfidenceArchitecture } from "./runtimeConfidenceArchitecture";

import type {
  CapabilityRuntimeState,
  EnterpriseRuntimeState,
} from "./runtimeEngine";

export type RuntimeInfluenceLink = {
  sourceId: string;
  targetId: string;
  influence: number;
};

export function propagateRuntimeInfluence(
  runtime: EnterpriseRuntimeState,
  links: RuntimeInfluenceLink[],
): EnterpriseRuntimeState {
  const nextCapabilities: Record<string, CapabilityRuntimeState> = {
    ...runtime.capabilities,
  };

  for (const link of links) {
    const source = nextCapabilities[link.sourceId];
    const target = nextCapabilities[link.targetId];

    if (!source || !target) continue;

    const result = propagateInfluence(
      source.score,
      target.score,
      target.confidence,
      link.influence,
    );

    nextCapabilities[link.targetId] = {
      ...target,
      score: result.adjustedScore,
      confidence: result.adjustedConfidence,
      confidenceArchitecture: buildRuntimeConfidenceArchitecture({
        confidence: result.adjustedConfidence,
        evidenceCoverage: target.evidenceCoverage,
        hasEvidence: target.hasEvidence,
        controlConditions:
          target.confidenceArchitecture.controlConditions,
      }),
      triggers: [
        ...target.triggers,
        result.pressure > 35 ? "dependency-pressure" : "",
      ].filter(Boolean),
    };
  }

  return {
    ...runtime,
    capabilities: nextCapabilities,
  };
}
