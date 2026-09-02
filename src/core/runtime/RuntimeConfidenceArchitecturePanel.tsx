import {
  runtimeConfidenceLabels,
  type RuntimeConfidenceArchitecture,
} from "./runtimeConfidenceArchitecture";

type Props = {
  architecture: RuntimeConfidenceArchitecture;
};

export function RuntimeConfidenceContext({
  architecture,
}: Props) {
  const controls = architecture.controlConditions.length
    ? architecture.controlConditions
        .map(
          (condition) =>
            runtimeConfidenceLabels.controlCondition[condition],
        )
        .join(", ")
    : "None active";

  return (
    <div
      style={{
        marginTop: 8,
        color: "#94a3b8",
        fontSize: 11,
        lineHeight: 1.5,
      }}
    >
      Support: {runtimeConfidenceLabels.supportState[architecture.supportState]}
      {" · "}Control: {controls}
      {" · "}Action: {runtimeConfidenceLabels.nextAction[architecture.nextAction]}
    </div>
  );
}

function Dimension({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(148,163,184,0.16)",
        background: "rgba(15,23,42,0.62)",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 5 }}>
        {label}
      </div>
      <div style={{ color: accent, fontSize: 14, fontWeight: 750 }}>
        {value}
      </div>
    </div>
  );
}

export function RuntimeConfidenceArchitecturePanel({
  architecture,
}: Props) {
  const conditions = architecture.controlConditions.length
    ? architecture.controlConditions
        .map(
          (condition) =>
            runtimeConfidenceLabels.controlCondition[condition],
        )
        .join(", ")
    : "None active";

  return (
    <div
      style={{
        padding: 18,
        borderRadius: 20,
        border: "1px solid rgba(52,211,153,0.3)",
        background: "rgba(15,23,42,0.86)",
      }}
    >
      <div style={{ color: "#6ee7b7", fontSize: 12, marginBottom: 8 }}>
        Approved Confidence Architecture
      </div>
      <div
        style={{
          color: "#f8fafc",
          fontWeight: 800,
          marginBottom: 12,
        }}
      >
        State, control and action are separate
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <Dimension
          label="Support State"
          value={
            runtimeConfidenceLabels.supportState[
              architecture.supportState
            ]
          }
          accent="#a7f3d0"
        />
        <Dimension
          label="Control Condition"
          value={conditions}
          accent={
            architecture.controlConditions.length
              ? "#fbbf24"
              : "#cbd5e1"
          }
        />
        <Dimension
          label="Next Action"
          value={
            runtimeConfidenceLabels.nextAction[
              architecture.nextAction
            ]
          }
          accent="#93c5fd"
        />
      </div>
    </div>
  );
}
