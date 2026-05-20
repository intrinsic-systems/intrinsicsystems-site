export type CapabilityScoreValue = 0 | 20 | 40 | 60 | 80 | 100;

export type EvidenceLevel = "none" | "claimed" | "documented" | "verified";

export type RiskLevel = "Low" | "Moderate" | "High" | "Unknown";

export type CapabilityResponse = {
  questionId: string;
  score: CapabilityScoreValue;
  confidence?: number; // optional user/system input, 0-100
  evidenceLevel?: EvidenceLevel;
  notes?: string;
  flags?: {
    assumed?: boolean;
    inferred?: boolean;
    inconsistent?: boolean;
  };
};

export type CapabilityQuestionDefinition = {
  id: string;
  label: string;
  weight?: number;
  criticality?: "high" | "medium" | "low";
};

export type CapabilityDefinition = {
  id: string;
  label: string;
  questions: CapabilityQuestionDefinition[];
  weight?: number;
};

export type ElementDefinition = {
  id: string;
  label: string;
  capabilities: CapabilityDefinition[];
  weight?: number;
};

export type DomainDefinition = {
  id: string;
  label: string;
  elements: ElementDefinition[];
  weight?: number;
};

export type QuestionResult = {
  id: string;
  label: string;
  score: number;
  confidence: number;
  evidenceLevel: EvidenceLevel;
  weightedScore: number;
  weightedConfidence: number;
  risk: RiskLevel;
  notes?: string;
};

export type CapabilityResult = {
  id: string;
  label: string;
  score: number;
  confidence: number;
  risk: RiskLevel;
  questions: QuestionResult[];
  narrative: {
    summary: string;
    strengths: string[];
    gaps: string[];
  };
};

export type ElementResult = {
  id: string;
  label: string;
  score: number;
  confidence: number;
  risk: RiskLevel;
  capabilities: CapabilityResult[];
  narrative: {
    summary: string;
    strengths: string[];
    gaps: string[];
  };
};

export type DomainResult = {
  id: string;
  label: string;
  score: number;
  confidence: number;
  risk: RiskLevel;
  elements: ElementResult[];
  narrative: {
    summary: string;
    strengths: string[];
    gaps: string[];
  };
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function weightedAverage(
  items: Array<{ value: number; weight?: number }>
): number {
  const safe = items.filter((item) => Number.isFinite(item.value));
  if (!safe.length) return 0;

  const totalWeight = safe.reduce((sum, item) => sum + (item.weight ?? 1), 0);
  if (totalWeight <= 0) return 0;

  const total = safe.reduce(
    (sum, item) => sum + item.value * (item.weight ?? 1),
    0
  );

  return total / totalWeight;
}

function evidenceWeight(level: EvidenceLevel): number {
  switch (level) {
    case "claimed":
      return 10;
    case "documented":
      return 20;
    case "verified":
      return 30;
    case "none":
    default:
      return 0;
  }
}

function deriveConfidence(response: CapabilityResponse): number {
  const baseConfidence =
    typeof response.confidence === "number" ? response.confidence : 45;

  const evidence = response.evidenceLevel ?? "none";
  const evidenceBonus = evidenceWeight(evidence);

  let penalty = 0;
  if (response.flags?.assumed) penalty += 10;
  if (response.flags?.inferred) penalty += 8;
  if (response.flags?.inconsistent) penalty += 15;

  return clamp(baseConfidence + evidenceBonus - penalty, 20, 100);
}

function deriveRisk(score: number, confidence: number): RiskLevel {
  if (score < 40 && confidence > 70) return "High";
  if (score < 40 && confidence < 50) return "Unknown";
  if (score < 70) return "Moderate";
  if (confidence > 70) return "Low";
  return "Moderate";
}

function capabilityPositionText(score: number): string {
  if (score < 20) return "largely unstructured";
  if (score < 40) return "emerging but inconsistent";
  if (score < 60) return "defined in parts but not yet embedded";
  if (score < 80) return "structured and consistently applied";
  return "strong, integrated, and improving";
}

function buildNarrative(
  label: string,
  score: number,
  confidence: number,
  childItems: Array<{ label: string; score: number }>
) {
  const sorted = [...childItems].sort((a, b) => a.score - b.score);
  const gaps = sorted.slice(0, 2).map((item) => item.label);
  const strengths = [...sorted]
    .reverse()
    .slice(0, 2)
    .filter((item) => item.score >= 60)
    .map((item) => item.label);

  return {
    summary: `${label} is currently ${capabilityPositionText(score)} with ${round(
      confidence
    )}% confidence.`,
    strengths,
    gaps,
  };
}

function buildQuestionResult(
  definition: CapabilityQuestionDefinition,
  responses: Record<string, CapabilityResponse>
): QuestionResult {
  const response = responses[definition.id];

  const score = response?.score ?? 0;
  const confidence = response ? deriveConfidence(response) : 20;
  const evidenceLevel = response?.evidenceLevel ?? "none";
  const weight = definition.weight ?? 1;

  return {
    id: definition.id,
    label: definition.label,
    score,
    confidence,
    evidenceLevel,
    weightedScore: score * weight,
    weightedConfidence: confidence * weight,
    risk: deriveRisk(score, confidence),
    notes: response?.notes,
  };
}

function buildCapabilityResult(
  definition: CapabilityDefinition,
  responses: Record<string, CapabilityResponse>
): CapabilityResult {
  const questions = definition.questions.map((question) =>
    buildQuestionResult(question, responses)
  );

  const score = weightedAverage(
    questions.map((question, index) => ({
      value: question.score,
      weight: definition.questions[index]?.weight ?? 1,
    }))
  );

  const confidence = weightedAverage(
    questions.map((question, index) => ({
      value: question.confidence,
      weight: definition.questions[index]?.weight ?? 1,
    }))
  );

  return {
    id: definition.id,
    label: definition.label,
    score: round(score),
    confidence: round(confidence),
    risk: deriveRisk(score, confidence),
    questions,
    narrative: buildNarrative(
      definition.label,
      score,
      confidence,
      questions.map((q) => ({ label: q.label, score: q.score }))
    ),
  };
}

function buildElementResult(
  definition: ElementDefinition,
  responses: Record<string, CapabilityResponse>
): ElementResult {
  const capabilities = definition.capabilities.map((capability) =>
    buildCapabilityResult(capability, responses)
  );

  const score = weightedAverage(
    capabilities.map((capability, index) => ({
      value: capability.score,
      weight: definition.capabilities[index]?.weight ?? 1,
    }))
  );

  const confidence = weightedAverage(
    capabilities.map((capability, index) => ({
      value: capability.confidence,
      weight: definition.capabilities[index]?.weight ?? 1,
    }))
  );

  return {
    id: definition.id,
    label: definition.label,
    score: round(score),
    confidence: round(confidence),
    risk: deriveRisk(score, confidence),
    capabilities,
    narrative: buildNarrative(
      definition.label,
      score,
      confidence,
      capabilities.map((c) => ({ label: c.label, score: c.score }))
    ),
  };
}

function buildDomainResult(
  definition: DomainDefinition,
  responses: Record<string, CapabilityResponse>
): DomainResult {
  const elements = definition.elements.map((element) =>
    buildElementResult(element, responses)
  );

  const score = weightedAverage(
    elements.map((element, index) => ({
      value: element.score,
      weight: definition.elements[index]?.weight ?? 1,
    }))
  );

  const confidence = weightedAverage(
    elements.map((element, index) => ({
      value: element.confidence,
      weight: definition.elements[index]?.weight ?? 1,
    }))
  );

  return {
    id: definition.id,
    label: definition.label,
    score: round(score),
    confidence: round(confidence),
    risk: deriveRisk(score, confidence),
    elements,
    narrative: buildNarrative(
      definition.label,
      score,
      confidence,
      elements.map((e) => ({ label: e.label, score: e.score }))
    ),
  };
}

export function buildCapabilityEngineResult(args: {
  definition: DomainDefinition;
  responses: Record<string, CapabilityResponse>;
}): DomainResult {
  return buildDomainResult(args.definition, args.responses);
}

/* ------------------------------------------------------------------
   Domain 01 definition
------------------------------------------------------------------- */

export const DOMAIN_01_DEFINITION: DomainDefinition = {
  id: "DOM-01",
  label: "Governance, Accountability & Oversight",
  elements: [
    {
      id: "ELM-01-01",
      label: "Leadership & Direction",
      capabilities: [
        {
          id: "CAP-01-01-01",
          label: "Asset Management Vision Integration",
          questions: [
            {
              id: "Q-D01-E01-C01-01",
              label: "Enterprise Alignment Signal",
            },
            {
              id: "Q-D01-E01-C01-02",
              label: "Strategic Translation Signal",
            },
          ],
        },
        {
          id: "CAP-01-01-02",
          label: "Executive Sponsorship & Ownership",
          questions: [
            {
              id: "Q-D01-E01-C02-01",
              label: "Executive Ownership Signal",
            },
            {
              id: "Q-D01-E01-C02-02",
              label: "Leadership Engagement Signal",
            },
          ],
        },
        {
          id: "CAP-01-01-03",
          label: "Governance Structures & Forums",
          questions: [
            {
              id: "Q-D01-E01-C03-01",
              label: "Governance Framework Signal",
            },
            {
              id: "Q-D01-E01-C03-02",
              label: "Decision Forum Effectiveness",
            },
          ],
        },
      ],
    },
    {
      id: "ELM-01-02",
      label: "Policy & Strategic Alignment",
      capabilities: [
        {
          id: "CAP-01-02-01",
          label: "Asset Management Policy Framework",
          questions: [
            {
              id: "Q-D01-E02-C01-01",
              label: "Policy Definition Signal",
            },
          ],
        },
        {
          id: "CAP-01-02-02",
          label: "Policy Communication & Adoption",
          questions: [
            {
              id: "Q-D01-E02-C02-01",
              label: "Policy Awareness Signal",
            },
          ],
        },
        {
          id: "CAP-01-02-03",
          label: "Policy Review & Evolution",
          questions: [
            {
              id: "Q-D01-E02-C03-01",
              label: "Policy Lifecycle Signal",
            },
          ],
        },
      ],
    },
    {
      id: "ELM-01-03",
      label: "Accountability & Roles",
      capabilities: [
        {
          id: "CAP-01-03-01",
          label: "Defined Roles & Responsibilities",
          questions: [
            {
              id: "Q-D01-E03-C01-01",
              label: "Role Clarity Signal",
            },
          ],
        },
        {
          id: "CAP-01-03-02",
          label: "Accountability Traceability",
          questions: [
            {
              id: "Q-D01-E03-C02-01",
              label: "Accountability Traceability Signal",
            },
          ],
        },
        {
          id: "CAP-01-03-03",
          label: "Decision Authority Clarity",
          questions: [
            {
              id: "Q-D01-E03-C03-01",
              label: "Authority Clarity Signal",
            },
          ],
        },
      ],
    },
    {
      id: "ELM-01-04",
      label: "Strategic Asset Management Planning",
      capabilities: [
        {
          id: "CAP-01-04-01",
          label: "SAMP Development & Structure",
          questions: [
            {
              id: "Q-D01-E04-C01-01",
              label: "SAMP Maturity Signal",
            },
          ],
        },
        {
          id: "CAP-01-04-02",
          label: "Critical Asset Identification",
          questions: [
            {
              id: "Q-D01-E04-C02-01",
              label: "Criticality Definition Signal",
            },
          ],
        },
        {
          id: "CAP-01-04-03",
          label: "Improvement Planning Governance",
          questions: [
            {
              id: "Q-D01-E04-C03-01",
              label: "Improvement Planning Signal",
            },
          ],
        },
        {
          id: "CAP-01-04-04",
          label: "SAMP Review & Reporting",
          questions: [
            {
              id: "Q-D01-E04-C04-01",
              label: "Review & Reporting Signal",
            },
          ],
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------
   Domain 02 definition
------------------------------------------------------------------- */

function mapLegacyIds(ids: string[]): CapabilityQuestionDefinition[] {
  return ids.map((id) => ({
    id,
    label: `Legacy signal ${id}`,
  }));
}

export const DOMAIN_02_DEFINITION: DomainDefinition = {
  id: "DOM-02",
  label: "Strategy, Planning & Decision Support",

  elements: [
    {
      id: "ELM-02-01",
      label: "Service, Demand & Planning Alignment",
      capabilities: [
        {
          id: "CAP-02-01-01",
          label: "Levels of Service Framework",
          questions: mapLegacyIds([
            "1.2.6.21",
            "1.2.6.22",
            "1.2.6.23",
            "1.2.6.24",
          ]),
        },
        {
          id: "CAP-02-01-02",
          label: "Demand Analysis & Future Need",
          questions: mapLegacyIds([
            "1.2.10.38",
            "1.2.10.39",
            "1.2.10.40",
            "3.6.27.97",
          ]),
        },
        {
          id: "CAP-02-01-03",
          label: "Planning Interface Integration",
          questions: mapLegacyIds([
            "1.2.7.25",
            "1.2.7.26",
            "1.2.7.27",
            "1.2.7.28",
            "1.2.7.29",
          ]),
        },
      ],
    },

    {
      id: "ELM-02-02",
      label: "Stakeholder, Communication & Strategic Alignment",
      capabilities: [
        {
          id: "CAP-02-02-01",
          label: "Stakeholder & Communication Strategy",
          questions: mapLegacyIds([
            "1.2.5.15",
            "1.2.5.16",
            "1.2.5.17",
            "1.2.5.18",
            "1.2.5.19",
            "1.2.5.20",
          ]),
        },
        {
          id: "CAP-02-02-02",
          label: "Stakeholder Engagement for Service & Improvement",
          questions: mapLegacyIds([
            "1.2.8.30",
            "1.2.8.31",
            "1.2.8.32",
          ]),
        },
        {
          id: "CAP-02-02-03",
          label: "Strategy & Objective Alignment",
          questions: mapLegacyIds([
            "1.2.10.37",
            "1.2.10.38",
            "1.2.10.39",
            "1.2.10.40",
          ]),
        },
      ],
    },

    {
      id: "ELM-02-03",
      label: "Decision Logic, Standards & Review",
      capabilities: [
        {
          id: "CAP-02-03-01",
          label: "Lifecycle & Operational Decision Support",
          questions: mapLegacyIds([
            "1.2.11.41",
            "1.2.11.42",
            "1.2.11.43",
            "1.2.11.44",
          ]),
        },
        {
          id: "CAP-02-03-02",
          label: "Technical Standards & Compliance Integration",
          questions: mapLegacyIds([
            "1.2.9.33",
            "1.2.9.34",
            "1.2.9.35",
            "1.2.9.36",
          ]),
        },
        {
          id: "CAP-02-03-03",
          label: "Management Review, Audit & Assurance",
          questions: mapLegacyIds([
            "1.2.12.45",
            "1.2.12.46",
          ]),
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------
   Optional helpers for current answer labels
------------------------------------------------------------------- */

export function mapLegacyAnswerLabelToScore(
  label?: string
): CapabilityScoreValue {
  const normalized = (label ?? "").trim().toLowerCase();

  if (!normalized) return 0;

  if (normalized.includes("innocent")) return 20;
  if (normalized.includes("aware")) return 40;
  if (normalized.includes("developing")) return 60;
  if (normalized.includes("competent")) return 80;
  if (normalized.includes("optimising")) return 100;
  if (normalized.includes("excellent")) return 100;

  return 0;
}

export function mapLegacyAnswersToResponses(
  answers: Record<string, string>
): Record<string, CapabilityResponse> {
  return Object.entries(answers).reduce<Record<string, CapabilityResponse>>(
    (acc, [questionId, label]) => {
      acc[questionId] = {
        questionId,
        score: mapLegacyAnswerLabelToScore(label),
        confidence: 55,
        evidenceLevel: "claimed",
      };
      return acc;
    },
    {}
  );
}