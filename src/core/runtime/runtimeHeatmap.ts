export type RuntimeHeatmapLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type RuntimeHeatmapNode = {
  capabilityId: string;
  heat: number;
  level: RuntimeHeatmapLevel;
  reasons: string[];
};

function getHeatLevel(heat: number): RuntimeHeatmapLevel {
  if (heat >= 85) return "critical";
  if (heat >= 65) return "high";
  if (heat >= 40) return "medium";
  return "low";
}

export function buildRuntimeHeatmap({
  capabilityScores,
  lowConfidenceIds,
  evidenceGapIds,
  conflictRelatedIds,
}: {
  capabilityScores: Record<string, number>;
  lowConfidenceIds: string[];
  evidenceGapIds: string[];
  conflictRelatedIds: string[];
}): RuntimeHeatmapNode[] {
  return Object.entries(capabilityScores).map(
    ([capabilityId, score]) => {
      const reasons: string[] = [];

      let heat = Math.max(0, 100 - score);

      if (lowConfidenceIds.includes(capabilityId)) {
        heat += 15;
        reasons.push("Low confidence");
      }

      if (evidenceGapIds.includes(capabilityId)) {
        heat += 20;
        reasons.push("Evidence gap");
      }

      if (conflictRelatedIds.includes(capabilityId)) {
        heat += 25;
        reasons.push("Information conflict");
      }

      heat = Math.min(100, heat);

      return {
        capabilityId,
        heat,
        level: getHeatLevel(heat),
        reasons,
      };
    },
  );
}