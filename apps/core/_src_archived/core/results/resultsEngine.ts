// src/core/results/resultsEngine.ts
import type { QuestionIndexItem, ResultsSummary, DomainKey, DomainScore } from "./resultsTypes";
import { MATURITY_RANK } from "../../acma/acmaDerived";

/**
 * Build code -> { domain, weight } using:
 * - hierarchy: sector/area/activity/question placement (domain = sector)
 * - bank: section weights + optional per-question weight
 */
export function buildQuestionIndex(hierarchyDoc: any, bankDoc: any): Map<string, QuestionIndexItem> {
  const idx = new Map<string, QuestionIndexItem>();

  // 1) Section weights (S1..S4)
  const sectionWeights: Record<string, number> =
    bankDoc?.meta?.scoring?.weights && typeof bankDoc.meta.scoring.weights === "object"
      ? bankDoc.meta.scoring.weights
      : {};

  // 2) Build a lookup of questionId/code -> bank-derived weight (sectionWeight * questionWeight)
  const bankWeightById = new Map<string, number>();

  const sections = Array.isArray(bankDoc?.sections) ? bankDoc.sections : [];
  for (const s of sections) {
    const sectionId = asString(s?.id) ?? "";
    const wSection = saneWeight(asNumber(sectionWeights?.[sectionId]) ?? 1);

    const questions = Array.isArray(s?.questions) ? s.questions : [];
    for (const q of questions) {
      const qid =
        asString(q?.code) ??
        asString(q?.id) ??
        asString(q?.qid) ??
        asString(q?.question_id) ??
        asString(q?.questionId);

      if (!qid) continue;

      const wQ = saneWeight(asNumber(q?.weight) ?? asNumber(q?.w) ?? 1);
      bankWeightById.set(qid, saneWeight(wSection * wQ));
    }
  }

  // 3) Walk hierarchy and create the index entries (domain from sector name/code)
  const sectors = Array.isArray(hierarchyDoc?.sectors) ? hierarchyDoc.sectors : [];
  for (const sector of sectors) {
    const sectorCode = asString(sector?.code) ?? "";
    const sectorName = asString(sector?.name) ?? sectorCode;
    const domain = normaliseDomainFromSector(sectorCode || sectorName);

    const areas = Array.isArray(sector?.areas) ? sector.areas : [];
    for (const area of areas) {
      const activities = Array.isArray(area?.activities) ? area.activities : [];
      for (const act of activities) {
        const questions = Array.isArray(act?.questions) ? act.questions : [];
        for (const q of questions) {
          const qid =
            asString(q?.code) ??
            asString(q?.id) ??
            asString(q?.qid) ??
            asString(q?.question_id) ??
            asString(q?.questionId);

          if (!qid) continue;

          const w =
            bankWeightById.get(qid) ??
            saneWeight(asNumber(q?.weight) ?? asNumber(q?.w) ?? 1);

          idx.set(qid, { code: qid, domain, weight: w });
        }
      }
    }
  }

  // 4) If any bank questions weren’t present in hierarchy, still include them (domain=other)
  for (const [qid, w] of bankWeightById.entries()) {
    if (!idx.has(qid)) idx.set(qid, { code: qid, domain: "other", weight: w });
  }

  return idx;
}

/* ---------- computeResults stays as-is (your earlier version) ---------- */

export function computeResults(args: {
  answers: Record<string, string>;
  index: Map<string, QuestionIndexItem>;
  totalQuestions: number;
}): ResultsSummary {
  const { answers, index, totalQuestions } = args;

  const answersCount = Object.keys(answers).length;
  const completionPct = totalQuestions > 0 ? Math.round((answersCount / totalQuestions) * 100) : 0;

  const byDomain = new Map<DomainKey, { wSum: number; wScoreSum: number; answered: number; total: number; confSum: number }>();

  for (const q of index.values()) {
    const bucket = byDomain.get(q.domain) ?? { wSum: 0, wScoreSum: 0, answered: 0, total: 0, confSum: 0 };
    bucket.total += 1;
    byDomain.set(q.domain, bucket);
  }

  for (const [code, label] of Object.entries(answers)) {
    const q = index.get(code);
    if (!q) continue;

    const r = MATURITY_RANK[label]; // 1..6
    const maturity = r ? ((r - 1) / 5) * 100 : null;

    const bucket = byDomain.get(q.domain) ?? { wSum: 0, wScoreSum: 0, answered: 0, total: 0, confSum: 0 };
    bucket.answered += 1;

    if (maturity != null) {
      bucket.wSum += q.weight;
      bucket.wScoreSum += q.weight * maturity;
      bucket.confSum += 100;
    }
    byDomain.set(q.domain, bucket);
  }

  const domainScores: DomainScore[] = Array.from(byDomain.entries())
    .map(([domain, b]) => {
      const maturityScore = b.wSum > 0 ? round1(b.wScoreSum / b.wSum) : null;
      const confidenceScore = b.total > 0 ? Math.round((b.answered / b.total) * 100) : null;
      const completionPct = b.total > 0 ? Math.round((b.answered / b.total) * 100) : 0;

      return {
        domain,
        label: domainLabel(domain),
        answered: b.answered,
        total: b.total,
        completionPct,
        maturityScore,
        confidenceScore,
      };
    })
    .sort((a, b) => (b.maturityScore ?? -1) - (a.maturityScore ?? -1));

  const enterpriseMaturity = weightedEnterprise(domainScores);
  const enterpriseConfidence = averageConfidence(domainScores);

  const strongestDomain = domainScores.find(d => d.maturityScore != null);
  const weakestDomain = [...domainScores].reverse().find(d => d.maturityScore != null);

  const signals = buildSignals({ completionPct, domainScores });

  return {
    enterpriseMaturity,
    enterpriseConfidence,
    answersCount,
    totalQuestions,
    completionPct,
    strongestDomain,
    weakestDomain,
    domainScores,
    signals,
  };
}

/* ---------------- helpers ---------------- */

function asString(v: any): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}
function asNumber(v: any): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() && Number.isFinite(Number(v))) return Number(v);
  return null;
}
function saneWeight(w: number): number {
  if (!Number.isFinite(w) || w <= 0) return 1;
  return Math.min(20, w);
}

function normaliseDomainFromSector(raw: string): DomainKey {
  const s = raw.toLowerCase();
  // try common naming patterns first
  if (s.includes("strateg")) return "strategy";
  if (s.includes("govern")) return "governance";
  if (s.includes("life") || s.includes("renew") || s.includes("capex")) return "lifecycle";
  if (s.includes("risk") || s.includes("assurance") || s.includes("safety")) return "risk";
  if (s.includes("data") || s.includes("info") || s.includes("digital")) return "information";
  if (s.includes("perform") || s.includes("ops") || s.includes("operat")) return "performance";

  // if the sector codes are S1/S2/S3/S4 etc, keep them grouped but label as "other"
  return "other";
}

function domainLabel(d: DomainKey): string {
  switch (d) {
    case "strategy": return "Strategy";
    case "governance": return "Governance";
    case "lifecycle": return "Lifecycle";
    case "risk": return "Risk";
    case "information": return "Information";
    case "performance": return "Performance";
    default: return "Other";
  }
}
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function weightedEnterprise(domains: DomainScore[]): number | null {
  const scored = domains.filter(d => d.maturityScore != null);
  if (!scored.length) return null;
  const wSum = scored.reduce((a, d) => a + Math.max(1, d.answered), 0);
  const vSum = scored.reduce((a, d) => a + (d.maturityScore as number) * Math.max(1, d.answered), 0);
  return round1(vSum / wSum);
}
function averageConfidence(domains: DomainScore[]): number | null {
  const scored = domains.filter(d => d.confidenceScore != null);
  if (!scored.length) return null;
  return round1(scored.reduce((a, d) => a + (d.confidenceScore as number), 0) / scored.length);
}
function buildSignals(args: { completionPct: number; domainScores: DomainScore[] }) {
  const { completionPct, domainScores } = args;
  const signals: any[] = [];
  if (completionPct < 25) signals.push({ kind: "LOW_COMPLETION", message: "Low completion — results are indicative only." });

  const scored = domainScores.filter(d => d.maturityScore != null) as DomainScore[];
  if (scored.length >= 3) {
    const max = Math.max(...scored.map(d => d.maturityScore as number));
    const min = Math.min(...scored.map(d => d.maturityScore as number));
    if (max - min >= 35) signals.push({ kind: "DOMAIN_IMBALANCE", message: "High domain imbalance — focus uplift on the weakest domains first." });
  }

  for (const d of domainScores) {
    // only flag if there’s enough surface area for the domain to matter
    if (d.total >= 6 && (d.confidenceScore ?? 100) < 60) {
      signals.push({
        kind: "LOW_CONFIDENCE",
        domain: d.domain,
        message: `${d.label} confidence is low — complete more of this domain to stabilise results.`,
      });
    }
  }

  return signals;
}