import type { CapabilityRuntimeState } from "./runtimeEngine";

export function evaluateTriggers(
  capability: CapabilityRuntimeState,
): CapabilityRuntimeState {
  const triggers: string[] = [];
  const activeProbes: string[] = [];

  if (capability.score < 40) {
    triggers.push("low-score");

    activeProbes.push(
      "capability-diagnostic-probe",
    );
  }

  if (capability.confidence < 50) {
    triggers.push("low-confidence");

    activeProbes.push(
      "evidence-confidence-probe",
    );
  }

  if (capability.evidenceCoverage < 50) {
    triggers.push("missing-evidence");

    activeProbes.push(
      "evidence-request",
    );
  }

  return {
    ...capability,
    triggers,
    activeProbes,
  };
}