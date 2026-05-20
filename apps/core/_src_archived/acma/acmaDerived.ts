// src/acma/acmaDerived.ts
import { ACMA_MATURITY } from "./acmaHierarchy";

// Derived questions and the questions they depend on
export const DERIVED_QUESTIONS: Record<string, string[]> = {
  "1.2.12.46": [
    "1.1.3.10",
    "1.1.4.14",
    "1.2.6.24",
    "1.2.7.29",
    "1.2.9.36",
    "1.2.11.44",
  ],
  "2.4.20.69": ["2.4.19.64", "2.4.19.65", "2.4.19.66"],
};

// Maturity “rank” 1–6 (your spreadsheet mapping)
export const MATURITY_RANK: Record<string, number> = {
  Innocent: 1,
  Aware: 2,
  Developing: 3,
  Competent: 4,
  Optimising: 5,
  Excellent: 6,
};

export type DerivedInfo = {
  dependsOn: string[];
  pending: string[];        // dependencies not yet answered
  avgRank: number | null;   // average 1–6
  label: string | null;     // nearest maturity label
};

export function computeDerivedInfo(
  code: string,
  answers: Record<string, string>
): DerivedInfo | null {
  const deps = DERIVED_QUESTIONS[code];
  if (!deps) return null;

  const pending: string[] = [];
  const ranks: number[] = [];

  for (const d of deps) {
    const lbl = answers[d];
    if (!lbl) {
      pending.push(d);
    } else {
      const r = MATURITY_RANK[lbl];
      if (r != null) ranks.push(r);
    }
  }

  if (pending.length || !ranks.length) {
    // Not all dependencies answered yet
    return { dependsOn: deps, pending, avgRank: null, label: null };
  }

  const avgRank = ranks.reduce((a, b) => a + b, 0) / ranks.length;
  const nearest = Math.min(6, Math.max(1, Math.round(avgRank)));
  const label = ACMA_MATURITY[nearest - 1]?.label ?? null;

  return { dependsOn: deps, pending, avgRank, label };
}