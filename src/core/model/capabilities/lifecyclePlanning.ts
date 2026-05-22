import type { CoreCapability } from "../coreModel";

export const lifecyclePlanningCapability: CoreCapability = {
  id: "lifecycle-planning",
  label: "Lifecycle Planning",
  domainId: "governance-decision-systems",
  elementId: "planning-decision-systems",
  weight: "high",

  coreQuestions: [
    {
      id: "lifecycle-planning-q1",
      text: "Are lifecycle plans used to guide asset decisions across planning, delivery, operations, and renewal?",
    },
  ],

  probes: [],
  evidence: [],

  relationships: [
    {
      targetCapabilityId: "risk-ownership",
      type: "influence",
      influence: 0.64,
      rationale:
        "Lifecycle planning strengthens visibility of long-term risk, cost, and performance ownership.",
    },
  ],
};