import type { InformationConflict } from "./buildInformationConflicts";

export type PrioritisedConflict = InformationConflict & {
  priority: number;
};

export function buildConflictPriority(
  conflicts: InformationConflict[],
): PrioritisedConflict[] {
  return conflicts
    .map((conflict) => ({
      ...conflict,
      priority:
        conflict.severity === "high"
          ? 90
          : conflict.severity === "medium"
            ? 70
            : 40,
    }))
    .sort((a, b) => b.priority - a.priority);
}