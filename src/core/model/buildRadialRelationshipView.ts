import { getCapabilityRelationships } from "./getCapabilityRelationships";

export type RadialRelationshipLink = {
  sourceId: string;
  targetId: string;
  type: string;
  influence: number;
  rationale?: string;
};

export function buildRadialRelationshipView(): RadialRelationshipLink[] {
  return getCapabilityRelationships().map((relationship) => ({
    sourceId: relationship.sourceCapabilityId,
    targetId: relationship.targetCapabilityId,
    type: relationship.type,
    influence: relationship.influence,
    rationale: relationship.rationale,
  }));
}