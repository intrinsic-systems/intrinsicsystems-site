import type { CoreCapability } from "../coreModel";

export const escalationGovernanceCapability: CoreCapability = {
  id: "gov-escalation-governance",
  label: "Escalation Governance",
  domainId: "governance-decision-systems",
  elementId: "governance-structure",
  weight: "medium",

  coreQuestions: [
    {
      id: "gov-escalation-governance-q1",
      text: "Are escalation pathways clearly defined when decisions cannot be resolved at the operating level?",
    },
  ],

  probes: [],
  evidence: [],

  relationships: [
    {
      targetCapabilityId: "risk-ownership",
      type: "influence",
      influence: 0.61,
      rationale:
        "Escalation clarity improves risk ownership and reduces unresolved accountability gaps.",
    },
  ],
};