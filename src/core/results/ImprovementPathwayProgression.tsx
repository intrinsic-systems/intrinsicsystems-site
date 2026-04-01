type PathwayItem = {
  id: string;
  label: string;
  scorePct: number;
};

type Props = {
  items: PathwayItem[];
  title?: string;
  subtitle?: string;
};

function getBandLabel(scorePct: number) {
  if (scorePct < 20) return "Foundational";
  if (scorePct < 40) return "Control";
  if (scorePct < 60) return "Discipline";
  return "Integration";
}

function getBandClass(scorePct: number) {
  if (scorePct < 20) return "o-pathway-progress__band--critical";
  if (scorePct < 40) return "o-pathway-progress__band--watch";
  if (scorePct < 60) return "o-pathway-progress__band--moderate";
  return "o-pathway-progress__band--strong";
}

export function ImprovementPathwayProgression({
  items,
  title = "Capability progression model",
  subtitle = "Ordered view of the next capability areas requiring structured uplift.",
}: Props) {
  const safeItems = [...items]
    .sort((a, b) => a.scorePct - b.scorePct)
    .slice(0, 5);

  if (!safeItems.length) return null;

  return (
    <section className="o-card o-card-pad">
      <div className="o-results-section-header">
        <h2 className="o-section-heading">{title}</h2>
        <div className="o-text-small">{subtitle}</div>
      </div>

      <div className="o-pathway-progress">
        {safeItems.map((item, index) => (
          <div key={item.id} className="o-pathway-progress__row">
            <div className="o-pathway-progress__step">
              <span>{index + 1}</span>
            </div>

            <div className="o-pathway-progress__content">
              <div className="o-pathway-progress__topline">
                <div className="o-pathway-progress__title-wrap">
                  <div className="o-pathway-progress__label">{item.label}</div>
                  <div
                    className={`o-pathway-progress__band ${getBandClass(
                      item.scorePct
                    )}`}
                  >
                    {getBandLabel(item.scorePct)}
                  </div>
                </div>

                <div className="o-pathway-progress__value">
                  {item.scorePct}%
                </div>
              </div>

              <div className="o-pathway-progress__track">
                <div
                  className="o-pathway-progress__fill"
                  style={{
                    width: `${Math.max(4, Math.min(100, item.scorePct))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}