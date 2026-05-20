import type {
  CoreAnswer,
  ConfidenceLevel,
} from "./coreModel";
import type {
  CapabilityResponseState,
  EnterpriseResponseState,
} from "./coreResponseState";
import { determineTriggers } from "./coreTriggers";

function calculateAnswerScore(label: string): number {
  const scores: Record<string, number> = {
    Innocent: 0,
    Aware: 5,
    Developing: 35,
    Competent: 70,
    Optimising: 90,
    Excellent: 100,
  };

  return scores[label] ?? 0;
}

function calculateConfidence(answer: CoreAnswer): ConfidenceLevel {
  if (answer.evidence?.length && answer.evidence.length >= 2) {
    return "high";
  }

  if (answer.evidence?.length) {
    return "medium";
  }

  return "low";
}

export function applyCoreAnswer(
  state: EnterpriseResponseState,
  capabilityId: string,
  questionId: string,
  label: string
): EnterpriseResponseState {
  const score = calculateAnswerScore(label);

  const answer: CoreAnswer = {
    questionId,
    response: label,
    score,
    confidence: "low",
  };

  const confidence = calculateConfidence(answer);
  const triggers = determineTriggers({
    ...answer,
    confidence,
  });

  const existingCapability = state.capabilities.find(
    (capability) => capability.capabilityId === capabilityId
  );

  if (!existingCapability) {
    return {
      ...state,
      capabilities: [
        ...state.capabilities,
        {
          capabilityId,
          coreAnswers: [answer],
          probesTriggered: [],
          evidenceSubmitted: [],
          score,
          confidence,
          triggers,
        },
      ],
    };
  }

  const nextAnswers = [
    ...existingCapability.coreAnswers.filter(
      (item) => item.questionId !== questionId
    ),
    answer,
  ];

  const nextScore = Math.round(
    nextAnswers.reduce((sum, item) => sum + (item.score ?? 0), 0) /
      nextAnswers.length
  );

  return {
    ...state,
    capabilities: state.capabilities.map((capability) =>
      capability.capabilityId === capabilityId
        ? {
            ...capability,
            coreAnswers: nextAnswers,
            score: nextScore,
            confidence,
            triggers,
          }
        : capability
    ),
  };
}