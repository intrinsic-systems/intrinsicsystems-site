// src/acma/acmaAssessmentSummary.ts

import {
  buildCapabilityScores,
  type CapabilityScore,
} from "./buildCapabilityScores";
import {
  getImprovementPathway,
  getNextBestActions,
  type NextBestAction,
  type PathwayStep,
} from "./improvementPathway";

export type AssessmentSummary = {
  answered: number;
  total: number;
  completionPct: number;
  maturityPct: number;
  confidencePct: number;
  riskLevel: string;
  capabilityScores: CapabilityScore[];
  priorityCapabilities: CapabilityScore[];
  pathway: PathwayStep[];
  nextBestActions: NextBestAction[];
};

export function buildAssessmentSummary(
  answers: Record<string, string>
): AssessmentSummary {
  const capabilityScores = buildCapabilityScores(answers);

  const answered = capabilityScores.reduce((sum, c) => sum + c.answered, 0);
  const total = capabilityScores.reduce((sum, c) => sum + c.total, 0);

  const maturityPct =
    capabilityScores.length > 0
      ? Math.round(
          (capabilityScores.reduce((sum, c) => sum + c.scorePct, 0) /
            capabilityScores.length) *
            10
        ) / 10
      : 0;

  const completionPct = total > 0 ? Math.round((answered / total) * 100) : 0;

  const confidencePct = completionPct;

  const riskLevel =
    completionPct < 50
      ? "Low confidence"
      : maturityPct < 20
      ? "High"
      : maturityPct < 40
      ? "Moderate"
      : "Low";

  const priorityCapabilities = [...capabilityScores]
    .filter((c) => c.answered > 0)
    .sort((a, b) => a.scorePct - b.scorePct)
    .slice(0, 5);

  const pathway = getImprovementPathway(capabilityScores);
  const nextBestActions = getNextBestActions(capabilityScores);

  return {
    answered,
    total,
    completionPct,
    maturityPct,
    confidencePct,
    riskLevel,
    capabilityScores,
    priorityCapabilities,
    pathway,
    nextBestActions,
  };
}