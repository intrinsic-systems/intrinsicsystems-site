export type RuntimeContext = {
  domain?: string;
  capabilityId?: string;

  assetClass?: string;
  assetType?: string;
  criticality?: "low" | "medium" | "high" | "critical";

  geography?: string;
  operatingEnvironment?: string;
  lifecyclePhase?:
    | "planning"
    | "design"
    | "delivery"
    | "handover"
    | "operations"
    | "renewal";
};