import {
  DOMAIN_01_DEFINITION,
  DOMAIN_02_DEFINITION,
  buildCapabilityEngineResult,
  mapLegacyAnswersToResponses,
  type DomainResult,
  type RiskLevel,
} from "./capabilityEngine";

type LegacyAnswers = Record<string, string>;

export type DomainScoreSummary = {
  id: string;
  label: string;
  scorePct: number;
  confidencePct: number;
  risk: RiskLevel;
};

export type ElementScoreSummary = {
  id: string;
  label: string;
  domainId: string;
  domainLabel: string;
  scorePct: number;
  confidencePct: number;
  risk: RiskLevel;
};

export type CapabilityScoreSummary = {
  id: string;
  label: string;
  domainId: string;
  domainLabel: string;
  elementId: string;
  elementLabel: string;
  scorePct: number;
  confidencePct: number;
  risk: RiskLevel;
};

export type BuildDomainResultsReturn = {
  domains: DomainResult[];
  domainScores: DomainScoreSummary[];
  elementScores: ElementScoreSummary[];
  capabilityScores: CapabilityScoreSummary[];
  overallScorePct: number;
  overallConfidencePct: number;
  overallRisk: RiskLevel;
};

function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function deriveOverallRisk(
  overallScorePct: number,
  overallConfidencePct: number
): RiskLevel {
  if (overallScorePct < 40 && overallConfidencePct > 70) return "High";
  if (overallScorePct < 40 && overallConfidencePct < 50) return "Unknown";
  if (overallScorePct < 70) return "Moderate";
  if (overallConfidencePct > 70) return "Low";
  return "Moderate";
}

function toDomainScoreSummary(domain: DomainResult): DomainScoreSummary {
  return {
    id: domain.id,
    label: domain.label,
    scorePct: round(domain.score),
    confidencePct: round(domain.confidence),
    risk: domain.risk,
  };
}

function toElementScoreSummary(domain: DomainResult): ElementScoreSummary[] {
  return domain.elements.map((element) => ({
    id: element.id,
    label: element.label,
    domainId: domain.id,
    domainLabel: domain.label,
    scorePct: round(element.score),
    confidencePct: round(element.confidence),
    risk: element.risk,
  }));
}

function toCapabilityScoreSummary(
  domain: DomainResult
): CapabilityScoreSummary[] {
  return domain.elements.flatMap((element) =>
    element.capabilities.map((capability) => ({
      id: capability.id,
      label: capability.label,
      domainId: domain.id,
      domainLabel: domain.label,
      elementId: element.id,
      elementLabel: element.label,
      scorePct: round(capability.score),
      confidencePct: round(capability.confidence),
      risk: capability.risk,
    }))
  );
}

export function buildDomainResults(
  answers: LegacyAnswers
): BuildDomainResultsReturn {
  const responses = mapLegacyAnswersToResponses(answers);

/* ------------------------------------------------------------------
   Build DOMAIN Section (DOMAINS 1-2)
------------------------------------------------------------------- */
const domain01 = buildCapabilityEngineResult({
  definition: DOMAIN_01_DEFINITION,
  responses,
});

const domain02 = buildCapabilityEngineResult({
  definition: DOMAIN_02_DEFINITION,
  responses,
});

const domains: DomainResult[] = [domain01, domain02];

  const domainScores = domains
    .map(toDomainScoreSummary)
    .sort((a, b) => a.label.localeCompare(b.label));

  const elementScores = domains
    .flatMap((domain) => toElementScoreSummary(domain))
    .sort((a, b) => a.label.localeCompare(b.label));

  const capabilityScores = domains
    .flatMap((domain) => toCapabilityScoreSummary(domain))
    .sort((a, b) => a.label.localeCompare(b.label));

  const overallScorePct = round(average(domainScores.map((d) => d.scorePct)));
  const overallConfidencePct = round(
    average(domainScores.map((d) => d.confidencePct))
  );
  const overallRisk = deriveOverallRisk(overallScorePct, overallConfidencePct);

  return {
    domains,
    domainScores,
    elementScores,
    capabilityScores,
    overallScorePct,
    overallConfidencePct,
    overallRisk,
  };
}