import type { AdaptiveProbe } from "./probeTypes";

export const PROBE_LIBRARY: AdaptiveProbe[] = [
  {
    id: "risk-ownership-depth",
    capabilityId: "risk-ownership",
    type: "capability",
    severity: "high",
    question:
      "Are risk ownership responsibilities formally documented, assigned, and actively reviewed?",
    rationale:
      "Low risk ownership weakens accountability and increases governance exposure.",
  },
  {
    id: "role-clarity-depth",
    capabilityId: "gov-role-clarity",
    type: "capability",
    severity: "high",
    question:
      "Are role boundaries clearly defined across governance, delivery, operations, and assurance functions?",
    rationale:
      "Unclear roles reduce decision speed and increase escalation ambiguity.",
  },
  {
    id: "evidence-sufficiency-check",
    capabilityId: "*",
    type: "evidence",
    severity: "medium",
    question:
      "Can the organisation provide current evidence supporting this capability response?",
    rationale:
      "Evidence sufficiency improves confidence and reduces assurance uncertainty.",
  },
];