import { useMemo } from "react";
import { OrgGovRadial } from "./OrgGovRadial";
import { mapOrgGovFromResults } from "./mapOrgGovFromResults";
import type { ScoreMode } from "./orgGovTypes";

type CoreCapabilityScore = {
  id: string;
  label: string;
  scorePct: number;
};

type CoreResultsInput = {
  maturityPct: number;
  confidencePct: number;
  capabilityScores: CoreCapabilityScore[];
};

const MODES: ScoreMode[] = ["current", "benchmark", "target", "variance"];

function modeLabel(mode: ScoreMode): string {
  switch (mode) {
    case "current":
      return "Current";
    case "benchmark":
      return "Benchmark";
    case "target":
      return "Target";
    case "variance":
      return "Variance";
    default:
      return mode;
  }
}

function modeHelpText(mode: ScoreMode): string {
  switch (mode) {
    case "current":
      return "Shows current observed capability position.";
    case "benchmark":
      return "Shows external or reference comparison position.";
    case "target":
      return "Shows intended future-state capability position.";
    case "variance":
      return "Highlights uplift pressure between current and target.";
    default:
      return "";
  }
}

type OrgGovExecutiveViewProps = {
  embedded?: boolean;
  results?: CoreResultsInput;
  mode: ScoreMode;
  selectedElementId?: string;
  includeQuestions: boolean;
  onModeChange: (mode: ScoreMode) => void;
  onSelectedElementChange: (elementId?: string) => void;
  onIncludeQuestionsChange: (value: boolean) => void;
  onResetView: () => void;
};

export default function OrgGovExecutiveView({
  embedded = false,
  results,
  mode,
  selectedElementId,
  includeQuestions,
  onModeChange,
  onSelectedElementChange,
  onIncludeQuestionsChange,
  onResetView,
}: OrgGovExecutiveViewProps) {
  const orgGovDomain = useMemo(() => {
    if (!results) return null;

    return mapOrgGovFromResults({
      overallScorePct: results.maturityPct,
      confidencePct: results.confidencePct,
      capabilities: results.capabilityScores.map((item) => ({
        name: item.label,
        scorePct: item.scorePct,
        confidencePct: results.confidencePct,
      })),
    });
  }, [results]);

  const selectedElement = useMemo(() => {
    if (!orgGovDomain) return undefined;

    return orgGovDomain.elements.find(
      (element) => element.id === selectedElementId
    );
  }, [orgGovDomain, selectedElementId]);

  const radialTitle = selectedElement
    ? selectedElement.title
    : "Enterprise Capability View";

  if (!orgGovDomain) {
    return (
      <div>
        <section className="o-card o-card-pad" style={{ padding: 24 }}>
          <div className="o-card-eyebrow" style={{ marginBottom: 8 }}>
            OASIS CORE · Executive Capability View
          </div>

          <h3 className="o-card-title" style={{ margin: "0 0 10px" }}>
            Organisation & Governance
          </h3>

          <div className="o-card-subtitle" style={{ maxWidth: 760 }}>
            Executive capability view will appear once CORE results are
            available.
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {embedded && (
        <div style={{ marginBottom: 14 }}>
          <div className="o-card-eyebrow" style={{ marginBottom: 8 }}>
            OASIS CORE · Executive Capability View
          </div>

          <h3 className="o-card-title" style={{ margin: "0 0 8px" }}>
            Organisation & Governance
          </h3>

          <div className="o-card-subtitle" style={{ maxWidth: 860 }}>
            Interactive capability view with grouped enterprise domains,
            selectable elements, and structured inspection support.
          </div>
        </div>
      )}

      <section
        className="o-card"
        style={{
          padding: embedded ? 16 : 20,
          display: "flex",
          flexDirection: "column",
          minHeight: embedded ? 480 : 700,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: embedded
              ? "minmax(0, 1fr) 150px"
              : "minmax(0, 1fr) 180px",
            gap: embedded ? 10 : 12,
            alignItems: "start",
            marginBottom: 10,
          }}
        >
          <div>
            <div className="o-card-eyebrow" style={{ marginBottom: 8 }}>
              Radial capability engine
            </div>

            <div
              className="o-card-title"
              style={{
                fontSize: embedded ? 15 : 16,
                marginBottom: 8,
              }}
            >
              {radialTitle}
            </div>

            <div className="o-card-subtitle" style={{ maxWidth: 760 }}>
              Read the outer structure as grouped enterprise capability
              domains, then inspect individual elements in the detail panel.
              Question-level detail is optional and should stay off by default
              for executive review.
            </div>
          </div>

          <div
            className="o-card"
            style={{
              padding: embedded ? 10 : 12,
              background: "rgba(248, 250, 252, 0.74)",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              boxShadow: "none",
            }}
          >
            <div className="o-card-eyebrow" style={{ marginBottom: 8 }}>
              Interaction
            </div>

            <div
              style={{
                display: "grid",
                gap: 6,
                fontSize: embedded ? 11 : 12,
                lineHeight: 1.45,
                color: "var(--oasis-text-muted)",
              }}
            >
              <div>Select a segment to inspect it.</div>
              <div>Use the mode buttons to change the scoring lens.</div>
              <div>Enable the question ring only for deeper traceability.</div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 8,
            padding: "8px 10px",
            borderRadius: 12,
            border: "1px solid rgba(148, 163, 184, 0.18)",
            background: "rgba(248, 250, 252, 0.72)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {MODES.map((item) => {
              const active = item === mode;

              return (
                <button
                  key={item}
                  type="button"
                  className={`o-btn ${
                    active ? "o-btn--primary" : "o-btn--secondary"
                  }`}
                  onClick={() => onModeChange(item)}
                  style={{
                    minWidth: 82,
                    height: 34,
                    padding: "0 12px",
                  }}
                >
                  {modeLabel(item)}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="o-btn o-btn--secondary"
              onClick={onResetView}
              style={{
                height: 34,
                padding: "0 12px",
              }}
            >
              Reset view
            </button>

            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid rgba(148, 163, 184, 0.18)",
                background: "#ffffff",
                fontSize: 12,
                lineHeight: 1.2,
                color: "var(--oasis-text-muted)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="checkbox"
                checked={includeQuestions}
                onChange={(event) =>
                  onIncludeQuestionsChange(event.target.checked)
                }
              />
              Show question ring
            </label>
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            lineHeight: 1.4,
            color: "var(--oasis-text-muted)",
            marginBottom: 10,
          }}
        >
          <strong style={{ color: "var(--oasis-text-primary)" }}>
            {modeLabel(mode)} mode:
          </strong>{" "}
          {modeHelpText(mode)}
        </div>

        <div
          style={{
            flex: 1,
            minHeight: embedded ? 360 : 560,
            borderRadius: 20,
            border: "1px solid rgba(148, 163, 184, 0.20)",
            background:
              "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.98) 0%, rgba(247,250,252,0.98) 65%, rgba(241,245,249,0.98) 100%)",
            padding: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 16,
              overflow: "hidden",
              background: "transparent",
            }}
          >
            <OrgGovRadial
              domain={orgGovDomain}
              mode={mode}
              includeQuestions={includeQuestions}
              selectedElementId={selectedElementId}
              onSelectElement={onSelectedElementChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
}