import { getCapabilityRelationships } from "./getCapabilityRelationships";

export function getCapabilityInfluenceMap() {
  const relationships = getCapabilityRelationships();

  const upstream: Record<string, string[]> = {};
  const downstream: Record<string, string[]> = {};

  relationships.forEach((relationship) => {
    if (!downstream[relationship.sourceCapabilityId]) {
      downstream[relationship.sourceCapabilityId] = [];
    }

    if (!upstream[relationship.targetCapabilityId]) {
      upstream[relationship.targetCapabilityId] = [];
    }

    downstream[relationship.sourceCapabilityId].push(
      relationship.targetCapabilityId
    );

    upstream[relationship.targetCapabilityId].push(
      relationship.sourceCapabilityId
    );
  });

  return {
    upstream,
    downstream,
    relationships,
  };
}