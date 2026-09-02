import type { EvidenceRequirement } from "./buildEvidenceRequirements";
import type { RuntimeContext } from "./runtimeContext";
import type { RuntimeConfidenceArchitecture } from "./runtimeConfidenceArchitecture";

export type CollectionWorkflowStep = {
  id: string;
  title: string;
  description: string;
  confidenceArchitecture?: RuntimeConfidenceArchitecture;
};

export type CollectionWorkflow = {
  id: string;
  title: string;
  context: RuntimeContext;
  steps: CollectionWorkflowStep[];
  confidenceArchitecture?: RuntimeConfidenceArchitecture;
};

export function buildCollectionWorkflow(
  context: RuntimeContext,
  requirements: EvidenceRequirement[],
): CollectionWorkflow {
  return {
    id: "runtime-collection-workflow",
    title: "Targeted Runtime Evidence Collection",
    context,
    confidenceArchitecture:
      requirements.find(
        (requirement) => requirement.confidenceArchitecture,
      )?.confidenceArchitecture,
    steps: requirements.map((requirement, index) => ({
      id: `${requirement.id}-step`,
      title: `${index + 1}. ${requirement.title}`,
      description: requirement.description,
      confidenceArchitecture:
        requirement.confidenceArchitecture,
    })),
  };
}
