import type { RuntimeActionQueue } from "./runtimeActionQueue";
import type { RuntimeSeverityState } from "./buildSeverityState";
import type { PrioritisedConflict } from "./buildConflictPriority";

export type RuntimeEnterpriseState = {
  severity: RuntimeSeverityState;
  conflicts: PrioritisedConflict[];
  actionQueue: RuntimeActionQueue;
  summary: string;
};