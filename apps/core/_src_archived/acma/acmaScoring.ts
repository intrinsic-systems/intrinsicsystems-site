// src/acma/acmaScoring.ts
import { ACMA_SECTORS } from "./acmaHierarchy";
import { computeDerivedInfo } from "./acmaDerived";

export type SectorScore = {
  total: number;
  answered: number;
  scorePct: number;
};

// Same maturity mapping we use elsewhere
const MATURITY_VALUES: Record<string, number> = {
  Innocent: 0.0,
  Aware: 5.0,
  Developing: 35.0,
  Competent: 70.0,
  Optimising: 90.0,
  Excellent: 100.0,
};

/**
 * Returns the effective maturity label for a given question:
 * - if the user has answered it, use that;
 * - otherwise, if it is a derived question and we can compute a label, use that;
 * - otherwise, null (unanswered).
 */
function getEffectiveLabel(
  code: string,
  answers: Record<string, string>
): string | null {
  const direct = answers[code];
  if (direct != null) return direct;

  const derived = computeDerivedInfo(code, answers);
  if (derived && derived.label) return derived.label;

  return null;
}

/**
 * Compute sector-level score, counting derived questions as
 * answered when they can be calculated.
 */
export function computeSectorScore(
  sectorCode: string,
  answers: Record<string, string>
): SectorScore {
  const sector = ACMA_SECTORS.find((s) => s.code === sectorCode);
  if (!sector) {
    return { total: 0, answered: 0, scorePct: 0 };
  }

  let total = 0;
  let answered = 0;
  let sum = 0;

  sector.areas.forEach((area) => {
    area.activities.forEach((act) => {
      act.questions.forEach((q) => {
        total++;
        const label = getEffectiveLabel(q.code, answers);
        if (label != null) {
          answered++;
          sum += MATURITY_VALUES[label] ?? 0;
        }
      });
    });
  });

  const scorePct = total ? sum / total : 0;
  return { total, answered, scorePct };
}

/**
 * Debug helper: list questions in a sector that have no effective label
 * (neither answered nor successfully derived).
 */
export function getUnansweredCodesForSector(
  sectorCode: string,
  answers: Record<string, string>
): string[] {
  const sector = ACMA_SECTORS.find((s) => s.code === sectorCode);
  if (!sector) return [];

  const missing: string[] = [];

  sector.areas.forEach((area) => {
    area.activities.forEach((act) => {
      act.questions.forEach((q) => {
        const direct = answers[q.code];
        if (direct != null) return;

        const derived = computeDerivedInfo(q.code, answers);
        if (!derived || !derived.label) {
          missing.push(q.code);
        }
      });
    });
  });

  return missing;
}