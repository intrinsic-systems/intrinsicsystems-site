import type { CollectionWorkflow } from "./buildCollectionWorkflow";

type Props = {
  workflow: CollectionWorkflow;
};

export function RuntimeCollectionWorkflowPanel({
  workflow,
}: Props) {
  if (workflow.steps.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        border: "1px solid rgba(34,197,94,0.35)",
        background: "rgba(15,23,42,0.82)",
        width: 380,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#86efac",
          marginBottom: 8,
        }}
      >
        Collection Workflow
      </div>

      <div
        style={{
          color: "#f8fafc",
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        {workflow.title}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {workflow.steps.map((step) => (
          <div
            key={step.id}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(15,23,42,0.65)",
            }}
          >
            <div
              style={{
                color: "#f8fafc",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              {step.title}
            </div>

            <div
              style={{
                color: "#cbd5e1",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}