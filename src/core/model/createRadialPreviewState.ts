import { createInitialEnterpriseState } from "./createInitialEnterpriseState";
import { applyCoreAnswerAndRecalculate } from "./applyCoreAnswerAndRecalculate";
import { buildRadialRuntimeView } from "./buildRadialRuntimeView";

export function createRadialPreviewState() {
  const initialState = createInitialEnterpriseState();

  const answeredState = applyCoreAnswerAndRecalculate(
    initialState,
    "gov-role-clarity",
    "gov-role-clarity-q1",
    "Developing"
  );

  return buildRadialRuntimeView(answeredState);
}