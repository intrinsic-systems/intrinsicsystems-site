import { buildCapabilityAdaptiveProbes } from "./buildCapabilityAdaptiveProbes";

import type { AdaptiveProbe } from "./probeTypes";
import type { EnterpriseRuntimeState } from "./runtimeEngine";

export function runtimeProbeEngine(
  runtime: EnterpriseRuntimeState,
): AdaptiveProbe[] {
  return buildCapabilityAdaptiveProbes(runtime.capabilities);
}