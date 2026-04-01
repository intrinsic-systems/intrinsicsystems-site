import type { CoreResults } from "@/core/CoreResultsTypes";
import type { DomainNode, ElementNode, Question } from "./orgGovTypes";

function toSector(group?: string): string {
  switch (group) {
    case "leadership":
      return "Direction & Control";
    case "governance":
      return "Governance & Oversight";
    case "compliance":
      return "Compliance & Control";
    case "information":
      return "Information & Intelligence";
    case "process":
      return "Operating Model";
    case "financial":
      return "Investment & Resourcing";
    default:
      return group || "Other";
  }
}

function toQuestionType(group?: string): Question["type"] {
  switch (group) {
    case "leadership":
    case "governance":
      return "GOVERNANCE";
    case "compliance":
      return "COMPLIANCE";
    case "information":
      return "DATA";
    case "process":
      return "PROCESS";
    case "financial":
      return "FINANCIAL";
    default:
      return "PROCESS";
  }
}

export function mapOrgGovFromCore(results: CoreResults): DomainNode {
  const orgGovCapabilities = results.capabilities.filter(
    (c) => c.domain === "Organisation & Governance"
  );

  const elements: ElementNode[] = orgGovCapabilities.map((cap) => ({
    id: cap.id,
    title: cap.name,
    description: cap.description ?? "",
    sector: toSector(cap.group),
    weight: 1,
    score: {
      current: cap.score ?? 0,
      benchmark: 4.0,
      target: 4.4,
      variance: (cap.score ?? 0) - 4.0,
      confidence: cap.confidence ?? 1,
    },
    questions: (cap.questions ?? []).map((q) => ({
      id: q.id,
      prompt: q.text,
      type: toQuestionType(cap.group),
      weight: 1,
      isCritical: (q.score ?? 0) <= 2.0,
      evidenceRequired: true,
      evidenceItems: [],
      score: {
        current: q.score ?? 0,
        benchmark: 4.0,
        target: 4.4,
        variance: (q.score ?? 0) - 4.0,
        confidence: q.confidence ?? 1,
      },
    })),
  }));

  const fallbackCurrent =
    elements.length > 0
      ? elements.reduce((sum, el) => sum + (el.score.current ?? 0), 0) /
        elements.length
      : 0;

  const domainCurrent =
    results.domainScores?.["Organisation & Governance"]?.current ?? fallbackCurrent;

  return {
    id: "ORG_GOV",
    title: "Organisation & Governance",
    description:
      "Derived from CORE results and mapped into engineered governance elements.",
    score: {
      current: domainCurrent,
      benchmark: 4.0,
      target: 4.4,
      variance: domainCurrent - 4.0,
      confidence:
        typeof results.confidence === "number"
          ? results.confidence
          : typeof results.confidencePct === "number"
          ? results.confidencePct / 100
          : 1,
          },
    elements,
  };
}