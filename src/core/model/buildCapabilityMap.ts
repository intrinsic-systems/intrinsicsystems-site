import { CORE_CAPABILITIES } from "./capabilities";

export function buildCapabilityMap() {
  const capabilityById = Object.fromEntries(
    CORE_CAPABILITIES.map((capability) => [
      capability.id,
      capability,
    ])
  );

  return {
    capabilityById,
  };
}