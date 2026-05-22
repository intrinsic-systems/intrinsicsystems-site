import type { CoreCapability } from "../coreModel";

export const assetInformationStrategyCapability: CoreCapability = {
  id: "info-asset-information-strategy",
  label: "Asset Information Strategy",
  domainId: "governance-decision-systems",
  elementId: "information-governance",
  weight: "high",

  coreQuestions: [
    {
      id: "info-asset-information-strategy-q1",
      text: "Is there a defined asset information strategy aligned to enterprise decision-making needs?",
    },
  ],

  probes: [],
  evidence: [],

  relationships: [
    {
      targetCapabilityId: "lifecycle-planning",
      type: "enabler",
      influence: 0.76,
      rationale:
        "Asset information strategy enables stronger lifecycle planning, forecasting, and investment decisions.",
    },
  ],
};