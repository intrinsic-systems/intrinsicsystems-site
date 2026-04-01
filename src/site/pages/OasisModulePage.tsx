import "./../../styles/oasis.css";
import { useParams, useNavigate } from "react-router-dom";
import { SiteTopNav } from "../components/SiteTopNav";

const MODULE_CONTENT = {
  core: {
    title: "OASIS CORE™",
    tagline: "Enterprise capability baseline and diagnostic intelligence",
    position: "Capability baseline engine",
    whyItMatters:
      "Most organisations lack a consistent, evidence-based view of capability across functions and domains. CORE establishes a structured baseline that helps leadership align investment, prioritise improvement, and measure progress with greater confidence.",
    image: "/site/oasis-core-premier.png",
    body: [
      "CORE establishes a defensible enterprise capability baseline across governance, strategy, lifecycle, systems, information, risk, and performance.",
      "It transforms structured inputs into a quantified capability profile, exposing systemic constraints, prioritising uplift opportunities, and defining a clearer pathway for structured improvement.",
    ],
    bullets: [
      "Enterprise capability baseline",
      "Priority uplift identification",
      "Structured improvement sequencing",
      "Framework-aligned diagnostic insight",
    ],
    roleTitle: "Capability baseline engine",
    roleBody:
      "CORE defines the enterprise starting point, establishing a structured, evidence-based view of capability across the organisation.",
    futureTitle: "Cross-sector application",
    futureBody:
      "CORE can be configured for different sectors, operating models, and maturity frameworks, enabling more consistent capability assessment across diverse environments.",
    commercialTitle: "Licensing foundation",
    commercialBody:
      "CORE forms the entry point into the OASIS Suite, establishing the baseline required for activation of downstream modules and staged capability uplift.",
    relationship: {
      previous: "Starting point",
      current: "Baseline established",
      next: "Feeds PULSE, HORIZON, PATHWAYS, NEXUS, and ATLAS",
    },
  },
  pulse: {
    title: "OASIS PULSE™",
    tagline: "Continuous capability sensing and performance signals",
    position: "Operational sensing layer",
    whyItMatters:
      "Point-in-time assessment is valuable, but organisations also need visibility into how capability conditions shift during operations. PULSE extends capability intelligence beyond baseline diagnosis by surfacing drift, emerging risk, performance movement, and early warning signals over time.",
    image: "/site/oasis-pulse-labeled.png",
    body: [
      "PULSE extends OASIS from point-in-time capability assessment into ongoing operational visibility.",
      "It is designed to sense change across performance conditions, track capability drift, surface emerging issues, and provide continuous intelligence across the operating environment.",
    ],
    bullets: [
      "Capability signal monitoring",
      "Operational drift visibility",
      "Continuous performance feedback",
      "Emerging risk detection",
    ],
    roleTitle: "Operational sensing layer",
    roleBody:
      "PULSE provides the ongoing visibility layer within OASIS, helping organisations monitor how capability conditions change over time.",
    futureTitle: "Monitoring and alert scenarios",
    futureBody:
      "PULSE can expand into alerting, threshold detection, trend monitoring, recurring health checks, and continuous operational insight.",
    commercialTitle: "Expansion module",
    commercialBody:
      "PULSE is positioned as a next-stage activation after CORE, extending baseline capability intelligence into operational monitoring and performance sensing.",
    relationship: {
      previous: "Built on CORE baseline",
      current: "Operational visibility",
      next: "Supports PATHWAYS and informs HORIZON",
    },
  },
  horizon: {
    title: "OASIS HORIZON™",
    tagline: "Foresight, scenario modelling, and strategic outlook",
    position: "Strategic foresight layer",
    whyItMatters:
      "Leadership teams need more than a view of current capability. They also need a way to test future conditions, evaluate strategic choices, and understand where capability demand is heading. HORIZON extends OASIS into foresight and longer-range planning.",
    image: "/site/oasis-horizon-labeled.png",
    body: [
      "HORIZON extends capability intelligence into forward-looking planning and strategic decision support.",
      "It is intended to support scenario modelling, future-state positioning, and long-term investment alignment across infrastructure and enterprise capability domains.",
    ],
    bullets: [
      "Scenario modelling",
      "Future-state planning",
      "Strategic investment framing",
      "Long-range capability outlook",
    ],
    roleTitle: "Strategic foresight layer",
    roleBody:
      "HORIZON helps organisations test future conditions and connect capability intelligence to strategy, planning, and investment direction.",
    futureTitle: "Scenario and planning use cases",
    futureBody:
      "HORIZON can expand into strategic scenarios, horizon scanning, investment testing, future-state models, and long-range planning support.",
    commercialTitle: "Strategic expansion module",
    commercialBody:
      "HORIZON extends OASIS beyond current-state intelligence into foresight, helping leadership teams plan for change rather than only respond to it.",
    relationship: {
      previous: "Built on CORE baseline",
      current: "Strategic foresight",
      next: "Shapes PATHWAYS and investment direction",
    },
  },
  pathways: {
    title: "OASIS PATHWAYS™",
    tagline: "Structured improvement sequencing and delivery alignment",
    position: "Execution alignment layer",
    whyItMatters:
      "Insight alone does not improve performance. Organisations need a structured way to convert identified capability gaps into sequenced action, delivery planning, and measurable uplift. PATHWAYS provides that translation layer.",
    image: "/site/oasis-pathways-labeled.png",
    body: [
      "PATHWAYS translates insight into action by structuring uplift effort into clear, sequenced, and defensible improvement pathways.",
      "It is designed to connect identified capability gaps to delivery logic, work programs, and implementation focus.",
    ],
    bullets: [
      "Improvement sequencing",
      "Delivery-aligned uplift planning",
      "Structured implementation logic",
      "Priority-based work program support",
    ],
    roleTitle: "Improvement delivery layer",
    roleBody:
      "PATHWAYS converts capability intelligence into actionable sequencing, helping organisations move from diagnosis to structured improvement.",
    futureTitle: "Program and roadmap scenarios",
    futureBody:
      "PATHWAYS can expand into work programs, uplift roadmaps, initiative grouping, implementation sequencing, and prioritised delivery planning.",
    commercialTitle: "Execution support module",
    commercialBody:
      "PATHWAYS positions OASIS as not only a diagnostic platform, but also a practical improvement planning environment for structured uplift delivery.",
    relationship: {
      previous: "Informed by CORE, PULSE, and HORIZON",
      current: "Improvement sequencing",
      next: "Connects into NEXUS and delivery environments",
    },
  },
  nexus: {
    title: "OASIS NEXUS™",
    tagline: "System integration and cross-domain intelligence",
    position: "Integration spine",
    whyItMatters:
      "Capability intelligence becomes materially more valuable when signals can be connected across systems, functions, and evidence sources. NEXUS provides the integration spine that links intelligence across the broader enterprise environment.",
    image: "/site/oasis-nexus-labeled.png",
    body: [
      "NEXUS is the integration spine across the OASIS environment.",
      "It is intended to connect systems, normalise intelligence flows, and support joined-up visibility across organisational, digital, and infrastructure domains.",
    ],
    bullets: [
      "System integration layer",
      "Cross-domain intelligence flow",
      "Normalised evidence structure",
      "Joined-up decision support",
    ],
    roleTitle: "Integration spine",
    roleBody:
      "NEXUS links intelligence across the OASIS environment, helping evidence flow across systems and decision contexts.",
    futureTitle: "Connected system scenarios",
    futureBody:
      "NEXUS can expand into API integration, evidence normalisation, system federation, cross-platform intelligence flows, and joined-up reporting.",
    commercialTitle: "Integration module",
    commercialBody:
      "NEXUS strengthens OASIS as an enterprise platform by connecting capability intelligence to the wider systems landscape.",
    relationship: {
      previous: "Connects outputs from CORE, PULSE, HORIZON, and PATHWAYS",
      current: "Joined-up intelligence flow",
      next: "Supports ATLAS and enterprise interoperability",
    },
  },
  atlas: {
    title: "OASIS ATLAS™",
    tagline: "Spatial and asset intelligence integration",
    position: "Spatial intelligence layer",
    whyItMatters:
      "Capability and performance are often shaped by geography, asset distribution, location context, and place-based operating conditions. ATLAS extends OASIS into spatial and asset intelligence so decisions can be grounded in where performance is actually occurring.",
    image: "/site/oasis-atlas-labeled.png",
    body: [
      "ATLAS introduces location, asset, and spatial context into the broader capability intelligence model.",
      "It is intended to connect organisational performance with geography, infrastructure distribution, and place-based operating context.",
    ],
    bullets: [
      "Spatial intelligence layer",
      "Asset and place context",
      "Geographic decision support",
      "Portfolio visibility across locations",
    ],
    roleTitle: "Spatial intelligence layer",
    roleBody:
      "ATLAS connects capability intelligence to location, assets, and place-based operating context across the enterprise environment.",
    futureTitle: "Asset and location scenarios",
    futureBody:
      "ATLAS can expand into map-based views, portfolio intelligence, asset geography, place-based performance analysis, and spatial decision support.",
    commercialTitle: "Spatial expansion module",
    commercialBody:
      "ATLAS broadens OASIS from enterprise capability intelligence into asset-aware and location-aware operating insight.",
    relationship: {
      previous: "Enhanced by NEXUS and broader suite signals",
      current: "Spatial context and asset visibility",
      next: "Extends platform value into place-based decision-making",
    },
  },
} as const;

type ModuleKey = keyof typeof MODULE_CONTENT;

export function OasisModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const moduleKey = (moduleId?.toLowerCase() ?? "") as ModuleKey;
  const content = MODULE_CONTENT[moduleKey];

  if (!content) {
    return (
      <div className="o-suite-shell">
        <div className="o-suite-workspace">
          <div className="o-page">
            <SiteTopNav />

            <header className="o-page-header">
              <div className="o-page-header-main">
                <h1 className="o-page-title">OASIS Module</h1>
                <div className="o-page-tagline">Module not found</div>
              </div>

              <div className="o-page-subtitle">
                The requested OASIS module page does not currently exist.
              </div>
            </header>

            <div className="o-card" style={{ padding: 24 }}>
              <div className="o-text-body" style={{ marginBottom: 16 }}>
                Return to the OASIS Suite overview to continue exploring modules.
              </div>

              <button
                className="o-btn o-btn--primary"
                onClick={() => navigate("/oasis")}
              >
                Back to OASIS Suite
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <div className="o-page">
          <SiteTopNav />

          <header className="o-page-header" style={{ marginBottom: 12 }}>
            <div className="o-page-header-main">
              <h1 className="o-page-title">{content.title}</h1>
              <div className="o-page-tagline">{content.tagline}</div>
            </div>

            <div className="o-page-subtitle">
              A modular enterprise capability intelligence component within the broader
              OASIS Suite platform.
            </div>
          </header>

          <section className="o-suite-section" style={{ marginTop: 14 }}>
            <div className="o-module-position-strip">
              <div className="o-module-position-strip__item">
                <span className="o-module-position-strip__label">Platform role</span>
                <strong>{content.position}</strong>
              </div>
              <div className="o-module-position-strip__item">
                <span className="o-module-position-strip__label">Current function</span>
                <strong>{content.relationship.current}</strong>
              </div>
              <div className="o-module-position-strip__item">
                <span className="o-module-position-strip__label">Connected next</span>
                <strong>{content.relationship.next}</strong>
              </div>
            </div>
          </section>

          <section className="o-suite-section" style={{ marginTop: 18 }}>
            <div className="o-module-why">
              <div className="o-module-why__title">Why it matters</div>
              <div className="o-text-body">{content.whyItMatters}</div>
            </div>
          </section>

          <section
            className="o-suite-section"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(360px, 0.95fr)",
              gap: 18,
              alignItems: "start",
              marginTop: 18,
            }}
          >
            <div className="o-card" style={{ padding: 16 }}>
              {content.body.map((p, i) => (
                <p
                  key={i}
                  className="o-text-body"
                  style={{
                    marginTop: i === 0 ? 0 : undefined,
                    marginBottom: 12,
                  }}
                >
                  {p}
                </p>
              ))}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                {content.bullets.map((item) => (
                  <div
                    key={item}
                    className="o-card"
                    style={{
                      padding: 12,
                      background: "var(--oasis-card-soft)",
                      boxShadow: "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--oasis-text-primary)",
                      }}
                    >
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="o-suite-diagram-panel o-suite-diagram-panel--module">
              <img
                src={content.image}
                alt={content.title}
                className="o-suite-diagram-panel__image o-suite-diagram-panel__image--module"
              />
            </div>
          </section>

          <section className="o-suite-section" style={{ marginTop: 16 }}>
            <div
              className="o-card"
              style={{
                padding: 18,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 18,
              }}
            >
              <InfoBlock
                label="Platform role"
                title={content.roleTitle}
                body={content.roleBody}
              />
              <InfoBlock
                label="Application horizon"
                title={content.futureTitle}
                body={content.futureBody}
              />
              <InfoBlock
                label="Commercial position"
                title={content.commercialTitle}
                body={content.commercialBody}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          color: "var(--oasis-text-muted)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "var(--oasis-text-primary)",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div className="o-text-body">{body}</div>
    </div>
  );
}