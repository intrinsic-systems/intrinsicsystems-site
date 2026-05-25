import type { EnterpriseRuntimeState } from "./runtimeEngine";

export function recalculateDomain(
  runtime: EnterpriseRuntimeState,
) {
  const capabilities =
    Object.values(runtime.capabilities);

  const avg =
    capabilities.reduce(
      (sum, item) => sum + item.score,
      0,
    ) / Math.max(capabilities.length, 1);

  console.log("Domain recalculated:", avg);
}