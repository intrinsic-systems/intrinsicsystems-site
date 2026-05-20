import { CORE_DOMAINS } from "./domains";

export function buildCapabilityGraph() {
  return CORE_DOMAINS.map((domain) => ({
    ...domain,

    elements: domain.elements.map((element) => ({
      ...element,

      capabilities: element.capabilities.map((capability) => ({
        ...capability,
      })),
    })),
  }));
}