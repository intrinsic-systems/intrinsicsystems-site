// src/patterns/PatternMetricCard.tsx

type PatternMetricCardProps = {
  label: string;
  value: string;
  tone?: "neutral" | "info" | "success" | "warning";
  active?: boolean;
  onClick?: () => void;
};

export function PatternMetricCard({
  label,
  value,
  tone = "neutral",
  active = false,
  onClick,
}: PatternMetricCardProps) {
  return (
    <button
      type="button"
      className={[
        "o-pattern-metric",
        `o-pattern-metric--${tone}`,
        active ? "is-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
    >
      <div className="o-card-eyebrow">{label}</div>
      <div className="o-pattern-metric__value">{value}</div>
    </button>
  );
}