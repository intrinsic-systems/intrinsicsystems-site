import { SiteTopNav } from "../components/SiteTopNav";

export function ContactPage() {
  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <div className="o-page">
          <SiteTopNav />

          <header className="o-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">Contact</h1>
              <div className="o-page-tagline">
                Early conversations, pilot interest, and grant-aligned engagement
              </div>
            </div>

            <div className="o-page-subtitle">
              Intrinsic Systems is currently focused on MVP completion, pilot
              readiness, and investment in the next stage of platform
              development.
            </div>
          </header>

          <section className="o-suite-section" style={{ marginTop: 0 }}>
            <div
              className="o-card"
              style={{
                padding: 24,
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
                gap: 24,
                alignItems: "start",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    margin: "0 0 12px",
                    color: "var(--oasis-text-primary)",
                  }}
                >
                  Let’s discuss fit, pilots, and next-stage development
                </h2>

                <p className="o-text-body" style={{ marginBottom: 14 }}>
                  We are interested in conversations with organisations,
                  strategic partners, advisors, and early supporters who see
                  value in a more structured approach to enterprise capability
                  intelligence.
                </p>

                <p className="o-text-body" style={{ marginBottom: 14 }}>
                  Current areas of interest include pilot engagement,
                  collaboration around asset-intensive operating environments,
                  strategic introductions, and funding support for platform
                  maturation.
                </p>

                <p className="o-text-body" style={{ margin: 0 }}>
                  At this stage, contact is best framed around a practical
                  conversation: the operating problem, the capability gap, and
                  whether OASIS is the right strategic fit.
                </p>
              </div>

              <aside
                className="o-card"
                style={{
                  padding: 20,
                  background:
                    "linear-gradient(180deg, rgba(10,22,44,0.04) 0%, rgba(10,22,44,0.02) 100%)",
                  border: "1px solid var(--oasis-border-subtle)",
                  boxShadow: "none",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--oasis-text-muted)",
                    marginBottom: 6,
                  }}
                >
                  Current focus
                </div>

                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--oasis-text-primary)",
                    marginBottom: 10,
                  }}
                >
                  MVP, pilot readiness, and grant momentum
                </div>

                <div className="o-text-body">
                  Initial engagement is expected to centre on OASIS CORE™,
                  capability assessment, structural visibility, and next-step
                  platform development.
                </div>
              </aside>
            </div>
          </section>

          <section className="o-suite-section">
            <div className="o-page-header">
              <div className="o-page-header-main">
                <h2 className="o-page-title" style={{ fontSize: 20, margin: 0 }}>
                  Typical reasons to connect
                </h2>
              </div>

              <div className="o-page-subtitle">
                The most useful conversations usually begin with one of these.
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
              <ContactReason
                label="Pilot interest"
                title="Explore OASIS in a real operating context"
                body="For organisations wanting to test capability baseline visibility, prioritised uplift logic, and structured improvement insight."
              />
              <ContactReason
                label="Strategic partnership"
                title="Discuss complementary capability"
                body="For advisors, consultancies, implementation partners, and sector specialists interested in aligned collaboration."
              />
              <ContactReason
                label="Investment / support"
                title="Back the next stage of platform development"
                body="For parties interested in MVP acceleration, grant alignment, technical maturity, and commercial progression."
              />
            </div>
          </section>

          <section className="o-suite-section">
            <div
              className="o-card"
              style={{
                padding: 22,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 18,
              }}
            >
              <ContactMethod
                label="Email"
                title="hello@intrinsicsystems.com.au"
                body="For general enquiries, pilot discussions, strategic introductions, and collaboration."
              />
              <ContactMethod
                label="Website focus"
                title="Early-stage, founder-led engagement"
                body="Conversations are currently selective and oriented toward practical fit, timing, and development value."
              />
              <ContactMethod
                label="Preferred approach"
                title="Brief context first"
                body="A short note outlining your organisation, operating context, and reason for reaching out is ideal."
              />
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
              Intrinsic Systems is being developed as an{" "}
              <strong>Enterprise Capability Intelligence Platform</strong>,
              beginning with OASIS CORE™ and expanding toward a broader modular
              suite.
            </p>
            <p style={{ margin: 0 }}>
              Early engagement is best suited to organisations and partners who
              value structural clarity, measurable uplift pathways, and
              long-term capability engineering.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function ContactReason({
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

function ContactMethod({
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