import { useNavigate } from "react-router-dom";
import { OasisLogo } from "../../components/OasisLogo";
import { SiteTopNav } from "../components/SiteTopNav";
import { InfoBlock } from "../components/InfoBlock";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <div className="o-page">
          <SiteTopNav />

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
              gap: 36,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ marginBottom: 18 }}>
                <OasisLogo variant="horizontal" height={80} />
              </div>

              <h1 className="o-page-title">
                Engineer enterprise capability
              </h1>

              <div className="o-page-subtitle">
                From episodic assessment to structured, evidence-aware capability intelligence
              </div>

              <p className="o-text-body">
                Most organisations can see projects, assets, systems, and reports in parts,
                but still lack a clear view of how capability actually performs across
                governance, planning, information, lifecycle decision-making, risk, and
                operational delivery.
              </p>

              <p className="o-text-body">
                OASIS Suite™ addresses this gap by establishing a structured capability
                baseline and extending it into continuous insight, improvement prioritisation,
                strategic foresight, systems integration, and spatial intelligence.
              </p>

              <div className="o-action-row">
                <button
                  className="o-btn o-btn--primary"
                  onClick={() => navigate("/oasis")}
                >
                  Explore OASIS Suite →
                </button>
              </div>
            </div>

            <div className="o-suite-diagram-panel" style={{ padding: 0 }}>
              <img
                src="/site/home-hero-diagram.png"
                alt="Intrinsic Systems enterprise capability engineering overview"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: 28,
                  boxShadow: "0 18px 44px rgba(8, 18, 38, 0.18)",
                }}
              />
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-suite-summary-grid">
              <div className="o-card o-card-pad">
                <div className="o-text-label">1. Establish the baseline</div>
                <h3 className="o-section-heading">CORE</h3>
                <div className="o-text-body">
                  Create a defensible, evidence-aware enterprise capability baseline across
                  domains, elements, and underlying drivers.
                </div>
              </div>

              <div className="o-card o-card-pad">
                <div className="o-text-label">2. Extend the intelligence layer</div>
                <h3 className="o-section-heading">PULSE · HORIZON · PATHWAYS</h3>
                <div className="o-text-body">
                  Monitor change, test future scenarios, and structure practical uplift
                  pathways from baseline to improved performance.
                </div>
              </div>

              <div className="o-card o-card-pad">
                <div className="o-text-label">3. Connect and contextualise</div>
                <h3 className="o-section-heading">NEXUS · ATLAS</h3>
                <div className="o-text-body">
                  Integrate systems and spatial context to support more coherent,
                  enterprise-wide decision-making.
                </div>
              </div>
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-page-header">
              <div className="o-page-header-main">
                <h2 className="o-page-title" style={{ fontSize: 20, margin: 0 }}>
                  Why this matters
                </h2>
              </div>

              <div className="o-page-subtitle">
                OASIS is not another dashboard or maturity label. It is an enterprise
                capability intelligence layer.
              </div>
            </div>

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
                label="Challenge"
                title="Fragmented organisational visibility"
                body="Most organisations can see projects, assets, systems, and risks in parts, but not how governance, planning, delivery, and performance are operating together."
              />
              <InfoBlock
                label="Impact"
                title="Improvement effort is often misdirected"
                body="Without a structural capability view, organisations rely on fragmented reporting, subjective judgement, and point-in-time assessments that do not persist."
              />
              <InfoBlock
                label="Response"
                title="Engineered capability system"
                body="OASIS provides a structured intelligence layer that reveals capability gaps, systemic constraints, and priority uplift pathways in a form that can be measured over time."
              />
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-page-header">
              <div className="o-page-header-main">
                <h2 className="o-page-title" style={{ fontSize: 20, margin: 0 }}>
                  Core platform proposition
                </h2>
              </div>

              <div className="o-page-subtitle">
                OASIS is designed as a modular enterprise capability intelligence suite —
                beginning with structured assessment and extending into monitoring,
                foresight, integration, and uplift delivery.
              </div>
            </div>

            <div className="o-card" style={{ padding: 22, marginBottom: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 18,
                }}
              >
                <InfoBlock
                  label="OASIS CORE™"
                  title="Capability baseline engine"
                  body="Establishes a defensible enterprise capability baseline across governance, planning, lifecycle, information, risk, and operational performance."
                />
                <InfoBlock
                  label="Executive view"
                  title="Hierarchical capability model"
                  body="Transforms structured assessment into an inspectable enterprise view spanning domains, elements, drivers, and evidence-aware diagnosis."
                />
                <InfoBlock
                  label="Enterprise output"
                  title="Actionable intelligence"
                  body="Outputs include capability signals, prioritised uplift opportunities, pathway sequencing, benchmark-ready structures, and structured reporting views."
                />
              </div>
            </div>

            <div className="o-card" style={{ padding: 22 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 18,
                }}
              >
                <InfoBlock
                  label="Differentiation"
                  title="Technology-agnostic by design"
                  body="OASIS does not require organisations to replace existing systems. It assesses structural alignment across what already exists and reveals where capability is constrained."
                />
                <InfoBlock
                  label="Application"
                  title="Built for complex operating environments"
                  body="Initial focus is infrastructure, utilities, transport, facilities, and other asset-intensive organisations where governance, lifecycle, and decision quality materially affect outcomes."
                />
                <InfoBlock
                  label="Direction"
                  title="Beyond assessment"
                  body="The longer-term platform extends from baseline assessment into continuous monitoring, strategic foresight, integration, spatial intelligence, and human capability uplift."
                />
              </div>
            </div>
          </section>

          <section
            className="o-suite-section"
            style={{
              fontSize: 12,
              color: "var(--oasis-text-muted)",
              maxWidth: 880,
            }}
          >
            <p style={{ marginBottom: 10 }}>
              Intrinsic Systems is positioning OASIS as an{" "}
              <strong>Enterprise Capability Intelligence Platform</strong> —
              moving beyond static maturity models and consulting-led assessments
              toward a continuous, evidence-aware, and structurally useful decision layer.
            </p>
            <p style={{ margin: 0 }}>
              The current MVP focuses on <strong>OASIS CORE™</strong> as the
              foundational capability baseline engine, with future expansion
              across PULSE, HORIZON, PATHWAYS, NEXUS, and ATLAS.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}