import { useNavigate } from "react-router-dom";
import { OasisArchitectureDiagram } from "../../suite/OasisArchitectureDiagram";
import { OasisLogo } from "../../components/OasisLogo";
import { MODULES } from "../siteData/modules";
import { SiteTopNav } from "../components/SiteTopNav";

export function OasisSuitePage() {
  const navigate = useNavigate();

  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <main className="o-page o-site-page">
          <SiteTopNav />

          <section className="o-suite-hero-refined">
            <div className="o-suite-hero-refined__copy">
              <div style={{ marginBottom: 18 }}>
                <OasisLogo variant="horizontal" height={72} />
              </div>

              <h1 className="o-page-title" style={{ marginBottom: 8 }}>
                OASIS Suite™
              </h1>

              <div className="o-page-subtitle" style={{ marginBottom: 16 }}>
                Enterprise capability intelligence platform
              </div>

              <p className="o-text-body">
                OASIS helps organisations convert structured capability inputs into
                clearer baseline intelligence, priority signals, and practical uplift
                direction.
              </p>

              <p className="o-text-body">
                The suite begins with OASIS CORE™ as the assessment and capability
                baseline engine, then extends into monitoring, foresight, integration,
                execution support, and spatial intelligence.
              </p>

              <div className="o-action-row">
                <button
                  className="o-btn o-btn--primary"
                  onClick={() => navigate("/core/access")}
                >
                  Request access to OASIS CORE →
                </button>

                <button
                  className="o-btn o-btn--secondary"
                  onClick={() => navigate("/platform")}
                >
                  View platform approach
                </button>
              </div>

              <div className="o-suite-hero-refined__meta">
                <div className="o-suite-meta-card">
                  <div className="o-text-label">Foundation</div>
                  <strong>CORE-first capability model</strong>
                  <div className="o-text-body">
                    Establish a defensible enterprise capability baseline.
                  </div>
                </div>

                <div className="o-suite-meta-card">
                  <div className="o-text-label">Progression</div>
                  <strong>From assessment to intelligence</strong>
                  <div className="o-text-body">
                    Extend from diagnostic insight into action, monitoring, and
                    decision support.
                  </div>
                </div>
              </div>
            </div>

            <div className="o-suite-hero-refined__visual">
              <div className="o-suite-diagram-frame">
                <OasisArchitectureDiagram />
              </div>
            </div>
          </section>

          <section className="o-suite-section">
            <div
              className="o-card"
              style={{
                padding: 22,
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
                gap: 20,
                alignItems: "start",
              }}
            >
              <div>
                <h2 className="o-page-title" style={{ fontSize: 24, margin: 0 }}>
                  What the suite is designed to do
                </h2>

                <div className="o-page-subtitle" style={{ margin: "8px 0 18px" }}>
                  Move beyond one-time assessment toward a repeatable enterprise
                  capability decision layer.
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 18,
                  }}
                >
                  <SuiteBlock
                    label="Baseline"
                    title="Establish capability position"
                    body="Create a structured view of enterprise capability across core domains."
                  />
                  <SuiteBlock
                    label="Intelligence"
                    title="Reveal what matters"
                    body="Translate structured inputs into priority signals and executive insight."
                  />
                  <SuiteBlock
                    label="Progression"
                    title="Extend over time"
                    body="Expand into monitoring, foresight, integration, execution, and spatial context."
                  />
                </div>
              </div>

              <aside className="o-card o-card-pad o-results-priority-card">
                <div className="o-text-label">Executive outcomes</div>
                <h3 className="o-section-heading" style={{ marginTop: 6 }}>
                  Platform value
                </h3>

                <div className="o-signal-list" style={{ marginTop: 0 }}>
                  <div className="o-signal-item">Defensible capability baseline</div>
                  <div className="o-signal-item">Clearer structural constraints</div>
                  <div className="o-signal-item">Prioritised improvement effort</div>
                  <div className="o-signal-item">Repeatable decision support</div>
                </div>
              </aside>
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-page-header">
              <div className="o-page-header-main">
                <h2 className="o-page-title" style={{ fontSize: 28, margin: 0 }}>
                  OASIS modules
                </h2>
              </div>

              <div className="o-page-subtitle">
                Modular by design, with CORE™ establishing the baseline and each
                extension adding a distinct intelligence layer.
              </div>
            </div>

            <div className="o-suite-modules-grid-refined">
              {MODULES.map((module) => (
                <button
                  key={module.title}
                  type="button"
                  className="o-suite-module-card"
                  onClick={() => navigate(`/oasis/${module.slug}`)}
                >
                  <div className="o-suite-module-card__top">
                    <img
                      src={module.icon}
                      alt=""
                      className="o-suite-module-card__icon"
                    />
                    <div className="o-suite-module-card__titleWrap">
                      <div className="o-suite-module-card__eyebrow">OASIS</div>
                      <div className="o-suite-module-card__title">
                        {module.title}
                      </div>
                    </div>
                  </div>

                  <div className="o-suite-module-card__body">
                    {module.description}
                  </div>

                  <div className="o-suite-module-card__cta">View module →</div>
                </button>
              ))}
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-suite-summary-grid">
              <div className="o-card o-card-pad">
                <div className="o-text-label">Assessment anchor</div>
                <h3 className="o-section-heading" style={{ marginTop: 6 }}>
                  CORE™ baseline
                </h3>
                <div className="o-text-body">
                  Establishes the structured capability model required for diagnosis,
                  prioritisation, reporting, and staged uplift.
                </div>
              </div>

              <div className="o-card o-card-pad">
                <div className="o-text-label">Expansion logic</div>
                <h3 className="o-section-heading" style={{ marginTop: 6 }}>
                  Layered intelligence
                </h3>
                <div className="o-text-body">
                  Each module extends the same capability model rather than creating
                  disconnected assessment outputs.
                </div>
              </div>

              <div className="o-card o-card-pad">
                <div className="o-text-label">Platform outcome</div>
                <h3 className="o-section-heading" style={{ marginTop: 6 }}>
                  Persistent decision layer
                </h3>
                <div className="o-text-body">
                  OASIS is designed to support ongoing visibility, comparison, and
                  improvement — not static maturity scoring.
                </div>
              </div>
            </div>
          </section>

          <section className="o-suite-section">
            <div
              className="o-card"
              style={{
                padding: 22,
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
                gap: 20,
                alignItems: "start",
              }}
            >
              <div>
                <div className="o-text-label">MVP+ direction</div>
                <h2 className="o-page-title" style={{ fontSize: 24, margin: "6px 0 10px" }}>
                  Executive capability view
                </h2>

                <div className="o-text-body">
                  The next visual layer will bring the capability model, radar graph,
                  and radial hierarchy together into a clearer executive view of
                  current position, target state, benchmark, variance, and uplift
                  priority.
                </div>
              </div>

              <aside className="o-card o-card-pad o-results-pathway-card">
                <div className="o-text-label">Planned visual output</div>
                <h3 className="o-section-heading" style={{ marginTop: 6 }}>
                  Radial + radar integration
                </h3>

                <div className="o-signal-list" style={{ marginTop: 0 }}>
                  <div className="o-signal-item">Domain-level capability position</div>
                  <div className="o-signal-item">Benchmark and target comparison</div>
                  <div className="o-signal-item">Variance and confidence signals</div>
                  <div className="o-signal-item">Priority uplift pathways</div>
                </div>
              </aside>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SuiteBlock({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="o-text-label" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
        {title}
      </div>
      <div className="o-text-body">{body}</div>
    </div>
  );
}