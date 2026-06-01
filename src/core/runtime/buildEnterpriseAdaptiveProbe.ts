import type { RuntimeAction } from "./buildRuntimeActions";

export type EnterpriseAdaptiveProbe = {
  id: string;
  priority: "low" | "medium" | "high";
  reason: string;
  question: string;
};

export function buildEnterpriseAdaptiveProbe(
  actions: RuntimeAction[],
): EnterpriseAdaptiveProbe | null {
  const highest = actions[0];

  if (!highest) {
    return null;
  }

  switch (highest.source) {
    case "conflict":
      return {
        id: "authoritative-source-review",
        priority: "high",
        reason: highest.title,
        question:
          "Which authoritative source should be used to resolve this conflict?",
      };

    case "evidence":
      return {
        id: "evidence-validation",
        priority: "medium",
        reason: highest.title,
        question:
          "What evidence is required to validate the current operational state?",
      };

    case "alert":
      return {
        id: "capability-investigation",
        priority: "high",
        reason: highest.title,
        question:
          "What is the primary operational constraint causing this capability weakness?",
      };

    default:
      return {
        id: "runtime-review",
        priority: "medium",
        reason: highest.title,
        question:
          "Who owns resolution of this issue and how is accountability demonstrated?",
      };
  }
}