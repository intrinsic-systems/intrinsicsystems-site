// src/acma/ACMAWizardPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import { ACMA_SECTORS } from "./acmaHierarchy";
import { SectorSelector } from "./SectorSelector";
import { SectorWizard } from "./SectorWizard";
import { computeSectorScore } from "./acmaScoring";
import { computeDerivedInfo } from "./acmaDerived";
import { buildAssessmentSummary } from "./acmaAssessmentSummary";
import { useNavigate } from "react-router-dom";
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
    <div className="o-page">
      <div className="o-page-header">
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

      {!currentSector && (
        <div
          className="o-card"
          style={{
            padding: 12,
            marginBottom: 12,
            fontSize: 12,
            color: "var(--oasis-text-secondary)",
            maxWidth: 840,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Standards alignment (mapping views)
          </div>
          Results from this readiness assessment can be viewed through multiple
          lenses after completion:
          <ul style={{ marginTop: 6, marginBottom: 6, paddingLeft: 18 }}>
            <li>OASIS Readiness Model (default)</li>
            <li>ISO 55001 clause mapping</li>
            <li>GFMAM subject area mapping</li>
          </ul>
          <div style={{ fontSize: 11, color: "var(--oasis-text-muted)" }}>
            In MVP+, mapping views are informational and do not redefine the
            primary readiness structure.
          </div>
        </div>
      )}

      {!currentSector && (
        <div style={{ marginBottom: 12 }}>
          <button
            className="o-btn o-btn--secondary"
            onClick={onExitToWelcome}
            style={{ fontSize: 12 }}
          >
            ← Back to welcome
          </button>
        </div>
      )}

      {!currentSector && (
        <>
          <p
            style={{
              fontSize: 13,
              color: "var(--oasis-text-secondary)",
              marginBottom: 16,
              maxWidth: 620,
            }}
          >
            A structured readiness assessment designed to establish a practical
            baseline across governance, lifecycle decision-making, capability
            alignment, risk visibility, and performance feedback structures.
          </p>

          <p
            style={{
              fontSize: 13,
              color: "var(--oasis-text-secondary)",
              marginBottom: 20,
              maxWidth: 620,
            }}
          >
            In this version, all responses are stored locally in your browser
            only. No data is transmitted or shared.
          </p>

          {overall.total > 0 && overall.answered > 0 && (
            <div className="o-card-stack">
              <div
                className="o-card"
                style={{
                  padding: 16,
                  maxWidth: 840,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--oasis-text-muted)",
                    marginBottom: 4,
                  }}
                >
                  Results overview
                </div>

                <div style={{ fontSize: 14, marginBottom: 8 }}>
                  Overall readiness: <strong>{overall.maturityPct}%</strong> (
                  {overall.answered}/{overall.total} answered)
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
                      {overall.completionPct}%
                    </div>
                  </div>

                  <div className="o-metric-card">
                    <div className="o-metric-card__label">Answers</div>
                    <div className="o-metric-card__value">
                      {overall.answered}/{overall.total}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: "var(--oasis-text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span>
                    {baseline
                      ? `Baseline saved ${new Date(
                          baseline.savedAt
                        ).toLocaleString()}`
                      : "No baseline saved yet."}
                  </span>

                  <div
                    style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}
                  >
                    <button
                      type="button"
                      className="o-btn o-btn--ghost"
                      style={{ fontSize: 11, padding: "2px 8px" }}
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
                        style={{ fontSize: 11, padding: "2px 8px" }}
                        onClick={handleClearBaseline}
                      >
                        Clear baseline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <SectorSelector
            sectors={ACMA_SECTORS}
            answers={answers}
            onSelect={(code) => setCurrentSectorCode(code)}
          />
        </>
      )}

      {currentSector && (
        <>
          <button
            onClick={() => setCurrentSectorCode(null)}
            className="o-btn o-btn--secondary"
            style={{ marginBottom: 12 }}
          >
            ← Back to sectors
          </button>

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
        </>
      )}

      {debugEnabled && showDebug && (
        <DebugPanel
          answers={answers}
          onClearAnswers={onClearAllAnswers}
          onClose={() => setShowDebug(false)}
        />
      )}

      {debugEnabled && !showDebug && !currentSector && (
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <button
            type="button"
            className="o-btn o-btn--ghost"
            style={{ fontSize: 11, padding: "4px 8px" }}
            onClick={() => setShowDebug(true)}
          >
            Show debug tools
          </button>
        </div>
      )}

      <footer
        style={{
          marginTop: 32,
          paddingTop: 12,
          borderTop: "1px solid var(--oasis-border-subtle)",
          fontSize: 11,
          color: "var(--oasis-text-muted)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
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
  );
};