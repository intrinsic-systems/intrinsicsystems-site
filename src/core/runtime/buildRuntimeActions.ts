import type { RuntimeAlert } from "./buildRuntimeAlerts";
import type { PrioritisedConflict } from "./buildConflictPriority";
import type { RuntimeSeverityState } from "./buildSeverityState";
import type { CapabilityRuntimeState } from "./runtimeEngine";
import type { RuntimeConfidenceArchitecture } from "./runtimeConfidenceArchitecture";
import {
  getRuntimeConfidenceActionPriority,
  runtimeConfidenceLabels,
} from "./runtimeConfidenceArchitecture";

export type RuntimeAction = {
  id: string;
  title: string;
  description: string;
  priority: number;
  source:
    | "severity"
    | "alert"
    | "conflict"
    | "evidence"
    | "probe"
    | "confidence";
  capabilityId?: string;
  confidenceArchitecture?: RuntimeConfidenceArchitecture;
};

export function buildRuntimeActions({
  severity,
  alerts,
  conflicts,
  capabilities = {},
}: {
  severity: RuntimeSeverityState;
  alerts: RuntimeAlert[];
  conflicts: PrioritisedConflict[];
  capabilities?: Record<string, CapabilityRuntimeState>;
}): RuntimeAction[] {
  const actions: RuntimeAction[] = [];

  if (severity.severity === "critical") {
    actions.push({
      id: "critical-runtime-review",
      title: "Initiate runtime assurance review",
      description:
        "Critical runtime instability detected. Review enterprise coherence, evidence sufficiency, and authoritative information conflicts.",
      priority: 100,
      source: "severity",
    });
  }

  alerts.forEach((alert) => {
    actions.push({
      id: `alert-${alert.id}`,
      title: alert.title,
      description: alert.message,
      priority:
        alert.severity === "high"
          ? 85
          : alert.severity === "medium"
            ? 65
            : 40,
      source: "alert",
      capabilityId: alert.capabilityId,
      confidenceArchitecture:
        alert.confidenceArchitecture,
    });
  });

  conflicts.forEach((conflict) => {
    actions.push({
      id: `conflict-${conflict.attribute}`,
      title: `Resolve ${conflict.attribute} conflict`,
      description:
        "Validate authoritative source, reconcile conflicting values, and confirm operational truth.",
      priority: conflict.priority,
      source: "conflict",
    });
  });

  Object.values(capabilities).forEach((capability) => {
    const architecture = capability.confidenceArchitecture;

    if (architecture.nextAction === "monitor") {
      return;
    }

    const conditions = architecture.controlConditions
      .map(
        (condition) =>
          runtimeConfidenceLabels.controlCondition[condition],
      )
      .join(", ");

    actions.push({
      id: `confidence-${capability.capabilityId}`,
      title:
        runtimeConfidenceLabels.nextAction[
          architecture.nextAction
        ],
      description: conditions
        ? `${runtimeConfidenceLabels.supportState[architecture.supportState]} support with ${conditions} control. Follow the explicit confidence policy action.`
        : `${runtimeConfidenceLabels.supportState[architecture.supportState]} support. Follow the explicit confidence policy action.`,
      priority: getRuntimeConfidenceActionPriority(architecture),
      source: "confidence",
      capabilityId: capability.capabilityId,
      confidenceArchitecture: architecture,
    });
  });

  return actions.sort((a, b) => b.priority - a.priority);
}
