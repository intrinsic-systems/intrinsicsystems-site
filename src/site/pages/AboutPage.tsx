import { SiteTopNav } from "../components/SiteTopNav";
import { InfoBlock } from "../components/InfoBlock";

export function AboutPage() {
  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <main className="o-page o-site-page">
          <SiteTopNav />

          <header className="o-page-header o-site-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">About Intrinsic Systems</h1>
              <div className="o-page-tagline">
                Engineering enterprise capability
              </div>
            </div>

            <div className="o-page-subtitle">
              Intrinsic Systems is building an enterprise capability intelligence
              platform for organisations that need clearer visibility across
              governance, infrastructure, systems, information, and human capability.
            </div>
          </header>

          <section className="o-site-diagram">
            <div className="o-site-image-card">
              <img
                src="/site/intrinsic-systems-platform.png"
                alt="Intrinsic Systems enterprise capability platform structure"
                className="o-site-image"
              />
            </div>
          </section>

          <section className="o-site-section">
            <div className="o-card o-card-pad">
              <p>
                Intrinsic Systems exists to help organisations understand how
                performance is structurally produced — not just how it is reported.
              </p>

              <p>
                We focus on the alignment between governance, lifecycle
                decision-making, systems, infrastructure, information, people, and
                strategic intent.
              </p>

              <p>
                OASIS Suite™ is the first platform expression of this model:
                beginning with enterprise capability baseline intelligence and
                extending toward a broader decision layer for improvement,
                monitoring, foresight, integration, and spatial context.
              </p>
            </div>
          </section>

          <section className="o-site-section">
            <div className="o-site-section__header">
              <h2 className="o-site-section-title">What we are building</h2>
              <p>
                A structured intelligence layer for organisations that need to see
                how capability, performance, and improvement demand connect.
              </p>
            </div>

            <div className="o-card o-card-pad o-site-three-grid">
              <InfoBlock
                label="Vision"
                title="Engineer enterprise capability"
                body="Connect infrastructure systems, digital platforms, information, and human capability into a unified intelligence framework."
              />
              <InfoBlock
                label="Position"
                title="Enterprise capability intelligence"
                body="Help organisations see structural weakness, capability demand, and measurable improvement opportunity with greater clarity."
              />
              <InfoBlock
                label="Direction"
                title="Beyond static maturity models"
                body="Move from episodic assessment toward adaptive, evidence-aware, and modular enterprise intelligence."
              />
            </div>
          </section>

          <section className="o-site-section">
            <div className="o-site-section__header">
              <h2 className="o-site-section-title">Where it applies</h2>
              <p>
                The initial focus is asset-intensive and operationally complex
                environments where capability constraints materially affect delivery,
                risk, investment, and performance.
              </p>
            </div>

            <div className="o-card o-card-pad o-site-three-grid">
              <InfoBlock
                label="Initial application"
                title="Asset-intensive environments"
                body="Utilities, facilities, transport, infrastructure, and other complex operating environments where structural capability affects outcomes."
              />
              <InfoBlock
                label="Expansion logic"
                title="Enterprise-wide intelligence"
                body="Capability insight that extends beyond asset management into governance, planning, systems alignment, and organisation-wide improvement."
              />
              <InfoBlock
                label="Future horizon"
                title="Human infrastructure intelligence"
                body="A longer-term direction connecting skills, knowledge, readiness, and workforce capability into the broader enterprise model."
              />
            </div>
          </section>

          <section className="o-site-footer-note">
            <p>
              Intrinsic Systems is developing OASIS as an{" "}
              <strong>Enterprise Capability Intelligence Platform</strong> for
              organisations that need repeatable, evidence-aware visibility of how
              capability is produced, constrained, and improved.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}