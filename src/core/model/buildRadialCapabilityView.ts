import { CORE_CAPABILITIES } from "./capabilities";
import { getCapabilityRuntimeView } from "./getCapabilityRuntimeView";
import { getCapabilityInfluenceMap } from "./getCapabilityInfluenceMap";
import type { EnterpriseResponseState } from "./coreResponseState";

export type RadialCapabilityNode = {
  id: string;
  label: string;
  score: number;
  confidence: string;
  triggers: string[];
  upstreamCount: number;
  downstreamCount: number;
};

export function buildRadialCapabilityView(
  state: EnterpriseResponseState
): RadialCapabilityNode[] {
  const influenceMap = getCapabilityInfluenceMap();

  return CORE_CAPABILITIES.map((capability) => {
    const runtime = getCapabilityRuntimeView(capability, state);

    return {
      id: capability.id,
      label: capability.label,
      score: runtime.score,
      confidence: runtime.confidence,
      triggers: runtime.triggers,
      upstreamCount: influenceMap.upstream[capability.id]?.length ?? 0,
      downstreamCount: influenceMap.downstream[capability.id]?.length ?? 0,
    };
  });
}