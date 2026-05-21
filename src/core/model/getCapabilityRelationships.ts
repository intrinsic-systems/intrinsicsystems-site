import { CORE_CAPABILITIES } from "./capabilities";
import type { CapabilityRelationship } from "./coreModel";

export type CapabilityRelationshipView = CapabilityRelationship & {
  sourceCapabilityId: string;
  sourceCapabilityLabel: string;
};

export function getCapabilityRelationships(): CapabilityRelationshipView[] {
  return CORE_CAPABILITIES.flatMap((capability) =>
    (capability.relationships ?? []).map((relationship) => ({
      ...relationship,
      sourceCapabilityId: capability.id,
      sourceCapabilityLabel: capability.label,
    }))
  );
}