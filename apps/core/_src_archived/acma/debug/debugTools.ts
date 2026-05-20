// src/acma/debug/debugTools.ts
import { ACMA_SECTORS } from "../acmaHierarchy";
import { DERIVED_QUESTIONS, computeDerivedInfo } from "../acmaDerived";
import { computeSectorScore } from "../acmaScoring";

/**
 * Log the status of all derived questions:
 * - dependencies
 * - pending deps
 * - effective maturity label (if any)
 */
export function logDerivedStatus(answers: Record<string, string>) {
  console.groupCollapsed("[OASIS] Derived question status");

  Object.entries(DERIVED_QUESTIONS).forEach(([code, deps]) => {
    const info = computeDerivedInfo(code, answers);
    console.log(code, {
      dependsOn: deps,
      pending: info?.pending ?? [],
      avgRank: info?.avgRank ?? null,
      label: info?.label ?? null,
      directAnswer: answers[code] ?? null,
    });
  });

  console.groupEnd();
}

/**
 * Log sector-level coverage and maturity.
 */
export function logSectorCoverage(answers: Record<string, string>) {
  console.groupCollapsed("[OASIS] Sector coverage");

  ACMA_SECTORS.forEach((s) => {
    const score = computeSectorScore(s.code, answers);
    const pctComplete = score.total
      ? Math.round((100 * score.answered) / score.total)
      : 0;

    console.log(
      `Sector ${s.code} — ${s.name}`,
      {
        total: score.total,
        answered: score.answered,
        pctComplete,
        scorePct: Math.round(score.scorePct),
      }
    );
  });

  console.groupEnd();
}

/**
 * Log a flat list of all unanswered (effective) questions.
 * Helpful to see where gaps remain.
 */
export function logUnanswered(answers: Record<string, string>) {
  console.groupCollapsed("[OASIS] Unanswered question codes");

  const missing: string[] = [];

  ACMA_SECTORS.forEach((s: any) =>
    s.areas.forEach((a: any) =>
      a.activities.forEach((act: any) =>
        act.questions.forEach((q: any) => {
          const hasAnswer = Boolean(answers[q.code]);
          if (!hasAnswer) {
            const derived = computeDerivedInfo(q.code, answers);
            if (!derived || !derived.label) {
              missing.push(q.code);
            }
          }
        })
      )
    )
  );

  console.log(missing);
  console.groupEnd();
}