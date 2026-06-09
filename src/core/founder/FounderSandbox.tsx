import { Link } from "react-router-dom";

function StatusBadge({
  children,
  tone = "blue",
}: {
  children: string;
  tone?: "blue" | "green" | "amber";
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

function GuideCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 20,
        border: "1px solid rgba(14,118,168,0.14)",
        background: "#ffffff",
        boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
      }}
    >
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

      <div
        style={{
          color: "#486581",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {body}
      </div>
    </div>
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
        display: "block",
        padding: 28,
        borderRadius: 24,
        border: "1px solid rgba(14,118,168,0.16)",
        background: "#ffffff",
        boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            color: "#0b78b6",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
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
        Launch →
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
    <div
      style={{
        padding: 24,
        borderRadius: 22,
        border: "1px solid rgba(14,118,168,0.14)",
        background: "#ffffff",
        boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          color: "#0f172a",
          fontSize: 16,
          fontWeight: 850,
          marginBottom: 14,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "grid",
          gap: 10,
        }}
      >
        {items.map((item) => (
          <div
            key={item}
            style={{
              color: "#486581",
              fontSize: 14,
              lineHeight: 1.5,
            }}
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
    <div
      style={{
        padding: 24,
        borderRadius: 22,
        border: "1px solid rgba(14,118,168,0.14)",
        background: "#ffffff",
        boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          color: "#0f172a",
          fontSize: 16,
          fontWeight: 850,
          marginBottom: 14,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "grid",
          gap: 10,
        }}
      >
        {items.map((item) => (
          <div
            key={item}
            style={{
              color: "#486581",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            • {item}
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <header style={{ marginBottom: 36 }}>
          <div
            style={{
              color: "#0b78b6",
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 10,
            }}
          >
            OASIS Founder Sandbox
          </div>

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
            reviewing the current CORE product experience and the emerging
            OASIS Runtime Intelligence™ layer.
          </p>
        </header>

        <section
          style={{
           padding: 24,
            borderRadius: 22,
            border: "1px solid rgba(14,118,168,0.14)",
            background: "#ffffff",
            boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              color: "#0f172a",
              fontSize: 18,
              fontWeight: 850,
              marginBottom: 12,
            }}
          >
            What Are You Reviewing?
          </div>

          <div
            style={{
              color: "#486581",
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            ✓ OASIS CORE MVP+ capability assessment workflow<br />
            ✓ Capability scoring and traceability model<br />
            ✓ Improvement pathway generation<br />
            ✓ Runtime Intelligence concepts and visualisations<br />
            ✓ Enterprise Belief State and Action Queue<br />
            ✓ Evidence-driven operational decision support
          </div>

          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 12,
              background: "#f8fafc",
              color: "#64748b",
              fontSize: 13,
            }}
          >
            This environment is an internal preview release intended to validate
            product direction, user experience, and enterprise value. It is not yet a
            production release.
          </div>
        </section>

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
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 24,
            marginBottom: 24,
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

        <section
          style={{
            padding: 24,
            borderRadius: 22,
            border: "1px solid rgba(14,118,168,0.14)",
            background: "#ffffff",
            boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              color: "#0f172a",
              fontSize: 16,
              fontWeight: 850,
              marginBottom: 12,
            }}
          >
            Suggested Founder Journey
          </div>

          <div
            style={{
              color: "#486581",
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            1. Complete a sample CORE assessment. 2. Review capability scores
            and traceability. 3. Explore improvement pathways. 4. Open OASIS
            Runtime Intelligence™. 5. Compare how Runtime interprets capability
            health, confidence, evidence strength, and action priorities.
          </div>
        </section>

        <section style={{ marginBottom: 24 }}>
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
        <section
          style={{
            padding: 24,
            borderRadius: 22,
            border: "1px solid rgba(14,118,168,0.14)",
            background: "#ffffff",
            boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
          }}
        >
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
            We welcome observations, questions, defects, improvement ideas, and
            feature suggestions.
          </div>
          <div
            style={{
              marginTop: 16,
            }}
          >
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
    </main>
  );
}