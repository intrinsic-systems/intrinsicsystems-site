import { SiteTopNav } from "../components/SiteTopNav";
import { InfoBlock } from "../components/InfoBlock";

export function ContactPage() {
  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <main className="o-page o-site-page">
          <SiteTopNav />

          <header className="o-page-header o-site-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">Contact</h1>
              <div className="o-page-tagline">
                Pilots, partnerships, and next-stage development
              </div>
            </div>

            <div className="o-page-subtitle">
              Intrinsic Systems is focused on OASIS CORE™ completion, pilot
              readiness, grant alignment, and the next stage of platform
              development.
            </div>
          </header>

          <section className="o-site-section" style={{ marginTop: 0 }}>
            <div className="o-card o-card-pad o-site-split-card">
              <div>
                <h2>Let’s discuss fit, pilots, and strategic alignment</h2>

                <p>
                  We are interested in conversations with organisations,
                  strategic partners, advisors, and early supporters who see value
                  in a more structured approach to enterprise capability
                  intelligence.
                </p>

                <p>
                  The most useful conversations start with a practical operating
                  problem: where capability is constrained, why current reporting
                  is insufficient, and whether OASIS can provide clearer
                  diagnostic and improvement direction.
                </p>

                <p>
                  Current engagement is selective and centred on pilot value,
                  strategic fit, platform maturation, and grant-aligned
                  development momentum.
                </p>
              </div>

              <aside className="o-card o-card-pad o-site-priority-card">
                <div className="o-text-label">Current focus</div>
                <h3>MVP, pilot readiness, and grant momentum</h3>

                <ul className="o-clean-list">
                  <li>OASIS CORE™ pilot conversations</li>
                  <li>Asset-intensive operating environments</li>
                  <li>Strategic partner alignment</li>
                  <li>Platform maturation and investment support</li>
                </ul>
              </aside>
            </div>
          </section>

          <section className="o-site-section">
            <div className="o-site-section__header">
              <h2 className="o-site-section-title">Typical reasons to connect</h2>
              <p>
                The strongest conversations usually begin with a clear operating
                context, capability challenge, or development opportunity.
              </p>
            </div>

            <div className="o-card o-card-pad o-site-three-grid">
              <InfoBlock
                label="Pilot interest"
                title="Explore OASIS in a real operating context"
                body="For organisations wanting to test capability baseline visibility, prioritised uplift logic, and structured improvement insight."
              />
              <InfoBlock
                label="Strategic partnership"
                title="Discuss complementary capability"
                body="For advisors, consultancies, implementation partners, and sector specialists interested in aligned collaboration."
              />
              <InfoBlock
                label="Investment / support"
                title="Back the next stage of platform development"
                body="For parties interested in MVP acceleration, grant alignment, technical maturity, and commercial progression."
              />
            </div>
          </section>

          <section className="o-site-section">
            <div className="o-site-section__header">
              <h2 className="o-site-section-title">How to reach us</h2>
              <p>
                A short note with context is the best starting point.
              </p>
            </div>

            <div className="o-card o-card-pad o-site-three-grid">
              <InfoBlock
                label="Email"
                title="hello@intrinsicsystems.com.au"
                body="For general enquiries, pilot discussions, strategic introductions, and collaboration."
              />
              <InfoBlock
                label="Engagement style"
                title="Early-stage and founder-led"
                body="Conversations are currently selective, practical, and focused on timing, fit, and development value."
              />
              <InfoBlock
                label="Preferred approach"
                title="Brief context first"
                body="Outline your organisation, operating environment, capability challenge, and reason for reaching out."
              />
            </div>
          </section>

          <section className="o-site-footer-note">
            <p>
              Intrinsic Systems is developing OASIS as an{" "}
              <strong>Enterprise Capability Intelligence Platform</strong>,
              beginning with OASIS CORE™ and expanding toward a broader modular
              suite.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}