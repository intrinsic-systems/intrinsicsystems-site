import { useNavigate } from "react-router-dom";
import { OasisLogo } from "../../components/OasisLogo";
import { SiteTopNav } from "../components/SiteTopNav";
import { InfoBlock } from "../components/InfoBlock";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <main className="o-page o-site-page">
          <SiteTopNav />

          <section className="o-site-hero">
            <div className="o-site-hero__copy">
              <div className="o-site-hero__logo">
                <OasisLogo variant="horizontal" height={72} />
              </div>

              <h1 className="o-site-hero__title">
                Engineer enduring enterprise capability
              </h1>

              <p className="o-site-hero__lead">
                OASIS is an enterprise capability intelligence platform that reveals
                how organisations actually operate across governance, systems,
                delivery, and performance.
              </p>

              <p className="o-text-body">
                Most organisations can see projects, assets, systems, and reports in
                parts. Few can clearly see how governance, planning, information,
                lifecycle decision-making, risk, and operational performance are
                working together.
              </p>

              <p className="o-text-body">
                OASIS establishes a structured capability baseline, converts that
                baseline into diagnostic intelligence, and provides measurable
                pathways for improvement.
              </p>

              <div className="o-action-row">
                <button
                  className="o-btn o-btn--primary"
                  onClick={() => navigate("/oasis")}
                >
                  Explore OASIS CORE™ →
                </button>

                <button
                  className="o-btn o-btn--secondary"
                  onClick={() => navigate("/platform")}
                >
                  View platform approach
                </button>
              </div>
            </div>

            <div className="o-site-hero__visual">
              <div className="o-site-image-card o-site-image-card--hero">
                <img
                  src="/site/home-hero-diagram.png"
                  alt="Intrinsic Systems enterprise capability engineering overview"
                  className="o-site-image"
                />
              </div>

              <div className="o-card o-card-pad o-site-priority-card">
                <div className="o-text-label">Executive impact</div>
                <h3 className="o-section-heading">What OASIS enables</h3>
                <ul className="o-clean-list">
                  <li>Identify structural capability constraints</li>
                  <li>Prioritise improvement investment</li>
                  <li>Align governance, systems, and delivery</li>
                  <li>Establish measurable uplift pathways</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="o-site-section">
            <header className="o-site-section__header">
              <h2>How OASIS works</h2>
              <p>Structured baseline first. Intelligence next. Improvement after that.</p>
            </header>

            <div className="o-site-card-grid o-site-card-grid--three">
              <div className="o-card o-card-pad">
                <InfoBlock
                  label="1. Establish the baseline"
                  title="CORE™"
                  body="Creates a structured, evidence-aware enterprise capability baseline across governance, strategy, lifecycle delivery, systems, risk, and performance."
                />
              </div>

              <div className="o-card o-card-pad">
                <InfoBlock
                  label="2. Generate capability intelligence"
                  title="PULSE · HORIZON · PATHWAYS"
                  body="Converts structured inputs into diagnostic insight, priority signals, practical uplift pathways, and future-state decision support."
                />
              </div>

              <div className="o-card o-card-pad">
                <InfoBlock
                  label="3. Connect and contextualise"
                  title="NEXUS · ATLAS"
                  body="Extends the platform through systems integration and spatial intelligence to support broader enterprise coordination and decision-making."
                />
              </div>
            </div>
          </section>

          <section className="o-site-section">
            <header className="o-site-section__header">
              <h2>Why organisations use OASIS</h2>
              <p>
                OASIS is not another dashboard or maturity label. It is a structured
                enterprise capability intelligence layer.
              </p>
            </header>

            <div className="o-card o-card-pad o-site-split-card">
              <div className="o-site-card-grid o-site-card-grid--three">
                <InfoBlock
                  label="Challenge"
                  title="Fragmented organisational visibility"
                  body="Most organisations manage projects, systems, risks, and assets in fragments, without a unified view of how capability is structurally produced."
                />
                <InfoBlock
                  label="Consequence"
                  title="Improvement effort becomes reactive"
                  body="Without a structural capability view, investment decisions are often shaped by partial reporting, subjective judgement, and point-in-time assessments."
                />
                <InfoBlock
                  label="Response"
                  title="Engineered capability intelligence"
                  body="OASIS reveals enterprise capability gaps, systemic constraints, and measurable uplift pathways in a form leadership teams can act on."
                />
              </div>

              <div className="o-card o-card-pad o-site-priority-card">
                <div className="o-text-label">Priority focus</div>
                <h3 className="o-section-heading">What leadership gets</h3>
                <ul className="o-clean-list">
                  <li>Capability baseline across core enterprise domains</li>
                  <li>Clearer visibility of structural constraints</li>
                  <li>Prioritised uplift areas with practical sequence</li>
                  <li>Executive-ready decision support, not isolated scores</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="o-site-section">
            <header className="o-site-section__header">
              <h2>Platform capability</h2>
              <p>
                OASIS is designed as a modular enterprise capability intelligence
                suite, beginning with CORE™ and extending into broader decision support.
              </p>
            </header>

            <div className="o-site-stack">
              <div className="o-card o-card-pad">
                <div className="o-site-card-grid o-site-card-grid--three">
                  <InfoBlock
                    label="CORE™"
                    title="Capability baseline engine"
                    body="Produces a defensible enterprise capability baseline from structured responses, confidence inputs, and evidence-aware scoring."
                  />
                  <InfoBlock
                    label="Enterprise model"
                    title="Hierarchical capability view"
                    body="Maps capability across domains, groups, elements, and drivers so organisations can inspect structure rather than rely on abstract summary scores."
                  />
                  <InfoBlock
                    label="Decision output"
                    title="Actionable intelligence"
                    body="Generates priority signals, uplift pathways, structured reporting views, and executive summaries suitable for review and investment planning."
                  />
                </div>
              </div>

              <div className="o-card o-card-pad">
                <div className="o-site-card-grid o-site-card-grid--three">
                  <InfoBlock
                    label="Differentiation"
                    title="Technology-agnostic by design"
                    body="OASIS does not require organisations to replace existing systems. It reveals structural alignment and constraint across what already exists."
                  />
                  <InfoBlock
                    label="Application"
                    title="Built for complex operating environments"
                    body="Initial focus is asset-intensive and operationally complex organisations where governance, lifecycle decisions, systems, and performance materially affect outcomes."
                  />
                  <InfoBlock
                    label="Direction"
                    title="Beyond assessment"
                    body="The broader suite extends from baseline assessment into monitoring, foresight, integration, spatial intelligence, and structured capability uplift."
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="o-site-footer-note">
            <p>
              Intrinsic Systems is building OASIS as an{" "}
              <strong>Enterprise Capability Intelligence Platform</strong> — moving
              beyond episodic assessment and fragmented reporting toward a structured,
              evidence-aware, and operationally useful enterprise decision layer.
            </p>
            <p>
              The current MVP focuses on <strong>OASIS CORE™</strong> as the baseline
              engine, with future expansion across PULSE, HORIZON, PATHWAYS, NEXUS,
              and ATLAS.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}