import { buildAdaptiveProbes } from "./buildAdaptiveProbes";

import type { AdaptiveProbe } from "./probeTypes";
import type { EnterpriseRuntimeState } from "./runtimeEngine";

export function runtimeProbeEngine(
  runtime: EnterpriseRuntimeState,
): AdaptiveProbe[] {
  return buildAdaptiveProbes(runtime.capabilities);
}