import { createRadialPreviewState } from "../createRadialPreviewState";

export function RadialRuntimePreview() {
  const radial = createRadialPreviewState();

  return (
    <section className="o-card o-card-pad">
      <div className="o-card-eyebrow">Radial runtime preview</div>
      <h2 className="o-section-heading">Capability graph projection</h2>

      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
        {JSON.stringify(radial, null, 2)}
      </pre>
    </section>
  );
}