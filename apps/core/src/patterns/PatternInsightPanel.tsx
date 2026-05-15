// src/patterns/PatternInsightPanel.tsx

type PatternInsightPanelProps = {
  eyebrow?: string;
  title: string;
  points: string[];
  className?: string;
};

export function PatternInsightPanel({
  eyebrow,
  title,
  points,
  className = "",
}: PatternInsightPanelProps) {
  return (
    <section className={["o-pattern-insight", className].filter(Boolean).join(" ")}>
      <div className="o-pattern-insight__head">
        {eyebrow ? (
          <div className="o-pattern-insight__eyebrow">{eyebrow}</div>
        ) : null}

        <h3 className="o-pattern-insight__title">{title}</h3>
      </div>

      <div className="o-pattern-insight__body">
        {points.map((point, index) => (
          <div key={index} className="o-pattern-insight__item">
            {point}
          </div>
        ))}
      </div>
    </section>
  );
}