import type { RuntimeContext } from "./runtimeContext";

export type EvidenceRequirement = {
  id: string;
  title: string;
  description: string;
  requiredFor: string;
  confidenceImpact: number;
};

export function buildEvidenceRequirements(
  context: RuntimeContext,
): EvidenceRequirement[] {
  const requirements: EvidenceRequirement[] = [];

  if (context.lifecyclePhase === "handover") {
    requirements.push({
      id: "handover-asset-validation",
      title: "As-built asset validation",
      description:
        "Validated as-built asset information aligned to operational and authority handover requirements.",
      requiredFor: "handover readiness",
      confidenceImpact: 0.25,
    });
  }

  if (
    context.assetClass ||
    context.assetType
  ) {
    requirements.push({
      id: "asset-class-condition-evidence",
      title: "Asset condition evidence",
      description:
        "Current condition evidence suitable for lifecycle planning and risk-based decision making.",
      requiredFor: "lifecycle planning",
      confidenceImpact: 0.2,
    });
  }

  if (context.criticality === "critical") {
    requirements.push({
      id: "criticality-assurance-evidence",
      title: "Critical asset assurance evidence",
      description:
        "Evidence confirming the asset information is sufficient for high-consequence operational decisions.",
      requiredFor: "critical asset governance",
      confidenceImpact: 0.3,
    });
  }

  return requirements;
}