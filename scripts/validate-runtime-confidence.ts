import assert from "node:assert/strict";

import { buildRuntimeConfidenceArchitecture } from "../src/core/runtime/runtimeConfidenceArchitecture.ts";

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

console.log("Runtime confidence architecture validation passed.");
