import type { EvidenceRequirement } from "./buildEvidenceRequirements";
import type { RuntimeContext } from "./runtimeContext";

export type CollectionWorkflowStep = {
  id: string;
  title: string;
  description: string;
};

export type CollectionWorkflow = {
  id: string;
  title: string;
  context: RuntimeContext;
  steps: CollectionWorkflowStep[];
};

export function buildCollectionWorkflow(
  context: RuntimeContext,
  requirements: EvidenceRequirement[],
): CollectionWorkflow {
  return {
    id: "runtime-collection-workflow",
    title: "Targeted Runtime Evidence Collection",
    context,
    steps: requirements.map((requirement, index) => ({
      id: `${requirement.id}-step`,
      title: `${index + 1}. ${requirement.title}`,
      description: requirement.description,
    })),
  };
}