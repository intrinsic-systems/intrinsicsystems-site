import { PROBE_LIBRARY } from "./probeLibrary";
import { runtimeConfidenceProbeQuestions } from "./runtimeConfidenceArchitecture";

import type { AdaptiveProbe } from "./probeTypes";
import type { CapabilityRuntimeState } from "./runtimeEngine";

export function buildCapabilityAdaptiveProbes(
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
          probeMap.set(probe.id, {
            ...probe,
            confidenceArchitecture:
              capability.confidenceArchitecture,
          });
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
              confidenceArchitecture:
                capability.confidenceArchitecture,
            },
          );
        });
      }

      if (
        capability.confidenceArchitecture.nextAction !== "monitor"
      ) {
        const { confidenceArchitecture } = capability;

        probeMap.set(`${capabilityId}-confidence-policy`, {
          id: `${capabilityId}-confidence-policy`,
          capabilityId,
          type: "confidence",
          severity: confidenceArchitecture.controlConditions.length
            ? "high"
            : "medium",
          question:
            runtimeConfidenceProbeQuestions[
              confidenceArchitecture.nextAction
            ],
          rationale:
            "Probe selected from the capability's explicit support state, control condition, and next action.",
          confidenceArchitecture,
        });
      }
    },
  );

  return Array.from(probeMap.values());
}
