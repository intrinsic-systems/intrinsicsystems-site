import type {
  CoreCapability,
  ProbeQuestion,
  TriggerType,
} from "./coreModel";

export function activateCapabilityProbes(
  capability: CoreCapability,
  triggers: TriggerType[]
): ProbeQuestion[] {
  const probes = capability.probes ?? [];

  if (!triggers.length) {
    return [];
  }

  return probes.filter((probe: ProbeQuestion) => {
    if (
      triggers.includes("low-score") &&
      probe.trigger?.includes("low-score")
    ) {
      return true;
    }

    if (
      triggers.includes("missing-evidence") &&
      probe.trigger?.includes("missing-evidence")
    ) {
      return true;
    }

    if (
      triggers.includes("low-confidence") &&
      probe.trigger?.includes("low-confidence")
    ) {
      return true;
    }

    return false;
  });
}