import React from "react";

type FrameworkNode = {
  id: string;
  label: string;
  scorePct: number;
  priorityRank?: number;
  pathwayStep?: number;
};

type Props = {
  title?: string;
  subtitle?: string;
  nodes: FrameworkNode[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTone(scorePct: number) {
  const alpha = clamp(scorePct / 100, 0.12, 0.92);
  return `rgba(43, 108, 176, ${alpha})`;
}

function getTextColor(scorePct: number) {
  return scorePct >= 55 ? "#ffffff" : "var(--oasis-text-primary)";
}

export function FrameworkImprovementMap({
  title = "Framework improvement map",
  subtitle = "Capability position and priority emphasis across the current model.",
  nodes,
}: Props) {
  const sorted = [...nodes].sort((a, b) => {
    if ((a.priorityRank ?? 999) !== (b.priorityRank ?? 999)) {
      return (a.priorityRank ?? 999) - (b.priorityRank ?? 999);
    }
    return a.scorePct - b.scorePct;
  });

  return (
    <div className="o-card o-card-pad">
      <div style={{ marginBottom: 12 }}>
        <h2 className="o-section-heading" style={{ marginBottom: 4 }}>
          {title}
        </h2>
        <div className="o-text-small">{subtitle}</div>
      </div>

      <div className="o-framework-map">
        {sorted.map((node) => {
          const isPriority = typeof node.priorityRank === "number";
          const isPathway = typeof node.pathwayStep === "number";

          return (
            <div
              key={node.id}
              className={
                "o-framework-map__node" +
                (isPriority ? " o-framework-map__node--priority" : "") +
                (isPathway ? " o-framework-map__node--pathway" : "")
              }
              style={{
                background: getTone(node.scorePct),
                color: getTextColor(node.scorePct),
              }}
              title={`${node.label} · ${node.scorePct}%`}
            >
              <div className="o-framework-map__node-top">
                <div className="o-framework-map__node-title">{node.label}</div>

                <div className="o-framework-map__node-score">
                  {node.scorePct}%
                </div>
              </div>

              <div className="o-framework-map__node-meta">
                {isPriority ? (
                  <span className="o-framework-map__badge">
                    Top {node.priorityRank}
                  </span>
                ) : null}

                {isPathway ? (
                  <span className="o-framework-map__badge o-framework-map__badge--pathway">
                    Step {node.pathwayStep}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}