import { SiteTopNav } from "../components/SiteTopNav";

export function MvpStatusPage() {
  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <main className="o-page o-site-page">
          <SiteTopNav />

          <header className="o-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">MVP status</h1>
              <div className="o-page-tagline">
                Pilot refinement and CORE-first platform readiness
              </div>
            </div>

            <div className="o-page-subtitle">
              Current development is focused on strengthening OASIS CORE™ as the
              foundational capability baseline engine and preparing the platform
              for pilot use, stakeholder review, and broader suite expansion.
            </div>
          </header>

          <section className="o-site-split-card">
            <div>
              <h2 className="o-section-heading">What is being proven</h2>
              <p className="o-text-body">
                The MVP is proving that structured organisational inputs can be
                converted into a defensible enterprise capability baseline, then
                extended into practical decision support.
              </p>
              <p className="o-text-body">
                The priority is not feature volume. The priority is confidence:
                clear assessment logic, credible outputs, inspectable capability
                views, and a stronger basis for pilot conversations.
              </p>
            </div>

            <aside className="o-card o-card-pad o-results-priority-card">
              <div className="o-text-label">Current release focus</div>
              <h3 className="o-section-heading">What is being strengthened now</h3>
              <div className="o-signal-list">
                <div className="o-signal-item">Assessment structure and scoring integrity</div>
                <div className="o-signal-item">Executive output clarity</div>
                <div className="o-signal-item">Inspection views and reporting logic</div>
                <div className="o-signal-item">Pilot and stakeholder readiness</div>
              </div>
            </aside>
          </section>

          <section className="o-suite-section">
            <div className="o-page-header">
              <h2 className="o-page-title o-site-section-title">
                Current platform position
              </h2>
              <div className="o-page-subtitle">
                The MVP already demonstrates the core platform logic required for
                enterprise capability intelligence.
              </div>
            </div>

            <div className="o-site-card-grid o-site-card-grid--three">
              <StatusBlock
                label="Established"
                title="Capability assessment flow"
                body="Structured assessment, scoring, uplift signals, and standards-aligned mapping views are operating in the MVP environment."
              />
              <StatusBlock
                label="Working focus"
                title="Capability intelligence layer"
                body="Current effort is improving output clarity, interaction quality, supporting views, and executive interpretation."
              />
              <StatusBlock
                label="Release direction"
                title="Pilot-ready refinement"
                body="Next-stage work is focused on stronger inspection logic, better reporting views, and greater confidence for pilot use."
              />
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-page-header">
              <h2 className="o-page-title o-site-section-title">
                What the MVP validates
              </h2>
              <div className="o-page-subtitle">
                The objective is to validate the platform model, not just present
                interface components.
              </div>
            </div>

            <div className="o-site-card-grid o-site-card-grid--three">
              <StatusBlock
                label="Assessment logic"
                title="Structured baseline generation"
                body="Enterprise inputs can be converted into a defensible capability baseline across domains, elements, and drivers."
              />
              <StatusBlock
                label="Decision value"
                title="Beyond static maturity scoring"
                body="Results can be transformed into inspectable, evidence-aware capability intelligence rather than a single summary label."
              />
              <StatusBlock
                label="Platform model"
                title="CORE-first extensibility"
                body="OASIS CORE™ can act as the foundational engine for future PULSE, HORIZON, PATHWAYS, NEXUS, and ATLAS modules."
              />
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-site-split-card">
              <div>
                <div className="o-text-label">Roadmap</div>
                <h2 className="o-section-heading">Development direction</h2>

                <div className="o-stack-sm">
                  <RoadmapLine
                    phase="Phase 1"
                    text="CORE™ foundation, baseline assessment logic, scoring, and initial reporting."
                  />
                  <RoadmapLine
                    phase="Phase 2"
                    text="Improved interaction model, adaptive assessment direction, and executive capability views."
                  />
                  <RoadmapLine
                    phase="Phase 3"
                    text="Reporting maturity, evidence logic, pilot hardening, and standards-aligned refinement."
                  />
                  <RoadmapLine
                    phase="Phase 4"
                    text="Broader suite activation across monitoring, foresight, integration, execution, and spatial intelligence."
                  />
                </div>
              </div>

              <aside className="o-card o-card-pad o-results-pathway-card">
                <div className="o-text-label">Near-term objective</div>
                <h3 className="o-section-heading">What success looks like</h3>
                <div className="o-signal-list">
                  <div className="o-signal-item">Clear, inspectable executive outputs</div>
                  <div className="o-signal-item">Greater confidence in capability interpretation</div>
                  <div className="o-signal-item">Pilot-ready platform experience</div>
                  <div className="o-signal-item">Stronger basis for grant and stakeholder review</div>
                </div>
              </aside>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatusBlock({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="o-card o-card-pad">
      <div className="o-text-label">{label}</div>
      <h3 className="o-section-heading">{title}</h3>
      <div className="o-text-body">{body}</div>
    </div>
  );
}

function RoadmapLine({ phase, text }: { phase: string; text: string }) {
  return (
    <div className="o-text-body">
      <strong>{phase}:</strong> {text}
    </div>
  );
}