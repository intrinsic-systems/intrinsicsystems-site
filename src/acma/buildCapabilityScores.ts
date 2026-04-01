// src/acma/buildCapabilityScores.ts

import { ACMA_SECTORS, ACMA_MATURITY_SCORES } from "./acmaHierarchy";
import { computeDerivedInfo } from "./acmaDerived";
import { getCapabilityForActivity } from "./activityCapabilityMap";

export type CapabilityScore = {
  id: string;
  label: string;
  scorePct: number;
  answered: number;
  total: number;
};

export function buildCapabilityScores(
  answers: Record<string, string>
): CapabilityScore[] {
  const bucket = new Map<
    string,
    {
      id: string;
      label: string;
      sum: number;
      answered: number;
      total: number;
    }
  >();

  ACMA_SECTORS.forEach((sector) => {
    sector.areas.forEach((area) => {
      area.activities.forEach((activity) => {
        const capability = getCapabilityForActivity(activity.code);
        if (!capability) return;

        if (!bucket.has(capability.id)) {
          bucket.set(capability.id, {
            id: capability.id,
            label: capability.label,
            sum: 0,
            answered: 0,
            total: 0,
          });
        }

        const row = bucket.get(capability.id)!;

        activity.questions.forEach((q) => {
          row.total += 1;

          let label = answers[q.code];
          if (label == null) {
            const derived = computeDerivedInfo(q.code, answers);
            if (derived?.label) label = derived.label;
          }

          if (label != null) {
            row.answered += 1;
            row.sum += ACMA_MATURITY_SCORES[label] ?? 0;
          }
        });
      });
    });
  });

  return Array.from(bucket.values())
    .map((x) => ({
      id: x.id,
      label: x.label,
      answered: x.answered,
      total: x.total,
      scorePct: x.answered > 0 ? Math.round((x.sum / x.answered) * 1000) / 10 : 0,
    }))
    .sort((a, b) => a.scorePct - b.scorePct);
}