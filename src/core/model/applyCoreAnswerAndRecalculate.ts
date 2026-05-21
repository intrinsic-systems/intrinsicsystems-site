import { applyCoreAnswer } from "./applyCoreAnswer";
import { recalculateEnterpriseState } from "./recalculateEnterpriseState";
import type { EnterpriseResponseState } from "./coreResponseState";

export function applyCoreAnswerAndRecalculate(
  state: EnterpriseResponseState,
  capabilityId: string,
  questionId: string,
  label: string
): EnterpriseResponseState {
  const nextState = applyCoreAnswer(
    state,
    capabilityId,
    questionId,
    label
  );

  return recalculateEnterpriseState(nextState);
}