import { useEffect, useMemo, useState } from "react";
import { buildCapabilityInfluenceMap } from "./buildCapabilityInfluenceMap";
import { buildRuntimeNarrative } from "./runtimeNarrative";
import { buildEnterpriseAdaptiveProbe } from "./buildEnterpriseAdaptiveProbe";
import { FounderBackLink } from "../founder/FounderBackLink";
import { RadialRuntimeCanvas } from "../results/components/RadialRuntimeCanvas";
import { RuntimeActionQueuePanel } from "./RuntimeActionQueuePanel";
import { buildCollectionWorkflow } from "./buildCollectionWorkflow";
import { buildEnterpriseBeliefState } from "./buildEnterpriseBeliefState";
import { buildEvidenceRequirements } from "./buildEvidenceRequirements";
import { buildRuntimeAlerts } from "./buildRuntimeAlerts";
import { propagateRuntimeInfluence } from "./propagateRuntimeInfluence";
import { runtimeInformationGraph } from "./runtimeInformationGraph";
import { useRuntimeState } from "./useRuntimeState";
import { RuntimeEvidencePanel } from "./RuntimeEvidencePanel";
import { RuntimeCollectionWorkflowPanel } from "./RuntimeCollectionWorkflowPanel";

import type { RuntimeAttributeValue } from "./buildTrustScores";

const runtimeContext = {
  capabilityId: "risk-ownership",
  assetClass: "substation",
  criticality: "critical" as const,
  lifecyclePhase: "handover" as const,
  geography: "western-region",
};

const evidenceRequirements =
  buildEvidenceRequirements(runtimeContext);

const collectionWorkflow =
  buildCollectionWorkflow(runtimeContext, evidenceRequirements);

const runtimeAttributes: RuntimeAttributeValue[] = [
  {
    attribute: "geometry",
    source: "GIS - Esri ArcGIS",
    value: "SUB-001-POINT-A",
    sourceConfidence: 0.92,
  },
  {
    attribute: "geometry",
    source: "HANDOVER - Project Delivery",
    value: "SUB-001-DESIGN-POINT",
    sourceConfidence: 0.55,
  },
  {
    attribute: "condition",
    source: "FIELD - Manual Inspection",
    value: "Fair",
    sourceConfidence: 0.72,
  },
  {
    attribute: "condition",
    source: "AMS - SAP",
    value: "Good",
    sourceConfidence: 0.48,
  },
  {
    attribute: "financial-value",
    source: "ERP - SAP Finance",
    value: 1250000,
    sourceConfidence: 0.86,
  },
];

const informationGraph =
  runtimeInformationGraph(runtimeAttributes);

const links = [
  {
    sourceId: "gov-role-clarity",
    targetId: "gov-decision-rights",
    influence: 0.9,
  },
  {
    sourceId: "gov-decision-rights",
    targetId: "gov-escalation-governance",
    influence: 0.8,
  },
  {
    sourceId: "gov-escalation-governance",
    targetId: "risk-ownership",
    influence: 0.7,
  },
  {
    sourceId: "risk-ownership",
    targetId: "lifecycle-planning",
    influence: 0.65,
  },
  {
    sourceId: "lifecycle-planning",
    targetId: "info-asset-information-strategy",
    influence: 0.75,
  },
];

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 20,
        border: "1px solid rgba(96,165,250,0.16)",
        background: "rgba(15,23,42,0.78)",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: 12,
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#f8fafc",
          fontSize: 26,
          fontWeight: 850,
          marginBottom: 6,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: 12,
          lineHeight: 1.4,
        }}
      >
        {description}
      </div>
    </div>
  );
}

export function ExecutiveRuntimeDashboard() {
  const { runtime, mutate, enterpriseScore } = useRuntimeState();

  const [activeCapabilityId, setActiveCapabilityId] =
    useState<string | null>(null);

  useEffect(() => {
    mutate({
      capabilityId: "gov-role-clarity",
      answerId: "role-clarity-1",
      score: 35,
      confidence: 0.55,
      hasEvidence: true,
    });

    mutate({
      capabilityId: "gov-decision-rights",
      answerId: "decision-rights-1",
      score: 72,
      confidence: 0.9,
      hasEvidence: true,
    });

    mutate({
      capabilityId: "gov-escalation-governance",
      answerId: "escalation-1",
      score: 58,
      confidence: 0.55,
      hasEvidence: false,
    });

    mutate({
      capabilityId: "lifecycle-planning",
      answerId: "lifecycle-1",
      score: 84,
      confidence: 0.9,
      hasEvidence: true,
    });

    mutate({
      capabilityId: "risk-ownership",
      answerId: "risk-1",
      score: 28,
      confidence: 0.25,
      hasEvidence: false,
    });

    mutate({
      capabilityId: "info-asset-information-strategy",
      answerId: "info-1",
      score: 64,
      confidence: 0.55,
      hasEvidence: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const propagatedRuntime = propagateRuntimeInfluence(
    runtime,
    links,
  );

  const nodes = Object.entries(
    propagatedRuntime.capabilities,
  ).map(([id, capability]) => ({
    id,
    label: id.split("-").join(" "),
    score: capability.score,
    confidence: capability.confidence,
  }));

  const alerts = buildRuntimeAlerts(
    propagatedRuntime.triggers,
  );

  const enterpriseBeliefState =
    buildEnterpriseBeliefState({
      enterpriseScore,
      alerts,
      informationGraph,
    });

  const influenceMap = useMemo(() => {
    if (!activeCapabilityId) return null;

    return buildCapabilityInfluenceMap(activeCapabilityId, links);
  }, [activeCapabilityId]);

  const evidenceGapCount = Object.values(
    propagatedRuntime.capabilities,
  ).filter(
    (capability) => capability.evidenceCoverage < 50,
  ).length;

  const runtimeNarrative =
    buildRuntimeNarrative(influenceMap);

  const enterpriseProbe =
    buildEnterpriseAdaptiveProbe(
      enterpriseBeliefState.actionQueue.actions,
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 60%)",
        padding: 40,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        <FounderBackLink />

        <header
          style={{
            marginBottom: 28,
          }}
        >
          <div
            style={{
              color: "#93c5fd",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            OASIS Runtime Intelligence™
          </div>

          <h1
            style={{
              color: "#f8fafc",
              fontSize: 34,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Executive Runtime Dashboard
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 760,
              marginTop: 12,
            }}
          >
            A founder-facing runtime intelligence view showing capability health,
            operational strain, evidence confidence, and recommended action priorities.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5, minmax(0, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <SummaryCard
            title="Enterprise Score"
            value={Math.round(enterpriseScore)}
            description="Aggregated capability coherence"
          />

          <SummaryCard
            title="Belief State"
            value={enterpriseBeliefState.severity.severity.toUpperCase()}
            description={enterpriseBeliefState.severity.label}
          />

          <SummaryCard
            title="Active Risks"
            value={alerts.length}
            description="Runtime alerts requiring attention"
          />

          <SummaryCard
            title="Evidence Gaps"
            value={evidenceGapCount}
            description="Capabilities requiring stronger evidence"
          />

          <SummaryCard
            title="Conflicts"
            value={informationGraph.conflictCount}
            description="Cross-system information conflicts"
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 420px",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              height: 680,
              borderRadius: 28,
              border: "1px solid rgba(96,165,250,0.14)",
              background:
                "radial-gradient(circle at center, rgba(15,23,42,0.52), rgba(2,6,23,0.12))",
              overflow: "hidden",
              padding: 28,
              boxSizing: "border-box",
            }}
          >
            <RadialRuntimeCanvas
              nodes={nodes}
              links={links}
              enterpriseScore={enterpriseScore}
              activeCapabilityId={activeCapabilityId}
              relatedCapabilityIds={influenceMap?.related ?? []}
              onCapabilityFocus={setActiveCapabilityId}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              height: 680,
              overflowY: "auto",
              paddingRight: 8,
            }}
          >
            <div
              style={{
                padding: 18,
                borderRadius: 20,
                border: "1px solid rgba(251,191,36,0.35)",
                background: "rgba(15,23,42,0.86)",
                color: "#cbd5e1",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#fbbf24",
                  marginBottom: 8,
                }}
              >
                Enterprise Belief State
              </div>

              <div
                style={{
                  color: "#f8fafc",
                  fontWeight: 850,
                  fontSize: 18,
                  marginBottom: 8,
                }}
              >
                {enterpriseBeliefState.severity.label}
              </div>

              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {enterpriseBeliefState.summary}
              </div>
            </div>

            <RuntimeActionQueuePanel
              queue={enterpriseBeliefState.actionQueue}
            />
            {/* Runtime Focus card */}
            <div
                style={{
                    padding: 18,
                    borderRadius: 20,
                    border:
                    "1px solid rgba(96,165,250,0.24)",
                    background:
                    "rgba(15,23,42,0.82)",
                }}
                >
                <div
                    style={{
                    color: "#67e8f9",
                    fontSize: 12,
                    marginBottom: 8,
                    }}
                >
                    Runtime Focus
                </div>

                <div
                    style={{
                    color: "#cbd5e1",
                    fontSize: 13,
                    lineHeight: 1.6,
                    }}
                >
                    {runtimeNarrative ??
                    "Select a capability to inspect dependencies, downstream impact, and operational consequences."}
                </div>
            </div>
            {/* Recommended Probe card */}
            {enterpriseProbe ? (
                <div
                    style={{
                    padding: 18,
                    borderRadius: 20,
                    border:
                        "1px solid rgba(251,191,36,0.24)",
                    background:
                        "rgba(15,23,42,0.82)",
                    }}
                >
                    <div
                    style={{
                        color: "#fbbf24",
                        fontSize: 12,
                        marginBottom: 8,
                    }}
                    >
                    Recommended Probe
                    </div>

                    <div
                    style={{
                        color: "#f8fafc",
                        fontWeight: 700,
                        marginBottom: 8,
                    }}
                    >
                    {enterpriseProbe.reason}
                    </div>

                    <div
                    style={{
                        color: "#cbd5e1",
                        fontSize: 13,
                        lineHeight: 1.5,
                    }}
                    >
                    {enterpriseProbe.question}
                    </div>
                </div>
            ) : null}
            <RuntimeEvidencePanel
              requirements={evidenceRequirements}
            />

            <RuntimeCollectionWorkflowPanel
              workflow={collectionWorkflow}
            />
          </div>
        </section>
      </div>
    </main>
  );
}