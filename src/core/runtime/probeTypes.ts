export type AdaptiveProbeType =
  | "capability"
  | "evidence"
  | "confidence"
  | "dependency";

export type AdaptiveProbe = {
  id: string;
  capabilityId: string;
  type: AdaptiveProbeType;
  severity: "low" | "medium" | "high";
  question: string;
  rationale: string;
  confidenceArchitecture?: import("./runtimeConfidenceArchitecture").RuntimeConfidenceArchitecture;
};
