// src/acma/acmaHierarchy.ts
import raw from "./acma_hierarchy.json";
export const ACMA_HIERARCHY_DOC = raw;

export type MaturityScaleItem = {
  value: number;   // 1..6
  label: string;   // Innocent, Aware, ...
  summary: string;
  score: number;   // 0.0 .. 1.0
};

export type ACMAQuestion = {
  code: string;    // e.g. "1.1.1.1"
  uid: string;
  text: string;
};

export type ACMAActivity = {
  code: string;        // "1.1.1"
  name: string;
  questions: ACMAQuestion[];
};

export type ACMAArea = {
  code: string;        // "1.1"
  name: string;
  activities: ACMAActivity[];
};

export type ACMASector = {
  code: string;        // "1"
  name: string;
  areas: ACMAArea[];
};

export type ACMAHierarchyDoc = {
  version: string;
  meta: {
    id: string;
    title: string;
    description: string;
    maturity_scale: MaturityScaleItem[];
  };
  sectors: ACMASector[];
};

// Cast JSON with our types
const doc = raw as ACMAHierarchyDoc;

export const ACMA_DOC = doc;
export const ACMA_SECTORS = doc.sectors;
export const ACMA_MATURITY = doc.meta.maturity_scale;

// Convenience lookup: map label -> score
export const ACMA_MATURITY_SCORES: Record<string, number> = Object.fromEntries(
  doc.meta.maturity_scale.map(m => [m.label, m.score])
);

// Flatten helper (all question codes)
export function getAllQuestionCodes(): string[] {
  const codes: string[] = [];
  for (const s of doc.sectors) {
    for (const a of s.areas) {
      for (const ac of a.activities) {
        for (const q of ac.questions) {
          codes.push(q.code);
        }
      }
    }
  }
  return codes;
}

// For a given sector code ("1","2",...)
export function getSectorQuestionCodes(sectorCode: string): string[] {
  const s = doc.sectors.find(x => x.code === sectorCode);
  if (!s) return [];
  const codes: string[] = [];
  for (const a of s.areas) {
    for (const ac of a.activities) {
      for (const q of ac.questions) {
        codes.push(q.code);
      }
    }
  }
  return codes;
}   