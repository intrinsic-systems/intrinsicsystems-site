import { createRadialPreviewState } from "../createRadialPreviewState";
import { RadialRuntimeCanvas } from "../../results/components/RadialRuntimeCanvas";

export function RadialRuntimePreview() {
  const radial = createRadialPreviewState();

  return (
    <div style={{ padding: 24 }}>
      <h2>Radial Runtime Preview</h2>

      <RadialRuntimeCanvas
        nodes={radial.nodes.map((node) => ({
          ...node,
          confidence:
            node.confidence === "high"
              ? 0.9
              : node.confidence === "medium"
                ? 0.55
                : 0.25,
        }))}
        links={radial.links}
      />

      {/* <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
        {JSON.stringify(radial, null, 2)}
      </pre> */}
    </div>
  );
}