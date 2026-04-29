export type CoreNetworkCapabilityValue = {
  capabilityId: string;
  corePct: number;
};

const CORE_NETWORK_SEEDED_VALUES: CoreNetworkCapabilityValue[] = [
  { capabilityId: "CAP-01-03-02", corePct: 18 },
  { capabilityId: "CAP-01-02-01", corePct: 20 },
  { capabilityId: "CAP-01-01-01", corePct: 21 },
  { capabilityId: "CAP-01-04-02", corePct: 19 },
  { capabilityId: "CAP-01-03-03", corePct: 18 },
  { capabilityId: "CAP-01-03-01", corePct: 20 },
  { capabilityId: "CAP-01-01-02", corePct: 22 },
  { capabilityId: "CAP-01-01-03", corePct: 20 },
  { capabilityId: "CAP-01-02-02", corePct: 17 },
  { capabilityId: "CAP-01-02-03", corePct: 18 },
  { capabilityId: "CAP-01-04-01", corePct: 21 },
  { capabilityId: "CAP-01-04-04", corePct: 19 },
  { capabilityId: "CAP-01-04-03", corePct: 17 },
];

export function getCoreNetworkValueForCapability(
  capabilityId: string
): number {
  return (
    CORE_NETWORK_SEEDED_VALUES.find((item) => item.capabilityId === capabilityId)
      ?.corePct ?? 20
  );
}