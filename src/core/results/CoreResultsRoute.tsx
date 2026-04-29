import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { getBenchmarkValueForCapability } from "../../core/results/benchmarkLibrary";
import { getCoreNetworkValueForCapability } from "../../core/results/coreNetwork";
import { OASIS_CONFIG } from "../../config/oasisConfig";
import { ContextAside } from "../../core/ContextAside";
import { ImprovementPathwayProgression } from "../results/ImprovementPathwayProgression";
import { CapabilityHierarchyPanel } from "../results/CapabilityHierarchyPanel";
import { AlignmentMatrixPanel } from "../results/AlignmentMatrixPanel";
import { getCapabilityLevel } from "../../core/results/capabilityScale";
import {
  CapabilityRadar,
  type CapabilityRadarInsightKey,
} from "../results/CapabilityRadar";
import {
  RadialEngine,
  type RadialNode,
} from "../../components/radial/RadialEngine";
import { buildDomainResults } from "../../core/results/buildDomainResults";
import { buildAssessmentSummary } from "../../acma/acmaAssessmentSummary";
import {
  getAlignmentForCapability,
  getRiskLevel,
} from "../../acma/alignmentConfig";
import type { CoreFlowContextValue } from "../CoreFlowShell";
import { buildExportPack } from "../../acma/buildExportPack";
import { PatternInsightPanel, PatternMetricCard } from "../../patterns";

function getExecutiveInterpretation(
  maturityPct: number,
  confidencePct: number,
  riskLevel: string
) {
  if (confidencePct < 50) {
    return "Assessment coverage is still limited. The current result should be treated as an early directional baseline rather than a complete enterprise view.";
  }

  if (maturityPct < 25) {
    return "Capability is currently fragmented and reactive. Near-term focus should be placed on foundational governance, systems visibility, and structured uplift sequencing.";
  }

  if (maturityPct < 45) {
    return "Capability is developing across key areas, but enterprise-wide alignment remains inconsistent. Governance, systems integration, and delivery traceability are the main constraints.";
  }

  if (maturityPct < 65) {
    return "Capability is operationally established in parts of the enterprise, but stronger integration is required to improve consistency, prioritisation, and executive decision support.";
  }

  return riskLevel === "Low"
    ? "Capability is relatively strong and increasingly integrated. Focus can now shift toward optimisation, consistency, and sustained enterprise-wide uplift."
    : "Capability is broadly established, but further strengthening is still required to improve confidence, integration, and repeatable enterprise performance.";
}

function getPriorityPillClass(scorePct: number) {
  if (scorePct < 20) return "o-priority-pill o-priority-pill--high";
  if (scorePct < 40) return "o-priority-pill o-priority-pill--medium";
  return "o-priority-pill o-priority-pill--low";
}

function SummaryMetric({
  label,
  value,
  body,
  tone = "neutral",
  isActive = false,
  onClick,
}: {
  label: string;
  value: string;
  body?: string;
  tone?: "neutral" | "info" | "success" | "warning";
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={[
        "o-results-position-panel",
        `o-results-position-panel--${tone}`,
        isActive ? "is-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
    >
      <div className="o-card-eyebrow">{label}</div>
      <div className="o-results-position-score">{value}</div>
      {body ? <div className="o-text-body">{body}</div> : null}
    </button>
  );
}

function SelectedRadialSummaryPanel({
  node,
  parent,
  children,
}: {
  node?: RadialNode;
  parent?: RadialNode;
  children: RadialNode[];
}) {
  if (!node) {
    return (
      <section className="o-card o-card-pad">
        <div className="o-card-eyebrow">Selected scope</div>
        <h3 className="o-card-title--sm">Nothing selected</h3>
        <div className="o-text-small">
          Select a domain, element, or capability from the radial to inspect it.
        </div>
      </section>
    );
  }

  const childTitle =
    node.level === "domain"
      ? "Elements"
      : node.level === "element"
      ? "Capabilities"
      : "Related scope";

  const sortedChildren = [...children]
    .sort((a, b) => a.value - b.value)
    .slice(0, 5);

  return (
    <section className="o-card o-card-pad o-radial-summary">
      <div className="o-card-eyebrow">Selected scope</div>
      <h3 className="o-card-title--sm">{node.label}</h3>

      <div className="o-radial-summary__meta">
        <div className="o-radial-summary__metric">
          <span className="o-radial-summary__metric-label">Level</span>
          <strong>{node.level}</strong>
        </div>
        <div className="o-radial-summary__metric">
          <span className="o-radial-summary__metric-label">Current position</span>
          <strong>{Math.max(1, Math.round(node.value))}%</strong>
        </div>
        <div className="o-radial-summary__metric">
          <span className="o-radial-summary__metric-label">Parent</span>
          <strong>{parent?.label ?? "Enterprise capability framework"}</strong>
        </div>
      </div>

      {!!sortedChildren.length && (
        <div className="o-radial-summary__children">
          <div className="o-card-eyebrow" style={{ marginBottom: 8 }}>
            {childTitle}
          </div>

          <div className="o-radial-summary__child-list">
            {sortedChildren.map((child) => (
              <div key={child.id} className="o-radial-summary__child-item">
                <span>{child.label}</span>
                <strong>{Math.max(1, Math.round(child.value))}%</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

type SummaryInsightKey = "position" | "confidence" | "risk";

type SummaryInsight = {
  key: SummaryInsightKey;
  label: string;
  value: string;
  tone: "info" | "success" | "warning";
  shortBody: string;
  detailTitle: string;
  detailPoints: string[];
};

function getSummaryInsights(args: {
  maturityPct: number;
  confidencePct: number;
  riskLevel: string;
}): SummaryInsight[] {
  const { maturityPct, confidencePct, riskLevel } = args;

  const positionDetail =
    maturityPct < 20
      ? [
          "Current capability appears highly fragmented and is likely dependent on individuals rather than embedded structures.",
          "Common implications include inconsistent decision-making, weak traceability, and reduced confidence in planning and delivery.",
          "Near-term value will usually come from strengthening governance basics, role clarity, and enterprise-wide policy alignment.",
        ]
      : maturityPct < 40
      ? [
          "Current capability is emerging, but remains uneven across the enterprise.",
          "Some foundations may exist, but they are unlikely to be consistently translated into repeatable operational practice.",
          "Improvement effort should focus on stabilising core structures before pursuing optimisation.",
        ]
      : maturityPct < 70
      ? [
          "Current capability is partially established and likely working in some areas better than others.",
          "The main opportunity is to improve consistency, integration, and executive visibility across functions.",
          "This is typically the stage where better cross-enterprise decision support becomes important.",
        ]
      : [
          "Current capability is relatively mature and structurally embedded.",
          "The main opportunity shifts toward optimisation, predictive insight, and sustained enterprise-wide consistency.",
          "At this stage, comparative benchmarking and network intelligence become increasingly valuable.",
        ];

  const confidenceDetail =
    confidencePct >= 90
      ? [
          "Assessment confidence is strong, indicating the current result is based on broad response coverage.",
          "This means leadership can treat the current baseline as directionally reliable for prioritisation and planning.",
          "Over time, evidence weighting and adaptive questioning can further strengthen confidence quality.",
        ]
      : confidencePct >= 70
      ? [
          "Assessment confidence is reasonable, but some parts of the result may still be directional rather than fully validated.",
          "This is usually sufficient for early planning, but not yet ideal for higher-stakes comparison or investment sequencing.",
          "Adding better evidence depth and coverage will improve reliability.",
        ]
      : [
          "Assessment confidence is limited, meaning the current position should be interpreted cautiously.",
          "The baseline may still be useful for identifying broad pressure points, but not yet for precise decision-making.",
          "The best next step is to improve completion depth and evidence quality.",
        ];

  const riskDetail =
    riskLevel === "High"
      ? [
          "The current risk signal suggests capability weakness is material enough to affect performance, planning, or governance outcomes.",
          "This does not necessarily mean failure, but it does indicate pressure points likely requiring leadership attention.",
          "Immediate focus should be on the most structurally weak areas rather than diffuse improvement effort.",
        ]
      : riskLevel === "Moderate"
      ? [
          "The current risk signal suggests some instability or inconsistency is present, but not yet acute across the full enterprise.",
          "This typically reflects uneven maturity, partial integration, or limited confidence in some areas.",
          "A structured uplift sequence should reduce risk efficiently.",
        ]
      : [
          "The current risk signal appears relatively contained.",
          "The enterprise is likely operating from a more stable governance and capability base.",
          "Focus can increasingly shift from correction toward optimisation and resilience.",
        ];

  return [
    {
      key: "position",
      label: "Current position",
      value: `${maturityPct}%`,
      tone: "info",
      shortBody:
        "Rolled-up enterprise capability baseline derived from completed responses.",
      detailTitle: "What current position suggests",
      detailPoints: positionDetail,
    },
    {
      key: "confidence",
      label: "Assessment confidence",
      value: `${confidencePct}%`,
      tone: "success",
      shortBody:
        "Indicates how reliable the current baseline is based on response coverage.",
      detailTitle: "How to interpret confidence",
      detailPoints: confidenceDetail,
    },
    {
      key: "risk",
      label: "Risk signal",
      value: riskLevel,
      tone: "warning",
      shortBody:
        "Executive view of current capability risk based on position and confidence.",
      detailTitle: "What current risk means",
      detailPoints: riskDetail,
    },
  ];
}

type RadarInsight = {
  key: CapabilityRadarInsightKey;
  label: string;
  detailTitle: string;
  detailPoints: string[];
};

function getRadarInsights(): RadarInsight[] {
  return [
    {
      key: "current",
      label: "Current",
      detailTitle: "What Current means",
      detailPoints: [
        "Current represents this organisation’s observed capability position based on completed responses.",
        "It is the baseline view of how capability appears today, not where the organisation intends to be.",
        "This is the main reference point for identifying uplift priorities and structural weaknesses.",
      ],
    },
    {
      key: "benchmark",
      label: "Benchmark",
      detailTitle: "What Benchmark means",
      detailPoints: [
        "Benchmark represents an external comparison point derived from selected industry and peer reference settings.",
        "It is intended to show what stronger market-aligned capability commonly looks like.",
        "Over time this can be refined by sector, geography, asset class, and operating model.",
      ],
    },
    {
      key: "target",
      label: "Target",
      detailTitle: "What Target means",
      detailPoints: [
        "Target represents the intended future capability position required to support stronger enterprise performance.",
        "It should reflect ambition, but remain achievable within the organisation’s delivery context.",
        "The gap between Current and Target helps define the required uplift pathway.",
      ],
    },
    {
      key: "core",
      label: "CORE",
      detailTitle: "What CORE means",
      detailPoints: [
        "CORE represents the OASIS CORE™ network reference position across participating or analysed users.",
        "It is designed to become a live comparative signal showing how the broader user base is performing.",
        "In MVP this may be seeded or simulated, then later replaced by real aggregated network intelligence.",
      ],
    },
  ];
}

export function CoreResultsRoute() {
  const navigate = useNavigate();
  const { answers } = useOutletContext<CoreFlowContextValue>();

  const assessmentSummary = useMemo(
    () => buildAssessmentSummary(answers),
    [answers]
  );

  const domainResults = useMemo(() => buildDomainResults(answers), [answers]);

  const sortedCapabilities = useMemo(
    () =>
      [...assessmentSummary.capabilityScores].sort(
        (a, b) => a.scorePct - b.scorePct
      ),
    [assessmentSummary.capabilityScores]
  );

  const radarItems = useMemo(
    () =>
      [...domainResults.capabilityScores]
        .sort((a, b) => a.scorePct - b.scorePct)
        .slice(0, 6)
        .map((item) => {
          const benchmark = getBenchmarkValueForCapability(
            item.id,
            "global-default"
          );

          return {
            id: item.id,
            label: item.label,
            currentPct: item.scorePct,
            benchmarkPct: benchmark.benchmarkPct,
            targetPct: benchmark.targetPct,
            corePct: getCoreNetworkValueForCapability(item.id),
          };
        }),
    [domainResults.capabilityScores]
  );

  const interpretation = useMemo(
    () =>
      getExecutiveInterpretation(
        assessmentSummary.maturityPct,
        assessmentSummary.confidencePct,
        assessmentSummary.riskLevel
      ),
    [
      assessmentSummary.maturityPct,
      assessmentSummary.confidencePct,
      assessmentSummary.riskLevel,
    ]
  );

  const hierarchyData = useMemo(
    () => [
      {
        id: "sector-core",
        label: "CORE assessment scope",
        scorePct: assessmentSummary.maturityPct,
        answered: assessmentSummary.answered,
        total: assessmentSummary.total,
        areas: [
          {
            id: "area-priority",
            label: "Priority capability areas",
            scorePct: sortedCapabilities.length
              ? Math.round(
                  sortedCapabilities
                    .slice(0, 6)
                    .reduce((sum, item) => sum + item.scorePct, 0) /
                    Math.min(6, sortedCapabilities.length)
                )
              : 0,
            answered: Math.min(6, assessmentSummary.answered),
            total: Math.min(6, assessmentSummary.total),
            activities: [
              {
                id: "activity-lowest",
                label: "Lowest-scoring capability set",
                scorePct: sortedCapabilities.length
                  ? Math.round(
                      sortedCapabilities
                        .slice(0, 5)
                        .reduce((sum, item) => sum + item.scorePct, 0) /
                        Math.min(5, sortedCapabilities.length)
                    )
                  : 0,
                answered: Math.min(5, assessmentSummary.answered),
                total: Math.min(5, assessmentSummary.total),
                questions: sortedCapabilities.slice(0, 5).map((item) => ({
                  id: item.id,
                  label: item.label,
                  scorePct: item.scorePct,
                })),
              },
            ],
          },
        ],
      },
    ],
    [
      assessmentSummary.maturityPct,
      assessmentSummary.answered,
      assessmentSummary.total,
      sortedCapabilities,
    ]
  );

  const alignmentRows = useMemo(
    () =>
      sortedCapabilities.slice(0, 12).map((item) => {
        const alignment = getAlignmentForCapability(item.label);

        return {
          id: item.id,
          capability: item.label,
          scorePct: item.scorePct,
          coveragePct: assessmentSummary.completionPct,
          risk: getRiskLevel(item.scorePct, assessmentSummary.completionPct),
          iso: alignment.iso,
          gfmam: alignment.gfmam,
        };
      }),
    [sortedCapabilities, assessmentSummary.completionPct]
  );

  const exportPack = useMemo(
    () => buildExportPack({ assessmentSummary, alignmentRows }),
    [assessmentSummary, alignmentRows]
  );

  const topPriorityItems = assessmentSummary.nextBestActions.slice(0, 3);

  const radialNodes = useMemo<RadialNode[]>(() => {
    return domainResults.domains.flatMap((domain) => {
      const domainNode: RadialNode = {
        id: domain.id,
        label: domain.label,
        level: "domain",
        value: domain.score,
      };

      const elementNodes: RadialNode[] = domain.elements.map((element) => ({
        id: element.id,
        label: element.label,
        level: "element",
        parentId: domain.id,
        value: element.score,
      }));

      const capabilityNodes: RadialNode[] = domain.elements.flatMap((element) =>
        element.capabilities.map((capability) => ({
          id: capability.id,
          label: capability.label,
          level: "capability",
          parentId: element.id,
          value: capability.score,
        }))
      );

      return [domainNode, ...elementNodes, ...capabilityNodes];
    });
  }, [domainResults]);

  const [selectedRadialNodeId, setSelectedRadialNodeId] = useState<
    string | undefined
  >(undefined);

  const summaryInsights = useMemo(
    () =>
      getSummaryInsights({
        maturityPct: assessmentSummary.maturityPct,
        confidencePct: assessmentSummary.confidencePct,
        riskLevel: assessmentSummary.riskLevel,
      }),
    [
      assessmentSummary.maturityPct,
      assessmentSummary.confidencePct,
      assessmentSummary.riskLevel,
    ]
  );

  const [activeSummaryInsightKey, setActiveSummaryInsightKey] =
    useState<SummaryInsightKey>("position");

  const radarInsights = useMemo(() => getRadarInsights(), []);
  const [activeRadarInsightKey, setActiveRadarInsightKey] =
    useState<CapabilityRadarInsightKey | null>("current");

  const activeRadarInsight =
    radarInsights.find((item) => item.key === activeRadarInsightKey) ?? null;

  const activeSummaryInsight =
    summaryInsights.find((item) => item.key === activeSummaryInsightKey) ??
    summaryInsights[0];

  useEffect(() => {
    if (!radialNodes.length) return;

    if (!selectedRadialNodeId) {
      setSelectedRadialNodeId(
        radialNodes.find((node) => node.level === "domain")?.id
      );
      return;
    }

    const stillExists = radialNodes.some(
      (node) => node.id === selectedRadialNodeId
    );

    if (!stillExists) {
      setSelectedRadialNodeId(
        radialNodes.find((node) => node.level === "domain")?.id
      );
    }
  }, [radialNodes, selectedRadialNodeId]);

  const selectedRadialNode = useMemo(
    () => radialNodes.find((node) => node.id === selectedRadialNodeId),
    [radialNodes, selectedRadialNodeId]
  );

  const selectedRadialParent = useMemo(
    () =>
      selectedRadialNode?.parentId
        ? radialNodes.find((node) => node.id === selectedRadialNode.parentId)
        : undefined,
    [radialNodes, selectedRadialNode]
  );

  const selectedRadialChildren = useMemo(
    () =>
      selectedRadialNode
        ? radialNodes.filter((node) => node.parentId === selectedRadialNode.id)
        : [],
    [radialNodes, selectedRadialNode]
  );

  return (
    <div className="o-page">
      <header className="o-page-header o-results-page-header">
        <div className="o-page-header-main">
          <div className="o-results-page-header__copy">
            <div className="o-card-eyebrow">OASIS CORE™</div>
            <h1 className="o-page-title">{OASIS_CONFIG.core.name} Results</h1>
            <div className="o-page-tagline">
              Executive capability view and uplift priorities
            </div>
          </div>
        </div>

        <div className="o-page-subtitle">
          Structured diagnostic view of current capability position, assessment
          confidence, priority uplift areas, and the recommended sequence for
          improvement emerging from the current CORE assessment.
        </div>
      </header>

      <main className="o-page-grid">
        <section className="o-page-main">
          <div className="o-action-row" style={{ marginBottom: 18 }}>
            <button
              className="o-btn o-btn--secondary"
              onClick={() => navigate("/core/acma")}
            >
              Back to assessment
            </button>

            <button
              className="o-btn o-btn--secondary"
              onClick={() => {
                console.log("OASIS export pack", exportPack);
                alert("Export pack prepared. Check console for payload.");
              }}
            >
              Prepare export pack
            </button>

            <button
              className="o-btn o-btn--primary"
              onClick={() => navigate("/core/start")}
            >
              Start over
            </button>
          </div>

          <div className="o-card-stack">
            <section className="o-card o-card-pad o-results-hero">
              <div className="o-results-hero__top">
                <div className="o-results-hero__summary-column">
                  <div className="o-card-eyebrow">Executive summary</div>
                  <div className="o-results-hero__score">
                    {assessmentSummary.maturityPct}%
                  </div>
                  <div className="o-results-hero__band">
                    {getCapabilityLevel(assessmentSummary.maturityPct)} capability
                    position
                  </div>

                  <p className="o-text-body" style={{ marginTop: 14 }}>
                    {interpretation}
                  </p>

                  <div className="o-results-insight-stack o-results-insight-stack--hero">
                    <div className="o-results-hero__meta">
                     {summaryInsights.map((item) => (
                        <PatternMetricCard
                          key={item.key}
                          label={item.label}
                          value={item.value}
                          tone={item.tone}
                          active={activeSummaryInsightKey === item.key}
                          onClick={() => setActiveSummaryInsightKey(item.key)}
                        />
                      ))}
                    </div>

                    {!!activeSummaryInsight && (
                      <PatternInsightPanel
                        eyebrow={activeSummaryInsight.label}
                        title={activeSummaryInsight.detailTitle}
                        points={activeSummaryInsight.detailPoints}
                      />
                    )}

                    {!!activeRadarInsight && (
                      <PatternInsightPanel
                        eyebrow={activeRadarInsight.label}
                        title={activeRadarInsight.detailTitle}
                        points={activeRadarInsight.detailPoints}
                        className="o-pattern-insight--hero"
                      />
                    )}
                  </div>
                </div>

                <div className="o-results-radar-shell">
                  <div className="o-results-radar-shell__header">
                    <div>
                      <div className="o-card-eyebrow">Capability overview</div>
                      <p className="o-card-subtitle">
                        Comparative radar view of selected capability areas across
                        current, benchmark, target, and CORE positions.
                      </p>

                      <div className="o-results-radar-shell__metric-pill">
                        <span className="o-results-radar-shell__metric-label">
                          LCI™
                        </span>
                        <span className="o-results-radar-shell__metric-value">
                          {Math.round(domainResults.overallScorePct)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <CapabilityRadar
                    items={radarItems}
                    size={420}
                    onLegendSelect={(key) =>
                      setActiveRadarInsightKey((prev) =>
                        prev === key ? null : key
                      )
                    }
                    activeLegendKey={activeRadarInsightKey}
                  />
                </div>
              </div>
            </section>

            <section className="o-section-card">
              <div className="o-section-card__head">
                <div className="o-section-card__eyebrow">Near-term focus</div>
                <h2 className="o-section-card__title">Priority uplift areas</h2>
                <div className="o-section-card__subtitle">
                  The weakest current capability areas most likely to benefit
                  from near-term leadership focus.
                </div>
              </div>

              <div className="o-section-card__body">
                <div className="o-results-priority-grid">
                  {topPriorityItems.map((action, index) => (
                    <article
                      key={action.id}
                      className={[
                        "o-results-priority-item",
                        index === 0 ? "o-results-priority-item--focus" : "",
                      ].join(" ")}
                    >
                      <div className="o-results-priority-item__top">
                        <div className="o-results-priority-item__eyebrow">
                          Priority {index + 1}
                        </div>
                        <span
                          className={[
                            getPriorityPillClass(action.scorePct),
                            "o-results-priority-item__score-pill",
                          ].join(" ")}
                        >
                          {action.scorePct}%
                        </span>
                      </div>

                      <h3 className="o-results-priority-item__title">
                        {action.actionTitle}
                      </h3>

                      <div className="o-results-priority-item__meta">
                        {getCapabilityLevel(action.scorePct)} capability level
                      </div>

                      <p className="o-results-priority-item__body">
                        {action.rationale}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="o-card o-card-pad">
              <div className="o-results-section-header o-results-section-header--stacked">
                <div>
                  <div className="o-card-eyebrow">Interactive view</div>
                  <h2 className="o-section-heading">Executive capability view</h2>
                </div>
                <div className="o-text-small">
                  Interactive Organisation & Governance view showing rolled-up
                  capability position, grouped elements, and supporting
                  inspection detail.
                </div>
              </div>

              <div className="o-results-exec-grid">
                <div className="o-results-exec-grid__main">
                  <RadialEngine
                    nodes={radialNodes}
                    selectedNodeId={selectedRadialNodeId}
                    onSelectNode={setSelectedRadialNodeId}
                  />
                </div>

                <div className="o-results-exec-grid__aside">
                  <SelectedRadialSummaryPanel
                    node={selectedRadialNode}
                    parent={selectedRadialParent}
                    children={selectedRadialChildren}
                  />
                </div>
              </div>
            </section>

            <section className="o-card o-card-pad">
              <div className="o-results-section-header o-results-section-header--left">
                <div>
                  <div className="o-card-eyebrow">Capability ranking</div>
                  <h2 className="o-section-heading">
                    Ranked capability position
                  </h2>
                </div>
                <div className="o-text-small">
                  Capability areas ranked from lowest to highest current
                  position.
                </div>
              </div>

              <div className="o-domain-score-list">
                {sortedCapabilities.map((d) => (
                  <div key={d.id} className="o-domain-score-row">
                    <div className="o-domain-score-row__label">{d.label}</div>

                    <div className="o-domain-score-row__track">
                      <div
                        className="o-domain-score-row__fill"
                        style={{ width: `${Math.max(0, d.scorePct)}%` }}
                      />
                    </div>

                    <div className="o-domain-score-row__value">
                      {d.scorePct}% · {getCapabilityLevel(d.scorePct)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <ImprovementPathwayProgression
              title="Recommended uplift sequence"
              subtitle="Practical starting order for structured improvement based on current weakest capability positions."
              items={sortedCapabilities.map((item) => ({
                id: item.id,
                label: item.label,
                scorePct: item.scorePct,
              }))}
            />

            <CapabilityHierarchyPanel
              title="Capability hierarchy and traceability"
              subtitle="Trace current position from overall scope through priority areas, grouped activity layers, and underlying question-level signals."
              sectors={hierarchyData}
            />

            <AlignmentMatrixPanel
              title="Standards alignment and evidence view"
              subtitle="Maps current capability position to aligned ISO 55001 clauses and GFMAM subject areas to support executive interpretation and improvement planning."
              rows={alignmentRows}
            />
          </div>
        </section>

        <aside className="o-page-aside o-stack-md">
          <ContextAside
            eyebrow="Results context"
            title="How to read this"
            items={[
              {
                title: "Current position",
                body: "Represents the rolled-up enterprise capability baseline derived from completed responses.",
              },
              {
                title: "Assessment confidence",
                body: "Indicates how complete the assessment is, and therefore how reliable the current baseline is for interpretation.",
              },
              {
                title: "Priority uplift areas",
                body: "Highlights the lowest-scoring capability areas most likely to benefit from near-term executive attention.",
              },
              {
                title: "Executive capability view",
                body: "Shows how capability can be inspected visually and explored at element level rather than read only as static scores.",
              },
              {
                title: "Improvement sequence",
                body: "Provides a practical starting order for structured uplift based on the weakest current capability positions.",
              },
            ]}
          />

          {!!assessmentSummary.nextBestActions.length && (
            <section className="o-card o-card-pad o-results-priority-card">
              <div className="o-card-eyebrow">Priority focus</div>
              <h3 className="o-card-title--sm">Top improvement priorities</h3>

              <div className="o-signal-list" style={{ marginTop: 0 }}>
                {assessmentSummary.nextBestActions
                  .slice(0, 3)
                  .map((action, index) => (
                    <div key={action.id} className="o-signal-item">
                      <strong>Priority {index + 1}:</strong> {action.actionTitle}
                      <div style={{ marginTop: 4 }}>
                        Current position {action.scorePct}% ·{" "}
                        {getCapabilityLevel(action.scorePct)}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {!!assessmentSummary.pathway.length && (
            <section className="o-card o-card-pad o-results-pathway-card">
              <div className="o-card-eyebrow">Suggested uplift order</div>
              <h3 className="o-card-title--sm">Recommended next actions</h3>

              <div className="o-signal-list" style={{ marginTop: 0 }}>
                {assessmentSummary.pathway.map((step, index) => (
                  <div key={step.id} className="o-signal-item">
                    <strong>
                      {index + 1}. {step.label}
                    </strong>
                    <div style={{ marginTop: 4 }}>
                      Current position {step.scorePct}% ·{" "}
                      {getCapabilityLevel(step.scorePct)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="o-card o-card-pad">
            <div className="o-card-eyebrow">Executive note</div>
            <h3 className="o-card-title--sm">What this result means</h3>

            <div className="o-signal-list" style={{ marginTop: 0 }}>
              <div className="o-signal-item">
                The current result is a structural capability baseline, not a
                one-off maturity label.
              </div>
              <div className="o-signal-item">
                Lower-scoring areas indicate where leadership attention is likely
                to have the greatest near-term enterprise effect.
              </div>
              <div className="o-signal-item">
                The executive view should be read alongside confidence, ranked
                capability position, and the recommended uplift sequence.
              </div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}