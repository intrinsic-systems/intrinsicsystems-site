import { SiteTopNav } from "../components/SiteTopNav";

export function PlatformApproachPage() {
  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <div className="o-page">
          <SiteTopNav />

          <header className="o-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">Platform approach</h1>
              <div className="o-page-tagline">
                From structured input to enterprise capability intelligence
              </div>
            </div>

            <div className="o-page-subtitle">
              OASIS transforms structured organisational inputs into a usable
              enterprise capability model, diagnostic intelligence, and
              prioritised improvement direction — creating the foundation for a
              broader modular SaaS platform.
            </div>
          </header>

          <div
            className="o-suite-diagram-panel"
            style={{ padding: 0, marginBottom: 24 }}
          >
            <img
              src="/site/platform-adaptive-engine.png"
              alt="OASIS adaptive capability intelligence model"
              style={{
                width: "100%",
                display: "block",
                borderRadius: 24,
                objectFit: "cover",
              }}
            />
          </div>

          <div
            className="o-card"
            style={{
              padding: 24,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 18,
              marginBottom: 16,
            }}
          >
            <StepBlock
              title="1. Structured interaction layer"
              body="Users provide structured responses describing organisational practice across governance, planning, delivery, lifecycle, risk, information, and performance."
            />
            <StepBlock
              title="2. Adaptive assessment logic"
              body="Assessment depth can expand or contract based on response patterns, preserving analytic value while reducing unnecessary duplication over time."
            />
            <StepBlock
              title="3. Enterprise capability model"
              body="Responses are mapped into a structured enterprise capability architecture that reflects how the organisation is intended to operate in practice."
            />
            <StepBlock
              title="4. Intelligence and uplift outputs"
              body="The platform produces capability profiles, priority signals, standards-aligned views, and structured uplift pathways that support clearer decision-making."
            />
          </div>

          <div className="o-card" style={{ padding: 24 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 18,
              }}
            >
              <StepBlock
                title="Relational capability structure"
                body="The model is designed to move beyond one-question-per-topic logic toward linked relationships across enterprise, domain, element, and evidence layers."
              />
              <StepBlock
                title="Evidence-aware interpretation"
                body="Capability position can progressively incorporate confidence, answer strength, evidence status, and organisational context to improve interpretive value."
              />
              <StepBlock
                title="Decision-layer foundation"
                body="Outputs are intended to support leadership review, program planning, standards mapping, investment sequencing, and expansion into future OASIS modules."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepBlock({
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