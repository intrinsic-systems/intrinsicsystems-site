import type { RuntimeAlert } from "./buildRuntimeAlerts";
import type { PrioritisedConflict } from "./buildConflictPriority";
import type { RuntimeSeverityState } from "./buildSeverityState";

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
    | "probe";
};

export function buildRuntimeActions({
  severity,
  alerts,
  conflicts,
}: {
  severity: RuntimeSeverityState;
  alerts: RuntimeAlert[];
  conflicts: PrioritisedConflict[];
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

  return actions.sort((a, b) => b.priority - a.priority);
}