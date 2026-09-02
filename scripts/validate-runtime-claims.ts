import assert from "node:assert/strict";

import {
  addControlConditionToClaims,
  applyPersistedClaimDecisions,
  getCurrentClaimDecision,
  requestEvidenceForClaim,
  submitEvidenceForWorkItem,
  synchroniseClaimsWithRuntime,
  verifyEvidenceForWorkItem,
} from "../src/core/runtime/runtimeClaimOrchestration";
import {
  createEmptyRuntimeClaimStore,
  createLocalRuntimeClaimRepository,
  RUNTIME_CLAIM_STORAGE_KEY,
} from "../src/core/runtime/runtimeClaimStore";
import { buildRuntimeActions } from "../src/core/runtime/buildRuntimeActions";

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const time = "2026-09-02T00:00:00.000Z";
const capabilities = {
  "claim-a-capability": {
    capabilityId: "claim-a-capability",
    confidenceArchitecture: {
      supportState: "unsupported" as const,
      controlConditions: [],
      nextAction: "collect-evidence" as const,
    },
  },
  "claim-b-capability": {
    capabilityId: "claim-b-capability",
    confidenceArchitecture: {
      supportState: "sufficient" as const,
      controlConditions: [],
      nextAction: "monitor" as const,
    },
  },
};

function createStore() {
  return synchroniseClaimsWithRuntime(
    createEmptyRuntimeClaimStore(time),
    capabilities,
    time,
  );
}

function submitForClaim(
  store: ReturnType<typeof createStore>,
  claimId: string,
  suffix: string,
) {
  const requested = requestEvidenceForClaim(
    store,
    claimId,
    `2026-09-02T00:01:0${suffix}.000Z`,
  );
  const workItem = requested.workItems.at(-1);
  assert.ok(workItem);
  const submitted = submitEvidenceForWorkItem(
    requested,
    workItem.id,
    {
      title: `Evidence ${suffix}`,
      evidenceType: "Assurance record",
      source: "Test authority",
      reference: `REF-${suffix}`,
      authorityNotes: "Test evidence awaiting verification.",
    },
    `2026-09-02T00:02:0${suffix}.000Z`,
  );
  return { submitted, workItemId: workItem.id };
}

// 1. Persistence survives reload and repository restart.
{
  const storage = new MemoryStorage();
  const repository = createLocalRuntimeClaimRepository({
    storage,
    now: () => time,
  });
  const store = createStore();
  repository.save(store);
  const restartedRepository = createLocalRuntimeClaimRepository({
    storage,
    now: () => time,
  });
  assert.deepEqual(restartedRepository.load().claims, store.claims);
}

// 2. Evidence for Claim A cannot change unlinked Claim B.
{
  const initial = createStore();
  const claimA = initial.claims[0];
  const claimB = initial.claims[1];
  const beforeB = structuredClone(claimB);
  const { submitted, workItemId } = submitForClaim(initial, claimA.id, "1");
  const verified = verifyEvidenceForWorkItem(
    submitted,
    workItemId,
    "2026-09-02T00:03:01.000Z",
  );
  assert.deepEqual(
    verified.claims.find((claim) => claim.id === claimB.id),
    beforeB,
  );
}

// 3. Submitted but unverified evidence cannot produce Sufficient.
{
  const initial = createStore();
  const claim = initial.claims[0];
  const { submitted } = submitForClaim(initial, claim.id, "2");
  assert.equal(
    getCurrentClaimDecision(
      submitted.claims.find((item) => item.id === claim.id)!,
    ).supportState,
    "unsupported",
  );
}

// 4. Contested remains an orthogonal control until resolution is verified.
{
  const base = addControlConditionToClaims(
    createStore(),
    ["claim-claim-b-capability"],
    "contested",
    "2026-09-02T00:04:00.000Z",
  );
  const claim = base.claims.find(
    (item) => item.id === "claim-claim-b-capability",
  )!;
  const decision = getCurrentClaimDecision(claim);
  assert.equal(decision.supportState, "sufficient");
  assert.deepEqual(decision.controlConditions, ["contested"]);
  assert.equal(decision.nextAction, "resolve-contestation");
}

// 5. Stale evidence produces refresh work for the linked claim only.
{
  const base = addControlConditionToClaims(
    createStore(),
    ["claim-claim-b-capability"],
    "stale",
    "2026-09-02T00:05:00.000Z",
  );
  const requested = requestEvidenceForClaim(
    base,
    "claim-claim-b-capability",
    "2026-09-02T00:05:01.000Z",
  );
  assert.equal(requested.workItems.length, 1);
  assert.equal(requested.workItems[0].requestedForAction, "refresh-evidence");
  assert.equal(requested.workItems[0].claimId, "claim-claim-b-capability");
}

// 6. Material change affects only explicitly identified claims.
{
  const initial = createStore();
  const unchanged = structuredClone(initial.claims[1]);
  const changed = addControlConditionToClaims(
    initial,
    [initial.claims[0].id],
    "material-change",
    "2026-09-02T00:06:00.000Z",
  );
  assert.equal(
    getCurrentClaimDecision(changed.claims[0]).nextAction,
    "run-change-detection",
  );
  assert.deepEqual(changed.claims[1], unchanged);
}

// 7. Low applicability requests substantiation.
{
  const initial = addControlConditionToClaims(
    createStore(),
    ["claim-claim-a-capability"],
    "low-applicability",
    "2026-09-02T00:07:00.000Z",
  );
  const requested = requestEvidenceForClaim(
    initial,
    "claim-claim-a-capability",
    "2026-09-02T00:07:01.000Z",
  );
  assert.equal(
    requested.workItems[0].requestedForAction,
    "substantiate-limitation",
  );
}

// 8. Verified evidence recalculates the linked claim and records a snapshot.
{
  const initial = createStore();
  const claim = initial.claims[0];
  const { submitted, workItemId } = submitForClaim(initial, claim.id, "3");
  const verified = verifyEvidenceForWorkItem(
    submitted,
    workItemId,
    "2026-09-02T00:08:00.000Z",
  );
  const updated = verified.claims.find((item) => item.id === claim.id)!;
  assert.equal(updated.decisionHistory.length, 2);
  assert.equal(getCurrentClaimDecision(updated).supportState, "qualified");
  assert.equal(verified.workItems[0].status, "verified");
  const claimAwareCapabilities = applyPersistedClaimDecisions(
    capabilities,
    verified.claims,
  );
  assert.equal(
    claimAwareCapabilities[claim.capabilityId]
      .confidenceArchitecture.supportState,
    "qualified",
  );
}

// 9. Previous decision snapshots remain unchanged and linked.
{
  const initial = createStore();
  const claim = initial.claims[0];
  const original = structuredClone(getCurrentClaimDecision(claim));
  const { submitted, workItemId } = submitForClaim(initial, claim.id, "4");
  const verified = verifyEvidenceForWorkItem(
    submitted,
    workItemId,
    "2026-09-02T00:09:00.000Z",
  );
  const updated = verified.claims[0];
  assert.deepEqual(updated.decisionHistory[0], original);
  assert.equal(
    updated.decisionHistory[1].previousSnapshotId,
    original.id,
  );
}

// 10. Older data migrates; invalid data is backed up and rejected safely.
{
  const storage = new MemoryStorage();
  storage.setItem(
    RUNTIME_CLAIM_STORAGE_KEY,
    JSON.stringify({ schemaVersion: 0, claims: [] }),
  );
  const repository = createLocalRuntimeClaimRepository({
    storage,
    now: () => time,
  });
  assert.equal(repository.load().schemaVersion, 1);

  storage.setItem(RUNTIME_CLAIM_STORAGE_KEY, "not-json");
  const recovered = repository.load();
  assert.match(recovered.recoveryNotice ?? "", /recoverable copy/);
  assert.ok(
    [...storage.values.keys()].some((key) =>
      key.startsWith(`${RUNTIME_CLAIM_STORAGE_KEY}.recovery.`),
    ),
  );
}

// 11. Existing action behavior remains valid without persisted claims.
{
  const actions = buildRuntimeActions({
    severity: {
      severity: "stable",
      label: "Stable Runtime State",
      summary: "Stable",
    },
    alerts: [],
    conflicts: [],
  });
  assert.deepEqual(actions, []);
}

console.log("Runtime claim persistence acceptance tests 1-11 passed.");
