export type BenchmarkProfileKey =
  | "global-default"
  | "infrastructure-default"
  | "utilities-default"
  | "transport-default"
  | "local-government-default";

export type BenchmarkCapabilityValue = {
  capabilityId: string;
  benchmarkPct: number;
  targetPct: number;
};

export type BenchmarkProfile = {
  key: BenchmarkProfileKey;
  label: string;
  values: BenchmarkCapabilityValue[];
};

const GLOBAL_DEFAULT_VALUES: BenchmarkCapabilityValue[] = [
  { capabilityId: "CAP-01-03-02", benchmarkPct: 22, targetPct: 80 },
  { capabilityId: "CAP-01-02-01", benchmarkPct: 24, targetPct: 80 },
  { capabilityId: "CAP-01-01-01", benchmarkPct: 28, targetPct: 80 },
  { capabilityId: "CAP-01-04-02", benchmarkPct: 27, targetPct: 80 },
  { capabilityId: "CAP-01-03-03", benchmarkPct: 23, targetPct: 80 },
  { capabilityId: "CAP-01-03-01", benchmarkPct: 25, targetPct: 80 },
  { capabilityId: "CAP-01-01-02", benchmarkPct: 29, targetPct: 80 },
  { capabilityId: "CAP-01-01-03", benchmarkPct: 27, targetPct: 80 },
  { capabilityId: "CAP-01-02-02", benchmarkPct: 21, targetPct: 80 },
  { capabilityId: "CAP-01-02-03", benchmarkPct: 24, targetPct: 80 },
  { capabilityId: "CAP-01-04-01", benchmarkPct: 26, targetPct: 80 },
  { capabilityId: "CAP-01-04-04", benchmarkPct: 22, targetPct: 80 },
  { capabilityId: "CAP-01-04-03", benchmarkPct: 20, targetPct: 80 },
];

const profiles: Record<BenchmarkProfileKey, BenchmarkProfile> = {
  "global-default": {
    key: "global-default",
    label: "Global default benchmark",
    values: GLOBAL_DEFAULT_VALUES,
  },
  "infrastructure-default": {
    key: "infrastructure-default",
    label: "Infrastructure benchmark",
    values: GLOBAL_DEFAULT_VALUES.map((item) => ({
      ...item,
      benchmarkPct: Math.min(100, item.benchmarkPct + 4),
    })),
  },
  "utilities-default": {
    key: "utilities-default",
    label: "Utilities benchmark",
    values: GLOBAL_DEFAULT_VALUES.map((item) => ({
      ...item,
      benchmarkPct: Math.min(100, item.benchmarkPct + 6),
    })),
  },
  "transport-default": {
    key: "transport-default",
    label: "Transport benchmark",
    values: GLOBAL_DEFAULT_VALUES.map((item) => ({
      ...item,
      benchmarkPct: Math.min(100, item.benchmarkPct + 3),
    })),
  },
  "local-government-default": {
    key: "local-government-default",
    label: "Local government benchmark",
    values: GLOBAL_DEFAULT_VALUES.map((item) => ({
      ...item,
      benchmarkPct: Math.max(0, item.benchmarkPct - 2),
    })),
  },
};

export function getBenchmarkProfile(
  key: BenchmarkProfileKey = "global-default"
): BenchmarkProfile {
  return profiles[key] ?? profiles["global-default"];
}

export function getBenchmarkValueForCapability(
  capabilityId: string,
  profileKey: BenchmarkProfileKey = "global-default"
): BenchmarkCapabilityValue {
  const profile = getBenchmarkProfile(profileKey);

  return (
    profile.values.find((item) => item.capabilityId === capabilityId) ?? {
      capabilityId,
      benchmarkPct: 25,
      targetPct: 80,
    }
  );
}