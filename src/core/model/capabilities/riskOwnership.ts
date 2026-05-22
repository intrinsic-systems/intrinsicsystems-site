import type { CoreCapability } from "../coreModel";

export const riskOwnershipCapability: CoreCapability = {
  id: "risk-ownership",
  label: "Risk Ownership",
  domainId: "governance-decision-systems",
  elementId: "governance-structure",
  weight: "high",

  coreQuestions: [
    {
      id: "risk-ownership-q1",
      text: "Are material asset and enterprise risks assigned to clear accountable owners?",
    },
  ],

  probes: [],
  evidence: [],

  relationships: [
    {
      targetCapabilityId: "gov-role-clarity",
      type: "risk-propagation",
      influence: 0.58,
      rationale:
        "Weak risk ownership exposes unclear roles and fragmented accountability.",
    },
  ],
};