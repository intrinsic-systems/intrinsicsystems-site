// src/acma/baselineStore.ts
export type BaselineSnapshot = {
  answers: Record<string, string>;
  savedAt: string; // ISO string
};

const KEY = "oasis_acma_baseline_v1";

export function loadBaseline(): BaselineSnapshot | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BaselineSnapshot;
    if (!parsed || typeof parsed !== "object" || !parsed.answers) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveBaseline(
  answers: Record<string, string>
): BaselineSnapshot {
  const snapshot: BaselineSnapshot = {
    answers: { ...answers },
    savedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    // ignore
  }
  return snapshot;
}

export function clearBaseline() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}