import { recalculateCapability } from "./recalculateCapability";
import { recalculateDomain } from "./recalculateDomain";
import { recalculateEnterprise } from "./recalculateEnterprise";
import { evaluateTriggers } from "./evaluateTriggers";

export type RuntimeAnswerMutation = {
  capabilityId: string;
  answerId: string;

  score: number;
  confidence: number;

  hasEvidence: boolean;
};

export type CapabilityRuntimeState = {
  capabilityId: string;

  score: number;
  confidence: number;

  evidenceCoverage: number;

  triggers: string[];
  activeProbes: string[];
};

export type EnterpriseRuntimeState = {
  capabilities: Record<string, CapabilityRuntimeState>;
};

export function applyRuntimeMutation(
  runtime: EnterpriseRuntimeState,
  mutation: RuntimeAnswerMutation,
): EnterpriseRuntimeState {
  const capability =
    runtime.capabilities[mutation.capabilityId] ??
    {
      capabilityId: mutation.capabilityId,
      score: 0,
      confidence: 0,
      evidenceCoverage: 0,
      triggers: [],
      activeProbes: [],
    };

  const updatedCapability = recalculateCapability(
    capability,
    mutation,
  );

  const triggeredCapability =
    evaluateTriggers(updatedCapability);

  const updatedRuntime = {
    ...runtime,
    capabilities: {
      ...runtime.capabilities,
      [mutation.capabilityId]: triggeredCapability,
    },
  };

  recalculateDomain(updatedRuntime);
  recalculateEnterprise(updatedRuntime);

  return updatedRuntime;
}