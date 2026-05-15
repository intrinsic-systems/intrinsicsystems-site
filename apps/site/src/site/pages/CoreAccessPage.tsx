import { Link } from "react-router-dom";

export function CoreAccessPage() {
  return (
    <main className="site-page site-page--core">
      <section className="site-hero site-hero--core">
        <div>
          <p className="site-kicker">OASIS CORE™</p>
          <h1>Engineered Enterprise Capability</h1>
          <p className="site-lede">
            OASIS CORE™ transforms structured assessment into capability
            intelligence — revealing current position, confidence, risk, and
            priority uplift pathways.
          </p>

          <div className="site-actions">
            <a className="site-button site-button--primary" href="https://core.intrinsicsystems.com.au/core/start">
              Start CORE assessment
            </a>
            <a className="site-button site-button--secondary" href="https://core.intrinsicsystems.com.au/core/results">
              View sample results
            </a>
          </div>
        </div>

        <div className="core-hero-card">
          <h2>From MIST assessment to capability intelligence</h2>
          <p>
            CORE preserves ISO 55000 and GFMAM alignment while restructuring the
            model into domains, elements, capabilities, and decision-ready outputs.
          </p>
        </div>
      </section>

      <section className="core-three-card">
        <article>
          <h3>1. MIST Foundation</h3>
          <p>Structured maturity assessment with ISO 55000 and GFMAM alignment.</p>
          <p className="muted">Limitation: high question volume, static outputs, weaker decision linkage.</p>
        </article>

        <article>
          <h3>2. Transformation</h3>
          <p>Questions become a capability model with explicit hierarchy, scoring, evidence, and weighting.</p>
          <p className="muted">CORE → PROBE → EVIDENCE creates adaptive depth.</p>
        </article>

        <article>
          <h3>3. OASIS CORE™</h3>
          <p>An engineered enterprise capability system for clarity, traceability, and action.</p>
          <p className="muted">Outputs include LCI, confidence, risk, and priority uplift.</p>
        </article>
      </section>

      <section className="core-board">
        <h2>Capability intelligence model</h2>
        <p>
          CORE converts assessment responses into structured executive intelligence:
          current position, benchmark position, target position, CORE network position,
          confidence, risk, and improvement sequence.
        </p>

        <img
          src="/oasis-core-transformation-board.png"
          alt="OASIS CORE transformation from MIST assessment to engineered enterprise capability system"
        />
      </section>

      <section className="core-output-grid">
        <article>
          <h3>Lifecycle Coherence Index</h3>
          <p>A board-level indicator of how coherently capability performs across the enterprise lifecycle.</p>
        </article>

        <article>
          <h3>Confidence Score</h3>
          <p>Shows whether results are sufficiently supported by response quality, evidence, and consistency.</p>
        </article>

        <article>
          <h3>Risk Signal</h3>
          <p>Highlights where capability weakness may affect governance, delivery, reliability, or performance.</p>
        </article>

        <article>
          <h3>Priority Uplift</h3>
          <p>Sequences practical improvement actions based on current position and relative impact.</p>
        </article>
      </section>
    </main>
  );
}