import type {
  EnterpriseResponseState,
  CapabilityResponseState,
} from "./coreResponseState";

function average(values: number[]): number {
  if (!values.length) {
    return 0;
  }

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) /
      values.length
  );
}

export function recalculateEnterpriseState(
  state: EnterpriseResponseState
): EnterpriseResponseState {
  const capabilityScores = state.capabilities.map(
    (capability: CapabilityResponseState) =>
      capability.score ?? 0
  );

  const enterpriseScore = average(capabilityScores);

  const enterpriseConfidence = average(
    state.capabilities.map((capability) => {
      switch (capability.confidence) {
        case "high":
          return 100;

        case "medium":
          return 60;

        case "low":
        default:
          return 20;
      }
    })
  );

  return {
    ...state,

    enterpriseScore,

    enterpriseConfidence,
  };
}