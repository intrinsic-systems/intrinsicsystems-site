import type { RuntimeSeverity } from "./runtimeSeverity";

type SeverityInput = {
  enterpriseScore: number;
  conflictCount: number;
  trustScore: number;
  alertCount: number;
};

export type RuntimeSeverityState = {
  severity: RuntimeSeverity;
  label: string;
  summary: string;
};

export function buildSeverityState({
  enterpriseScore,
  conflictCount,
  trustScore,
  alertCount,
}: SeverityInput): RuntimeSeverityState {
  if (
    enterpriseScore < 35 ||
    trustScore < 0.45 ||
    conflictCount >= 3
  ) {
    return {
      severity: "critical",
      label: "Critical Runtime Instability",
      summary:
        "Enterprise coherence, trust, or information conflicts require immediate attention.",
    };
  }

  if (
    enterpriseScore < 55 ||
    trustScore < 0.65 ||
    conflictCount >= 1 ||
    alertCount >= 3
  ) {
    return {
      severity: "degraded",
      label: "Degraded Runtime State",
      summary:
        "Operational strain is present and should be actively investigated.",
    };
  }

  if (
    enterpriseScore < 75 ||
    trustScore < 0.8 ||
    alertCount > 0
  ) {
    return {
      severity: "watch",
      label: "Runtime Watch State",
      summary:
        "The enterprise is operating with manageable uncertainty or emerging risk.",
    };
  }

  return {
    severity: "stable",
    label: "Stable Runtime State",
    summary:
      "Enterprise coherence, trust, and operational signals are currently aligned.",
  };
}