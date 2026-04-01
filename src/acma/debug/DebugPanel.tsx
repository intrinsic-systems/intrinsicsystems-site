// src/acma/debug/DebugPanel.tsx
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo } from "react";
import { ACMA_SECTORS, type ACMASector } from "../acmaHierarchy";
import { computeSectorScore } from "../acmaScoring";
import { DERIVED_QUESTIONS, computeDerivedInfo } from "../acmaDerived";
import { exportRawAnswersToJson } from "../exportUtils";

type Props = {
  answers: Record<string, string>;
  onClearAnswers: () => void;
  onClose?: () => void;
};

// Utility: collect every question code across all sectors
function getAllQuestionCodes(): string[] {
  const result: string[] = [];

  ACMA_SECTORS.forEach((sector) => {
    sector.areas.forEach((area) => {
      area.activities.forEach((act) => {
        act.questions.forEach((q) => {
          if (q.code) result.push(q.code);
        });
      });
    });
  });

  return result;
}

export const DebugPanel: React.FC<Props> = ({
  answers,
  onClearAnswers,
  onClose,
}) => {
  const isDev = import.meta.env.DEV;
  const hasDebugFlag =
    typeof window !== "undefined" &&
    window.location.search.includes("debug");

  // Never show in production or without ?debug
  if (!isDev || !hasDebugFlag) {
    return null;
  }

  // -------- Global stats --------
  const allQuestionCodes = useMemo(() => getAllQuestionCodes(), []);
  const totalQuestions = allQuestionCodes.length;
  const answerKeys = Object.keys(answers);
  const answeredCount = answerKeys.length;
  const answeredPct = totalQuestions
    ? Math.round((100 * answeredCount) / totalQuestions)
    : 0;

  // -------- Sector stats --------
  const sectorStats = useMemo(
    () =>
      ACMA_SECTORS.map((s: ACMASector) => {
        const score = computeSectorScore(s.code, answers);
        return {
          code: s.code,
          name: s.name,
          total: score.total,
          answered: score.answered,
          pct: score.total
            ? Math.round((100 * score.answered) / score.total)
            : 0,
          maturity: Math.round(score.scorePct),
        };
      }),
    [answers]
  );

  // -------- Derived questions --------
  const derivedRows = useMemo(
    () =>
      Object.keys(DERIVED_QUESTIONS).map((code) => {
        const info = computeDerivedInfo(code, answers);
        return {
          code,
          dependsOn: DERIVED_QUESTIONS[code],
          pending: info?.pending ?? [],
          label: info?.label ?? null,
          avgRank: info?.avgRank ?? null,
        };
      }),
    [answers]
  );

  // -------- First N answers --------
  const firstAnswers = useMemo(() => {
    return answerKeys
      .slice()
      .sort()
      .slice(0, 200)
      .map((code) => ({ code, value: answers[code] }));
  }, [answerKeys, answers]);

  const handleClearAndReload = () => {
    onClearAnswers();
    window.location.reload();
  };

  const handleExportJson = () => {
    exportRawAnswersToJson("oasis_acma_answers.json", answers);
  };

  const handleCloseDebug = () => {
    if (onClose) {
      onClose();
      return;
    }
    // Fallback: remove debug flag from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("debug");
    window.location.href = url.toString();
  };

  return (
    <div
      className="o-card"
      style={{
        marginTop: 24,
        padding: 16,
        borderStyle: "dashed",
        borderColor: "var(--oasis-border-subtle)",
        maxWidth: 1200,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.08,
              color: "var(--oasis-text-muted)",
              marginBottom: 2,
            }}
          >
            Developer inspector — (dev only)
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--oasis-text-secondary)",
            }}
          >
            Internal observability tools — not for client demos. Active because{" "}
            <code>debug=1</code> is present in the URL.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="o-btn o-btn--ghost"
            style={{ fontSize: 11, padding: "4px 10px" }}
            onClick={handleExportJson}
          >
            Export JSON
          </button>
          <button
            type="button"
            className="o-btn o-btn--ghost"
            style={{ fontSize: 11, padding: "4px 10px" }}
            onClick={handleClearAndReload}
          >
            Clear answers &amp; reload
          </button>
          <button
            type="button"
            className="o-btn o-btn--ghost"
            style={{ fontSize: 11, padding: "4px 10px" }}
            onClick={handleCloseDebug}
          >
            Close debug
          </button>
        </div>
      </div>

      {/* GLOBAL COMPLETION */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 14,
          fontSize: 11,
        }}
      >
        <div
          style={{
            minWidth: 220,
            padding: 8,
            borderRadius: 8,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "var(--oasis-text-muted)",
              marginBottom: 2,
            }}
          >
            Global completion
          </div>
          <div>
            {answeredCount}/{totalQuestions} questions answered ({answeredPct}
            %)
          </div>
        </div>

        <div
          style={{
            minWidth: 260,
            padding: 8,
            borderRadius: 8,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "var(--oasis-text-muted)",
              marginBottom: 2,
            }}
          >
            Derived questions
          </div>
          <div>
            {derivedRows.filter((r) => r.label != null).length}/
            {derivedRows.length} derived codes have a resolvable maturity label.
          </div>
          <div style={{ marginTop: 2 }}>
            Keys:{" "}
            {derivedRows.map((r) => r.code).join(", ") || "— none configured —"}
          </div>
        </div>
      </div>

      {/* SECTOR COMPLETION */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 14,
          fontSize: 11,
        }}
      >
        {sectorStats.map((s: any) => (
          <div
            key={s.code}
            style={{
              flex: "0 0 180px",
              padding: 8,
              borderRadius: 8,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--oasis-text-muted)",
                marginBottom: 2,
              }}
            >
              {s.code} {s.name}
            </div>
            <div>
              {s.answered}/{s.total} · {s.pct}% complete
            </div>
            <div>Maturity: {s.maturity}%</div>
          </div>
        ))}
      </div>

      {/* ANSWER + DERIVED INSPECTORS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.3fr)",
          gap: 12,
          marginTop: 6,
        }}
      >
        {/* Answer inspector */}
        <div
          style={{
            padding: 8,
            borderRadius: 8,
            background: "rgba(255,255,255,0.02)",
            fontSize: 11,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "var(--oasis-text-muted)",
              marginBottom: 4,
            }}
          >
            Answer inspector (first {firstAnswers.length} keys)
          </div>
          <div
            style={{
              maxHeight: 180,
              overflow: "auto",
              fontFamily: "SFMono-Regular, Menlo, monospace",
            }}
          >
            {firstAnswers.map((a) => (
              <div key={a.code}>
                {a.code} =&gt; {a.value}
              </div>
            ))}
            {firstAnswers.length === 0 && <div>No answers yet.</div>}
          </div>
        </div>

        {/* Derived inspector */}
        <div
          style={{
            padding: 8,
            borderRadius: 8,
            background: "rgba(255,255,255,0.02)",
            fontSize: 11,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "var(--oasis-text-muted)",
              marginBottom: 4,
            }}
          >
            Derived inspector
          </div>
          <div
            style={{
              maxHeight: 180,
              overflow: "auto",
              fontFamily: "SFMono-Regular, Menlo, monospace",
            }}
          >
            {derivedRows.map((r) => (
              <div key={r.code} style={{ marginBottom: 6 }}>
                <div>
                  {r.code}:{" "}
                  {r.label
                    ? `${r.label} (avg rank ${r.avgRank?.toFixed(2) ?? "?"})`
                    : "— not yet resolvable —"}
                </div>
                <div>deps: {r.dependsOn.join(", ")}</div>
                {r.pending.length > 0 && (
                  <div>pending: {r.pending.join(", ")}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};