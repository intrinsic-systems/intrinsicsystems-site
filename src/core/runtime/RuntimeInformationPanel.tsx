import type { RuntimeInformationGraph } from "./runtimeInformationGraph";

type Props = {
  graph: RuntimeInformationGraph;
};

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function getSeverityColor(severity: string) {
  if (severity === "high") return "#ef4444";
  if (severity === "medium") return "#f59e0b";
  return "#3b82f6";
}

export function RuntimeInformationPanel({
  graph,
}: Props) {
  if (graph.attributes.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        border: "1px solid rgba(168,85,247,0.38)",
        background: "rgba(15,23,42,0.82)",
        width: 380,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#c084fc",
          marginBottom: 8,
        }}
      >
        Operational Truth Review
      </div>

      <div
        style={{
          color: "#f8fafc",
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        Information Trust & Conflict
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            padding: 10,
            borderRadius: 12,
            background: "rgba(15,23,42,0.65)",
            border: "1px solid rgba(148,163,184,0.16)",
          }}
        >
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            Trust Score
          </div>
          <div
            style={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {formatPercent(graph.overallTrustScore)}
          </div>
        </div>

        <div
          style={{
            padding: 10,
            borderRadius: 12,
            background: "rgba(15,23,42,0.65)",
            border: "1px solid rgba(148,163,184,0.16)",
          }}
        >
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            Conflicts
          </div>
          <div
            style={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {graph.conflictCount}
          </div>
        </div>
      </div>

      {graph.conflicts.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 14,
          }}
        >
          {graph.conflicts.map((conflict) => (
            <div
              key={conflict.attribute}
              style={{
                padding: 12,
                borderRadius: 12,
                background: "rgba(15,23,42,0.65)",
                border: `1px solid ${getSeverityColor(
                  conflict.severity,
                )}`,
              }}
            >
              <div
                style={{
                  color: "#f8fafc",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                {conflict.attribute}
              </div>

              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {conflict.description}
              </div>

              <div
                style={{
                  marginTop: 8,
                  color: "#94a3b8",
                  fontSize: 12,
                }}
              >
                Sources: {conflict.sources.join(", ")}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {graph.trustScores.map((item) => (
          <div
            key={`${item.attribute}-${item.actualSource}`}
            style={{
              padding: 10,
              borderRadius: 12,
              background: "rgba(15,23,42,0.55)",
              border:
                item.trusted
                  ? "1px solid rgba(34,197,94,0.28)"
                  : "1px solid rgba(245,158,11,0.32)",
            }}
          >
            <div
              style={{
                color: "#f8fafc",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {item.attribute}
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Source: {item.actualSource}
            </div>

            <div
              style={{
                color: item.trusted ? "#86efac" : "#fbbf24",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Trust: {formatPercent(item.trustScore)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}