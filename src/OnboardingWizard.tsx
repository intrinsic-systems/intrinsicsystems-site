// src/OnboardingWizard.tsx
import React, { useState } from "react";
import { StepProgress } from "./core/StepProgress";
import { PageIntro } from "./core/PageIntro";
import { ContextAside } from "./core/ContextAside";

export type UserOrgProfile = {
  user: {
    name: string;
    email: string;
    role: string;
  };
  org: {
    name: string;
    sector: string;
    region: string;
    size: string;
    currency: string;
  };
  scope: {
    assetClass: string;
    horizon: string;
    baselineYear: string;
  };
};

type Props = {
  onComplete: (profile: UserOrgProfile) => void;
  onSkip: () => void;
  onCancel: () => void;
};

function StepIcon({ step }: { step: number }) {
  const symbol = step === 0 ? "◉" : step === 1 ? "▣" : "◌";

  return (
    <div
      aria-hidden="true"
      style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        display: "grid",
        placeItems: "center",
        background: "var(--oasis-accent-soft)",
        border: "1px solid var(--oasis-border-subtle)",
        color: "var(--oasis-accent-strong)",
        fontSize: 14,
        flex: "0 0 auto",
        marginTop: 2,
      }}
    >
      {symbol}
    </div>
  );
}

export const OnboardingWizard: React.FC<Props> = ({
  onComplete,
  onSkip,
  onCancel,
}) => {
  const [step, setStep] = useState(0);

  const [user, setUser] = useState<UserOrgProfile["user"]>({
    name: "",
    email: "",
    role: "",
  });

  const [org, setOrg] = useState<UserOrgProfile["org"]>({
    name: "",
    sector: "Roads & Transport",
    region: "",
    size: "",
    currency: "AUD",
  });

  const [scope, setScope] = useState<UserOrgProfile["scope"]>({
    assetClass: "Multi-asset portfolio",
    horizon: "5-year horizon",
    baselineYear: new Date().getFullYear().toString(),
  });

  const isLastStep = step === 2;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      const profile: UserOrgProfile = { user, org, scope };
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  const renderStepLabel = () => {
    if (step === 0) return "Step 1 of 3 · About you";
    if (step === 1) return "Step 2 of 3 · Your organisation";
    return "Step 3 of 3 · Assessment scope";
  };

  const renderStepTitle = () => {
    if (step === 0) return "Tell us about you";
    if (step === 1) return "Tell us about your organisation";
    return "Define your assessment scope";
  };

  const renderStepSummary = () => {
    if (step === 0) {
      return "Capture the primary user context for this assessment.";
    }
    if (step === 1) {
      return "Establish organisational context to support sector-aware interpretation.";
    }
    return "Define the portfolio and planning context that will shape downstream analysis.";
  };

  return (
    <div className="o-page">
      <div className="o-page-header" style={{ marginBottom: 28 }}>
        <div className="o-page-header-main">
          <h1 className="o-page-title">New Assessment</h1>
          <div className="o-page-tagline">
            OASIS Core · Context setup (MVP)
          </div>
        </div>
        <div className="o-page-subtitle">
          This information helps OASIS tailor assessment analysis and future
          recommendations to your organisation’s context.
        </div>
      </div>

      <main className="o-page-grid">
        <section className="o-page-main">
          <div className="o-card" style={{ padding: 24 }}>
            <PageIntro
              eyebrow={renderStepLabel()}
              title={renderStepTitle()}
              summary={renderStepSummary()}
              icon={<StepIcon step={step} />}
            >
              <StepProgress
                step={step}
                total={3}
                labels={["About you", "Organisation", "Scope"]}
              />
            </PageIntro>

            {step === 0 && (
              <div className="o-form-grid">
                <label className="o-field-label">
                  Your name
                  <input
                    className="o-field-input"
                    type="text"
                    value={user.name}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Stewart Smith"
                  />
                </label>

                <label className="o-field-label">
                  Email
                  <input
                    className="o-field-input"
                    type="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="e.g. stewart@example.com"
                  />
                </label>

                <label className="o-field-label">
                  Role
                  <input
                    className="o-field-input"
                    type="text"
                    value={user.role}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, role: e.target.value }))
                    }
                    placeholder="e.g. Asset Manager, Director, Consultant"
                  />
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="o-form-grid">
                <label className="o-field-label">
                  Organisation name
                  <input
                    className="o-field-input"
                    type="text"
                    value={org.name}
                    onChange={(e) =>
                      setOrg((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. City of Example"
                  />
                </label>

                <label className="o-field-label">
                  Sector / industry
                  <select
                    className="o-field-input"
                    value={org.sector}
                    onChange={(e) =>
                      setOrg((prev) => ({ ...prev, sector: e.target.value }))
                    }
                  >
                    <option>Roads & Transport</option>
                    <option>Water & Wastewater</option>
                    <option>Electricity & Energy</option>
                    <option>Local Government (multi-asset)</option>
                    <option>State / National Government</option>
                    <option>Facilities & Buildings</option>
                    <option>Other / Mixed</option>
                  </select>
                </label>

                <label className="o-field-label">
                  Region / country
                  <input
                    className="o-field-input"
                    type="text"
                    value={org.region}
                    onChange={(e) =>
                      setOrg((prev) => ({ ...prev, region: e.target.value }))
                    }
                    placeholder="e.g. Queensland, Australia"
                  />
                </label>

                <div className="o-form-row-2">
                  <label className="o-field-label">
                    Organisation size
                    <select
                      className="o-field-input"
                      value={org.size}
                      onChange={(e) =>
                        setOrg((prev) => ({ ...prev, size: e.target.value }))
                      }
                    >
                      <option value="">Select...</option>
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                      <option>Very large</option>
                    </select>
                  </label>

                  <label className="o-field-label">
                    Currency
                    <input
                      className="o-field-input"
                      type="text"
                      value={org.currency}
                      onChange={(e) =>
                        setOrg((prev) => ({ ...prev, currency: e.target.value }))
                      }
                      placeholder="e.g. AUD"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="o-form-grid">
                <label className="o-field-label">
                  Asset class focus
                  <select
                    className="o-field-input"
                    value={scope.assetClass}
                    onChange={(e) =>
                      setScope((prev) => ({
                        ...prev,
                        assetClass: e.target.value,
                      }))
                    }
                  >
                    <option>Multi-asset portfolio</option>
                    <option>Roads & Transport</option>
                    <option>Water & Wastewater</option>
                    <option>Electricity & Energy</option>
                    <option>Buildings & Facilities</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="o-field-label">
                  Planning horizon
                  <select
                    className="o-field-input"
                    value={scope.horizon}
                    onChange={(e) =>
                      setScope((prev) => ({
                        ...prev,
                        horizon: e.target.value,
                      }))
                    }
                  >
                    <option>3-year horizon</option>
                    <option>5-year horizon</option>
                    <option>10-year horizon</option>
                  </select>
                </label>

                <label className="o-field-label">
                  Baseline year
                  <input
                    className="o-field-input"
                    type="text"
                    value={scope.baselineYear}
                    onChange={(e) =>
                      setScope((prev) => ({
                        ...prev,
                        baselineYear: e.target.value,
                      }))
                    }
                    placeholder="e.g. 2025"
                  />
                </label>

                <p className="o-text-small" style={{ margin: "4px 0 0" }}>
                  These settings help shape future program development, work
                  breakdown structures and investment planning derived from your
                  assessment outcomes.
                </p>
              </div>
            )}

            <div className="o-form-actions">
              <div className="o-form-actions__group">
                <button
                  className="o-btn o-btn--secondary"
                  type="button"
                  onClick={handleBack}
                >
                  {step === 0 ? "← Back to welcome" : "← Previous"}
                </button>
              </div>

              <div className="o-form-actions__group">
                <button
                  className="o-btn o-btn--ghost"
                  type="button"
                  onClick={onSkip}
                >
                  Skip for now
                </button>
                <button
                  className="o-btn o-btn--primary"
                  type="button"
                  onClick={handleNext}
                >
                  {isLastStep ? "Start assessment →" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <ContextAside
          eyebrow="Assessment context"
          title="Why this matters"
          items={[
            {
              title: "Better interpretation",
              body:
                "Organisational context improves how OASIS frames readiness findings and future uplift pathways.",
            },
            {
              title: "Better comparisons",
              body:
                "Sector, scale, and scope settings help future releases benchmark maturity more meaningfully.",
            },
            {
              title: "Better downstream planning",
              body:
                "Scope settings will inform future program structuring, roadmap logic, and investment modelling outputs.",
            },
          ]}
        />
      </main>
    </div>
  );
};