import { SiteTopNav } from "../components/SiteTopNav";
import { InfoBlock } from "../components/InfoBlock";

export function WhatWeDoPage() {
  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <main className="o-page o-site-page">
          <SiteTopNav />

          <header className="o-page-header o-site-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">What we do</h1>
              <div className="o-page-tagline">Enterprise capability intelligence</div>
            </div>

            <div className="o-page-subtitle">
              We help organisations understand how capability is structurally
              produced, where it is constrained, and where improvement effort
              should be focused first.
            </div>
          </header>

          <section className="o-card o-card-pad o-site-feature-grid">
            <div className="o-stack-sm">
              <p className="o-text-body">
                Intrinsic Systems develops enterprise capability intelligence
                platforms for asset-intensive and operationally complex
                organisations.
              </p>

              <p className="o-text-body">
                Our work sits at the structural layer where governance, planning,
                lifecycle delivery, information, risk, systems, performance, and
                organisational capability intersect.
              </p>

              <p className="o-text-body">
                We do not replace enterprise systems. We provide the intelligence
                layer that helps leadership teams see how the organisation is
                actually functioning, where constraints exist, and how improvement
                effort should be directed.
              </p>
            </div>

            <aside className="o-card o-card-pad o-results-priority-card">
              <div className="o-text-label">Executive focus</div>
              <h3 className="o-section-heading">What organisations gain</h3>

              <div className="o-signal-list">
                <div className="o-signal-item">
                  Clearer visibility of structural capability constraints
                </div>
                <div className="o-signal-item">
                  More confident prioritisation of improvement effort
                </div>
                <div className="o-signal-item">
                  Better alignment across governance, systems, and delivery
                </div>
                <div className="o-signal-item">
                  A measurable pathway from baseline to uplift
                </div>
              </div>
            </aside>
          </section>

          <section className="o-suite-section">
            <SectionHeader
              title="What OASIS enables"
              subtitle="Structured baseline, diagnostic intelligence, and practical improvement sequencing."
            />

            <div className="o-card o-card-pad o-site-four-grid">
              <InfoBlock
                label="Baseline"
                title="Capability profiling"
                body="Generates a structured enterprise capability baseline across core operating domains."
              />
              <InfoBlock
                label="Diagnosis"
                title="Constraint identification"
                body="Surfaces structural weaknesses that limit delivery, performance, and decision quality."
              />
              <InfoBlock
                label="Prioritisation"
                title="Priority uplift"
                body="Identifies where improvement investment should be directed first for the greatest structural impact."
              />
              <InfoBlock
                label="Action"
                title="Structured pathways"
                body="Translates diagnostic insight into sequenced, practical capability improvement pathways."
              />
            </div>
          </section>

          <section className="o-suite-section">
            <SectionHeader
              title="How we are different"
              subtitle="OASIS is designed as a platform capability, not a one-off review."
            />

            <div className="o-card o-card-pad o-site-three-grid">
              <InfoBlock
                label="Not consulting-led"
                title="Systemised, not episodic"
                body="OASIS establishes a repeatable capability intelligence layer rather than producing a one-time assessment outcome."
              />
              <InfoBlock
                label="Not system replacement"
                title="Technology-agnostic"
                body="The platform works across existing enterprise environments and reveals alignment, fragmentation, and structural weakness."
              />
              <InfoBlock
                label="Not abstract maturity scoring"
                title="Operationally useful"
                body="Outputs support executive review, prioritisation, sequencing, and measurable improvement over time."
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