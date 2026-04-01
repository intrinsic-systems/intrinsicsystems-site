import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { UserOrgProfile } from "../OnboardingWizard";
import { ACMA_TOTAL_QUESTIONS } from "../acma/acmaQuestions";
import { CoreFlowNav } from "./components/CoreFlowNav";
import { OasisLogo } from "../components/OasisLogo";
import { buildAssessmentSummary } from "../acma/acmaAssessmentSummary";

export type CoreFlowContextValue = {
  answers: Record<string, string>;
  onAnswer: (code: string, label: string) => void;
  clearAllAnswers: () => void;
  onOnboardingComplete: (profile: UserOrgProfile) => void;
  goWelcome: () => void;
  goOnboarding: () => void;
  goAcma: () => void;
};

type ISControlLayerProps = {
  mode: "compact" | "standard";
  answersCount: number;
  totalQuestions: number;
  completionPct: number;
  maturityPct: number;
  confidencePct: number;
  riskLevel: string;
};

function ISControlLayer({
  mode,
  answersCount,
  totalQuestions,
  completionPct,
  maturityPct,
  confidencePct,
  riskLevel,
}: ISControlLayerProps) {
  return (
    <div className="o-is-control-layer">
      <div className="o-is-control-layer__inner">
        <div className="o-is-control-layer__left">
          <div className="o-is-mark">
            <OasisLogo size={20} />
          </div>
        </div>

        <div
          className={
            mode === "compact"
              ? "o-is-control-layer__center o-is-control-layer__center--compact"
              : "o-is-control-layer__center"
          }
        >
          <div className="o-metric">
            <div className="o-metric__label">Responses</div>
            <div className="o-metric__value">
              {answersCount} / {totalQuestions}
            </div>
          </div>

          <div className="o-metric">
            <div className="o-metric__label">Completion</div>
            <div className="o-metric__value">{completionPct}%</div>

            <div
              className="o-progress"
              role="progressbar"
              aria-label="Assessment completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completionPct}
            >
              <div
                className="o-progress__bar"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          {mode === "standard" && (
            <>
              <div className="o-metric">
                <div className="o-metric__label">Maturity</div>
                <div className="o-metric__value">{maturityPct}%</div>
              </div>

              <div className="o-metric">
                <div className="o-metric__label">Confidence</div>
                <div className="o-metric__value">{confidencePct}%</div>
              </div>

              <div className="o-metric">
                <div className="o-metric__label">Risk</div>
                <div className="o-metric__value">{riskLevel}</div>
              </div>
            </>
          )}
        </div>

        <div className="o-is-control-layer__right">
          <div className="o-context-pill">Prototype</div>
        </div>
      </div>
    </div>
  );
}

export function CoreFlowShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem("oasis_acma_answers");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const assessmentSummary = useMemo(
    () => buildAssessmentSummary(answers),
    [answers]
  );

  const onAnswer = (code: string, label: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [code]: label };
      try {
        localStorage.setItem("oasis_acma_answers", JSON.stringify(next));
      } catch {
        // ignore for prototype
      }
      return next;
    });
  };

  const clearAllAnswers = () => {
    try {
      localStorage.removeItem("oasis_acma_answers");
    } catch {
      // ignore
    }
    setAnswers({});
  };

  const onOnboardingComplete = (profile: UserOrgProfile) => {
    try {
      localStorage.setItem("oasis_profile", JSON.stringify(profile));
    } catch {
      // ignore storage errors in prototype
    }
    navigate("/core/acma");
  };

  const value: CoreFlowContextValue = useMemo(
    () => ({
      answers,
      onAnswer,
      clearAllAnswers,
      onOnboardingComplete,
      goWelcome: () => navigate("/core/start"),
      goOnboarding: () => navigate("/core/onboarding"),
      goAcma: () => navigate("/core/acma"),
    }),
    [answers, navigate]
  );

  const mode: "compact" | "standard" =
    location.pathname.startsWith("/core/start") ||
    location.pathname.startsWith("/core/onboarding")
      ? "compact"
      : "standard";

  const answersCount = Object.keys(answers).length;

  const completionPct =
    ACMA_TOTAL_QUESTIONS > 0
      ? Math.round((answersCount / ACMA_TOTAL_QUESTIONS) * 100)
      : 0;

  return (
    <div className="o-core-shell">
      <ISControlLayer
        mode={mode}
        answersCount={answersCount}
        totalQuestions={ACMA_TOTAL_QUESTIONS}
        completionPct={completionPct}
        maturityPct={assessmentSummary.maturityPct}
        confidencePct={assessmentSummary.confidencePct}
        riskLevel={assessmentSummary.riskLevel}
      />

      <CoreFlowNav />

      <div className="o-core-shell__content o-workspace-frame">
        <Outlet context={value} />
      </div>
    </div>
  );
}