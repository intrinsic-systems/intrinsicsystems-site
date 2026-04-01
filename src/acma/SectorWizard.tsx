import React, { useState, useMemo, useEffect, useCallback } from "react";
import type { ACMASector } from "./acmaHierarchy";
import { ACMA_MATURITY } from "./acmaHierarchy";
import { computeSectorScore } from "./acmaScoring";
import { computeDerivedInfo } from "./acmaDerived";
import { ResponseScale, type ResponseScaleOption } from "./ResponseScale";

type Props = {
  sector: ACMASector;
  answers: Record<string, string>;
  onAnswer: (code: string, label: string) => void;
  onExit: () => void;
  onCompleteSector: () => void;
};

type ScopeScore = {
  total: number;
  answered: number;
  scorePct: number;
};

type ProfileSummary = {
  orgName?: string;
  sector?: string;
  region?: string;
  assetClass?: string;
  horizon?: string;
};

type FlatQuestionRef = {
  areaIdx: number;
  activityIdx: number;
  questionIdx: number;
  areaCode: string;
  areaName: string;
  activityCode: string;
  activityName: string;
  code: string;
  text: string;
};

const MATURITY_VALUES: Record<string, number> = {
  Innocent: 0.0,
  Aware: 5.0,
  Developing: 35.0,
  Competent: 70.0,
  Optimising: 90.0,
  Excellent: 100.0,
};

const RESPONSE_SCALE_OPTIONS: ResponseScaleOption[] = [
  {
    value: "Innocent",
    label: "Not started",
    short: "Level 1",
    hint: "This is not yet in place or is largely absent.",
  },
  {
    value: "Aware",
    label: "Emerging",
    short: "Level 2",
    hint: "This is recognised, but remains limited or informal.",
  },
  {
    value: "Developing",
    label: "Progressing",
    short: "Level 3",
    hint: "This is underway, but not yet consistent across practice.",
  },
  {
    value: "Competent",
    label: "Established",
    short: "Level 4",
    hint: "This is operating and generally embedded in practice.",
  },
  {
    value: "Optimising",
    label: "Advanced",
    short: "Level 5",
    hint: "This is strong, coordinated, and improving over time.",
  },
  {
    value: "Excellent",
    label: "Leading",
    short: "Level 6",
    hint: "This is highly effective, mature, and sustained.",
  },
];

function computeScopeScore(
  questionCodes: string[],
  answers: Record<string, string>
): ScopeScore {
  const total = questionCodes.length;
  if (!total) return { total: 0, answered: 0, scorePct: 0 };

  let answered = 0;
  let sum = 0;

  questionCodes.forEach((code) => {
    let label = answers[code];
    if (label == null) {
      const derived = computeDerivedInfo(code, answers);
      if (derived?.label) {
        label = derived.label;
      }
    }

    if (label != null) {
      answered++;
      sum += MATURITY_VALUES[label] ?? 0;
    }
  });

  return {
    total,
    answered,
    scorePct: answered ? sum / answered : 0,
  };
}

const getActivityStats = (
  actQuestions: { code: string }[],
  answers: Record<string, string>
) => {
  const codes = actQuestions.map((q) => q.code);
  const total = codes.length;

  const answered = codes.filter((code) => {
    if (answers[code] != null) return true;
    const derived = computeDerivedInfo(code, answers);
    return !!derived?.label;
  }).length;

  const pct = total ? Math.round((100 * answered) / total) : 0;
  return { answered, total, pct };
};

function buildFlatQuestionList(sector: ACMASector): FlatQuestionRef[] {
  const flat: FlatQuestionRef[] = [];

  sector.areas.forEach((area, areaIdx) => {
    area.activities.forEach((activity, activityIdx) => {
      activity.questions.forEach((question, questionIdx) => {
        flat.push({
          areaIdx,
          activityIdx,
          questionIdx,
          areaCode: area.code,
          areaName: area.name,
          activityCode: activity.code,
          activityName: activity.name,
          code: question.code,
          text: question.text,
        });
      });
    });
  });

  return flat;
}

function findFirstValidPosition(sector: ACMASector) {
  for (let a = 0; a < sector.areas.length; a++) {
    for (let act = 0; act < sector.areas[a].activities.length; act++) {
      const questions = sector.areas[a].activities[act].questions;
      if (questions.length > 0) {
        return { areaIdx: a, activityIdx: act, questionIdx: 0 };
      }
    }
  }

  return { areaIdx: 0, activityIdx: 0, questionIdx: 0 };
}

export const SectorWizard: React.FC<Props> = ({
  sector,
  answers,
  onAnswer,
  onExit,
  onCompleteSector,
}) => {
  const initialPosition = useMemo(() => findFirstValidPosition(sector), [sector]);

  const [areaIdx, setAreaIdx] = useState(initialPosition.areaIdx);
  const [activityIdx, setActivityIdx] = useState(initialPosition.activityIdx);
  const [questionIdx, setQuestionIdx] = useState(initialPosition.questionIdx);

  useEffect(() => {
    setAreaIdx(initialPosition.areaIdx);
    setActivityIdx(initialPosition.activityIdx);
    setQuestionIdx(initialPosition.questionIdx);
  }, [sector.code, initialPosition]);

  const [profile] = useState<ProfileSummary>(() => {
    try {
      const raw = localStorage.getItem("oasis_profile");
      if (!raw) return {};
      const data = JSON.parse(raw);
      return {
        orgName: data?.org?.name || "",
        sector: data?.org?.sector || "",
        region: data?.org?.region || "",
        assetClass: data?.scope?.assetClass || "",
        horizon: data?.scope?.horizon || "",
      };
    } catch {
      return {};
    }
  });

  const flatQuestions = useMemo(() => buildFlatQuestionList(sector), [sector]);

  const currentFlatIndex = useMemo(() => {
    return flatQuestions.findIndex(
      (q) =>
        q.areaIdx === areaIdx &&
        q.activityIdx === activityIdx &&
        q.questionIdx === questionIdx
    );
  }, [flatQuestions, areaIdx, activityIdx, questionIdx]);

  const currentRef =
    currentFlatIndex >= 0 ? flatQuestions[currentFlatIndex] : null;

  const area = currentRef ? sector.areas[currentRef.areaIdx] : sector.areas[0];
  const activity = currentRef
    ? sector.areas[currentRef.areaIdx].activities[currentRef.activityIdx]
    : sector.areas[0]?.activities[0];

  const totalQuestionsInActivity = activity?.questions.length ?? 0;

  const currentQuestion =
    currentRef && activity?.questions?.[currentRef.questionIdx]
      ? activity.questions[currentRef.questionIdx]
      : null;

  const currentQuestionCode = currentQuestion?.code ?? "";

  const derivedInfo = useMemo(
    () =>
      currentQuestion ? computeDerivedInfo(currentQuestion.code, answers) : null,
    [currentQuestion, answers]
  );

  useEffect(() => {
    if (
      currentQuestion &&
      derivedInfo?.label &&
      answers[currentQuestion.code] !== derivedInfo.label
    ) {
      onAnswer(currentQuestion.code, derivedInfo.label);
    }
  }, [currentQuestion, derivedInfo, answers, onAnswer]);

  const sectorScore = useMemo(
    () => computeSectorScore(sector.code, answers),
    [sector.code, answers]
  );

  const sectorComplete =
    sectorScore.total > 0 && sectorScore.answered === sectorScore.total;

  useEffect(() => {
    if (!activity) return;
    const id = `o-activity-${activity.code}`;
    const el = document.getElementById(id);
    el?.scrollIntoView?.({ block: "nearest" });
  }, [activity]);

  const areaScore = useMemo(() => {
    if (!area) return { total: 0, answered: 0, scorePct: 0 };
    const qCodes: string[] = [];
    area.activities.forEach((act) =>
      act.questions.forEach((q) => qCodes.push(q.code))
    );
    return computeScopeScore(qCodes, answers);
  }, [area, answers]);

  const activityScore = useMemo(() => {
    if (!activity) return { total: 0, answered: 0, scorePct: 0 };
    const qCodes = activity.questions.map((q) => q.code);
    return computeScopeScore(qCodes, answers);
  }, [activity, answers]);

  const jumpToFlatIndex = useCallback(
    (index: number) => {
      const target = flatQuestions[index];
      if (!target) return;

      setAreaIdx(target.areaIdx);
      setActivityIdx(target.activityIdx);
      setQuestionIdx(target.questionIdx);
    },
    [flatQuestions]
  );

  const goPrevQuestion = useCallback(() => {
    if (currentFlatIndex <= 0) return;
    jumpToFlatIndex(currentFlatIndex - 1);
  }, [currentFlatIndex, jumpToFlatIndex]);

  const goNextQuestion = useCallback(() => {
    if (currentFlatIndex < 0) return;

    const isLastQuestion = currentFlatIndex >= flatQuestions.length - 1;

    if (isLastQuestion) {
      onCompleteSector();
      return;
    }

    jumpToFlatIndex(currentFlatIndex + 1);
  }, [
    currentFlatIndex,
    flatQuestions.length,
    jumpToFlatIndex,
    onCompleteSector,
  ]);

  const handleJumpToActivity = (
    targetAreaIdx: number,
    targetActIdx: number
  ) => {
    const firstQuestionInActivity = flatQuestions.find(
      (q) => q.areaIdx === targetAreaIdx && q.activityIdx === targetActIdx
    );

    if (!firstQuestionInActivity) return;

    setAreaIdx(firstQuestionInActivity.areaIdx);
    setActivityIdx(firstQuestionInActivity.activityIdx);
    setQuestionIdx(firstQuestionInActivity.questionIdx);
  };

  const questionNumberInActivity = currentRef ? currentRef.questionIdx + 1 : 0;
  const pctInActivity =
    totalQuestionsInActivity > 0
      ? Math.round((100 * questionNumberInActivity) / totalQuestionsInActivity)
      : 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName.toLowerCase();
        if (
          tag === "input" ||
          tag === "textarea" ||
          target.getAttribute("contenteditable") === "true"
        ) {
          return;
        }
      }

      if (!currentQuestion) return;

      if (!derivedInfo && e.key >= "1" && e.key <= "6") {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < ACMA_MATURITY.length) {
          e.preventDefault();
          onAnswer(currentQuestion.code, ACMA_MATURITY[idx].label);
        }
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNextQuestion();
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrevQuestion();
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          goPrevQuestion();
        } else {
          goNextQuestion();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, derivedInfo, onAnswer, goNextQuestion, goPrevQuestion]);

  if (!flatQuestions.length || !currentQuestion || !area || !activity) {
    return (
      <div>
        <p>No questions defined for this sector.</p>
        <button className="o-btn o-btn--ghost" onClick={onExit}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: 20,
      }}
    >
      <aside
        style={{
          borderRight: "1px solid var(--oasis-border-subtle)",
          paddingRight: 16,
          paddingBottom: 8,
        }}
      >
        {(profile.orgName ||
          profile.sector ||
          profile.region ||
          profile.assetClass ||
          profile.horizon) && (
          <div
            className="o-card"
            style={{
              padding: 10,
              marginBottom: 14,
              background: "var(--oasis-surface)",
              borderRadius: "var(--oasis-radius-lg)",
              border: "1px solid var(--oasis-border-subtle)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--oasis-text-muted)",
                marginBottom: 4,
              }}
            >
              Assessment profile
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 2,
              }}
            >
              {profile.orgName || "Organisation not set"}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--oasis-text-secondary)",
              }}
            >
              {profile.sector && <span>{profile.sector}</span>}
              {profile.sector && profile.region && " · "}
              {profile.region && <span>{profile.region}</span>}
            </div>
            {(profile.assetClass || profile.horizon) && (
              <div
                style={{
                  fontSize: 11,
                  color: "var(--oasis-text-secondary)",
                  marginTop: 4,
                }}
              >
                {profile.assetClass && <span>{profile.assetClass}</span>}
                {profile.assetClass && profile.horizon && " · "}
                {profile.horizon && <span>{profile.horizon}</span>}
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: "var(--oasis-text-sm)",
              color: "var(--oasis-text-muted)",
              marginBottom: 2,
            }}
          >
            Sector {sector.code}
          </div>
          <div
            style={{
              fontSize: "var(--oasis-text-lg)",
              fontWeight: 600,
              color: "var(--oasis-text-primary)",
            }}
          >
            {sector.name}
          </div>
          <div
            style={{
              fontSize: "var(--oasis-text-xs)",
              color: "var(--oasis-text-secondary)",
              marginTop: 2,
            }}
          >
            {sectorScore.answered}/{sectorScore.total} questions ·{" "}
            {sectorScore.total > 0
              ? `${Math.round(sectorScore.scorePct)}% readiness`
              : "No responses yet"}
          </div>
        </div>

        <div style={{ fontSize: 13 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--oasis-text-muted)",
              marginBottom: 6,
            }}
          >
            Areas &amp; activities
          </div>

          {sector.areas.map((a, aIndex) => {
            const isAreaActive = aIndex === areaIdx;
            const isExpanded = isAreaActive;

            return (
              <div
                key={a.code}
                style={{
                  marginBottom: 10,
                  paddingBottom: 6,
                  borderBottom:
                    aIndex < sector.areas.length - 1
                      ? "1px solid rgba(255, 255, 255, 0.04)"
                      : "none",
                }}
              >
                <div style={{ marginBottom: 6 }}>
                  <div
                    style={{
                      fontSize: "var(--oasis-text-xs)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "var(--oasis-text-muted)",
                      marginBottom: 2,
                    }}
                  >
                    Area {aIndex + 1}
                  </div>

                  <div
                    style={{
                      fontSize: "var(--oasis-text-md)",
                      fontWeight: 500,
                      color: isAreaActive
                        ? "var(--oasis-text-primary)"
                        : "var(--oasis-text-secondary)",
                    }}
                  >
                    {a.code} {a.name}
                  </div>
                </div>

                {isExpanded && (
                  <ul
                    style={{
                      listStyle: "none",
                      paddingLeft: 12,
                      margin: 0,
                    }}
                  >
                    {a.activities.map((act, actIndex) => {
                      const isActive =
                        aIndex === areaIdx && actIndex === activityIdx;
                      const stats = getActivityStats(act.questions, answers);

                      const notStarted = stats.answered === 0;
                      const complete =
                        stats.answered > 0 &&
                        stats.answered === stats.total &&
                        stats.total > 0;
                      const inProgress =
                        !notStarted && !complete && stats.total > 0;

                      let statusClass = "o-activity-status--idle";
                      if (complete) statusClass = "o-activity-status--complete";
                      else if (inProgress)
                        statusClass = "o-activity-status--partial";

                      return (
                        <li
                          id={`o-activity-${act.code}`}
                          key={act.code}
                          className={
                            "o-area-item" +
                            (isActive ? " o-area-item--active" : "")
                          }
                          style={{ marginBottom: 4 }}
                        >
                          <button
                            className="o-area-button"
                            onClick={() =>
                              handleJumpToActivity(aIndex, actIndex)
                            }
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 6,
                              }}
                            >
                              <span
                                className={"o-activity-status " + statusClass}
                              />
                              <div>
                                <div className="o-area-code">{act.code}</div>
                                <div className="o-area-name">{act.name}</div>
                                <div className="o-area-progress">
                                  {stats.answered}/{stats.total} · {stats.pct}%
                                </div>
                              </div>
                            </div>
                          </button>

                          {isActive && currentQuestionCode && (
                            <div
                              style={{
                                fontSize: 10,
                                color: "var(--oasis-text-muted)",
                                padding: "0 6px 4px 22px",
                              }}
                            >
                              → Current question: {currentQuestionCode}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      <main className="o-assessment-main">
        <div className="o-assessment-body">
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 12,
                color: "var(--oasis-text-muted)",
                marginBottom: 4,
              }}
            >
              Sector {sector.code} · {sector.name}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--oasis-text-secondary)",
              }}
            >
              {area.code} {area.name} · {activity.code} {activity.name}
            </div>
          </div>

          <div
            className="o-question-card o-question-card--active"
            style={{ marginBottom: 16 }}
          >
            <div className="o-question-card__header">
              <div className="o-question-card__eyebrow">
                Current decision prompt
              </div>

              <div className="o-question-card__title">
                {currentQuestion.text}
              </div>
            </div>

            {derivedInfo ? (
              <div className="o-question-card__derived">
                <div className="o-question-card__derived-meta">
                  Automatically determined from related responses (
                  {derivedInfo.dependsOn.join(", ")}).
                </div>

                {derivedInfo.label ? (
                  <div className="o-question-card__derived-pill">
                    <span className="o-question-card__derived-icon">✓</span>
                    <span>
                      Calculated level: <strong>{derivedInfo.label}</strong>
                    </span>
                  </div>
                ) : (
                  <div className="o-question-card__derived-waiting">
                    This response level will be calculated automatically once
                    all contributing questions have been answered.
                  </div>
                )}

                {derivedInfo.avgRank != null && (
                  <div className="o-question-card__derived-score">
                    Average score {derivedInfo.avgRank.toFixed(1)} of 6 from{" "}
                    {derivedInfo.dependsOn.length} questions.
                  </div>
                )}
              </div>
            ) : (
              <ResponseScale
                options={RESPONSE_SCALE_OPTIONS}
                selectedValue={answers[currentQuestion.code]}
                onSelect={(value) => onAnswer(currentQuestion.code, value)}
              />
            )}
          </div>

          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 12,
                color: "var(--oasis-text-secondary)",
                marginBottom: 4,
              }}
            >
              Question {questionNumberInActivity} of {totalQuestionsInActivity} in{" "}
              {activity.code} {activity.name}
            </div>

            <div
              style={{
                height: 4,
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pctInActivity}%`,
                  height: "100%",
                  background: "var(--oasis-accent)",
                  transition: "width 160ms ease-out",
                }}
              />
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "var(--oasis-text-secondary)",
              marginBottom: 12,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span>
              <strong>Sector {sector.code}</strong>{" "}
              {sectorScore.total > 0
                ? `· ${Math.round(sectorScore.scorePct)}% readiness`
                : "· n/a"}
            </span>
            <span>
              <strong>{area.code}</strong>{" "}
              {areaScore.total > 0
                ? `· ${Math.round(areaScore.scorePct)}% readiness`
                : "· n/a"}
            </span>
            <span>
              <strong>{activity.code}</strong>{" "}
              {activityScore.total > 0
                ? `· ${Math.round(activityScore.scorePct)}% readiness`
                : "· n/a"}
            </span>
          </div>

          {sectorComplete && (
            <div
              className="o-card"
              style={{
                padding: 12,
                marginTop: 12,
                marginBottom: 12,
                borderColor: "var(--oasis-accent)",
                background: "var(--oasis-accent-soft)",
                maxWidth: 560,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                ✔ Sector completed
              </div>
              <div className="o-text-small">
                All questions in this sector have been answered. Continue to
                the next sector when ready.
              </div>
            </div>
          )}
        </div>

        <div className="o-assessment-actions">
          <div className="o-assessment-actions__inner">
            <div className="o-assessment-actions__group">
              <button
                onClick={goPrevQuestion}
                className="o-btn o-btn--ghost"
                disabled={currentFlatIndex <= 0}
              >
                ← Previous
              </button>
            </div>

            <div className="o-assessment-actions__group">
              <button onClick={onExit} className="o-btn o-btn--ghost">
                Save &amp; Exit
              </button>

              <button onClick={goNextQuestion} className="o-btn o-btn--primary">
                {currentFlatIndex >= flatQuestions.length - 1
                  ? "→ Continue to next sector"
                  : "Next →"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};