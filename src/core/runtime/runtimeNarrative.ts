import type {
  CapabilityInfluenceMap,
} from "./buildCapabilityInfluenceMap";

export function buildRuntimeNarrative(
  influenceMap: CapabilityInfluenceMap | null,
): string {
  if (!influenceMap) {
    return (
      "Select a runtime capability to inspect upstream dependencies, " +
      "downstream influence, evidence requirements, and operational consequence."
    );
  }

  const downstreamText =
    influenceMap.downstream.length > 0
      ? influenceMap.downstream.join(", ")
      : "no immediate downstream capabilities";

  const upstreamText =
    influenceMap.upstream.length > 0
      ? influenceMap.upstream.join(", ")
      : "no immediate upstream dependencies";

  return (
    `${influenceMap.activeCapabilityId} is influenced by ${upstreamText} ` +
    `and currently influences ${downstreamText}. ` +
    "This focus view helps determine where capability strain may propagate through the enterprise runtime."
  );
}