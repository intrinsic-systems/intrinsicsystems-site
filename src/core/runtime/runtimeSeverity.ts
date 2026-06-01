export type RuntimeSeverity =
  | "stable"
  | "watch"
  | "degraded"
  | "critical";

export function severityRank(
  severity: RuntimeSeverity,
): number {
  if (severity === "critical") return 4;
  if (severity === "degraded") return 3;
  if (severity === "watch") return 2;
  return 1;
}