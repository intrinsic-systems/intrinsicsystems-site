import type { CoreCapability } from "../coreModel";

export const decisionRightsCapability: CoreCapability = {
  id: "gov-decision-rights",
  label: "Decision Rights",
  domainId: "governance-decision-systems",
  elementId: "governance-structure",
  weight: "high",

  coreQuestions: [
    {
      id: "gov-decision-rights-q1",
      text: "Are decision rights clearly defined for key enterprise and asset management decisions?",
    },
  ],

  probes: [],
  evidence: [],

  relationships: [
    {
      targetCapabilityId: "gov-escalation-governance",
      type: "enabler",
      influence: 0.68,
      rationale:
        "Clear decision rights reduce escalation ambiguity and improve governance flow.",
    },
  ],
};