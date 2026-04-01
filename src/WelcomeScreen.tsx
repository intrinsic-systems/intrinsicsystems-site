// src/WelcomeScreen.tsx
import React from "react";
import { OASIS_CONFIG } from "./config/oasisConfig";
import { PageIntro } from "./core/PageIntro";
import { ContextAside } from "./core/ContextAside";

type Props = {
  onStartNew: () => void;
  onContinueExisting: () => void;
  onBackToSuite: () => void;
  hasPrevious?: boolean;
};

export const WelcomeScreen: React.FC<Props> = ({
  onStartNew,
  onContinueExisting,
  onBackToSuite,
  hasPrevious = false,
}) => {
  const year = new Date().getFullYear();

  return (
    <div className="o-page">
      <header className="o-page-header" style={{ marginBottom: 28 }}>
        <div className="o-page-header-main">
          <h1 className="o-page-title">{OASIS_CONFIG.core.name}</h1>
          <div className="o-page-tagline">
            Engineered Enterprise Capability — CORE MVP+
          </div>
        </div>
        <div className="o-page-subtitle">
          Establish a structured enterprise capability baseline across governance,
          planning, information, lifecycle decision-making, and operational
          delivery.
        </div>
      </header>

      <main className="o-page-grid o-page-grid--hero">
        <section className="o-page-main">
          <PageIntro
            title="Start a capability baseline assessment"
            summary="OASIS CORE transforms structured assessment into a defensible capability baseline, helping organisations identify where uplift is required, why it matters, and how improvement should be prioritised."
          />

          <p className="o-text-lead" style={{ marginBottom: 14 }}>
            Results can be explored through structured capability views and
            recognised standards lenses, including ISO 55001 clause mapping and
            GFMAM subject area mapping.
          </p>

          <p className="o-text-lead" style={{ marginBottom: 22 }}>
            In this MVP+, responses are stored locally in your browser only. No
            assessment data is transmitted or shared, reflecting the platform’s
            minimum-data, privacy-conscious design approach.
          </p>

          <div className="o-action-row" style={{ marginBottom: 18 }}>
            <button className="o-btn o-btn--primary" onClick={onStartNew}>
              Start new assessment →
            </button>

            {hasPrevious && (
              <button
                className="o-btn o-btn--ghost"
                onClick={onContinueExisting}
              >
                Continue previous
              </button>
            )}

            <button className="o-btn o-btn--secondary" onClick={onBackToSuite}>
              ← Back to Suite
            </button>
          </div>

          <div className="o-text-small" style={{ maxWidth: 700 }}>
            Future releases will support named organisations, scoped
            assessments, benchmark comparison, enterprise capability views, and
            modular OASIS extensions including PULSE, HORIZON, NEXUS, ATLAS,
            and PATHWAYS.
          </div>
        </section>

        <ContextAside
          title="Platform overview"
          items={[
            {
              title: "Release status",
              body: "OASIS CORE — MVP+ pilot release",
            },
            {
              title: "Assessment model",
              body: "ACMA question set",
            },
            {
              title: "Standards mapping",
              body: "Optional ISO 55001 / GFMAM views after assessment",
            },
            {
              title: "Storage",
              body: "Browser-local only for this prototype",
            },
          ]}
          footer={`© ${year} Intrinsic Systems Pty Ltd. All rights reserved.`}
        />
      </main>
    </div>
  );
};