import type {
  RuntimeResponseSignal,
  RuntimeUserResponse,
} from "./runtimeResponses";

export type AdaptiveProbe = {
  id: string;
  capabilityId: string;
  priority: "low" | "medium" | "high";
  reason: string;
  question: string;
  sourceSignals: RuntimeResponseSignal[];
};

export function buildAdaptiveProbe(
  response: RuntimeUserResponse,
): AdaptiveProbe {
  const signals = response.signals;

  if (signals.includes("asset-data-incomplete")) {
    return {
      id: `${response.capabilityId}-asset-data-follow-up`,
      capabilityId: response.capabilityId,
      priority: "high",
      reason: "Asset information constraint detected",
      question:
        "Which asset classes currently lack complete, trusted, or validated asset information?",
      sourceSignals: signals,
    };
  }

  if (signals.includes("condition-data-untrusted")) {
    return {
      id: `${response.capabilityId}-condition-follow-up`,
      capabilityId: response.capabilityId,
      priority: "high",
      reason: "Condition data trust gap detected",
      question:
        "How frequently is condition data validated, and who is accountable for confirming its reliability?",
      sourceSignals: signals,
    };
  }

  if (signals.includes("authority-handover-gap")) {
    return {
      id: `${response.capabilityId}-handover-follow-up`,
      capabilityId: response.capabilityId,
      priority: "high",
      reason: "Authority handover risk detected",
      question:
        "Which handover requirements are not yet aligned with the receiving authority or operator?",
      sourceSignals: signals,
    };
  }

  if (signals.includes("system-conflict")) {
    return {
      id: `${response.capabilityId}-system-conflict-follow-up`,
      capabilityId: response.capabilityId,
      priority: "high",
      reason: "Cross-system contradiction detected",
      question:
        "Which systems currently disagree, and which source is treated as authoritative for this decision?",
      sourceSignals: signals,
    };
  }

  if (signals.includes("ownership-unclear")) {
    return {
      id: `${response.capabilityId}-ownership-follow-up`,
      capabilityId: response.capabilityId,
      priority: "medium",
      reason: "Ownership ambiguity detected",
      question:
        "Who is accountable for resolving this issue, and where is that accountability documented?",
      sourceSignals: signals,
    };
  }

  if (signals.includes("evidence-missing")) {
    return {
      id: `${response.capabilityId}-evidence-follow-up`,
      capabilityId: response.capabilityId,
      priority: "medium",
      reason: "Evidence gap detected",
      question:
        "What evidence would prove that this capability is operating effectively?",
      sourceSignals: signals,
    };
  }

  if (signals.includes("confidence-low")) {
    return {
      id: `${response.capabilityId}-confidence-follow-up`,
      capabilityId: response.capabilityId,
      priority: "medium",
      reason: "Low confidence response detected",
      question:
        "What uncertainty is preventing a confident assessment of this capability?",
      sourceSignals: signals,
    };
  }

  return {
    id: `${response.capabilityId}-general-follow-up`,
    capabilityId: response.capabilityId,
    priority: "low",
    reason: "General clarification required",
    question:
      "What is the primary constraint preventing this capability from operating effectively?",
    sourceSignals: signals,
  };
}