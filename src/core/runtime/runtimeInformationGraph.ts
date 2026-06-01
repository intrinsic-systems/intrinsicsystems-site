import {
  buildTrustScores,
  type AttributeTrustScore,
  type RuntimeAttributeValue,
} from "./buildTrustScores";

import {
  buildInformationConflicts,
  type InformationConflict,
} from "./buildInformationConflicts";

export type RuntimeInformationGraph = {
  attributes: RuntimeAttributeValue[];
  trustScores: AttributeTrustScore[];
  conflicts: InformationConflict[];
  overallTrustScore: number;
  conflictCount: number;
};

export function runtimeInformationGraph(
  attributes: RuntimeAttributeValue[],
): RuntimeInformationGraph {
  const trustScores = buildTrustScores(attributes);
  const conflicts = buildInformationConflicts(attributes);

  const overallTrustScore =
    trustScores.reduce(
      (sum, item) => sum + item.trustScore,
      0,
    ) / Math.max(trustScores.length, 1);

  return {
    attributes,
    trustScores,
    conflicts,
    overallTrustScore,
    conflictCount: conflicts.length,
  };
}