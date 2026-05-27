import type { RuntimeContext } from "./runtimeContext";
import type { RuntimeQuestion } from "./questionRoutingTypes";

export function buildContextualProbe(
  question: RuntimeQuestion,
  context: RuntimeContext,
): RuntimeQuestion {
  const contextParts = [
    context.assetClass,
    context.assetType,
    context.criticality
      ? `${context.criticality} criticality`
      : undefined,
    context.lifecyclePhase,
    context.geography,
  ].filter(Boolean);

  if (contextParts.length === 0) {
    return question;
  }

  return {
    ...question,
    question: `${question.question} Context: ${contextParts.join(", ")}.`,
  };
}