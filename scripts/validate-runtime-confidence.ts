import assert from "node:assert/strict";

import {
  buildRuntimeConfidenceArchitecture,
  getRuntimeConfidenceActionPriority,
  runtimeConfidenceProbeQuestions,
} from "../src/core/runtime/runtimeConfidenceArchitecture.ts";

const unsupported = buildRuntimeConfidenceArchitecture({
  confidence: 0.25,
  evidenceCoverage: 25,
  hasEvidence: false,
});
assert.deepEqual(unsupported, {
  supportState: "unsupported",
  controlConditions: [],
  nextAction: "collect-evidence",
});

const sufficientButContested = buildRuntimeConfidenceArchitecture({
  confidence: 0.9,
  evidenceCoverage: 100,
  hasEvidence: true,
  controlConditions: ["contested"],
});
assert.deepEqual(sufficientButContested, {
  supportState: "sufficient",
  controlConditions: ["contested"],
  nextAction: "resolve-contestation",
});
assert.equal(
  getRuntimeConfidenceActionPriority(sufficientButContested),
  88,
);
assert.match(
  runtimeConfidenceProbeQuestions[
    sufficientButContested.nextAction
  ],
  /material conflict/,
);

const sufficientAfterChange = buildRuntimeConfidenceArchitecture({
  confidence: 0.9,
  evidenceCoverage: 100,
  hasEvidence: true,
  controlConditions: ["material-change"],
});
assert.deepEqual(sufficientAfterChange, {
  supportState: "sufficient",
  controlConditions: ["material-change"],
  nextAction: "run-change-detection",
});
assert.match(
  runtimeConfidenceProbeQuestions[
    sufficientAfterChange.nextAction
  ],
  /which claims are affected/,
);

const qualifiedLowApplicability = buildRuntimeConfidenceArchitecture({
  confidence: 0.55,
  evidenceCoverage: 100,
  hasEvidence: true,
  controlConditions: ["low-applicability"],
});
assert.deepEqual(qualifiedLowApplicability, {
  supportState: "qualified",
  controlConditions: ["low-applicability"],
  nextAction: "substantiate-limitation",
});
assert.match(
  runtimeConfidenceProbeQuestions[
    qualifiedLowApplicability.nextAction
  ],
  /applicability limitation/,
);

const sufficientButStale = buildRuntimeConfidenceArchitecture({
  confidence: 0.9,
  evidenceCoverage: 100,
  hasEvidence: true,
  controlConditions: ["stale"],
});
assert.deepEqual(sufficientButStale, {
  supportState: "sufficient",
  controlConditions: ["stale"],
  nextAction: "refresh-evidence",
});

const sufficientAndCurrent = buildRuntimeConfidenceArchitecture({
  confidence: 0.9,
  evidenceCoverage: 100,
  hasEvidence: true,
});
assert.deepEqual(sufficientAndCurrent, {
  supportState: "sufficient",
  controlConditions: [],
  nextAction: "monitor",
});
assert.equal(
  getRuntimeConfidenceActionPriority(sufficientAndCurrent),
  20,
);

console.log("Runtime confidence architecture validation passed.");
