import type { CoreCapabilityModel } from "../coreModel";

export const governanceDecisionSystems: CoreCapabilityModel = {
  id: "governance-decision-systems",

  label: "Governance & Decision Systems",

  elements: [
    {
      id: "governance-structure",

      label: "Governance Structure",

      capabilities: [
        {
          id: "role-clarity",

          label: "Role Clarity",

          weight: "high",

          trigger: [
            "low_score",
            "unclear_accountability",
            "high_risk_capability",
          ],

          coreQuestions: [
            {
              id: "rc-1",
              text: "Are roles and responsibilities formally defined for key enterprise functions?",
            },
            {
              id: "rc-2",
              text: "Are accountabilities consistently understood across teams?",
            },
            {
              id: "rc-3",
              text: "Are role boundaries clear where functions overlap?",
            },
          ],

          probes: [
            {
              id: "rc-probe-1",
              text: "Are gaps or overlaps in accountability regularly identified?",
            },
            {
              id: "rc-probe-2",
              text: "Are role changes reflected in governance documents and systems?",
            },
            {
              id: "rc-probe-3",
              text: "Are delegated responsibilities actively monitored?",
            },
          ],

          evidence: [
            "Role descriptions",
            "RACI matrix",
            "Delegation framework",
            "Governance charters",
          ],
        },
      ],
    },
  ],
};