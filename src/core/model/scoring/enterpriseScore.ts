import { buildCapabilityGraph } from "../buildCapabilityGraph";

export function calculateEnterpriseScore() {
  const graph = buildCapabilityGraph();

  const scores = graph.flatMap((domain) =>
    domain.elements.flatMap((element) =>
      element.capabilities.map((capability) => 0)
    )
  );

  if (!scores.length) return 0;

  return Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  );
}