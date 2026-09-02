import assert from "node:assert/strict";

import { buildRuntimeActions } from "../src/core/runtime/buildRuntimeActions";
import { buildRuntimeAlerts } from "../src/core/runtime/buildRuntimeAlerts";
import {
  buildFounderIntegratedAssessmentScenario,
  FOUNDER_ASSESSMENT_STORAGE_KEY,
} from "../src/core/runtime/founderIntegratedAssessmentScenario";
import {
  applyPersistedClaimDecisions,
  getCurrentClaimDecision,
  verifyEvidenceForWorkItem,
} from "../src/core/runtime/runtimeClaimOrchestration";
import { createLocalRuntimeClaimRepository } from "../src/core/runtime/runtimeClaimStore";

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const { runtime, store } = buildFounderIntegratedAssessmentScenario();
const decision = (claimId: string) =>
  getCurrentClaimDecision(store.claims.find((claim) => claim.id === claimId)!);

assert.equal(store.claims.length, 6, "six linked capability claims are present");
assert.equal(decision("claim-gov-role-clarity").supportState, "qualified");
assert.deepEqual(decision("claim-gov-role-clarity").controlConditions, ["contested"]);
assert.equal(decision("claim-gov-decision-rights").supportState, "sufficient");
assert.equal(decision("claim-gov-escalation-governance").supportState, "provisional");
assert.equal(decision("claim-risk-ownership").supportState, "unsupported");
assert.deepEqual(decision("claim-lifecycle-planning").controlConditions, ["stale"]);
assert.deepEqual(
  decision("claim-info-asset-information-strategy").controlConditions,
  ["material-change"],
);

const sharedEvidenceLinks = store.links.filter(
  (link) => link.evidenceId === "evidence-northstar-operating-model",
);
assert.deepEqual(
  new Set(sharedEvidenceLinks.map((link) => link.claimId)),
  new Set(["claim-gov-role-clarity", "claim-gov-decision-rights"]),
  "the operating model is shared by exactly two claims",
);

const expectedWorkActions = new Set([
  "resolve-contestation",
  "strengthen-evidence",
  "collect-evidence",
  "refresh-evidence",
  "run-change-detection",
]);
assert.deepEqual(
  new Set(store.workItems.map((item) => item.requestedForAction)),
  expectedWorkActions,
  "work is targeted to each claim's current action",
);
assert.equal(
  store.workItems.find((item) => item.claimId === "claim-risk-ownership")?.status,
  "submitted",
  "submitted draft evidence does not silently become verified",
);

for (const claimId of [
  "claim-gov-role-clarity",
  "claim-lifecycle-planning",
  "claim-info-asset-information-strategy",
]) {
  assert.equal(
    store.claims.find((claim) => claim.id === claimId)?.decisionHistory.length,
    2,
    `${claimId} retains its control-condition transition`,
  );
}

const storage = new MemoryStorage();
const repository = createLocalRuntimeClaimRepository({
  storage,
  key: FOUNDER_ASSESSMENT_STORAGE_KEY,
  now: () => "2026-09-02T03:00:00.000Z",
});
repository.save(store);
assert.deepEqual(repository.load().claims, store.claims, "reload retains decisions");
const restartedRepository = createLocalRuntimeClaimRepository({
  storage,
  key: FOUNDER_ASSESSMENT_STORAGE_KEY,
  now: () => "2026-09-02T03:01:00.000Z",
});
assert.deepEqual(
  restartedRepository.load().evidenceRecords,
  store.evidenceRecords,
  "repository restart retains evidence",
);

const riskWorkItem = store.workItems.find(
  (item) => item.claimId === "claim-risk-ownership",
)!;
const unrelatedBefore = new Map(
  store.claims
    .filter((claim) => claim.id !== "claim-risk-ownership")
    .map((claim) => [claim.id, structuredClone(claim)]),
);
const verified = verifyEvidenceForWorkItem(
  store,
  riskWorkItem.id,
  "2026-09-02T03:02:00.000Z",
);
const verifiedRisk = verified.claims.find(
  (claim) => claim.id === "claim-risk-ownership",
)!;
assert.equal(getCurrentClaimDecision(verifiedRisk).supportState, "qualified");
assert.equal(verifiedRisk.decisionHistory.length, 2);
for (const [claimId, untouched] of unrelatedBefore) {
  assert.deepEqual(
    verified.claims.find((claim) => claim.id === claimId),
    untouched,
    `${claimId} was not recalculated when risk evidence was verified`,
  );
}
restartedRepository.save(verified);
assert.equal(
  getCurrentClaimDecision(
    restartedRepository.load().claims.find(
      (claim) => claim.id === "claim-risk-ownership",
    )!,
  ).supportState,
  "qualified",
  "verified decision survives a second restart",
);

const claimAwareCapabilities = applyPersistedClaimDecisions(
  runtime.capabilities,
  verified.claims,
);
const alerts = buildRuntimeAlerts(runtime.triggers, claimAwareCapabilities);
const actions = buildRuntimeActions({
  severity: {
    severity: "degraded",
    label: "Degraded Runtime State",
    summary: "Integrated sandpit assessment",
  },
  alerts,
  conflicts: [],
  capabilities: claimAwareCapabilities,
});
const actionTitles = actions.map((action) => action.title);
for (const expected of [
  "Resolve material conflict",
  "Refresh affected evidence",
  "Run targeted change detection",
  "Strengthen evidence",
]) {
  assert.ok(actionTitles.includes(expected), `Runtime recommends: ${expected}`);
}
assert.ok(alerts.every((alert) => alert.confidenceArchitecture));

console.log(
  JSON.stringify(
    {
      scenario: "Northstar Regional Utilities substation handover",
      claims: verified.claims.length,
      evidenceRecords: verified.evidenceRecords.length,
      sharedEvidenceLinks: sharedEvidenceLinks.length,
      targetedWorkItems: verified.workItems.length,
      alerts: alerts.length,
      actions: actionTitles,
      persistenceRestarts: 2,
      isolationChecks: unrelatedBefore.size,
      result: "PASS",
    },
    null,
    2,
  ),
);
