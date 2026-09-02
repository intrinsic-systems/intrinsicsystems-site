import {
  buildRuntimeConfidenceArchitecture,
  runtimeConfidenceLabels,
  type RuntimeConfidenceArchitecture,
  type RuntimeControlCondition,
  type RuntimeNextAction,
} from "./runtimeConfidenceArchitecture";
import {
  RUNTIME_CLAIM_POLICY_VERSION,
  RUNTIME_CLAIM_SCHEMA_VERSION,
  type ClaimDecisionSnapshot,
  type ClaimEvidenceLink,
  type EvidenceWorkItem,
  type RuntimeClaim,
  type RuntimeClaimStore,
  type RuntimeEvidenceRecord,
} from "./claimEvidenceTypes";

type RuntimeCapabilityDecision = {
  capabilityId: string;
  confidenceArchitecture: RuntimeConfidenceArchitecture;
};

const CLAIM_STATEMENTS: Record<string, string> = {
  "gov-role-clarity":
    "Governance, delivery, operations and assurance roles are clearly defined and understood.",
  "gov-decision-rights":
    "Decision rights are assigned at the appropriate organisational level.",
  "gov-escalation-governance":
    "Material issues follow a defined and accountable escalation path.",
  "risk-ownership":
    "Material operational risks have an accountable and active owner.",
  "lifecycle-planning":
    "Asset lifecycle decisions use current operational and condition evidence.",
  "info-asset-information-strategy":
    "Asset information is governed as an operational decision-making resource.",
};

const CONTROL_RESOLUTION: Partial<
  Record<RuntimeNextAction, RuntimeControlCondition>
> = {
  "resolve-contestation": "contested",
  "refresh-evidence": "stale",
  "substantiate-limitation": "low-applicability",
  "run-change-detection": "material-change",
};

function nextId(
  prefix: string,
  store: RuntimeClaimStore,
  now: string,
) {
  const total =
    store.claims.length +
    store.evidenceRecords.length +
    store.links.length +
    store.workItems.length +
    store.auditEvents.length;
  return `${prefix}-${now.replace(/[^0-9]/g, "")}-${total + 1}`;
}

function createDecisionSnapshot({
  store,
  claimId,
  architecture,
  reason,
  evidenceIds,
  previousSnapshotId,
  now,
}: {
  store: RuntimeClaimStore;
  claimId: string;
  architecture: RuntimeConfidenceArchitecture;
  reason: string;
  evidenceIds: string[];
  previousSnapshotId?: string;
  now: string;
}): ClaimDecisionSnapshot {
  return {
    id: `${nextId("decision", store, now)}-${claimId}`,
    claimId,
    ...architecture,
    reason,
    evidenceIds,
    recordedAt: now,
    ...(previousSnapshotId ? { previousSnapshotId } : {}),
    schemaVersion: RUNTIME_CLAIM_SCHEMA_VERSION,
    policyVersion: RUNTIME_CLAIM_POLICY_VERSION,
  };
}

export function getCurrentClaimDecision(
  claim: RuntimeClaim,
): ClaimDecisionSnapshot {
  return (
    claim.decisionHistory.find(
      (decision) => decision.id === claim.currentDecisionId,
    ) ?? claim.decisionHistory[claim.decisionHistory.length - 1]
  );
}

export function applyPersistedClaimDecisions<
  T extends RuntimeCapabilityDecision,
>(
  capabilities: Record<string, T>,
  claims: RuntimeClaim[],
): Record<string, T> {
  const next = { ...capabilities };

  claims.forEach((claim) => {
    const capability = next[claim.capabilityId];
    if (!capability) return;
    const decision = getCurrentClaimDecision(claim);

    next[claim.capabilityId] = {
      ...capability,
      confidenceArchitecture: {
        supportState: decision.supportState,
        controlConditions: [...decision.controlConditions],
        nextAction: decision.nextAction,
      },
    };
  });

  return next;
}

function decisionsEqual(
  left: RuntimeConfidenceArchitecture,
  right: RuntimeConfidenceArchitecture,
) {
  return (
    left.supportState === right.supportState &&
    left.nextAction === right.nextAction &&
    left.controlConditions.join("|") ===
      right.controlConditions.join("|")
  );
}

export function synchroniseClaimsWithRuntime(
  store: RuntimeClaimStore,
  capabilities: Record<string, RuntimeCapabilityDecision>,
  now = new Date().toISOString(),
): RuntimeClaimStore {
  let changed = false;
  let nextStore = store;

  Object.values(capabilities).forEach((capability) => {
    const claimId = `claim-${capability.capabilityId}`;
    const existing = nextStore.claims.find(
      (claim) => claim.id === claimId,
    );

    if (!existing) {
      const decision = createDecisionSnapshot({
        store: nextStore,
        claimId,
        architecture: capability.confidenceArchitecture,
        reason: "Initial claim decision derived from the Runtime capability state.",
        evidenceIds: [],
        now,
      });
      const claim: RuntimeClaim = {
        id: claimId,
        capabilityId: capability.capabilityId,
        statement:
          CLAIM_STATEMENTS[capability.capabilityId] ??
          `The ${capability.capabilityId.split("-").join(" ")} capability is supported by current operational evidence.`,
        applicability: "Applies to the current founder Runtime scenario.",
        assuranceSignificance:
          capability.capabilityId === "risk-ownership"
            ? "critical"
            : "material",
        currentDecisionId: decision.id,
        decisionHistory: [decision],
        createdAt: now,
        updatedAt: now,
      };

      nextStore = {
        ...nextStore,
        claims: [...nextStore.claims, claim],
      };
      changed = true;
      return;
    }

    const current = getCurrentClaimDecision(existing);
    if (
      current &&
      !decisionsEqual(current, capability.confidenceArchitecture) &&
      existing.decisionHistory.length === 1 &&
      current.reason.startsWith("Initial claim decision")
    ) {
      const decision = createDecisionSnapshot({
        store: nextStore,
        claimId,
        architecture: capability.confidenceArchitecture,
        reason: "Runtime capability state changed before claim evidence work began.",
        evidenceIds: current.evidenceIds,
        previousSnapshotId: current.id,
        now,
      });
      nextStore = {
        ...nextStore,
        claims: nextStore.claims.map((claim) =>
          claim.id === claimId
            ? {
                ...claim,
                currentDecisionId: decision.id,
                decisionHistory: [...claim.decisionHistory, decision],
                updatedAt: now,
              }
            : claim,
        ),
      };
      changed = true;
    }
  });

  return changed
    ? { ...nextStore, lastSavedAt: now }
    : store;
}

const WORK_ITEM_COPY: Record<
  RuntimeNextAction,
  { title: string; reason: string }
> = {
  "collect-evidence": {
    title: "Establish initial claim evidence",
    reason: "The claim is unsupported and needs an initial evidential basis.",
  },
  "strengthen-evidence": {
    title: "Strengthen the current evidence base",
    reason: "Additional verified evidence is required to increase support.",
  },
  "resolve-contestation": {
    title: "Resolve the material evidence conflict",
    reason: "The claim is contested and the authoritative position must be established.",
  },
  "refresh-evidence": {
    title: "Refresh affected evidence",
    reason: "The linked evidence is stale and must be refreshed before reliance.",
  },
  "substantiate-limitation": {
    title: "Substantiate the applicability limitation",
    reason: "The claimed limitation requires evidence before enquiry can be deferred.",
  },
  "run-change-detection": {
    title: "Run targeted claim change detection",
    reason: "A material change requires targeted revalidation of this claim.",
  },
  monitor: {
    title: "Monitor the supported claim",
    reason: "No immediate evidence intervention is required.",
  },
};

export function requestEvidenceForClaim(
  store: RuntimeClaimStore,
  claimId: string,
  now = new Date().toISOString(),
): RuntimeClaimStore {
  const claim = store.claims.find((item) => item.id === claimId);
  if (!claim) return store;
  const decision = getCurrentClaimDecision(claim);
  const copy = WORK_ITEM_COPY[decision.nextAction];
  const workItem: EvidenceWorkItem = {
    id: nextId("work", store, now),
    claimId,
    title: copy.title,
    reason: `${copy.reason} Claim: ${claim.statement}`,
    owner: "Founder review",
    status: decision.nextAction === "monitor" ? "in-progress" : "requested",
    requestedForAction: decision.nextAction,
    createdAt: now,
    updatedAt: now,
  };

  return {
    ...store,
    workItems: [...store.workItems, workItem],
    auditEvents: [
      ...store.auditEvents,
      {
        id: nextId("audit", store, now),
        entityType: "work-item",
        entityId: workItem.id,
        action: "requested",
        summary: `Created targeted evidence work for ${claim.id}.`,
        nextValue: workItem.status,
        recordedAt: now,
      },
    ],
    lastSavedAt: now,
  };
}

export function submitEvidenceForWorkItem(
  store: RuntimeClaimStore,
  workItemId: string,
  evidenceInput: Pick<
    RuntimeEvidenceRecord,
    "title" | "evidenceType" | "source" | "reference" | "authorityNotes"
  >,
  now = new Date().toISOString(),
): RuntimeClaimStore {
  const workItem = store.workItems.find(
    (item) => item.id === workItemId,
  );
  if (
    !workItem ||
    workItem.evidenceId ||
    !["requested", "in-progress"].includes(workItem.status)
  ) {
    return store;
  }

  const evidence: RuntimeEvidenceRecord = {
    id: nextId("evidence", store, now),
    ...evidenceInput,
    verificationStatus: "submitted",
    collectedAt: now,
  };
  const link: ClaimEvidenceLink = {
    id: nextId("link", store, `${now}-link`),
    claimId: workItem.claimId,
    evidenceId: evidence.id,
    relationship: "supports",
    materiality: "material",
    condition: "current",
    linkedAt: now,
  };

  return {
    ...store,
    evidenceRecords: [...store.evidenceRecords, evidence],
    links: [...store.links, link],
    workItems: store.workItems.map((item) =>
      item.id === workItemId
        ? {
            ...item,
            status: "submitted",
            evidenceId: evidence.id,
            updatedAt: now,
          }
        : item,
    ),
    auditEvents: [
      ...store.auditEvents,
      {
        id: nextId("audit", store, `${now}-submitted`),
        entityType: "evidence",
        entityId: evidence.id,
        action: "submitted",
        summary: `Submitted evidence for ${workItem.claimId}; verification is still required.`,
        nextValue: "submitted",
        recordedAt: now,
      },
    ],
    lastSavedAt: now,
  };
}

export function setEvidenceWorkItemStatus(
  store: RuntimeClaimStore,
  workItemId: string,
  status: "in-progress" | "rejected" | "expired",
  now = new Date().toISOString(),
): RuntimeClaimStore {
  const workItem = store.workItems.find(
    (item) => item.id === workItemId,
  );
  if (!workItem || workItem.status === "verified") return store;

  return {
    ...store,
    workItems: store.workItems.map((item) =>
      item.id === workItemId
        ? { ...item, status, updatedAt: now }
        : item,
    ),
    evidenceRecords: store.evidenceRecords.map((evidence) =>
      evidence.id === workItem.evidenceId && status !== "in-progress"
        ? { ...evidence, verificationStatus: status }
        : evidence,
    ),
    auditEvents: [
      ...store.auditEvents,
      {
        id: nextId("audit", store, `${now}-${status}`),
        entityType: "work-item",
        entityId: workItemId,
        action: status,
        summary: `Evidence work status changed from ${workItem.status} to ${status}.`,
        previousValue: workItem.status,
        nextValue: status,
        recordedAt: now,
      },
    ],
    lastSavedAt: now,
  };
}

function recalculateLinkedClaim(
  store: RuntimeClaimStore,
  claim: RuntimeClaim,
  workItem: EvidenceWorkItem,
  evidenceId: string,
  now: string,
): RuntimeClaim {
  const current = getCurrentClaimDecision(claim);
  const verifiedEvidenceIds = store.links
    .filter(
      (link) =>
        link.claimId === claim.id &&
        link.relationship === "supports" &&
        store.evidenceRecords.some(
          (evidence) =>
            evidence.id === link.evidenceId &&
            (evidence.id === evidenceId ||
              evidence.verificationStatus === "verified"),
        ),
    )
    .map((link) => link.evidenceId);

  const resolvedCondition =
    CONTROL_RESOLUTION[workItem.requestedForAction];
  const controlConditions = current.controlConditions.filter(
    (condition) => condition !== resolvedCondition,
  );
  const architecture = buildRuntimeConfidenceArchitecture({
    confidence: verifiedEvidenceIds.length >= 2 ? 0.86 : 0.68,
    evidenceCoverage: verifiedEvidenceIds.length >= 2 ? 100 : 70,
    hasEvidence: verifiedEvidenceIds.length > 0,
    controlConditions,
  });
  const snapshot = createDecisionSnapshot({
    store,
    claimId: claim.id,
    architecture,
    reason: `Verified evidence changed the claim decision after ${runtimeConfidenceLabels.nextAction[workItem.requestedForAction].toLowerCase()}.`,
    evidenceIds: verifiedEvidenceIds,
    previousSnapshotId: current.id,
    now,
  });

  return {
    ...claim,
    currentDecisionId: snapshot.id,
    decisionHistory: [...claim.decisionHistory, snapshot],
    updatedAt: now,
  };
}

export function verifyEvidenceForWorkItem(
  store: RuntimeClaimStore,
  workItemId: string,
  now = new Date().toISOString(),
): RuntimeClaimStore {
  const workItem = store.workItems.find(
    (item) => item.id === workItemId,
  );
  if (!workItem?.evidenceId || workItem.status !== "submitted") {
    return store;
  }

  const evidenceId = workItem.evidenceId;
  const linkedClaimIds = new Set(
    store.links
      .filter((link) => link.evidenceId === evidenceId)
      .map((link) => link.claimId),
  );
  const evidenceRecords = store.evidenceRecords.map((evidence) =>
    evidence.id === evidenceId
      ? {
          ...evidence,
          verificationStatus: "verified" as const,
          reviewedAt: now,
        }
      : evidence,
  );
  const storeWithVerifiedEvidence = {
    ...store,
    evidenceRecords,
  };
  const claims = store.claims.map((claim) =>
    linkedClaimIds.has(claim.id)
      ? recalculateLinkedClaim(
          storeWithVerifiedEvidence,
          claim,
          workItem,
          evidenceId,
          now,
        )
      : claim,
  );

  return {
    ...storeWithVerifiedEvidence,
    claims,
    workItems: store.workItems.map((item) =>
      item.id === workItemId
        ? { ...item, status: "verified", updatedAt: now }
        : item,
    ),
    auditEvents: [
      ...store.auditEvents,
      {
        id: nextId("audit", store, `${now}-verified`),
        entityType: "evidence",
        entityId: evidenceId,
        action: "verified",
        summary: `Verified evidence and recalculated ${linkedClaimIds.size} explicitly linked claim(s).`,
        previousValue: "submitted",
        nextValue: "verified",
        recordedAt: now,
      },
    ],
    lastSavedAt: now,
  };
}

export function addControlConditionToClaims(
  store: RuntimeClaimStore,
  claimIds: string[],
  condition: RuntimeControlCondition,
  now = new Date().toISOString(),
): RuntimeClaimStore {
  const affected = new Set(claimIds);

  return {
    ...store,
    claims: store.claims.map((claim) => {
      if (!affected.has(claim.id)) return claim;
      const current = getCurrentClaimDecision(claim);
      const architecture = buildRuntimeConfidenceArchitecture({
        confidence:
          current.supportState === "sufficient" ? 0.9 : 0.6,
        evidenceCoverage:
          current.supportState === "sufficient" ? 100 : 70,
        hasEvidence: current.supportState !== "unsupported",
        controlConditions: [
          ...current.controlConditions,
          condition,
        ],
      });
      const snapshot = createDecisionSnapshot({
        store,
        claimId: claim.id,
        architecture,
        reason: `Applied ${condition} control to the specifically affected claim.`,
        evidenceIds: current.evidenceIds,
        previousSnapshotId: current.id,
        now,
      });
      return {
        ...claim,
        currentDecisionId: snapshot.id,
        decisionHistory: [...claim.decisionHistory, snapshot],
        updatedAt: now,
      };
    }),
    lastSavedAt: now,
  };
}
