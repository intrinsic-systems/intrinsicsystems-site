import { SiteTopNav } from "../components/SiteTopNav";

export function WhatWeDoPage() {
  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <div className="o-page">
          <SiteTopNav />

          <header className="o-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">What we do</h1>
              <div className="o-page-tagline">Enterprise capability intelligence</div>
            </div>

            <div className="o-page-subtitle">
              We help organisations understand structural performance, systemic
              risk, and where capability uplift should be focused.
            </div>
          </header>

          <div className="o-card" style={{ padding: 24 }}>
            <p className="o-text-body" style={{ marginTop: 0, marginBottom: 12 }}>
              Intrinsic Systems develops enterprise capability intelligence
              platforms for asset-intensive and operationally complex
              organisations.
            </p>

            <p className="o-text-body" style={{ marginBottom: 12 }}>
              Our work sits above systems and below strategy — at the structural
              layer where governance, planning, lifecycle delivery, information,
              risk, performance, and organisational capability intersect.
            </p>

            <p className="o-text-body" style={{ marginBottom: 0 }}>
              Rather than replacing enterprise systems, we provide the
              intelligence layer that helps leadership teams understand how the
              organisation is actually functioning, where constraints exist, and
              how improvement effort should be prioritised.
            </p>
          </div>

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
              <CapabilityBlock
                title="Capability profiling"
                body="Generate a structured picture of organisational capability across enterprise domains."
              />
              <CapabilityBlock
                title="Constraint identification"
                body="Surface structural weaknesses that are limiting broader enterprise performance."
              />
              <CapabilityBlock
                title="Priority uplift"
                body="Identify where improvement investment should be directed first."
              />
              <CapabilityBlock
                title="Structured pathways"
                body="Translate diagnostic insight into sequenced capability improvement action."
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function CapabilityBlock({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div className="o-text-body">{body}</div>
    </div>
  );
}