import { applyEvidence } from "./applyEvidence";
import { recalculateEnterpriseState } from "./recalculateEnterpriseState";
import type { EnterpriseResponseState } from "./coreResponseState";

export function applyEvidenceAndRecalculate(
  state: EnterpriseResponseState,
  capabilityId: string,
  evidenceId: string
): EnterpriseResponseState {
  const nextState = applyEvidence(state, capabilityId, evidenceId);

  return recalculateEnterpriseState(nextState);
}