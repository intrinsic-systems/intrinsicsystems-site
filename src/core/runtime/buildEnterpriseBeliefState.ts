import { buildConflictPriority } from "./buildConflictPriority";
import { buildRuntimeActions } from "./buildRuntimeActions";
import { buildSeverityState } from "./buildSeverityState";
import { runtimeActionQueue } from "./runtimeActionQueue";

import type { RuntimeAlert } from "./buildRuntimeAlerts";
import type { RuntimeInformationGraph } from "./runtimeInformationGraph";
import type { RuntimeEnterpriseState } from "./runtimeEnterpriseState";
import type { CapabilityRuntimeState } from "./runtimeEngine";

export function buildEnterpriseBeliefState({
  enterpriseScore,
  alerts,
  informationGraph,
  capabilities = {},
}: {
  enterpriseScore: number;
  alerts: RuntimeAlert[];
  informationGraph: RuntimeInformationGraph;
  capabilities?: Record<string, CapabilityRuntimeState>;
}): RuntimeEnterpriseState {
  const conflicts = buildConflictPriority(
    informationGraph.conflicts,
  );

  const severity = buildSeverityState({
    enterpriseScore,
    conflictCount: informationGraph.conflictCount,
    trustScore: informationGraph.overallTrustScore,
    alertCount: alerts.length,
  });

  const actions = buildRuntimeActions({
    severity,
    alerts,
    conflicts,
    capabilities,
  });

  const actionQueue = runtimeActionQueue(actions);

  return {
    severity,
    conflicts,
    actionQueue,
    summary: severity.summary,
  };
}
