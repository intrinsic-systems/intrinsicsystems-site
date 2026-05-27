import { useEffect } from "react";
import { RadialRuntimeCanvas } from "../../results/components/RadialRuntimeCanvas";
import { useRuntimeState } from "../../runtime/useRuntimeState";
import { propagateRuntimeInfluence } from "../../runtime/propagateRuntimeInfluence";
import { buildRuntimeAlerts } from "../../runtime/buildRuntimeAlerts";
import { RuntimeAlertsPanel } from "../../runtime/RuntimeAlertsPanel";
import { runtimeQuestionRouter } from "../../runtime/runtimeQuestionRouter";
import { buildEvidenceRequirements } from "../../runtime/buildEvidenceRequirements";
import { RuntimeEvidencePanel } from "../../runtime/RuntimeEvidencePanel";
import { buildCollectionWorkflow } from "../../runtime/buildCollectionWorkflow";
import { RuntimeCollectionWorkflowPanel } from "../../runtime/RuntimeCollectionWorkflowPanel";

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
  buildCollectionWorkflow(
    runtimeContext,
    evidenceRequirements,
  );

export function RuntimeMutationPreview() {
  const { runtime, mutate, enterpriseScore } = useRuntimeState();

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

  const propagatedRuntime = propagateRuntimeInfluence(runtime, links);

  const nodes = Object.entries(propagatedRuntime.capabilities).map(
    ([id, capability]) => ({
      id,
      label: id.split("-").join(" "),
      score: capability.score,
      confidence: capability.confidence,
    }),
  );

  const alerts = buildRuntimeAlerts(
    propagatedRuntime.triggers,
  );

  const questionRouting = runtimeQuestionRouter(
    propagatedRuntime,
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 60%)",
        padding: 48,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <RadialRuntimeCanvas
          nodes={nodes}
          links={links}
          enterpriseScore={enterpriseScore}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <RuntimeAlertsPanel alerts={alerts} />

          {questionRouting.next ? (
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(96,165,250,0.6)",
                background: "rgba(15,23,42,0.82)",
                color: "#e2e8f0",
                maxWidth: 380,
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
        </div>
      </div>
    </main>
  );
}