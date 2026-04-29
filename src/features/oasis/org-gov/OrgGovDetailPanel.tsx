import type { CSSProperties, ReactNode } from "react";
import type { DomainNode, ElementNode, Question, ScoreMode } from "./orgGovTypes";

type OrgGovDetailPanelProps = {
  domain: DomainNode;
  selectedElementId?: string;
  mode: ScoreMode;
  embedded?: boolean;
};

function scoreText(value?: number): string {
  return typeof value === "number" ? value.toFixed(1) : "-";
}

function varianceText(value?: number): string {
  if (typeof value !== "number") return "-";
  return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
}

function findSelectedElement(
  domain: DomainNode,
  selectedElementId?: string
): ElementNode | undefined {
  return domain.elements.find((element) => element.id === selectedElementId);
}

function evidenceState(question: Question): string {
  const count = question.evidenceItems?.length ?? 0;
  if (!question.evidenceRequired) return "Not required";
  if (count === 0) return "Evidence pending";
  const hasVerified =
    question.evidenceItems?.some((item) => item.verified) ?? false;
  return hasVerified ? "Verified" : "Provided";
}

function evidenceBadgeStyle(state: string, embedded = false): CSSProperties {
  if (embedded) {
    switch (state) {
      case "Verified":
        return {
          border: "1px solid #a7f3d0",
          background: "#ecfdf5",
          color: "#047857",
        };
      case "Provided":
        return {
          border: "1px solid #fde68a",
          background: "#fffbeb",
          color: "#b45309",
        };
      case "Evidence pending":
        return {
          border: "1px solid #fecdd3",
          background: "#fff1f2",
          color: "#be123c",
        };
      default:
        return {
          border: "1px solid #e2e8f0",
          background: "#f8fafc",
          color: "#475569",
        };
    }
  }

  switch (state) {
    case "Verified":
      return {
        border: "1px solid rgba(16,185,129,0.35)",
        background: "rgba(16,185,129,0.12)",
        color: "#86efac",
      };
    case "Provided":
      return {
        border: "1px solid rgba(245,158,11,0.35)",
        background: "rgba(245,158,11,0.12)",
        color: "#fcd34d",
      };
    case "Evidence pending":
      return {
        border: "1px solid rgba(244,63,94,0.35)",
        background: "rgba(244,63,94,0.12)",
        color: "#fda4af",
      };
    default:
      return {
        border: "1px solid rgba(148,163,184,0.28)",
        background: "rgba(148,163,184,0.10)",
        color: "#cbd5e1",
      };
  }
}

function metricToneStyle(value?: number, embedded = false): CSSProperties {
  if (typeof value !== "number") {
    return { color: embedded ? "#0f172a" : "#ffffff" };
  }
  if (value >= 4.0) {
    return { color: embedded ? "#047857" : "#86efac" };
  }
  if (value >= 3.0) {
    return { color: embedded ? "#b45309" : "#fcd34d" };
  }
  return { color: embedded ? "#be123c" : "#fda4af" };
}

function rankedQuestions(questions: Question[]): Question[] {
  return [...questions].sort((a, b) => {
    const aGap = (a.score.target ?? 0) - (a.score.current ?? 0);
    const bGap = (b.score.target ?? 0) - (b.score.current ?? 0);

    if (bGap !== aGap) return bGap - aGap;

    const aConfidence = a.score.confidence ?? 0;
    const bConfidence = b.score.confidence ?? 0;
    return aConfidence - bConfidence;
  });
}

function modeSummary(mode: ScoreMode): string {
  switch (mode) {
    case "current":
      return "Current observed capability position for the selected scope.";
    case "benchmark":
      return "Reference comparison position against the selected benchmark.";
    case "target":
      return "Intended future-state capability position for the selected scope.";
    case "variance":
      return "Uplift pressure between current position and target state.";
    default:
      return "";
  }
}

function panelStyle(embedded = false): CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    minHeight: 0,
    borderRadius: 24,
    padding: embedded ? 14 : 16,
    border: embedded
      ? "1px solid rgba(148,163,184,0.20)"
      : "1px solid rgba(71,85,105,0.42)",
    background: embedded
      ? "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)"
      : "linear-gradient(180deg, rgba(2,6,23,0.78) 0%, rgba(15,23,42,0.86) 100%)",
    color: embedded ? "#0f172a" : "#e2e8f0",
    boxShadow: embedded
      ? "0 10px 30px rgba(15,23,42,0.06)"
      : "0 18px 40px rgba(0,0,0,0.18)",
    overflow: "hidden",
  };
}

function sectionCardStyle(embedded = false): CSSProperties {
  return {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    borderRadius: embedded ? 14 : 16,
    padding: embedded ? 12 : 16,
    border: embedded
      ? "1px solid rgba(148,163,184,0.18)"
      : "1px solid rgba(71,85,105,0.34)",
    background: embedded ? "#ffffff" : "rgba(15,23,42,0.56)",
  };
}

function subtleCardStyle(embedded = false): CSSProperties {
  return {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    borderRadius: 10,
    padding: embedded ? 10 : 12,
    border: embedded
      ? "1px solid rgba(148,163,184,0.14)"
      : "1px solid rgba(71,85,105,0.26)",
    background: embedded ? "#f8fafc" : "rgba(2,6,23,0.64)",
  };
}

function labelStyle(embedded = false): CSSProperties {
  return {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: embedded ? "#64748b" : "#94a3b8",
    marginBottom: 6,
  };
}

function bodyStyle(embedded = false): CSSProperties {
  return {
    fontSize: 12,
    lineHeight: 1.55,
    color: embedded ? "#475569" : "#cbd5e1",
  };
}

function StatCard({
  label,
  value,
  toneStyle,
  large = false,
  embedded = false,
}: {
  label: string;
  value: string;
  toneStyle?: CSSProperties;
  large?: boolean;
  embedded?: boolean;
}) {
  return (
    <div style={sectionCardStyle(embedded)}>
      <div
        style={{
          fontSize: embedded ? 8 : 10,
          textTransform: "uppercase",
          letterSpacing: "0.10em",
          color: embedded ? "#64748b" : "#94a3b8",
          marginBottom: embedded ? 4 : 6,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={label}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 0,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          fontSize: embedded ? (large ? 15 : 13) : large ? 20 : 16,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          ...(toneStyle ?? { color: embedded ? "#0f172a" : "#ffffff" }),
        }}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

function SupportCard({
  eyebrow,
  title,
  children,
  embedded = false,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  embedded?: boolean;
}) {
  return (
    <div style={sectionCardStyle(embedded)}>
      <div style={labelStyle(embedded)}>{eyebrow}</div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: embedded ? "#0f172a" : "#f8fafc",
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div style={bodyStyle(embedded)}>{children}</div>
    </div>
  );
}

function MiniMetricGrid({
  current,
  benchmark,
  target,
  variance,
  embedded = false,
}: {
  current?: number;
  benchmark?: number;
  target?: number;
  variance?: number;
  embedded?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 8,
      }}
    >
      <div style={subtleCardStyle(embedded)}>
        <div style={{ fontSize: embedded ? 10 : 11, color: embedded ? "#64748b" : "#94a3b8" }}>
          Current
        </div>
        <div
          style={{
            marginTop: 6,
            fontWeight: 700,
            fontSize: embedded ? 13 : 14,
            ...metricToneStyle(current, embedded),
          }}
        >
          {scoreText(current)}
        </div>
      </div>

      <div style={subtleCardStyle(embedded)}>
        <div style={{ fontSize: embedded ? 10 : 11, color: embedded ? "#64748b" : "#94a3b8" }}>
          Benchmark
        </div>
        <div
          style={{
            marginTop: 6,
            fontWeight: 700,
            fontSize: embedded ? 13 : 14,
            color: embedded ? "#0f172a" : "#ffffff",
          }}
        >
          {scoreText(benchmark)}
        </div>
      </div>

      <div style={subtleCardStyle(embedded)}>
        <div style={{ fontSize: embedded ? 10 : 11, color: embedded ? "#64748b" : "#94a3b8" }}>
          Target
        </div>
        <div
          style={{
            marginTop: 6,
            fontWeight: 700,
            fontSize: embedded ? 13 : 14,
            color: embedded ? "#0f172a" : "#ffffff",
          }}
        >
          {scoreText(target)}
        </div>
      </div>

      <div style={subtleCardStyle(embedded)}>
        <div style={{ fontSize: embedded ? 10 : 11, color: embedded ? "#64748b" : "#94a3b8" }}>
          Variance
        </div>
        <div
          style={{
            marginTop: 6,
            fontWeight: 700,
            fontSize: embedded ? 13 : 14,
            color: embedded ? "#0f172a" : "#ffffff",
          }}
        >
          {varianceText(variance)}
        </div>
      </div>
    </div>
  );
}

export function OrgGovDetailPanel({
  domain,
  selectedElementId,
  mode,
  embedded = false,
}: OrgGovDetailPanelProps) {
  const element = findSelectedElement(domain, selectedElementId);
  const topDrivers = element ? rankedQuestions(element.questions).slice(0, 3) : [];

  if (!element) {
    return (
      <aside style={panelStyle(embedded)}>
        <div style={{ flexShrink: 0 }}>
          <div style={labelStyle(embedded)}>Enterprise summary</div>

          <h3
            style={{
              margin: "0 0 4px",
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              color: embedded ? "#0f172a" : "#ffffff",
            }}
          >
            {domain.title}
          </h3>

          <div style={{ ...bodyStyle(embedded), marginBottom: 14 }}>
            {modeSummary(mode)}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <StatCard
              label="Current"
              value={scoreText(domain.score.current)}
              toneStyle={metricToneStyle(domain.score.current, embedded)}
              embedded={embedded}
            />
            <StatCard
              label="Benchmark"
              value={scoreText(domain.score.benchmark)}
              toneStyle={{ color: embedded ? "#0f172a" : "#ffffff" }}
              embedded={embedded}
            />
            <StatCard
              label="Target"
              value={scoreText(domain.score.target)}
              toneStyle={{ color: embedded ? "#0f172a" : "#ffffff" }}
              embedded={embedded}
            />
            <StatCard
              label="Variance"
              value={varianceText(domain.score.variance)}
              toneStyle={metricToneStyle(domain.score.current, embedded)}
              embedded={embedded}
            />
          </div>
        </div>

        <div
          style={{
            minHeight: 0,
            minWidth: 0,
            flex: 1,
            overflowY: embedded ? "visible" : "auto",
            paddingRight: embedded ? 0 : 4,
          }}
        >
          <div style={{ display: "grid", gap: 14 }}>
            <SupportCard
              eyebrow="How to read this"
              title="Inspection model"
              embedded={embedded}
            >
              <>
                <p style={{ margin: 0 }}>
                  The radial presents enterprise capability as a structured
                  hierarchy.
                </p>
                <p style={{ margin: 0 }}>
                  Outer and intermediate rings represent grouped capability
                  structure within the selected domain view.
                </p>
                <p style={{ margin: 0 }}>
                  Select an element to inspect its score position, target gap,
                  and strongest supporting drivers.
                </p>
              </>
            </SupportCard>

            <SupportCard
              eyebrow="View logic"
              title="What the panel is showing"
              embedded={embedded}
            >
              <>
                <p style={{ margin: 0 }}>
                  This is a domain-level summary because no individual element is
                  currently selected.
                </p>
                <p style={{ margin: 0 }}>
                  Once an element is selected, this panel switches from overview
                  to detailed inspection.
                </p>
              </>
            </SupportCard>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                fontSize: 12,
                color: embedded ? "#64748b" : "#94a3b8",
              }}
            >
              {["Executive Overview", "Hierarchical View", "Driver Traceability"].map(
                (item) => (
                  <span
                    key={item}
                    style={{
                      borderRadius: 999,
                      padding: "6px 10px",
                      background: embedded
                        ? "rgba(226,232,240,0.8)"
                        : "rgba(148,163,184,0.12)",
                    }}
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside style={panelStyle(embedded)}>
      <div style={{ flexShrink: 0 }}>
        <div style={labelStyle(embedded)}>Selected element</div>

        <h3
          style={{
            margin: "0 0 4px",
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            color: embedded ? "#0f172a" : "#ffffff",
          }}
        >
          {element.title}
        </h3>

        <div style={{ ...bodyStyle(embedded), marginBottom: 14 }}>
          {modeSummary(mode)}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <StatCard
            label="Current"
            value={scoreText(element.score.current)}
            toneStyle={metricToneStyle(element.score.current, embedded)}
            embedded={embedded}
          />
          <StatCard
            label="Benchmark"
            value={scoreText(element.score.benchmark)}
            toneStyle={{ color: embedded ? "#0f172a" : "#ffffff" }}
            embedded={embedded}
          />
          <StatCard
            label="Target"
            value={scoreText(element.score.target)}
            toneStyle={{ color: embedded ? "#0f172a" : "#ffffff" }}
            embedded={embedded}
          />
          <StatCard
            label="Variance"
            value={varianceText(element.score.variance)}
            toneStyle={metricToneStyle(element.score.current, embedded)}
            embedded={embedded}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div style={{ ...labelStyle(embedded), marginBottom: 0 }}>Top drivers</div>
          <div
            style={{
              fontSize: 12,
              color: embedded ? "#64748b" : "#94a3b8",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Top {topDrivers.length} of {element.questions.length}
          </div>
        </div>
      </div>

      <div
        style={{
          minHeight: 0,
          minWidth: 0,
          flex: 1,
          overflowY: embedded ? "visible" : "auto",
          paddingRight: embedded ? 0 : 4,
        }}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <SupportCard
            eyebrow="Selected element"
            title="Inspection summary"
            embedded={embedded}
          >
            <>
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                This element is currently selected within the enterprise view
                and should be read as a grouped capability area within the
                broader Organisation & Governance structure.
              </p>
              <p style={{ margin: "6px 0 0", lineHeight: 1.5 }}>
                The driver cards below show where the strongest uplift pressure
                is currently concentrated.
              </p>
            </>
          </SupportCard>

          {topDrivers.map((question, index) => {
            const state = evidenceState(question);
            const gap =
              typeof question.score.target === "number" &&
              typeof question.score.current === "number"
                ? question.score.target - question.score.current
                : undefined;

            return (
              <div key={question.id} style={sectionCardStyle(embedded)}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={labelStyle(embedded)}>Driver {index + 1}</div>
                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.4,
                        fontWeight: 700,
                        color: embedded ? "#0f172a" : "#ffffff",
                      }}
                    >
                      {question.prompt}
                    </div>
                  </div>

                  <div
                    style={{
                      ...evidenceBadgeStyle(state, embedded),
                      borderRadius: 999,
                      padding: "5px 9px",
                      fontSize: 11,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {state}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginBottom: 10,
                    fontSize: 11,
                    color: embedded ? "#64748b" : "#94a3b8",
                  }}
                >
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "4px 8px",
                      background: embedded
                        ? "#f1f5f9"
                        : "rgba(15,23,42,0.72)",
                    }}
                  >
                    {question.type}
                  </span>

                  {typeof gap === "number" && (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "4px 8px",
                        background: embedded
                          ? "#f1f5f9"
                          : "rgba(15,23,42,0.72)",
                      }}
                    >
                      Gap {gap > 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1)}
                    </span>
                  )}
                </div>

                <MiniMetricGrid
                  current={question.score.current}
                  benchmark={question.score.benchmark}
                  target={question.score.target}
                  variance={question.score.variance}
                  embedded={embedded}
                />
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}