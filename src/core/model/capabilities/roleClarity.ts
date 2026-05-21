import type { CoreCapability } from "../coreModel";

export const roleClarityCapability: CoreCapability = {
  id: "gov-role-clarity",

  domainId: "governance-decision-systems",

  elementId: "governance-structure",

  label: "Role Clarity",

  description:
    "Defines whether enterprise roles, responsibilities and accountabilities are formally established, understood and operationally maintained.",

  weight: "high",

  coreQuestions: [
    {
      id: "gov-role-clarity-q1",
      type: "core",
      text:
        "Are roles and responsibilities formally defined for key enterprise functions?",
    },

    {
      id: "gov-role-clarity-q2",
      type: "core",
      text:
        "Are accountabilities consistently understood across teams?",
    },

    {
      id: "gov-role-clarity-q3",
      type: "core",
      text:
        "Are role boundaries clear where functions overlap?",
    },
  ],

  probes: [
    {
      id: "gov-role-clarity-p1",
      text:
        "Are gaps or overlaps in accountability regularly identified?",
    },

    {
      id: "gov-role-clarity-p2",
      text:
        "Are role changes reflected in governance documents and systems?",
    },

    {
      id: "gov-role-clarity-p3",
      text:
        "Are delegated responsibilities actively monitored?",
    },
  ],

  evidence: [
    {
      id: "gov-role-clarity-e1",
      label: "Role descriptions",
      required: true,
    },

    {
      id: "gov-role-clarity-e2",
      label: "RACI matrix",
      required: true,
    },

    {
      id: "gov-role-clarity-e3",
      label: "Delegation framework",
      required: false,
    },

    {
      id: "gov-role-clarity-e4",
      label: "Governance charters",
      required: false,
    },
  ],

  trigger: [
    "low-score",
    "missing-evidence",
    "low-confidence",
  ],

  relationships: [
  {
    targetCapabilityId: "gov-decision-rights",
    type: "enabler",
    influence: 0.72,
    rationale:
      "Role clarity enables clearer decision rights and reduces ambiguity in governance escalation.",
  },
],
};