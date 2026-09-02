export type RuntimeSupportState =
  | "unsupported"
  | "provisional"
  | "qualified"
  | "sufficient";

export type RuntimeControlCondition =
  | "contested"
  | "stale"
  | "low-applicability"
  | "material-change";

export type RuntimeNextAction =
  | "collect-evidence"
  | "strengthen-evidence"
  | "resolve-contestation"
  | "refresh-evidence"
  | "substantiate-limitation"
  | "run-change-detection"
  | "monitor";

export type RuntimeConfidenceArchitecture = {
  supportState: RuntimeSupportState;
  controlConditions: RuntimeControlCondition[];
  nextAction: RuntimeNextAction;
};

type RuntimeConfidenceInput = {
  confidence: number;
  evidenceCoverage: number;
  hasEvidence: boolean;
  controlConditions?: RuntimeControlCondition[];
};

function deriveSupportState({
  confidence,
  evidenceCoverage,
  hasEvidence,
}: RuntimeConfidenceInput): RuntimeSupportState {
  if (!hasEvidence) {
    return confidence < 0.35 ? "unsupported" : "provisional";
  }

  if (confidence >= 0.8 && evidenceCoverage >= 80) {
    return "sufficient";
  }

  return "qualified";
}

function deriveNextAction(
  supportState: RuntimeSupportState,
  controlConditions: RuntimeControlCondition[],
): RuntimeNextAction {
  if (controlConditions.includes("contested")) {
    return "resolve-contestation";
  }

  if (controlConditions.includes("stale")) {
    return "refresh-evidence";
  }

  if (controlConditions.includes("material-change")) {
    return "run-change-detection";
  }

  if (controlConditions.includes("low-applicability")) {
    return "substantiate-limitation";
  }

  if (supportState === "unsupported") {
    return "collect-evidence";
  }

  if (
    supportState === "provisional" ||
    supportState === "qualified"
  ) {
    return "strengthen-evidence";
  }

  return "monitor";
}

export function buildRuntimeConfidenceArchitecture(
  input: RuntimeConfidenceInput,
): RuntimeConfidenceArchitecture {
  const controlConditions = Array.from(
    new Set(input.controlConditions ?? []),
  );
  const supportState = deriveSupportState(input);

  return {
    supportState,
    controlConditions,
    nextAction: deriveNextAction(
      supportState,
      controlConditions,
    ),
  };
}

export const runtimeConfidenceLabels = {
  supportState: {
    unsupported: "Unsupported",
    provisional: "Provisional",
    qualified: "Qualified",
    sufficient: "Sufficient",
  },
  controlCondition: {
    contested: "Contested",
    stale: "Stale",
    "low-applicability": "Low applicability",
    "material-change": "Material change",
  },
  nextAction: {
    "collect-evidence": "Collect evidence",
    "strengthen-evidence": "Strengthen evidence",
    "resolve-contestation": "Resolve material conflict",
    "refresh-evidence": "Refresh affected evidence",
    "substantiate-limitation": "Substantiate limitation",
    "run-change-detection": "Run targeted change detection",
    monitor: "Monitor",
  },
} as const;
