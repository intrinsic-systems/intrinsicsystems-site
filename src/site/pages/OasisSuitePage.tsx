import { useNavigate } from "react-router-dom";
import { OasisArchitectureDiagram } from "../../suite/OasisArchitectureDiagram";
import { OasisLogo } from "../../components/OasisLogo";
import { MODULES } from "../siteData/modules";
import { SiteTopNav } from "../components/SiteTopNav";
import OrgGovExecutiveView from "../../features/oasis/org-gov/OrgGovExecutiveView";

const EXECUTIVE_VIEW_PREVIEW_RESULTS = {
  maturityPct: 23.9,
  confidencePct: 96,
  capabilityScores: [
    { id: "cap-1", label: "Asset Management Vision & Leadership", scorePct: 36.3 },
    { id: "cap-2", label: "Asset Management Policy", scorePct: 36.7 },
    { id: "cap-3", label: "Asset Management Strategy & Objectives", scorePct: 17.5 },
    { id: "cap-4", label: "Asset Management Leadership", scorePct: 46.7 },
    { id: "cap-5", label: "Management Review, Audit & Assurance", scorePct: 20.0 },
    { id: "cap-6", label: "Roles & Responsibilities for AM Implementation", scorePct: 25.0 },
    { id: "cap-7", label: "Technical Standards & Legislation", scorePct: 35.0 },
    { id: "cap-8", label: "Asset Information Strategy", scorePct: 17.5 },
    { id: "cap-9", label: "Data Standards & System Requirements", scorePct: 20.0 },
    { id: "cap-10", label: "Condition Assessment Standards", scorePct: 36.7 },
    { id: "cap-11", label: "Standard Operating Procedures", scorePct: 5.0 },
    { id: "cap-12", label: "Asset Management Resourcing Strategy", scorePct: 36.7 },
    { id: "cap-13", label: "Financial Planning & Budgeting Processes", scorePct: 36.2 },
    { id: "cap-14", label: "Long Term Financial Plans", scorePct: 20.0 },
    { id: "cap-15", label: "Lifecycle Cost Assessment Processes", scorePct: 23.0 },
  ],
};

function isLocalPreviewHost(): boolean {
  if (typeof window === "undefined") return false;

  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

export function OasisSuitePage() {
  const navigate = useNavigate();
  const showExecutivePreview = isLocalPreviewHost();

  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <div className="o-page">
          <SiteTopNav />

          <section className="o-suite-hero-refined">
            <div className="o-suite-hero-refined__copy">
              <div style={{ marginBottom: 18 }}>
                <OasisLogo variant="horizontal" height={72} />
              </div>

              <h1 className="o-page-title" style={{ marginBottom: 8 }}>
                OASIS Suite™
              </h1>

              <div className="o-page-subtitle" style={{ marginBottom: 16 }}>
                Enterprise Capability Intelligence Platform
              </div>

              <p className="o-text-body" style={{ marginBottom: 14 }}>
                OASIS Suite™ is a modular enterprise capability intelligence platform
                designed to help organisations understand how governance, planning,
                information, systems, risk, and operational performance are actually
                functioning together.
              </p>

              <p className="o-text-body" style={{ marginBottom: 14 }}>
                It begins with OASIS CORE™ as the foundational capability baseline
                engine, then extends into operational feedback, strategic foresight,
                uplift sequencing, systems integration, and spatial intelligence
                through the broader suite.
              </p>

              <div className="o-action-row" style={{ marginTop: 2 }}>
                <button
                  className="o-btn o-btn--primary"
                  onClick={() => navigate("/core/access")}
                >
                  Request access to OASIS CORE →
                </button>
              </div>

              <div className="o-text-small" style={{ marginTop: 8, maxWidth: 520 }}>
                OASIS CORE™ is currently available through controlled pilot access for selected organisations.
              </div>

              <div className="o-suite-hero-refined__meta">
                <div className="o-suite-meta-card">
                  <div className="o-text-label">Flagship module</div>
                  <strong>OASIS CORE™</strong>
                  <div className="o-text-body">
                    Structured capability baseline, governance alignment, and
                    defensible enterprise assessment.
                  </div>
                </div>

                <div className="o-suite-meta-card">
                  <div className="o-text-label">Expansion path</div>
                  <strong>From baseline to enterprise intelligence</strong>
                  <div className="o-text-body">
                    Extend from structured assessment into monitoring,
                    foresight, prioritisation, integration, and spatial context.
                  </div>
                </div>
              </div>
            </div>

            <div className="o-suite-hero-refined__visual">
              <div className="o-suite-diagram-frame">
                <OasisArchitectureDiagram />
              </div>
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-page-header-main" style={{ marginBottom: 10 }}>
              <h2 className="o-page-title" style={{ fontSize: 30, margin: 0 }}>
                OASIS modules
              </h2>
            </div>

            <div className="o-page-subtitle" style={{ marginBottom: 22 }}>
              Modular by design, beginning with CORE and extending into operational,
              strategic, integration, execution, and spatial intelligence layers.
            </div>

            <div className="o-suite-modules-grid-refined">
              {MODULES.map((module) => (
                <button
                  key={module.title}
                  type="button"
                  className="o-suite-module-card"
                  onClick={() => navigate(`/oasis/${module.slug}`)}
                >
                  <div className="o-suite-module-card__top">
                    <img
                      src={module.icon}
                      alt={module.title}
                      className="o-suite-module-card__icon"
                    />
                    <div className="o-suite-module-card__titleWrap">
                      <div className="o-suite-module-card__eyebrow">OASIS</div>
                      <div className="o-suite-module-card__title">
                        {module.title}
                      </div>
                    </div>
                  </div>

                  <div className="o-suite-module-card__body">
                    {module.description}
                  </div>

                  <div className="o-suite-module-card__cta">
                    View module →
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-suite-summary-grid">
              <div className="o-card o-card-pad">
                <div className="o-text-label">Assessment anchor</div>
                <h3 className="o-section-heading" style={{ marginTop: 6 }}>
                  CORE-first capability model
                </h3>
                <div className="o-text-body">
                  OASIS begins with a defensible enterprise capability baseline,
                  creating the structured foundation required for diagnosis,
                  prioritisation, reporting, and staged uplift across the organisation.
                </div>
              </div>

              <div className="o-card o-card-pad">
                <div className="o-text-label">Expansion logic</div>
                <h3 className="o-section-heading" style={{ marginTop: 6 }}>
                  Layered intelligence architecture
                </h3>
                <div className="o-text-body">
                  Each module extends the platform in a distinct direction —
                  operational, strategic, integrative, execution-focused, or spatial —
                  while remaining connected to the same enterprise capability model.
                </div>
              </div>

              <div className="o-card o-card-pad">
                <div className="o-text-label">Platform outcome</div>
                <h3 className="o-section-heading" style={{ marginTop: 6 }}>
                  From assessment to decision layer
                </h3>
                <div className="o-text-body">
                  OASIS is designed to move beyond static maturity scoring toward a
                  persistent, evidence-aware capability intelligence layer that
                  supports clearer investment direction and structured organisational
                  improvement.
                </div>
              </div>
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-page-header-main" style={{ marginBottom: 10 }}>
              <h2 className="o-page-title" style={{ fontSize: 30, margin: 0 }}>
                Executive capability view
              </h2>
            </div>

            <div className="o-page-subtitle" style={{ marginBottom: 22 }}>
              A preview of how OASIS CORE transforms structured assessment into
              interactive, evidence-aware enterprise capability intelligence.
            </div>

            {showExecutivePreview ? (
              <div className="o-card o-card-pad" style={{ padding: 20 }}>
                <OrgGovExecutiveView
                  embedded
                  results={EXECUTIVE_VIEW_PREVIEW_RESULTS}
                />
              </div>
            ) : (
              <div className="o-card o-card-pad" style={{ padding: 24 }}>
                <div className="o-text-body" style={{ marginBottom: 14 }}>
                  The OASIS Executive View presents enterprise capability as a
                  structured, hierarchical model — translating assessment data into
                  a clear, inspectable enterprise profile.
                </div>
                <div className="o-text-body" style={{ marginBottom: 0 }}>
                  Leaders can identify where capability is constrained, understand
                  the drivers of performance, and prioritise uplift with greater
                  precision — moving beyond static maturity scores to evidence-aware
                  decision-making.
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}