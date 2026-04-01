import { SiteTopNav } from "../components/SiteTopNav";

export function MvpStatusPage() {
  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <div className="o-page">
          <SiteTopNav />

          <header className="o-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">MVP status</h1>
              <div className="o-page-tagline">
                Current platform development and release direction
              </div>
            </div>

            <div className="o-page-subtitle">
              The current development phase is focused on OASIS CORE™ as the
              foundational enterprise capability intelligence engine, establishing
              the baseline architecture, interaction model, and decision-support
              outputs required for broader suite expansion.
            </div>
          </header>

          <section className="o-suite-section">
            <div
              className="o-card"
              style={{
                padding: 22,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 18,
              }}
            >
              <StatusBlock
                title="Current capability"
                body="Structured assessment flow, enterprise capability scoring, priority uplift identification, pathway logic, and standards-aligned mapping views are now established in the MVP+ environment."
              />
              <StatusBlock
                title="Working focus"
                body="Current effort is focused on refining the capability intelligence layer, strengthening user experience, improving output clarity, and hardening the platform for pilot, grant, and stakeholder review."
              />
              <StatusBlock
                title="Next release direction"
                body="Next-stage development is expected to include adaptive questioning, richer enterprise intelligence views, stronger evidence logic, and expanded decision-support outputs across the suite."
              />
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-card" style={{ padding: 22, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
                What the MVP is proving
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 18,
                }}
              >
                <StatusBlock
                  title="Assessment logic"
                  body="That structured inputs can be transformed into a defensible enterprise capability baseline."
                />
                <StatusBlock
                  title="Decision value"
                  body="That results can move beyond static maturity scoring into prioritised, evidence-aware capability intelligence."
                />
                <StatusBlock
                  title="Platform extensibility"
                  body="That CORE can operate as the foundation for future modules including PULSE, HORIZON, PATHWAYS, NEXUS, and ATLAS."
                />
              </div>
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-card" style={{ padding: 22 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
                Development roadmap
              </div>

              <div className="o-stack-sm">
                <div className="o-text-body">
                  <strong>Phase 1:</strong> OASIS CORE MVP foundation and baseline assessment logic
                </div>
                <div className="o-text-body">
                  <strong>Phase 2:</strong> Adaptive assessment, enterprise intelligence refinement, and improved user interaction
                </div>
                <div className="o-text-body">
                  <strong>Phase 3:</strong> Standards mapping, reporting maturity, and pilot-ready deployment hardening
                </div>
                <div className="o-text-body">
                  <strong>Phase 4:</strong> Activation of broader OASIS modules and integrated platform expansion
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatusBlock({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
        {title}
      </div>
      <div className="o-text-body">{body}</div>
    </div>
  );
}