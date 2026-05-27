import type { EvidenceRequirement } from "./buildEvidenceRequirements";

type Props = {
  requirements: EvidenceRequirement[];
};

export function RuntimeEvidencePanel({
  requirements,
}: Props) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        border: "1px solid rgba(250,204,21,0.35)",
        background: "rgba(15,23,42,0.82)",
        width: 380,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#facc15",
          marginBottom: 12,
        }}
      >
        Required Evidence
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {requirements.map((item) => (
          <div
            key={item.id}
            style={{
              padding: 12,
              borderRadius: 12,
              border:
                "1px solid rgba(148,163,184,0.18)",
              background:
                "rgba(15,23,42,0.65)",
            }}
          >
            <div
              style={{
                color: "#f8fafc",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                color: "#cbd5e1",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {item.description}
            </div>

            <div
              style={{
                marginTop: 8,
                color: "#93c5fd",
                fontSize: 12,
              }}
            >
              Supports: {item.requiredFor}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}