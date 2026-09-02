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

export const runtimeConfidenceProbeQuestions: Record<
  RuntimeNextAction,
  string
> = {
  "collect-evidence":
    "What evidence can establish an initial basis for this capability claim?",
  "strengthen-evidence":
    "What additional evidence would strengthen the current capability claim?",
  "resolve-contestation":
    "Which material conflict must be resolved, and which source is authoritative?",
  "refresh-evidence":
    "Which affected evidence must be refreshed before this claim is relied upon?",
  "substantiate-limitation":
    "What evidence substantiates the claimed applicability limitation?",
  "run-change-detection":
    "What changed, which claims are affected, and what targeted evidence is needed to revalidate them?",
  monitor:
    "What signal would indicate that this supported claim requires renewed attention?",
};

export function getRuntimeConfidenceActionPriority(
  architecture: RuntimeConfidenceArchitecture,
): number {
  if (architecture.controlConditions.length) return 88;
  if (architecture.supportState === "unsupported") return 78;
  return architecture.nextAction === "monitor" ? 20 : 58;
}
