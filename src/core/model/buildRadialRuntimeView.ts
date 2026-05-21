import { buildRadialCapabilityView } from "./buildRadialCapabilityView";
import { buildRadialRelationshipView } from "./buildRadialRelationshipView";
import type { EnterpriseResponseState } from "./coreResponseState";

export function buildRadialRuntimeView(state: EnterpriseResponseState) {
  return {
    nodes: buildRadialCapabilityView(state),
    links: buildRadialRelationshipView(),
  };
}