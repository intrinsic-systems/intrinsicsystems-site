import type { RuntimeTrigger } from "./runtimeTriggers";

export type RuntimeAlert = {
  id: string;
  severity: "low" | "medium" | "high";
  title: string;
  message: string;
};

export function buildRuntimeAlerts(
  triggers: RuntimeTrigger[],
): RuntimeAlert[] {
  return triggers.map((trigger) => ({
    id: trigger.id,
    severity: trigger.severity,
    title: trigger.title,
    message: trigger.description,
  }));
}