import { PROBE_LIBRARY } from "./probeLibrary";

import type { AdaptiveProbe } from "./probeTypes";
import type { CapabilityRuntimeState } from "./runtimeEngine";

export function buildAdaptiveProbes(
  capabilities: Record<string, CapabilityRuntimeState>,
): AdaptiveProbe[] {
  const probeMap = new Map<string, AdaptiveProbe>();

  Object.entries(capabilities).forEach(
    ([capabilityId, capability]) => {
      if (capability.score < 40) {
        PROBE_LIBRARY.filter(
          (probe) =>
            probe.capabilityId === capabilityId,
        ).forEach((probe) => {
          probeMap.set(probe.id, probe);
        });
      }

      if (capability.evidenceCoverage < 50) {
        PROBE_LIBRARY.filter(
          (probe) =>
            probe.capabilityId === "*",
        ).forEach((probe) => {
          probeMap.set(
            `${capabilityId}-${probe.id}`,
            {
              ...probe,
              id: `${capabilityId}-${probe.id}`,
              capabilityId,
            },
          );
        });
      }
    },
  );

  return Array.from(probeMap.values());
}