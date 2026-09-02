import type { RuntimeActionQueue } from "./runtimeActionQueue";
import { RuntimeConfidenceContext } from "./RuntimeConfidenceArchitecturePanel";

type Props = {
  queue: RuntimeActionQueue;
};

function getPriorityLabel(priority: number) {
  if (priority >= 90) return "Critical";
  if (priority >= 75) return "High";
  if (priority >= 55) return "Medium";
  return "Low";
}

export function RuntimeActionQueuePanel({ queue }: Props) {
  if (queue.actions.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        border: "1px solid rgba(248,113,113,0.35)",
        background: "rgba(15,23,42,0.86)",
        color: "#cbd5e1",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#fca5a5",
          marginBottom: 8,
        }}
      >
        Runtime Action Queue
      </div>

      <div
        style={{
          color: "#f8fafc",
          fontWeight: 800,
          marginBottom: 12,
        }}
      >
        Next Recommended Actions
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {queue.actions.slice(0, 4).map((action) => (
          <div
            key={action.id}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.16)",
              background: "rgba(15,23,42,0.62)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#fca5a5",
                marginBottom: 4,
              }}
            >
              {getPriorityLabel(action.priority)} · {action.source}
            </div>

            <div
              style={{
                color: "#f8fafc",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {action.title}
            </div>

            <div
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                color: "#cbd5e1",
              }}
            >
              {action.description}
            </div>
            {action.confidenceArchitecture ? (
              <RuntimeConfidenceContext
                architecture={action.confidenceArchitecture}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
