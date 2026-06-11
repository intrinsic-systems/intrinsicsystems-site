import { useState } from "react";
import { Link } from "react-router-dom";

type BadgeTone = "blue" | "green" | "amber";

function StatusBadge({
  children,
  tone = "blue",
}: {
  children: string;
  tone?: BadgeTone;
}) {
  const styles = {
    blue: {
      background: "#eaf6fd",
      color: "#0b78b6",
      border: "1px solid rgba(14,118,168,0.22)",
    },
    green: {
      background: "#ecfdf5",
      color: "#047857",
      border: "1px solid rgba(4,120,87,0.22)",
    },
    amber: {
      background: "#fffbeb",
      color: "#b45309",
      border: "1px solid rgba(180,83,9,0.22)",
    },
  }[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        ...styles,
      }}
    >
      {children}
    </span>
  );
}

function SandboxCard({
  label,
  title,
  status,
  statusTone,
  description,
  to,
}: {
  label: string;
  title: string;
  status: string;
  statusTone: "green" | "amber";
  description: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      style={{
        position: "relative",
        display: "block",
        padding: 30,
        borderRadius: 28,
        border: "1px solid rgba(14,118,168,0.26)",
        background:
          "linear-gradient(180deg, #ffffff 0%, #f7fbfe 100%)",
        boxShadow:
          "0 22px 54px rgba(15,23,42,0.12), 0 0 0 1px rgba(14,118,168,0.05)",
        textDecoration: "none",
        color: "inherit",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderTop: `5px solid ${
            statusTone === "green" ? "#10b981" : "#f59e0b"
          }`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div style={{ color: "#0b78b6", fontSize: 12, fontWeight: 800 }}>
          {label}
        </div>

        <StatusBadge tone={statusTone}>{status}</StatusBadge>
      </div>

      <div
        style={{
          color: "#0f172a",
          fontSize: 22,
          fontWeight: 850,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#486581",
          fontSize: 14,
          lineHeight: 1.6,
          marginBottom: 22,
        }}
      >
        {description}
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "9px 14px",
          borderRadius: 999,
          background: "#0b78b6",
          color: "#ffffff",
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        Launch Environment →
      </div>
    </Link>
  );
}

function Checklist({
  title,
  items,
  checked,
}: {
  title: string;
  items: string[];
  checked: boolean;
}) {
  return (
    <div style={panelStyle}>
      <div style={panelTitleStyle}>{title}</div>

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{ color: "#486581", fontSize: 14, lineHeight: 1.5 }}
          >
            {checked ? "✓" : "□"} {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div style={panelStyle}>
      <div style={panelTitleStyle}>{title}</div>

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{ color: "#486581", fontSize: 14, lineHeight: 1.5 }}
          >
            • {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function GuideCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div style={smallCardStyle}>
      <div
        style={{
          color: "#0f172a",
          fontSize: 15,
          fontWeight: 850,
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div style={{ color: "#486581", fontSize: 13, lineHeight: 1.6 }}>
        {body}
      </div>
    </div>
  );
}

const timelineItems = [
  {
    year: "2018",
    label: "Original concept",
    title: "The Question",
    body: "How can organisations better understand capability, not just maturity?",
    insight: "Capability intelligence becomes the core idea.",
  },
  {
    year: "2020",
    label: "Assessment model",
    title: "Structured Assessment",
    body: "The early model focuses on assessment, benchmarking, and maturity-style diagnostics.",
    insight: "Assessment identifies issues, but does not fully explain them.",
  },
  {
    year: "2023",
    label: "Traceability",
    title: "Evidence & Rationale",
    body: "Capability scores begin to connect to evidence, rationale, dependencies, and decision context.",
    insight: "Capability must be explainable.",
  },
  {
    year: "2025",
    label: "MVP direction",
    title: "Improvement Pathways",
    body: "OASIS shifts from diagnosis toward prioritised uplift pathways and executive interpretation.",
    insight: "Organisations need direction, not just assessment outputs.",
  },
  {
    year: "Jan 2026",
    label: "CORE MVP",
    title: "MVP Foundation",
    body: "CORE establishes the capability baseline engine, question bank, assessment flow, and results experience.",
    insight: "The baseline becomes the foundation for enterprise capability intelligence.",
  },
  {
    year: "Easter 2026",
    label: "MVP+ target",
    title: "CORE MVP+",
    body: "Target release expands traceability, improvement pathways, export-ready outputs, and founder review capability.",
    insight: "The product starts to feel larger than an assessment tool.",
  },
  {
    year: "Mid 2026",
    label: "Funding pathway",
    title: "Grant & Pilot Readiness",
    body: "Founder review, pilot partner positioning, and grant readiness are prepared around the expanded OASIS story.",
    insight: "The strongest message is enterprise capability intelligence, not software build progress.",
  },
  {
    year: "Late 2026",
    label: "Runtime Alpha",
    title: "Runtime Intelligence",
    body: "OASIS introduces adaptive probes, evidence confidence, belief state, influence mapping, and action queues.",
    insight: "Runtime reduces assessment effort by asking better targeted questions.",
  },
  {
    year: "Future",
    label: "Go-live direction",
    title: "Capability Digital Twin",
    body: "The long-term direction is continuous enterprise capability intelligence across evidence, systems, decisions, and outcomes.",
    insight: "Help organisations understand themselves continuously.",
  },
];

function StoryPane() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = timelineItems[activeIndex];

  return (
    <aside
      style={{
        position: "sticky",
        top: 24,
        display: "grid",
        gap: 16,
      }}
    >
      <div style={panelStyle}>
        <div style={kickerStyle}>Review Context</div>
        <div style={panelTitleStyle}>What Are You Reviewing?</div>
        <div style={{ color: "#486581", fontSize: 13, lineHeight: 1.8 }}>
          ✓ CORE MVP+ assessment workflow
          <br />
          ✓ Capability scoring and traceability
          <br />
          ✓ Improvement pathway generation
          <br />
          ✓ Runtime Intelligence concepts
          <br />
          ✓ Enterprise Belief State and Action Queue
          <br />✓ Evidence-driven decision support
        </div>
      </div>

      <div style={panelStyle}>
        <div style={kickerStyle}>OASIS Evolution</div>
        <div style={panelTitleStyle}>Development Timeline</div>

        <div style={{ display: "grid", gap: 0, marginTop: 14 }}>
          {timelineItems.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${item.year}-${item.title}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 28px 1fr",
                  gap: 10,
                  alignItems: "start",
                  padding: "8px 0",
                  border: 0,
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    color: isActive ? "#0b78b6" : "#64748b",
                    fontSize: 12,
                    fontWeight: 850,
                  }}
                >
                  {item.year}
                </div>

                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    border: isActive
                      ? "4px solid #0b78b6"
                      : "2px solid rgba(14,118,168,0.24)",
                    background: "#ffffff",
                    boxSizing: "border-box",
                    position: "relative",
                  }}
                />

                <div>
                  <div
                    style={{
                      color: "#0f172a",
                      fontSize: 13,
                      fontWeight: 850,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 16,
            background: "#f8fafc",
            border: "1px solid rgba(14,118,168,0.12)",
          }}
        >
          <div
            style={{
              color: "#0b78b6",
              fontSize: 12,
              fontWeight: 850,
              marginBottom: 6,
            }}
          >
            {active.year} — {active.label}
          </div>
          <div
            style={{
              color: "#0f172a",
              fontSize: 15,
              fontWeight: 850,
              marginBottom: 8,
            }}
          >
            {active.title}
          </div>
          <div style={{ color: "#486581", fontSize: 13, lineHeight: 1.6 }}>
            {active.body}
          </div>
          <div
            style={{
              marginTop: 10,
              color: "#0f172a",
              fontSize: 12,
              fontWeight: 850,
            }}
          >
            Key insight
          </div>
          <div style={{ color: "#486581", fontSize: 13, lineHeight: 1.6 }}>
            {active.insight}
          </div>
        </div>
      </div>

      <div style={panelStyle}>
        <div style={kickerStyle}>Runtime Intelligence</div>
        <div style={panelTitleStyle}>From 130 Questions to Targeted Intelligence</div>
        <div style={{ color: "#486581", fontSize: 13, lineHeight: 1.6 }}>
          Capability weakness → evidence gap → targeted probe → increased
          confidence → recommended action.
        </div>
      </div>
    </aside>
  );
}

const panelStyle = {
  padding: 24,
  borderRadius: 22,
  border: "1px solid rgba(14,118,168,0.14)",
  background: "#ffffff",
  boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
} as const;

const smallCardStyle = {
  padding: 22,
  borderRadius: 20,
  border: "1px solid rgba(14,118,168,0.14)",
  background: "#ffffff",
  boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
} as const;

const panelTitleStyle = {
  color: "#0f172a",
  fontSize: 16,
  fontWeight: 850,
  marginBottom: 14,
} as const;

const kickerStyle = {
  color: "#0b78b6",
  fontSize: 12,
  fontWeight: 850,
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
} as const;

export function FounderSandbox() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eaf1f7 0%, #f8fbfd 54%, #ffffff 100%)",
        padding: 48,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <div style={kickerStyle}>OASIS Founder Sandbox</div>

          <h1
            style={{
              color: "#0f172a",
              fontSize: 42,
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 820,
            }}
          >
            Explore CORE MVP+ and OASIS Runtime Intelligence™
          </h1>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            <StatusBadge>Founder Sandbox Release v1</StatusBadge>
            <StatusBadge tone="amber">Internal Review Environment</StatusBadge>
          </div>

          <p
            style={{
              color: "#486581",
              fontSize: 16,
              lineHeight: 1.7,
              marginTop: 18,
              maxWidth: 760,
            }}
          >
            Founder Sandbox Release v1 provides a safe internal environment for
            reviewing the current CORE product experience and the emerging OASIS
            Runtime Intelligence™ layer.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 24,
            marginBottom: 24,
          }}
        >
          <SandboxCard
            label="Environment A"
            title="CORE MVP+"
            status="MVP+ Complete"
            statusTone="green"
            description="Current product experience: onboarding, assessment, results, traceability, improvement pathway, and export-ready outputs."
            to="/core/start"
          />

          <SandboxCard
            label="Environment B"
            title="OASIS Runtime Intelligence™"
            status="Runtime Alpha"
            statusTone="amber"
            description="Future platform direction: executive runtime dashboard, capability influence, belief state, action queue, evidence requirements, and collection workflow."
            to="/core/executive"
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 420px",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 24 }}>
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 24,
              }}
            >
              <Checklist
                title="Release Progress"
                checked
                items={[
                  "CORE Assessment Workflow",
                  "Results & Traceability",
                  "Improvement Pathways",
                  "Executive Runtime Dashboard",
                  "Runtime Evidence Workflow",
                ]}
              />

              <Checklist
                title="Next Up"
                checked={false}
                items={[
                  "Capability Dependency Explorer",
                  "Trust & Confidence Engine",
                  "Evidence Collection Automation",
                  "AI Diagnostic Interviews",
                  "Runtime Digital Twin",
                ]}
              />

              <FeatureList
                title="Release Notes"
                items={[
                  "CORE MVP+",
                  "Executive Runtime Dashboard",
                  "Enterprise Belief State",
                  "Runtime Action Queue",
                  "Runtime Evidence Workflow",
                  "Capability Influence Mapping",
                  "Founder Sandbox",
                ]}
              />
            </section>

            <section style={panelStyle}>
              <div style={panelTitleStyle}>Suggested Founder Journey</div>

              <div
                style={{
                  color: "#486581",
                  fontSize: 14,
                  lineHeight: 1.8,
                }}
              >
                1. Launch CORE MVP+ and complete a sample assessment. 2. Review
                capability scores, traceability, and improvement pathways. 3.
                Open Runtime Intelligence. 4. Compare how Runtime interprets
                capability health, confidence, evidence strength, and action
                priorities.
              </div>
            </section>

            <section>
              <div
                style={{
                  color: "#0f172a",
                  fontSize: 18,
                  fontWeight: 850,
                  marginBottom: 14,
                }}
              >
                Founder Review Guide
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 16,
                }}
              >
                <GuideCard
                  title="CORE Assessment Workflow"
                  body="Complete a structured assessment and observe how OASIS converts responses into a defensible enterprise capability baseline."
                />

                <GuideCard
                  title="Results & Traceability"
                  body="Review how assessment responses remain connected to capability scores, confidence levels, supporting rationale, and executive interpretation."
                />

                <GuideCard
                  title="Improvement Pathways"
                  body="Explore how OASIS prioritises uplift opportunities and sequences practical improvement actions from the current weakest capability positions."
                />

                <GuideCard
                  title="Executive Runtime Dashboard"
                  body="See how capability performance can be interpreted as operational runtime conditions rather than static assessment results."
                />

                <GuideCard
                  title="Runtime Evidence Workflow"
                  body="Review how evidence requirements, collection activities, and assurance needs can be linked directly to capability confidence and recommended action."
                />
              </div>
            </section>

            <section style={panelStyle}>
              <div
                style={{
                  color: "#0f172a",
                  fontSize: 18,
                  fontWeight: 850,
                  marginBottom: 12,
                }}
              >
                Feedback & Suggestions
              </div>

              <div
                style={{
                  color: "#486581",
                  fontSize: 14,
                  lineHeight: 1.8,
                }}
              >
                We welcome observations, questions, defects, improvement ideas,
                and feature suggestions.
              </div>

              <div style={{ marginTop: 16 }}>
                <a
                  href="mailto:feedback@intrinsicsystems.com.au"
                  style={{
                    color: "#0b78b6",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  feedback@intrinsicsystems.com.au
                </a>
              </div>
            </section>
          </div>

          <StoryPane />
        </section>
      </div>
    </main>
  );
}