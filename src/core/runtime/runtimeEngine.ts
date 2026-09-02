import { recalculateCapability } from "./recalculateCapability";
import { recalculateDomain } from "./recalculateDomain";
import { recalculateEnterprise } from "./recalculateEnterprise";
import { evaluateTriggers } from "./evaluateTriggers";
import { buildRuntimeTriggers } from "./runtimeTriggers";

import type { RuntimeTrigger } from "./runtimeTriggers";
import type {
  RuntimeConfidenceArchitecture,
  RuntimeControlCondition,
} from "./runtimeConfidenceArchitecture";

export type RuntimeAnswerMutation = {
  capabilityId: string;
  answerId: string;

  score: number;
  confidence: number;

  hasEvidence: boolean;
  controlConditions?: RuntimeControlCondition[];
};

export type CapabilityRuntimeState = {
  capabilityId: string;

  score: number;
  confidence: number;
  confidenceArchitecture: RuntimeConfidenceArchitecture;

  hasEvidence: boolean;

  evidenceCoverage: number;

  triggers: string[];
  activeProbes: string[];
};

export type EnterpriseRuntimeState = {
  capabilities: Record<string, CapabilityRuntimeState>;
  enterpriseScore: number;
  triggers: RuntimeTrigger[];
};

export function applyRuntimeMutation(
  runtime: EnterpriseRuntimeState,
  mutation: RuntimeAnswerMutation,
): EnterpriseRuntimeState {
  const capability =
    runtime.capabilities[mutation.capabilityId] ?? {
      capabilityId: mutation.capabilityId,
      score: 0,
      confidence: 0,
      confidenceArchitecture: {
        supportState: "unsupported",
        controlConditions: [],
        nextAction: "collect-evidence",
      },

      hasEvidence: false,

      evidenceCoverage: 0,

      triggers: [],
      activeProbes: [],
    };

  const updatedCapability = recalculateCapability(capability, mutation);

  const triggeredCapability = evaluateTriggers(updatedCapability);

  const updatedRuntime: EnterpriseRuntimeState = {
    ...runtime,
    capabilities: {
      ...runtime.capabilities,
      [mutation.capabilityId]: triggeredCapability,
    },
    enterpriseScore: runtime.enterpriseScore ?? 0,
    triggers: [],
  };

  const triggers = buildRuntimeTriggers(updatedRuntime.capabilities);

  const nextRuntime: EnterpriseRuntimeState = {
    ...updatedRuntime,
    triggers,
  };

  recalculateDomain(nextRuntime);
  recalculateEnterprise(nextRuntime);

  return nextRuntime;
}
