export type RuntimeTrigger = {
  id: string;
  capabilityId: string;
  severity: "low" | "medium" | "high";
  type:
    | "probe"
    | "evidence"
    | "governance"
    | "dependency"
    | "confidence";
  title: string;
  description: string;
};

type CapabilityState = {
  score: number;
  confidence: number;
  hasEvidence: boolean;
};

export function buildRuntimeTriggers(
  capabilities: Record<string, CapabilityState>,
): RuntimeTrigger[] {
  const triggerMap = new Map<string, RuntimeTrigger>();

  Object.entries(capabilities).forEach(
    ([capabilityId, capability]) => {
      /*
       * LOW SCORE
       */
      if (capability.score < 40) {
        triggerMap.set(`${capabilityId}-probe`, {
          id: `${capabilityId}-probe`,
          capabilityId,
          severity: "high",
          type: "probe",
          title: "Capability weakness detected",
          description:
            "Low scoring capability requires deeper diagnostic probing.",
        });
      }

      /*
       * LOW CONFIDENCE
       */
      if (capability.confidence < 0.45) {
        triggerMap.set(`${capabilityId}-confidence`, {
          id: `${capabilityId}-confidence`,
          capabilityId,
          severity: "medium",
          type: "confidence",
          title: "Low confidence detected",
          description:
            "Responses indicate uncertain operational confidence.",
        });
      }

      /*
       * MISSING EVIDENCE
       */
      if (!capability.hasEvidence) {
        triggerMap.set(`${capabilityId}-evidence`, {
          id: `${capabilityId}-evidence`,
          capabilityId,
          severity: "medium",
          type: "evidence",
          title: "Evidence gap detected",
          description:
            "Capability lacks supporting evidence or assurance artefacts.",
        });
      }
    },
  );

  return Array.from(triggerMap.values());
}