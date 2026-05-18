import { SiteTopNav } from "../components/SiteTopNav";
import { InfoBlock } from "../components/InfoBlock";

export function PlatformApproachPage() {
  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <main className="o-page o-site-page">
          <SiteTopNav />

          <header className="o-page-header o-site-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">Platform approach</h1>
              <div className="o-page-tagline">
                From structured input to enterprise capability intelligence
              </div>
            </div>

            <div className="o-page-subtitle">
              OASIS transforms structured organisational inputs into a usable
              enterprise capability model, diagnostic intelligence, and
              prioritised improvement direction — forming the foundation for a
              broader modular SaaS platform.
            </div>
          </header>

          <div className="o-site-image-card o-site-image-card--hero o-site-diagram">
            <img
              src="/site/platform-adaptive-engine.png"
              alt="OASIS adaptive capability intelligence model"
              className="o-site-image"
            />
          </div>

          <section className="o-suite-section">
            <SectionHeader
              title="How the platform works"
              subtitle="Structured interaction, adaptive logic, and enterprise capability modelling."
            />

            <div className="o-card o-card-pad o-site-four-grid">
              <InfoBlock
                label="1"
                title="Structured interaction layer"
                body="Users provide structured responses describing organisational practice across governance, planning, delivery, lifecycle, risk, information, and performance."
              />
              <InfoBlock
                label="2"
                title="Adaptive assessment logic"
                body="Assessment depth expands or contracts based on response patterns, preserving analytic value while reducing unnecessary duplication over time."
              />
              <InfoBlock
                label="3"
                title="Enterprise capability model"
                body="Responses are mapped into a structured capability architecture that reflects how the organisation is intended to operate in practice."
              />
              <InfoBlock
                label="4"
                title="Intelligence and uplift outputs"
                body="The platform produces capability profiles, priority signals, standards-aligned views, and structured uplift pathways."
              />
            </div>
          </section>

          <section className="o-suite-section">
            <SectionHeader
              title="Capability intelligence design"
              subtitle="Relational structure, evidence awareness, and decision-layer outputs."
            />

            <div className="o-card o-card-pad o-site-three-grid">
              <InfoBlock
                label="Capability"
                title="Relational capability structure"
                body="Moves beyond one-question-per-topic logic toward linked relationships across enterprise, domain, element, and evidence layers."
              />
              <InfoBlock
                label="Evidence"
                title="Evidence-aware interpretation"
                body="Capability position incorporates confidence, answer strength, evidence status, and organisational context to improve interpretive value."
              />
              <InfoBlock
                label="Decision"
                title="Decision-layer foundation"
                body="Outputs support leadership review, program planning, standards mapping, investment sequencing, and expansion into broader OASIS modules."
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="o-page-header o-site-section-header">
      <div className="o-page-header-main">
        <h2 className="o-page-title">{title}</h2>
      </div>
      <div className="o-page-subtitle">{subtitle}</div>
    </div>
  );
}