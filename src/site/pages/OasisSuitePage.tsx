import { useNavigate } from "react-router-dom";
import { OasisArchitectureDiagram } from "../../suite/OasisArchitectureDiagram";
import { OasisLogo } from "../../components/OasisLogo";
import { MODULES } from "../siteData/modules";
import { SiteTopNav } from "../components/SiteTopNav";

function isLocalPreviewHost(): boolean {
  if (typeof window === "undefined") return false;

  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function ExecutiveCapabilityPreviewStatic() {
  return (
    <div className="o-card o-card-pad" style={{ padding: 24 }}>
      <div className="o-text-label" style={{ marginBottom: 8 }}>
        OASIS CORE · Executive Capability View
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div>
          <div
            className="o-text-body"
            style={{ marginBottom: 12, maxWidth: 640 }}
          >
            Interactive domain view showing rolled-up capability position,
            element-level drivers, and evidence-aware inspection.
          </div>

          <div
            style={{
              background: "linear-gradient(180deg, #4b5563 0%, #374151 100%)",
              borderRadius: 18,
              padding: 18,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#cbd5e1",
                marginBottom: 6,
              }}
            >
              Radial Capability Engine
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#f8fafc",
                marginBottom: 10,
              }}
            >
              Enterprise Capability View
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              {["Current", "Benchmark", "Target", "Variance"].map((item) => (
                <div
                  key={item}
                  style={{
                    background: "#111827",
                    color: "#e5e7eb",
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#cbd5e1",
                borderRadius: 16,
                minHeight: 330,
                padding: 10,
              }}
            >
              <svg viewBox="0 0 420 420" width="100%" style={{ maxWidth: 340 }}>
                <circle cx="210" cy="210" r="138" fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.7" />
                <circle cx="210" cy="210" r="100" fill="none" stroke="#64748b" strokeWidth="2" opacity="0.7" />
                <circle cx="210" cy="210" r="62" fill="none" stroke="#0ea5e9" strokeWidth="4" />

                <path d="M210 210 L210 72 A138 138 0 0 1 329 141 Z" fill="rgba(59,130,246,0.30)" />
                <path d="M210 210 L329 141 A138 138 0 0 1 329 279 Z" fill="rgba(16,185,129,0.28)" />
                <path d="M210 210 L329 279 A138 138 0 0 1 210 348 Z" fill="rgba(245,158,11,0.28)" />
                <path d="M210 210 L210 348 A138 138 0 0 1 91 279 Z" fill="rgba(168,85,247,0.28)" />
                <path d="M210 210 L91 279 A138 138 0 0 1 91 141 Z" fill="rgba(14,165,233,0.28)" />
                <path d="M210 210 L91 141 A138 138 0 0 1 210 72 Z" fill="rgba(239,68,68,0.28)" />

                <circle cx="210" cy="210" r="40" fill="#111827" />
                <text x="210" y="202" textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="700">
                  CORE
                </text>
                <text x="210" y="220" textAnchor="middle" fill="#cbd5e1" fontSize="8">
                  Governance & Intelligence
                </text>

                <text x="210" y="48" textAnchor="middle" fill="#111827" fontSize="15" fontWeight="700">
                  Governance
                </text>
                <text x="350" y="145" textAnchor="start" fill="#111827" fontSize="15" fontWeight="700">
                  Strategy
                </text>
                <text x="350" y="285" textAnchor="start" fill="#111827" fontSize="15" fontWeight="700">
                  Performance
                </text>
                <text x="210" y="390" textAnchor="middle" fill="#111827" fontSize="15" fontWeight="700">
                  Lifecycle
                </text>
                <text x="68" y="285" textAnchor="end" fill="#111827" fontSize="15" fontWeight="700">
                  Information
                </text>
                <text x="68" y="145" textAnchor="end" fill="#111827" fontSize="15" fontWeight="700">
                  Risk
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#4b5563",
            borderRadius: 18,
            padding: 18,
            color: "#f8fafc",
            minHeight: 430,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#cbd5e1",
              marginBottom: 6,
            }}
          >
            Enterprise Summary
          </div>

          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            Organisation & Governance
          </div>

          <div style={{ color: "#d1d5db", fontSize: 13, marginBottom: 16 }}>
            Current observed capability position for the selected scope.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <MetricCard label="Current" value="1.3" />
            <MetricCard label="Current" value="1.3" />
            <MetricCard label="Target" value="4.4" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <MetricCard label="Benchmark" value="4.0" />
            <MetricCard label="Variance" value="-3.1" />
          </div>

          <div style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 6 }}>
            How to Read This
          </div>
          <div style={{ fontSize: 13, color: "#e5e7eb", lineHeight: 1.55 }}>
            The radial presents capability as a structured hierarchy. Inner and
            mid rings show grouped capability elements within the current scope.
            Select an element to inspect its score, gap, and primary drivers.
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 16,
            }}
          >
            {["Executive", "Hierarchy", "View", "Driver", "Traceability"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    background: "#111827",
                    color: "#e5e7eb",
                    borderRadius: 999,
                    padding: "7px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#94a3b8",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc" }}>
        {value}
      </div>
    </div>
  );
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
              <ExecutiveCapabilityPreviewStatic />
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