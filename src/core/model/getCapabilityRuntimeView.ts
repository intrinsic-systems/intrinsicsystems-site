import type { CoreCapability } from "./coreModel";
import type { EnterpriseResponseState } from "./coreResponseState";

export type CapabilityRuntimeView = {
  capabilityId: string;
  label: string;
  score: number;
  confidence: string;
  triggers: string[];
  answeredCount: number;
  evidenceCount: number;
  probeCount: number;
};

export function getCapabilityRuntimeView(
  capability: CoreCapability,
  state: EnterpriseResponseState
): CapabilityRuntimeView {
  const runtime = state.capabilities.find(
    (item) => item.capabilityId === capability.id
  );

  return {
    capabilityId: capability.id,
    label: capability.label,
    score: runtime?.score ?? 0,
    confidence: runtime?.confidence ?? "low",
    triggers: runtime?.triggers ?? [],
    answeredCount: runtime?.coreAnswers.length ?? 0,
    evidenceCount:
      runtime?.evidenceSubmitted.filter((item) => item.provided).length ?? 0,
    probeCount: runtime?.probesTriggered.length ?? 0,
  };
}