export type CapabilityLink = {
  sourceId: string;
  targetId: string;
  influence: number;
};

export type CapabilityInfluenceMap = {
  activeCapabilityId: string;
  upstream: string[];
  downstream: string[];
  related: string[];
};

export function buildCapabilityInfluenceMap(
  activeCapabilityId: string,
  links: CapabilityLink[],
): CapabilityInfluenceMap {
  const upstream = links
    .filter((link) => link.targetId === activeCapabilityId)
    .map((link) => link.sourceId);

  const downstream = links
    .filter((link) => link.sourceId === activeCapabilityId)
    .map((link) => link.targetId);

  const related = Array.from(
    new Set([
      activeCapabilityId,
      ...upstream,
      ...downstream,
    ]),
  );

  return {
    activeCapabilityId,
    upstream,
    downstream,
    related,
  };
}