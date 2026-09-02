import type { RuntimeTrigger } from "./runtimeTriggers";
import type { CapabilityRuntimeState } from "./runtimeEngine";
import type { RuntimeConfidenceArchitecture } from "./runtimeConfidenceArchitecture";

export type RuntimeAlert = {
  id: string;
  severity: "low" | "medium" | "high";
  title: string;
  message: string;
  capabilityId: string;
  confidenceArchitecture?: RuntimeConfidenceArchitecture;
};

export function buildRuntimeAlerts(
  triggers: RuntimeTrigger[],
  capabilities?: Record<string, CapabilityRuntimeState>,
): RuntimeAlert[] {
  return triggers.map((trigger) => ({
    id: trigger.id,
    severity: trigger.severity,
    title: trigger.title,
    message: trigger.description,
    capabilityId: trigger.capabilityId,
    confidenceArchitecture:
      capabilities?.[trigger.capabilityId]
        ?.confidenceArchitecture,
  }));
}
