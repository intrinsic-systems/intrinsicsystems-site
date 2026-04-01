import { SiteTopNav } from "../components/SiteTopNav";
import { InfoBlock } from "../components/InfoBlock";

export function AboutPage() {
  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <div className="o-page">
          <SiteTopNav />

          <header className="o-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">About Intrinsic Systems</h1>
              <div className="o-page-tagline">
                Engineering enterprise capability
              </div>
            </div>

            <div className="o-page-subtitle">
              Intrinsic Systems is building an enterprise capability intelligence
              platform for organisations that need clearer visibility across
              governance, infrastructure, digital systems, information, and human capability.
            </div>
          </header>

          <div
            className="o-suite-diagram-panel"
            style={{ padding: 0, marginBottom: 24 }}
          >
            <img
              src="/site/intrinsic-systems-platform.png"
              alt="Intrinsic Systems platform structure"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 28,
                boxShadow: "0 14px 36px rgba(8, 18, 38, 0.14)",
                objectFit: "cover",
              }}
            />
          </div>

          <section className="o-suite-section">
            <div className="o-card" style={{ padding: 24 }}>
              <p className="o-text-body" style={{ marginTop: 0, marginBottom: 14 }}>
                Intrinsic Systems exists to help organisations understand how
                performance is structurally produced — not just how it is reported.
              </p>

              <p className="o-text-body" style={{ marginTop: 0, marginBottom: 14 }}>
                Our view is that enterprise performance emerges from the alignment
                of governance, lifecycle decision-making, systems, information,
                infrastructure, people, and strategic intent.
              </p>

              <p className="o-text-body" style={{ marginTop: 0, marginBottom: 0 }}>
                OASIS Suite™ is the first platform expression of this model —
                beginning with capability baseline intelligence and extending
                toward a broader enterprise capability decision layer.
              </p>
            </div>
          </section>

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
              <InfoBlock
                label="Vision"
                title="Engineer enterprise capability"
                body="Connecting infrastructure systems, digital platforms, information, and human capability into a unified intelligence framework."
              />
              <InfoBlock
                label="Position"
                title="Enterprise capability intelligence"
                body="Intrinsic Systems helps organisations see structural weakness, capability demand, and measurable improvement opportunity with greater clarity."
              />
              <InfoBlock
                label="Direction"
                title="Beyond static maturity models"
                body="Moving from episodic assessment toward adaptive, evidence-aware, and modular enterprise intelligence."
              />
            </div>
          </section>

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
              <InfoBlock
                label="Initial application"
                title="Asset-intensive environments"
                body="Initial market relevance across utilities, facilities, transport, infrastructure, and other complex operating environments where structural capability materially affects outcomes."
              />
              <InfoBlock
                label="Expansion logic"
                title="Enterprise-wide intelligence"
                body="Capability insight that extends beyond asset management into governance, planning, systems alignment, and organisation-wide improvement."
              />
              <InfoBlock
                label="Future horizon"
                title="Human infrastructure intelligence"
                body="A longer-term direction that connects skills, knowledge, readiness, and workforce capability into the broader enterprise model."
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}