import type { DomainNode, ElementNode, Question } from "./orgGovTypes";

type ResultCapability = {
  name: string;
  scorePct: number; // e.g. 36.7
  confidencePct?: number; // e.g. 96
};

type CoreResultsInput = {
  overallScorePct: number;
  confidencePct?: number;
  capabilities: ResultCapability[];
};

type CapabilityGroupKey =
  | "leadership"
  | "governance"
  | "compliance"
  | "information"
  | "process"
  | "financial";

function weightedAvg(items: Array<{ value: number; weight: number }>): number {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;

  const weightedTotal = items.reduce(
    (sum, item) => sum + item.value * item.weight,
    0
  );

  return Number((weightedTotal / totalWeight).toFixed(1));
}

function weightedAvgPrecise(
  items: Array<{ value: number; weight: number }>,
  decimals = 2
): number {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;

  const weightedTotal = items.reduce(
    (sum, item) => sum + item.value * item.weight,
    0
  );

  return Number((weightedTotal / totalWeight).toFixed(decimals));
}

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function toFiveScale(scorePct: number): number {
  return Number((scorePct / 20).toFixed(1));
}

function buildVariance(current: number, target: number): number {
  return Number((current - target).toFixed(1));
}

const GROUP_CONFIG: Record<
  CapabilityGroupKey,
  {
    id: string;
    title: string;
    sector: string;
    description: string;
    capabilityNames: string[];
  }
> = {
  leadership: {
    id: "OG_E1",
    title: "Strategic Direction & Policy",
    sector: "Direction & Control",
    description:
      "Defines the strategic intent, policy settings, and leadership commitment that establish asset management direction across the enterprise.",
    capabilityNames: [
      "Asset Management Vision & Leadership",
      "Asset Management Policy",
      "Asset Management Strategy & Objectives",
    ],
  },

  governance: {
    id: "OG_E2",
    title: "Governance, Accountability & Oversight",
    sector: "Governance & Oversight",
    description:
      "Clarifies leadership accountability, review structures, assurance, and role definition needed to govern asset management performance.",
    capabilityNames: [
      "Asset Management Leadership",
      "Management Review, Audit & Assurance",
      "Roles & Responsibilities for AM Implementation",
    ],
  },

  compliance: {
    id: "OG_E3",
    title: "Compliance, Standards & Assurance",
    sector: "Compliance & Control",
    description:
      "Measures how well the organisation defines, applies, and maintains technical and legislative controls relevant to asset management delivery.",
    capabilityNames: ["Technical Standards & Legislation"],
  },

  information: {
    id: "OG_E4",
    title: "Information & Data Governance",
    sector: "Information & Intelligence",
    description:
      "Assesses the policy, standards, and control environment required to manage asset information, data quality, and condition intelligence.",
    capabilityNames: [
      "Asset Information Strategy",
      "Data Standards & System Requirements",
      "Condition Assessment Standards",
    ],
  },

  process: {
    id: "OG_E5",
    title: "Operating Framework & Procedures",
    sector: "Operating Model",
    description:
      "Captures the operating discipline, procedural clarity, and standard ways of working that translate governance into repeatable practice.",
    capabilityNames: ["Standard Operating Procedures"],
  },

  financial: {
    id: "OG_E6",
    title: "Resourcing & Decision Support",
    sector: "Investment & Resourcing",
    description:
      "Evaluates the financial planning, lifecycle costing, and resourcing foundations that support investment decisions and sustainable delivery.",
    capabilityNames: [
      "Asset Management Resourcing Strategy",
      "Financial Planning & Budgeting Processes",
      "Long Term Financial Plans",
      "Lifecycle Cost Assessment Processes",
    ],
  },
};

function groupCapabilities(
  capabilities: ResultCapability[]
): Record<CapabilityGroupKey, ResultCapability[]> {
  const normalisedCapabilities = capabilities.map((capability) => ({
    ...capability,
    _norm: normalise(capability.name),
  }));

  const grouped = {} as Record<CapabilityGroupKey, ResultCapability[]>;

  (Object.keys(GROUP_CONFIG) as CapabilityGroupKey[]).forEach((key) => {
    const names = GROUP_CONFIG[key].capabilityNames.map(normalise);

    grouped[key] = normalisedCapabilities
      .filter((capability) => names.includes(capability._norm))
      .map(({ _norm, ...rest }) => rest);
  });

  return grouped;
}

function inferQuestionType(name: string): Question["type"] {
  const n = normalise(name);

  if (
    n.includes("policy") ||
    n.includes("strategy") ||
    n.includes("leadership") ||
    n.includes("roles") ||
    n.includes("governance")
  ) {
    return "GOVERNANCE";
  }

  if (
    n.includes("data") ||
    n.includes("information") ||
    n.includes("system") ||
    n.includes("condition")
  ) {
    return "DATA";
  }

  if (
    n.includes("financial") ||
    n.includes("cost") ||
    n.includes("resourcing") ||
    n.includes("budget")
  ) {
    return "FINANCIAL";
  }

  if (
    n.includes("legislation") ||
    n.includes("standard") ||
    n.includes("assurance") ||
    n.includes("audit")
  ) {
    return "COMPLIANCE";
  }

  return "PROCESS";
}

function inferEvidenceRequired(name: string): boolean {
  const n = normalise(name);

  return (
    n.includes("policy") ||
    n.includes("strategy") ||
    n.includes("plan") ||
    n.includes("standard") ||
    n.includes("assurance") ||
    n.includes("audit") ||
    n.includes("budget") ||
    n.includes("financial")
  );
}

function inferCriticality(scorePct: number): boolean {
  return scorePct <= 20;
}

function questionWeight(capability: ResultCapability): number {
  return inferCriticality(capability.scorePct) ? 1.25 : 1;
}

function buildQuestion(
  groupKey: CapabilityGroupKey,
  capability: ResultCapability,
  index: number,
  benchmark: number,
  target: number,
  fallbackConfidencePct?: number
): Question {
  const current = toFiveScale(capability.scorePct);
  const confidence = Number(
    ((capability.confidencePct ?? fallbackConfidencePct ?? 0) / 100).toFixed(2)
  );

  return {
    id: `${groupKey}-${index + 1}`,
    prompt: capability.name,
    type: inferQuestionType(capability.name),
    weight: questionWeight(capability),
    isCritical: inferCriticality(capability.scorePct),
    evidenceRequired: inferEvidenceRequired(capability.name),
    score: {
      current,
      benchmark,
      target,
      variance: buildVariance(current, target),
      confidence,
    },
    evidenceItems: [],
  };
}

function buildElement(
  key: CapabilityGroupKey,
  capabilities: ResultCapability[],
  input: CoreResultsInput
): ElementNode {
  const config = GROUP_CONFIG[key];
  const benchmark = 4.0;
  const target = 4.4;

  const questions = capabilities.map((capability, index) =>
    buildQuestion(key, capability, index, benchmark, target, input.confidencePct)
  );

  const current = weightedAvg(
    questions.map((question) => ({
      value: question.score.current,
      weight: question.weight,
    }))
  );

  const confidence = weightedAvgPrecise(
    questions.map((question) => ({
      value: question.score.confidence ?? 0,
      weight: question.weight,
    })),
    2
  );

  const weight = questions.reduce((sum, question) => sum + question.weight, 0);

  return {
    id: config.id,
    title: config.title,
    description: config.description,
    sector: config.sector,
    weight,
    score: {
      current,
      benchmark,
      target,
      variance: buildVariance(current, target),
      confidence,
    },
    questions,
  };
}

export function mapOrgGovFromResults(input: CoreResultsInput): DomainNode {
  const groups = groupCapabilities(input.capabilities);

  const orderedKeys: CapabilityGroupKey[] = [
    "leadership",
    "governance",
    "compliance",
    "information",
    "process",
    "financial",
  ];

  const elements: ElementNode[] = orderedKeys
    .filter((key) => groups[key].length > 0)
    .map((key) => buildElement(key, groups[key], input));

  const domainWeight = elements.reduce(
    (sum, element) => sum + (element.weight ?? 1),
    0
  );

  const overallCurrent = weightedAvg(
    elements.map((element) => ({
      value: element.score.current,
      weight: element.weight ?? 1,
    }))
  );

  const overallConfidence = weightedAvgPrecise(
    elements.map((element) => ({
      value: element.score.confidence ?? 0,
      weight: element.weight ?? 1,
    })),
    2
  );

  return {
    id: "ORG_GOV",
    title: "Organisation & Governance",
    description:
      "Derived from current CORE assessment outputs and grouped into engineered governance elements.",
    weight: domainWeight,
    score: {
      current: overallCurrent,
      benchmark: 4.0,
      target: 4.4,
      variance: buildVariance(overallCurrent, 4.4),
      confidence: Number(
        (overallConfidence || (input.confidencePct ?? 0) / 100).toFixed(2)
      ),
    },
    elements,
  };
}