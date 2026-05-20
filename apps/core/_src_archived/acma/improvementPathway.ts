// src/acma/improvementPathway.ts

import type { CapabilityScore } from "./buildCapabilityScores";

export type PathwayStep = {
  id: string;
  label: string;
  scorePct: number;
  priority: "high" | "medium" | "low";
  rationale: string;
};

export type NextBestAction = {
  id: string;
  label: string;
  scorePct: number;
  actionTitle: string;
  rationale: string;
};

export function getImprovementPathway(
  capabilities: CapabilityScore[]
): PathwayStep[] {
  return capabilities
    .filter((c) => c.answered > 0)
    .sort((a, b) => a.scorePct - b.scorePct)
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      label: c.label,
      scorePct: c.scorePct,
      priority:
        c.scorePct < 35 ? "high" : c.scorePct < 60 ? "medium" : "low",
      rationale:
        c.scorePct < 35
          ? "Foundational capability gap with likely downstream impact."
          : c.scorePct < 60
          ? "Moderate capability weakness constraining consistency."
          : "Capability is functioning but still offers uplift potential.",
    }));
}

export function getNextBestActions(
  capabilities: CapabilityScore[]
): NextBestAction[] {
  return capabilities
    .filter((c) => c.answered > 0)
    .sort((a, b) => a.scorePct - b.scorePct)
    .slice(0, 3)
    .map((c) => ({
      id: c.id,
      label: c.label,
      scorePct: c.scorePct,
      actionTitle: `${c.label}`,
      rationale:
        c.scorePct < 35
          ? "This is a low-scoring foundational capability likely limiting broader enterprise performance."
          : "This capability presents a clear near-term uplift opportunity with visible operational benefit.",
    }));
}