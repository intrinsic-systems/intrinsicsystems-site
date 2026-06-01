import { useEffect, useMemo, useState } from "react";
import { RadialRuntimeCanvas } from "../../results/components/RadialRuntimeCanvas";

import { RuntimeAlertsPanel } from "../../runtime/RuntimeAlertsPanel";
import { RuntimeCollectionWorkflowPanel } from "../../runtime/RuntimeCollectionWorkflowPanel";
import { RuntimeEvidencePanel } from "../../runtime/RuntimeEvidencePanel";
import { RuntimeInformationPanel } from "../../runtime/RuntimeInformationPanel";

import { RuntimeActionQueuePanel } from "../../runtime/RuntimeActionQueuePanel";

import { RuntimeWorkspace } from "../../runtime/RuntimeWorkspace";
import { RuntimePrimaryPanel } from "../../runtime/RuntimePrimaryPanel";
import { RuntimeSidebar } from "../../runtime/RuntimeSidebar";
import { RuntimeInsightStack } from "../../runtime/RuntimeInsightStack";

import { buildCollectionWorkflow } from "../../runtime/buildCollectionWorkflow";
import { buildEvidenceRequirements } from "../../runtime/buildEvidenceRequirements";
import { buildRuntimeAlerts } from "../../runtime/buildRuntimeAlerts";
import { propagateRuntimeInfluence } from "../../runtime/propagateRuntimeInfluence";
import { runtimeInformationGraph } from "../../runtime/runtimeInformationGraph";
import { runtimeQuestionRouter } from "../../runtime/runtimeQuestionRouter";
import { useRuntimeState } from "../../runtime/useRuntimeState";

import type { RuntimeAttributeValue } from "../../runtime/buildTrustScores";

import { buildCapabilityInfluenceMap } from "../../runtime/buildCapabilityInfluenceMap";
import { buildRuntimeNarrative } from "../../runtime/runtimeNarrative";

import { buildEnterpriseBeliefState } from "../../runtime/buildEnterpriseBeliefState";

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

export function RuntimeMutationPreview() {
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

  const propagatedRuntime = propagateRuntimeInfluence(
    runtime,
    links,
  );

  const influenceMap = useMemo(() => {
    if (!activeCapabilityId) {
      return null;
    }

    return buildCapabilityInfluenceMap(
      activeCapabilityId,
      links,
    );
  }, [activeCapabilityId, links]);

  const runtimeNarrative =
    buildRuntimeNarrative(influenceMap);

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

  const questionRouting =
    runtimeQuestionRouter(propagatedRuntime);

  return (
    <RuntimeWorkspace>
      <RuntimePrimaryPanel>
        <RadialRuntimeCanvas
          nodes={nodes}
          links={links}
          enterpriseScore={enterpriseScore}
          activeCapabilityId={activeCapabilityId}
          relatedCapabilityIds={influenceMap?.related ?? []}
          onCapabilityFocus={setActiveCapabilityId}
        />
      </RuntimePrimaryPanel>

      <RuntimeSidebar>
        <RuntimeInsightStack>
          <div
            style={{
              padding: 16,
              borderRadius: 18,
              border: "1px solid rgba(96,165,250,0.22)",
              background: "rgba(15,23,42,0.86)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#93c5fd",
                marginBottom: 8,
              }}
            >
              CORE Runtime Preview
            </div>

            <div
              style={{
                color: "#f8fafc",
                fontSize: 18,
                fontWeight: 800,
                marginBottom: 8,
              }}
            >
              Operational Truth Intelligence
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              Live runtime view showing capability strain, adaptive probes,
              required evidence, collection workflow, and cross-system trust
              review.
            </div>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 16,
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
                fontWeight: 800,
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

          <div
            style={{
              padding: 16,
              borderRadius: 16,
              border: "1px solid rgba(14,165,233,0.35)",
              background: "rgba(15,23,42,0.82)",
              color: "#cbd5e1",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#67e8f9",
                marginBottom: 8,
              }}
            >
              Runtime Focus
            </div>

            <div
              style={{
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {runtimeNarrative}
            </div>
          </div>

          <RuntimeAlertsPanel alerts={alerts} />

          {questionRouting.next ? (
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(96,165,250,0.6)",
                background: "rgba(15,23,42,0.82)",
                color: "#e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#93c5fd",
                  marginBottom: 8,
                }}
              >
                Next Adaptive Probe
              </div>

              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {questionRouting.next.reason}
              </div>

              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#cbd5e1",
                }}
              >
                {questionRouting.next.question}
              </div>
            </div>
          ) : null}

          <RuntimeEvidencePanel
            requirements={evidenceRequirements}
          />

          <RuntimeCollectionWorkflowPanel
            workflow={collectionWorkflow}
          />

          <RuntimeInformationPanel
            graph={informationGraph}
          />
        </RuntimeInsightStack>
      </RuntimeSidebar>
    </RuntimeWorkspace>
  );
}