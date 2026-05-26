import type { RuntimeAlert } from "./buildRuntimeAlerts";

type Props = {
  alerts: RuntimeAlert[];
};

function getBorderColor(
  severity: RuntimeAlert["severity"],
) {
  if (severity === "high") {
    return "rgba(239,68,68,0.7)";
  }

  if (severity === "medium") {
    return "rgba(245,158,11,0.7)";
  }

  return "rgba(59,130,246,0.7)";
}

export function RuntimeAlertsPanel({
  alerts,
}: Props) {
  return (
    <div
      style={{
        width: 380,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            padding: 16,
            borderRadius: 16,
            border: `1px solid ${getBorderColor(
              alert.severity,
            )}`,
            background:
              "rgba(15,23,42,0.82)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#f8fafc",
              marginBottom: 8,
            }}
          >
            {alert.title}
          </div>

          <div
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: "#94a3b8",
            }}
          >
            {alert.message}
          </div>
        </div>
      ))}
    </div>
  );
}