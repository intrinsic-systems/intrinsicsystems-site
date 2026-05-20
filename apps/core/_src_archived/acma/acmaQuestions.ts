// src/acma/acmaQuestions.ts
import bank from "./acma_question_bank.json";

export const ACMA_QUESTION_BANK_DOC = bank;

export type AcmaQuestion = {
  id: string;          // question code (e.g. "1.1.1.1")
  prompt: string;
  type: string;
  weight?: number;
  iso_refs?: string[];
  taxonomy_tags?: string[];
  validation?: { required?: boolean };
};

export type AcmaSection = {
  id: string;
  title: string;
  questions: AcmaQuestion[];
};

export type AcmaBank = {
  version: string;
  meta: unknown;
  sections: AcmaSection[];
};

const ACMA_BANK = bank as unknown as AcmaBank;

export const ACMA_SECTIONS: ReadonlyArray<AcmaSection> = Object.freeze(
  (ACMA_BANK.sections ?? []).map((s) => ({
    ...s,
    questions: s.questions ?? [],
  }))
);

export const ACMA_QUESTIONS: ReadonlyArray<AcmaQuestion> = Object.freeze(
  ACMA_SECTIONS.flatMap((s) => s.questions)
);

export const ACMA_TOTAL_QUESTIONS = ACMA_QUESTIONS.length;

// Convenience exports (useful for results/indexing)
export const ACMA_QUESTION_IDS: ReadonlyArray<string> = Object.freeze(
  ACMA_QUESTIONS.map((q) => q.id)
);

export const ACMA_QUESTION_ID_SET: ReadonlySet<string> = new Set(ACMA_QUESTION_IDS);