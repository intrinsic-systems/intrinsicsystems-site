import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { OASIS_CONFIG } from "../../config/oasisConfig";
import { PageIntro } from "../../core/PageIntro";
import { ContextAside } from "../../core/ContextAside";

import { ImprovementPathwayProgression } from "../results/ImprovementPathwayProgression";
import { CapabilityHierarchyPanel } from "../results/CapabilityHierarchyPanel";
import { AlignmentMatrixPanel } from "../results/AlignmentMatrixPanel";

import OrgGovExecutiveView from "../../features/oasis/org-gov/OrgGovExecutiveView";

import { getCapabilityLevel } from "../../core/results/capabilityScale";

import { buildAssessmentSummary } from "../../acma/acmaAssessmentSummary";
import {
  getAlignmentForCapability,
  getRiskLevel,
} from "../../acma/alignmentConfig";

import type { CoreFlowContextValue } from "../CoreFlowShell";
import { buildExportPack } from "../../acma/buildExportPack";

export function CoreResultsRoute() {
  const navigate = useNavigate();
  const { answers } = useOutletContext<CoreFlowContextValue>();

  const assessmentSummary = useMemo(
    () => buildAssessmentSummary(answers),
    [answers]
  );

  const sortedCapabilities = useMemo(
    () =>
      [...assessmentSummary.capabilityScores].sort(
        (a, b) => a.scorePct - b.scorePct
      ),
    [assessmentSummary.capabilityScores]
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

  return (
    <div className="o-page">
      <header className="o-page-header" style={{ marginBottom: 28 }}>
        <div className="o-page-header-main">
          <h1 className="o-page-title">{OASIS_CONFIG.core.name} Results</h1>
          <div className="o-page-tagline">
            Enterprise capability position and uplift priorities
          </div>
        </div>

        <div className="o-page-subtitle">
          Review current enterprise capability position, uplift pressure points,
          completion confidence, and the practical sequence for structured
          improvement emerging from the current CORE assessment.
        </div>
      </header>

      <main className="o-page-grid">
        <section className="o-page-main">
          <PageIntro
            title="Capability results"
            summary="This view provides a consolidated picture of current capability baseline, completion confidence, executive capability structure, uplift priorities, and the practical sequence for structured improvement emerging from the current CORE assessment."
          />

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
            <section className="o-card o-card-pad">
              <div className="o-results-section-header">
                <h2 className="o-section-heading">
                  Capability position & uplift priorities
                </h2>
                <div className="o-text-small" style={{ marginTop: 8 }}>
                  Low scores with strong completion indicate genuine capability
                  constraints. Lower confidence suggests results should be
                  interpreted with greater caution.
                </div>
                <div className="o-text-small">
                  Lowest-scoring capabilities, uplift pressure points, and the
                  current baseline pattern across the assessment scope.
                </div>
              </div>

              <div className="o-results-position-grid">
                <div className="o-results-position-panel">
                  <div className="o-text-label">Current position</div>
                  <div className="o-results-position-score">
                    {assessmentSummary.maturityPct}%
                  </div>
                  <div className="o-text-body">
                    Current enterprise capability baseline derived from completed
                    responses.
                  </div>
                </div>

                <div className="o-results-position-panel">
                  <div className="o-text-label">Completion confidence</div>
                  <div className="o-results-position-score">
                    {assessmentSummary.confidencePct}%
                  </div>
                  <div className="o-text-body">
                    Indicates how reliable the current baseline is based on
                    available response coverage.
                  </div>
                </div>

                <div className="o-results-position-panel">
                  <div className="o-text-label">Current risk signal</div>
                  <div className="o-results-position-score">
                    {assessmentSummary.riskLevel}
                  </div>
                  <div className="o-text-body">
                    Executive risk view based on current capability position and
                    confidence.
                  </div>
                </div>

                <div className="o-results-position-panel">
                  <div className="o-text-label">Immediate uplift pressure</div>
                  <div className="o-results-position-score">
                    {assessmentSummary.nextBestActions.length}
                  </div>
                  <div className="o-text-body">
                    Capability areas requiring near-term uplift focus.
                  </div>
                </div>
              </div>

              <div className="o-divider-subtle" />

              <div className="o-results-two-col">
                <div>
                  <div className="o-text-label" style={{ marginBottom: 8 }}>
                    Lowest-scoring capabilities
                  </div>

                  <div className="o-opportunity-list">
                    {assessmentSummary.nextBestActions.map((action, index) => (
                      <div key={action.id} className="o-opportunity-item">
                        <div>
                          <div className="o-opportunity-item__title">
                            Priority {index + 1}: {action.actionTitle}
                          </div>
                          <div className="o-opportunity-item__sub">
                            Current score {action.scorePct}% ·{" "}
                            {getCapabilityLevel(action.scorePct)} capability
                            level · {action.rationale}
                          </div>
                        </div>

                        <span className="o-priority-chip">
                          {action.scorePct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="o-text-label" style={{ marginBottom: 8 }}>
                    Capability level bands
                  </div>

                  <div className="o-results-band-stack">
                    <div className="o-results-band o-results-band--critical">
                      <strong>Initial · 0–10%</strong>
                      <span>
                        Capability is minimal, reactive, or not yet established.
                      </span>
                    </div>

                    <div className="o-results-band o-results-band--watch">
                      <strong>Aware · 10–25%</strong>
                      <span>
                        Capability is recognised but inconsistent and weakly
                        embedded.
                      </span>
                    </div>

                    <div className="o-results-band o-results-band--watch">
                      <strong>Developing · 25–45%</strong>
                      <span>
                        Capability is emerging with partial structure and uneven
                        application.
                      </span>
                    </div>

                    <div className="o-results-band o-results-band--moderate">
                      <strong>Competent · 45–65%</strong>
                      <span>
                        Capability is established and functioning at an
                        operational level.
                      </span>
                    </div>

                    <div className="o-results-band o-results-band--strong">
                      <strong>Optimising · 65–85%</strong>
                      <span>
                        Capability is well embedded, measured, and improving with
                        intent.
                      </span>
                    </div>

                    <div className="o-results-band o-results-band--strong">
                      <strong>Leading · 85–100%</strong>
                      <span>
                        Capability is strong, integrated, and operating at a
                        leading level.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="o-card o-card-pad">
              <div className="o-results-section-header">
                <h2 className="o-section-heading">Executive capability view</h2>
                <div className="o-text-small">
                  Interactive enterprise capability view showing hierarchical
                  structure, element-level drivers, and evidence-aware
                  inspection.
                </div>
                <div className="o-text-small">
                  Current MVP implementation is detailed for Organisation &
                  Governance and establishes the pattern for broader enterprise
                  rollout.
                </div>
              </div>

              <OrgGovExecutiveView
                embedded
                results={{
                  maturityPct: assessmentSummary.maturityPct,
                  confidencePct: assessmentSummary.confidencePct,
                  capabilityScores: assessmentSummary.capabilityScores,
                }}
              />
            </section>

            <section className="o-card o-card-pad">
              <div className="o-results-section-header">
                <h2 className="o-section-heading">Ranked capability position</h2>
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
                        style={{
                          width: `${Math.max(0, d.scorePct)}%`,
                        }}
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
              items={sortedCapabilities.map((item) => ({
                id: item.id,
                label: item.label,
                scorePct: item.scorePct,
              }))}
            />

            <CapabilityHierarchyPanel sectors={hierarchyData} />

            <AlignmentMatrixPanel rows={alignmentRows} />
          </div>
        </section>

        <div className="o-stack-md">
          <ContextAside
            eyebrow="Results context"
            title="How to Read This"
            items={[
              {
                title: "Baseline position",
                body:
                  "Represents the rolled-up enterprise capability position derived from the current response set.",
              },
              {
                title: "Completion confidence",
                body:
                  "Indicates how complete the current assessment is, and therefore how reliable the baseline position is for interpretation.",
              },
              {
                title: "Priority opportunities",
                body:
                  "Highlights the lowest-scoring capability areas most likely to benefit from focused near-term uplift.",
              },
              {
                title: "Improvement pathway",
                body:
                  "Shows the practical starting sequence for structured improvement based on the weakest current capabilities.",
              },
              {
                title: "Progression model",
                body:
                  "Groups capability areas into practical capability bands so the sequence from early formation to stronger integration can be understood at a glance.",
              },
            ]}
          />

          {!!assessmentSummary.nextBestActions.length && (
            <aside className="o-card o-page-aside o-card-pad o-results-priority-card">
              <div className="o-text-label">Priority focus</div>

              <h3
                style={{
                  fontSize: 15,
                  margin: "6px 0 12px",
                }}
              >
                Top 3 improvement priorities
              </h3>

              <div className="o-signal-list" style={{ marginTop: 0 }}>
                {assessmentSummary.nextBestActions.map((action, index) => (
                  <div key={action.id} className="o-signal-item">
                    <strong>Priority {index + 1}:</strong> {action.actionTitle} —
                    current score {action.scorePct}% ·{" "}
                    {getCapabilityLevel(action.scorePct)} · {action.rationale}
                  </div>
                ))}
              </div>
            </aside>
          )}

          {!!assessmentSummary.pathway.length && (
            <aside className="o-card o-page-aside o-card-pad o-results-pathway-card">
              <div className="o-text-label">Improvement sequence</div>

              <h3
                style={{
                  fontSize: 15,
                  margin: "6px 0 12px",
                }}
              >
                Suggested uplift order
              </h3>

              <div className="o-signal-list" style={{ marginTop: 0 }}>
                {assessmentSummary.pathway.map((step, index) => (
                  <div key={step.id} className="o-signal-item">
                    <strong>
                      {index + 1}. {step.label}
                    </strong>{" "}
                    — current score {step.scorePct}% ·{" "}
                    {getCapabilityLevel(step.scorePct)} · {step.rationale}
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}