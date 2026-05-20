import { getCapabilityLevel } from "./capabilityScale";

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

const MATURITY_SEGMENTS = [
  { label: "Initial", start: 0, end: 10, className: "o-pathway-progress__segment--initial" },
  { label: "Aware", start: 10, end: 25, className: "o-pathway-progress__segment--aware" },
  { label: "Developing", start: 25, end: 45, className: "o-pathway-progress__segment--developing" },
  { label: "Competent", start: 45, end: 65, className: "o-pathway-progress__segment--competent" },
  { label: "Optimising", start: 65, end: 85, className: "o-pathway-progress__segment--optimising" },
  { label: "Leading", start: 85, end: 100, className: "o-pathway-progress__segment--leading" },
];

function getBandLabel(scorePct: number) {
  if (scorePct < 10) return "Initial";
  if (scorePct < 25) return "Aware";
  if (scorePct < 45) return "Developing";
  if (scorePct < 65) return "Competent";
  if (scorePct < 85) return "Optimising";
  return "Leading";
}

function clampPct(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function ImprovementPathwayProgression({
  items,
  title = "Recommended uplift sequence",
  subtitle = "Structured improvement order shown against the full maturity pathway.",
}: Props) {
  const safeItems = [...items]
    .sort((a, b) => a.scorePct - b.scorePct)
    .slice(0, 5);

  if (!safeItems.length) return null;

  return (
    <section className="o-card o-card-pad o-pathway-progress-card">
      <div className="o-results-section-header o-results-section-header--left">
        <div>
          <div className="o-card-eyebrow">Improvement sequence</div>
          <h2 className="o-section-heading">{title}</h2>
        </div>
        <div className="o-text-small">{subtitle}</div>
      </div>

      <div className="o-pathway-progress o-pathway-progress--segmented">
        {safeItems.map((item, index) => {
          const markerLeft = clampPct(item.scorePct);
          const bandLabel = getBandLabel(item.scorePct);

          return (
            <article key={item.id} className="o-pathway-progress__row">
              <div className="o-pathway-progress__step">
                <span>{index + 1}</span>
              </div>

              <div className="o-pathway-progress__content">
                <div className="o-pathway-progress__topline">
                  <div className="o-pathway-progress__title-wrap">
                    <div className="o-pathway-progress__label">{item.label}</div>
                    <div className="o-pathway-progress__meta">
                      <span className="o-pathway-progress__descriptor">
                        {getCapabilityLevel(item.scorePct)} capability level
                      </span>
                    </div>
                  </div>

                  <div className="o-pathway-progress__stat-card">
                    <div className="o-pathway-progress__stat-label">Current</div>
                    <div className="o-pathway-progress__stat-value">
                      {item.scorePct}%
                    </div>
                  </div>
                </div>

                <div className="o-pathway-progress__rail-wrap">
                  <div className="o-pathway-progress__rail">
                    {MATURITY_SEGMENTS.map((segment) => (
                      <div
                        key={segment.label}
                        className={`o-pathway-progress__segment ${segment.className}`}
                        style={{
                          width: `${segment.end - segment.start}%`,
                        }}
                        title={`${segment.label} (${segment.start}%–${segment.end}%)`}
                      />
                    ))}

                    <div
                      className="o-pathway-progress__marker"
                      style={{ left: `${markerLeft}%` }}
                      aria-hidden="true"
                    >
                      <div className="o-pathway-progress__marker-value">
                        {item.scorePct}%
                      </div>
                      <div className="o-pathway-progress__marker-pin" />
                    </div>
                  </div>

                  <div className="o-pathway-progress__scale">
                    {MATURITY_SEGMENTS.map((segment) => (
                      <div
                        key={segment.label}
                        className="o-pathway-progress__scale-label"
                        style={{
                          width: `${segment.end - segment.start}%`,
                        }}
                      >
                        {segment.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}