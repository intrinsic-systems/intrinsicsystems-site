// src/acma/ACMAWizardPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACMA_SECTORS } from "./acmaHierarchy";
import { SectorSelector } from "./SectorSelector";
import { SectorWizard } from "./SectorWizard";
import { computeSectorScore } from "./acmaScoring";
import { computeDerivedInfo } from "./acmaDerived";
import { buildAssessmentSummary } from "./acmaAssessmentSummary";
import {
  logDerivedStatus,
  logSectorCoverage,
  logUnanswered,
} from "./debug/debugTools";
import { DebugPanel } from "./debug/DebugPanel";
import {
  loadBaseline,
  saveBaseline,
  clearBaseline,
  type BaselineSnapshot,
} from "./baselineStore";
import { OASIS_CONFIG } from "../config/oasisConfig";

type Props = {
  answers: Record<string, string>;
  onAnswer: (code: string, label: string) => void;
  onExitToWelcome: () => void;
  onClearAllAnswers: () => void;
};

const QUESTION_MODEL_VERSION = "Rev 6";
const APP_VERSION = "Prototype v0.1";

export const ACMAWizardPage: React.FC<Props> = ({
  answers,
  onAnswer,
  onExitToWelcome,
  onClearAllAnswers,
}) => {
  const [currentSectorCode, setCurrentSectorCode] = useState<string | null>(
    null
  );

  const [baseline, setBaseline] = useState<BaselineSnapshot | null>(() => {
    if (typeof window === "undefined") return null;
    return loadBaseline();
  });

  const debugEnabled =
    typeof window !== "undefined" &&
    window.location.search.includes("debug");

  const [showDebug, setShowDebug] = useState<boolean>(debugEnabled);

  const overall = useMemo(() => buildAssessmentSummary(answers), [answers]);
  const navigate = useNavigate();

  useEffect(() => {
    if (import.meta.env.DEV) {
      const win = window as typeof window & {
        oasisDebug?: {
          logDerived: () => void;
          logCoverage: () => void;
          logUnanswered: () => void;
        };
      };

      win.oasisDebug = {
        logDerived: () => logDerivedStatus(answers),
        logCoverage: () => logSectorCoverage(answers),
        logUnanswered: () => logUnanswered(answers),
      };
    }
  }, [answers]);

  useEffect(() => {
    ACMA_SECTORS.forEach((s) =>
      s.areas.forEach((a) =>
        a.activities.forEach((act) =>
          act.questions.forEach((q) => {
            if (!answers[q.code]) {
              const derived = computeDerivedInfo(q.code, answers);
              if (derived?.label) {
                onAnswer(q.code, derived.label);
              }
            }
          })
        )
      )
    );
  }, [answers, onAnswer]);

  const currentSector = useMemo(
    () => ACMA_SECTORS.find((s) => s.code === currentSectorCode) || null,
    [currentSectorCode]
  );

  const getNextIncompleteSectorCode = (
    fromSectorCode: string
  ): string | null => {
    const currentIndex = ACMA_SECTORS.findIndex(
      (s) => s.code === fromSectorCode
    );
    if (currentIndex < 0) return null;

    const nextIncomplete = ACMA_SECTORS.slice(currentIndex + 1).find((s) => {
      const score = computeSectorScore(s.code, answers);
      return score.answered < score.total;
    });

    return nextIncomplete?.code ?? null;
  };

  const handleSaveBaseline = () => {
    const snap = saveBaseline(answers);
    setBaseline(snap);
  };

  const handleClearBaseline = () => {
    clearBaseline();
    setBaseline(null);
  };

  return (
    <div className="o-page o-assessment-page">
      <div className="o-assessment-workspace">
        <div className="o-page-header o-assessment-page-header">
          <div className="o-page-header-main">
            <h1 className="o-page-title">
              {OASIS_CONFIG.core.name} — Readiness Assessment
            </h1>
            <div className="o-page-tagline">
              {APP_VERSION} · Local-only prototype (data stored in this browser)
            </div>
          </div>

          <div className="o-page-subtitle">
            Overall readiness:{" "}
            {overall.answered > 0
              ? `${overall.maturityPct}% baseline (based on ${overall.answered}/${overall.total} answered)`
              : "No responses yet"}
          </div>
      </div>

      <main className="o-sector-wizard-layout">
        <aside className="o-sector-wizard-aside">
          <div className="o-action-row o-assessment-back-row">
            <button
              onClick={() =>
                currentSector ? setCurrentSectorCode(null) : onExitToWelcome()
              }
              className="o-btn o-btn--secondary"
            >
              {currentSector ? "← Back to sectors" : "← Back to welcome"}
            </button>
          </div>

          <SectorSelector
            sectors={ACMA_SECTORS}
            answers={answers}
            onSelect={(code) => setCurrentSectorCode(code)}
          />
        </aside>

        <section className="o-assessment-main">
          {!currentSector ? (
            <>
              <div className="o-card o-card-pad o-standards-card">
                <div className="o-eyebrow">Standards alignment</div>

                <div className="o-text-small">
                  Results from this readiness assessment can be viewed through
                  multiple lenses after completion:
                </div>

                <ul className="o-text-small o-list-compact">
                  <li>OASIS Readiness Model (default)</li>
                  <li>ISO 55001 clause mapping</li>
                  <li>GFMAM subject area mapping</li>
                </ul>

                <div className="o-text-muted">
                  In MVP+, mapping views are informational and do not redefine the
                  primary readiness structure.
                </div>
              </div>

              <div className="o-stack-sm o-assessment-intro-copy">
                <p className="o-text-small">
                  A structured readiness assessment designed to establish a practical
                  baseline across governance, lifecycle decision-making, capability
                  alignment, risk visibility, and performance feedback structures.
                </p>

                <p className="o-text-small">
                  In this version, all responses are stored locally in your browser
                  only. No data is transmitted or shared.
                </p>
              </div>

              {overall.total > 0 && overall.answered > 0 && (
                <div className="o-card o-card-pad o-results-overview-card">
                  <div className="o-eyebrow">Results overview</div>

                  <div className="o-text-small">
                    Overall readiness:
                    <strong> {overall.maturityPct}%</strong>
                    {" "}({overall.answered}/{overall.total} answered)
                  </div>

                  <div className="o-results-summary-grid">
                    <div className="o-metric-card">
                      <div className="o-metric-card__label">
                        Enterprise capability baseline
                      </div>

                      <div className="o-metric-card__value">
                        {overall.maturityPct}%
                      </div>
                    </div>

                    <div className="o-metric-card">
                      <div className="o-metric-card__label">Completion</div>

                      <div className="o-metric-card__value">
                        {overall.completionPct}%
                      </div>
                    </div>

                    <div className="o-metric-card">
                      <div className="o-metric-card__label">Confidence</div>

                      <div className="o-metric-card__value">
                        {overall.confidencePct}%
                      </div>
                    </div>

                    <div className="o-metric-card">
                      <div className="o-metric-card__label">Answers</div>

                      <div className="o-metric-card__value">
                        {overall.answered}/{overall.total}
                      </div>
                    </div>
                  </div>

                  <div className="o-baseline-actions">
                    <span>
                      {baseline
                        ? `Baseline saved ${new Date(
                            baseline.savedAt
                          ).toLocaleString()}`
                        : "No baseline saved yet."}
                    </span>

                    <button
                      type="button"
                      className="o-btn o-btn--ghost"
                      onClick={handleSaveBaseline}
                    >
                      {baseline
                        ? "Update baseline from current"
                        : "Save current as baseline"}
                    </button>

                    {baseline && (
                      <button
                        type="button"
                        className="o-btn o-btn--ghost"
                        onClick={handleClearBaseline}
                      >
                        Clear baseline
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <SectorWizard
              sector={currentSector}
              answers={answers}
              onAnswer={onAnswer}
              onExit={() => setCurrentSectorCode(null)}
              onCompleteSector={() => {
                const nextSectorCode = getNextIncompleteSectorCode(
                  currentSector.code
                );

                if (nextSectorCode) {
                  setCurrentSectorCode(nextSectorCode);
                } else {
                 setCurrentSectorCode(null);
                }
              }}
            />
          )}
        </section>
      </main>

      {debugEnabled && showDebug && (
        <DebugPanel
          answers={answers}
          onClearAnswers={onClearAllAnswers}
          onClose={() => setShowDebug(false)}
        />
      )}

      {debugEnabled && !showDebug && !currentSector && (
        <div className="o-action-row">
          <button
            type="button"
            className="o-btn o-btn--ghost"
            onClick={() => setShowDebug(true)}
          >
            Show debug tools
          </button>
        </div>
      )}

      <footer className="o-core-footer">
        <div>
          © {OASIS_CONFIG.copyright.year} {OASIS_CONFIG.company.legal}. All
          rights reserved.
        </div>
        <div>
          OASIS CORE — MVP+ · {APP_VERSION} · Question model:{" "}
          {QUESTION_MODEL_VERSION} (“Questions + Planning Analysis Rev6.xlsx”)
        </div>
        <div>Prototype build for internal review and MVP demonstration.</div>
      </footer>
      </div>
    </div>
  );
};